import $ from './constants'
import hiveMind from './hiveMind'
import PriorityQueue from './PriorityQueue'

const TYPE_SOURCE = 0
const TYPE_TARGET = 1

/**
 * If creep has finished a task, Overlord should be able to re-add it to the
 * queue if he wants
 */

const CONSTRUCTION_SITE = 999

const PRIOS = {
  [STRUCTURE_SPAWN]: 1000,
  [STRUCTURE_EXTENSION]: 1100,
  [STRUCTURE_TOWER]: 1200,
  [STRUCTURE_LINK]: 1800,
  [CONSTRUCTION_SITE]: 1900,
  [STRUCTURE_STORAGE]: 2000,
  [STRUCTURE_CONTROLLER]: 9000,
  [STRUCTURE_CONTAINER]: 10000,
};

class Overlord {
  constructor(roomName) {
    this.room = Game.rooms[roomName]
    // Basic unit to quantify how many tasks the container can serve per amount.
    // Should be generalized into a room-wide calculation, depending on the
    // creeps CARRY-Amount
    //
    // Or just add an amount to every task and sum it that way
    this.creepCarryAmount = 450
    this.maxItemsPerTask = 20
  }

  update = (queues)=> {

    this.defend()
    this.existingItems = hiveMind.allForRoom(this.room)

    this.spawn()

    if(queues[WORK]) {
      this.work(queues[WORK])
    }
    if(queues[CARRY]) {
      this.carry(queues[CARRY])
    }
    if(queues[$.EXCAVATE]) {
      this.excavate(queues[$.EXCAVATE])
    }

    this.remote(queues)
  }

  /**
   * @var itemData {
   *    kind: [Calcs body from that],
   *    memory: [Puts into creeds memory, doesnt need kind]
   *  }
   */
  spawn = ()=> {
    // Explicit Spawns
    let queue = this.room.queue($.SPAWN)
    if(queue && queue.itemCount() > 0) {
      let spawningSpawns = []
      while(queue.peek()) {
        let queueItem = queue.peek()
        let data = hiveMind.data[queueItem.id]
        let body = []
        if(data.kind === $.KIND_INFESTOR) {
          // FIXME: Hardcoded INFESTOR STUFF
          body = [WORK, WORK, WORK, WORK, WORK, MOVE, MOVE, MOVE]
          // body = [MOVE]
        }
        else {
          body = (data.body) ?
            data.body : this.calcCreepBody($.ZERG_PARTS_TEMPLATES[data.kind])
        }
        let spawns = this.room.spawns(
          (s)=> s.canCreateCreep(body) === OK && !spawningSpawns.includes(s)
        )
        if(spawns.length) {
          let memory = (data.memory) ? data.memory : {role: $.ROLE_ZERG}
          if(!memory.kind) { memory.kind = data.kind }
          log.green(`Creating creep with mem ${JSON.stringify(memory)}`)
          let res = spawns[0].createCreep(
            body, `${data.kind}${this.newCreepIndex()}`, memory
          )
          spawningSpawns.push(spawns[0])
          if(typeof res === 'string') {
            queue.dequeue()
            hiveMind.remove(queueItem.id)
          }
          else {
            console.log("Spawn noped", res)
          }
        }
        else {
          break;
        }
      }
    }
  }

  newCreepIndex = function() {
    let index = Memory.creepIndex
    Memory.creepIndex += 1
    return index
  }

  work = (queue)=> {

    // let targetData = this.findWorkTargetFor(RESOURCE_ENERGY)
    // console.log('targetData', JSON.stringify(targetData))

    let conSites = this.room.find(FIND_CONSTRUCTION_SITES)
    if(conSites.length > 0) {
      for(let conSite of conSites) {
        let targetItems = _.filter(this.existingItems, (item)=> (
          _.get(item, ['toTarget', 'id']) == conSite.id
        ))
        let ullage = conSite.progressTotal -
          (conSite.progress + _.sum(targetItems, (t)=> t.toTarget.amount))
        let itemCount = targetItems.length
        let amount = (
          (ullage < this.creepCarryAmount) ? ullage : this.creepCarryAmount
        )
        while(ullage > 0 && itemCount < this.maxItemsPerTask) {
          this.addItem(
            queue, false, conSite, RESOURCE_ENERGY, amount,
            PRIOS[CONSTRUCTION_SITE]
          )
          itemCount += 1
          ullage -= amount
        }
      }
    }

    let controllers = this.room.find(
      FIND_STRUCTURES, {filter: {structureType: STRUCTURE_CONTROLLER}}
    )
    if(controllers) {
        let controller = controllers[0]
        let targetItems = _.filter(this.existingItems, (item)=> (
          _.get(item, ['toTarget', 'id']) == controller.id
        ))
        let itemCount = targetItems.length
        while(itemCount < this.maxItemsPerTask) {
          this.addItem(
            queue, false, controller, RESOURCE_ENERGY, this.creepCarryAmount,
            PRIOS[STRUCTURE_CONTROLLER]
          )
          itemCount += 1
        }
    }

    // let storages = this.room.find(
    //   FIND_STRUCTURES, {filter: this.filterNonVoidEnergyStorage}
    // )
    // if(storages.length > 0) {
    //   let storage = storages[0]
    //   this.genSourceTasks(storage, queue, WORK)
    // }
    // let containers = this.room.find(
    //   FIND_STRUCTURES, {filter: this.filterNonVoidEnergyContainers}
    // )
    // if(containers.length > 0) {
    //   containers.forEach((container)=> {
    //     this.genSourceTasks(container, queue, WORK)
    //   })
    // }
  }

  carry = (queue)=> {

    // targetData = this.findCarryTargetFor(RESOURCE_ENERGY)

    // Find the targets that need stuff and generate tasks for them
    let lacking = this.room.find(
      FIND_MY_STRUCTURES, {filter: (structure)=> (
        (
          structure.structureType == STRUCTURE_SPAWN ||
          structure.structureType == STRUCTURE_EXTENSION ||
          structure.structureType == STRUCTURE_TOWER
        ) &&
        structure.energy < structure.energyCapacity
    )})
    if(
      this.room.memory.links &&
      this.room.memory.links.sources &&
      this.room.memory.links.sources.length > 0
    ) {
      lacking = lacking.concat(
        this.room.memory.links.sources.map(
          (source)=> Game.getObjectById(source)
        )
      )
    }
    if(lacking.length > 0) {
      // lacking = _.sortByOrder(lacking, 'energy', 'asc')
      for(let target of lacking) {
        this.genTargetCarryTasksFor(
          target, queue, RESOURCE_ENERGY, PRIOS[target.structureType]
        )
      }
    }

    // Find the targets that have stuff and generate tasks for them
    let sources = this.room.find(FIND_DROPPED_RESOURCES)
    sources = sources.concat(this.room.find(
      FIND_STRUCTURES, {filter: this.filterNonVoidEnergyContainers}
    ))
    sources = sources.concat(this.room.find(
      FIND_STRUCTURES, {filter: this.filterNonVoidEnergyContainers}
    ))
    if(sources.length) {
      for(let source of sources) {
        this.genSourceTasks(
          source, queue, CARRY, {dontFindTarget: true}
        )
      }
    }

    /// TODO Add A passive queue?!?!

    // let links = this.room.find(FIND_MY_STRUCTURES, {filter: (struc)=> (
    //   struc.structureType == STRUCTURE_LINK &&
    //   struc.energy > 0 &&
    //   this.room.memory.links.providers.includes(struc.id)
    // )})
    // if(sources.length) {
    //   for(let source of sources) {
    //     this.genSourceTasks(
    //       source, queue, CARRY, {dontFindTarget: true}
    //     )
    //   }
    // }
  }

  genTargetCarryTasksFor = (target, queue, resType, prio)=> {
    let current = (target.store) ? _.sum(target.store) : target.energy
    let max = (target.storeCapacity) ?
      target.storeCapacity : target.energyCapacity

    let targetItems = _.filter(this.existingItems, (item)=> (
      _.get(item, ['toTarget', 'id']) == target.id
    ))
    let itemLength = targetItems.length
    let existingAddAmount = targetItems.length * this.creepCarryAmount
    let ullage = max - (current + existingAddAmount)

    while(ullage > 0 && itemLength < this.maxItemsPerTask) {
      let targetAmount = (this.creepCarryAmount < ullage) ?
        this.creepCarryAmount : ullage
      this.addItem(queue, false, target, resType, targetAmount, prio)
      ullage -= targetAmount
      itemLength += 1
    }
  }

  genTargetControllerTasks = (controller, queue)=> {
    let targetItems = _.filter(this.existingItems, (item)=> (
      item.toTarget.id == controller.id
    ))
    let itemLength = targetItems.length
    let existingAddAmount = targetItems.length * this.creepCarryAmount

    while(itemLength < this.maxItemsPerTask) {
      let targetAmount = this.creepCarryAmount
      this.addItem(queue, false, controller, resType, targetAmount, PRIO)
      itemLength += 1
    }
  }

  /**
   * Generates taskItems for the given source
   *
   * Checks how many items need to be generated to void the source and tries
   * to find targets for every task of it.
   * If a target cant be found for the resource, this task will not be
   * generated.
   */
  genSourceTasks = (source, queue, taskType, options = {})=> {
    let dontFindTarget = options.dontFindTarget || false
    let sourceItems = _.filter(this.existingItems, (item)=> (
      item.fromSource && item.fromSource.id == source.id &&
      item.stage != TYPE_TARGET
    ))
    let existingDrawAmount = _.sum(sourceItems, 'fromSource.amount')
    let stillStored = 0
    if(source.store) {
      stillStored = source.store[RESOURCE_ENERGY] - existingDrawAmount
    }
    else {
      stillStored = source.amount - existingDrawAmount
    }
    let itemCount = sourceItems.length
    while(
      stillStored > this.creepCarryAmount && itemCount < this.maxItemsPerTask
    ) {
      let targetData = null
      if(taskType == CARRY && !dontFindTarget) {
        targetData = this.findCarryTargetFor(source, RESOURCE_ENERGY)
      }
      else if(taskType == WORK && !dontFindTarget) {
        targetData = this.findWorkTargetFor(source, RESOURCE_ENERGY)
      }

      let target = false
      let prio = 6666
      if(targetData && targetData.target) {
        target = targetData.target
        prio = targetData.prio
      }
      else if(dontFindTarget) {

      }
      else {
        break // No suitable target found
      }
      this.addItem(
        queue, source, target, RESOURCE_ENERGY, this.creepCarryAmount,
        prio
      )
      stillStored -= this.creepCarryAmount
      itemCount += 1
    }
  }

  /**
   * Generates one taskItem for the given source and returns it
   *
   * Checks how many items need to be generated to void the source and tries
   * to find a target for an item.
   * If a target cant be found for the resource, this task will not be
   * generated.
   */
  genSourceTask = (source, queue, taskType)=> {
    let sourceItems = _.filter(this.existingItems, (item)=> (
      item.fromSource && item.fromSource.id == source.id &&
      item.stage != TYPE_TARGET
    ))
    let existingDrawAmount = _.sum(sourceItems, 'fromSource.amount')
    let stillStored = 0
    if(source.store) {
      stillStored = source.store[RESOURCE_ENERGY] - existingDrawAmount
    }
    else {
      stillStored = source.amount - existingDrawAmount
    }
    let itemCount = sourceItems.length
    if(
      stillStored > this.creepCarryAmount && itemCount < this.maxItemsPerTask
    ) {
      let targetData = null
      if(taskType == CARRY) {
        targetData = this.findCarryTargetFor(source, RESOURCE_ENERGY)
      }
      else if(taskType == WORK) {
        targetData = this.findWorkTargetFor(source, RESOURCE_ENERGY)
      }
      if(targetData && targetData.target) {
        let {target, prio} = targetData
        console.log(
          `Adding target: ${JSON.stringify(target.pos)} at ${Game.time}.`
        )
        let res = this.addItem(
          queue, source, target, RESOURCE_ENERGY, this.creepCarryAmount,
          prio
        )
        stillStored -= this.creepCarryAmount
        itemCount += 1
        return res
      }
      else {
        // No suitable target found
      }
    }
  }

  findWorkTargetFor = (source, resType)=> {
    if(resType != RESOURCE_ENERGY) { return false }

    let construction = this.findTargetConstructionFor(source, resType)
    if(construction) {
      return {target: construction, prio: PRIOS[CONSTRUCTION_SITE]}
    }

    // Controller get handled by the work queue
    // let controller = this.findTargetControllerFor(source, resType)
    // if(controller) {
    //   return {target: controller, prio: PRIOS[STRUCTURE_CONTROLLER]}
    // }
  }

  findTargetConstructionFor = (source)=> {
    let conSites = this.room.find(FIND_CONSTRUCTION_SITES)
    if(conSites.length) { return conSites[0] }
  }

  findCarryTargetFor = (source, resType)=> {
    // Everything not handled by genTargetCarryTasksFor

    let storage = this.findTargetStorageFor(source, resType)
    if(storage) { return {target: storage, prio: PRIOS[STRUCTURE_STORAGE]} }

    return {target: null, prio: null}
  }

  findTargetSpawnFor = (source, resType)=> {
    if(resType != RESOURCE_ENERGY) { return false }

    let spawns = this.room.find(
      FIND_MY_STRUCTURES, {filter: (structure)=> (
        structure.structureType == STRUCTURE_SPAWN &&
        structure.energy < structure.energyCapacity
    )})
    if(spawns.length > 0) {
      spawns = _.sortByOrder(spawns, 'energy', 'asc')
      for(let spawn of spawns) {
        let spawnItems = _.filter(this.existingItems, (item)=> (
          _.get(item, ['toTarget', 'id']) == spawn.id
        ))
        let existingAddAmount = spawnItems.length * this.creepCarryAmount
        let ullage = spawn.energyCapacity - (spawn.energy + existingAddAmount)
        if(ullage > 0) { return spawn }
      }
    }
  }

  /**
   * Dont forget: Extensions can have 100 / 200 energyCapacity on higher levels
   */
  findTargetExtensionFor = (source, resType)=> {
    if(resType != RESOURCE_ENERGY) { return false }

    let extensions = this.room.find(
      FIND_MY_STRUCTURES, {filter: (structure)=> (
        structure.structureType == STRUCTURE_EXTENSION &&
        structure.energy < structure.energyCapacity
    )})
    if(extensions.length > 0) {
      extensions = _.sortByOrder(extensions, 'energy', 'asc')
      for(let extension of extensions) {
        let extensionItems = _.filter(this.existingItems, (item)=> (
          _.get(item, ['toTarget', 'id']) == extension.id
        ))
        let existingAddAmount = extensionItems.length * this.creepCarryAmount
        let ullage = (
          extension.energyCapacity - (extension.energy + existingAddAmount)
        )
        if(ullage > 0) { return extension }
      }
    }
  }

  findTargetTowerFor = (source, resType)=> {
    if(resType != RESOURCE_ENERGY) { return false }

    let towers = this.room.find(
      FIND_MY_STRUCTURES, {filter: (structure)=> (
        structure.structureType == STRUCTURE_TOWER &&
        structure.energy < structure.energyCapacity
    )})
    if(towers.length > 0) {
      towers = _.sortByOrder(towers, 'energy', 'asc')
      for(let tower of towers) {
        let towerItems = _.filter(this.existingItems, (item)=> (
          _.get(item, ['toTarget', 'id']) == tower.id
        ))
        let existingAddAmount = towerItems.length * this.creepCarryAmount
        let ullage = (
          tower.energyCapacity - (tower.energy + existingAddAmount)
        )
        if(ullage > 0) { return tower }
      }
    }
  }

  findTargetStorageFor = (source, resType)=> {

    let storages = this.room.find(
      FIND_MY_STRUCTURES, {filter: (structure)=> (
        structure.structureType == STRUCTURE_STORAGE &&
        _.sum(structure.store) < structure.storeCapacity
    )})
    if(storages.length > 0) {
      let storage = storages[0]
      let storageItems = _.filter(this.existingItems, (item)=> (
        _.get(item, ['toTarget', 'id']) == storage.id
      ))
      let existingAddAmount = storageItems.length * this.creepCarryAmount
      let ullage = (
        storage.storeCapacity - (_.sum(storage.store) + existingAddAmount)
      )
      if(ullage > 0) { return storage }
    }
  }


  filterNonVoidEnergyContainers = (object)=> (
    object.structureType == STRUCTURE_CONTAINER &&
    object.store[RESOURCE_ENERGY] > this.creepCarryAmount
  )

  filterNonVoidEnergyStorage = (object)=> (
    object.structureType == STRUCTURE_STORAGE &&
    object.store[RESOURCE_ENERGY] > 1000
  )

  addItem = (queue, source, target, res, targetAmount, priority)=> {
    let data = {
      res: res,
      stage: null,
      assigned: false,
      byRoomName: this.room.name
    }
    if(target) {
      data['toTarget'] = {
        id: target.id,
        x: target.pos.x,
        y: target.pos.y,
        roomName: target.pos.roomName,
        amount: targetAmount,
        // amount: (target.amount !== null) ? target.amount : this.creepCarryAmount,
      }
    }
    if(source) {
      data['fromSource'] = {
        id: source.id,
        x: source.pos.x,
        y: source.pos.y,
        roomName: source.pos.roomName,
        // amount: (source.amount !== null) ? source.amount : this.creepCarryAmount,
      }
    }
    let itemId = hiveMind.push(data)
    let queueData = {id: itemId, prio: priority}
    if(queue) {
      queue.queue(queueData)
    }
    this.existingItems = hiveMind.allForRoom(this.room)
    return queueData
  }

  cleanupTasks = (queues)=> {
    this.existingItems = hiveMind.allForRoom(this.room)
    let itemExists = null
    for(let item of this.existingItems) {
      itemIsUsed = false
      for(let queueName in queues) {
        if(queues[queueName].hasEntryWithId(item.id)) {
          itemIsUsed = true; break
        }
      }
      if(itemIsUsed) { continue }
      for(let creepName in Game.creeps) {
        let creep = Game.creeps[creepName]
        if(creep.memory.item && creep.memory.item.id == item.id) {
          itemIsUsed = true; break
        }
      }
      if(itemIsUsed) { continue }

      // Item-Id found nowhere
      hiveMind.remove(item.id)
    }
  }

  /**
   * Items that can be used to satisfy the demands of a target
   * Eg items that only have a source
   */
  getFloatingItems = (queue, customFilter = null)=> {
    let filter = null
    if(customFilter != null) {
     filter = (q)=> {
        let item = hiveMind.data[q.id];
        return (
          item && !item.toTarget && !item.assigned && item.fromSource &&
          customFilter(q, item)
        )
      }
    }
    else {
      filter = (q)=> {
        let item = hiveMind.data[q.id];
        return (item && !item.toTarget && item.fromSource && !item.assigned)
      }
    }
    return queue.filter(filter)
  }

  /**
   * @param hiveAccessor - for example ['fromSource', 'id']
   */
  applyPathCostToQueueRating = (
    startPosition, queueData, hiveAccessor, modifier = 1.0
  )=> {
    return _.compact(queueData.map((data)=> {
      let objectDescriptor = _.get(hiveMind.data[data.id], hiveAccessor)
      let obj = Game.getObjectById(_.get(objectDescriptor, 'id'))
      if(!obj) {
        if(
          objectDescriptor.roomName && !
          Game.rooms[objectDescriptor.roomName]
        ) {
          // No info on object, return some very high path
          return {id: data.id, prio: data['prio'] + (20000 * modifier)}
        }
        else {
          // We can see its room, but it isnt there
          return null
        }
        return {id: data.id, prio: data['prio'] + (pathLength * modifier)}
      }
      let pathLength = startPosition.findPathTo(obj).length
      return {id: data.id, prio: data['prio'] + (pathLength * modifier)}
    }))
  }

  findSourceForCreep = (creep, item, resType)=> {

    let queue = this.room.queue(CARRY)
    let queueItems = this.getFloatingItems(queue, (queueItem, item)=> (
      resType === item.res && (
        !_.get(item.toTarget, 'amount') ||
        item.toTarget.amount <= item.fromSource.amount
      )
    ))
    let gameItems = queueItems.map(
      (q)=> Game.getObjectById(hiveMind.data[q.id].fromSource.id)
    )
    let pathAdjustedQueue = new PriorityQueue(
      this.applyPathCostToQueueRating(creep.pos, queueItems, 'fromSource')
    )
    let queueItem = pathAdjustedQueue.dequeue()
    if(queueItem) {
      hiveMind.data[creep.memory.item.id].fromSource =
        hiveMind.data[queueItem.id].fromSource
      hiveMind.data[creep.memory.item.id].assigned = true
      let itemData = hiveMind.data[creep.memory.item.id]
      if(itemData.fromSource && !itemData.fromSource.amount) {
        itemData.fromSource.amount = creep.carryCapacity
      }
      queue.removeBy({id: queueItem.id}) // Keep original queue in sync
      hiveMind.remove(queueItem.id)
      return true
    }

    // Try dropped resources first
    let droppedViableRes = creep.room.find(
      FIND_DROPPED_RESOURCES,
      {filter: (res)=> (
        res.resourceType == resType &&
        res.amount > item.toTarget.amount &&
        res.amount > _.sum(
          _.filter(this.existingItems, (item)=> (
            item.fromSource.id == res.id
          )), 'fromSource.amount'
        ) + item.toTarget.amount
      )}
    )
    if(droppedViableRes.length) {

      // FIXME THIS IS THE ROOT OF THE FRIGGIN PROBLEMS! FIX IT
      // This is why all the creeps go to the same source
      return creep.pos.findClosestByPath(droppedViableRes)
    }

    // HAAACKS
    if(this.room.memory.connectedRemoteRooms) {
      for(let remoteName in this.room.memory.connectedRemoteRooms) {
        let data = this.room.memory.connectedRemoteRooms[remoteName]
        if(data.parsed) {
          if(Game.rooms[remoteName]) {
            let room = Game.rooms[remoteName]
            let sources = room.find(
              FIND_DROPPED_RESOURCES,
              {filter: (res)=> (
                res.resourceType == resType &&
                res.amount > item.toTarget.amount &&
                res.amount > _.sum(
                  _.filter(this.existingItems, (item)=> (
                    item.fromSource.id == res.id
                  )), 'fromSource.amount'
                ) + item.toTarget.amount + 1500 // HAAACKS
              )}
            )
            if(sources.length > 0) {
              return sources[0]
              // return creep.pos.findClosestByPath(sources)
            }
          }
        }
      }
    }


    // Try Container or storage
    let structures = this.room.find(
      FIND_STRUCTURES, {filter: (struc)=> (
        (
          struc.structureType == STRUCTURE_CONTAINER ||
          struc.structureType == STRUCTURE_STORAGE
        ) &&
        // The sum of the existing items amount for this structure
        // (console.log('EXISTING ITEMS',
        // struc.store[resType] - (
        //   _.sum(
        //     _.filter(this.existingItems, (item)=> (
        //       item.fromSource.id == struc.id
        //     )), 'fromSource.amount'
        //   )
        // ) > this.creepCarryAmount) || 1) &&
        struc.store[resType] - (
          _.sum(
            _.filter(this.existingItems, (item)=> (
              item.fromSource.id == struc.id
            )), 'fromSource.amount'
          )
        ) > this.creepCarryAmount
      )}
    )
    if(this.room.memory.links && this.room.memory.links.providers.length) {
      let providers = _.filter(
        this.room.memory.links.providers.map((providerLinkId)=>
          Game.getObjectById(providerLinkId)
        ),
        (prov)=> prov.energy > 0
      )
      structures = structures.concat(providers)
    }
    if(structures.length > 0) {
      return creep.pos.findClosestByPath(structures)
    }
    else {
      // Mine resources themself
      let isBootstrapping = this.room.find(
        FIND_STRUCTURES, {filter: {structureType: STRUCTURE_CONTAINER}}
      ).length == 0
      if(isBootstrapping) {
        let sources = creep.room.find(FIND_SOURCES, {filter: (source)=> (
          source.energy > 0
        )})
        return creep.pos.findClosestByPath(sources)
      }
    }
  }

  remote = (queues)=> {
    // Controls the remote expansions
    if(this.room.memory.connectedRemoteRooms) {
      for(let remoteName in this.room.memory.connectedRemoteRooms) {
        let data = this.room.memory.connectedRemoteRooms[remoteName]
        if(data.parsed) {
          // Make sure every source has an item assigned to it in the hiveMind
          for(let source of data.sources) {
            let {x, y, id} = source
            let sourceItemExists = hiveMind.filter(
              {fromSource: {x: x, y: y, roomName: remoteName, id: id}}
            ).length > 0
            if(!sourceItemExists) {
              this.room.pushToQueue(
                $.EXCAVATE, {
                  fromSource: {x: x, y: y, roomName: remoteName, id: id},
                  res: RESOURCE_ENERGY,
                  stage: null,
                  continuous: true
                },
                (
                  $.PRIORITIES[$.EXCAVATE][$.SOURCE] *
                  $.REMOTE_PRIORITIES_MODIFIER
                )
              )
            }
          }

          // Generate carry-tasks for remote stuff
          if(Game.rooms[remoteName]) {
            let room = Game.rooms[remoteName]
            let sources = room.find(FIND_DROPPED_RESOURCES)
            if(sources.length) {
              for(let source of sources) {
                this.genSourceTasks(
                  source, queues[CARRY], CARRY, {dontFindTarget: true}
                )
              }
            }
          }
        }
        else {
          this.initiateRemoteRoomParsing(remoteName)
        }
      }
    }
  }

  /**
   * Appends a creep to spawn to the spawn-queue
   *
   * TODO Possibly not necessary :(
   *
   * @param spawnPriority - The prio of the item in the spawn-queue
   * @param creepMemory - The memory of the creep.
   *    The value of myRoomName will be set automatically if not set here.
   * @param opts - Some options
   *    assignItem - Generates a new item in the hiveMind and assigns it
   *      directly to the spawned creep.
   *      If priority is not set, it will have a prio of 0.
   *      assignItem: {
   *        data: [ITEMDATA],
   *        priority: [ITEMPRIO]
   *      }
   */
  spawnCreep = (spawnPriority, creepMemory, opts = {})=> {
    if(!_.isUndefined(opts.assignItem)) {
      creepMemory.item = creepMemory.item || {}
      let itemId = hiveMind.push(opts.assignItem.data)
      creepMemory.item.id = itemId
      if(!_.isUndefined(opts.assignItem.priority)) {
        creepMemory.item.prio = opts.assignItem.priority
      }
      else {
        creepMemory.item.prio = 0
      }
    }
    if(_.isUndefined(creepMemory.myRoomName)) {
      creepMemory.myRoomName = this.room.name
    }
    this.room.pushToQueue(
      $.SPAWN,
      {memory: creepMemory, kind: creepMemory.kind},
      spawnPriority
    )
  }

  initiateRemoteRoomParsing = (remoteRoomName)=> {
    log.cyan(`Please give me info on remoteRoom ${remoteRoomName}`)
    // Scout, cache & pave path with roads
    // let mutalisks = _.filter(
    //   Game.creeps,
    //   (c)=> (
    //     c.hasItem() && _.get(
    //       c.activeItem(), ['toTarget', 'roomName']
    //     ) === remoteRoomName
    //   )
    // )
    // console.log(JSON.stringify(mutalisks))
    // if(mutalisks.length < 1) {
      // this.room.pushToQueue(
      //   $.SPAWN, {role: $.ROLE_ZERG, kind: $.KIND_MUTALISK, body: [MOVE]}
      // )
      // this.room.pushToQueue($.SCOUT, {toTarget: {roomName: remoteRoomName}})
    // }
  }

  excavate = (queue)=> {
    if(queue && queue.itemCount() > 0) {
      log.cyan('Excavate queue has stuff!')
      let spawningSpawns = []
      while(queue.peek()) {
        let queueItem = queue.dequeue()
        log.cyan(`Dequeuing ${JSON.stringify(queueItem)}`)
        let itemData = hiveMind.data[queueItem.id]
        let spawnPrio = $.PRIORITIES[$.SPAWN][$.KIND_INFESTOR]
        if(itemData.fromSource.roomName != this.room.name) {
          log.cyan(`Remote excavate`)
          // Remote work
          spawnPrio = spawnPrio * $.REMOTE_PRIORITIES_MODIFIER
        }
        log.cyan(`Pushing to spawn-queue`)
        this.room.pushToQueue(
          $.SPAWN,
          {
            kind: $.KIND_INFESTOR,
            memory: {role: $.ROLE_ZERG, item: queueItem}
          },
          spawnPrio
        )
        console.log(JSON.stringify(this.room.queue($.SPAWN)))
      }
    }
  }

  defend = ()=> {
    if(this.room.find(FIND_HOSTILE_CREEPS).length > 0) {
      if(!_.get(this.room.memory, ['specialState', $.UNDER_ATTACK])) {
        this.room.memory.specialState[$.UNDER_ATTACK] = true
        // Respond
        new Spawning(this.room).newItem(
          {
            role: $.KIND_SWEEPER,
            kind: $.KIND_SWEEPER,
            body: [
              MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, ATTACK, ATTACK,
              ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK
            ],
            memory: {
              targetRoomName: this.room.name
            }
          }
        )
      }
    }
    else {
      if(_.get(this.room.memory, ['specialState', $.UNDER_ATTACK])) {
        this.room.memory.specialState[$.UNDER_ATTACK] = false
      }
    }
  }

  satisfyBoredCreep = (creep)=> {
    // Find Containers that have still stuff in them and take that stuff
    // somewhere else if possible
    let containers = this.room.find(
      FIND_STRUCTURES, {filter: this.filterNonVoidEnergyContainers}
    )
    if(containers.length > 0) {
      for(let container of containers) {
        // null == Dont queue the item, let the creep just do it
        let res = this.genSourceTask(container, null, creep.memory.kind[0])
        if(res) {
          return res
        }
      }
    }
  }

  logQueuedItems = ()=> {
    if(!this.room.memory.priorityQueues) {
      console.log('No prioqueues!'); return
    }
    for(let queueName in this.room.memory.priorityQueues) {
      console.log(
        `<span style="color: #33aaff">` +
        `====== Queue: ${queueName}</span>`
      )
      let queue = this.room.memory.priorityQueues[queueName]

      for(let queueItem of queue) {
        let item = Memory['hiveMind'][queueItem.id]
        if(!item) {
          continue
        }
        let fromStr = ''
        if(item['fromSource']) {
          fromStr = ' from <span style="color:#dd6633">' +
            this.getStructureName(Game.getObjectById(item['fromSource'].id)) +
            '</span>' +
            `(<span style="color:#a6a">${item['fromSource'].amount}</span>)`
        }
        let toStr = ''
        if(item['toTarget']) {
          toStr = ' to <span style="color:#66dd33">' +
            this.getStructureName(Game.getObjectById(item['toTarget'].id)) +
            '</span>' +
            `(<span style="color:#a6a">${item['toTarget'].amount}</span>)`
        }
        console.log(
          `    - Item: ${item.res}${fromStr}${toStr}` +
          `[${queueItem.prio}]\n` + `        ${JSON.stringify(item)}`
        )
      }
    }
  }

  getStructureName = (struc)=> {
    let name = false
    switch(struc.structureType) {
      case STRUCTURE_SPAWN: name = 'Spawn'; break
      case STRUCTURE_EXTENSION: name = 'Extension'; break
      case STRUCTURE_CONTROLLER: name = 'Controller'; break
      case STRUCTURE_TOWER: name = 'Tower'; break
      case STRUCTURE_RAMPART: name = 'Rampart'; break
      case STRUCTURE_CONTAINER: name = 'Container'; break
      case STRUCTURE_STORAGE: name = 'Storage'; break
      case STRUCTURE_WALL: name = 'Wall'; break
      case STRUCTURE_ROAD: name = 'Road'; break
      case STRUCTURE_LINK: name = 'Link'; break
      default: name = '???'; break
    }
    if(struc instanceof ConstructionSite) {
      return `ConstructionSite of ${name}`
    }
    else {
      return name
    }
  }

  // getLackingSourceLink() {
  //   let sources = this.room.find(FIND_MY_STRUCTURES, {filter: (struc)=> (
  //     struc.structureType == STRUCTURE_LINK &&
  //     struc.energy < struc.energyCapacity
  //   )})
  //
  //   if(sources.length) {
  //     return sources[0]
  //   }
  //   else {
  //     return null
  //   }
  // }
  //
  // getNonVoidProviderLink() {
  //   let sources = this.room.find(FIND_MY_STRUCTURES, {filter: (struc)=> (
  //     struc.structureType == STRUCTURE_LINK &&
  //     struc.energy > 0
  //   )})
  //
  //   if(sources.length) {
  //     return sources[0]
  //   }
  //   else {
  //     return null
  //   }
  // }
  //
  calcCreepBody = (parts, maxCost = 0, usingStreet = true)=> {
    let partCost = {
      [WORK]: 100,
      [CARRY]: 50,
      [MOVE]: 50,
      [ATTACK]: 80,
      [RANGED_ATTACK]: 150,
      [HEAL]: 250
    }
    let roomMaxCost = _.sum(
      this.room.find(FIND_MY_STRUCTURES, {filter: (struc)=> (
        struc.structureType == STRUCTURE_EXTENSION ||
        struc.structureType == STRUCTURE_SPAWN
      )}),
      'energy'
    )
    let max = (maxCost != 0) ? maxCost : roomMaxCost
    let partBlockCost = parts.reduce((memo, part)=> (memo + partCost[part]), 0)
    let moveRatio = (usingStreet) ? 1/2 : 1
    let movesPerBlock = (parts.length * moveRatio)
    let moveCost = movesPerBlock * partCost[MOVE]
    // We should add one MOVE to the 6 calculated MOVE if we have 13 parts
    let hiddenMoveCost = (movesPerBlock % 1 > 0) ? partCost[MOVE] / 2 : 0
    let wholeBlockCost = partBlockCost + moveCost
    let maxBlockCount = Math.floor(50 / (parts.length + movesPerBlock))
    let blockCount = Math.floor((max - hiddenMoveCost) / wholeBlockCost)
    blockCount = (maxBlockCount < blockCount) ? maxBlockCount : blockCount
    let moveBlockCount = Math.ceil(movesPerBlock * blockCount)
    let body = []
    _.range(moveBlockCount).forEach(()=> body.push(MOVE))
    for(let i = 0; i < blockCount; i += 1) {
      body = body.concat(parts)
    }
    return body
  }
}

module.exports = Overlord

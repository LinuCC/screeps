import hiveMind from './hiveMind'

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

    this.existingItems = hiveMind.allForRoom(this.room)

    if(queues[WORK]) {
      this.work(queues[WORK])
    }
    if(queues[CARRY]) {
      this.carry(queues[CARRY])
    }
  }

  work = (queue)=> {

    // let targetData = this.findWorkTargetFor(RESOURCE_ENERGY)
    // console.log('targetData', JSON.stringify(targetData))

    let conSites = this.room.find(FIND_CONSTRUCTION_SITES)
    if(conSites.length > 0) {
      for(let conSite of conSites) {
        let targetItems = _.filter(this.existingItems, (item)=> (
          item.toTarget.id == conSite.id
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
          item.toTarget.id == controller.id
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
      lacking.concat(
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
  }

  genTargetCarryTasksFor = (target, queue, resType, prio)=> {
    let current = (target.store) ? _.sum(target.store) : target.energy
    let max = (target.storeCapacity) ?
      target.storeCapacity : target.energyCapacity

    let targetItems = _.filter(this.existingItems, (item)=> (
      item.toTarget.id == target.id
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
  genSourceTasks = (source, queue, taskType)=> {
    let sourceItems = _.filter(this.existingItems, (item)=> (
      item.fromSource && item.fromSource.id == source.id &&
      item.stage != TYPE_TARGET
    ))
    let existingDrawAmount = _.sum(sourceItems, 'fromSource.amount')
    let stillStored = source.store[RESOURCE_ENERGY] - existingDrawAmount
    let itemCount = sourceItems.length
    while(
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
        this.addItem(
          queue, source, target, RESOURCE_ENERGY, this.creepCarryAmount,
          prio
        )
        stillStored -= this.creepCarryAmount
        itemCount += 1
      }
      else {
        break // No suitable target found
      }
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
    let stillStored = source.store[RESOURCE_ENERGY] - existingDrawAmount
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
          item.toTarget.id == spawn.id
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
          item.toTarget.id == extension.id
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
          item.toTarget.id == tower.id
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
        item.toTarget.id == storage.id
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
    object.store[RESOURCE_ENERGY] > 200
  )

  filterNonVoidEnergyStorage = (object)=> (
    object.structureType == STRUCTURE_STORAGE &&
    object.store[RESOURCE_ENERGY] > 1000
  )

  addItem = (queue, source, target, res, targetAmount, priority)=> {
    let data = {
      toTarget: {
        id: target.id,
        x: target.pos.x,
        y: target.pos.y,
        roomName: target.pos.roomName,
        amount: targetAmount,
        // amount: (target.amount !== null) ? target.amount : this.creepCarryAmount,
      },
      res: res,
      stage: null
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

  findSourceForCreep = (creep, item, resType)=> {

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
      return creep.pos.findClosestByPath(droppedViableRes)
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
    if(structures.length > 0) {
      return creep.pos.findClosestByPath(structures)
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
      default: name = '???'; break
    }
    if(struc instanceof ConstructionSite) {
      return `ConstructionSite of ${name}`
    }
    else {
      return name
    }
  }

  removeOldHiveMindItems = ()=> {
    let oldItemCount = 0
    nextItem:
    for(let itemId in hiveMind.data) {
      let item = hiveMind.data[itemId]
      for(let creepName in Game.creeps) {
        let creep = Game.creeps[creepName]
        if(creep.memory.item && creep.memory.item.id == item.id) {
          continue nextItem
        }
      }

      for(let roomName in Game.rooms) {
        let room = Game.rooms[roomName]
        if(
          room.memory.priorityQueues &&
          Object.keys(room.memory.priorityQueues).length &&
          Object.keys(room.memory.priorityQueues).some((queueName)=> (
            room.memory.priorityQueues[queueName].some((queueItem)=> (
              queueItem.id == item.id
            ))
          ))
        ) {
         continue nextItem
        }
        // if(room.memory.priorityQueues && room.memory.priorityQueues.length) {
        //   for(let queueName in room.memory.priorityQueues) {
        //     for(let queueItem in room.memory.priorityQueues[queueName]) {
        //       if(queueItem.id == item.id) {
        //         break checkItem
        //       }
        //     }
        //   }
        // }u
      }
      console.log(
        "<span style='color: #aadd33'>Item missing:</span>\n    ",
        JSON.stringify(item)
      )
      // delete hiveMind.data[itemId]
      oldItemCount += 1
    }
    Memory.stats['hiveMind.oldItemCount'] = oldItemCount
  }
}

module.exports = Overlord

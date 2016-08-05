import hiveMind from './hiveMind'

const TYPE_SOURCE = 0
const TYPE_TARGET = 1

/**
 * If creep has finished a task, Overlord should be able to re-add it to the
 * queue if he wants
 */

const PRIO_SPAWN = 1000
const PRIO_EXTENSION = 1100
const PRIO_TOWER = 1200

const PRIO_CONTAINER = 10000

class Overlord {
  constructor(roomName) {
    this.room = Game.rooms[roomName]
    // Basic unit to quantify how many tasks the container can serve per amount.
    // Should be generalized into a room-wide calculation, depending on the
    // creeps CARRY-Amount
    //
    // Or just add an amount to every task and sum it that way
    this.creepCarryAmount = 150
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

  }

  carry = (queue)=> {

    let containers = this.room.find(
      FIND_STRUCTURES, {filter: this.filterNonVoidEnergyContainers}
    )
    if(containers.length > 0) {
      containers.forEach((container)=> {
        this.genContainerTasks(container, queue)
      })
    }
  }

  findCarryTargetFor = (source, resType)=> {
    let void_extension

    let spawn = this.findTargetSpawnFor(source, resType)
    if(spawn) { return {target: spawn, prio: PRIO_SPAWN} }

    let extension = this.findTargetExtensionFor(source, resType)
    if(extension) { return {target: extension, prio: PRIO_EXTENSION} }

    let tower = this.findTargetTowerFor(source, resType)
    if(tower) { return {target: tower, prio: PRIO_TOWER} }

    // let storage = findTargetStorageFor(source, resType)
    // if(storage) { return storage }

    return {target: null, prio: null}
  }

  genContainerTasks = (container, queue)=> {
    let containerItems = _.filter(this.existingItems, (item)=> (
      item.fromSource.id == container.id &&
      item.stage == TYPE_SOURCE
    ))
    let existingDrawAmount = (
      _.sum(containerItems, 'amount') * this.creepCarryAmount
    )
    let stillStored = container.store[RESOURCE_ENERGY] - existingDrawAmount
    while(stillStored > this.creepCarryAmount) {
      let {target, prio} = this.findCarryTargetFor(container, RESOURCE_ENERGY)
      if(target) {
        console.log(`Adding target: ${JSON.stringify(target.pos)}`)
        this.addItem(
          queue, container, target, RESOURCE_ENERGY, this.creepCarryAmount,
          prio
        )
        stillStored =- this.creepCarryAmount
      }
      else {
        break // No suitable target found
      }
    }
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

  filterNonVoidEnergyContainers = (object)=> (
    object.structureType == STRUCTURE_CONTAINER &&
    object.store[RESOURCE_ENERGY] > 200
  )

  addItem = (queue, source, target, res, amount, priority)=> {
    let itemId = hiveMind.push({
      fromSource: {
        id: source.id,
        x: source.pos.x,
        y: source.pos.y,
        roomName: source.pos.roomName,
      },
      toTarget: {
        id: target.id,
        x: target.pos.x,
        y: target.pos.y,
        roomName: target.pos.roomName,
      },
      res: res,
      amount: amount,
      stage: null
    })
    queue.queue({id: itemId, prio: priority})
    this.existingItems = hiveMind.allForRoom(this.room)
  }
}

module.exports = Overlord

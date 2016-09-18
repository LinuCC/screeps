import $ from '../constants'
import Queueing from './Queueing'
import hiveMind from '../hiveMind'

/**
 * Spawn creeps
 * TODO Maintain the queue by removing unspawnable items (for example if
 * extensions got destroyed)
 */
class Spawning extends Queueing {

  constructor(room, queue = $.SPAWN) {
    super(room, queue)
  }

  /**
   * Generates a new Spawning-item.
   */
  newItem(data, prio, opts = {}) {
    let creepMemory = data.memory || {}
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
    if(_.isUndefined(creepMemory.role)) {
      creepMemory.role = this._roleOrDefaultOf(data)
    }

    // Set the data
    const hiveMindData = {
      memory: creepMemory,
      kind: data.kind || $.KIND_ZERGLING,
      role: this._roleOrDefaultOf(data),
      body: data.body || undefined
    }
    return super.newItem(hiveMindData, prio)
  }

  _roleOrDefaultOf = (data) => data.role || data.memory.role || $.ROLE_ZERG

  itemDone(itemId) {
    super.itemDone(itemId)
  }

  itemGenerator() {
    // Simple target-zerg-count
    for(let type of this.room.memory.targetZergCount) {
      const count = this.room.memory.targetZergCount[type]
      const existingZergs = _.filter(Game.creeps, (zerg)=> (
        zerg.memory.role === type && (
          zerg.memory.byRoomName === this.room.name ||
          zerg.pos.roomName === this.room.name
        )
      ))
      let queuedCreeps = this.queue.filter(
        {memory: {kind: type, role: $.ROLE_ZERG}}
      ).length
      while(count > existingZergs + queuedCreeps) {
        this.newItem({
          role: $.ZERG,
          kind: type,
          memory: {body: this.bodyFor(type)}
        })
      }
    }
  }

  bodyFor(zergType) {
    const maxSpawnCost = this.room.maxSpawnCost()
    let body = $.ZERG_PARTS_TEMPLATES[zergType]
    return this.calcCreepBody(this.room, body, maxSpawnCost)
  }


  calcCreepBody = (room, parts, maxCost = 0, usingStreet = true)=> {
    let partCost = {
      [WORK]: 100,
      [CARRY]: 50,
      [MOVE]: 50,
      [ATTACK]: 80,
      [RANGED_ATTACK]: 150,
      [HEAL]: 250
    }
    let roomMaxCost = _.sum(
      room.find(FIND_MY_STRUCTURES, {filter: (struc)=> (
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


  /**
   * TODO Probably doesnt belong here
   */
  itemVerwertor() {
    if(this.queue.itemCount() > 0) {
      while(queue.peek()) {
        const queueItem = queue.peek()
        const itemData = hiveMind.data[queueItem.id]
        const spawnPriority = $.PRIORITIES[$.SPAWN][$.KIND_CORRUPTOR]
        const memory = {
          kind: $.KIND_CORRUPTOR,
          memory: {
            role: $.ZERG,
            item: queueItem
          }
        }
        const res = this.room.pushToQueue(
          $.SPAWN,
          {memory: creepMemory, kind: creepMemory.kind},
          spawnPriority
        )
        if(res) {
          queue.dequeue()
        }

      }
    }
  }


  spawnCreep(spawnPriority, creepMemory, opts = {}) {
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


  calculateStepsFromSpawnOf(room, targetPos) {
    //TODO Implement me
    return 0
  }
}

module.exports = Spawning

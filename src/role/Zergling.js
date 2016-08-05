import hiveMind from './../hiveMind'

const role = require('../role')

const TYPE_SOURCE = 0
const TYPE_TARGET = 1

/**
 * Transports, repairs.
 *
 * Memory:
 *   kind = Array of queues it can handle; First is prioritized.
 *     [WORK, CARRY]
 *   item = A priorityQueue-Item its currently working on
 *     {
 *       prio: <prio>,
 *       id: <hiveMindId>,
 *       XXX
 *       data: {
 *         fromSource: {id, x, y, roomName},
 *         toTarget: {id, x, y, roomName},
 *         res: RESOURCE_ENERGY,
 *         amount: 0,
 *         stage: one of [TYPE_SOURCE, TYPE_TARGET]
 *       }
 *       XXX
 *    }
 *   sourcing
 */

class Zergling {

  constructor(zergling) {
    this.zergling = zergling
    this.hasWorked = false
  }

  run = (priorityQueues)=> {

    if(!this.zergling.memory.item) {
      if(!this.zergling.memory.kind) {
        this.zergling.say('calcKind')
        this.calcKind()
      }
      this.zergling.say('findWork')
      this.findWork(priorityQueues)
    }
    else {
      this.work()
    }
  }

  calcKind = ()=> {
    let parts = []
    for(let type of [WORK, CARRY]) {
      parts.push({type: type, count: _.reduce(this.zergling.body, (sum, b)=> (
        (b.type == type) ? sum + 1 : sum
      ), 0)})
    }
    // Transporters should always have a WORK for on-the-fly repairs
    let workPartIndex = _.findIndex(parts, 'type', WORK)
    parts[workPartIndex].count =- 1
    parts = _.sortBy(parts, 'count')

    this.zergling.memory.kind = []
    parts.forEach((part)=> {
      if(part.count > 0) {
        this.zergling.memory.kind.push(part.type)
      }
    })
  }

  findWork = (priorityQueues)=> {
    for(let queueName of this.zergling.memory.kind) {
      let queue = priorityQueues[queueName]
      if(queue) {
        if(queue.peek()) {
          this.zergling.memory.item = queue.dequeue()
          hiveMind.data[this.zergling.memory.item.id].stage = TYPE_SOURCE
          break
        }
      }
      else {
        this.zergling.say('Queue where?!')
        console.log("${queueName} missing!")
      }
    }
  }

  work = ()=> {
    this.updateSourcingStatus()

    if(this.zergling.memory.sourcing) {
      this.workWith(TYPE_SOURCE)
    }
    else {
      this.workWith(TYPE_TARGET)
    }

    if(!this.hasWorked) {
      this.repairSurroundings()
    }
  }

  updateSourcingStatus = ()=> {
    if(
      this.zergling.memory.sourcing === undefined ||
      this.zergling.memory.sourcing === null
    ) {
      this.zergling.memory.sourcing = true
    }
  }

  workWith = (type)=> {
    let memObject = false
    switch(type) {
      case TYPE_SOURCE:
        memObject = hiveMind.data[this.zergling.memory.item.id].fromSource; break
      case TYPE_TARGET:
        memObject = hiveMind.data[this.zergling.memory.item.id].toTarget; break
    }
    let object = Game.getObjectById(memObject.id)
    let range = this.calcActionRange(type, object)
    if(object) {
      if(this.zergling.pos.inRangeTo(object, range)) {
        switch(type) {
          case TYPE_SOURCE:
            this.withdrawFrom(object); break
          case TYPE_TARGET:
            this.transferTo(object); break
        }
      }
      else {
        this.zergling.moveTo(object)
      }
    }
    else {
      // Source can be missing because of two things: Either our Memory is
      // corrupt, or the source is in a room we cannot currently see
      this.zergling.moveTo(
        new RoomPosition(memObject.x, memObject.y, memObject.roomName)
      )
    }
  }

  withdrawFrom = (source)=> {
    let data = hiveMind.data[this.zergling.memory.item.id]
    let type = data.type || RESOURCE_ENERGY
    let amount = (data.amount) ? data.amount : null // 0 amount == all you can
    let res
    if(source.energy || source.mineralAmount) {
      res = this.zergling.harvest(source)
      this.hasWorked = true
      if(_.sum(this.zergling.carry) == this.zergling.carryCapacity) {
        this.done()
      }
    }
    else {
      res = this.zergling.withdraw(source, type, amount)
      this.hasWorked = true
      this.done()
    }
    if(res != OK) { this.handleActionResult(res, TYPE_SOURCE, source) }
  }

  transferTo = (target)=> {
    let data = hiveMind.data[this.zergling.memory.item.id]
    let type = data.type || RESOURCE_ENERGY
    let amount = (data.amount) ? data.amount : null // 0 amount == all you can
    let res
    if(target instanceof ConstructionSite) {
      res = this.zergling.build(target)
      this.hasWorked = true
      if(this.zergling.carry[RESOURCE_ENERGY] == 0) { this.done() }
    }
    else if(target.structureType == STRUCTURE_CONTROLLER) {
      res = this.zergling.upgradeController(target)
      this.hasWorked = true
      if(this.zergling.carry[RESOURCE_ENERGY] == 0) { this.done() }
    }
    else {
      res = this.zergling.transfer(target, type, amount)
      this.hasWorked = true
      this.done()
    }
    if(res != OK) { this.handleActionResult(res, TYPE_TARGET, target) }
  }

  done = ()=> {
    if(this.zergling.memory.sourcing) {
      hiveMind.data[this.zergling.memory.item.id].stage = TYPE_TARGET
      this.zergling.memory.sourcing = false
    }
    else {
      hiveMind.data[this.zergling.memory.item.id].stage = null
      this.zergling.memory.sourcing = null
      this.zergling.memory.item = null
    }
  }

  calcActionRange = (type, object)=> {
    switch(type) {
      case TYPE_SOURCE:
        return 1; break
      case TYPE_TARGET:
        return (object.structureType == STRUCTURE_CONTROLLER) ? 3 : 1; break
    }
  }

  handleActionResult = (result, type, object)=> {
    let type_str
    switch(type) {
      case TYPE_SOURCE: type_str = 'source'; break
      case TYPE_TARGET: type_str = 'target'; break
    }
    console.log(
      `ERROR: Action for zergling ${this.zergling.name} trying to ` +
      `${type_str} at ${object}: ${result}`
    )
  }

  repairSurroundings = ()=> {
    let structures = this.zergling.pos.findInRange(
      FIND_STRUCTURES, 3,
      {filter: (obj)=> (obj.hits < obj.hitsMax)}
    )
    if(structures.length) {
      let target = _.sortByOrder(structures, 'hits', 'asc')[0]
      this.zergling.repair(target)
    }
  }
}

module.exports = Zergling;


import hiveMind from './../hiveMind'
import Overlord from './../Overlord'

const role = require('../role')

const TYPE_SOURCE = 0
const TYPE_TARGET = 1

const MY_ERR_WTF = -1001

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
 *         fromSource: {id, x, y, roomName, amount: 0},
 *         toTarget: {id, x, y, roomName, amount: 0},
 *         res: RESOURCE_ENERGY,
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
    this.priorityQueues = null
  }

  run = (priorityQueues)=> {

    this.priorityQueues = priorityQueues
    if(!this.zergling.memory.item || this.zergling.memory.sourcing === null) {
      if(!this.zergling.memory.kind) {
        this.zergling.say('calcKind')
        this.calcKind()
      }
      this.findWork(priorityQueues)
    }
    else {
      // QUICK HACK
      // console.log('YO')
      // if(!hiveMind.data[this.zergling.memory.item.id].fromSource) {
      // console.log('Hi')
      //         let source = new Overlord(this.zergling.pos.roomName)
      //           .findSourceForCreep(
      //             this.zergling, hiveMind.data[this.zergling.memory.item.id],
      //             item.res
      //           )
      //           this.zergling.say('⚗', true)
      //           hiveMind.data[this.zergling.memory.item.id].stage = TYPE_SOURCE
      //           this.zergling.memory.sourcing = true
      // }
      this.work()
    }
    if(!this.hasWorked && this.zergling.memory.kind[0] == WORK) {
      this.repairSurroundings()
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
    parts[workPartIndex].count = (parts[workPartIndex].count - 1) * 2
    parts = _.sortByOrder(parts, 'count', 'desc')

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
          this.updateWorkStatus()
          break
        }
        else {
          if(this.bored()) {
            this.vacation()
          }
        }
      }
      else {
        this.zergling.say('Queue where?!')
        console.log(`${queueName} missing!`)
      }
    }
  }

  updateWorkStatus = ()=> {
    if(!hiveMind.data[this.zergling.memory.item.id].fromSource) {
      let item = hiveMind.data[this.zergling.memory.item.id]
      if(this.zergling.carry[item.res] >= item.toTarget.amount) {
        this.zergling.say('♻➟▣', true)
        hiveMind.data[this.zergling.memory.item.id].stage = TYPE_TARGET
        this.zergling.memory.sourcing = false
      }
      else {
        let source = new Overlord(this.zergling.pos.roomName)
          .findSourceForCreep(
            this.zergling, hiveMind.data[this.zergling.memory.item.id],
            item.res
          )
        if(source) {
          hiveMind.data[this.zergling.memory.item.id].fromSource = {
            id: source.id, x: source.pos.x, y: source.pos.y,
            roomName: source.pos.roomName,
            amount: this.creepCarryCapacity,
          }
          this.zergling.say('⚗', true)
          hiveMind.data[this.zergling.memory.item.id].stage = TYPE_SOURCE
          this.zergling.memory.sourcing = true
        }
        else {
          this.zergling.say('⚗?', true)
          this.zergling.memory.sourcing = null
        }
      }
    }
    else {
      hiveMind.data[this.zergling.memory.item.id].stage = TYPE_SOURCE
      this.zergling.memory.sourcing = true
    }
  }

  work = ()=> {
    if(this.zergling.memory.sourcing) {
      this.workWith(TYPE_SOURCE)
    }
    else {
      this.workWith(TYPE_TARGET)
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
    if(!memObject) { this.done(MY_ERR_WTF); return; }
    let object = Game.getObjectById(memObject.id)
    if(!object) { this.done(MY_ERR_WTF); return; }
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
    // 0 amount == all you can
    let amount = (data.fromSource.amount) ? data.fromSource.amount : null
    if(amount > this.zergling.carryCapacity) {
      amount = this.zergling.carryCapacity
    }
    let res
    if(source instanceof Resource) {
      res = this.zergling.pickup(source)
    }
    else if(source.energy || source.mineralAmount) {
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
  }

  transferTo = (target)=> {
    let data = hiveMind.data[this.zergling.memory.item.id]
    let type = data.type || RESOURCE_ENERGY
    // 0 amount == all you can
    let amount = (data.toTarget.amount) ? data.toTarget.amount : null
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
      res = this.zergling.transfer(target, type/*, amount*/)
      this.hasWorked = true
      this.done()
    }
    if(res != OK) { this.handleActionResult(res, TYPE_TARGET, target) }
  }

  done = (res)=> {
    if(this.zergling.memory.sourcing) {
      hiveMind.data[this.zergling.memory.item.id].stage = TYPE_TARGET
      this.zergling.memory.sourcing = false
      if(res == OK) {
        this.zergling.say('▣', true)
      }
      else {
        this.handleActionResult(res, null, null)
      }
    }
    else {
      hiveMind.remove(this.zergling.memory.item.id)
      this.zergling.memory.sourcing = null
      this.zergling.memory.item = null
      if(res == OK) {
        this.zergling.say('✓', true)
      }
      else {
        this.handleActionResult(res, null, null)
      }
    }
  }

  calcActionRange = (type, object)=> {
    switch(type) {
      case TYPE_SOURCE:
        return 1; break
      case TYPE_TARGET:
        return (
          object.structureType == STRUCTURE_CONTROLLER ||
          object instanceof ConstructionSite
        ) ? 3 : 1; break
    }
  }

  handleActionResult = (result, type, object)=> {
    let type_str
    if(type != null) {
      switch(type) {
        case TYPE_SOURCE: type_str = 'source'; break
        case TYPE_TARGET: type_str = 'target'; break
      }
      console.log(
        `ERROR: Action for zergling ${this.zergling.name} trying to ` +
        `${type_str} at ${object}: ${result}`
      )
    }
    switch(result) {
      case ERR_NOT_OWNER: this.zergling.say('✖♚', true); break
      case ERR_NO_PATH: this.zergling.say('✖☈?', true); break
      // case ERR_NAME_EXISTS: this.zergling.say('', true); break
      case ERR_BUSY: this.zergling.say('✖⚙', true); break
      case ERR_NOT_FOUND: this.zergling.say('✖▣?', true); break
      case ERR_NOT_ENOUGH_ENERGY: this.zergling.say('✖☢', true); break
      case ERR_INVALID_TARGET: this.zergling.say('✖▣!', true); break
      case ERR_FULL: this.zergling.say('✖●', true); break
      case ERR_NOT_IN_RANGE: this.zergling.say('✖◎', true); break
      case ERR_INVALID_ARGS: this.zergling.say('✖ARGS!', true); break
      case ERR_TIRED: this.zergling.say('✖❄', true); break
      case ERR_NO_BODYPART: this.zergling.say('✖☗?', true); break
      case MY_ERR_WTF:
        console.log(
          '<span type="color: red">Got a WTF!</span>',
          `<span type="color: #aadd33">Id</span>: "${this.creep.id}"`,
          `<span type="color: #33aadd">Pos</span>: ` +
          `"${JSON.stringify(this.creep.pos)}"`,
          `<span type="color: #ddaa33">Mem</span>: "` +
          `${JSON.stringify(this.creep.memory)}"`,
        )
        this.zergling.say('WTF?', true)
        break
      // case ERR_NOT_ENOUGH_EXTENSIONS: this.zergling.say('', true); break
    }
  }

  repairSurroundings = ()=> {
    let structures = this.zergling.pos.findInRange(
      FIND_STRUCTURES, 3,
      {filter: (obj)=> (
        obj.hits < obj.hitsMax &&
        obj.structureType != obj.STRUCTURE_WALL
      )}
    )
    if(structures.length) {
      let target = _.sortByOrder(structures, 'hits', 'asc')[0]
      this.zergling.repair(target)
    }
  }

  bored = ()=> {
    let item = new Overlord(this.zergling.pos.roomName)
      .satisfyBoredCreep(this.zergling)
    if(item) {
      this.zergling.memory.item = item
      this.updateWorkStatus()
    }
  }

  vacation = ()=> {
    this.zergling.say('☀', true) // No tasks, creep is on vacation
    let hangar = this.zergling.room.find(
      FIND_MY_STRUCTURES, {filter: {structureType: STRUCTURE_SPAWN}}
    )[0]
    if(!this.zergling.pos.inRangeTo(hangar, 2)) {
      this.zergling.moveTo(hangar)
    }
  }
}

module.exports = Zergling;


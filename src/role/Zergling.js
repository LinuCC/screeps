import $ from './../constants'
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
 *   myRoomName = The room the zergling is supposed to be in
 */

class Zergling {

  constructor(zergling) {
    this.zergling = zergling
    this.hasWorked = false
    this.priorityQueues = null
  }

  run = (priorityQueues)=> {

    try {
      if(this.zergling.ticksToLive == 1) {this.zergling.say('For the ☣')}

      this.priorityQueues = priorityQueues
      if(!this.zergling.memory.item) {
        if(
          this.zergling.memory.myRoomName &&
          this.zergling.pos.roomName != this.zergling.memory.myRoomName
        ) {
          this.zergling.moveTo(
            Game.rooms[this.zergling.memory.myRoomName].controller
          )
          return
        }
        if(!this.zergling.memory.kind) {
          this.zergling.say('calcKind')
          this.calcKind()
        }
        if(!this.zergling.memory.myRoomName) {
          this.zergling.memory.myRoomName = this.zergling.pos.roomName
        }
        if(this.findWork(priorityQueues)) {
          this.work()
        }
        else {
          this.vacation()
        }
      }
      else if(
        this.zergling.memory.sourcing === null ||
        _.isUndefined(this.zergling.memory.sourcing)
      ) {
        // Zerg has item, but hasnt found a source for it yet
        if(this.initWorkStart()) {
          this.work()
        }
        else {
          this.vacation()
        }
      }
      else {
        this.work()
      }
      if(!this.hasWorked && this.zergling.memory.kind[0] == WORK) {
        this.repairSurroundings()
      }
    }
    catch(e) {
      console.log('<span style="color: red">Creep Error`d:\n' + e.stack + '\n')
      if(
        this.zergling.memory.item &&
        !hiveMind.data[this.zergling.memory.item.id]
      ) {
        log.cyan('Cleaning up missing hiveMind-Data')
        this.zergling.memory.item = null
        this.zergling.memory.sourcing = null
      }
    }
    finally {
      if(this.zergling.ticksToLive == 1) {
        this.swarmPurposeFulfilled()
      }
    }
  }

  calcKind = ()=> {
    if(_.isEqual(this.zergling.body, [MOVE])) {
      this.zergling.memory.kind = [$.SCOUT]
      return
    }
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

    let queues = []
    if(Array.isArray(this.zergling.memory.kind)) {
      // Old Style (kind contains the queuenames)
      queues = this.zergling.memory.kind
    }
    else {
      // New Style (kind contains the kind)
      queues = $.QUEUES_FOR_KINDS[this.zergling.memory.kind]
    }
    for(let queueName of queues) {
      let queue = priorityQueues[queueName]
      if(!queue) {
        //newstyle
        queue = priorityQueues[$.QUEUES_FOR_KINDS[this.zergling.memory.kind]]
      }
      if(queue) {
        if(queue.peek()) {
          this.zergling.memory.item = queue.dequeue()
          let itemData = hiveMind.data[this.zergling.memory.item.id]
          itemData.assigned = true
          if(itemData.fromSource && !itemData.fromSource.amount) {
            itemData.fromSource.amount = this.zergling.carryCapacity
          }
          return this.initWorkStart()
        }
        else {
          if(this.bored()) {
            this.zergling.say('⚘☀', true) // No tasks, creep is on vacation
          }
        }
      }
      else {
        this.zergling.say('Queue where?!')
        console.log(`${queueName} missing!`)
      }
    }
    return false
  }

  /**
   * Handles the memory-state for the new item, so that the creep starts working
   */
  initWorkStart = ()=> {
    if(
      _.isUndefined(hiveMind.data[this.zergling.memory.item.id].fromSource) &&
      this.zergling.memory.kind !== $.KIND_CORRUPTOR
    ) {
      // fromSource does not exist
      let item = hiveMind.data[this.zergling.memory.item.id]
      if(this.zergling.carry[item.res] >= item.toTarget.amount) {
        // We have enough energy left for the target, dont need no source
        this.zergling.say('♻➟▣', true)
        hiveMind.data[this.zergling.memory.item.id].stage = TYPE_TARGET
        this.zergling.memory.sourcing = false
        return true
      }
      else {
        // search for a source
        let source = new Overlord(this.zergling.pos.roomName)
          .findSourceForCreep(
            this.zergling, hiveMind.data[this.zergling.memory.item.id],
            item.res
          )
        if(source === true) {
          // Thanks, Overlord. You already assigned me the source
        }
        else if(source) {
          hiveMind.data[this.zergling.memory.item.id].fromSource = {
            id: source.id, x: source.pos.x, y: source.pos.y,
            roomName: source.pos.roomName,
            amount: this.creepCarryCapacity,
          }
          this.zergling.say('⚗', true)
          hiveMind.data[this.zergling.memory.item.id].stage = TYPE_SOURCE
          this.zergling.memory.sourcing = true
          return true
        }
        else {
          this.zergling.say('⚗?', true)
          this.zergling.memory.sourcing = null
          return false
        }
      }
    }
    else if(hiveMind.data[this.zergling.memory.item.id].fromSource === false) {
      // Theres explicitly no source, for example with continuous tasks
      this.zergling.say('▣ (✖⚗)', true)
      hiveMind.data[this.zergling.memory.item.id].stage = TYPE_TARGET
      this.zergling.memory.sourcing = false
      return true
    }
    else {
      hiveMind.data[this.zergling.memory.item.id].stage = TYPE_SOURCE
      this.zergling.memory.sourcing = true
      return true
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
    const itemData = hiveMind.data[this.zergling.memory.item.id]
    switch(type) {
      case TYPE_SOURCE:
        memObject = itemData.fromSource;
        break
      case TYPE_TARGET:
        memObject = itemData.toTarget; break
    }
    if(!memObject) { this.done(MY_ERR_WTF, 'workWith#memObject'); return; }
    if(!memObject.id) {
      this.done(MY_ERR_WTF, 'No memObject.id; Not guessing.'); return
    }
    let object = Game.getObjectById(memObject.id)
    if(!object && !_.isUndefined(Game.rooms[memObject.roomName])) {
      // Object doesnt exist but we can see the room. Nope
      this.done(MY_ERR_WTF, 'workWith#object');
      return;
    }
    let range = this.calcActionRange(type, object, itemData)
    if(object) {
      if(this.zergling.pos.inRangeTo(object, range)) {
        switch(type) {
          case TYPE_SOURCE: this.withdrawFrom(object); break
          case TYPE_TARGET:
            if(itemData.workType === $.SEED) {
              this.seedTo(object);
            }
            else {
              this.transferTo(object)
            }
            break
        }
      }
      else {
        if(object.structureType == STRUCTURE_CONTROLLER) {
          let altFlags = _.filter(Game.flags, (flag)=> (
            flag.name == 'altCon' &&
            flag.pos.roomName == this.zergling.room.name
          ))
          if(altFlags.length) {
            this.zergling.moveTo(altFlags[0])
            return
          }
        }
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
    if(amount >= this.zergling.carryCapacity) {
      amount = 0 // Withdraw all you can
    }
    let res
    if(source instanceof Resource) {
      res = this.zergling.pickup(source)
      this.hasWorked = true
      if(_.sum(this.zergling.carry) == this.zergling.carryCapacity) {
        this.done()
      }
    }
    else if(
      (source.energy || source.mineralAmount) && source.cooldown === undefined
    ) {
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
    if(this.zergling.carry[RESOURCE_ENERGY] == 0) {
      this.done()
    }
    else if(target instanceof ConstructionSite) {
      res = this.zergling.build(target)
      this.hasWorked = true
      if(
        this.zergling.carry[RESOURCE_ENERGY] == 0
        // TODO: need to check if the target is done building in this tick
      ) {
        this.done()
      }
    }
    else if(target.structureType == STRUCTURE_CONTROLLER) {
      res = this.zergling.upgradeController(target)
      this.hasWorked = true
      // TODO carry - the upgradeController-energy for this tick
      if(this.zergling.carry[RESOURCE_ENERGY] == 0) { this.done() }
    }
    else {
      res = this.zergling.transfer(target, type/*, amount*/)
      this.hasWorked = true
      this.done()
    }
    if(res != OK) { this.handleActionResult(res, TYPE_TARGET, target) }
  }

  /**
   * Work with controllers
   */
  seedTo = (object) => {
    let data = hiveMind.data[this.zergling.memory.item.id]
    let type = data.type
    switch(type) {
      case $.RESERVE: this.zergling.reserveController(object); break
      case $.CLAIM: this.zergling.claimController(object); break
      case $.DOWNGRADE: this.zergling.attackController(object); break
    }
  }

  done = (res, debugInfo = false)=> {
    let itemData = hiveMind.data[_.get(this.zergling.memory, ['item', 'id'])]
    if(this.zergling.memory.sourcing) {
      // Done SOURCING Stuff
      if(_.get(itemData, 'continuous') && !this.zergling.memory.toTarget) {
        this.zergling.say('↺⚗', true)
        return // We just source stuff, continue to do so
      }
      else {
        hiveMind.data[this.zergling.memory.item.id].stage = TYPE_TARGET
        this.zergling.memory.sourcing = false
        if(res == OK) {
          this.zergling.say('▣', true)
        }
        else {
          this.handleActionResult(res, null, null, debugInfo)
        }
      }
    }
    else {
      // Done TARGETIING Stuff
      if(_.get(itemData, 'continuous')) {
        if(!this.zergling.memory.fromSource) {
          this.zergling.say('↺▣', true)
          return // We just target stuff, continue to do so
        }
        else {
          hiveMind.data[this.zergling.memory.item.id].stage = TYPE_SOURCE
          this.zergling.memory.sourcing = true
          this.zergling.say('↺ ➟ ⚗', true)
          return
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
          this.handleActionResult(res, null, null, debugInfo)
        }
      }
    }
  }

  calcActionRange = (type, object, itemData)=> {
    if(itemData.workType === $.SEED) { return 1 }
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

  handleActionResult = (result, type, object, debugInfo = null)=> {
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
          '<span style="color: red">Got a WTF!</span>',
          `<span style="color: #aadd33">Id</span>: "${this.zergling.id}"`,
          `<span style="color: #33aadd">Pos</span>: ` +
          `"${JSON.stringify(this.zergling.pos)}"`,
          `<span style="color: #ddaa33">Mem</span>: "` +
          `${JSON.stringify(this.zergling.memory)}"`,
          `<span style="color: #aa33dd">More Info</span>: "` +
          `${JSON.stringify(debugInfo)}"`
        )
        this.zergling.say('WTF?', true)
        break
      // case ERR_NOT_ENOUGH_EXTENSIONS: this.zergling.say('', true); break
      case ERR_RCL_NOT_ENOUGH: this.zergling.say('<!', true); break
    }
  }

  repairSurroundings = ()=> {
    let structures = this.zergling.pos.findInRange(
      FIND_STRUCTURES, 3,
      {filter: (obj)=> (
        obj.hits < obj.hitsMax &&
        obj.structureType != STRUCTURE_WALL &&
        obj.structureType != STRUCTURE_RAMPART
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
      this.initWorkStart()
      return false
    }
    else {
      return true
    }
  }

  /*
   * Zergling is idling
   */
  vacation = ()=> {
    let statName = (
      `room.${this.zergling.room.name}.zergStats.` +
      `${this.zergling.memory.kind[0]}.idleTicks`
    )
    if(!Memory.stats[statName]) { Memory.stats[statName] = 0 }
    Memory.stats[statName] += 1
    let hangar = this.zergling.room.find(
      FIND_MY_STRUCTURES, {filter: {structureType: STRUCTURE_SPAWN}}
    )[0]
    if(hangar && !this.zergling.pos.inRangeTo(hangar, 2)) {
      this.zergling.moveTo(hangar)
    }
  }

  /*
   * Make sure that the hiveMind-Item gets deleted before the zergling dies
   */
  swarmPurposeFulfilled = ()=> {
    this.zergling.say('For the ☣')
    if(this.zergling.memory.item) {
      hiveMind.remove(this.zergling.memory.item.id)
      this.zergling.memory.sourcing = null
      this.zergling.memory.item = null
    }
  }
}

module.exports = Zergling;


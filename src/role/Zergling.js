import $ from './../constants'
import hiveMind from './../hiveMind'
import Overlord from './../Overlord'
import profiler from 'screeps-profiler'

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
    this.mem = this.zergling.memory
    this.kind = this.mem.kind[0]
  }

  run = (priorityQueues, opts = {})=> {

    try {
      if(this.zergling.ticksToLive == 1) {this.zergling.say('For the ☣')}
      if(opts[$.UNDER_ATTACK]) {
        if(this.flee()) {
          this.zergling.say('Nope')
          return
        }
      }

      this.priorityQueues = priorityQueues
      if(!this.mem.item) {
        if(
          this.mem.myRoomName &&
          this.zergling.pos.roomName != this.mem.myRoomName
        ) {
          this.zergling.moveTo(
            Game.rooms[this.mem.myRoomName].controller
          )
          return
        }
        if(!this.mem.kind) {
          this.zergling.say('calcKind')
          this.calcKind()
        }
        if(!this.mem.myRoomName) {
          this.mem.myRoomName = this.zergling.pos.roomName
        }
        if(this.findWork(priorityQueues)) {
          this.work()
        }
        else {
          this.vacation()
        }
      }
      else if(
        this.mem.sourcing === null ||
        _.isUndefined(this.mem.sourcing)
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
      if(!this.hasWorked && this.mem.kind[0] == WORK) {
        this.repairSurroundings()
      }
    }
    catch(e) {
      console.log('<span style="color: red">Creep Error`d:\n' + e.stack + '\n')
      if(
        this.mem.item &&
        !hiveMind.data[this.mem.item.id]
      ) {
        log.cyan('Cleaning up missing hiveMind-Data')
        this.mem.item = null
        this.mem.sourcing = null
      }
    }
    finally {
      if(this.zergling.tickstoLive == 2) { this.zergling.say('For the ☣') }
      if(this.zergling.ticksToLive == 1) { this.swarmPurposeFulfilled() }
    }
  }

  calcKind = ()=> {
    if(_.isEqual(this.zergling.body, [MOVE])) {
      this.mem.kind = [$.SCOUT]
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

    this.mem.kind = []
    parts.forEach((part)=> {
      if(part.count > 0) {
        this.mem.kind.push(part.type)
      }
    })
  }

  findWork = (priorityQueues)=> {

    let queues = []
    if(Array.isArray(this.mem.kind)) {
      // Old Style (kind contains the queuenames)
      queues = this.mem.kind
    }
    else {
      // New Style (kind contains the kind)
      queues = $.QUEUES_FOR_KINDS[this.mem.kind]
    }
    for(let queueName of queues) {
      let queue = priorityQueues[queueName]
      if(!queue) {
        //newstyle
        queue = priorityQueues[$.QUEUES_FOR_KINDS[this.mem.kind]]
      }
      if(queue) {
        if(queue.peek()) {
          this.mem.item = queue.dequeue()
          let itemData = hiveMind.data[this.mem.item.id]
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
      _.isUndefined(hiveMind.data[this.mem.item.id].fromSource) &&
      this.mem.kind !== $.KIND_CORRUPTOR
    ) {
      // fromSource does not exist
      let item = hiveMind.data[this.mem.item.id]
      if(_.isUndefined(_.get(item, ['toTarget', 'amount']))) {
        this.done(MY_ERR_WTF, 'initWorkStart#amount'); return;
      }
      if(this.zergling.carry[item.res] >= item.toTarget.amount) {
        // We have enough energy left for the target, dont need no source
        this.zergling.say('♻➟▣', true)
        hiveMind.data[this.mem.item.id].stage = TYPE_TARGET
        this.mem.sourcing = false
        return true
      }
      else {
        // search for a source
        let source = new verlord(this.zergling.pos.roomName)
          .findSourceForCreep(
            this.zergling, hiveMind.data[this.mem.item.id],
            item.res
          )
        if(source === true) {
          // Thanks, Overlord. You already assigned me the source
        }
        else if(source) {
          hiveMind.data[this.mem.item.id].fromSource = {
            id: source.id, x: source.pos.x, y: source.pos.y,
            roomName: source.pos.roomName,
            amount: this.creepCarryCapacity,
          }
          this.zergling.say('⚗', true)
          hiveMind.data[this.mem.item.id].stage = TYPE_SOURCE
          this.mem.sourcing = true
          return true
        }
        else {
          this.zergling.say('⚗?', true)
          this.mem.sourcing = null
          return false
        }
      }
    }
    else if(hiveMind.data[this.mem.item.id].fromSource === false) {
      // Theres explicitly no source, for example with continuous tasks
      this.zergling.say('▣ (✖⚗)', true)
      hiveMind.data[this.mem.item.id].stage = TYPE_TARGET
      this.mem.sourcing = false
      return true
    }
    else {
      hiveMind.data[this.mem.item.id].stage = TYPE_SOURCE
      this.mem.sourcing = true
      return true
    }
  }

  work = ()=> {
    if(this.mem.sourcing) {
      this.workWith(TYPE_SOURCE)
    }
    else {
      this.workWith(TYPE_TARGET)
    }
  }

  workWith = (type)=> {
    let memObject = false
    const itemData = hiveMind.data[this.mem.item.id]
    switch(type) {
      case TYPE_SOURCE:
        memObject = itemData.fromSource;
        break
      case TYPE_TARGET:
        memObject = itemData.toTarget; break
    }
    if(!memObject) { this.done(MY_ERR_WTF, 'workWith#memObject'); return; }
    if(!memObject.id && !memObject.objId) {
      this.done(MY_ERR_WTF, 'No memObject.id/objId; Not guessing.'); return
    }
    let object = Game.getObjectById(memObject.objId || memObject.id)
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
    let data = hiveMind.data[this.mem.item.id]
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
    let data = hiveMind.data[this.mem.item.id]
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
    let data = hiveMind.data[this.mem.item.id]
    let type = data.type
    switch(type) {
      case $.RESERVE: this.zergling.reserveController(object); break
      case $.CLAIM: this.zergling.claimController(object); break
      case $.DOWNGRADE: this.zergling.attackController(object); break
    }
  }

  done = (res, debugInfo = false)=> {
    let itemData = hiveMind.data[_.get(this.mem, ['item', 'id'])]
    if(this.mem.sourcing) {
      // Done SOURCING Stuff
      if(_.get(itemData, 'continuous') && !this.mem.toTarget) {
        this.zergling.say('↺⚗', true)
        return // We just source stuff, continue to do so
      }
      else {
        hiveMind.data[this.mem.item.id].stage = TYPE_TARGET
        this.mem.sourcing = false
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
        if(!this.mem.fromSource) {
          this.zergling.say('↺▣', true)
          return // We just target stuff, continue to do so
        }
        else {
          hiveMind.data[this.mem.item.id].stage = TYPE_SOURCE
          this.mem.sourcing = true
          this.zergling.say('↺ ➟ ⚗', true)
          return
        }
      }
      else {
        hiveMind.remove(this.mem.item.id)
        this.mem.sourcing = null
        this.mem.item = null
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

  newCalcActionRange = (object, item)=> {
    if(item.workType === $.SEED) { return 1 }
    if(
      object.structureType == STRUCTURE_CONTROLLER ||
      object instanceof ConstructionSite
    ) {
      return 3
    }
    else {
      return 1
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
          `${JSON.stringify(this.mem)}"`,
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
      this.mem.item = item
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
      `${this.mem.kind[0]}.idleTicks`
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

  flee = ()=> {
    if(this.mem.myRoomName != this.zergling.room.name) {
      log.orange(`Fleeing! ${JSON.stringify(this.mem.kind)}`)
      // Somewhere remote
        if(Array.isArray(this.mem.kind) && this.mem.kind.includes('carry')) {
          this.zergling.moveTo(Game.rooms[this.mem.myRoomName].safeArea())
          return true
        }
        switch(this.mem.kind) {
          case $.KIND_INFESTOR:
          case $.KIND_CORRUPTOR:
          case $.KIND_ZERGLING:
          case $.KIND_DRONE:
            this.zergling.moveTo(Game.rooms[this.mem.myRoomName].safeArea())
            return true
            break
          default: break
        }
        return false
    }
    else {
      return false
    }
  }

  /*
   * Make sure that the hiveMind-Item gets deleted before the zergling dies
   */
  swarmPurposeFulfilled = ()=> {
    if(this.mem.item) {
      hiveMind.remove(this.mem.item.id)
      this.mem.sourcing = null
      this.mem.item = null
    }
  }

  newWork() {
    if(this.mem.items && this.mem.items.length) {
      let items = this.mem.items
      this.workOnItem(items[0])
    }
    else {
      this.newFindItems()
    }
  }

  workOnItem(item) {
    data = hiveMind.data(item.id)
    let object = Game.getObjectById(itemData.objId)
    let knowsObject = true
    if(!object) {
      if(_.isUndefined(Game.rooms[itemData.roomName])) {
        // We cant see object bbut we cant see the room as well
        /// TODO Implement checking of room with the Observer to help here?
        object = new RoomPosition(itemData.x, itemData.y, itemData.roomName)
        knowsObject = false
      }
      else {
        // Object doesnt exist but we can see the room. Nope
        this.done(MY_ERR_WTF, 'workOnItem#object: Couldnt find Object by Id');
        return;
      }
    }
    let range = this.newCalcActionRange(object, itemData)
    if(knowsObject && this.zergling.pos.inRangeTo(object, range)) {

      switch(itemData.kind) {
        case $.ACTIVE_PROVIDING:
          this.withdrawFrom(object); break
        case $.SEEDING:
          this.seedTo(object); break
        case $.WORK_REQUESTING:
        case $.RESOURCE_REQUESTING:
          this.transferTo(object)
          break
        default:
          log.orange(`Kind what?! For creep ${JSON.stringify(this.zergling)}`)
      }
    }
    else {
      this.zergling.moveTo(object)
    }
  }

  newSearchForItems() {

    // Current amount of energy
    // Do we need to refill?
    // If yes: refill:
      // Get first item of requester, sorted by range (Zerglings shouldnt refill from remotes)
      // Get its resource-type
    // If no, just set the resource-type to the carrying-type
    // While we have enough energy to fulfill the coming request
      // resort fitting requester-queue based on range of last added item
      // Get first item from that queue

    // refill: How do we know what resource to refill?

    let position = null
    let providedResourceType = RESOURCE_ENERGY
    const itemFilter = (item, data) => (
      position.roomName == data.roomName &&
      data.type == providedResourceType &&
      // Dont filter by amount since we want to put all of our energy we have
      // left into stuff.
      // data.amount <= this.carry[providedResourceType]
    )
    const myQueueType = $.NEW_QUEUES_FOR_KINDS[this.mem.kind]

    const requesting = new Requesting(
      Game.rooms[this.mem.myRoomName], myQueueType
    )
    // First get a target-item to check if we have enough resources carried with
    // us to satisfy it
    const prioritizedItem = _.get(requesting.reorderByRangeFrom(
      this.zergling.pos, {filter: itemFilter}
    ), 0)
    if(!prioritizedItem) { log.red('No prio item!'); return }

    const maxGrep = this.zergling.carryCapacity - _.sum(this.zergling.carry)
    const minGrep = 200
    if(prioritizedItem.amount >= this.zergling.carry[providedResourceType]) {
      // I would in theory need to find the next target to this source to find
      // out how much energy I want, but thats getting too complicated for now.
      // Just get as much energy as ye can

      // Search for source, put it before the targets

      const providing = new ActiveProviding(Game.rooms[this.mem.myRoomName])
      const activeSourceItem = _.get(
        providing.reorderByRangeFrom(this.zergling.pos, {
          filter: (item, data)=> (data.amount >= minGrep)
        }),
        0
      )
      if(activeSourceItem) {
        const newItem = providing.generateNewItemFromMetaItem(
          activeSourceItem, maxGrep
        )
        this.mem.items.unshift(newItem)
      }
      else {
        // Search for passive sources
        /// TODO
      }
    }
    else {
      // Only put the range-ordered item actually into the items-memory when we
      // dont have to get more energy from another source since we would be
      // somewhere else by then, meaning the ranges would have changed
      this.mem.items.unshift(prioritizedItem)
    }

    if(!this.mem.items.length) {
      // we havent found a suitable target or source, give up
      return false
    }

    const prioItemPosition = new RoomPosition(
      prioritizedItem.x, prioritizedItem.y, prioritizedItem.roomName
    )


    const queue = requesting.getFirstAccountingRangeFrom(
      position, {filter: itemFilter}
    )

    let antiEndlessLoop = 0
    while(this._unusedCarryAmountOf(providedResourceType) > 0) {
      let lastItem = this.mem.items[-1]
      let position = new RoomPosition(lastItem.x, lastItem.y, lastItem.roomName)
      let queue = requesting.getFirstAccountingRangeFrom(
        position, {filter: itemFilter}
      )
      potentialItem = queue.peek()
      potentialItemData = hiveMind.data[potentialItem.id]
      if(
        potentialItemData.amount >
        this._unusedCarryAmountOf(providedResourceType)
      ) {
        // We cant take over whole task, we have to split from it
        const newItem = requesting.generateNewItemFromMetaItem(
          potentialItem, this._unusedCarryAmountOf(providedResourceType)
        )
        if(newItem) {
          this.mem.items.push(newItem)
        }
      }
      else {
        // Take over whole task
        queue.dequeue()
        this.mem.items.push(potentialItem)
      }
      antiEndlessLoop += 1
      if(antiEndlessLoop > 50) { log.red('ANTIENDLESSLOOP TRIGGERED'); break }
    }
  }

  _unusedCarryAmountOf(resource) {
    return (
      this.carry[resource] -
      _.sum(_.filter(this.mem.items, (item)=> (
        item.type == resource &&
        item.kind != $.ACTIVE_PROVIDING
      ))
      , 'amount')
    )
  }
}

profiler.registerObject(Zergling, 'Zergling')
module.exports = Zergling;


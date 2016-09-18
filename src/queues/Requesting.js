import $ from '../constants'
import Queueing from './Queueing'
import hiveMind from '../hiveMind'
import Shiny from '../Shiny'
import profiler from 'screeps-profiler'

/**
 * Requesters
 */
class Requesting extends Queueing {

  constructor(room, queue = null) {
    super(room, queue)
    this.queues = {
      [$.WORK_REQUESTING]: this.room.queue($.WORK_REQUESTING),
      [$.RESOURCE_REQUESTING]: this.room.queue($.RESOURCE_REQUESTING)
    }
  }

  /**
   * Generates a new Requesting-item.
   */
  newItem(data, prio, opts = {}) {
    let type = data.type
    let amount = data.amount
    if(!type) {
      const resource = this._calcResourceOf(data.requester)
      type = resource.type
      amount = resource.amount
    }
    if(!amount) {
      amount = this._calcNeededAmountOf(data.requester, type)
    }
    const hiveMindData = {
      roomName: data.roomName || _.get(data.requester, ['pos', 'roomName']),
      objId: data.id || _.get(data.requester, ['id']) || undefined,
      x: data.x || _.get(data.requester, ['pos', 'x']) || undefined,
      y: data.y || _.get(data.requester, ['pos', 'y']) || undefined,
      type: type,
      amount: amount,
      assigned: false
    }
    const queue = data.queueType || this._calcQueueTypeOf(data.requester)
    return super.newItem(hiveMindData, prio, this.queues[queue])
  }

  _calcResourceOf(requester) {
    let needs = new Shiny(requester).neededGoods()
    _.each(needs, (amount, name)=> { if(amount === 0) { delete needs[name] } })
    const neededResourceTypes = Object.keys(needs)
    if(!neededResourceTypes.length) {
      return false
    }
    else if(neededResourceTypes.length === 1) {
      // If one resource is found, type is obvious
      const type = neededResourceTypes[0]
      return {type: type, amount: needs[type]}
    }
    else if(neededResourceTypes.includes(RESOURCE_ENERGY)) {
      // Default to Energy if more than one resource found
      return {type: RESOURCE_ENERGY, amount: needs[RESOURCE_ENERGY]}
    }
    else {
      // Else basically give up and return at least something
      log.orange(
        `Requesting#calcTypeOf just returned ${neededResourceTypes[0]} ` +
        `for ${provider}`
      )
      const type = neededResourceTypes[0]
      return {type: type, amount: needs[type]}
    }
  }

  _calcQueueTypeOf(requester) {
    const type = new Shiny(requester).type()
    if(
      type === $.OBJ_CONSTRUCTION_SITE ||
      type === STRUCTURE_CONTROLLER
    ) {
      return $.WORK_REQUESTING
    }
    else {
      return $.RESOURCE_REQUESTING
    }
  }

  itemGenerator() {
    if(this.room.name != 'E48N44') { return }
    // Get targets
    const rooms = this.room.accessibleControllingRooms()
    let targets = this.room.find(
      FIND_MY_STRUCTURES, {filter: (structure)=> (
        (
          structure.structureType == STRUCTURE_SPAWN ||
          structure.structureType == STRUCTURE_EXTENSION ||
          structure.structureType == STRUCTURE_TOWER
        ) &&
        structure.energy < structure.energyCapacity
    )})
    const sourceLinks = _.get(this.room.memory, ['links', 'sources'])
    if(sourceLinks && sourceLinks.length > 0) {
      targets = targets.concat(sourceLinks.map((source)=>
        Game.getObjectById(source)
      ))
    }
    rooms.forEach((room)=> {
      targets = targets.concat(this.room.find(FIND_CONSTRUCTION_SITES))
      targets = targets.concat(this.room.find(
        FIND_STRUCTURES, {filter: {structureType: STRUCTURE_CONTROLLER}}
      ))
    })
    // Generate Items
    if(targets.length > 0) {
      for(let target of targets) {
        if(!target) {
          log.red('NOPE')
        }
        const existingItems = _.filter(
          hiveMind.allForRoom(target.room),
          {objId: target.id, type: RESOURCE_ENERGY}
        )
        const targetShiny = new Shiny(target)
        const alreadyRequested = _.sum(existingItems, 'amount')
        const stillNeededEnergy = (
          _.get(targetShiny.neededGoods(), RESOURCE_ENERGY) - alreadyRequested
        )

        if(stillNeededEnergy === 0) {
          continue
        }
        const queueType = this._calcQueueTypeOf(target)
        // log.cyan(`    > Needed Goods: ${JSON.stringify(targetShiny.neededGoods())}`)
        log.cyan(`    > Requested: ${alreadyRequested}`)
        // log.cyan(`    > Energy needed: ${stillNeededEnergy}`)

        const onNewItem = ()=> {
          if(stillNeededEnergy > 0) {
            log.orange(`    > Creating new item`)
            this.newItem(
              {
                amount: stillNeededEnergy,
                requester: target,
                queueType: queueType
              },
              (data)=> (this._prioForShiny(targetShiny, data.amount))
            )
          }
        }
        const onEditItem = (existingItem)=> {
            log.orange(`    > Editing item ${existingItem.id}`)
          existingItem['amount'] += stillNeededEnergy
          if(existingItem.amount < 0) {
            hiveMind.remove(existingItem.id)
          }
          else {
            this.queues[queueType].updatePrioById(
              existingItem.id, this._prioForShiny(
                new Shiny(Game.getObjectById(existingItem.objId)),
                existingItem.amount
              )
            )
          }
        }

        this.editMetaItemOrNewItem(onNewItem, onEditItem, existingItems)
      }
    }
  }


  _prioForShiny(shiny, amount) {
    const type = shiny.type()
    let prio = 0
    if(type === $.OBJ_CONSTRUCTION_SITE) {
      prio = $.PRIORITIES[$.WORK_REQUESTING][type]
      if(this.room.name != shiny.obj.room.name) {
        prio += $.REMOTE_PRIORITY_CONSTRUCTION_MODIFIER
      }
    }
    else if(type === $.STRUCTURE_CONTROLLER) {
      prio = $.PRIORITIES[$.WORK_REQUESTING][type]
    }
    else {
      prio = $.PRIORITIES[$.RESOURCE_REQUESTING][type]
    }
    return prio
  }

}

profiler.registerObject(Requesting, 'Requesting')
module.exports = Requesting

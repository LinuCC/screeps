import $ from '../constants'
import Queueing from './Queueing'
import hiveMind from '../hiveMind'
import Shiny from '../Shiny'
import profiler from 'screeps-profiler'

/**
 * Active Providers
 * Things that need to be taken care of, like mined resources that should be put
 * into the storage
 */
class ActiveProviding extends Queueing {

  constructor(room, queue = $.ACTIVE_PROVIDING) {
    super(room, queue)
  }

  /**
   * Generates a new Providing-item.
   *
   * Abstracts quite a bit and is somewhat intelligent.
   * If you pass a `provider` in data and you want energy from it or it only has
   * one resource, you only have to pass the prio and you are set.
   *
   * @param prio - If given as a function, it will execute it with the
   *    calculated hiveMind-data and the return-value will be used as the prio
   */
  newItem(data, prio, opts = {}) {
    let type = data.type
    let amount = data.amount
    if(!type) {
      const resourceData = this._calcResourceOf(data.provider)
      type = resourceData.type
      amount = amount || resourceData.amount
    }
    if(!amount) {
      amount = this._calcCarryAmountOf(data.provider, type)
    }
    const hiveMindData = {
      roomName: data.roomName || _.get(data.provider, ['pos', 'roomName']),
      objId: data.id || _.get(data.provider, ['id']) || undefined,
      x: data.x || _.get(data.provider, ['pos', 'x']) || undefined,
      y: data.y || _.get(data.provider, ['pos', 'y']) || undefined,
      type: type,
      amount: amount,
      assigned: false
    }
    if(typeof prio === 'function') {
      prio = prio(hiveMindData)
    }
    return super.newItem(hiveMindData, prio)
  }

  _calcResourceOf(provider) {
    let goods = new Shiny(provider).allGoods()
    _.each(goods, (amount, name)=> { if(amount === 0) { delete goods[name] } })
    const availableResourceTypes = Object.keys(goods)
    if(!availableResourceTypes.length) {
      return false
    }
    else if(availableResourceTypes.length === 1) {
      // If one resource is found, type is obvious
      const type = availableResourceTypes[0]
      return {type: type, amount: goods[type]}
    }
    else if(availableResourceTypes.includes(RESOURCE_ENERGY)) {
      // Default to Energy if more than one resource found
      return {type: RESOURCE_ENERGY, amount: goods[RESOURCE_ENERGY]}
    }
    else {
      // Else basically give up and return at least something
      log.orange(
        `Providing#calcTypeOf just returned ${availableResourceTypes[0]} ` +
        `for ${provider}`
      )
      const type = availableResourceTypes[0]
      return {type: type, amount: goods[type]}
    }
  }

  _calcCarryAmountOf(object, type) {
    return new Shiny(provider).goods(type)
  }

  itemDone(itemId) {
    super.itemDone(itemId)
  }

  itemGenerator() {

    const rooms = this.room.accessibleControllingRooms()
    let sources = []
    rooms.forEach((room)=> {
      // Resources
      sources = sources.concat(room.find(FIND_DROPPED_RESOURCES))
      // Energy Containers
      sources = sources.concat(room.find(
        FIND_STRUCTURES, {filter: this.filterNonVoidEnergyContainers}
      ))
    })

    if(sources.length) {
      for(let source of sources) {
        const existingItems = _.filter(
          hiveMind.allForRoom(source.room),
          {objId: source.id, type: RESOURCE_ENERGY}
        )
        // If existing items do not exist, create a new one
        // If existing items do exist, search for the one that isnt assigned
        // (meaning that it kinda represents this source) and change datt
        const sourceShiny = new Shiny(source)
        const needed = _.sum(existingItems, 'amount')
        let availableEnergy = sourceShiny.goods(RESOURCE_ENERGY) - needed

        const onNewItem = ()=> {
          if(availableEnergy > 0) {
            this.newItem(
              {amount: availableEnergy, provider: source},
              (data)=> (this._prioForShiny(sourceShiny, data.amount))
            )
          }
        }
        const onEditItem = (existingItem)=> {
          existingItem['amount'] += availableEnergy
          if(existingItem.amount < 0) {
            hiveMind.remove(existingItem.id)
          }
          else {
            this.queue.updatePrioById(
              existingItem.id, this._prioForShiny(
                new Shiny(Game.getObjectById(existingItem.objId)),
                existingItem.amount
              )
            )
          }
        }
        // Take negative availableEnergy into account and change the
        // existingItem based on that if necessary
        this.editMetaItemOrNewItem(onNewItem, onEditItem, existingItems)
      }
    }
  }

  _prioForShiny(shiny, amount) {
    let prio = (
      $.PRIORITIES[$.ACTIVE_PROVIDING][shiny.type()] -
      Math.floor(amount * $.PROVIDING_AMOUNT_MODIFIER)
    )
    if(this.room.name != shiny.obj.room.name) {
      prio += $.REMOTE_PRIORITY_PROVIDING_MODIFIER
    }
    return prio
  }

  filterNonVoidEnergyContainers = (object)=> (
    object.structureType == STRUCTURE_CONTAINER &&
    object.store[RESOURCE_ENERGY] > 0
  )
}

profiler.registerObject(ActiveProviding, 'ActiveProviding')
module.exports = ActiveProviding

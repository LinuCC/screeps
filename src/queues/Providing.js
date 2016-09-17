import $ from '../constants'
import Queueing from './Queueing'
import hiveMind from '../hiveMind'

/**
 * Active Providers
 * Things that need to be taken care of, like mined resources that should be put
 * into the storage
 */
class Providing extends Queueing {

  constructor(room, queue = $.CARRY) {
    super(room, queue)
  }

  /**
   * Generates a new Providing-item.
   */
  newItem(data, prio, opts = {}) {
    const type = data.type || _calcTypeOf(data.provider),
    hiveMindItem = {
      roomName: data.roomName || _.get(data.provider, ['pos', 'roomName']),
      id: data.id || _.get(data.provider, ['id']) || undefined
      x: data.x || _.get(data.provider, ['pos', 'x']) || undefined,
      y: data.y || _.get(data.provider, ['pos', 'y']) || undefined,
      type: type,
      amount: data.amount || this._calcCarryAmountOf(data.provider, type)
    }
  }

  _calcCarryAmountOf(object, type) {

  }

  itemDone(itemId) {
    super.itemDone(itemId)
  }

  itemGenerator() {
  }
}

module.exports = Providing

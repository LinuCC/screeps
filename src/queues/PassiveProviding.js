import $ from '../constants'
import Queueing from './Queueing'
import hiveMind from '../hiveMind'
import Shiny from '../Shiny'

/**
 * Passive Providers
 */
class PassiveProviding extends Queueing {

  constructor(room, queue = $.CARRY) {
    super(room, this.localQueue())
  }

  newItem(data, prio, opts = {}) {
  }

  localQueue() {
    const existingItems = allForRoom..........
    let structures = this.room.find(
      FIND_STRUCTURES, {filter: (struc)=> (
        (
          struc.structureType == STRUCTURE_STORAGE
        ) &&
        struc.store[resType] - (
          _.sum(
            _.filter(this.existingItems, (item)=> (
              item.fromSource.id == struc.id
            )), 'fromSource.amount'
          )
        ) > this.creepCarryAmount
      )}
    )
  }
}

module.exports = ActiveProviding

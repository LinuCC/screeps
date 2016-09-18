import $ from '../constants'
import Queueing from './Queueing'
import hiveMind from '../hiveMind'
import Shiny from '../Shiny'

/**
 * Passive Providers
 */
class PassiveProviding extends Queueing {

  constructor(room, queue = $.CARRY) {
    queue
  }

  newItem(data, prio, opts = {}) {
  }
}

module.exports = ActiveProviding

import hiveMind from '../hiveMind'
import PriorityQueue from '../PriorityQueue'

/**
 * Basic helper-class for Queueing stuff
 * Combines hiveMind & PriorityQueue for some noice helper-methods
 */
class Queueing {
  constructor(room, queue) {
    if(typeof room === 'string') {
      this.roomName = room
      this.room = Game.rooms[this.roomName]
    }
    else {
      this.roomName = room.name
      this.room = room
    }
    if(typeof queue === 'string') {
      this.queue = this.room.queue(queue)
    }
    else {
      this.queue = queue
    }
  }

  newItem(data, prio) {
    const itemId = hiveMind.push(data)
    this.queue.queue({id: itemId, prio: prio})
    return itemId
  }

  itemDone(itemId) {
    hiveMind.delete(itemId)
  }

  allItems() {
    if(_.isUndefined(this._allItems)) {
      this._allItems = hiveMind.allForRoom(this.room || this.roomName)
    }
    return this._allItems
  }

}

module.exports = Queueing

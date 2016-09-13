import hiveMind from '../hiveMind'
import PriorityQueue from '../PriorityQueue'

/**
 * Basic helper-class for Queueing stuff
 * Combines hiveMind & PriorityQueue for some noice helper-methods
 */
class Queueing {
  constructor(queueName, room) {
    this.room = room
    this.queue = room.queue(queueName)
  }

  newItem = (queue, data, prio)=> {
    const itemId = hiveMind.push(data)
    queue.push({id: itemId, prio: prio})
    return itemId
  }

  itemDone = (itemId)=> {
    hiveMind.delete(itemId)
  }

  allItems = ()=> (
    if(_.isUndefined(this._allItems)) {
      this._allItems = this.queue.map((queueItem)=> hiveMind.data[queueItem.id])
    }
    return this._allItems
  )

}

module.exports = Seeding

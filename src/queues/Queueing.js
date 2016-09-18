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
    else if(queue === null) {

    }
    else {
      this.queue = queue
    }
  }

  newItem(data, prio, queue = this.queue) {
    const itemId = hiveMind.push(data)
    queue.queue({id: itemId, prio: prio})
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

  filterQueue(filter) {
    return _.filter(this.queue, filter)
  }

  log() {
    /// TODO Make a nice log-output
    console.log(JSON.stringify(this.queue))
  }


  log(opts = {}) {
    const queue = opts.queue || this.queue
    if(!queue) {
      log.orange('No prioqueue!'); return
    }
    console.log(
      `<span style="color: #33aaff">` +
      `====== Queue: ${queue.constructor.name}</span>`
    )
    for(let queueItem of queue.data) {
      let item = Memory['hiveMind'][queueItem.id]
      if(!item) {
        continue
      }
      console.log(this._stringifyQueueItem(queueItem, item))
    }
  }

  _stringifyQueueItem(queueItem, hiveMindItem) {
    return (
      `    - <span style="color: orange">Item:</span> ` +
      `${JSON.stringify(hiveMindItem)}`
    )
  }

  getStructureName = (struc)=> {
    let name = false
    switch(struc.structureType) {
      case STRUCTURE_SPAWN: name = 'Spawn'; break
      case STRUCTURE_EXTENSION: name = 'Extension'; break
      case STRUCTURE_CONTROLLER: name = 'Controller'; break
      case STRUCTURE_TOWER: name = 'Tower'; break
      case STRUCTURE_RAMPART: name = 'Rampart'; break
      case STRUCTURE_CONTAINER: name = 'Container'; break
      case STRUCTURE_STORAGE: name = 'Storage'; break
      case STRUCTURE_WALL: name = 'Wall'; break
      case STRUCTURE_ROAD: name = 'Road'; break
      case STRUCTURE_LINK: name = 'Link'; break
      default: name = '???'; break
    }
    if(struc instanceof ConstructionSite) {
      return `ConstructionSite of ${name}`
    }
    else {
      return name
    }
  }

  /**
   * A meta-item is one which assigned-status has been set to false.
   * It basically is a queue-item with an overarching hiveMindItem from which
   * multiple hiveMind-items can be generated.
   */
  editMetaItemOrNewItem(onNewItem, onEditItem, existingItems) {
    if(!existingItems.length) {
      onNewItem()
    }
    else {
      const nonAssignedExistingItems = _.filter(
        existingItems, {assigned: false}
      )
      if(nonAssignedExistingItems.length) {
        onEditItem(nonAssignedExistingItems[0])
      }
      else {
        onNewItem()
      }
    }
  }
}

module.exports = Queueing

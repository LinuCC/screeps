import $ from '../constants'
import Queueing from './Queueing'
import hiveMind from '../hiveMind'

/**
 * Excavating sources
 */
class Excavating extends Queueing {

  constructor(room, queue = $.SPAWN) {
    super(room, queue)
  }

  /**
   * Generates a new Excavating-item.
   */
  newItem(data, prio, opts = {}) {
    hiveMindData = {
      roomName: data.roomName || _.get(data.requester, ['pos', 'roomName']),
      id: data.id || _.get(data.requester, ['id']) || undefined,
      x: data.x || _.get(data.requester, ['pos', 'x']) || undefined,
      y: data.y || _.get(data.requester, ['pos', 'y']) || undefined,
      assigned: false,
    }
  }

  itemGenerator() {
    if(this.room.memory.connectedRemoteRooms) {
      for(let remoteName in this.room.memory.connectedRemoteRooms) {
        const data = this.room.memory.connectedRemoteRooms[remoteName]
        if(data.parsed) {
          for(let source of data.sources) {
            let {x, y, id} = source
            let sourceItemExists = _.filter(
              hiveMind.allForRoom(this.room),
              {fromSource: {x: x, y: y, roomName: remoteName, id: id}}
            ).length > 0
            if(!sourceItemExists) {
              this.newItem(
                {x: x, y: y, roomName: remoteName, id: id},
                $.PRIORITIES[$.EXCAVATE][$.SOURCE] *
                $.REMOTE_PRIORITIES_MODIFIER
              )
            }
          }
        }
      }
    }
  }

}

module.exports = Excavating

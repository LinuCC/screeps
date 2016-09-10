import $ from './constants'
import hiveMind from './hiveMind'

/**
 * Inter-room control
 */
class Overseer {
  constructor() {

  }

  /**
   * Integrity check of the data
   */
  check() {
    this.removeOldHiveMindItems()
    this.maintainRoomMemory()
  }

  /**
   * Parse simple user-commands into more complex things
   */
  parseCommands() {
    //Parse flags into memory
    for(let flagName in Game.flags) {
      let flag = Game.flags[flagName]
      if(
        flag.color == $.FLAG_IDENTIFIERS.remoteRoom.color &&
        flag.secondaryColor == $.FLAG_IDENTIFIERS.remoteRoom.secondaryColor
      ) {
        let targetRoomName = null
        if(this.myMainRooms().map((r)=> r.name).includes(flag.name)) {
          targetRoomName = flag.name
        }
        if(this.generateRemoteRoom(flag.pos.roomName, targetRoomName)) {
          flag.remove()
        }
      }
    }
  }

  removeOldHiveMindItems = ()=> {
    let oldItemCount = 0
    nextItem:
    for(let itemId in hiveMind.data) {
      let item = hiveMind.data[itemId]
      for(let creepName in Game.creeps) {
        let creep = Game.creeps[creepName]
        if(creep.memory.item && creep.memory.item.id == item.id) {
          continue nextItem
        }
      }

      for(let roomName in Game.rooms) {
        let room = Game.rooms[roomName]
        if(
          room.memory.priorityQueues &&
          Object.keys(room.memory.priorityQueues).length &&
          Object.keys(room.memory.priorityQueues).some((queueName)=> (
            room.memory.priorityQueues[queueName].some((queueItem)=> (
              queueItem.id == item.id
            ))
          ))
        ) {
         continue nextItem
        }
        // if(room.memory.priorityQueues && room.memory.priorityQueues.length) {
        //   for(let queueName in room.memory.priorityQueues) {
        //     for(let queueItem in room.memory.priorityQueues[queueName]) {
        //       if(queueItem.id == item.id) {
        //         break checkItem
        //       }
        //     }
        //   }
        // }u
      }
      console.log(
        "<span style='color: #aadd33'>Item missing:</span>\n    ",
        JSON.stringify(item)
      )
      delete hiveMind.data[itemId]
      oldItemCount += 1
    }
    Memory.stats['hiveMind.oldItemCount'] = oldItemCount
  }

  maintainRoomMemory = ()=> {
    let rooms = this.myMainRooms()
    for(let room of rooms) {
      let mem = room.memory
      if(!mem.priorityQueues) { mem.priorityQueues = {} }
      for(let prioType of $.PRIO_QUEUES) {
        if(!mem.priorityQueues[prioType]) { mem.priorityQueues[prioType] = [] }
      }
      if(!mem.targetZergCount) { mem.targetZergCount = {} }
      for(let kind of $.ZERG_KINDS) {
        if(!mem.targetZergCount[kind]) {
          mem.targetZergCount[kind] = $.ROOM_DEFAULT_TARGET_ZERG_COUNT[kind]
        }
      }
      if(!mem.connectedRemoteRooms) { mem.connectedRemoteRooms = [] }
    }
  }

  generateRemoteRoom = (remoteRoomName, targetRoomName = null)=> {
    if(targetRoomName === null) {
      let generalRemotePos = new RoomPosition(
        $.ROOM_CENTER_X, $.ROOM_CENTER_Y, remoteRoomName
      )
      let candidates = this.myMainRooms()
      throw new Error('NOT IMPLEMENTED YET')
    }
    else {
      let targetRoom = Game.rooms[targetRoomName]
      if(!targetRoom) {throw new Error('targetRoom?')}
      if(!targetRoom.memory.connectedRemoteRooms[remoteRoomName]) {
        targetRoom.memory.connectedRemoteRooms[remoteRoomName] = {
          active: true,
          parsed: false
        }
      }
      return true
    }
  }

  /**
   * Rooms with spawns in them
   */
  myMainRooms = ()=> {
    return _.uniq(_.mapValues(Game.spawns, (spawn)=> spawn.room))
  }
}

module.exports = Overseer

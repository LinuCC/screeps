import $ from './constants'
import PriorityQueue from './PriorityQueue'
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
            room.memory.priorityQueues[queueName].some((queueItem)=> {
              const queueItemData = hiveMind.data[queueItem.id]
              return (
                queueItem.id == item.id || (
                  queueName === $.SPAWN &&
                  _.get(queueItemData, ['memory', 'item', 'id']) === item.id
                )
              ) &&
              // referred items still exist
              // If id is set and we can see the room, we can check if the item
              // still exists
              (
                (
                  (
                    // not able to check if item exist because we dont know the
                    // room or the id
                    !_.get(queueItemData, ['fromSource', 'id']) ||
                    !Game.rooms[_.get(queueItemData, ['fromSource', 'roomName'])]
                  ) || Game.getObjectById(queueItemData.fromSource.id)
                ) &&
                (
                  (
                    !_.get(queueItemData, ['toTarget', 'id']) ||
                    !Game.rooms[_.get(queueItemData, ['toTarget', 'roomName'])]
                  ) || Game.getObjectById(queueItemData.toTarget.id)
                )
              )
            })
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

    for(let roomName in Game.rooms) {
      let room = Game.rooms[roomName]
      if(!room.memory.priorityQueues) { continue }
      for(let queueName in room.memory.priorityQueues) {
        let queueData = room.memory.priorityQueues[queueName]
        for(let queueItem of queueData) {
          if(!hiveMind.data[queueItem.id]) {
            console.log(
              "<span style='color: #ddaa33'>Item missing:</span>\n    ",
              JSON.stringify(queueItem)
            )
            new PriorityQueue(queueData).removeBy({id: queueItem.id})
          }
        }
      }
    }

    Memory.stats['hiveMind.oldItemCount'] = oldItemCount
  }

  maintainRoomMemory = ()=> {
    // Only main rooms
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
      if(!mem.connectedRemoteRooms) { mem.connectedRemoteRooms = {} }
      if(!mem.links) { mem.links = {sources: [], providers: []} }
    }

    //For all rooms
    for(let roomName in Game.rooms) {
      let room = Game.rooms[roomName]
      let mem = room.memory
      if(!mem.specialState) {
        mem.specialState = {
          [$.UNDER_ATTACK]: false
        }
      }
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
    return _.uniq(_.map(Game.spawns, (spawn)=> spawn.room))
  }
}

module.exports = Overseer

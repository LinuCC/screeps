import $ from '../constants'
import Queueing from '../Queueing'

/**
 * Claim, reserve, downgrade Controllers of other rooms
 */
class Seeding extends Queueing {

  constructor(room) {
    super($.SEED, room)
  }

  TYPES: [
    $.CLAIM,
    $.RESERVE,
    $.DOWNGRADE
  ]

  /**
   * Generates a new Seeding-item.
   * @param opts - {
   *      room: <Room>(If given, will calculate missing values based on this)
   *   }
   */
  newItem = (data, prio)=> {
    // Set toTarget if not defined
    if(!data.toTarget) {
      let controller = this.room.controller()
      if(!controller) { return ERR_NOT_FOUND }
      data.toTarget = {
        data.toTarget.x = controller.pos.x
        data.toTarget.y = controller.pos.y
        data.toTarget.roomName = room.name
      }
    }
    // Calculate the steps
    let steps = null
    if(data.steps) {
      steps = data.steps
    }
    else {
      let controller = this.room.controller()
      if(!controller) { return ERR_NOT_FOUND }
      steps = this.calculateStepsFromSpawnOf(this.room, controller.pos)
    }
    // Set the data
    let hiveMindData = {
      type: data.type || $.RESERVE,
      amount: data.amount || 0, // amount of 0 = all ye can
      steps: steps,
      toTarget: {
        x: _.get(data, ['toTarget', 'x']),
        y: _.get(data, ['toTarget', 'y']),
        roomName: _.get(data, ['toTarget', 'roomName']),
      }
    }
    return super.newItem(this.queue, data, prio)
  }

  itemDone = (itemId)=> {
    super.itemDone(itemId)
  }

  itemGenerator = ()=> {
    // Reserve remote rooms
    const remoteRooms = this.room.memory.connectedRemoteRooms
    for(remoteName of remoteRooms) {
      let remoteRoomData = remoteRooms[remoteName]
      if(remoteRoomData.parsed) {
        const remoteRoom = Game.rooms[remoteName]
        if(remoteRoom) {
          const controller = remoteRoom.controller()
          if(
            controller &&
            controller.ticksMax - controller.ticksToDecay > 1000
          ) {
            const pos = controller.pos
            const itemsExist = _.filter(this.allItems(), {
              toTarget: {x: pos.x, y: pos.y, id: controller.id}
            }).length > 0
            if(!itemsExist) {
              this.newItem()
            }
          }
        }
        else {
          // Can't see, dunno
        }
      }
      else {
        // Room should be looked at, but not my task
      }
    }
  }

  calculateStepsFromSpawnOf = (room, targetPos)=> {
    //TODO Implement me
    return 0
  }
}

module.exports = Seeding

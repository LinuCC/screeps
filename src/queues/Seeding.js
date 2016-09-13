import $ from '../constants'
import Queueing from './Queueing'

/**
 * Claim, reserve, downgrade Controllers of other rooms
 */
class Seeding extends Queueing {

  constructor(room, queue = $.SEED) {
    super(room, queue)
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
  newItem(data, prio, controller) {
    // Set toTarget if not defined
    if(!data.toTarget) {
      if(!controller) { return ERR_NOT_FOUND }
      data.toTarget = {
        x: controller.pos.x,
        y: controller.pos.y,
        id: controller.id,
        roomName: controller.room.name
      }
    }
    // Calculate the steps
    let steps = null
    if(data.steps) {
      steps = data.steps
    }
    else {
      if(!controller) { return ERR_NOT_FOUND }
      steps = this.calculateStepsFromSpawnOf(this.room, controller.pos)
    }
    // Set the data
    const hiveMindData = {
      type: data.type || $.RESERVE,
      amount: data.amount || 0, // amount of 0 = all ye can
      steps: steps,
      byRoomName: this.room.name,
      toTarget: {
        x: _.get(data, ['toTarget', 'x']),
        y: _.get(data, ['toTarget', 'y']),
        roomName: _.get(data, ['toTarget', 'roomName']),
        id: _.get(data, ['toTarget', 'id'])
      }
    }
    return super.newItem(hiveMindData, prio)
  }

  itemDone(itemId) {
    super.itemDone(itemId)
  }

  itemGenerator() {
    // Reserve remote rooms
    const remoteRooms = this.room.memory.connectedRemoteRooms
    for(let remoteName in remoteRooms) {
      let remoteRoomData = remoteRooms[remoteName]
      if(remoteRoomData.parsed) {
        const remoteRoom = Game.rooms[remoteName]
        if(remoteRoom) {
          const controller = remoteRoom.controller
          if(controller) {
            const pos = controller.pos

            let existingItems = _.filter(this.allItems(), {
              toTarget: {x: pos.x, y: pos.y, roomName: pos.roomName}
            })
            while((
                $.CONTROLLER_RESERVE_MAX - (
                  (_.get(controller, ['reservation', 'ticksToEnd']) || 0) +
                  _.sum(existingItems, 'amount')
                )
              ) > 1000 &&
              existingItems.length < 10
            ) {
              log.cyan(`Generating Reserve-item for room ${controller.room.name}`)
              console.log(`  Amount: ${JSON.stringify(_.sum(existingItems, 'amount'))}`)
              console.log(`  Calc: ${$.CONTROLLER_RESERVE_MAX - (
                  (_.get(controller, ['reservation', 'ticksToEnd']) || 0) +
                  _.sum(existingItems, 'amount')
                )}`)
              console.log(`ExistingItems: ${JSON.stringify(existingItems)}`)
              this.newItem({
                  type: $.RESERVE,
                  amount: 1000
                },
                $.PRIORITIES[$.SEED][$.RESERVE],
                controller
              )
              existingItems.push({amount: 1000})
            }
          }
          else {
            // Room has no controller, maybe a sourcekeeper-room?
          }
        }
        else {
          // Can't see, dunno
        }
      }
      else {
        // Room-Layout should be investigated, but not my task
      }
    }
  }

  /**
   * TODO Probably doesnt belong here
   */
  itemVerwertor() {
    if(this.queue.itemCount() > 0) {
      while(queue.peek()) {
        const queueItem = queue.peek()
        const itemData = hiveMind.data[queueItem.id]
        const spawnPriority = $.PRIORITIES[$.SPAWN][$.KIND_CORRUPTOR]
        const memory = {
          kind: $.KIND_CORRUPTOR,
          memory: {
            role: $.ZERG,
            item: queueItem
          }
        }
        const res = this.room.pushToQueue(
          $.SPAWN,
          {memory: creepMemory, kind: creepMemory.kind},
          spawnPriority
        )
        if(res) {
          queue.dequeue()
        }

      }
    }
  }


  spawnCreep(spawnPriority, creepMemory, opts = {}) {
    if(!_.isUndefined(opts.assignItem)) {
      creepMemory.item = creepMemory.item || {}
      let itemId = hiveMind.push(opts.assignItem.data)
      creepMemory.item.id = itemId
      if(!_.isUndefined(opts.assignItem.priority)) {
        creepMemory.item.prio = opts.assignItem.priority
      }
      else {
        creepMemory.item.prio = 0
      }
    }
    if(_.isUndefined(creepMemory.myRoomName)) {
      creepMemory.myRoomName = this.room.name
    }
    this.room.pushToQueue(
      $.SPAWN,
      {memory: creepMemory, kind: creepMemory.kind},
      spawnPriority
    )
  }


  calculateStepsFromSpawnOf(room, targetPos) {
    //TODO Implement me
    return 0
  }
}

module.exports = Seeding

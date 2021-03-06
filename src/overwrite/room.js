import helper from './../helper'
import hiveMind from './../hiveMind'
import PriorityQueue from './../PriorityQueue'
import $ from './../constants'

Room.prototype.spawns = function(filter = {}) {
  let findFilter = null
  if(typeof filter === 'function') {
    findFilter = (s)=> (s.structureType === STRUCTURE_SPAWN && filter(s))
  }
  else {
    findFilter = Object.assign({structureType: STRUCTURE_SPAWN}, filter)
  }
  let options = {filter: findFilter}
  return this.find(FIND_MY_STRUCTURES, options)
}

Room.prototype.queue = function(queueName) {
  return new PriorityQueue(this.memory.priorityQueues[queueName])
}

Room.prototype.pushToQueue = function(queue, item, priority) {
  if(typeof queue == 'string') {
    if(!this.memory.priorityQueues[queue]) { throw new Error('Queue?') }
    queue = new PriorityQueue(this.memory.priorityQueues[queue])
  }

  if(queue) {
    let itemId = hiveMind.push(item)
    let queueData = {id: itemId, prio: priority}
    queue.queue(queueData)
    return itemId
  }
  else {
    throw new Error('Queue?')
  }
}

Room.prototype.drawCoordinates = function(coordinates) {
  for (let i = 0, len = coordinates.length; i < len; i++) {
    let coordinate = helper.decodeCoordinate(coordinates, i)
    this.createFlag(this.posByXY(coordinate), `${coordinate.x}-${coordinate.y}`)
  }
}

Room.prototype.clearDrawings = function() {
  let flags = this.find(FIND_FLAGS, {filter: {color: COLOR_WHITE}})
  for(flag of flags) {
    flag.remove()
  }
}

Room.prototype.posByXY = function({x, y}) {
  return new RoomPosition(x, y, this.name)
}

Room.prototype.maxSpawnCost = function() {
  throw new Error('WATT IS EnerGYMAZ')
  return _.sum(
    room.find(FIND_MY_STRUCTURES, {filter: (struc)=> (
      struc.structureType == STRUCTURE_EXTENSION ||
      struc.structureType == STRUCTURE_SPAWN
    )}),
    'energyMax'
  )
}

// TODO
Room.prototype.safeArea = function() {
  return this.posByXY({x: $.ROOM_CENTER_X, y: $.ROOM_CENTER_Y})
}

Room.prototype.accessibleControllingRooms = function() {
  let controlledRooms = [this]
  // Control remote rooms too
  for(let remoteName in (this.memory.connectedRemoteRooms || [])) {
    let data = this.memory.connectedRemoteRooms[[remoteName]]
    if(data.parsed && data.active) {
      if(Game.rooms[remoteName]) {
        controlledRooms.push(Game.rooms[remoteName])
      }
    }
  }
  return controlledRooms
}

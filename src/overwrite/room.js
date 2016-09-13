import helper from './../helper'
import hiveMind from './../hiveMind'
import PriorityQueue from './../PriorityQueue'

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
  return new RoomPostion(x, y, this.name)
}

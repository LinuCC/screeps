import hiveMind from './../hiveMind'
import PriorityQueue from './../priorityQueue'

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

Room.prototype.queue = function(name) {
  return new PriorityQueue(this.memory.priorityQueues[name])
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

import hiveMind from './../hiveMind'
import PriorityQueue from './../priorityQueue'

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

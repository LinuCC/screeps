class Stats {
  constructor() {

  }

  persist = ()=> {
    Memory.stats = {}
    Memory.stats[`hiveMind.count`] = Object.keys(Memory.hiveMind).length
    Memory.stats[`hiveMind.index`] = Memory.hiveMindIndex
    for(let roomName in Game.rooms) {
      let room = Game.rooms[roomName]
      for(let queueName in room.memory.priorityQueues) {
        let length = room.memory.priorityQueues[queueName].length
        Memory.stats[`room.${roomName}.hiveMind.priorityQueues.${queueName}`] =
          length
        Memory.stats[`room.${roomName}.zergs.${queueName}`] = _.filter(
          room.find(FIND_MY_CREEPS, {filter: (c)=> (
            c.memory.kind && c.memory.kind[0] == queueName
          )})
        ).length
      }
    }
  }
}

module.exports = Stats

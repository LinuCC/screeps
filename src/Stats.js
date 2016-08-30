class Stats {
  constructor() {

  }

  begin = ()=> {
    Memory.stats = {}
  }

  persist = ()=> {
    Memory.stats[`hiveMind.count`] = Object.keys(Memory.hiveMind).length
    Memory.stats[`hiveMind.index`] = Memory.hiveMindIndex
    for(let roomName in Game.rooms) {
      let room = Game.rooms[roomName]
      let resStorages = room.find(FIND_STRUCTURES, {filter: (struc)=> (
        struc.structureType == STRUCTURE_STORAGE ||
        struc.structureType == STRUCTURE_CONTAINER
      )})
      let energyStorages = room.find(FIND_MY_STRUCTURES, {filter: (struc)=> (
        struc.structureType == STRUCTURE_SPAWN ||
        struc.structureType == STRUCTURE_EXTENSION
      )})
      // Queues
      for(let queueName in room.memory.priorityQueues) {
        let length = room.memory.priorityQueues[queueName].length
        Memory.stats[`room.${roomName}.hiveMind.priorityQueues.${queueName}`] =
          length
        Memory.stats[`room.${roomName}.zergs.${queueName}`] = _.filter(
          room.find(FIND_MY_CREEPS, {filter: (c)=> (
            c.memory.kind && c.memory.kind[0] == queueName
          )})
        ).length
        // Gets set by creeps vacation() method
        if(!Memory.stats[`room.${roomName}.zergStats.${queueName}.idleTicks`]) {
          Memory.stats[`room.${roomName}.zergStats.${queueName}.idleTicks`] = 0
        }
      }
      if(resStorages.length) {
        Memory.stats[`room.${roomName}.resources.storage.energy`] = (
          resStorages.reduce(
            (memo, storage)=> (memo + storage.store[RESOURCE_ENERGY]), 0
          ) +
          _.sum(energyStorages, 'energy')
        )
      }
      if(room.controller) {
        Memory.stats[`room.${roomName}.upgrade.progress`] =
          room.controller.progress
        Memory.stats[`room.${roomName}.upgrade.progressTotal`] =
          room.controller.progressTotal
      }

      Memory.stats['cpu.bucket'] = Game.cpu.bucket
      Memory.stats['cpu.limit'] = Game.cpu.limit
      Memory.stats['cpu.getUsed'] = Game.cpu.getUsed()
      Memory.stats['gcl.progress'] = Game.gcl.progress
      Memory.stats['gcl.progressTotal'] = Game.gcl.progressTotal
      Memory.stats['gcl.level'] = Game.gcl.level
    }
  }
}

module.exports = Stats

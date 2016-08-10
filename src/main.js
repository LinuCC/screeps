import defense from './defense'
import roleHarvester from './role/harvester'
import roleUpgrader from './role/upgrader'
import roleBuilder from './role/builder'
import roleExcavator from './role/excavator'
import roleRepairer from './role/repairer'
import roleTransporter from './role/transporter'
import spawnCreepWatcher from './spawn/creepWatcher'
import roleFighter from './role/fighter'
import roleHealer from './role/healer'
import roleRangedFighter from './role/rangedFighter'
import roleAssimilator from './role/assimilator'
import PriorityQueue from './priorityQueue'
import hiveMind from './hiveMind'
import Overlord from './Overlord'
import Zergling from './role/Zergling'
import Spawner from './spawner'
import 'babel-preset-es2017/polyfill'

// Maximum range for a remote mine, assuming 100% effectiveness: 190 squares

// QueueData:
// data[roomName][id]

module.exports.loop = ()=> {

  hiveMind.init()
  PathFinder.use(true)

  if(Game.time % 750 == 0) {
    new Spawner().reserver(Game.spawns['VV'])
  }

  global.Spawner = Spawner
  global.Overlord = Overlord
  global.logHiveMindOf = (spawnName)=> {
    new Overlord(Game.spawns[spawnName].room.name).logQueuedItems()
  }
  global.resetHive = ()=> {
    Memory.hiveMind = {}
    Memory.hiveMindIndex = 0
    for(let roomName in Game.rooms) {
      let room = Game.rooms[roomName]
      if(!room.memory.priorityQueues) { continue }
      for(let queueName in room.memory.priorityQueues) {
        room.memory.priorityQueues[queueName] = []
      }
    }
    for(let creepName in Game.creeps) {
      let creep = Game.creeps[creepName]
      delete creep.memory.item
      delete creep.memory.sourcing
      delete creep.memory.kind
    }
  }

  try {
    for(let name in Game.spawns) {
      spawnCreepWatcher.run(Game.spawns[name])
      defense.defendRoom(Game.spawns[name].room)
    }

    try {
      for(let roomName in Game.rooms) {
        let room = Game.rooms[roomName]
        let priorityQueues = false
        if(
          room.memory.priorityQueues &&
          Object.keys(room.memory.priorityQueues).length > 0
        ) {
          priorityQueues = _.mapValues(room.memory.priorityQueues, (queue)=> (
            new PriorityQueue(queue)
          ))
        }
        let overlord = new Overlord(roomName)
        if(priorityQueues) {
          overlord.update(priorityQueues)
        }
        let zerglings = room.find(FIND_MY_CREEPS, {filter: (c)=> (
          c.memory.role == 'zergling'
        )})
        if(zerglings.length > 0) {
          zerglings.forEach((zerglingCreep)=> {
            let zergling = new Zergling(zerglingCreep)
            zergling.run(priorityQueues)
          })
        }
      }
    }
    catch(e) {
      console.log(`${e.name}: ${e.message} - ${e.stack}`);
    }

    for(let name in Game.creeps) {
      let creep = Game.creeps[name];
      if(creep.memory.role == 'harvester') {
        roleHarvester.run(creep)
      }
      else if(creep.memory.role == 'transporter') {
        roleTransporter.run(creep)
      }
      else if(creep.memory.role == 'upgrader') {
        roleUpgrader.run(creep)
      }
      else if(creep.memory.role == 'builder') {
        roleBuilder.run(creep)
      }
      else if(creep.memory.role == 'excavator') {
        roleExcavator.run(creep)
      }
      else if(creep.memory.role == 'repairer') {
        roleRepairer.run(creep)
      }
      else if(creep.memory.role == 'fighter') {
        roleFighter.run(creep)
      }
      else if(creep.memory.role == 'rangedFighter') {
        roleRangedFighter.run(creep)
      }
      else if(creep.memory.role == 'healer') {
        roleHealer.run(creep)
      }
      else if(creep.memory.role == 'assimilator') {
        roleAssimilator.run(creep)
      }
      else if(creep.memory.role == 'zergling') {

      }
      else {
        console.log("No role for ${creep.name}!")
      }
    }
  }
  catch(e) {
    console.log(`${e.name}: ${e.message} - ${e.stack}`);
  }
  finally {
    hiveMind.save()
  }
};

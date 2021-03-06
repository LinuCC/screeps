import './overwrite/room'
import './overwrite/creep'

import $ from './constants'
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
import roleSweeper from './role/sweeper'
import PriorityQueue from './PriorityQueue'
import hiveMind from './hiveMind'
import Overlord from './Overlord'
import Overseer from './Overseer'
import Zergling from './role/Zergling'
import Spawner from './spawner'
import Stats from './Stats'
import 'babel-preset-es2017/polyfill'
import profiler from 'screeps-profiler'
import helper from './helper'

import Queueing from './queues/Queueing'
import Seeding from './queues/Seeding'
import Requesting from './queues/Requesting'
import ActiveProviding from './queues/ActiveProviding'
import Excavating from './queues/Excavating'


// Maximum range for a remote mine, assuming 100% effectiveness: 190 squares

// QueueData:
// data[roomName][id]

profiler.enable()

module.exports.loop = ()=> profiler.wrap(()=> {

  hiveMind.init()
  PathFinder.use(true)
  let stats = new Stats()
  stats.begin()

  if(Game.time % 50 == 0) {
    spawnCreepWatcher.cleanupMemory()
  }
  if(Game.time % 5 == 0) {
    // Logging purposes
    // log.cyan('Removing Old HiveMindItems')
    // new Overlord('NoFrigginRoom').removeOldHiveMindItems()
    new Overseer().check()
  }
  if(Game.time % 3 === 0) {
    for(let room of new Overseer().myMainRooms()) {
      let seeder = new Seeding(room)
      seeder.itemGenerator()
      seeder.itemVerwertor()
    }
  }

  modwide.h = helper
  modwide.$ = $
  modwide.Spawner = Spawner
  modwide.Overlord = Overlord
  modwide.hiveMind = hiveMind
  modwide.logHiveMindOf = (spawnName)=> {
    new Overlord(Game.spawns[spawnName].room.name).logQueuedItems()
  }
  modwide.Queueing = Queueing
  modwide.Seeding = Seeding
  modwide.Requesting = Requesting
  modwide.ActiveProviding = ActiveProviding
  modwide.Excavating = Excavating
  new Overseer().parseCommands()
  modwide.resetHive = ()=> {
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
  modwide.setMissingCreepRoles = (role = $.ROLE_ZERG)=> {
    for(let creepName in Game.creeps) {
      let creep = Game.creeps[creepName]
      if(!creep.memory.role) {
        creep.memory.role = role
      }
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
        let specialRoomState = room.memory.specialState
        let priorityQueues = false
        if(
          room.memory.priorityQueues &&
          Object.keys(room.memory.priorityQueues).length > 0
        ) {
          priorityQueues = _.mapValues(room.memory.priorityQueues, (queue)=> (
            new PriorityQueue(queue)
          ))
        }
        if(Game.time % 3 == 0) {
          let overlord = new Overlord(roomName)
          if(priorityQueues) {
            overlord.update(priorityQueues)
          }
        }
        let zerglings = room.find(FIND_MY_CREEPS, {filter: (c)=> (
          c.memory.role == 'zergling' || // TODO remove zergling
          c.memory.role == $.ROLE_ZERG
        )})
        if(zerglings.length > 0) {
          zerglings.forEach((zerglingCreep)=> {
            let zergling = new Zergling(zerglingCreep)
            zergling.run(priorityQueues, specialRoomState)
          })
        }

        if(room.memory.links && room.memory.links.providers) {
          nextTarget:
          for(let target of room.memory.links.providers) {
            let targetLink = Game.getObjectById(target)
            if(targetLink.energy < targetLink.energyCapacity) {
              if(room.memory.links && room.memory.links.sources.length) {
                for(let source of room.memory.links.sources) {
                  let sourceLink = Game.getObjectById(source)
                  if(sourceLink.energy > 0) {
                    sourceLink.transferEnergy(targetLink)
                    continue nextTarget
                  }
                }
              }
            }
          }
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
      else if(creep.memory.role == $.ROLE_ZERG) {

      }
      else if(creep.memory.role == $.KIND_SWEEPER) {
        roleSweeper.run(creep)
      }
      else {
        creep.say("ROLE?!")
        console.log("No role for ${creep.name}!")
      }
    }
  }
  catch(e) {
    console.log(`${e.name}: ${e.message} - ${e.stack}`);
  }
  finally {
    hiveMind.save()
    stats.persist()
  }
});

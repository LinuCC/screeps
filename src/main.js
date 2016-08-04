import defense from './defense'
import roleHarvester from './role/harvester'
import roleUpgrader from './role/upgrader'
import roleBuilder from './role/builder'
import roleExcavator from './role/excavator'
import roleRepairer from './role/repairer'
import roleTransporter from './role/transporter'
import spawnCreepWatcher from './spawn/creepWatcher'
import roleMaintainer from './role/maintainer'
import roleFighter from './role/fighter'
import roleHealer from './role/healer'
import roleRangedFighter from './role/rangedFighter'
import roleAssimilator from './role/assimilator'
import PriorityQueue from './priorityQueue'
import 'babel-preset-es2017/polyfill'

// Maximum range for a remote mine, assuming 100% effectiveness: 190 squares

PathFinder.use(true)

module.exports.loop = ()=> {

  global.lol = PriorityQueue

  for(let name in Game.spawns) {
    spawnCreepWatcher.run(Game.spawns[name])
    defense.defendRoom(Game.spawns[name].room)
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
    else if(creep.memory.role == 'maintainer') {
      roleMaintainer.run(creep)
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
    else {
      console.log("No role for ${creep.name}!")
    }
  }
};

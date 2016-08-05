class Spawner {
  rebootHarvester = (spawn)=> {
    return Game.spawns[spawn.name].createCreep([WORK, CARRY, CARRY, MOVE, MOVE], 'Harvester' + this.newCreepIndex(), {role: 'harvester'})
  }
  harvester = (spawn)=> {
    if(spawn.name == "VV") {
      return Game.spawns[spawn.name].createCreep([WORK, WORK, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE], 'Harvester' + this.newCreepIndex(), {role: 'harvester'})
    }
    else {
      return Game.spawns[spawn.name].createCreep([WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE], 'Harvester' + this.newCreepIndex(), {role: 'harvester'})
    }
  }
  excavator = (spawn, fromSource)=> {
    return Game.spawns[spawn.name].createCreep([WORK, WORK, WORK, WORK, WORK, WORK, MOVE], 'Excavator' + this.newCreepIndex(), {role: 'excavator', fromSource: fromSource})
  }
  upgrader = (spawn)=> {
    if(spawn.name == "VV") {
      return Game.spawns[spawn.name].createCreep([WORK, WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE], 'Upgrader' + this.newCreepIndex(), {role: 'upgrader'})
    }
    else {
      return Game.spawns[spawn.name].createCreep([WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE], 'Upgrader' + this.newCreepIndex(), {role: 'upgrader'})
    }
  }
  builder = (spawn)=> {
    if(spawn.name == "VV") {
      return Game.spawns[spawn.name].createCreep( [WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE], 'Builder' + this.newCreepIndex(), {role: 'builder'})
    }
    else {
      return Game.spawns[spawn.name].createCreep( [WORK, WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE], 'Builder' + this.newCreepIndex(), {role: 'builder'})
    }
  }
  repairer = (spawn)=> {
    return Game.spawns[spawn.name].createCreep( [WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE], 'Repairer' + this.newCreepIndex(), {role: 'repairer'})
  }
  fighter = (spawn)=> {
    return Game.spawns[spawn.name].createCreep( [MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK], 'Fighter' + this.newCreepIndex(), {role: 'fighter'})
  }
  rangedFighter = (spawn)=> {
    return Game.spawns[spawn.name].createCreep( [MOVE, MOVE, MOVE, MOVE, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK], 'RangedFighter' + this.newCreepIndex(), {role: 'rangedFighter'})
  }
  healer = (spawn)=> {
    return Game.spawns[spawn.name].createCreep( [HEAL, HEAL, HEAL, HEAL, MOVE, MOVE, MOVE, MOVE], 'Healer' + this.newCreepIndex(), {role: 'healer'})
  }
  assimilator = (spawn)=> {
    return Game.spawns[spawn.name].createCreep( [CLAIM, CLAIM, CLAIM, MOVE, MOVE, MOVE], 'Assi' + this.newCreepIndex(), {role: 'assimilator'})
  }

  transporter = (spawn, {fromSource, toTarget, sourcePos})=> {
    const source = Game.getObjectById(fromSource)
    const target = Game.getObjectById(toTarget)

    // ADD CALCULATION (With `PathFinder`) FOR MODULES HERE

    return Game.spawns[spawn.name].createCreep([WORK, WORK, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE], 'Transporter' + this.newCreepIndex(), {role: 'transporter', fromSource: fromSource, toTarget: toTarget, sourcePos: sourcePos})
  }

  zergling = (spawn)=> {
    return Game.spawns[spawn.name].createCreep([WORK, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE], 'Zergling' + this.newCreepIndex(), {role: 'zergling'})
  }

  newCreepIndex = function() {
    let index = Memory.creepIndex
    Memory.creepIndex += 1
    return index
  }
};

module.exports = Spawner

class Spawner {
  rebootHarvester = (spawn)=> {
    return Game.spawns[spawn.name].createCreep([WORK, CARRY, CARRY, MOVE, MOVE], 'Harvester' + this.newCreepIndex(), {role: 'harvester'})
  }
  harvester = (spawn)=> {
    return Game.spawns[spawn.name].createCreep([WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE], 'Harvester' + this.newCreepIndex(), {role: 'harvester'})
  }
  excavator = (spawn, fromSource)=> {
    return Game.spawns[spawn.name].createCreep([WORK, WORK, WORK, WORK, WORK, MOVE], 'Excavator' + this.newCreepIndex(), {role: 'excavator', fromSource: fromSource})
  }
  upgrader = (spawn)=> {
    return Game.spawns[spawn.name].createCreep([WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE], 'Upgrader' + this.newCreepIndex(), {role: 'upgrader'})
  }
  builder = (spawn)=> {
    return Game.spawns[spawn.name].createCreep( [WORK, WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE], 'Builder' + this.newCreepIndex(), {role: 'builder'})
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
  reserver = (spawn)=> {
    return Game.spawns[spawn.name].createCreep( [CLAIM, MOVE], 'Assi' + this.newCreepIndex(), {role: 'assimilator'})
  }

  transporter = (spawn, {fromSource, toTarget, sourcePos})=> {
    const source = Game.getObjectById(fromSource)
    const target = Game.getObjectById(toTarget)

    let body = this.calcCreepBody(spawn.room, [WORK, WORK, CARRY, CARRY, CARRY], 0, false)

    return Game.spawns[spawn.name].createCreep(body, 'Transporter' + this.newCreepIndex(), {role: 'transporter', fromSource: fromSource, toTarget: toTarget, sourcePos: sourcePos})
  }

  drone = (spawn)=> {
    let body = this.calcCreepBody(spawn.room, [CARRY])
    return Game.spawns[spawn.name].createCreep(body, 'Drone' + this.newCreepIndex(), {role: 'zergling', kind: [CARRY]})
  }
  zergling = (spawn)=> {
    let body = this.calcCreepBody(spawn.room, [WORK, WORK, WORK, CARRY, CARRY])
    return Game.spawns[spawn.name].createCreep(body, 'Zergling' + this.newCreepIndex(), {role: 'zergling', kind: [WORK, CARRY]})
  }

  newCreepIndex = function() {
    let index = Memory.creepIndex
    Memory.creepIndex += 1
    return index
  }

  calcCreepBody = (room, parts, maxCost = 0, usingStreet = true)=> {
    let partCost = {
      [WORK]: 100,
      [CARRY]: 50,
      [MOVE]: 50
    }
    let roomMaxCost = _.sum(
      room.find(FIND_MY_STRUCTURES, {filter: (struc)=> (
        struc.structureType == STRUCTURE_EXTENSION ||
        struc.structureType == STRUCTURE_SPAWN
      )}),
      'energy'
    )
    let max = (maxCost != 0) ? maxCost : roomMaxCost
    let partBlockCost = parts.reduce((memo, part)=> (memo + partCost[part]), 0)
    let moveRatio = (usingStreet) ? 1/2 : 1
    let movesPerBlock = (parts.length * moveRatio)
    let moveCost = movesPerBlock * partCost[MOVE]
    // We should add one MOVE to the 6 calculated MOVE if we have 13 parts
    let hiddenMoveCost = (movesPerBlock % 1 > 0) ? partCost[MOVE] / 2 : 0
    let wholeBlockCost = partBlockCost + moveCost
    let maxBlockCount = Math.floor(50 / (parts.length + movesPerBlock))
    let blockCount = Math.floor((max - hiddenMoveCost) / wholeBlockCost)
    blockCount = (maxBlockCount < blockCount) ? maxBlockCount : blockCount
    let moveBlockCount = Math.ceil(movesPerBlock * blockCount)
    let body = []
    _.range(moveBlockCount).forEach(()=> body.push(MOVE))
    for(let i = 0; i < blockCount; i += 1) {
      body = body.concat(parts)
    }
    return body
  }

};

module.exports = Spawner

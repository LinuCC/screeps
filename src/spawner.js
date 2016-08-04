const spawner = {
    rebootHarvester: function() {
        return Game.spawns['Underground Traaains'].createCreep([WORK, CARRY, CARRY, MOVE, MOVE], 'Harvester' + this.newCreepIndex(), {role: 'harvester'})
    },
    harvester: function() {
        return Game.spawns['Underground Traaains'].createCreep([WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE], 'Harvester' + this.newCreepIndex(), {role: 'harvester'})
    },
    excavator: function(fromSource) {
        return Game.spawns['Underground Traaains'].createCreep([WORK, WORK, WORK, WORK, WORK, WORK, MOVE], 'Excavator' + this.newCreepIndex(), {role: 'excavator', fromSource: fromSource})
    },
    upgrader: function() {
        return Game.spawns['Underground Traaains'].createCreep([WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE], 'Upgrader' + this.newCreepIndex(), {role: 'upgrader'})
    },
    builder: function() {
        return Game.spawns['Underground Traaains'].createCreep( [WORK, WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE], 'Builder' + this.newCreepIndex(), {role: 'builder'})
    },
    repairer: function() {
        return Game.spawns['Underground Traaains'].createCreep( [WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE], 'Repairer' + this.newCreepIndex(), {role: 'repairer'})
    },
    fighter: function() {
        return Game.spawns['Underground Traaains'].createCreep( [MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK], 'Fighter' + this.newCreepIndex(), {role: 'fighter'})
    },
    rangedFighter: function() {
        return Game.spawns['Underground Traaains'].createCreep( [MOVE, MOVE, MOVE, MOVE, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK], 'RangedFighter' + this.newCreepIndex(), {role: 'rangedFighter'})
    },
    healer: ()=> {
      return Game.spawns['Underground Traaains'].createCreep( [HEAL, HEAL, HEAL, HEAL, MOVE, MOVE, MOVE, MOVE], 'Healer' + this.newCreepIndex(), {role: 'healer'})
    },
    assimilator: ()=> {
      return Game.spawns['Underground Traaains'].createCreep( [CLAIM, CLAIM, CLAIM, MOVE, MOVE, MOVE], 'Assi' + this.newCreepIndex(), {role: 'assimilator'})
    },

    transporter: function({fromSource, toTarget, sourcePos}) {
        const source = Game.getObjectById(fromSource)
        const target = Game.getObjectById(toTarget)

        // ADD CALCULATION (With `PathFinder`) FOR MODULES HERE

        return Game.spawns['Underground Traaains'].createCreep([WORK, WORK, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE], 'Transporter' + this.newCreepIndex(), {role: 'transporter', fromSource: fromSource, toTarget: toTarget, sourcePos: sourcePos})
    },
    newCreepIndex: function() {
        let index = Memory.creepIndex
        Memory.creepIndex += 1
        return index
    },
};

module.exports = spawner

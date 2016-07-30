const spawner = {
    rebootHarvester: function() {
        return Game.spawns['Underground Traaains'].createCreep([WORK, CARRY, CARRY, MOVE, MOVE], 'Harvester' + this.newCreepIndex(), {role: 'harvester'})
    },
    harvester: function() {
        return Game.spawns['Underground Traaains'].createCreep([WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE], 'Harvester' + this.newCreepIndex(), {role: 'harvester'})
    },
    excavator: function(fromSource, toTarget) {
        return Game.spawns['Underground Traaains'].createCreep([WORK, WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, MOVE], 'Excavator' + this.newCreepIndex(), {role: 'excavator', fromSource: fromSource, toTarget: toTarget})
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
        return Game.spawns['Underground Traaains'].createCreep( [MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK], 'Builder' + this.newCreepIndex(), {role: 'fighter'})
    },
    rangedFighter: function() {
        return Game.spawns['Underground Traaains'].createCreep( [MOVE, MOVE, MOVE, MOVE, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK], 'Builder' + this.newCreepIndex(), {role: 'rangedFighter'})
    },
    transporter: function({fromSource, toTarget}) {
        const source = Game.getObjectById(fromSource)
        const target = Game.getObjectById(toTarget)

        // ADD CALCULATION (With `PathFinder`) FOR MODULES HERE

        return Game.spawns['Underground Traaains'].createCreep([WORK, WORK, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE], 'Transporter' + this.newCreepIndex(), {role: 'transporter', fromSource: fromSource, toTarget: toTarget})
    },
    newCreepIndex: function() {
        let index = Memory.creepIndex
        Memory.creepIndex += 1
        return index
    },
};

module.exports = spawner

const spawner = require('../spawner')

var spawnCreepWatcher = {
    run: function(spawn) {
        const harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester');
        if(harvesters.length < spawn.memory.harvesterSize) {
            const res = spawner.harvester()
            if(res != ERR_NOT_ENOUGH_ENERGY && harvesters.length != 0) {

            }
            else {
                spawner.rebootHarvester()
                console.log('Trying to spawn reboot-Harvester...')
            }
        }

        let excavators = _.filter(Game.creeps, (creep) => creep.memory.role == 'excavator');
        if(spawn.memory.excavators) {
            for(memExcavator of spawn.memory.excavators) {
                if(_.filter(excavators, (ex)=> (ex.memory.fromSource == memExcavator.fromSource && ex.memory.toTarget == memExcavator.toTarget)).length == 0) {
                    //console.log("Wanna spawn new excavator!");
                    let newName = spawner.excavator(memExcavator.fromSource, memExcavator.toTarget)
                }
            }
        }

        let transporters = _.filter(Game.creeps, (creep) => creep.memory.role == 'transporter');
        if(spawn.memory.transporters) {
            for(memTransporter of spawn.memory.transporters) {
                if(_.filter(transporters, (ex)=> (ex.memory.fromSource.id == memTransporter.fromSource.id && ex.memory.toTarget.id == memTransporter.toTarget.id)).length == 0) {
                    let newName = spawner.transporter(memTransporter)
                }
            }
        }

        const upgraders = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader');
        if(upgraders.length < spawn.memory.upgraderSize) {
            const newName = spawner.upgrader();
            //console.log('Spawning new upgrader: ' + newName);
        }

        let builders = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder');
        if(builders.length < spawn.memory.builderSize) {
            const newName = spawner.builder();
            //console.log('Spawning new builder: ' + newName);
        }

        let repairers = _.filter(Game.creeps, (creep) => creep.memory.role == 'repairer');
        if(repairers.length < spawn.memory.repairerSize) {
            const newName = spawner.repairer();
            //console.log('Spawning new builder: ' + newName);
        }
    },

    // TODO Put this somewhere else
    cleanupMemory: function() {
        for(var name in Memory.creeps) {
            if(!Game.creeps[name]) {
                delete Memory.creeps[name];
                console.log('Clearing non-existing creep memory:', name);
            }
        }
    }
};

module.exports = spawnCreepWatcher


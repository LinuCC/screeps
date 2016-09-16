import $ from './../constants'
const Spawner = require('../spawner')

var spawnCreepWatcher = {
    run: function(spawn) {
        const spawner = new Spawner()
        const harvesters = _.filter(Game.creeps, (creep) => (
          creep.memory.role == 'harvester' &&
          (
            creep.pos.roomName == spawn.pos.roomName ||
            creep.memory.myRoomName === spawn.pos.roomName
          )
        ));
        if(harvesters.length < spawn.memory.harvesterSize) {
            const res = spawner.harvester(spawn)
            if(res != ERR_NOT_ENOUGH_ENERGY && harvesters.length != 0) {

            }
            else {
                spawner.rebootHarvester(spawn)
                console.log('Trying to spawn reboot-Harvester...')
            }
        }

        let excavators = _.filter(Game.creeps, (creep) => (
          creep.memory.role == 'excavator' &&
          (
            creep.pos.roomName == spawn.pos.roomName ||
            creep.memory.myRoomName === spawn.pos.roomName
          )
        ));
        if(spawn.memory.excavators) {
          let memExcavator = null
            for(let memExcavator of spawn.memory.excavators) {
                if(_.filter(excavators, (ex)=> (ex.memory.fromSource == memExcavator.fromSource)).length == 0) {
                    //console.log("Wanna spawn new excavator!");
                    let newName = spawner.excavator(spawn, memExcavator.fromSource)
                }
            }
        }

        let transporters = _.filter(Game.creeps, (creep) => (
          creep.memory.role == 'transporter'
        ));
        if(spawn.memory.transporters) {
            let memTransporter = null
            for(let memTransporter of spawn.memory.transporters) {
                if(_.filter(transporters, (ex)=> (ex.memory.fromSource.id == memTransporter.fromSource.id && ex.memory.toTarget.id == memTransporter.toTarget.id)).length == 0) {
                    let newName = spawner.transporter(spawn, memTransporter)
                }
            }
        }

        const upgraders = _.filter(Game.creeps, (creep) => (
          creep.memory.role == 'upgrader' &&
          (
            creep.pos.roomName == spawn.pos.roomName ||
            creep.memory.myRoomName === spawn.pos.roomName
          )
        ));
        if(upgraders.length < spawn.memory.upgraderSize) {
            const newName = spawner.upgrader(spawn);
            //console.log('Spawning new upgrader: ' + newName);
        }

        let builders = _.filter(Game.creeps, (creep) => (
          creep.memory.role == 'builder' &&
          (
            creep.pos.roomName == spawn.pos.roomName ||
            creep.memory.myRoomName === spawn.pos.roomName
          )
        ));
        if(builders.length < spawn.memory.builderSize) {
            const newName = spawner.builder(spawn);
            //console.log('Spawning new builder: ' + newName);
        }

        let zerglings = _.filter(Game.creeps, (creep) => (
          (
            creep.memory.role == $.ROLE_ZERG || creep.memory.role == 'zergling'
          ) &&
          creep.memory.kind &&
          creep.memory.kind[0] == WORK &&
          (
            creep.pos.roomName == spawn.pos.roomName ||
            creep.memory.myRoomName === spawn.pos.roomName
          )
        ));
        if(zerglings.length < spawn.memory.zerglingSize) {
            const newName = spawner.zergling(spawn);
        }

        let drones = _.filter(Game.creeps, (creep) => (
          (
            creep.memory.role == $.ROLE_ZERG || creep.memory.role == 'zergling'
          )
          && creep.memory.kind &&
          creep.memory.kind[0] == CARRY &&
          (
            creep.pos.roomName == spawn.pos.roomName ||
            creep.memory.myRoomName === spawn.pos.roomName
          )
        ));
        if(drones.length < spawn.memory.droneSize) {
            const newName = spawner.drone(spawn);
        }

        let repairers = _.filter(Game.creeps, (creep) => (
          creep.memory.role == 'repairer' &&
          (
            creep.pos.roomName == spawn.pos.roomName ||
            creep.memory.myRoomName === spawn.pos.roomName
          )
        ));
        if(repairers.length < spawn.memory.repairerSize) {
            const newName = spawner.repairer(spawn);
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


const defense = require('./defense')
const roleHarvester = require('./role/harvester')
const roleUpgrader = require('./role/upgrader')
const roleBuilder = require('./role/builder')
const roleExcavator = require('./role/excavator')
const roleRepairer = require('./role/repairer')
const roleTransporter = require('./role/transporter')
const spawnCreepWatcher = require('./spawn/creepWatcher')

// Maximum range for a remote mine, assuming 100% effectiveness: 190 squares

PathFinder.use(true)

module.exports.loop = ()=> {

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
        else if(creep.memory.role == 'builder') {
            roleBuilder.run(creep)
        }
        else if(creep.memory.role == 'excavator') {
            roleExcavator.run(creep)
        }
        else if(creep.memory.role == 'repairer') {
            roleRepairer.run(creep)
        }
    }
};

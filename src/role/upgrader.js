const role = require('../role')

var roleUpgrader = {

    /** @param {Creep} creep **/
    run: function(creep) {
        if(creep.carry.energy == creep.carryCapacity && creep.memory.harvesting) {
            creep.memory.harvesting = false
        }
        else if(creep.carry.energy == 0 && !creep.memory.harvesting) {
            creep.memory.harvesting = true
        }

	    if(creep.memory.harvesting) {
	        if(container = role.findNonVoidEnergyContainer(creep)) {
	            if(creep.withdraw(container, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
	                creep.moveTo(container)
	            }
	        }
	        else {
	            // Do nothing *SadPanda*
	        }
        }
        else {
            let prioStructure
            if(prioStructure = role.buildPriority()) {
                if(creep.build(prioStructure) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(prioStructure);
                }
            }
            else if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller);
            }
        }
	}
};

module.exports = roleUpgrader;


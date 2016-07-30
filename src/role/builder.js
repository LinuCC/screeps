const role = require('../role')

const roleBuilder = {

    /** @param {Creep} creep **/
    run: function(creep) {

	    if(creep.memory.building && creep.carry.energy == 0) {
            creep.memory.building = false;
	    }
	    if(!creep.memory.building && creep.carry.energy == creep.carryCapacity) {
	        creep.memory.building = true;
	    }

	    if(creep.memory.building) {
	        var targets = creep.room.find(FIND_CONSTRUCTION_SITES);
            if(targets.length) {
                if(creep.build(targets[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0]);
                }
            }
            else {
                let target = this.getRepairTarget(creep)
                if(target) {
                    if(creep.repair(target) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(target);
                    }
                }
            }
	    }
	    else {
	        //if(structure = role.getToDismantleStructure(creep)) {
	        //    if(creep.dismantle(structure) == ERR_NOT_IN_RANGE) {
	        //        creep.moveTo(structure)
	        //    }
	        //}
	        //else {
	            var sources = creep.room.find(FIND_SOURCES);
                if(creep.harvest(sources[1]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(sources[1])
                }
	        //}
	    }
	},

	getRepairTarget: function(creep) {
	    if(creep.memory.repairTarget) {
	        // Target has full health, dont try to continue repairing it
	        let structure = Game.getObjectById(creep.memory.repairTarget)
	        if(structure.hits >= structure.hitsMax) {
	            creep.memory.repairTarget = false
	            return null
	        }
	        else {
	            return structure
	        }
	    }
	    else {
	        // Search for a target to repair and try to repair it
	        let targets = creep.room.find(FIND_MY_STRUCTURES, {
                filter: object => object.hits < (object.hitsMax * 0.8)
            });
            if(targets && targets.length) {

                targets = targets.sort((a,b) => a.hits - b.hits)
                if(Array.isArray(targets)) {

                    creep.memory.repairTarget = targets[0].id
                    return targets[0]
                }
                else {
                    return null
                }
            }
            else {
                return null
            }
	    }

	}
};

module.exports = roleBuilder;


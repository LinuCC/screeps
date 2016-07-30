const role = require('../role')

/**
 * An Excavator should be defined by the following Memory-Vars:
 *   from - Id where to get the resources from
 *   to   - Id where to put the resources into
 */

const roleExcavator = {

    /** @param {Creep} creep **/
    run: function(creep) {
        if(creep.carry.energy == creep.carryCapacity && creep.memory.harvesting) {
            creep.memory.harvesting = false
        }
        else if(creep.carry.energy == 0 && !creep.memory.harvesting) {
            creep.memory.harvesting = true
        }

	    if(creep.memory.harvesting) {
            const source = Game.getObjectById(creep.memory.fromSource)
            if(creep.harvest(source) == ERR_NOT_IN_RANGE) {
                creep.moveTo(source);
            }
        }
        else {
            let store = Game.getObjectById(creep.memory.toTarget)
            if(store && store['store'] && store.store[RESOURCE_ENERGY] < store.storeCapacity) {
                if(creep.transfer(store, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(store);
                }
            }
            else if(void_extension = this.getFirstVoidExtension(creep.room)) {
                if(creep.transfer(void_extension, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(void_extension)
                }
            }
            else {
                if(prioStructure = role.buildPriority()) {
                    if(creep.build(prioStructure) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(prioStructure);
                    }
                }
                else if(tower = this.getVoidTower(creep.room)) {
                    if(creep.transfer(tower, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(tower)
                    }
                }
            }

        }
	},

	filterNonVoidExtension(structure) {
	    return structure.structureType == STRUCTURE_EXTENSION && structure.energy < 50
	},

	getFirstVoidExtension(room) {
	    void_extensions = room.find(FIND_MY_STRUCTURES, {filter: this.filterNonVoidExtension})
	    if(void_extensions.length > 0) {
            void_extension = (Array.isArray(void_extensions)) ? void_extensions[0] : void_extensions
            return void_extension
	    }
	    else {
	        return null;
	    }
	},

	getVoidTower(room) {
	    let tower = room.find(FIND_MY_STRUCTURES, {filter: (structure)=> structure.structureType == STRUCTURE_TOWER && structure.energy < structure.energyCapacity})
	    if(Array.isArray(tower)) {
	        return tower[0]
	    }
	    else if(!tower) {
	        return null
	    }
	    else {
	        return tower
	    }
	}
};

module.exports = roleExcavator


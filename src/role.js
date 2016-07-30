module.exports = {
    buildPriority: function(creep) {
        if(Memory.buildPriority) {
            return Game.getObjectById(Memory.buildPriority)
        }
        else {
            return null
        }
    },

    findNonVoidEnergyContainer(creep) {
        let container = creep.pos.findClosestByPath(
            FIND_STRUCTURES,
            { filter: (struc)=> (
                struc.structureType == STRUCTURE_CONTAINER &&
                struc.store[RESOURCE_ENERGY] > 0
            )}
        )
        return container
	},

    getToDismantleStructure(creep) {
        const structures = creep.room.memory.dismantleQueue
        if(Array.isArray(structures)) {
            const structureId = structures[0]
            if(structure = Game.getObjectById(structureId)) {
                return structure
            }
            else {
                // Remove structure from Queue since it doesnt exist anymore
                console.log('Finished dismantling structure.')
                creep.room.memory.dismantleQueue.shift()
                return this.getToDismantleStructure(creep)
            }
        }
        else {
            return null
        }
    }
};


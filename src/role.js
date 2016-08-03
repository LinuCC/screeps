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
  },

  getStorageTarget(creep) {
    let void_extension
    if(Game.spawns['Underground Traaains'].energy < 300) {
      if(creep.transfer(Game.spawns['Underground Traaains'], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
        creep.moveTo(Game.spawns['Underground Traaains']);
      }
    }
    else if(void_extension = this.getFirstVoidExtension(creep.room)) {
      if(creep.transfer(void_extension, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
        creep.moveTo(void_extension)
      }
    }
    else {
      let prioStructure
      let tower
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
      else if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
        creep.moveTo(creep.room.controller);
      }
    }
  },
};


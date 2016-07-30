const role = require('../role')

const roleHarvester = {

  /** @param {Creep} creep **/
  run: function(creep) {

    if(creep.carry.energy == creep.carryCapacity && creep.memory.harvesting) {
      creep.memory.harvesting = false
    }
    else if(creep.carry.energy == 0 && !creep.memory.harvesting) {
      creep.memory.harvesting = true
    }
    if(creep.memory.harvesting) {
      let void_extension, storage
      if(
        (void_extension = this.getFirstVoidExtension(creep.room)) &&
        (storage = creep.room.find(FIND_MY_STRUCTURES, {filter: {structureType: STRUCTURE_STORAGE}})[0])
      ) {
        if(creep.withdraw(storage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
          creep.moveTo(storage)
        }
      }
      else {
        var sources = creep.room.find(FIND_SOURCES);
        let harvestResult = creep.harvest(sources[1])
        if(harvestResult == ERR_NOT_IN_RANGE) {
          creep.moveTo(sources[1]);
        }
        else if(harvestResult == ERR_NOT_ENOUGH_RESOURCES) {
          let container = this.findNonVoidEnergyContainer(creep.room)
          if(creep.withdraw(container, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
            creep.moveTo(container)
          }
        }
      }
    }
    else {
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

    }
  },

  filterNonVoidExtension(structure) {
    return structure.structureType == STRUCTURE_EXTENSION && structure.energy < 50
  },

  findNonVoidEnergyContainer(room) {
    let containers = room.find(
      FIND_STRUCTURES,
      { filter: (struc)=> (
        struc.structureType == STRUCTURE_CONTAINER &&
          struc.store[RESOURCE_ENERGY] > 0
      )}
    )
    if(containers.length) {
      return containers[0]
    }
    else {
      return null
    }
  },

  getFirstVoidExtension(room) {
    let void_extensions = room.find(FIND_MY_STRUCTURES, {filter: this.filterNonVoidExtension})
    if(void_extensions.length > 0) {
      let void_extension = (Array.isArray(void_extensions)) ? void_extensions[0] : void_extensions
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

module.exports = roleHarvester


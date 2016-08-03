const role = require('../role')

const maintainer = {

  /** @param {Creep} creep **/
  run: function(creep) {
    if(creep.memory.repairing) {
      let target
      if(target = this.getRepairTarget(creep)) {
        if(creep.repair(target) == ERR_NOT_IN_RANGE) {
          creep.moveTo(target);
        }
      }
    }
    else {
      let container
      if(container = role.findNonVoidEnergyContainer(creep)) {
        if(creep.withdraw(container, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
          creep.moveTo(container)
        }
      }
      else {
        var sources = creep.room.find(FIND_SOURCES);
        if(creep.harvest(sources[1]) == ERR_NOT_IN_RANGE) {
          creep.moveTo(sources[1]);
        }
      }
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
      let targets = creep.room.find(FIND_STRUCTURES, {
        filter: struc =>  (
          struc.hits < (struc.hitsMax * 0.9) &&
          (
            (
              struc.structureType == STRUCTURE_WALL &&
                creep.room.memory.wallHitsMax > struc.hits
            ) ||
            (
              struc.structureType == STRUCTURE_RAMPART &&
                creep.room.memory.rampartHitsMax > struc.hits
            ) ||
            (struc.structureType != STRUCTURE_WALL)
          ) &&
          creep.room.memory.dismantleQueue.indexOf(struc.id) == -1
        )
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
  },

  findWork: ()=> {
  },

  findLackingTarget: ()=> {
    if(extension_lacking) {

    }
    else if(spawn_lacking) {

    }
    else if(tower_lacking) {

    }
  }

};

module.exports = maintainer;


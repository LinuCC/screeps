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


      // CONTAINERS
      let container = this.findNonVoidEnergyContainer(creep.room)
      if(container) {
        if(creep.withdraw(container, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
          creep.moveTo(container)
        }
      }
      else {
        // DROPPED RESOURCES
        let droppedViableRes = creep.room.find(
          FIND_DROPPED_RESOURCES,
          {filter: (res)=> ( res.resourceType == RESOURCE_ENERGY)}
        )
        if(droppedViableRes.length) {
          let res = creep.pickup(droppedViableRes[0])
          if(res == ERR_NOT_IN_RANGE) {
            creep.moveTo(droppedViableRes[0])
          }
        }
        else {
          // HARVEST
          var sources = creep.room.find(FIND_SOURCES);
          let harvestResult = creep.harvest(sources[1])
          if(harvestResult == ERR_NOT_IN_RANGE) {
            creep.moveTo(sources[1]);
          }
        }
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

  },


  findNonVoidEnergyContainer: (room)=> {
    let containers = room.find(
      FIND_STRUCTURES,
      { filter: (struc)=> (
        struc.structureType == STRUCTURE_CONTAINER &&
          struc.store[RESOURCE_ENERGY] > 200
      )}
    )
    if(containers.length) {
      return containers[0]
    }
    else {
      return null
    }
  },

};

module.exports = roleBuilder;


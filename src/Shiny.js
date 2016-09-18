/**
 * A shiny thing
 * Abstracts away working with Structures, resources etc
 */
class Shiny {

  constructor(object) {
    this.obj = object
  }

  /**
   * Returns the amount of resources the shiny thing has.
   * Defaults to RESOURCE_ENERGY if resourceType is not given
   */
  goods(resourceType = null) {
    // Resources
    if(
      (resourceType === null || resourceType === this.obj.resourceType) &&
      this.obj instanceof Resource
    ) {
      return this.obj.amount
    }
    // Labs
    else if(this.obj instanceof StructureLab) {
      if(resourceType === RESOURCE_ENERGY) {
        return this.obj.energy
      }
      else {
        if(this.obj.mineralType === resourceType) {
          return this.obj.mineralAmount
        }
        else {
          return 0
        }
      }
    }
    // Creeps
    else if(this.obj.carry) {
      return _.get(this.obj, ['carry', resourceType]) || 0
    }
    // Nuker
    else if(this.obj instanceof StructureNuker) {
      if(resourceType === null || resourceType === RESOURCE_ENERGY) {
        return this.obj.energy
      }
      else if(resourceType === RESOURCE_GHODIUM) {
        return this.obj.ghodium
      }
      else {
        return 0
      }
    }
    // Sources, Links, Spawns, Towers
    else if(
      (resourceType === null || resourceType === RESOURCE_ENERGY) &&
      !_.isUndefined(this.obj.energy)
    ) {
      return this.obj.energy
    }
    // Minerals
    else if(!_.isUndefined(this.obj.mineralAmount)) {
      if(this.obj.mineralType === resourceType) {
        return this.obj.mineralAmount
      }
      else {
        return 0
      }
    }
    // Containers, Storages, Terminals
    else {
      return _.get(this.obj, ['store', resourceType]) || 0
    }
  }

  /**
   * Returns all the goods of the shiny
   * Its format is the same as the store-var of some of the structures;
   * {<resourceType>: <resourceAmount>}
   */
  allGoods() {
    // Resources
    if(this.obj instanceof Resource) {
      return {[this.obj.resourceType]: this.obj.amount}
    }
    // Labs
    else if(this.obj instanceof StructureLab) {
        return {[this.obj.mineralType]: resource, [RESOURCE_ENERGY]: this.obj.energy}
    }
    // Creeps
    else if(this.obj.carry) {
      return this.obj.carry
    }
    // Nuker
    else if(this.obj instanceof StructureNuker) {
      return {[RESOURCE_GHODIUM]: this.obj.ghodium, [RESOURCE_ENERGY]: this.obj.energy}
    }
    // Sources, Links, Spawns, Towers
    else if(!_.isUndefined(this.obj.energy)) {
      return {[RESOURCE_ENERGY]: this.obj.energy}
    }
    // Minerals
    else if(!_.isUndefined(this.obj.mineralAmount)) {
      return {[this.obj.mineralType]: this.obj.mineralAmount}
    }
    // Containers, Storages, Terminals
    else {
      return this.obj.store
    }
  }

  neededGoods(localResourceType = null) {
    // Labs
    if(this.obj instanceof StructureLab) {
      const type = (this.obj.mineralType) ? this.obj.mineralType : localResourceType
      return {
        [type]: this.obj.mineralCapacity - this.obj.mineralAmount,
        [RESOURCE_ENERGY]: this.obj.energyCapacity - this.obj.energy
      }
    }
    // Nuker
    else if(this.obj instanceof StructureNuker) {
      return {
        [RESOURCE_GHODIUM]: this.obj.ghodiumCapacity - this.obj.ghodium,
        [RESOURCE_ENERGY]: this.obj.energyCapacity - this.obj.energy
      }
    }
    else if(this.obj instanceof ConstructionSite) {
      return {
        [RESOURCE_ENERGY]: this.obj.progressTotal - this.obj.progress
      }
    }
    else if(this.obj instanceof StructureController) {
      return {
        [RESOURCE_ENERGY]: this.obj.progressTotal - this.obj.progress
      }
    }
    // Sources, Links, Spawns, Towers, Extensions
    else if(!_.isUndefined(this.obj.energy)) {
      return {
        [RESOURCE_ENERGY]: this.obj.energyCapacity - this.obj.energy
      }
    }
    else {
      log.orange(`   == Dunno what to do with ${this.obj}`)
    }
  }

  type() {
    if(this.obj.structureType) {
      return this.obj.structureType
    }
    else if(this.obj instanceof Resource) {
      return $.OBJ_RESOURCE
    }
    else if(this.obj instanceof Creep) {
      return $.OBJ_CREEP
    }
    else if(this.obj instanceof Mineral) {
      return $.OBJ_MINERAL
    }
    else if(this.obj instanceof ConstructionSite) {
      return $.OBJ_CONSTRUCTION_SITE
    }
    else if(this.obj instanceof Flag) {
      return $.OBJ_FLAG
    }
    else if(this.obj instanceof Map) {
      return $.OBJ_MAP
    }
    else if(this.obj instanceof Market) {
      return $.OBJ_MARKET
    }
    else if(this.obj instanceof Nuke) {
      return $.OBJ_NUKE
    }
    else if(this.obj instanceof Room) {
      return $.OBJ_ROOM
    }
    else if(this.obj instanceof Source) {
      return $.OBJ_SOURCE
    }
    else if(this.obj instanceof Structure) {
      return $.OBJ_STRUCTURE
    }
    else if(this.obj instanceof RoomObject) {
      return $.OBJ_ROOM_OBJECT
    }
    else if(this.obj instanceof Position) {
      return $.OBJ_POSITION
    }
  }
}

module.exports = Shiny

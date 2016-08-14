const role = require('../role')

/**
 * An Excavator should be defined by the following Memory-Vars:
 *   fromSource - Id where to get the resources from
 */

const roleExcavator = {

  /** @param {Creep} creep **/
  run: function(creep) {
    let gPos = this.getExcavationPosition(creep)
    if(gPos) {
      if(
        gPos.x == creep.pos.x &&
        gPos.y == creep.pos.y &&
        gPos.roomName == creep.room.name
      ) {
        const source = Game.getObjectById(creep.memory.fromSource)
        let res = creep.harvest(source)
        switch(res) {
          case OK:
            break;
          case ERR_INVALID_TARGET:
            creep.say('invalid')
          case ERR_NOT_IN_RANGE:
            creep.say('range')
          case ERR_NO_BODYPART:
            creep.say('bodypart')
        }
      }
      else {
        creep.moveTo(gPos)
      }
    }
    else {
      creep.say('gPos?')
    }
  },

  getExcavationPosition(creep) {
    if(creep.memory.excavationPosition) {
      let pos = creep.memory.excavationPosition
      return new RoomPosition(pos.x, pos.y, pos.roomName)
    }
    else {
      let pos = this.calcExcavationPosition(creep)
      if(pos) {
        creep.memory.excavationPosition = {
          x: pos.x, y: pos.y, roomName: pos.roomName
        }
        return pos
      }
      else {
        return null
      }
      return null
    }
  },

  calcExcavationPosition(creep) {
    let source = Game.getObjectById(creep.memory.fromSource)
    if(source) {
      let containers = source.pos.findInRange(
        FIND_STRUCTURES, 1, {filter: {structureType: STRUCTURE_CONTAINER}}
      )
      if(containers.length > 0) {
        let container = containers[0]
        return new RoomPosition(
          container.pos.x, container.pos.y, container.room.name
        )
      }
      else {
        // Any adjacent walkable tile to the source is fine, get the position
        // to the closest one. Just dont call it to often.
        let path = creep.pos.findPathTo(source)
        if(path && path.length) {
          // If we only are one tile away we are directly at the source
          let pos = (path.length > 1) ? path.slice(-2, -1)[0] : creep.pos
          return new RoomPosition(pos.x, pos.y, source.room.name)
        }
        else {
          return null
        }
      }
    }
    else {
      return null
    }
  },
};

module.exports = roleExcavator


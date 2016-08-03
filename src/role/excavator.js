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
        gPos.room == creep.room.name
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

  getExcavatingPosition(creep) {
    if(creep.memory.excavatingPosition) {
      let pos = creep.memory.excavatingPosition
      return new RoomPosition(pos.x, pos.y, pos.room)
    }
    else {
      let pos = this.calcExcavatingPosition(creep)
      if(pos) {
        creep.memory.excavatingPosition = {x: pos.x, y: pos.y, room: pos.room}
        return pos
      }
      else {
        return null
      }
      return null
    }
  },

  calcExcavatingPosition(creep) {
    let source = Game.getObjectById(creep.memory.fromSource)
    let container = false
    if(source) {
      container = source.pos.findInRange(
        FIND_STRUCTURES, 1, {filter: {structureType: STRUCTURE_CONTAINER}}
      )
      if(container) {
        return new RoomPosition(
          container.pos.x, container.pos.y, container.room.name
        )
      }
      else {
        // Any adjacent walkable tile to the source is fine, get the position
        // to the closest one. Just dont call it to often.
        let path = creep.pos.findPathTo(source)
        if(path && path.length) {
          let pos = path.slice(-1)[0]
          return new RoomPosition(pos.x, pos.y, source.room)
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


import $ from './../constants'

const roleSweeper = {
  run(creep) {
    let mem = creep.memory
    if(mem.targetRoomName) {
      if(creep.room.name != mem.targetRoomName) {
        creep.moveTo(new RoomPosition(25, 25, mem.targetRoomName))
      }
      else {
        const target = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS)
        if(!target) { creep.say('⚘☀', true); return }
        if(creep.pos.inRangeTo(target, 1)) {
          this.destroy(creep, target)
        }
        else {
          creep.moveTo(target)
        }
      }
    }
  },

  destroy(creep, target) {
    if(creep.getActiveBodyparts(WORK) > 0 && !(target instanceof Creep)) {
      console.log(creep.dismantle(Game.getObjectById('57a2ac0b0ed300e43ec06811')))
    }
    else {
      creep.attack(target)
    }
  }
}

module.exports = roleSweeper

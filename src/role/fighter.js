
const roleFighter = {
  run(creep) {
    let flag;
    if(creep.memory.flagName) {
      flag = Game.flags[creep.memory.flagName]
    }
    else {
      let flags = _.filter(Game.flags, {color: COLOR_RED})
      if(flags.length) {
        flag = flags[0]
      }
    }
    if(flag) {
      creep.moveTo(flag)
      if(creep.pos.inRangeTo(flag, 1)) {
        let targets = flag.pos.look()
        if(targets.length) {
          this.destroy(creep, targets[0])
        }
      }
      let targets = creep.pos.findInRange(FIND_HOSTILE_CREEPS, 1)
      if(targets.length > 0) {
        this.destroy(creep, targets[0])
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

module.exports = roleFighter

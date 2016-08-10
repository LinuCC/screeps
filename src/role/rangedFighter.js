const roleRangedFighter = {
  run: (creep)=> {
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
      if(creep.pos.inRangeTo(flag, 3)) {
        let targets = flag.pos.look()
        if(targets.length) {
          creep.rangedAttack(targets[0])
        }
      }
    }
    let targets = creep.pos.findInRange(FIND_HOSTILE_CREEPS, 3)
    if(targets.length > 0) {
      creep.rangedAttack(targets[0])
    }
  }
}

module.exports = roleRangedFighter

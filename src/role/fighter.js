
const roleFighter = {
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
      if(creep.pos.inRangeTo(flag, 1)) {
        let targets = flag.pos.look()
        if(targets.length) {
          creep.attack(targets[0])
        }
      }
      let targets = creep.pos.findInRange(FIND_HOSTILE_CREEPS, 1)
      if(targets.length > 0) {
        creep.attack(targets[0])
      }
    }
  }
}

module.exports = roleFighter

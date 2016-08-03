
const roleAssimilator = {
  run: (creep)=> {
    let flag;
    if(creep.memory.flagName) {
      flag = Game.flags[creep.memory.flagName]
    }
    else {
      let flags = _.filter(Game.flags, {color: COLOR_PURPLE})
      if(flags.length) {
        flag = flags[0]
      }
    }
    if(flag) {
      creep.moveTo(flag)
      if(creep.pos.inRangeTo(flag, 0)) {
        let targets = creep.pos.findInRange(FIND_STRUCTURES, 1, {filter: {structureType: STRUCTURE_CONTROLLER}})
        if(targets.length) {
          creep.claimController(targets[0])
        }
      }
    }
  }
}

module.exports = roleAssimilator

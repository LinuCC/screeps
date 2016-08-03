const roleHealer = {
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
          creep.heal(targets[0])
        }
      }
    }

    if(creep.hits < creep.hitsMax) {
      creep.heal(creep)
    }
    else {
      let targets = creep.pos.findInRange(
          FIND_MY_CREEPS, 1,
          {filter: (creep)=> ((creep.maxHits - creep.hits) > 0)}
      )
      if(!(targets.length > 0)) {
        let targets = creep.pos.findInRange(
            FIND_MY_CREEPS, 2,
            {filter: (creep)=> ((creep.maxHits - creep.hits) > 0)}
        )
      }
      targets = _.orderBy(targets, (c)=> (c.maxHits - c.hits), 'asc')
      if(targets.length > 0) {
        creep.heal(targets[0])
      }
    }

  }
}

module.exports = roleHealer

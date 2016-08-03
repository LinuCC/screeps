
const roleFighter = {
  run: (creep)=> {
    let flags = _.filter(Game.flags, {color: COLOR_RED})
    if(flags.length) {
      let flag = flags[0]
      creep.moveTo(flags[0])
      let targets = flag.pos.look()
      if(targets.length) {
        creep.attack(targets[0])
      }
    }
  }
}

module.exports = roleFighter

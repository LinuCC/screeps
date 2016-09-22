
const roleFighter = {

  assignItself(creep) {
    if(!Memory.zergSubordinates) {
      Memory.zergSubordinates = {}
    }
    if(!Memory.zergSubordinates[creep.memory.groupId]) {
      Memory.zergSubordinates[creep.memory.groupId] = {}
    }
    let group = Memory.zergSubordinates[creep.memory.groupId]
    if(creep.memory.isMaster) {
      group['masterId'] = creep.id
    }
    else if(creep.memory.isSubordinate) {
      if(!group['subordinateIds']) {
        group['subordinateIds'] = []
      }
      group['subordinateIds'].push(creep.id)
    }
    creep.memory.hasAssignedItself = true
  },

  surroundMaster(index, master, dir = null) {
    const relPositions = {
      [TOP]: {x: 0, y: -1},
      [TOP_RIGHT]: {x: 1, y: -1},
      [RIGHT]: {x: 1, y: 0},
      [BOTTOM_RIGHT]: {x: 1, y: 1}
      [BOTTOM]: {x: 0, y: 1},
      [BOTTOM_LEFT]: {x: -1, y: 1},
      [LEFT]: {x: -1, y: 0},
      [TOP_LEFT]: {x: -1, y: -1},
    }

    let group = Memory.zergSubordinates[creep.memory.groupId]
    let previousDir = group.previousDir
    let turnCache = group.turnCache
    if(turnCache && previousDir) {
      let turnIndicator = previousDir - dir
      turnIndicator = (turnIndicator < -3) ? turnIndicator + 8 : turnIndicator
      turnIndicator = (turnIndicator > 3) ? turnIndicator - 8 : turnIndicator
      const turnDir = (turnIndicator > 0) ? LEFT : RIGHT
      const currentDir = this.surroundPositionsFor(turnCache[0])[index]
      let newDir = null
      if(turnDir === LEFT) {
        newDir = currentDir - 1
        if(newDir <= 0) { newDir = newDir + 8 }
      }
      if(turnDir === RIGHT) {
        newDir = currentDir + 1
        if(newDir > 8) { newDir = newDir - 8 }
      }
      return positions[newDir]
    }
    else {
      const myDir = this.surroundPositionsFor(dir)[index]
      return positions[myDir]
    }
  }

  surroundPositionsFor(dir) {
    switch(dir) {
      case BOTTOM:
      case BOTTOM_LEFT:
        return [TOP, TOP_RIGHT, RIGHT, TOP_LEFT, LEFT]
        break
      case LEFT:
      case TOP_LEFT:
        return [RIGHT, BOTTOM_RIGHT, BOTTOM, TOP_RIGHT, TOP]
        break
      case TOP:
      case TOP_RIGHT:
        return [BOTTOM, BOTTOM_LEFT, LEFT, BOTTOM_RIGHT, RIGHT]
        break
      case RIGHT:
      case BOTTOM_RIGHT:
        return [LEFT, TOP_LEFT, TOP, BOTTOM_LEFT, BOTTOM]
        break
    }
  }

  subPositionForIndex(index, position, moveDir) {

    const directions = {
      [TOP]: {x: 0, y: 1},
      [TOP_RIGHT]: {x: -1, y: 1},
      [RIGHT]: {x: -1, y: 0},
      [BOTTOM_RIGHT]: {x: -1, y: -1},
      [BOTTOM]: {x: 0, y: -1},
      [BOTTOM_LEFT]: {x: 1, y: -1},
      [LEFT]: {x: 1, y: 0},
      [TOP_LEFT]: {x: 1, y: 1}
    }
    let behind = directions[moveDir]
    let relativePos = null
    let dir = null
    switch(index) {
      case 0:
        relativePos = directions[moveDir]
        break
      case 1:
        dir = (moveDir - 1 >= 1) ? moveDir - 1 : 8 + (moveDir - 1)
        relativePos = directions[dir]
        break
      case 2:
        // If moveDir is straight (top, right, left, bottom) we want one of the
        // creeps to stand directly besides the attacker
        dir = null
        if(moveDir % 2 === 1) {
          dir = (moveDir - 2 >= 1) ? moveDir - 2 : 8 + (moveDir - 2)
        }
        else {
          dir = (moveDir + 1 <= 8) ? moveDir + 1 : (moveDir + 1) - 8
        }
        relativePos = directions[dir]
        break
    }
    console.log(` = relativePos: ${JSON.stringify(relativePos)}`)
    let x = relativePos.x + position.x
    let y = relativePos.y + position.y
    console.log(`  = x: ${x}`)
    console.log(`  = y: ${y}`)
    if(x < 0) { x = 50 + x }
    else if(x > 50) { x = x - 50 }
    if(y < 0) { y = 50 + x }
    else if(y > 50) { y = x - 50 }

    return new RoomPosition(x, y, position.roomName)
  },

  run(creep) {
    let itsMaster = Game.getObjectById(
      _.get(Memory, ['zergSubordinates', creep.memory.groupId, 'masterId'])
    )
    if(creep.memory.hasAssignedItself === false) {
      this.assignItself(creep)
    }
    if(creep.memory.isMaster) {

      // Control master here, like getting target, moving to it

      let path = null
      let target = this.flagToGoFor(creep)
      if(target) {
        this.attackOnFlag(creep, target)
      }
      else {
        // Scorched earth
        target = this.scorchTarget(creep)
      }
      if(target) {
        path = creep.pos.findPathTo(target)
      }
      if(path) {
        let masterDir = null
        let masterPos = null
        if(path.length) {
          masterDir = path[0].direction // Which dir is the master going?
          masterPos = new RoomPosition(path[0].x, path[0].y, creep.room.name)
          creep.move(masterDir)
        }
        else {
          masterDir = creep.pos.getDirectionTo(target)
        }
        if(!masterDir) {
          log.red('masterDir undefined')
          masterDir = 1
          masterPos = creep.pos
        }

        let group = Memory.zergSubordinates[creep.memory.groupId]
        let previousDir = group.previousDir
        let turnCache = group.turnCache

        if(masterDir != previousDir) {
          //TODO create turncache
          // turncache.push Everything between the two dirs
        }

        if(creep.pos.inRangeTo(target, this.attackRange(creep))) {
          this.destroy(creep, target)
        }
        else {
          this.attackVicinity(creep)
          this.heal(creep)
        }

        // Try to move the target with the master
        const subs = _.get(
          Memory, ['zergSubordinates', creep.memory.groupId, 'subordinateIds']
        )
        log.red(subs.length)
        if(subs && subs.length) {
          subs.forEach((sub, index)=> {
            console.log(`  = Sub-index is ${index}`)
            Game.getObjectById(sub).moveTo(
              this.subPositionForIndex(index, masterPos, masterDir),
              {ignoreCreeps: false}
            )
          })
        }
        previousDir = masterDir
        if(turnCache && turnCache.length) {
          // TODO remove first item?
          turnCache.shift(1)
        }
      }
      else {
        creep.say('No Path')
        this.attackVicinity(creep)
        this.heal(creep)
      }
    }
    else if(
      creep.memory.isSubordinate && itsMaster && creep.memory.groupControl
    ) {
      // Master controlls my movement
      this.attackVicinity(creep)
      this.heal(creep)
    }
    else if(creep.memory.isSubordinate && itsMaster) {
      creep.moveTo(itsMaster)
    }
    else {
      // Standard attack on flag
      creep.say('Master down?')
      let flag = this.flagToGoFor(creep)
      if(flag) {
        this.attackOnFlag(creep, flag)
      }
      else {
        target = this.scorchTarget(creep)
        if(target) {
          if(creep.pos.inRangeTo(target, this.attackRange(creep))) {
            this.destroy(creep, targets[0])
          }
          else {
            creep.moveTo(target)
          }
        }
      }
      if(!this.moveAndAttackOnFlag(creep)) {
        this.attackVicinity(creep)
        this.heal(creep)
      }
    }
  },

  attackOnFlag(creep, flag) {
    if(creep.pos.inRangeTo(flag, this.attackRange(creep))) {
      let targets = flag.pos.look()
      if(targets.length) {
        this.destroy(creep, targets[0])
        return true
      }
    }
  },

  flagToGoFor(creep) {
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
      if(flag.room && flag.room.name == creep.room.name) {
        let targets = flag.pos.look()
        if(targets.length) {
          return flag
        }
        else {
          return false
        }
      }
      else {
        return flag.pos
      }
    }
    else {
      return false
    }
  },

  moveAndAttackOnFlag(creep) {
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
      if(creep.pos.inRangeTo(flag, this.attackRange(creep))) {
        let targets = flag.pos.look()
        if(targets.length) {
          this.destroy(creep, targets[0])
          return true
        }
      }
      else {
        creep.moveTo(flag)
        return false
      }
    }
  },

  attackRange(creep) {
    if(creep.getActiveBodyparts(RANGED_ATTACK) > 0) {
      return 3
    }
    else {
      return 1
    }
  },

  attackVicinity(creep) {
    let targets = creep.pos.findInRange(
      FIND_HOSTILE_CREEPS, this.attackRange(creep)
    )
    if(targets.length > 0) {
      this.destroy(creep, targets[0])
    }
  },

  destroy(creep, target) {
    if(target instanceof Flag) {
      let targets = _.reject(target.pos.look(), (t)=> t instanceof Flag)
      target = targets[0]
    }
    if(creep.getActiveBodyparts(WORK) > 0 && !(target instanceof Creep)) {
      log.orange(`dismantling! ${creep.dismantle(target.id)}, ${JSON.stringify(target)}`)
      creep.dismantle(target)
    }
    else {
      creep.attack(target)
    }
    if(creep.getActiveBodyparts(RANGED_ATTACK) > 0) {
      creep.rangedAttack(target)
    }
  },

  heal(creep) {
    if(
      creep.hitsMax - _.sum(_.filter(creep.body, (b, k)=> k == HEAL)) >=
      creep.hits
    ) {
      creep.heal(creep)
    }
    else {
      let targets = creep.pos.findInRange(
          FIND_MY_CREEPS, 1,
          {filter: (creep)=> ((creep.hitsMax - creep.hits) > 0)}
      )
      if(!(targets.length > 0)) {
        targets = creep.pos.findInRange(
            FIND_MY_CREEPS, 2,
            {filter: (creep)=> ((creep.hitsMax - creep.hits) > 0)}
        )
      }
      if(targets.length > 0) {
        targets = _.sortByOrder(targets, (c)=> (c.maxHits - c.hits), 'asc')
        creep.heal(targets[0])
      }
    }
  },

  scorchTarget(creep) {
    const room = creep.room
    targets = room.find(
      FIND_HOSTILE_STRUCTURES, (s)=> s.structureType === STRUCTURE_TOWER
    )
    if(targets.length) { return creep.findClosestByPath(targets) }
    targets = room.find(
      FIND_HOSTILE_STRUCTURES, (s)=> s.structureType === STRUCTURE_SPAWN
    )
    if(targets.length) { return creep.findClosestByPath(targets) }
    targets = room.find(
      FIND_HOSTILE_STRUCTURES, (s)=> s.structureType === STRUCTURE_EXTENSION
    )
    if(targets.length) { return creep.findClosestByPath(targets) }
    targets = room.find(FIND_HOSTILE_CREEPS)
    if(targets.length) { return creep.findClosestByPath(targets) }
    return false
  }
}

module.exports = roleFighter

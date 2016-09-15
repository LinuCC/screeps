const ROLE_ZERG = 'zerg'
const KIND_DRONE = 1 /* Carry stuff */
const KIND_ZERGLING = 2 /* Work stuff */
const KIND_INFESTOR = 3 /* Mine stuff from sources */
const KIND_CORRUPTOR = 4 /* Claim Controller */
const KIND_MUTALISK = 5 /* Scout stuff */
const KIND_SWEEPER = 6

const SCOUT = 'scout'
const SPAWN = 'spawn'
const EXCAVATE = 'excavate'
const UPGRADE = 'upgrade'

const SOURCE = 'source'

const CONSTRUCTION_SITE = "constrSite"
const REMOTE_PRIORITIES_MODIFIER = 0.5

const SEED = 'seed'

const RESERVE = 'reserve'
const DOWNGRADE = 'downgrade'

const CONTROLLER_CLAIM = 'claim'
const CONTROLLER_RESERVE = 'reserve'
const CONTROLLER_DOWNGRADE = 'downgrade'

const TYPE_SOURCE = 0
const TYPE_TARGET = 1
const TYPE_SEED = 2

const exports = Object.freeze({
  ROOM_CENTER_X: 25,
  ROOM_CENTER_Y: 25,

  SPAWN: SPAWN,
  SCOUT: SCOUT,
  EXCAVATE: EXCAVATE,
  UPGRADE: UPGRADE,

  ENERGY_COST: Object.freeze({
    [WORK]: 100,
    [CARRY]: 50,
    [MOVE]: 50,
    [ATTACK]: 80,
    [RANGED_ATTACK]: 150,
    [HEAL]: 250
  }),
  ZERG_KINDS: [
    KIND_DRONE,
    KIND_ZERGLING,
    KIND_INFESTOR,
    KIND_CORRUPTOR,
    KIND_MUTALISK
  ],
  ZERG_PARTS_TEMPLATES: {
    [KIND_DRONE]: [CARRY],
    [KIND_ZERGLING]: [WORK, WORK, WORK, CARRY, CARRY],
    [KIND_INFESTOR]: [WORK],
    [KIND_CORRUPTOR]: [CLAIM],
    [KIND_MUTALISK]: [MOVE]
  },
  PRIO_QUEUES: [
    WORK,
    CARRY,
    SEED,
    SCOUT,
    EXCAVATE,
    UPGRADE,

    SPAWN
  ],

  QUEUES_FOR_KINDS: {
    [KIND_DRONE]: [CARRY],
    [KIND_ZERGLING]: [WORK, CARRY],
    [KIND_INFESTOR]: [EXCAVATE],
    [KIND_CORRUPTOR]: [SEED],
    [KIND_MUTALISK]: [SCOUT],
  },

  CONTROLLER_CLAIM: CONTROLLER_CLAIM,
  CONTROLLER_RESERVE: CONTROLLER_RESERVE,
  CONTROLLER_DOWNGRADE: CONTROLLER_DOWNGRADE,

  CONTROLLER_RESERVE_MAX: 5000,

  PRIORITIES: {
    [CARRY]: {
      [STRUCTURE_SPAWN]: 1000,
      [STRUCTURE_EXTENSION]: 1100,
      [STRUCTURE_TOWER]: 1200,
      [STRUCTURE_LINK]: 1800,
      [CONSTRUCTION_SITE]: 1900,
      [STRUCTURE_STORAGE]: 2000,
      [STRUCTURE_CONTROLLER]: 9000,
      [STRUCTURE_CONTAINER]: 10000,
    },
    [EXCAVATE]: {
      [SOURCE]: 1000,
    },
    [SPAWN]: {
      [KIND_SWEEPER]: 1000,
      [KIND_INFESTOR]: 2000,
      [KIND_CORRUPTOR]: 5000,
    },
    [SEED]: {
      [CLAIM]: 1000,
      [RESERVE]: 2000,
      [DOWNGRADE]: 3000
    }
  },

  SOURCE: SOURCE,

  REMOTE_PRIORITIES_MODIFIER: REMOTE_PRIORITIES_MODIFIER,
  CONSTRUCTION_SITE: CONSTRUCTION_SITE,

  ROLE_ZERG: ROLE_ZERG,
  KIND_DRONE: KIND_DRONE,
  KIND_ZERGLING: KIND_ZERGLING,
  KIND_INFESTOR: KIND_INFESTOR,
  KIND_CORRUPTOR: KIND_CORRUPTOR,
  KIND_MUTALISK: KIND_MUTALISK,

  ROOM_DEFAULT_TARGET_ZERG_COUNT: {
    [KIND_DRONE]: 1,
    [KIND_ZERGLING]: 1,
    [KIND_INFESTOR]: 1,
    [KIND_CORRUPTOR]: 0
  },

  FLAG_IDENTIFIERS: {
    remoteRoom: {
      color: COLOR_CYAN,
      secondaryColor: COLOR_PURPLE
    }
  },

  SEED: SEED,

  CLAIM: CLAIM,
  RESERVE: RESERVE,
  DOWNGRADE: DOWNGRADE,

  TYPE_SOURCE: TYPE_SOURCE,
  TYPE_TARGET: TYPE_TARGET,
  TYPE_SEED: TYPE_SEED,

  UNDER_ATTACK: 'uAtt',
});

module.exports = exports

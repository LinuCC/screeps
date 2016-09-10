const ROLE_ZERG = 'zerg'
const KIND_DRONE = 1 /* Carry stuff */
const KIND_ZERGLING = 2 /* Work stuff */
const KIND_INFESTOR = 3 /* Mine stuff from sources */
const KIND_CORRUPTOR = 4 /* Claim Controller */

const exports = Object.freeze({
    ROOM_CENTER_X: 25,
    ROOM_CENTER_Y: 25,

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
      KIND_CORRUPTOR
    ],
    PRIO_QUEUES: [
      WORK,
      CARRY,
      CLAIM,
      SCOUT
    ],
    ROLE_ZERG: ROLE_ZERG,
    KIND_DRONE: KIND_DRONE,
    KIND_ZERGLING: KIND_ZERGLING,
    KIND_INFESTOR: KIND_INFESTOR,
    KIND_CORRUPTOR: KIND_CORRUPTOR,

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
    }
});

module.exports = exports

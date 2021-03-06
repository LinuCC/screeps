
/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('defense');
 * mod.thing == 'a thing'; // true
 */

const helper = require('./helper')

module.exports = {
    defendRoom(room) {
        var hostiles = room.find(FIND_HOSTILE_CREEPS);
        if(hostiles.length > 0) {
            try {
                this.lulz()
            }
            catch(e) {
                Game.notify(e.stack)
            }
            const username = hostiles[0].owner.username;
            //Game.notify(`User ${username} spotted in room ${room.name}`);
            const towers = room.find(
                FIND_MY_STRUCTURES, {filter: {structureType: STRUCTURE_TOWER}}
            );
            towers.forEach(tower => (
                tower.attack(this.mostValuableTarget(hostiles, tower))
            ));
        }
        else {
          let creeps = room.find(
            FIND_MY_CREEPS, {filter: (c)=> c.hits < c.hitsMax}
          )
          if(creeps.length) {
            const towers = room.find(
                FIND_MY_STRUCTURES, {filter: {structureType: STRUCTURE_TOWER}}
            );
            towers.forEach((tower)=> (
              tower.heal(creeps[0])
            ))
          }
        }
    },

    mostValuableTarget(hostiles, tower) {
        const values = _.map(hostiles, (hostile) => (
            {id: hostile.id, value: this.calculateTargetValue(hostile, tower)}
        ))
        const target = _.last(_.sortBy(values, 'value'))
        Memory.inspectMe = target
        if(target.value > -800) {
            return Game.getObjectById(target.id)
        }
        else {
            return null
        }

    },

    calculateTargetValue(hostile, tower) {
        const position = hostile.pos
        const surroundingCreeps = position.findInRange(
          FIND_HOSTILE_CREEPS, 1
        )
        // const  = room.lookForAtArea(
        //     LOOK_CREEPS, position.y - 1, position.x - 1, position.y + 1, position.x + 1, true
        // )
        // const surroundingCreeps = _.map(surroundingCreepData, (d)=> d.creep)
        let surroundingHealers = _.filter(surroundingCreeps, this.filterHealer)

        const range = position.getRangeTo(tower)

        // Dont allow baiting all energy from the tower
        const specialMod = (
            (range > 10 && tower.energy < 750) ||
            (range > 8 && tower.energy < 650)
        ) ? -1000 : 0

        return (
            (- range * (range * 0.5)) +
            (surroundingHealers.length * (-30 + (range * 0.9))) +
            specialMod
        )
    },

    filterHealer(creep) {
        return creep.getActiveBodyparts(HEAL) > 0
    },

    lulz() {
        helper.randomProperty(Game.creeps).say("Go away!", true)
    }

};


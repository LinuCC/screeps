const role = require('../role')

/**
 * An Transporter should be defined by the following Memory-Vars:
 *   fromSource - Object wit `id` where to get the resources from
 *   toTarget   - Object with `id` where to put the resources into
 *   resource   - The resource to transport
 *
 */

const roleTransporter = {

    /** @param {Creep} creep **/
    run: function(creep) {
        const fromSource = creep.memory.fromSource
        const toTarget = creep.memory.toTarget
        const source = Game.getObjectById(creep.memory.fromSource.id)
        const target = Game.getObjectById(creep.memory.toTarget.id)
        const sp = creep.memory.sourcePos
        let sourcePos = false
        if(sp) {
          sourcePos = new RoomPosition(sp.x, sp.y, sp.roomName)
        }
        if(creep.carry.energy == creep.carryCapacity && creep.memory.transporting) {
            creep.say('To target')
            creep.memory.transporting = false
        }
        else if(creep.carry.energy == 0 && !creep.memory.transporting) {
            creep.say('To source')
            creep.memory.transporting = true
        }

	    if(creep.memory.transporting) {
	        if(source) {
                if(creep.harvest(source) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(source, {reusePath: 20});
                }
	        }
	        else if(sourcePos) {
	            creep.moveTo(sourcePos)
	        }
	        else {
	            creep.say('Source where?!')
	        }
        }
        else {
            if(!target) {
                creep.say('Target where?!')
                return
            }
            else if(target.store !== undefined) {
              if(target.store[RESOURCE_ENERGY] < target.storeCapacity) {
                  if(creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                      creep.moveTo(target, {reusePath: 20});
                  }
              }
            }
            else {
              if(creep.build(target) == ERR_NOT_IN_RANGE) {
                  creep.moveTo(target, {reusePath: 20});
              }
            }
        }
	},

};

module.exports = roleTransporter


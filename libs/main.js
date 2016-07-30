/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var defense = __webpack_require__(1);
	var roleHarvester = __webpack_require__(3);
	var roleUpgrader = __webpack_require__(5);
	var roleBuilder = __webpack_require__(6);
	var roleExcavator = __webpack_require__(7);
	var roleRepairer = __webpack_require__(8);
	var roleTransporter = __webpack_require__(9);
	var spawnCreepWatcher = __webpack_require__(10);

	// Maximum range for a remote mine, assuming 100% effectiveness: 190 squares

	PathFinder.use(true);

	module.exports.loop = function () {

	    for (var name in Game.spawns) {
	        spawnCreepWatcher.run(Game.spawns[name]);
	        defense.defendRoom(Game.spawns[name].room);
	    }

	    for (var _name in Game.creeps) {
	        var creep = Game.creeps[_name];
	        if (creep.memory.role == 'harvester') {
	            roleHarvester.run(creep);
	        } else if (creep.memory.role == 'transporter') {
	            roleTransporter.run(creep);
	        } else if (creep.memory.role == 'upgrader') {
	            roleUpgrader.run(creep);
	        } else if (creep.memory.role == 'builder') {
	            roleBuilder.run(creep);
	        } else if (creep.memory.role == 'excavator') {
	            roleExcavator.run(creep);
	        } else if (creep.memory.role == 'repairer') {
	            roleRepairer.run(creep);
	        }
	    }
	};

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	/*
	 * Module code goes here. Use 'module.exports' to export things:
	 * module.exports.thing = 'a thing';
	 *
	 * You can import it from another modules like this:
	 * var mod = require('defense');
	 * mod.thing == 'a thing'; // true
	 */

	helper = __webpack_require__(2);

	module.exports = {
	    defendRoom: function defendRoom(room) {
	        var _this = this;

	        var hostiles = room.find(FIND_HOSTILE_CREEPS);
	        if (hostiles.length > 0) {
	            try {
	                this.lulz();
	            } catch (e) {
	                Game.notify(e.stack);
	            }
	            var username = hostiles[0].owner.username;
	            //Game.notify(`User ${username} spotted in room ${room.name}`);
	            var towers = room.find(FIND_MY_STRUCTURES, { filter: { structureType: STRUCTURE_TOWER } });
	            towers.forEach(function (tower) {
	                return tower.attack(_this.mostValuableTarget(hostiles, tower));
	            });
	        }
	    },
	    mostValuableTarget: function mostValuableTarget(hostiles, tower) {
	        var _this2 = this;

	        var values = _.map(hostiles, function (hostile) {
	            return { id: hostile.id, value: _this2.calculateTargetValue(hostile, tower) };
	        });
	        var target = _.last(_.sortBy(values, 'value'));
	        Memory.inspectMe = target;
	        console.log(target.value);
	        if (target.value > -800) {
	            return Game.getObjectById(target.id);
	        } else {
	            return null;
	        }
	    },
	    calculateTargetValue: function calculateTargetValue(hostile, tower) {
	        var position = hostile.pos;
	        var room = Game.rooms[hostile.pos.roomName];
	        var surroundingCreepData = room.lookForAtArea(LOOK_CREEPS, position.y - 1, position.x - 1, position.y + 1, position.x + 1, true);
	        var surroundingCreeps = _.map(surroundingCreepData, function (d) {
	            return d.creep;
	        });
	        var surroundingHealers = _.filter(surroundingCreeps, this.filterHealer);
	        //console.log(surroundingCreeps.length)
	        console.log(surroundingHealers.length);

	        var range = position.getRangeTo(tower);

	        // Dont allow baiting all energy from the tower
	        var specialMod = range > 10 && tower.energy < 750 || range > 8 && tower.energy < 650 ? -1000 : 0;

	        return -range * (range * 0.5) + surroundingHealers.length * (-30 + range * 0.9) + specialMod;
	    },
	    filterHealer: function filterHealer(creep) {
	        console.log(creep);
	        return creep.getActiveBodyparts(HEAL) > 0;
	    },
	    lulz: function lulz() {
	        helper.randomProperty(Game.creeps).say("Go away!", true);
	    }
	};

/***/ },
/* 2 */
/***/ function(module, exports) {

	"use strict";

	/*
	 * Module code goes here. Use 'module.exports' to export things:
	 * module.exports.thing = 'a thing';
	 *
	 * You can import it from another modules like this:
	 * var mod = require('helper');
	 * mod.thing == 'a thing'; // true
	 */

	module.exports = {
	    randomProperty: function randomProperty(obj) {
	        var keys = Object.keys(obj);
	        return obj[keys[keys.length * Math.random() << 0]];
	    }
	};

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var role = __webpack_require__(4);

	var roleHarvester = {

	    /** @param {Creep} creep **/
	    run: function run(creep) {

	        if (creep.carry.energy == creep.carryCapacity && creep.memory.harvesting) {
	            creep.memory.harvesting = false;
	        } else if (creep.carry.energy == 0 && !creep.memory.harvesting) {
	            creep.memory.harvesting = true;
	        }
	        if (creep.memory.harvesting) {
	            var sources = creep.room.find(FIND_SOURCES);
	            var harvestResult = creep.harvest(sources[1]);
	            if (harvestResult == ERR_NOT_IN_RANGE) {
	                creep.moveTo(sources[1]);
	            } else if (harvestResult == ERR_NOT_ENOUGH_RESOURCES) {
	                var container = this.findNonVoidEnergyContainer(creep.room);
	                if (creep.withdraw(container, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
	                    creep.moveTo(container);
	                }
	            }
	        } else {
	            if (Game.spawns['Underground Traaains'].energy < 300) {
	                if (creep.transfer(Game.spawns['Underground Traaains'], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
	                    creep.moveTo(Game.spawns['Underground Traaains']);
	                }
	            } else if (void_extension = this.getFirstVoidExtension(creep.room)) {
	                if (creep.transfer(void_extension, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
	                    creep.moveTo(void_extension);
	                }
	            } else {
	                if (prioStructure = role.buildPriority()) {
	                    if (creep.build(prioStructure) == ERR_NOT_IN_RANGE) {
	                        creep.moveTo(prioStructure);
	                    }
	                } else if (tower = this.getVoidTower(creep.room)) {
	                    if (creep.transfer(tower, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
	                        creep.moveTo(tower);
	                    }
	                } else if (creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
	                    creep.moveTo(creep.room.controller);
	                }
	            }
	        }
	    },

	    filterNonVoidExtension: function filterNonVoidExtension(structure) {
	        return structure.structureType == STRUCTURE_EXTENSION && structure.energy < 50;
	    },
	    findNonVoidEnergyContainer: function findNonVoidEnergyContainer(room) {
	        var containers = room.find(FIND_STRUCTURES, { filter: function filter(struc) {
	                return struc.structureType == STRUCTURE_CONTAINER && struc.store[RESOURCE_ENERGY] > 0;
	            } });
	        if (containers.length) {
	            return containers[0];
	        } else {
	            return null;
	        }
	    },
	    getFirstVoidExtension: function getFirstVoidExtension(room) {
	        void_extensions = room.find(FIND_MY_STRUCTURES, { filter: this.filterNonVoidExtension });
	        if (void_extensions.length > 0) {
	            void_extension = Array.isArray(void_extensions) ? void_extensions[0] : void_extensions;
	            return void_extension;
	        } else {
	            return null;
	        }
	    },
	    getVoidTower: function getVoidTower(room) {
	        var tower = room.find(FIND_MY_STRUCTURES, { filter: function filter(structure) {
	                return structure.structureType == STRUCTURE_TOWER && structure.energy < structure.energyCapacity;
	            } });
	        if (Array.isArray(tower)) {
	            return tower[0];
	        } else if (!tower) {
	            return null;
	        } else {
	            return tower;
	        }
	    }
	};

	module.exports = roleHarvester;

/***/ },
/* 4 */
/***/ function(module, exports) {

	'use strict';

	module.exports = {
	    buildPriority: function buildPriority(creep) {
	        if (Memory.buildPriority) {
	            return Game.getObjectById(Memory.buildPriority);
	        } else {
	            return null;
	        }
	    },

	    findNonVoidEnergyContainer: function findNonVoidEnergyContainer(creep) {
	        var container = creep.pos.findClosestByPath(FIND_STRUCTURES, { filter: function filter(struc) {
	                return struc.structureType == STRUCTURE_CONTAINER && struc.store[RESOURCE_ENERGY] > 0;
	            } });
	        return container;
	    },
	    getToDismantleStructure: function getToDismantleStructure(creep) {
	        var structures = creep.room.memory.dismantleQueue;
	        if (Array.isArray(structures)) {
	            var structureId = structures[0];
	            if (structure = Game.getObjectById(structureId)) {
	                return structure;
	            } else {
	                // Remove structure from Queue since it doesnt exist anymore
	                console.log('Finished dismantling structure.');
	                creep.room.memory.dismantleQueue.shift();
	                return this.getToDismantleStructure(creep);
	            }
	        } else {
	            return null;
	        }
	    }
	};

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var role = __webpack_require__(4);

	var roleUpgrader = {

	    /** @param {Creep} creep **/
	    run: function run(creep) {
	        if (creep.carry.energy == creep.carryCapacity && creep.memory.harvesting) {
	            creep.memory.harvesting = false;
	        } else if (creep.carry.energy == 0 && !creep.memory.harvesting) {
	            creep.memory.harvesting = true;
	        }

	        if (creep.memory.harvesting) {
	            if (container = role.findNonVoidEnergyContainer(creep)) {
	                if (creep.withdraw(container, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
	                    creep.moveTo(container);
	                }
	            } else {
	                // Do nothing *SadPanda*
	            }
	        } else {
	            if (prioStructure = role.buildPriority()) {
	                if (creep.build(prioStructure) == ERR_NOT_IN_RANGE) {
	                    creep.moveTo(prioStructure);
	                }
	            } else if (creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
	                creep.moveTo(creep.room.controller);
	            }
	        }
	    }
	};

	module.exports = roleUpgrader;

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var role = __webpack_require__(4);

	var roleBuilder = {

					/** @param {Creep} creep **/
					run: function run(creep) {

									if (creep.memory.building && creep.carry.energy == 0) {
													creep.memory.building = false;
									}
									if (!creep.memory.building && creep.carry.energy == creep.carryCapacity) {
													creep.memory.building = true;
									}

									if (creep.memory.building) {
													var targets = creep.room.find(FIND_CONSTRUCTION_SITES);
													if (targets.length) {
																	if (creep.build(targets[0]) == ERR_NOT_IN_RANGE) {
																					creep.moveTo(targets[0]);
																	}
													} else {
																	if (target = this.getRepairTarget(creep)) {
																					if (creep.repair(target) == ERR_NOT_IN_RANGE) {
																									creep.moveTo(target);
																					}
																	}
													}
									} else {
													//if(structure = role.getToDismantleStructure(creep)) {
													//    if(creep.dismantle(structure) == ERR_NOT_IN_RANGE) {
													//        creep.moveTo(structure)
													//    }
													//}
													//else {
													var sources = creep.room.find(FIND_SOURCES);
													if (creep.harvest(sources[1]) == ERR_NOT_IN_RANGE) {
																	creep.moveTo(sources[1]);
													}
													//}
									}
					},

					getRepairTarget: function getRepairTarget(creep) {
									if (creep.memory.repairTarget) {
													// Target has full health, dont try to continue repairing it
													var structure = Game.getObjectById(creep.memory.repairTarget);
													if (structure.hits >= structure.hitsMax) {
																	creep.memory.repairTarget = false;
																	return null;
													} else {
																	return structure;
													}
									} else {
													// Search for a target to repair and try to repair it
													var targets = creep.room.find(FIND_MY_STRUCTURES, {
																	filter: function filter(object) {
																					return object.hits < object.hitsMax * 0.8;
																	}
													});
													if (targets && targets.length) {

																	targets = targets.sort(function (a, b) {
																					return a.hits - b.hits;
																	});
																	if (Array.isArray(targets)) {

																					creep.memory.repairTarget = targets[0].id;
																					return targets[0];
																	} else {
																					return null;
																	}
													} else {
																	return null;
													}
									}
					}
	};

	module.exports = roleBuilder;

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var role = __webpack_require__(4);

	/**
	 * An Excavator should be defined by the following Memory-Vars:
	 *   from - Id where to get the resources from
	 *   to   - Id where to put the resources into
	 */

	var roleExcavator = {

	    /** @param {Creep} creep **/
	    run: function run(creep) {
	        if (creep.carry.energy == creep.carryCapacity && creep.memory.harvesting) {
	            creep.memory.harvesting = false;
	        } else if (creep.carry.energy == 0 && !creep.memory.harvesting) {
	            creep.memory.harvesting = true;
	        }

	        if (creep.memory.harvesting) {
	            var source = Game.getObjectById(creep.memory.fromSource);
	            if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
	                creep.moveTo(source);
	            }
	        } else {
	            var store = Game.getObjectById(creep.memory.toTarget);
	            if (store && store['store'] && store.store[RESOURCE_ENERGY] < store.storeCapacity) {
	                if (creep.transfer(store, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
	                    creep.moveTo(store);
	                }
	            } else if (void_extension = this.getFirstVoidExtension(creep.room)) {
	                if (creep.transfer(void_extension, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
	                    creep.moveTo(void_extension);
	                }
	            } else {
	                if (prioStructure = role.buildPriority()) {
	                    if (creep.build(prioStructure) == ERR_NOT_IN_RANGE) {
	                        creep.moveTo(prioStructure);
	                    }
	                } else if (tower = this.getVoidTower(creep.room)) {
	                    if (creep.transfer(tower, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
	                        creep.moveTo(tower);
	                    }
	                }
	            }
	        }
	    },

	    filterNonVoidExtension: function filterNonVoidExtension(structure) {
	        return structure.structureType == STRUCTURE_EXTENSION && structure.energy < 50;
	    },
	    getFirstVoidExtension: function getFirstVoidExtension(room) {
	        void_extensions = room.find(FIND_MY_STRUCTURES, { filter: this.filterNonVoidExtension });
	        if (void_extensions.length > 0) {
	            void_extension = Array.isArray(void_extensions) ? void_extensions[0] : void_extensions;
	            return void_extension;
	        } else {
	            return null;
	        }
	    },
	    getVoidTower: function getVoidTower(room) {
	        var tower = room.find(FIND_MY_STRUCTURES, { filter: function filter(structure) {
	                return structure.structureType == STRUCTURE_TOWER && structure.energy < structure.energyCapacity;
	            } });
	        if (Array.isArray(tower)) {
	            return tower[0];
	        } else if (!tower) {
	            return null;
	        } else {
	            return tower;
	        }
	    }
	};

	module.exports = roleExcavator;

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var role = __webpack_require__(4);

	var roleRepairer = {

	    /** @param {Creep} creep **/
	    run: function run(creep) {

	        if (creep.memory.repairing && creep.carry.energy == 0) {
	            creep.memory.repairing = false;
	            creep.memory.repairTarget = false;
	        }
	        if (!creep.memory.repairing && creep.carry.energy == creep.carryCapacity) {
	            creep.memory.repairing = true;
	        }

	        if (creep.memory.repairing) {
	            if (target = this.getRepairTarget(creep)) {
	                if (creep.repair(target) == ERR_NOT_IN_RANGE) {
	                    creep.moveTo(target);
	                }
	            }
	        } else {
	            if (container = role.findNonVoidEnergyContainer(creep)) {
	                if (creep.withdraw(container, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
	                    creep.moveTo(container);
	                }
	            } else {
	                var sources = creep.room.find(FIND_SOURCES);
	                if (creep.harvest(sources[1]) == ERR_NOT_IN_RANGE) {
	                    creep.moveTo(sources[1]);
	                }
	            }
	        }
	    },

	    getRepairTarget: function getRepairTarget(creep) {
	        if (creep.memory.repairTarget) {
	            // Target has full health, dont try to continue repairing it
	            var structure = Game.getObjectById(creep.memory.repairTarget);
	            if (structure.hits >= structure.hitsMax) {
	                creep.memory.repairTarget = false;
	                return null;
	            } else {
	                return structure;
	            }
	        } else {
	            // Search for a target to repair and try to repair it
	            var targets = creep.room.find(FIND_STRUCTURES, {
	                filter: function filter(struc) {
	                    return struc.hits < struc.hitsMax * 0.9 && (struc.structureType == STRUCTURE_WALL && creep.room.memory.wallHitsMax > struc.hits || struc.structureType == STRUCTURE_RAMPART && creep.room.memory.rampartHitsMax > struc.hits || struc.structureType != STRUCTURE_WALL) && creep.room.memory.dismantleQueue.indexOf(struc.id) == -1;
	                }
	            });
	            if (targets && targets.length) {

	                targets = targets.sort(function (a, b) {
	                    return a.hits - b.hits;
	                });
	                if (Array.isArray(targets)) {

	                    creep.memory.repairTarget = targets[0].id;
	                    return targets[0];
	                } else {
	                    return null;
	                }
	            } else {
	                return null;
	            }
	        }
	    }
	};

	module.exports = roleRepairer;

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var role = __webpack_require__(4);

	/**
	 * An Transporter should be defined by the following Memory-Vars:
	 *   fromSource - Object wit `id` where to get the resources from
	 *   toTarget   - Object with `id` where to put the resources into
	 *   resource   - The resource to transport
	 *
	 */

	var roleTransporter = {

	    /** @param {Creep} creep **/
	    run: function run(creep) {
	        var fromSource = creep.memory.fromSource;
	        var toTarget = creep.memory.toTarget;
	        var source = Game.getObjectById(creep.memory.fromSource.id);
	        var target = Game.getObjectById(creep.memory.toTarget.id);
	        if (creep.carry.energy == creep.carryCapacity && creep.memory.transporting) {
	            creep.say('To target');
	            creep.memory.transporting = false;
	        } else if (creep.carry.energy == 0 && !creep.memory.transporting) {
	            creep.say('To source');
	            creep.memory.transporting = true;
	        }

	        if (creep.memory.transporting) {
	            if (source) {
	                if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
	                    creep.moveTo(source, { reusePath: 20 });
	                }
	            } else if (fromSource.room) {
	                creep.moveTo(new RoomPosition(25, 25, fromSource.room));
	            } else {
	                creep.say('Source where?!');
	            }
	        } else {
	            if (!target || !target.store) {
	                creep.say('Target where?!');
	                return;
	            }
	            if (target.store[RESOURCE_ENERGY] < target.storeCapacity) {
	                if (creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
	                    creep.moveTo(target, { reusePath: 20 });
	                }
	            }
	        }
	    }

	};

	module.exports = roleTransporter;

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var spawner = __webpack_require__(11);

	var spawnCreepWatcher = {
	    run: function run(spawn) {
	        var harvesters = _.filter(Game.creeps, function (creep) {
	            return creep.memory.role == 'harvester';
	        });
	        if (harvesters.length < spawn.memory.harvesterSize) {
	            var res = spawner.harvester();
	            if (res != ERR_NOT_ENOUGH_ENERGY && harvesters.length != 0) {} else {
	                spawner.rebootHarvester();
	                console.log('Trying to spawn reboot-Harvester...');
	            }
	        }

	        var excavators = _.filter(Game.creeps, function (creep) {
	            return creep.memory.role == 'excavator';
	        });
	        if (spawn.memory.excavators) {
	            var _iteratorNormalCompletion = true;
	            var _didIteratorError = false;
	            var _iteratorError = undefined;

	            try {
	                for (var _iterator = spawn.memory.excavators[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
	                    memExcavator = _step.value;

	                    if (_.filter(excavators, function (ex) {
	                        return ex.memory.fromSource == memExcavator.fromSource && ex.memory.toTarget == memExcavator.toTarget;
	                    }).length == 0) {
	                        //console.log("Wanna spawn new excavator!");
	                        var newName = spawner.excavator(memExcavator.fromSource, memExcavator.toTarget);
	                    }
	                }
	            } catch (err) {
	                _didIteratorError = true;
	                _iteratorError = err;
	            } finally {
	                try {
	                    if (!_iteratorNormalCompletion && _iterator.return) {
	                        _iterator.return();
	                    }
	                } finally {
	                    if (_didIteratorError) {
	                        throw _iteratorError;
	                    }
	                }
	            }
	        }

	        var transporters = _.filter(Game.creeps, function (creep) {
	            return creep.memory.role == 'transporter';
	        });
	        if (spawn.memory.transporters) {
	            var _iteratorNormalCompletion2 = true;
	            var _didIteratorError2 = false;
	            var _iteratorError2 = undefined;

	            try {
	                for (var _iterator2 = spawn.memory.transporters[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
	                    memTransporter = _step2.value;

	                    if (_.filter(transporters, function (ex) {
	                        return ex.memory.fromSource.id == memTransporter.fromSource.id && ex.memory.toTarget.id == memTransporter.toTarget.id;
	                    }).length == 0) {
	                        var _newName = spawner.transporter(memTransporter);
	                    }
	                }
	            } catch (err) {
	                _didIteratorError2 = true;
	                _iteratorError2 = err;
	            } finally {
	                try {
	                    if (!_iteratorNormalCompletion2 && _iterator2.return) {
	                        _iterator2.return();
	                    }
	                } finally {
	                    if (_didIteratorError2) {
	                        throw _iteratorError2;
	                    }
	                }
	            }
	        }

	        var upgraders = _.filter(Game.creeps, function (creep) {
	            return creep.memory.role == 'upgrader';
	        });
	        if (upgraders.length < spawn.memory.upgraderSize) {
	            var _newName2 = spawner.upgrader();
	            //console.log('Spawning new upgrader: ' + newName);
	        }

	        var builders = _.filter(Game.creeps, function (creep) {
	            return creep.memory.role == 'builder';
	        });
	        if (builders.length < spawn.memory.builderSize) {
	            var _newName3 = spawner.builder();
	            //console.log('Spawning new builder: ' + newName);
	        }

	        var repairers = _.filter(Game.creeps, function (creep) {
	            return creep.memory.role == 'repairer';
	        });
	        if (repairers.length < spawn.memory.repairerSize) {
	            var _newName4 = spawner.repairer();
	            //console.log('Spawning new builder: ' + newName);
	        }
	    },

	    // TODO Put this somewhere else
	    cleanupMemory: function cleanupMemory() {
	        for (var name in Memory.creeps) {
	            if (!Game.creeps[name]) {
	                delete Memory.creeps[name];
	                console.log('Clearing non-existing creep memory:', name);
	            }
	        }
	    }
	};

	module.exports = spawnCreepWatcher;

/***/ },
/* 11 */
/***/ function(module, exports) {

	'use strict';

	var spawner = {
	    rebootHarvester: function rebootHarvester() {
	        return Game.spawns['Underground Traaains'].createCreep([WORK, CARRY, CARRY, MOVE, MOVE], 'Harvester' + this.newCreepIndex(), { role: 'harvester' });
	    },
	    harvester: function harvester() {
	        return Game.spawns['Underground Traaains'].createCreep([WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE], 'Harvester' + this.newCreepIndex(), { role: 'harvester' });
	    },
	    excavator: function excavator(fromSource, toTarget) {
	        return Game.spawns['Underground Traaains'].createCreep([WORK, WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, MOVE], 'Excavator' + this.newCreepIndex(), { role: 'excavator', fromSource: fromSource, toTarget: toTarget });
	    },
	    upgrader: function upgrader() {
	        return Game.spawns['Underground Traaains'].createCreep([WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE], 'Upgrader' + this.newCreepIndex(), { role: 'upgrader' });
	    },
	    builder: function builder() {
	        return Game.spawns['Underground Traaains'].createCreep([WORK, WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE], 'Builder' + this.newCreepIndex(), { role: 'builder' });
	    },
	    repairer: function repairer() {
	        return Game.spawns['Underground Traaains'].createCreep([WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE], 'Repairer' + this.newCreepIndex(), { role: 'repairer' });
	    },
	    fighter: function fighter() {
	        return Game.spawns['Underground Traaains'].createCreep([MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK], 'Builder' + this.newCreepIndex(), { role: 'fighter' });
	    },
	    rangedFighter: function rangedFighter() {
	        return Game.spawns['Underground Traaains'].createCreep([MOVE, MOVE, MOVE, MOVE, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK], 'Builder' + this.newCreepIndex(), { role: 'rangedFighter' });
	    },
	    transporter: function transporter(_ref) {
	        var fromSource = _ref.fromSource;
	        var toTarget = _ref.toTarget;

	        var source = Game.getObjectById(fromSource);
	        var target = Game.getObjectById(toTarget);

	        // ADD CALCULATION (With `PathFinder`) FOR MODULES HERE

	        return Game.spawns['Underground Traaains'].createCreep([WORK, WORK, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE], 'Transporter' + this.newCreepIndex(), { role: 'transporter', fromSource: fromSource, toTarget: toTarget });
	    },
	    newCreepIndex: function newCreepIndex() {
	        var index = Memory.creepIndex;
	        Memory.creepIndex += 1;
	        return index;
	    }
	};

	module.exports = spawner;

/***/ }
/******/ ]);
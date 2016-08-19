module.exports = 
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

	/* WEBPACK VAR INJECTION */(function(global) {'use strict';

	var _defense = __webpack_require__(1);

	var _defense2 = _interopRequireDefault(_defense);

	var _harvester = __webpack_require__(3);

	var _harvester2 = _interopRequireDefault(_harvester);

	var _upgrader = __webpack_require__(5);

	var _upgrader2 = _interopRequireDefault(_upgrader);

	var _builder = __webpack_require__(6);

	var _builder2 = _interopRequireDefault(_builder);

	var _excavator = __webpack_require__(7);

	var _excavator2 = _interopRequireDefault(_excavator);

	var _repairer = __webpack_require__(8);

	var _repairer2 = _interopRequireDefault(_repairer);

	var _transporter = __webpack_require__(9);

	var _transporter2 = _interopRequireDefault(_transporter);

	var _creepWatcher = __webpack_require__(10);

	var _creepWatcher2 = _interopRequireDefault(_creepWatcher);

	var _fighter = __webpack_require__(12);

	var _fighter2 = _interopRequireDefault(_fighter);

	var _healer = __webpack_require__(13);

	var _healer2 = _interopRequireDefault(_healer);

	var _rangedFighter = __webpack_require__(14);

	var _rangedFighter2 = _interopRequireDefault(_rangedFighter);

	var _assimilator = __webpack_require__(15);

	var _assimilator2 = _interopRequireDefault(_assimilator);

	var _priorityQueue = __webpack_require__(16);

	var _priorityQueue2 = _interopRequireDefault(_priorityQueue);

	var _hiveMind = __webpack_require__(17);

	var _hiveMind2 = _interopRequireDefault(_hiveMind);

	var _Overlord = __webpack_require__(18);

	var _Overlord2 = _interopRequireDefault(_Overlord);

	var _Zergling = __webpack_require__(19);

	var _Zergling2 = _interopRequireDefault(_Zergling);

	var _spawner = __webpack_require__(11);

	var _spawner2 = _interopRequireDefault(_spawner);

	var _Stats = __webpack_require__(20);

	var _Stats2 = _interopRequireDefault(_Stats);

	__webpack_require__(21);

	var _screepsProfiler = __webpack_require__(72);

	var _screepsProfiler2 = _interopRequireDefault(_screepsProfiler);

	var _helper = __webpack_require__(2);

	var _helper2 = _interopRequireDefault(_helper);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	// Maximum range for a remote mine, assuming 100% effectiveness: 190 squares

	// QueueData:
	// data[roomName][id]

	_screepsProfiler2.default.enable();

	module.exports.loop = () => _screepsProfiler2.default.wrap(() => {

	  _hiveMind2.default.init();
	  PathFinder.use(true);
	  let stats = new _Stats2.default();
	  stats.begin();

	  if (Game.time % 5000 == 0) {
	    _creepWatcher2.default.cleanupMemory();
	  }
	  if (Game.time % 10 == 0) {
	    // Logging purposes
	    log.cyan('Removing Old HiveMindItems');
	    new _Overlord2.default('NoFrigginRoom').removeOldHiveMindItems();
	  }

	  global.Spawner = _spawner2.default;
	  global.Overlord = _Overlord2.default;
	  global.hiveMind = _hiveMind2.default;
	  global.logHiveMindOf = spawnName => {
	    new _Overlord2.default(Game.spawns[spawnName].room.name).logQueuedItems();
	  };
	  global.resetHive = () => {
	    Memory.hiveMind = {};
	    Memory.hiveMindIndex = 0;
	    for (let roomName in Game.rooms) {
	      let room = Game.rooms[roomName];
	      if (!room.memory.priorityQueues) {
	        continue;
	      }
	      for (let queueName in room.memory.priorityQueues) {
	        room.memory.priorityQueues[queueName] = [];
	      }
	    }
	    for (let creepName in Game.creeps) {
	      let creep = Game.creeps[creepName];
	      delete creep.memory.item;
	      delete creep.memory.sourcing;
	      delete creep.memory.kind;
	    }
	  };

	  try {
	    for (let name in Game.spawns) {
	      _creepWatcher2.default.run(Game.spawns[name]);
	      _defense2.default.defendRoom(Game.spawns[name].room);
	    }

	    try {
	      for (let roomName in Game.rooms) {
	        let room = Game.rooms[roomName];
	        let priorityQueues = false;
	        if (room.memory.priorityQueues && Object.keys(room.memory.priorityQueues).length > 0) {
	          priorityQueues = _.mapValues(room.memory.priorityQueues, queue => new _priorityQueue2.default(queue));
	        }
	        if (Game.time % 3 == 0) {
	          let overlord = new _Overlord2.default(roomName);
	          if (priorityQueues) {
	            overlord.update(priorityQueues);
	          }
	        }
	        let zerglings = room.find(FIND_MY_CREEPS, { filter: c => c.memory.role == 'zergling' });
	        if (zerglings.length > 0) {
	          zerglings.forEach(zerglingCreep => {
	            let zergling = new _Zergling2.default(zerglingCreep);
	            zergling.run(priorityQueues);
	          });
	        }
	      }
	    } catch (e) {
	      console.log(`${ e.name }: ${ e.message } - ${ e.stack }`);
	    }

	    for (let name in Game.creeps) {
	      let creep = Game.creeps[name];
	      if (creep.memory.role == 'harvester') {
	        _harvester2.default.run(creep);
	      } else if (creep.memory.role == 'transporter') {
	        _transporter2.default.run(creep);
	      } else if (creep.memory.role == 'upgrader') {
	        _upgrader2.default.run(creep);
	      } else if (creep.memory.role == 'builder') {
	        _builder2.default.run(creep);
	      } else if (creep.memory.role == 'excavator') {
	        _excavator2.default.run(creep);
	      } else if (creep.memory.role == 'repairer') {
	        _repairer2.default.run(creep);
	      } else if (creep.memory.role == 'fighter') {
	        _fighter2.default.run(creep);
	      } else if (creep.memory.role == 'rangedFighter') {
	        _rangedFighter2.default.run(creep);
	      } else if (creep.memory.role == 'healer') {
	        _healer2.default.run(creep);
	      } else if (creep.memory.role == 'assimilator') {
	        _assimilator2.default.run(creep);
	      } else if (creep.memory.role == 'zergling') {} else {
	        console.log("No role for ${creep.name}!");
	      }
	    }
	  } catch (e) {
	    console.log(`${ e.name }: ${ e.message } - ${ e.stack }`);
	  } finally {
	    _hiveMind2.default.save();
	    stats.persist();
	  }
	});
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

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

	const helper = __webpack_require__(2);

	module.exports = {
	    defendRoom(room) {
	        var hostiles = room.find(FIND_HOSTILE_CREEPS);
	        if (hostiles.length > 0) {
	            try {
	                this.lulz();
	            } catch (e) {
	                Game.notify(e.stack);
	            }
	            const username = hostiles[0].owner.username;
	            //Game.notify(`User ${username} spotted in room ${room.name}`);
	            const towers = room.find(FIND_MY_STRUCTURES, { filter: { structureType: STRUCTURE_TOWER } });
	            towers.forEach(tower => tower.attack(this.mostValuableTarget(hostiles, tower)));
	        }
	    },

	    mostValuableTarget(hostiles, tower) {
	        const values = _.map(hostiles, hostile => ({ id: hostile.id, value: this.calculateTargetValue(hostile, tower) }));
	        const target = _.last(_.sortBy(values, 'value'));
	        Memory.inspectMe = target;
	        if (target.value > -800) {
	            return Game.getObjectById(target.id);
	        } else {
	            return null;
	        }
	    },

	    calculateTargetValue(hostile, tower) {
	        const position = hostile.pos;
	        const room = Game.rooms[hostile.pos.roomName];
	        const surroundingCreepData = room.lookForAtArea(LOOK_CREEPS, position.y - 1, position.x - 1, position.y + 1, position.x + 1, true);
	        const surroundingCreeps = _.map(surroundingCreepData, d => d.creep);
	        let surroundingHealers = _.filter(surroundingCreeps, this.filterHealer);

	        const range = position.getRangeTo(tower);

	        // Dont allow baiting all energy from the tower
	        const specialMod = range > 10 && tower.energy < 750 || range > 8 && tower.energy < 650 ? -1000 : 0;

	        return -range * (range * 0.5) + surroundingHealers.length * (-30 + range * 0.9) + specialMod;
	    },

	    filterHealer(creep) {
	        return creep.getActiveBodyparts(HEAL) > 0;
	    },

	    lulz() {
	        helper.randomProperty(Game.creeps).say("Go away!", true);
	    }

	};

/***/ },
/* 2 */
/***/ function(module, exports) {

	/* WEBPACK VAR INJECTION */(function(global) {"use strict";

	/*
	 * Module code goes here. Use 'module.exports' to export things:
	 * module.exports.thing = 'a thing';
	 *
	 * You can import it from another modules like this:
	 * var mod = require('helper');
	 * mod.thing == 'a thing'; // true
	 */

	global.log = {
	    cyan: str => console.log(`<span style="color: #00BFFF">${ str }</span>`),
	    red: str => console.log(`<span style="color: red">${ str }</span>`),
	    green: str => console.log(`<span style="color: #aadd33">${ str }</span>`),
	    blue: str => console.log(`<span style="color: blue">${ str }</span>`)
	};

	module.exports = {
	    randomProperty: function (obj) {
	        var keys = Object.keys(obj);
	        return obj[keys[keys.length * Math.random() << 0]];
	    }
	};
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	const role = __webpack_require__(4);

	const roleHarvester = {

	  /** @param {Creep} creep **/
	  run: function (creep) {

	    if (creep.carry.energy == creep.carryCapacity && creep.memory.harvesting) {
	      creep.memory.harvesting = false;
	    } else if (creep.carry.energy == 0 && !creep.memory.harvesting) {
	      creep.memory.harvesting = true;
	    }
	    if (creep.memory.harvesting) {
	      // CONTAINERS
	      let container = this.findNonVoidEnergyContainer(creep.room);
	      if (container) {
	        if (creep.withdraw(container, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
	          creep.moveTo(container);
	        }
	      } else {
	        // DROPPED RESOURCES
	        let droppedViableRes = creep.room.find(FIND_DROPPED_RESOURCES, { filter: res => res.resourceType == RESOURCE_ENERGY });
	        if (droppedViableRes.length) {
	          let res = creep.pickup(droppedViableRes[0]);
	          if (res == ERR_NOT_IN_RANGE) {
	            creep.moveTo(droppedViableRes[0]);
	          }
	        } else {
	          // HARVEST
	          var sources = creep.room.find(FIND_SOURCES);
	          let harvestResult = creep.harvest(sources[1]);
	          if (harvestResult == ERR_NOT_IN_RANGE) {
	            creep.moveTo(sources[1]);
	          }
	        }
	      }
	    } else {
	      let void_extension;
	      let spawns = Game.rooms[creep.pos.roomName].find(FIND_MY_STRUCTURES, { filter: { structureType: STRUCTURE_SPAWN } });
	      if (spawns.length > 0 && spawns[0].energy < 300) {
	        if (creep.transfer(spawns[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
	          creep.moveTo(spawns[0]);
	        }
	      } else if (void_extension = this.getFirstVoidExtension(creep.room)) {
	        if (creep.transfer(void_extension, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
	          creep.moveTo(void_extension);
	        }
	      } else {
	        let prioStructure;
	        let tower;
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

	  filterNonVoidExtension(structure) {
	    return structure.structureType == STRUCTURE_EXTENSION && structure.energy < 50;
	  },

	  findNonVoidEnergyContainer(room) {
	    let containers = room.find(FIND_STRUCTURES, { filter: struc => struc.structureType == STRUCTURE_CONTAINER && struc.store[RESOURCE_ENERGY] > 200 });
	    if (containers.length) {
	      return containers[0];
	    } else {
	      return null;
	    }
	  },

	  getFirstVoidExtension(room) {
	    let void_extensions = room.find(FIND_MY_STRUCTURES, { filter: this.filterNonVoidExtension });
	    if (void_extensions.length > 0) {
	      let void_extension = Array.isArray(void_extensions) ? void_extensions[0] : void_extensions;
	      return void_extension;
	    } else {
	      return null;
	    }
	  },

	  getVoidTower(room) {
	    let tower = room.find(FIND_MY_STRUCTURES, { filter: structure => structure.structureType == STRUCTURE_TOWER && structure.energy < structure.energyCapacity });
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
	  buildPriority: function (creep) {
	    if (Memory.buildPriority) {
	      return Game.getObjectById(Memory.buildPriority);
	    } else {
	      return null;
	    }
	  },

	  findNonVoidEnergyContainer(creep) {
	    let container = creep.pos.findClosestByPath(FIND_STRUCTURES, { filter: struc => struc.structureType == STRUCTURE_CONTAINER && struc.store[RESOURCE_ENERGY] > 0 });
	    return container;
	  },

	  getToDismantleStructure(creep) {
	    const structures = creep.room.memory.dismantleQueue;
	    if (Array.isArray(structures)) {
	      const structureId = structures[0];
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
	  },

	  getStorageTarget(creep) {
	    let void_extension;
	    if (Game.spawns['Underground Traaains'].energy < 300) {
	      if (creep.transfer(Game.spawns['Underground Traaains'], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
	        creep.moveTo(Game.spawns['Underground Traaains']);
	      }
	    } else if (void_extension = this.getFirstVoidExtension(creep.room)) {
	      if (creep.transfer(void_extension, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
	        creep.moveTo(void_extension);
	      }
	    } else {
	      let prioStructure;
	      let tower;
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
	};

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	const role = __webpack_require__(4);

	var roleUpgrader = {

	    /** @param {Creep} creep **/
	    run: function (creep) {
	        if (creep.carry.energy == creep.carryCapacity && creep.memory.harvesting) {
	            creep.memory.harvesting = false;
	        } else if (creep.carry.energy == 0 && !creep.memory.harvesting) {
	            creep.memory.harvesting = true;
	        }

	        if (creep.memory.harvesting) {
	            let container;
	            if (container = role.findNonVoidEnergyContainer(creep)) {
	                if (creep.withdraw(container, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
	                    creep.moveTo(container);
	                }
	            } else {
	                // Do nothing *SadPanda*
	            }
	        } else {
	            let prioStructure;
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

	const role = __webpack_require__(4);

	const roleBuilder = {

	  /** @param {Creep} creep **/
	  run: function (creep) {

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
	        let target = this.getRepairTarget(creep);
	        if (target) {
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


	      // CONTAINERS
	      let container = this.findNonVoidEnergyContainer(creep.room);
	      if (container) {
	        if (creep.withdraw(container, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
	          creep.moveTo(container);
	        }
	      } else {
	        // DROPPED RESOURCES
	        let droppedViableRes = creep.room.find(FIND_DROPPED_RESOURCES, { filter: res => res.resourceType == RESOURCE_ENERGY });
	        if (droppedViableRes.length) {
	          let res = creep.pickup(droppedViableRes[0]);
	          if (res == ERR_NOT_IN_RANGE) {
	            creep.moveTo(droppedViableRes[0]);
	          }
	        } else {
	          // HARVEST
	          var sources = creep.room.find(FIND_SOURCES);
	          let harvestResult = creep.harvest(sources[1]);
	          if (harvestResult == ERR_NOT_IN_RANGE) {
	            creep.moveTo(sources[1]);
	          }
	        }
	      }
	      //}
	    }
	  },

	  getRepairTarget: function (creep) {
	    if (creep.memory.repairTarget) {
	      // Target has full health, dont try to continue repairing it
	      let structure = Game.getObjectById(creep.memory.repairTarget);
	      if (structure.hits >= structure.hitsMax) {
	        creep.memory.repairTarget = false;
	        return null;
	      } else {
	        return structure;
	      }
	    } else {
	      // Search for a target to repair and try to repair it
	      let targets = creep.room.find(FIND_MY_STRUCTURES, {
	        filter: object => object.hits < object.hitsMax * 0.8
	      });
	      if (targets && targets.length) {

	        targets = targets.sort((a, b) => a.hits - b.hits);
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
	  },

	  findNonVoidEnergyContainer: room => {
	    let containers = room.find(FIND_STRUCTURES, { filter: struc => struc.structureType == STRUCTURE_CONTAINER && struc.store[RESOURCE_ENERGY] > 200 });
	    if (containers.length) {
	      return containers[0];
	    } else {
	      return null;
	    }
	  }

	};

	module.exports = roleBuilder;

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	const role = __webpack_require__(4);

	/**
	 * An Excavator should be defined by the following Memory-Vars:
	 *   fromSource - Id where to get the resources from
	 */

	const roleExcavator = {

	  /** @param {Creep} creep **/
	  run: function (creep) {
	    let gPos = this.getExcavationPosition(creep);
	    if (gPos) {
	      if (gPos.x == creep.pos.x && gPos.y == creep.pos.y && gPos.roomName == creep.room.name) {
	        const source = Game.getObjectById(creep.memory.fromSource);
	        let res = creep.harvest(source);
	        switch (res) {
	          case OK:
	            break;
	          case ERR_INVALID_TARGET:
	            creep.say('invalid');
	          case ERR_NOT_IN_RANGE:
	            creep.say('range');
	          case ERR_NO_BODYPART:
	            creep.say('bodypart');
	        }
	      } else {
	        creep.moveTo(gPos);
	      }
	    } else {
	      creep.say('gPos?');
	    }
	  },

	  getExcavationPosition(creep) {
	    if (creep.memory.excavationPosition) {
	      let pos = creep.memory.excavationPosition;
	      return new RoomPosition(pos.x, pos.y, pos.roomName);
	    } else {
	      let pos = this.calcExcavationPosition(creep);
	      if (pos) {
	        creep.memory.excavationPosition = {
	          x: pos.x, y: pos.y, roomName: pos.roomName
	        };
	        return pos;
	      } else {
	        return null;
	      }
	      return null;
	    }
	  },

	  calcExcavationPosition(creep) {
	    let source = Game.getObjectById(creep.memory.fromSource);
	    if (source) {
	      let containers = source.pos.findInRange(FIND_STRUCTURES, 1, { filter: { structureType: STRUCTURE_CONTAINER } });
	      if (containers.length > 0) {
	        let container = containers[0];
	        return new RoomPosition(container.pos.x, container.pos.y, container.room.name);
	      } else {
	        // Any adjacent walkable tile to the source is fine, get the position
	        // to the closest one. Just dont call it to often.
	        let path = creep.pos.findPathTo(source);
	        if (path && path.length) {
	          // If we only are one tile away we are directly at the source
	          let pos = path.length > 1 ? path.slice(-2, -1)[0] : creep.pos;
	          return new RoomPosition(pos.x, pos.y, source.room.name);
	        } else {
	          return null;
	        }
	      }
	    } else {
	      return null;
	    }
	  }
	};

	module.exports = roleExcavator;

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	const role = __webpack_require__(4);

	const roleRepairer = {

	    /** @param {Creep} creep **/
	    run: function (creep) {

	        if (creep.memory.repairing && creep.carry.energy == 0) {
	            creep.memory.repairing = false;
	            creep.memory.repairTarget = false;
	        }
	        if (!creep.memory.repairing && creep.carry.energy == creep.carryCapacity) {
	            creep.memory.repairing = true;
	        }

	        if (creep.memory.repairing) {
	            let target;
	            if (target = this.getRepairTarget(creep)) {
	                if (creep.repair(target) == ERR_NOT_IN_RANGE) {
	                    creep.moveTo(target);
	                }
	            }
	        } else {
	            let container;
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

	    getRepairTarget: function (creep) {
	        if (creep.memory.repairTarget) {
	            // Target has full health, dont try to continue repairing it
	            let structure = Game.getObjectById(creep.memory.repairTarget);
	            if (structure.hits >= structure.hitsMax) {
	                creep.memory.repairTarget = false;
	                return null;
	            } else {
	                return structure;
	            }
	        } else {
	            // Search for a target to repair and try to repair it
	            let targets = creep.room.find(FIND_STRUCTURES, {
	                filter: struc => struc.hits < struc.hitsMax * 0.9 && (struc.structureType == STRUCTURE_WALL && creep.room.memory.wallHitsMax > struc.hits || struc.structureType == STRUCTURE_RAMPART && creep.room.memory.rampartHitsMax > struc.hits || struc.structureType != STRUCTURE_WALL) && (creep.room.memory.dismantleQueue === undefined || creep.room.memory.dismantleQueue.indexOf(struc.id) == -1)
	            });
	            if (targets && targets.length) {

	                targets = targets.sort((a, b) => a.hits - b.hits);
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

	const role = __webpack_require__(4);

	/**
	 * An Transporter should be defined by the following Memory-Vars:
	 *   fromSource - Object wit `id` where to get the resources from
	 *   toTarget   - Object with `id` where to put the resources into
	 *   resource   - The resource to transport
	 *
	 */

	const roleTransporter = {

	    /** @param {Creep} creep **/
	    run: function (creep) {
	        const fromSource = creep.memory.fromSource;
	        const toTarget = creep.memory.toTarget;
	        const source = Game.getObjectById(creep.memory.fromSource.id);
	        const target = Game.getObjectById(creep.memory.toTarget.id);
	        const sp = creep.memory.sourcePos;
	        let sourcePos = false;
	        if (sp) {
	            sourcePos = new RoomPosition(sp.x, sp.y, sp.roomName);
	        }
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
	            } else if (sourcePos) {
	                creep.moveTo(sourcePos);
	            } else {
	                creep.say('Source where?!');
	            }
	        } else {
	            if (!target) {
	                creep.say('Target where?!');
	                return;
	            } else if (target.store !== undefined) {
	                if (target.store[RESOURCE_ENERGY] < target.storeCapacity) {
	                    if (creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
	                        creep.moveTo(target);
	                    }
	                }
	            } else if (target.structureType == STRUCTURE_CONTROLLER) {
	                if (creep.upgradeController(target) == ERR_NOT_IN_RANGE) {
	                    creep.moveTo(target);
	                }
	            } else {
	                if (creep.build(target) == ERR_NOT_IN_RANGE) {
	                    creep.moveTo(target);
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

	const Spawner = __webpack_require__(11);

	var spawnCreepWatcher = {
	    run: function (spawn) {
	        const spawner = new Spawner();
	        const harvesters = _.filter(Game.creeps, creep => creep.memory.role == 'harvester' && creep.pos.roomName == spawn.pos.roomName);
	        if (harvesters.length < spawn.memory.harvesterSize) {
	            const res = spawner.harvester(spawn);
	            if (res != ERR_NOT_ENOUGH_ENERGY && harvesters.length != 0) {} else {
	                spawner.rebootHarvester(spawn);
	                console.log('Trying to spawn reboot-Harvester...');
	            }
	        }

	        let excavators = _.filter(Game.creeps, creep => creep.memory.role == 'excavator' && creep.pos.roomName == spawn.pos.roomName);
	        if (spawn.memory.excavators) {
	            let memExcavator = null;
	            for (let memExcavator of spawn.memory.excavators) {
	                if (_.filter(excavators, ex => ex.memory.fromSource == memExcavator.fromSource).length == 0) {
	                    //console.log("Wanna spawn new excavator!");
	                    let newName = spawner.excavator(spawn, memExcavator.fromSource);
	                }
	            }
	        }

	        let transporters = _.filter(Game.creeps, creep => creep.memory.role == 'transporter');
	        if (spawn.memory.transporters) {
	            let memTransporter = null;
	            for (let memTransporter of spawn.memory.transporters) {
	                if (_.filter(transporters, ex => ex.memory.fromSource.id == memTransporter.fromSource.id && ex.memory.toTarget.id == memTransporter.toTarget.id).length == 0) {
	                    let newName = spawner.transporter(spawn, memTransporter);
	                }
	            }
	        }

	        const upgraders = _.filter(Game.creeps, creep => creep.memory.role == 'upgrader' && creep.pos.roomName == spawn.pos.roomName);
	        if (upgraders.length < spawn.memory.upgraderSize) {
	            const newName = spawner.upgrader(spawn);
	            //console.log('Spawning new upgrader: ' + newName);
	        }

	        let builders = _.filter(Game.creeps, creep => creep.memory.role == 'builder' && creep.pos.roomName == spawn.pos.roomName);
	        if (builders.length < spawn.memory.builderSize) {
	            const newName = spawner.builder(spawn);
	            //console.log('Spawning new builder: ' + newName);
	        }

	        let zerglings = _.filter(Game.creeps, creep => creep.memory.role == 'zergling' && creep.memory.kind && creep.memory.kind[0] == WORK && creep.pos.roomName == spawn.pos.roomName);
	        if (zerglings.length < spawn.memory.zerglingSize) {
	            const newName = spawner.zergling(spawn);
	        }

	        let drones = _.filter(Game.creeps, creep => creep.memory.role == 'zergling' && creep.memory.kind && creep.memory.kind[0] == CARRY && creep.pos.roomName == spawn.pos.roomName);
	        if (drones.length < spawn.memory.droneSize) {
	            const newName = spawner.drone(spawn);
	        }

	        let repairers = _.filter(Game.creeps, creep => creep.memory.role == 'repairer' && creep.pos.roomName == spawn.pos.roomName);
	        if (repairers.length < spawn.memory.repairerSize) {
	            const newName = spawner.repairer(spawn);
	            //console.log('Spawning new builder: ' + newName);
	        }
	    },

	    // TODO Put this somewhere else
	    cleanupMemory: function () {
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

	class Spawner {
	  constructor() {
	    this.rebootHarvester = spawn => {
	      return Game.spawns[spawn.name].createCreep([WORK, CARRY, CARRY, MOVE, MOVE], 'Harvester' + this.newCreepIndex(), { role: 'harvester' });
	    };

	    this.harvester = spawn => {
	      return Game.spawns[spawn.name].createCreep([WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE], 'Harvester' + this.newCreepIndex(), { role: 'harvester' });
	    };

	    this.excavator = (spawn, fromSource) => {
	      return Game.spawns[spawn.name].createCreep([WORK, WORK, WORK, WORK, WORK, MOVE], 'Excavator' + this.newCreepIndex(), { role: 'excavator', fromSource: fromSource });
	    };

	    this.upgrader = spawn => {
	      return Game.spawns[spawn.name].createCreep([WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE], 'Upgrader' + this.newCreepIndex(), { role: 'upgrader' });
	    };

	    this.builder = spawn => {
	      return Game.spawns[spawn.name].createCreep([WORK, WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE], 'Builder' + this.newCreepIndex(), { role: 'builder' });
	    };

	    this.repairer = spawn => {
	      return Game.spawns[spawn.name].createCreep([WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE], 'Repairer' + this.newCreepIndex(), { role: 'repairer' });
	    };

	    this.fighter = spawn => {
	      return Game.spawns[spawn.name].createCreep([MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK], 'Fighter' + this.newCreepIndex(), { role: 'fighter' });
	    };

	    this.rangedFighter = spawn => {
	      return Game.spawns[spawn.name].createCreep([MOVE, MOVE, MOVE, MOVE, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK], 'RangedFighter' + this.newCreepIndex(), { role: 'rangedFighter' });
	    };

	    this.healer = spawn => {
	      return Game.spawns[spawn.name].createCreep([HEAL, HEAL, HEAL, HEAL, MOVE, MOVE, MOVE, MOVE], 'Healer' + this.newCreepIndex(), { role: 'healer' });
	    };

	    this.assimilator = spawn => {
	      return Game.spawns[spawn.name].createCreep([CLAIM, CLAIM, CLAIM, MOVE, MOVE, MOVE], 'Assi' + this.newCreepIndex(), { role: 'assimilator' });
	    };

	    this.reserver = spawn => {
	      return Game.spawns[spawn.name].createCreep([CLAIM, MOVE], 'Assi' + this.newCreepIndex(), { role: 'assimilator' });
	    };

	    this.transporter = (spawn, _ref) => {
	      let fromSource = _ref.fromSource;
	      let toTarget = _ref.toTarget;
	      let sourcePos = _ref.sourcePos;

	      const source = Game.getObjectById(fromSource);
	      const target = Game.getObjectById(toTarget);

	      let body = this.calcCreepBody(spawn.room, [WORK, WORK, CARRY, CARRY, CARRY], 0, false);

	      return Game.spawns[spawn.name].createCreep(body, 'Transporter' + this.newCreepIndex(), { role: 'transporter', fromSource: fromSource, toTarget: toTarget, sourcePos: sourcePos });
	    };

	    this.drone = spawn => {
	      let body = this.calcCreepBody(spawn.room, [CARRY]);
	      return Game.spawns[spawn.name].createCreep(body, 'Drone' + this.newCreepIndex(), { role: 'zergling', kind: [CARRY] });
	    };

	    this.zergling = spawn => {
	      let body = this.calcCreepBody(spawn.room, [WORK, WORK, WORK, CARRY, CARRY]);
	      return Game.spawns[spawn.name].createCreep(body, 'Zergling' + this.newCreepIndex(), { role: 'zergling', kind: [WORK, CARRY] });
	    };

	    this.newCreepIndex = function () {
	      let index = Memory.creepIndex;
	      Memory.creepIndex += 1;
	      return index;
	    };

	    this.calcCreepBody = function (room, parts) {
	      let maxCost = arguments.length <= 2 || arguments[2] === undefined ? 0 : arguments[2];
	      let usingStreet = arguments.length <= 3 || arguments[3] === undefined ? true : arguments[3];

	      let partCost = {
	        [WORK]: 100,
	        [CARRY]: 50,
	        [MOVE]: 50
	      };
	      let roomMaxCost = _.sum(room.find(FIND_MY_STRUCTURES, { filter: struc => struc.structureType == STRUCTURE_EXTENSION || struc.structureType == STRUCTURE_SPAWN }), 'energy');
	      let max = maxCost != 0 ? maxCost : roomMaxCost;
	      let partBlockCost = parts.reduce((memo, part) => memo + partCost[part], 0);
	      let moveRatio = usingStreet ? 1 / 2 : 1;
	      let movesPerBlock = parts.length * moveRatio;
	      let moveCost = movesPerBlock * partCost[MOVE];
	      // We should add one MOVE to the 6 calculated MOVE if we have 13 parts
	      let hiddenMoveCost = movesPerBlock % 1 > 0 ? partCost[MOVE] / 2 : 0;
	      let wholeBlockCost = partBlockCost + moveCost;
	      let maxBlockCount = Math.floor(50 / (parts.length + movesPerBlock));
	      let blockCount = Math.floor((max - hiddenMoveCost) / wholeBlockCost);
	      blockCount = maxBlockCount < blockCount ? maxBlockCount : blockCount;
	      let moveBlockCount = Math.ceil(movesPerBlock * blockCount);
	      let body = [];
	      _.range(moveBlockCount).forEach(() => body.push(MOVE));
	      for (let i = 0; i < blockCount; i += 1) {
	        body = body.concat(parts);
	      }
	      return body;
	    };
	  }

	};

	module.exports = Spawner;

/***/ },
/* 12 */
/***/ function(module, exports) {

	"use strict";

	const roleFighter = {
	  run: creep => {
	    let flag;
	    if (creep.memory.flagName) {
	      flag = Game.flags[creep.memory.flagName];
	    } else {
	      let flags = _.filter(Game.flags, { color: COLOR_RED });
	      if (flags.length) {
	        flag = flags[0];
	      }
	    }
	    if (flag) {
	      creep.moveTo(flag);
	      if (creep.pos.inRangeTo(flag, 1)) {
	        let targets = flag.pos.look();
	        if (targets.length) {
	          creep.attack(targets[0]);
	        }
	      }
	      let targets = creep.pos.findInRange(FIND_HOSTILE_CREEPS, 1);
	      if (targets.length > 0) {
	        creep.attack(targets[0]);
	      }
	    }
	  }
	};

	module.exports = roleFighter;

/***/ },
/* 13 */
/***/ function(module, exports) {

	'use strict';

	const roleHealer = {
	  run: creep => {
	    let flag;
	    if (creep.memory.flagName) {
	      flag = Game.flags[creep.memory.flagName];
	    } else {
	      let flags = _.filter(Game.flags, { color: COLOR_RED });
	      if (flags.length) {
	        flag = flags[0];
	      }
	    }
	    if (flag) {
	      creep.moveTo(flag);
	      if (creep.pos.inRangeTo(flag, 3)) {
	        let targets = flag.pos.look();
	        if (targets.length) {
	          creep.heal(targets[0]);
	        }
	      }
	    }

	    if (creep.hits < creep.hitsMax) {
	      creep.heal(creep);
	    } else {
	      let targets = creep.pos.findInRange(FIND_MY_CREEPS, 1, { filter: creep => creep.hitsMax - creep.hits > 0 });
	      if (!(targets.length > 0)) {
	        targets = creep.pos.findInRange(FIND_MY_CREEPS, 2, { filter: creep => creep.hitsMax - creep.hits > 0 });
	      }
	      targets = _.sortByOrder(targets, c => c.maxHits - c.hits, 'asc');
	      if (targets.length > 0) {
	        creep.heal(targets[0]);
	      }
	    }
	  }
	};

	module.exports = roleHealer;

/***/ },
/* 14 */
/***/ function(module, exports) {

	"use strict";

	const roleRangedFighter = {
	  run: creep => {
	    let flag;
	    if (creep.memory.flagName) {
	      flag = Game.flags[creep.memory.flagName];
	    } else {
	      let flags = _.filter(Game.flags, { color: COLOR_RED });
	      if (flags.length) {
	        flag = flags[0];
	      }
	    }
	    if (flag) {
	      creep.moveTo(flag);
	      if (creep.pos.inRangeTo(flag, 3)) {
	        let targets = flag.pos.look();
	        if (targets.length) {
	          creep.rangedAttack(targets[0]);
	        }
	      }
	    }
	    let targets = creep.pos.findInRange(FIND_HOSTILE_CREEPS, 3);
	    if (targets.length > 0) {
	      creep.rangedAttack(targets[0]);
	    }
	  }
	};

	module.exports = roleRangedFighter;

/***/ },
/* 15 */
/***/ function(module, exports) {

	"use strict";

	const roleAssimilator = {
	  run: creep => {
	    let flag;
	    if (creep.memory.flagName) {
	      flag = Game.flags[creep.memory.flagName];
	    } else {
	      let flags = _.filter(Game.flags, { color: COLOR_PURPLE });
	      if (flags.length) {
	        flag = flags[0];
	      }
	    }
	    if (flag) {
	      creep.moveTo(flag);
	      if (creep.pos.inRangeTo(flag, 0)) {
	        let targets = creep.pos.findInRange(FIND_STRUCTURES, 1, { filter: { structureType: STRUCTURE_CONTROLLER } });
	        if (targets.length) {
	          creep.claimController(targets[0]);
	        }
	      }
	    }
	  }
	};

	module.exports = roleAssimilator;

/***/ },
/* 16 */
/***/ function(module, exports) {

	/* WEBPACK VAR INJECTION */(function(global) {"use strict";

	/**
	 * Reimplementation of
	 * https://github.com/adamhooper/js-priority-queue/blob/master/src/PriorityQueue/BinaryHeapStrategy.coffee
	 */

	class PriorityQueue {
	  constructor(initialValues) {
	    this._heapify = () => {
	      if (this.data.length > 0) {
	        for (let i in [...Array(this.data.length).keys()]) {
	          this._bubbleUp(i);
	        }
	      }
	    };

	    this.queue = value => {
	      this.data.push(value);
	      this._bubbleUp(this.data.length - 1);
	    };

	    this.dequeue = () => {
	      let ret = this.data[0];
	      let last = this.data.pop();
	      if (this.data.length > 0) {
	        this.data[0] = last;
	        this._bubbleDown(0);
	      }
	      return ret;
	    };

	    this.peek = () => {
	      return this.data[0];
	    };

	    this.clear = () => {
	      this.length = 0;
	      this.data.length = 0;
	    };

	    this._bubbleUp = pos => {
	      while (pos > 0) {
	        let parent = pos - 1 >>> 1;
	        if (this.comparator(this.data[pos], this.data[parent]) < 0) {
	          let x = this.data[parent];
	          this.data[parent] = this.data[pos];
	          this.data[pos] = x;
	          pos = parent;
	        } else {
	          break;
	        }
	      }
	    };

	    this._bubbleDown = pos => {
	      let last = this.data.length - 1;

	      while (true) {
	        let left = (pos << 1) + 1;
	        let right = left + 1;
	        let minIndex = pos;
	        if (left <= last && this.comparator(this.data[left], this.data[minIndex]) < 0) {
	          minIndex = left;
	        }
	        if (right <= last && this.comparator(this.data[right], this.data[minIndex]) < 0) {
	          minIndex = right;
	        }

	        if (minIndex != pos) {
	          let x = this.data[minIndex];
	          this.data[minIndex] = this.data[pos];
	          this.data[pos] = x;
	        } else {
	          break;
	        }
	      }
	    };

	    this.hasEntryWithId = id => {
	      for (entry of this.data) {
	        if (entry.id == id) return true;
	      }
	      return false;
	    };

	    this.comparator = (a, b) => a.prio - b.prio;
	    this.length = 0;
	    this.data = initialValues;
	    this._heapify();
	  }

	}

	global.lol = PriorityQueue;

	module.exports = PriorityQueue;
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 17 */
/***/ function(module, exports) {

	'use strict';

	// Singleton storing the queue-data
	const hiveMind = {
	  init: function () {
	    this.data = Memory['hiveMind'] || {};
	  },

	  save: function () {
	    Memory['hiveMind'] = this.data;
	  },

	  push: function (data) {
	    let id = this._generateId();
	    data['id'] = id; // Makes it easier for other things to process the items
	    this.data[id] = data;
	    return id;
	  },

	  remove: function (id) {
	    delete this.data[id];
	  },

	  allForRoom: function (room) {
	    return _.filter(this.data, entry => entry.fromSource && entry.fromSource.roomName == room.name || entry.toTarget.roomName == room.name);
	  },

	  _generateId: function () {
	    let index = (Memory['hiveMindIndex'] || 1) + 1;
	    Memory['hiveMindIndex'] = index;
	    return index;
	  }
	};

	module.exports = hiveMind;

/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _hiveMind = __webpack_require__(17);

	var _hiveMind2 = _interopRequireDefault(_hiveMind);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	const TYPE_SOURCE = 0;
	const TYPE_TARGET = 1;

	/**
	 * If creep has finished a task, Overlord should be able to re-add it to the
	 * queue if he wants
	 */

	const CONSTRUCTION_SITE = 999;

	const PRIOS = {
	  [STRUCTURE_SPAWN]: 1000,
	  [STRUCTURE_EXTENSION]: 1100,
	  [STRUCTURE_TOWER]: 1200,
	  [CONSTRUCTION_SITE]: 1900,
	  [STRUCTURE_STORAGE]: 2000,
	  [STRUCTURE_CONTROLLER]: 9000,
	  [STRUCTURE_CONTAINER]: 10000
	};

	class Overlord {
	  constructor(roomName) {
	    _initialiseProps.call(this);

	    this.room = Game.rooms[roomName];
	    // Basic unit to quantify how many tasks the container can serve per amount.
	    // Should be generalized into a room-wide calculation, depending on the
	    // creeps CARRY-Amount
	    //
	    // Or just add an amount to every task and sum it that way
	    this.creepCarryAmount = 450;
	    this.maxItemsPerTask = 20;
	  }

	  /**
	   * Generates taskItems for the given source
	   *
	   * Checks how many items need to be generated to void the source and tries
	   * to find targets for every task of it.
	   * If a target cant be found for the resource, this task will not be
	   * generated.
	   */


	  /**
	   * Generates one taskItem for the given source and returns it
	   *
	   * Checks how many items need to be generated to void the source and tries
	   * to find a target for an item.
	   * If a target cant be found for the resource, this task will not be
	   * generated.
	   */


	  /**
	   * Dont forget: Extensions can have 100 / 200 energyCapacity on higher levels
	   */
	}

	var _initialiseProps = function () {
	  this.update = queues => {

	    this.existingItems = _hiveMind2.default.allForRoom(this.room);

	    if (queues[WORK]) {
	      this.work(queues[WORK]);
	    }
	    if (queues[CARRY]) {
	      this.carry(queues[CARRY]);
	    }
	  };

	  this.work = queue => {

	    // let targetData = this.findWorkTargetFor(RESOURCE_ENERGY)
	    // console.log('targetData', JSON.stringify(targetData))

	    let conSites = this.room.find(FIND_CONSTRUCTION_SITES);
	    if (conSites.length > 0) {
	      for (let conSite of conSites) {
	        let targetItems = _.filter(this.existingItems, item => item.toTarget.id == conSite.id);
	        let ullage = conSite.progressTotal - (conSite.progress + _.sum(targetItems, t => t.toTarget.amount));
	        let itemCount = targetItems.length;
	        let amount = ullage < this.creepCarryAmount ? ullage : this.creepCarryAmount;
	        while (ullage > 0 && itemCount < this.maxItemsPerTask) {
	          this.addItem(queue, false, conSite, RESOURCE_ENERGY, amount, PRIOS[CONSTRUCTION_SITE]);
	          itemCount += 1;
	          ullage -= amount;
	        }
	      }
	    }

	    let controllers = this.room.find(FIND_STRUCTURES, { filter: { structureType: STRUCTURE_CONTROLLER } });
	    if (controllers) {
	      let controller = controllers[0];
	      let targetItems = _.filter(this.existingItems, item => item.toTarget.id == controller.id);
	      let itemCount = targetItems.length;
	      while (itemCount < this.maxItemsPerTask) {
	        this.addItem(queue, false, controller, RESOURCE_ENERGY, this.creepCarryAmount, PRIOS[STRUCTURE_CONTROLLER]);
	        itemCount += 1;
	      }
	    }

	    // let storages = this.room.find(
	    //   FIND_STRUCTURES, {filter: this.filterNonVoidEnergyStorage}
	    // )
	    // if(storages.length > 0) {
	    //   let storage = storages[0]
	    //   this.genSourceTasks(storage, queue, WORK)
	    // }
	    // let containers = this.room.find(
	    //   FIND_STRUCTURES, {filter: this.filterNonVoidEnergyContainers}
	    // )
	    // if(containers.length > 0) {
	    //   containers.forEach((container)=> {
	    //     this.genSourceTasks(container, queue, WORK)
	    //   })
	    // }
	  };

	  this.carry = queue => {

	    // targetData = this.findCarryTargetFor(RESOURCE_ENERGY)

	    // Find the targets that need stuff and generate tasks for them
	    let lacking = this.room.find(FIND_MY_STRUCTURES, { filter: structure => (structure.structureType == STRUCTURE_SPAWN || structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_TOWER) && structure.energy < structure.energyCapacity });
	    if (this.room.memory.links && this.room.memory.links.sources && this.room.memory.links.sources.length > 0) {
	      lacking.concat(this.room.memory.links.sources.map(source => Game.getObjectById(source)));
	    }
	    if (lacking.length > 0) {
	      // lacking = _.sortByOrder(lacking, 'energy', 'asc')
	      for (let target of lacking) {
	        this.genTargetCarryTasksFor(target, queue, RESOURCE_ENERGY, PRIOS[target.structureType]);
	      }
	    }
	  };

	  this.genTargetCarryTasksFor = (target, queue, resType, prio) => {
	    let current = target.store ? _.sum(target.store) : target.energy;
	    let max = target.storeCapacity ? target.storeCapacity : target.energyCapacity;

	    let targetItems = _.filter(this.existingItems, item => item.toTarget.id == target.id);
	    let itemLength = targetItems.length;
	    let existingAddAmount = targetItems.length * this.creepCarryAmount;
	    let ullage = max - (current + existingAddAmount);

	    while (ullage > 0 && itemLength < this.maxItemsPerTask) {
	      let targetAmount = this.creepCarryAmount < ullage ? this.creepCarryAmount : ullage;
	      this.addItem(queue, false, target, resType, targetAmount, prio);
	      ullage -= targetAmount;
	      itemLength += 1;
	    }
	  };

	  this.genTargetControllerTasks = (controller, queue) => {
	    let targetItems = _.filter(this.existingItems, item => item.toTarget.id == controller.id);
	    let itemLength = targetItems.length;
	    let existingAddAmount = targetItems.length * this.creepCarryAmount;

	    while (itemLength < this.maxItemsPerTask) {
	      let targetAmount = this.creepCarryAmount;
	      this.addItem(queue, false, controller, resType, targetAmount, PRIO);
	      itemLength += 1;
	    }
	  };

	  this.genSourceTasks = (source, queue, taskType) => {
	    let sourceItems = _.filter(this.existingItems, item => item.fromSource && item.fromSource.id == source.id && item.stage != TYPE_TARGET);
	    let existingDrawAmount = _.sum(sourceItems, 'fromSource.amount');
	    let stillStored = source.store[RESOURCE_ENERGY] - existingDrawAmount;
	    let itemCount = sourceItems.length;
	    while (stillStored > this.creepCarryAmount && itemCount < this.maxItemsPerTask) {
	      let targetData = null;
	      if (taskType == CARRY) {
	        targetData = this.findCarryTargetFor(source, RESOURCE_ENERGY);
	      } else if (taskType == WORK) {
	        targetData = this.findWorkTargetFor(source, RESOURCE_ENERGY);
	      }
	      if (targetData && targetData.target) {
	        var _targetData = targetData;
	        let target = _targetData.target;
	        let prio = _targetData.prio;

	        console.log(`Adding target: ${ JSON.stringify(target.pos) } at ${ Game.time }.`);
	        this.addItem(queue, source, target, RESOURCE_ENERGY, this.creepCarryAmount, prio);
	        stillStored -= this.creepCarryAmount;
	        itemCount += 1;
	      } else {
	        break; // No suitable target found
	      }
	    }
	  };

	  this.genSourceTask = (source, queue, taskType) => {
	    let sourceItems = _.filter(this.existingItems, item => item.fromSource && item.fromSource.id == source.id && item.stage != TYPE_TARGET);
	    let existingDrawAmount = _.sum(sourceItems, 'fromSource.amount');
	    let stillStored = source.store[RESOURCE_ENERGY] - existingDrawAmount;
	    let itemCount = sourceItems.length;
	    if (stillStored > this.creepCarryAmount && itemCount < this.maxItemsPerTask) {
	      let targetData = null;
	      if (taskType == CARRY) {
	        targetData = this.findCarryTargetFor(source, RESOURCE_ENERGY);
	      } else if (taskType == WORK) {
	        targetData = this.findWorkTargetFor(source, RESOURCE_ENERGY);
	      }
	      if (targetData && targetData.target) {
	        var _targetData2 = targetData;
	        let target = _targetData2.target;
	        let prio = _targetData2.prio;

	        console.log(`Adding target: ${ JSON.stringify(target.pos) } at ${ Game.time }.`);
	        let res = this.addItem(queue, source, target, RESOURCE_ENERGY, this.creepCarryAmount, prio);
	        stillStored -= this.creepCarryAmount;
	        itemCount += 1;
	        return res;
	      } else {
	        // No suitable target found
	      }
	    }
	  };

	  this.findWorkTargetFor = (source, resType) => {
	    if (resType != RESOURCE_ENERGY) {
	      return false;
	    }

	    let construction = this.findTargetConstructionFor(source, resType);
	    if (construction) {
	      return { target: construction, prio: PRIOS[CONSTRUCTION_SITE] };
	    }

	    // Controller get handled by the work queue
	    // let controller = this.findTargetControllerFor(source, resType)
	    // if(controller) {
	    //   return {target: controller, prio: PRIOS[STRUCTURE_CONTROLLER]}
	    // }
	  };

	  this.findTargetConstructionFor = source => {
	    let conSites = this.room.find(FIND_CONSTRUCTION_SITES);
	    if (conSites.length) {
	      return conSites[0];
	    }
	  };

	  this.findCarryTargetFor = (source, resType) => {
	    // Everything not handled by genTargetCarryTasksFor

	    let storage = this.findTargetStorageFor(source, resType);
	    if (storage) {
	      return { target: storage, prio: PRIOS[STRUCTURE_STORAGE] };
	    }

	    return { target: null, prio: null };
	  };

	  this.findTargetSpawnFor = (source, resType) => {
	    if (resType != RESOURCE_ENERGY) {
	      return false;
	    }

	    let spawns = this.room.find(FIND_MY_STRUCTURES, { filter: structure => structure.structureType == STRUCTURE_SPAWN && structure.energy < structure.energyCapacity });
	    if (spawns.length > 0) {
	      spawns = _.sortByOrder(spawns, 'energy', 'asc');
	      for (let spawn of spawns) {
	        let spawnItems = _.filter(this.existingItems, item => item.toTarget.id == spawn.id);
	        let existingAddAmount = spawnItems.length * this.creepCarryAmount;
	        let ullage = spawn.energyCapacity - (spawn.energy + existingAddAmount);
	        if (ullage > 0) {
	          return spawn;
	        }
	      }
	    }
	  };

	  this.findTargetExtensionFor = (source, resType) => {
	    if (resType != RESOURCE_ENERGY) {
	      return false;
	    }

	    let extensions = this.room.find(FIND_MY_STRUCTURES, { filter: structure => structure.structureType == STRUCTURE_EXTENSION && structure.energy < structure.energyCapacity });
	    if (extensions.length > 0) {
	      extensions = _.sortByOrder(extensions, 'energy', 'asc');
	      for (let extension of extensions) {
	        let extensionItems = _.filter(this.existingItems, item => item.toTarget.id == extension.id);
	        let existingAddAmount = extensionItems.length * this.creepCarryAmount;
	        let ullage = extension.energyCapacity - (extension.energy + existingAddAmount);
	        if (ullage > 0) {
	          return extension;
	        }
	      }
	    }
	  };

	  this.findTargetTowerFor = (source, resType) => {
	    if (resType != RESOURCE_ENERGY) {
	      return false;
	    }

	    let towers = this.room.find(FIND_MY_STRUCTURES, { filter: structure => structure.structureType == STRUCTURE_TOWER && structure.energy < structure.energyCapacity });
	    if (towers.length > 0) {
	      towers = _.sortByOrder(towers, 'energy', 'asc');
	      for (let tower of towers) {
	        let towerItems = _.filter(this.existingItems, item => item.toTarget.id == tower.id);
	        let existingAddAmount = towerItems.length * this.creepCarryAmount;
	        let ullage = tower.energyCapacity - (tower.energy + existingAddAmount);
	        if (ullage > 0) {
	          return tower;
	        }
	      }
	    }
	  };

	  this.findTargetStorageFor = (source, resType) => {

	    let storages = this.room.find(FIND_MY_STRUCTURES, { filter: structure => structure.structureType == STRUCTURE_STORAGE && _.sum(structure.store) < structure.storeCapacity });
	    if (storages.length > 0) {
	      let storage = storages[0];
	      let storageItems = _.filter(this.existingItems, item => item.toTarget.id == storage.id);
	      let existingAddAmount = storageItems.length * this.creepCarryAmount;
	      let ullage = storage.storeCapacity - (_.sum(storage.store) + existingAddAmount);
	      if (ullage > 0) {
	        return storage;
	      }
	    }
	  };

	  this.filterNonVoidEnergyContainers = object => object.structureType == STRUCTURE_CONTAINER && object.store[RESOURCE_ENERGY] > 200;

	  this.filterNonVoidEnergyStorage = object => object.structureType == STRUCTURE_STORAGE && object.store[RESOURCE_ENERGY] > 1000;

	  this.addItem = (queue, source, target, res, targetAmount, priority) => {
	    let data = {
	      toTarget: {
	        id: target.id,
	        x: target.pos.x,
	        y: target.pos.y,
	        roomName: target.pos.roomName,
	        amount: targetAmount
	      },
	      res: res,
	      stage: null
	    };
	    if (source) {
	      data['fromSource'] = {
	        id: source.id,
	        x: source.pos.x,
	        y: source.pos.y,
	        roomName: source.pos.roomName
	      };
	    }
	    let itemId = _hiveMind2.default.push(data);
	    let queueData = { id: itemId, prio: priority };
	    if (queue) {
	      queue.queue(queueData);
	    }
	    this.existingItems = _hiveMind2.default.allForRoom(this.room);
	    return queueData;
	  };

	  this.cleanupTasks = queues => {
	    this.existingItems = _hiveMind2.default.allForRoom(this.room);
	    let itemExists = null;
	    for (let item of this.existingItems) {
	      itemIsUsed = false;
	      for (let queueName in queues) {
	        if (queues[queueName].hasEntryWithId(item.id)) {
	          itemIsUsed = true;break;
	        }
	      }
	      if (itemIsUsed) {
	        continue;
	      }
	      for (let creepName in Game.creeps) {
	        let creep = Game.creeps[creepName];
	        if (creep.memory.item && creep.memory.item.id == item.id) {
	          itemIsUsed = true;break;
	        }
	      }
	      if (itemIsUsed) {
	        continue;
	      }

	      // Item-Id found nowhere
	      _hiveMind2.default.remove(item.id);
	    }
	  };

	  this.findSourceForCreep = (creep, item, resType) => {

	    // Try dropped resources first
	    let droppedViableRes = creep.room.find(FIND_DROPPED_RESOURCES, { filter: res => res.resourceType == resType && res.amount > item.toTarget.amount && res.amount > _.sum(_.filter(this.existingItems, item => item.fromSource.id == res.id), 'fromSource.amount') + item.toTarget.amount });
	    if (droppedViableRes.length) {
	      return creep.pos.findClosestByPath(droppedViableRes);
	    }

	    // Try Container or storage
	    let structures = this.room.find(FIND_STRUCTURES, { filter: struc => (struc.structureType == STRUCTURE_CONTAINER || struc.structureType == STRUCTURE_STORAGE) &&
	      // The sum of the existing items amount for this structure
	      // (console.log('EXISTING ITEMS',
	      // struc.store[resType] - (
	      //   _.sum(
	      //     _.filter(this.existingItems, (item)=> (
	      //       item.fromSource.id == struc.id
	      //     )), 'fromSource.amount'
	      //   )
	      // ) > this.creepCarryAmount) || 1) &&
	      struc.store[resType] - _.sum(_.filter(this.existingItems, item => item.fromSource.id == struc.id), 'fromSource.amount') > this.creepCarryAmount });
	    if (structures.length > 0) {
	      return creep.pos.findClosestByPath(structures);
	    }
	  };

	  this.satisfyBoredCreep = creep => {
	    // Find Containers that have still stuff in them and take that stuff
	    // somewhere else if possible
	    let containers = this.room.find(FIND_STRUCTURES, { filter: this.filterNonVoidEnergyContainers });
	    if (containers.length > 0) {
	      for (let container of containers) {
	        // null == Dont queue the item, let the creep just do it
	        let res = this.genSourceTask(container, null, creep.memory.kind[0]);
	        if (res) {
	          return res;
	        }
	      }
	    }
	  };

	  this.logQueuedItems = () => {
	    if (!this.room.memory.priorityQueues) {
	      console.log('No prioqueues!');return;
	    }
	    for (let queueName in this.room.memory.priorityQueues) {
	      console.log(`<span style="color: #33aaff">` + `====== Queue: ${ queueName }</span>`);
	      let queue = this.room.memory.priorityQueues[queueName];

	      for (let queueItem of queue) {
	        let item = Memory['hiveMind'][queueItem.id];
	        let fromStr = '';
	        if (item['fromSource']) {
	          fromStr = ' from <span style="color:#dd6633">' + this.getStructureName(Game.getObjectById(item['fromSource'].id)) + '</span>' + `(<span style="color:#a6a">${ item['fromSource'].amount }</span>)`;
	        }
	        let toStr = '';
	        if (item['toTarget']) {
	          toStr = ' to <span style="color:#66dd33">' + this.getStructureName(Game.getObjectById(item['toTarget'].id)) + '</span>' + `(<span style="color:#a6a">${ item['toTarget'].amount }</span>)`;
	        }
	        console.log(`    - Item: ${ item.res }${ fromStr }${ toStr }` + `[${ queueItem.prio }]\n` + `        ${ JSON.stringify(item) }`);
	      }
	    }
	  };

	  this.getStructureName = struc => {
	    let name = false;
	    switch (struc.structureType) {
	      case STRUCTURE_SPAWN:
	        name = 'Spawn';break;
	      case STRUCTURE_EXTENSION:
	        name = 'Extension';break;
	      case STRUCTURE_CONTROLLER:
	        name = 'Controller';break;
	      case STRUCTURE_TOWER:
	        name = 'Tower';break;
	      case STRUCTURE_RAMPART:
	        name = 'Rampart';break;
	      case STRUCTURE_CONTAINER:
	        name = 'Container';break;
	      case STRUCTURE_STORAGE:
	        name = 'Storage';break;
	      case STRUCTURE_WALL:
	        name = 'Wall';break;
	      case STRUCTURE_ROAD:
	        name = 'Road';break;
	      default:
	        name = '???';break;
	    }
	    if (struc instanceof ConstructionSite) {
	      return `ConstructionSite of ${ name }`;
	    } else {
	      return name;
	    }
	  };

	  this.removeOldHiveMindItems = () => {
	    let oldItemCount = 0;
	    nextItem: for (let itemId in _hiveMind2.default.data) {
	      let item = _hiveMind2.default.data[itemId];
	      for (let creepName in Game.creeps) {
	        let creep = Game.creeps[creepName];
	        if (creep.memory.item && creep.memory.item.id == item.id) {
	          continue nextItem;
	        }
	      }

	      for (let roomName in Game.rooms) {
	        let room = Game.rooms[roomName];
	        if (room.memory.priorityQueues && Object.keys(room.memory.priorityQueues).length && Object.keys(room.memory.priorityQueues).some(queueName => room.memory.priorityQueues[queueName].some(queueItem => queueItem.id == item.id))) {
	          continue nextItem;
	        }
	        // if(room.memory.priorityQueues && room.memory.priorityQueues.length) {
	        //   for(let queueName in room.memory.priorityQueues) {
	        //     for(let queueItem in room.memory.priorityQueues[queueName]) {
	        //       if(queueItem.id == item.id) {
	        //         break checkItem
	        //       }
	        //     }
	        //   }
	        // }u
	      }
	      console.log("<span style='color: #aadd33'>Item missing:</span>\n    ", JSON.stringify(item));
	      // delete hiveMind.data[itemId]
	      oldItemCount += 1;
	    }
	    Memory.stats['hiveMind.oldItemCount'] = oldItemCount;
	  };
	};

	module.exports = Overlord;

/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _hiveMind = __webpack_require__(17);

	var _hiveMind2 = _interopRequireDefault(_hiveMind);

	var _Overlord = __webpack_require__(18);

	var _Overlord2 = _interopRequireDefault(_Overlord);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	const role = __webpack_require__(4);

	const TYPE_SOURCE = 0;
	const TYPE_TARGET = 1;

	const MY_ERR_WTF = -1001;

	/**
	 * Transports, repairs.
	 *
	 * Memory:
	 *   kind = Array of queues it can handle; First is prioritized.
	 *     [WORK, CARRY]
	 *   item = A priorityQueue-Item its currently working on
	 *     {
	 *       prio: <prio>,
	 *       id: <hiveMindId>,
	 *       XXX
	 *       data: {
	 *         fromSource: {id, x, y, roomName, amount: 0},
	 *         toTarget: {id, x, y, roomName, amount: 0},
	 *         res: RESOURCE_ENERGY,
	 *         stage: one of [TYPE_SOURCE, TYPE_TARGET]
	 *       }
	 *       XXX
	 *    }
	 *   sourcing
	 */

	class Zergling {

	  constructor(zergling) {
	    var _this = this;

	    this.run = priorityQueues => {

	      try {

	        this.priorityQueues = priorityQueues;
	        if (!this.zergling.memory.item) {
	          if (!this.zergling.memory.kind) {
	            this.zergling.say('calcKind');
	            this.calcKind();
	          }
	          if (this.findWork(priorityQueues)) {
	            this.work();
	          } else {
	            this.vacation();
	          }
	        } else if (this.zergling.memory.sourcing === null) {
	          // Zerg has item, but hasnt found a source for it yet
	          if (this.updateWorkStatus()) {
	            this.work();
	          } else {
	            this.vacation();
	          }
	        } else {
	          this.work();
	        }
	        if (!this.hasWorked && this.zergling.memory.kind[0] == WORK) {
	          this.repairSurroundings();
	        }
	      } catch (e) {
	        console.log('<span style="color: red">Creep Error`d:\n' + e.stack + '\n');
	        if (this.zergling.memory.item && !_hiveMind2.default.data[this.zergling.memory.item.id]) {
	          log.cyan('Cleaning up missing hiveMind-Data');
	          this.zergling.memory.item = null;
	          this.zergling.memory.sourcing = null;
	        }
	      } finally {
	        if (this.zergling.ticksToLive == 1) {
	          this.swarmPurposeFulfilled();
	        }
	      }
	    };

	    this.calcKind = () => {
	      let parts = [];
	      for (let type of [WORK, CARRY]) {
	        parts.push({ type: type, count: _.reduce(this.zergling.body, (sum, b) => b.type == type ? sum + 1 : sum, 0) });
	      }
	      // Transporters should always have a WORK for on-the-fly repairs
	      let workPartIndex = _.findIndex(parts, 'type', WORK);
	      parts[workPartIndex].count = (parts[workPartIndex].count - 1) * 2;
	      parts = _.sortByOrder(parts, 'count', 'desc');

	      this.zergling.memory.kind = [];
	      parts.forEach(part => {
	        if (part.count > 0) {
	          this.zergling.memory.kind.push(part.type);
	        }
	      });
	    };

	    this.findWork = priorityQueues => {
	      for (let queueName of this.zergling.memory.kind) {
	        let queue = priorityQueues[queueName];
	        if (queue) {
	          if (queue.peek()) {
	            this.zergling.memory.item = queue.dequeue();
	            return this.updateWorkStatus();
	          } else {
	            if (this.bored()) {
	              this.zergling.say('⚘☀', true); // No tasks, creep is on vacation
	            }
	          }
	        } else {
	          this.zergling.say('Queue where?!');
	          console.log(`${ queueName } missing!`);
	        }
	      }
	      return false;
	    };

	    this.updateWorkStatus = () => {
	      if (!_hiveMind2.default.data[this.zergling.memory.item.id].fromSource) {
	        let item = _hiveMind2.default.data[this.zergling.memory.item.id];
	        if (this.zergling.carry[item.res] >= item.toTarget.amount) {
	          this.zergling.say('♻➟▣', true);
	          _hiveMind2.default.data[this.zergling.memory.item.id].stage = TYPE_TARGET;
	          this.zergling.memory.sourcing = false;
	          return true;
	        } else {
	          let source = new _Overlord2.default(this.zergling.pos.roomName).findSourceForCreep(this.zergling, _hiveMind2.default.data[this.zergling.memory.item.id], item.res);
	          if (source) {
	            _hiveMind2.default.data[this.zergling.memory.item.id].fromSource = {
	              id: source.id, x: source.pos.x, y: source.pos.y,
	              roomName: source.pos.roomName,
	              amount: this.creepCarryCapacity
	            };
	            this.zergling.say('⚗', true);
	            _hiveMind2.default.data[this.zergling.memory.item.id].stage = TYPE_SOURCE;
	            this.zergling.memory.sourcing = true;
	            return true;
	          } else {
	            this.zergling.say('⚗?', true);
	            this.zergling.memory.sourcing = null;
	            return false;
	          }
	        }
	      } else {
	        _hiveMind2.default.data[this.zergling.memory.item.id].stage = TYPE_SOURCE;
	        this.zergling.memory.sourcing = true;
	        return true;
	      }
	    };

	    this.work = () => {
	      if (this.zergling.memory.sourcing) {
	        this.workWith(TYPE_SOURCE);
	      } else {
	        this.workWith(TYPE_TARGET);
	      }
	    };

	    this.workWith = type => {
	      let memObject = false;
	      switch (type) {
	        case TYPE_SOURCE:
	          memObject = _hiveMind2.default.data[this.zergling.memory.item.id].fromSource;break;
	        case TYPE_TARGET:
	          memObject = _hiveMind2.default.data[this.zergling.memory.item.id].toTarget;break;
	      }
	      if (!memObject) {
	        this.done(MY_ERR_WTF, 'workWith#memObject');return;
	      }
	      let object = Game.getObjectById(memObject.id);
	      if (!object) {
	        this.done(MY_ERR_WTF, 'workWith#object');return;
	      }
	      let range = this.calcActionRange(type, object);
	      if (object) {
	        if (this.zergling.pos.inRangeTo(object, range)) {
	          switch (type) {
	            case TYPE_SOURCE:
	              this.withdrawFrom(object);break;
	            case TYPE_TARGET:
	              this.transferTo(object);break;
	          }
	        } else {
	          this.zergling.moveTo(object);
	        }
	      } else {
	        // Source can be missing because of two things: Either our Memory is
	        // corrupt, or the source is in a room we cannot currently see
	        this.zergling.moveTo(new RoomPosition(memObject.x, memObject.y, memObject.roomName));
	      }
	    };

	    this.withdrawFrom = source => {
	      let data = _hiveMind2.default.data[this.zergling.memory.item.id];
	      let type = data.type || RESOURCE_ENERGY;
	      // 0 amount == all you can
	      let amount = data.fromSource.amount ? data.fromSource.amount : null;
	      if (amount > this.zergling.carryCapacity) {
	        amount = this.zergling.carryCapacity;
	      }
	      let res;
	      if (source instanceof Resource) {
	        res = this.zergling.pickup(source);
	        this.hasWorked = true;
	        if (_.sum(this.zergling.carry) == this.zergling.carryCapacity) {
	          this.done();
	        }
	      } else if (source.energy || source.mineralAmount) {
	        res = this.zergling.harvest(source);
	        this.hasWorked = true;
	        if (_.sum(this.zergling.carry) == this.zergling.carryCapacity) {
	          this.done();
	        }
	      } else {
	        res = this.zergling.withdraw(source, type, amount);
	        this.hasWorked = true;
	        this.done();
	      }
	    };

	    this.transferTo = target => {
	      let data = _hiveMind2.default.data[this.zergling.memory.item.id];
	      let type = data.type || RESOURCE_ENERGY;
	      // 0 amount == all you can
	      let amount = data.toTarget.amount ? data.toTarget.amount : null;
	      let res;
	      if (target instanceof ConstructionSite) {
	        res = this.zergling.build(target);
	        this.hasWorked = true;
	        if (this.zergling.carry[RESOURCE_ENERGY] == 0) {
	          this.done();
	        }
	      } else if (target.structureType == STRUCTURE_CONTROLLER) {
	        res = this.zergling.upgradeController(target);
	        this.hasWorked = true;
	        if (this.zergling.carry[RESOURCE_ENERGY] == 0) {
	          this.done();
	        }
	      } else {
	        res = this.zergling.transfer(target, type /*, amount*/);
	        this.hasWorked = true;
	        this.done();
	      }
	      if (res != OK) {
	        this.handleActionResult(res, TYPE_TARGET, target);
	      }
	    };

	    this.done = function (res) {
	      let debugInfo = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];

	      if (_this.zergling.memory.sourcing) {
	        _hiveMind2.default.data[_this.zergling.memory.item.id].stage = TYPE_TARGET;
	        _this.zergling.memory.sourcing = false;
	        if (res == OK) {
	          _this.zergling.say('▣', true);
	        } else {
	          _this.handleActionResult(res, null, null);
	        }
	      } else {
	        _hiveMind2.default.remove(_this.zergling.memory.item.id);
	        _this.zergling.memory.sourcing = null;
	        _this.zergling.memory.item = null;
	        if (res == OK) {
	          _this.zergling.say('✓', true);
	        } else {
	          _this.handleActionResult(res, null, null, debugInfo);
	        }
	      }
	    };

	    this.calcActionRange = (type, object) => {
	      switch (type) {
	        case TYPE_SOURCE:
	          return 1;break;
	        case TYPE_TARGET:
	          return object.structureType == STRUCTURE_CONTROLLER || object instanceof ConstructionSite ? 3 : 1;break;
	      }
	    };

	    this.handleActionResult = function (result, type, object) {
	      let debugInfo = arguments.length <= 3 || arguments[3] === undefined ? null : arguments[3];

	      let type_str;
	      if (type != null) {
	        switch (type) {
	          case TYPE_SOURCE:
	            type_str = 'source';break;
	          case TYPE_TARGET:
	            type_str = 'target';break;
	        }
	        console.log(`ERROR: Action for zergling ${ _this.zergling.name } trying to ` + `${ type_str } at ${ object }: ${ result }`);
	      }
	      switch (result) {
	        case ERR_NOT_OWNER:
	          _this.zergling.say('✖♚', true);break;
	        case ERR_NO_PATH:
	          _this.zergling.say('✖☈?', true);break;
	        // case ERR_NAME_EXISTS: this.zergling.say('', true); break
	        case ERR_BUSY:
	          _this.zergling.say('✖⚙', true);break;
	        case ERR_NOT_FOUND:
	          _this.zergling.say('✖▣?', true);break;
	        case ERR_NOT_ENOUGH_ENERGY:
	          _this.zergling.say('✖☢', true);break;
	        case ERR_INVALID_TARGET:
	          _this.zergling.say('✖▣!', true);break;
	        case ERR_FULL:
	          _this.zergling.say('✖●', true);break;
	        case ERR_NOT_IN_RANGE:
	          _this.zergling.say('✖◎', true);break;
	        case ERR_INVALID_ARGS:
	          _this.zergling.say('✖ARGS!', true);break;
	        case ERR_TIRED:
	          _this.zergling.say('✖❄', true);break;
	        case ERR_NO_BODYPART:
	          _this.zergling.say('✖☗?', true);break;
	        case MY_ERR_WTF:
	          console.log('<span style="color: red">Got a WTF!</span>', `<span style="color: #aadd33">Id</span>: "${ _this.zergling.id }"`, `<span style="color: #33aadd">Pos</span>: ` + `"${ JSON.stringify(_this.zergling.pos) }"`, `<span style="color: #ddaa33">Mem</span>: "` + `${ JSON.stringify(_this.zergling.memory) }"`, `<span style="color: #aa33dd">More Info</span>: "` + `${ JSON.stringify(debugInfo) }"`);
	          _this.zergling.say('WTF?', true);
	          break;
	        // case ERR_NOT_ENOUGH_EXTENSIONS: this.zergling.say('', true); break
	      }
	    };

	    this.repairSurroundings = () => {
	      let structures = this.zergling.pos.findInRange(FIND_STRUCTURES, 3, { filter: obj => obj.hits < obj.hitsMax && obj.structureType != STRUCTURE_WALL && obj.structureType != STRUCTURE_RAMPART });
	      if (structures.length) {
	        let target = _.sortByOrder(structures, 'hits', 'asc')[0];
	        this.zergling.repair(target);
	      }
	    };

	    this.bored = () => {
	      let item = new _Overlord2.default(this.zergling.pos.roomName).satisfyBoredCreep(this.zergling);
	      if (item) {
	        this.zergling.memory.item = item;
	        this.updateWorkStatus();
	        return false;
	      } else {
	        return true;
	      }
	    };

	    this.vacation = () => {
	      let statName = `room.${ this.zergling.room.name }.zergStats.` + `${ this.zergling.memory.kind[0] }.idleTicks`;
	      if (!Memory.stats[statName]) {
	        Memory.stats[statName] = 0;
	      }
	      Memory.stats[statName] += 1;
	      let hangar = this.zergling.room.find(FIND_MY_STRUCTURES, { filter: { structureType: STRUCTURE_SPAWN } })[0];
	      if (hangar && !this.zergling.pos.inRangeTo(hangar, 2)) {
	        this.zergling.moveTo(hangar);
	      }
	    };

	    this.swarmPurposeFulfilled = () => {
	      this.zergling.say('For the ☣');
	      if (this.zergling.memory.item) {
	        _hiveMind2.default.remove(this.zergling.memory.item.id);
	        this.zergling.memory.sourcing = null;
	        this.zergling.memory.item = null;
	      }
	    };

	    this.zergling = zergling;
	    this.hasWorked = false;
	    this.priorityQueues = null;
	  }

	  /*
	   * Zergling is idling
	   */


	  /*
	   * Make sure that the hiveMind-Item gets deleted before the zergling dies
	   */
	}

	module.exports = Zergling;

/***/ },
/* 20 */
/***/ function(module, exports) {

	'use strict';

	class Stats {
	  constructor() {
	    this.begin = () => {
	      Memory.stats = {};
	    };

	    this.persist = () => {
	      Memory.stats[`hiveMind.count`] = Object.keys(Memory.hiveMind).length;
	      Memory.stats[`hiveMind.index`] = Memory.hiveMindIndex;
	      for (let roomName in Game.rooms) {
	        let room = Game.rooms[roomName];
	        let resStorages = room.find(FIND_STRUCTURES, { filter: struc => struc.structureType == STRUCTURE_STORAGE || struc.structureType == STRUCTURE_CONTAINER });
	        let energyStorages = room.find(FIND_MY_STRUCTURES, { filter: struc => struc.structureType == STRUCTURE_SPAWN || struc.structureType == STRUCTURE_EXTENSION });
	        // Queues
	        for (let queueName in room.memory.priorityQueues) {
	          let length = room.memory.priorityQueues[queueName].length;
	          Memory.stats[`room.${ roomName }.hiveMind.priorityQueues.${ queueName }`] = length;
	          Memory.stats[`room.${ roomName }.zergs.${ queueName }`] = _.filter(room.find(FIND_MY_CREEPS, { filter: c => c.memory.kind && c.memory.kind[0] == queueName })).length;
	          // Gets set by creeps vacation() method
	          if (!Memory.stats[`room.${ roomName }.zergStats.${ queueName }.idleTicks`]) {
	            Memory.stats[`room.${ roomName }.zergStats.${ queueName }.idleTicks`] = 0;
	          }
	        }
	        if (resStorages.length) {
	          Memory.stats[`room.${ roomName }.resources.storage.energy`] = resStorages.reduce((memo, storage) => memo + storage.store[RESOURCE_ENERGY], 0) + _.sum(energyStorages, 'energy');
	        }
	        Memory.stats[`room.${ roomName }.upgrade.progress`] = room.controller.progress;

	        Memory.stats['cpu.bucket'] = Game.cpu.bucket;
	        Memory.stats['cpu.limit'] = Game.cpu.limit;
	        Memory.stats['cpu.getUsed'] = Game.cpu.getUsed();
	        Memory.stats['gcl.progress'] = Game.gcl.progress;
	        Memory.stats['gcl.progressTotal'] = Game.gcl.progressTotal;
	        Memory.stats['gcl.level'] = Game.gcl.level;
	      }
	    };
	  }

	}

	module.exports = Stats;

/***/ },
/* 21 */
/***/ function(module, exports, __webpack_require__) {

	// ES2017 w/ Node 5
	__webpack_require__(22);
	__webpack_require__(57);
	__webpack_require__(59);
	__webpack_require__(66);
	__webpack_require__(70);


/***/ },
/* 22 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(23);
	module.exports = __webpack_require__(26).Object.entries;

/***/ },
/* 23 */
/***/ function(module, exports, __webpack_require__) {

	// https://github.com/tc39/proposal-object-values-entries
	var $export  = __webpack_require__(24)
	  , $entries = __webpack_require__(42)(true);

	$export($export.S, 'Object', {
	  entries: function entries(it){
	    return $entries(it);
	  }
	});

/***/ },
/* 24 */
/***/ function(module, exports, __webpack_require__) {

	var global    = __webpack_require__(25)
	  , core      = __webpack_require__(26)
	  , hide      = __webpack_require__(27)
	  , redefine  = __webpack_require__(37)
	  , ctx       = __webpack_require__(40)
	  , PROTOTYPE = 'prototype';

	var $export = function(type, name, source){
	  var IS_FORCED = type & $export.F
	    , IS_GLOBAL = type & $export.G
	    , IS_STATIC = type & $export.S
	    , IS_PROTO  = type & $export.P
	    , IS_BIND   = type & $export.B
	    , target    = IS_GLOBAL ? global : IS_STATIC ? global[name] || (global[name] = {}) : (global[name] || {})[PROTOTYPE]
	    , exports   = IS_GLOBAL ? core : core[name] || (core[name] = {})
	    , expProto  = exports[PROTOTYPE] || (exports[PROTOTYPE] = {})
	    , key, own, out, exp;
	  if(IS_GLOBAL)source = name;
	  for(key in source){
	    // contains in native
	    own = !IS_FORCED && target && target[key] !== undefined;
	    // export native or passed
	    out = (own ? target : source)[key];
	    // bind timers to global for call from export context
	    exp = IS_BIND && own ? ctx(out, global) : IS_PROTO && typeof out == 'function' ? ctx(Function.call, out) : out;
	    // extend global
	    if(target)redefine(target, key, out, type & $export.U);
	    // export
	    if(exports[key] != out)hide(exports, key, exp);
	    if(IS_PROTO && expProto[key] != out)expProto[key] = out;
	  }
	};
	global.core = core;
	// type bitmap
	$export.F = 1;   // forced
	$export.G = 2;   // global
	$export.S = 4;   // static
	$export.P = 8;   // proto
	$export.B = 16;  // bind
	$export.W = 32;  // wrap
	$export.U = 64;  // safe
	$export.R = 128; // real proto method for `library` 
	module.exports = $export;

/***/ },
/* 25 */
/***/ function(module, exports) {

	// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
	var global = module.exports = typeof window != 'undefined' && window.Math == Math
	  ? window : typeof self != 'undefined' && self.Math == Math ? self : Function('return this')();
	if(typeof __g == 'number')__g = global; // eslint-disable-line no-undef

/***/ },
/* 26 */
/***/ function(module, exports) {

	var core = module.exports = {version: '2.4.0'};
	if(typeof __e == 'number')__e = core; // eslint-disable-line no-undef

/***/ },
/* 27 */
/***/ function(module, exports, __webpack_require__) {

	var dP         = __webpack_require__(28)
	  , createDesc = __webpack_require__(36);
	module.exports = __webpack_require__(32) ? function(object, key, value){
	  return dP.f(object, key, createDesc(1, value));
	} : function(object, key, value){
	  object[key] = value;
	  return object;
	};

/***/ },
/* 28 */
/***/ function(module, exports, __webpack_require__) {

	var anObject       = __webpack_require__(29)
	  , IE8_DOM_DEFINE = __webpack_require__(31)
	  , toPrimitive    = __webpack_require__(35)
	  , dP             = Object.defineProperty;

	exports.f = __webpack_require__(32) ? Object.defineProperty : function defineProperty(O, P, Attributes){
	  anObject(O);
	  P = toPrimitive(P, true);
	  anObject(Attributes);
	  if(IE8_DOM_DEFINE)try {
	    return dP(O, P, Attributes);
	  } catch(e){ /* empty */ }
	  if('get' in Attributes || 'set' in Attributes)throw TypeError('Accessors not supported!');
	  if('value' in Attributes)O[P] = Attributes.value;
	  return O;
	};

/***/ },
/* 29 */
/***/ function(module, exports, __webpack_require__) {

	var isObject = __webpack_require__(30);
	module.exports = function(it){
	  if(!isObject(it))throw TypeError(it + ' is not an object!');
	  return it;
	};

/***/ },
/* 30 */
/***/ function(module, exports) {

	module.exports = function(it){
	  return typeof it === 'object' ? it !== null : typeof it === 'function';
	};

/***/ },
/* 31 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = !__webpack_require__(32) && !__webpack_require__(33)(function(){
	  return Object.defineProperty(__webpack_require__(34)('div'), 'a', {get: function(){ return 7; }}).a != 7;
	});

/***/ },
/* 32 */
/***/ function(module, exports, __webpack_require__) {

	// Thank's IE8 for his funny defineProperty
	module.exports = !__webpack_require__(33)(function(){
	  return Object.defineProperty({}, 'a', {get: function(){ return 7; }}).a != 7;
	});

/***/ },
/* 33 */
/***/ function(module, exports) {

	module.exports = function(exec){
	  try {
	    return !!exec();
	  } catch(e){
	    return true;
	  }
	};

/***/ },
/* 34 */
/***/ function(module, exports, __webpack_require__) {

	var isObject = __webpack_require__(30)
	  , document = __webpack_require__(25).document
	  // in old IE typeof document.createElement is 'object'
	  , is = isObject(document) && isObject(document.createElement);
	module.exports = function(it){
	  return is ? document.createElement(it) : {};
	};

/***/ },
/* 35 */
/***/ function(module, exports, __webpack_require__) {

	// 7.1.1 ToPrimitive(input [, PreferredType])
	var isObject = __webpack_require__(30);
	// instead of the ES6 spec version, we didn't implement @@toPrimitive case
	// and the second argument - flag - preferred type is a string
	module.exports = function(it, S){
	  if(!isObject(it))return it;
	  var fn, val;
	  if(S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it)))return val;
	  if(typeof (fn = it.valueOf) == 'function' && !isObject(val = fn.call(it)))return val;
	  if(!S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it)))return val;
	  throw TypeError("Can't convert object to primitive value");
	};

/***/ },
/* 36 */
/***/ function(module, exports) {

	module.exports = function(bitmap, value){
	  return {
	    enumerable  : !(bitmap & 1),
	    configurable: !(bitmap & 2),
	    writable    : !(bitmap & 4),
	    value       : value
	  };
	};

/***/ },
/* 37 */
/***/ function(module, exports, __webpack_require__) {

	var global    = __webpack_require__(25)
	  , hide      = __webpack_require__(27)
	  , has       = __webpack_require__(38)
	  , SRC       = __webpack_require__(39)('src')
	  , TO_STRING = 'toString'
	  , $toString = Function[TO_STRING]
	  , TPL       = ('' + $toString).split(TO_STRING);

	__webpack_require__(26).inspectSource = function(it){
	  return $toString.call(it);
	};

	(module.exports = function(O, key, val, safe){
	  var isFunction = typeof val == 'function';
	  if(isFunction)has(val, 'name') || hide(val, 'name', key);
	  if(O[key] === val)return;
	  if(isFunction)has(val, SRC) || hide(val, SRC, O[key] ? '' + O[key] : TPL.join(String(key)));
	  if(O === global){
	    O[key] = val;
	  } else {
	    if(!safe){
	      delete O[key];
	      hide(O, key, val);
	    } else {
	      if(O[key])O[key] = val;
	      else hide(O, key, val);
	    }
	  }
	// add fake Function#toString for correct work wrapped methods / constructors with methods like LoDash isNative
	})(Function.prototype, TO_STRING, function toString(){
	  return typeof this == 'function' && this[SRC] || $toString.call(this);
	});

/***/ },
/* 38 */
/***/ function(module, exports) {

	var hasOwnProperty = {}.hasOwnProperty;
	module.exports = function(it, key){
	  return hasOwnProperty.call(it, key);
	};

/***/ },
/* 39 */
/***/ function(module, exports) {

	var id = 0
	  , px = Math.random();
	module.exports = function(key){
	  return 'Symbol('.concat(key === undefined ? '' : key, ')_', (++id + px).toString(36));
	};

/***/ },
/* 40 */
/***/ function(module, exports, __webpack_require__) {

	// optional / simple context binding
	var aFunction = __webpack_require__(41);
	module.exports = function(fn, that, length){
	  aFunction(fn);
	  if(that === undefined)return fn;
	  switch(length){
	    case 1: return function(a){
	      return fn.call(that, a);
	    };
	    case 2: return function(a, b){
	      return fn.call(that, a, b);
	    };
	    case 3: return function(a, b, c){
	      return fn.call(that, a, b, c);
	    };
	  }
	  return function(/* ...args */){
	    return fn.apply(that, arguments);
	  };
	};

/***/ },
/* 41 */
/***/ function(module, exports) {

	module.exports = function(it){
	  if(typeof it != 'function')throw TypeError(it + ' is not a function!');
	  return it;
	};

/***/ },
/* 42 */
/***/ function(module, exports, __webpack_require__) {

	var getKeys   = __webpack_require__(43)
	  , toIObject = __webpack_require__(45)
	  , isEnum    = __webpack_require__(56).f;
	module.exports = function(isEntries){
	  return function(it){
	    var O      = toIObject(it)
	      , keys   = getKeys(O)
	      , length = keys.length
	      , i      = 0
	      , result = []
	      , key;
	    while(length > i)if(isEnum.call(O, key = keys[i++])){
	      result.push(isEntries ? [key, O[key]] : O[key]);
	    } return result;
	  };
	};

/***/ },
/* 43 */
/***/ function(module, exports, __webpack_require__) {

	// 19.1.2.14 / 15.2.3.14 Object.keys(O)
	var $keys       = __webpack_require__(44)
	  , enumBugKeys = __webpack_require__(55);

	module.exports = Object.keys || function keys(O){
	  return $keys(O, enumBugKeys);
	};

/***/ },
/* 44 */
/***/ function(module, exports, __webpack_require__) {

	var has          = __webpack_require__(38)
	  , toIObject    = __webpack_require__(45)
	  , arrayIndexOf = __webpack_require__(49)(false)
	  , IE_PROTO     = __webpack_require__(53)('IE_PROTO');

	module.exports = function(object, names){
	  var O      = toIObject(object)
	    , i      = 0
	    , result = []
	    , key;
	  for(key in O)if(key != IE_PROTO)has(O, key) && result.push(key);
	  // Don't enum bug & hidden keys
	  while(names.length > i)if(has(O, key = names[i++])){
	    ~arrayIndexOf(result, key) || result.push(key);
	  }
	  return result;
	};

/***/ },
/* 45 */
/***/ function(module, exports, __webpack_require__) {

	// to indexed object, toObject with fallback for non-array-like ES3 strings
	var IObject = __webpack_require__(46)
	  , defined = __webpack_require__(48);
	module.exports = function(it){
	  return IObject(defined(it));
	};

/***/ },
/* 46 */
/***/ function(module, exports, __webpack_require__) {

	// fallback for non-array-like ES3 and non-enumerable old V8 strings
	var cof = __webpack_require__(47);
	module.exports = Object('z').propertyIsEnumerable(0) ? Object : function(it){
	  return cof(it) == 'String' ? it.split('') : Object(it);
	};

/***/ },
/* 47 */
/***/ function(module, exports) {

	var toString = {}.toString;

	module.exports = function(it){
	  return toString.call(it).slice(8, -1);
	};

/***/ },
/* 48 */
/***/ function(module, exports) {

	// 7.2.1 RequireObjectCoercible(argument)
	module.exports = function(it){
	  if(it == undefined)throw TypeError("Can't call method on  " + it);
	  return it;
	};

/***/ },
/* 49 */
/***/ function(module, exports, __webpack_require__) {

	// false -> Array#indexOf
	// true  -> Array#includes
	var toIObject = __webpack_require__(45)
	  , toLength  = __webpack_require__(50)
	  , toIndex   = __webpack_require__(52);
	module.exports = function(IS_INCLUDES){
	  return function($this, el, fromIndex){
	    var O      = toIObject($this)
	      , length = toLength(O.length)
	      , index  = toIndex(fromIndex, length)
	      , value;
	    // Array#includes uses SameValueZero equality algorithm
	    if(IS_INCLUDES && el != el)while(length > index){
	      value = O[index++];
	      if(value != value)return true;
	    // Array#toIndex ignores holes, Array#includes - not
	    } else for(;length > index; index++)if(IS_INCLUDES || index in O){
	      if(O[index] === el)return IS_INCLUDES || index || 0;
	    } return !IS_INCLUDES && -1;
	  };
	};

/***/ },
/* 50 */
/***/ function(module, exports, __webpack_require__) {

	// 7.1.15 ToLength
	var toInteger = __webpack_require__(51)
	  , min       = Math.min;
	module.exports = function(it){
	  return it > 0 ? min(toInteger(it), 0x1fffffffffffff) : 0; // pow(2, 53) - 1 == 9007199254740991
	};

/***/ },
/* 51 */
/***/ function(module, exports) {

	// 7.1.4 ToInteger
	var ceil  = Math.ceil
	  , floor = Math.floor;
	module.exports = function(it){
	  return isNaN(it = +it) ? 0 : (it > 0 ? floor : ceil)(it);
	};

/***/ },
/* 52 */
/***/ function(module, exports, __webpack_require__) {

	var toInteger = __webpack_require__(51)
	  , max       = Math.max
	  , min       = Math.min;
	module.exports = function(index, length){
	  index = toInteger(index);
	  return index < 0 ? max(index + length, 0) : min(index, length);
	};

/***/ },
/* 53 */
/***/ function(module, exports, __webpack_require__) {

	var shared = __webpack_require__(54)('keys')
	  , uid    = __webpack_require__(39);
	module.exports = function(key){
	  return shared[key] || (shared[key] = uid(key));
	};

/***/ },
/* 54 */
/***/ function(module, exports, __webpack_require__) {

	var global = __webpack_require__(25)
	  , SHARED = '__core-js_shared__'
	  , store  = global[SHARED] || (global[SHARED] = {});
	module.exports = function(key){
	  return store[key] || (store[key] = {});
	};

/***/ },
/* 55 */
/***/ function(module, exports) {

	// IE 8- don't enum bug keys
	module.exports = (
	  'constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf'
	).split(',');

/***/ },
/* 56 */
/***/ function(module, exports) {

	exports.f = {}.propertyIsEnumerable;

/***/ },
/* 57 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(58);
	module.exports = __webpack_require__(26).Object.values;

/***/ },
/* 58 */
/***/ function(module, exports, __webpack_require__) {

	// https://github.com/tc39/proposal-object-values-entries
	var $export = __webpack_require__(24)
	  , $values = __webpack_require__(42)(false);

	$export($export.S, 'Object', {
	  values: function values(it){
	    return $values(it);
	  }
	});

/***/ },
/* 59 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(60);
	module.exports = __webpack_require__(26).Object.getOwnPropertyDescriptors;

/***/ },
/* 60 */
/***/ function(module, exports, __webpack_require__) {

	// https://github.com/tc39/proposal-object-getownpropertydescriptors
	var $export        = __webpack_require__(24)
	  , ownKeys        = __webpack_require__(61)
	  , toIObject      = __webpack_require__(45)
	  , gOPD           = __webpack_require__(64)
	  , createProperty = __webpack_require__(65);

	$export($export.S, 'Object', {
	  getOwnPropertyDescriptors: function getOwnPropertyDescriptors(object){
	    var O       = toIObject(object)
	      , getDesc = gOPD.f
	      , keys    = ownKeys(O)
	      , result  = {}
	      , i       = 0
	      , key;
	    while(keys.length > i)createProperty(result, key = keys[i++], getDesc(O, key));
	    return result;
	  }
	});

/***/ },
/* 61 */
/***/ function(module, exports, __webpack_require__) {

	// all object keys, includes non-enumerable and symbols
	var gOPN     = __webpack_require__(62)
	  , gOPS     = __webpack_require__(63)
	  , anObject = __webpack_require__(29)
	  , Reflect  = __webpack_require__(25).Reflect;
	module.exports = Reflect && Reflect.ownKeys || function ownKeys(it){
	  var keys       = gOPN.f(anObject(it))
	    , getSymbols = gOPS.f;
	  return getSymbols ? keys.concat(getSymbols(it)) : keys;
	};

/***/ },
/* 62 */
/***/ function(module, exports, __webpack_require__) {

	// 19.1.2.7 / 15.2.3.4 Object.getOwnPropertyNames(O)
	var $keys      = __webpack_require__(44)
	  , hiddenKeys = __webpack_require__(55).concat('length', 'prototype');

	exports.f = Object.getOwnPropertyNames || function getOwnPropertyNames(O){
	  return $keys(O, hiddenKeys);
	};

/***/ },
/* 63 */
/***/ function(module, exports) {

	exports.f = Object.getOwnPropertySymbols;

/***/ },
/* 64 */
/***/ function(module, exports, __webpack_require__) {

	var pIE            = __webpack_require__(56)
	  , createDesc     = __webpack_require__(36)
	  , toIObject      = __webpack_require__(45)
	  , toPrimitive    = __webpack_require__(35)
	  , has            = __webpack_require__(38)
	  , IE8_DOM_DEFINE = __webpack_require__(31)
	  , gOPD           = Object.getOwnPropertyDescriptor;

	exports.f = __webpack_require__(32) ? gOPD : function getOwnPropertyDescriptor(O, P){
	  O = toIObject(O);
	  P = toPrimitive(P, true);
	  if(IE8_DOM_DEFINE)try {
	    return gOPD(O, P);
	  } catch(e){ /* empty */ }
	  if(has(O, P))return createDesc(!pIE.f.call(O, P), O[P]);
	};

/***/ },
/* 65 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var $defineProperty = __webpack_require__(28)
	  , createDesc      = __webpack_require__(36);

	module.exports = function(object, index, value){
	  if(index in object)$defineProperty.f(object, index, createDesc(0, value));
	  else object[index] = value;
	};

/***/ },
/* 66 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(67);
	module.exports = __webpack_require__(26).String.padStart;


/***/ },
/* 67 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	// https://github.com/tc39/proposal-string-pad-start-end
	var $export = __webpack_require__(24)
	  , $pad    = __webpack_require__(68);

	$export($export.P, 'String', {
	  padStart: function padStart(maxLength /*, fillString = ' ' */){
	    return $pad(this, maxLength, arguments.length > 1 ? arguments[1] : undefined, true);
	  }
	});

/***/ },
/* 68 */
/***/ function(module, exports, __webpack_require__) {

	// https://github.com/tc39/proposal-string-pad-start-end
	var toLength = __webpack_require__(50)
	  , repeat   = __webpack_require__(69)
	  , defined  = __webpack_require__(48);

	module.exports = function(that, maxLength, fillString, left){
	  var S            = String(defined(that))
	    , stringLength = S.length
	    , fillStr      = fillString === undefined ? ' ' : String(fillString)
	    , intMaxLength = toLength(maxLength);
	  if(intMaxLength <= stringLength || fillStr == '')return S;
	  var fillLen = intMaxLength - stringLength
	    , stringFiller = repeat.call(fillStr, Math.ceil(fillLen / fillStr.length));
	  if(stringFiller.length > fillLen)stringFiller = stringFiller.slice(0, fillLen);
	  return left ? stringFiller + S : S + stringFiller;
	};


/***/ },
/* 69 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var toInteger = __webpack_require__(51)
	  , defined   = __webpack_require__(48);

	module.exports = function repeat(count){
	  var str = String(defined(this))
	    , res = ''
	    , n   = toInteger(count);
	  if(n < 0 || n == Infinity)throw RangeError("Count can't be negative");
	  for(;n > 0; (n >>>= 1) && (str += str))if(n & 1)res += str;
	  return res;
	};

/***/ },
/* 70 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(71);
	module.exports = __webpack_require__(26).String.padEnd;


/***/ },
/* 71 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	// https://github.com/tc39/proposal-string-pad-start-end
	var $export = __webpack_require__(24)
	  , $pad    = __webpack_require__(68);

	$export($export.P, 'String', {
	  padEnd: function padEnd(maxLength /*, fillString = ' ' */){
	    return $pad(this, maxLength, arguments.length > 1 ? arguments[1] : undefined, false);
	  }
	});

/***/ },
/* 72 */
/***/ function(module, exports) {

	let usedOnStart = 0;
	let enabled = false;
	let depth = 0;

	function setupProfiler() {
	  depth = 0; // reset depth, this needs to be done each tick.
	  Game.profiler = {
	    stream(duration, filter) {
	      setupMemory('stream', duration || 10, filter);
	    },
	    email(duration, filter) {
	      setupMemory('email', duration || 100, filter);
	    },
	    profile(duration, filter) {
	      setupMemory('profile', duration || 100, filter);
	    },
	    reset: resetMemory,
	  };

	  overloadCPUCalc();
	}

	function setupMemory(profileType, duration, filter) {
	  resetMemory();
	  if (!Memory.profiler) {
	    Memory.profiler = {
	      map: {},
	      totalTime: 0,
	      enabledTick: Game.time + 1,
	      disableTick: Game.time + duration,
	      type: profileType,
	      filter,
	    };
	  }
	}

	function resetMemory() {
	  Memory.profiler = null;
	}

	function overloadCPUCalc() {
	  if (Game.rooms.sim) {
	    usedOnStart = 0; // This needs to be reset, but only in the sim.
	    Game.cpu.getUsed = function getUsed() {
	      return performance.now() - usedOnStart;
	    };
	  }
	}

	function getFilter() {
	  return Memory.profiler.filter;
	}

	function wrapFunction(name, originalFunction) {
	  return function wrappedFunction() {
	    if (Profiler.isProfiling()) {
	      const nameMatchesFilter = name === getFilter();
	      const start = Game.cpu.getUsed();
	      if (nameMatchesFilter) {
	        depth++;
	      }
	      const result = originalFunction.apply(this, arguments);
	      if (depth > 0 || !getFilter()) {
	        const end = Game.cpu.getUsed();
	        Profiler.record(name, end - start);
	      }
	      if (nameMatchesFilter) {
	        depth--;
	      }
	      return result;
	    }

	    return originalFunction.apply(this, arguments);
	  };
	}

	function hookUpPrototypes() {
	  Profiler.prototypes.forEach(proto => {
	    profileObjectFunctions(proto.val, proto.name);
	  });
	}

	function profileObjectFunctions(object, label) {
	  const objectToWrap = object.prototype ? object.prototype : object;

	  Object.keys(objectToWrap).forEach(functionName => {
	    const extendedLabel = `${label}.${functionName}`;
	    try {
	      if (typeof objectToWrap[functionName] === 'function' && functionName !== 'getUsed') {
	        const originalFunction = objectToWrap[functionName];
	        objectToWrap[functionName] = profileFunction(originalFunction, extendedLabel);
	      }
	    } catch (e) { } /* eslint no-empty:0 */
	  });

	  return objectToWrap;
	}

	function profileFunction(fn, functionName) {
	  const fnName = functionName || fn.name;
	  if (!fnName) {
	    console.log('Couldn\'t find a function name for - ', fn);
	    console.log('Will not profile this function.');
	    return fn;
	  }

	  return wrapFunction(fnName, fn);
	}

	const Profiler = {
	  printProfile() {
	    console.log(Profiler.output());
	  },

	  emailProfile() {
	    Game.notify(Profiler.output());
	  },

	  output() {
	    const elapsedTicks = Game.time - Memory.profiler.enabledTick + 1;
	    const header = 'calls\t\ttime\t\tavg\t\tfunction';
	    const footer = [
	      `Avg: ${(Memory.profiler.totalTime / elapsedTicks).toFixed(2)}`,
	      `Total: ${Memory.profiler.totalTime.toFixed(2)}`,
	      `Ticks: ${elapsedTicks}`,
	    ].join('\t');
	    return [].concat(header, Profiler.lines().slice(0, 20), footer).join('\n');
	  },

	  lines() {
	    const stats = Object.keys(Memory.profiler.map).map(functionName => {
	      const functionCalls = Memory.profiler.map[functionName];
	      return {
	        name: functionName,
	        calls: functionCalls.calls,
	        totalTime: functionCalls.time,
	        averageTime: functionCalls.time / functionCalls.calls,
	      };
	    }).sort((val1, val2) => {
	      return val2.totalTime - val1.totalTime;
	    });

	    const lines = stats.map(data => {
	      return [
	        data.calls,
	        data.totalTime.toFixed(1),
	        data.averageTime.toFixed(3),
	        data.name,
	      ].join('\t\t');
	    });

	    return lines;
	  },

	  prototypes: [
	    { name: 'Game', val: Game },
	    { name: 'Room', val: Room },
	    { name: 'Structure', val: Structure },
	    { name: 'Spawn', val: Spawn },
	    { name: 'Creep', val: Creep },
	    { name: 'RoomPosition', val: RoomPosition },
	    { name: 'Source', val: Source },
	    { name: 'Flag', val: Flag },
	  ],

	  record(functionName, time) {
	    if (!Memory.profiler.map[functionName]) {
	      Memory.profiler.map[functionName] = {
	        time: 0,
	        calls: 0,
	      };
	    }
	    Memory.profiler.map[functionName].calls++;
	    Memory.profiler.map[functionName].time += time;
	  },

	  endTick() {
	    if (Game.time >= Memory.profiler.enabledTick) {
	      const cpuUsed = Game.cpu.getUsed();
	      Memory.profiler.totalTime += cpuUsed;
	      Profiler.report();
	    }
	  },

	  report() {
	    if (Profiler.shouldPrint()) {
	      Profiler.printProfile();
	    } else if (Profiler.shouldEmail()) {
	      Profiler.emailProfile();
	    }
	  },

	  isProfiling() {
	    return enabled && !!Memory.profiler && Game.time <= Memory.profiler.disableTick;
	  },

	  type() {
	    return Memory.profiler.type;
	  },

	  shouldPrint() {
	    const streaming = Profiler.type() === 'stream';
	    const profiling = Profiler.type() === 'profile';
	    const onEndingTick = Memory.profiler.disableTick === Game.time;
	    return streaming || (profiling && onEndingTick);
	  },

	  shouldEmail() {
	    return Profiler.type() === 'email' && Memory.profiler.disableTick === Game.time;
	  },
	};

	module.exports = {
	  wrap(callback) {
	    if (enabled) {
	      setupProfiler();
	    }

	    if (Profiler.isProfiling()) {
	      usedOnStart = Game.cpu.getUsed();

	      // Commented lines are part of an on going experiment to keep the profiler
	      // performant, and measure certain types of overhead.

	      // var callbackStart = Game.cpu.getUsed();
	      const returnVal = callback();
	      // var callbackEnd = Game.cpu.getUsed();
	      Profiler.endTick();
	      // var end = Game.cpu.getUsed();

	      // var profilerTime = (end - start) - (callbackEnd - callbackStart);
	      // var callbackTime = callbackEnd - callbackStart;
	      // var unaccounted = end - profilerTime - callbackTime;
	      // console.log('total-', end, 'profiler-', profilerTime, 'callbacktime-',
	      // callbackTime, 'start-', start, 'unaccounted', unaccounted);
	      return returnVal;
	    }

	    return callback();
	  },

	  enable() {
	    enabled = true;
	    hookUpPrototypes();
	  },

	  registerObject(object, label) {
	    return profileObjectFunctions(object, label);
	  },

	  registerFN(fn, functionName) {
	    return profileFunction(fn, functionName);
	  },
	};


/***/ }
/******/ ]);
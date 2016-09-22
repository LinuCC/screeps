var modwide = global; module.exports = 
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

	__webpack_require__(1);

	__webpack_require__(6);

	var _constants = __webpack_require__(5);

	var _constants2 = _interopRequireDefault(_constants);

	var _defense = __webpack_require__(7);

	var _defense2 = _interopRequireDefault(_defense);

	var _harvester = __webpack_require__(8);

	var _harvester2 = _interopRequireDefault(_harvester);

	var _upgrader = __webpack_require__(10);

	var _upgrader2 = _interopRequireDefault(_upgrader);

	var _builder = __webpack_require__(11);

	var _builder2 = _interopRequireDefault(_builder);

	var _excavator = __webpack_require__(12);

	var _excavator2 = _interopRequireDefault(_excavator);

	var _repairer = __webpack_require__(13);

	var _repairer2 = _interopRequireDefault(_repairer);

	var _transporter = __webpack_require__(14);

	var _transporter2 = _interopRequireDefault(_transporter);

	var _creepWatcher = __webpack_require__(15);

	var _creepWatcher2 = _interopRequireDefault(_creepWatcher);

	var _fighter = __webpack_require__(19);

	var _fighter2 = _interopRequireDefault(_fighter);

	var _healer = __webpack_require__(20);

	var _healer2 = _interopRequireDefault(_healer);

	var _rangedFighter = __webpack_require__(21);

	var _rangedFighter2 = _interopRequireDefault(_rangedFighter);

	var _assimilator = __webpack_require__(22);

	var _assimilator2 = _interopRequireDefault(_assimilator);

	var _sweeper = __webpack_require__(23);

	var _sweeper2 = _interopRequireDefault(_sweeper);

	var _PriorityQueue = __webpack_require__(4);

	var _PriorityQueue2 = _interopRequireDefault(_PriorityQueue);

	var _hiveMind = __webpack_require__(3);

	var _hiveMind2 = _interopRequireDefault(_hiveMind);

	var _Overlord = __webpack_require__(24);

	var _Overlord2 = _interopRequireDefault(_Overlord);

	var _Overseer = __webpack_require__(29);

	var _Overseer2 = _interopRequireDefault(_Overseer);

	var _Zergling = __webpack_require__(30);

	var _Zergling2 = _interopRequireDefault(_Zergling);

	var _spawner = __webpack_require__(16);

	var _spawner2 = _interopRequireDefault(_spawner);

	var _Stats = __webpack_require__(31);

	var _Stats2 = _interopRequireDefault(_Stats);

	__webpack_require__(32);

	var _screepsProfiler = __webpack_require__(27);

	var _screepsProfiler2 = _interopRequireDefault(_screepsProfiler);

	var _helper = __webpack_require__(2);

	var _helper2 = _interopRequireDefault(_helper);

	var _Queueing = __webpack_require__(18);

	var _Queueing2 = _interopRequireDefault(_Queueing);

	var _Seeding = __webpack_require__(83);

	var _Seeding2 = _interopRequireDefault(_Seeding);

	var _Requesting = __webpack_require__(28);

	var _Requesting2 = _interopRequireDefault(_Requesting);

	var _ActiveProviding = __webpack_require__(25);

	var _ActiveProviding2 = _interopRequireDefault(_ActiveProviding);

	var _Excavating = __webpack_require__(84);

	var _Excavating2 = _interopRequireDefault(_Excavating);

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

	  if (Game.time % 50 == 0) {
	    _creepWatcher2.default.cleanupMemory();
	  }
	  if (Game.time % 5 == 0) {
	    // Logging purposes
	    // log.cyan('Removing Old HiveMindItems')
	    // new Overlord('NoFrigginRoom').removeOldHiveMindItems()
	    new _Overseer2.default().check();
	  }
	  if (Game.time % 3 === 0) {
	    for (let room of new _Overseer2.default().myMainRooms()) {
	      let seeder = new _Seeding2.default(room);
	      seeder.itemGenerator();
	      seeder.itemVerwertor();
	    }
	  }

	  modwide.h = _helper2.default;
	  modwide.$ = _constants2.default;
	  modwide.Spawner = _spawner2.default;
	  modwide.Overlord = _Overlord2.default;
	  modwide.hiveMind = _hiveMind2.default;
	  modwide.logHiveMindOf = spawnName => {
	    new _Overlord2.default(Game.spawns[spawnName].room.name).logQueuedItems();
	  };
	  modwide.Queueing = _Queueing2.default;
	  modwide.Seeding = _Seeding2.default;
	  modwide.Requesting = _Requesting2.default;
	  modwide.ActiveProviding = _ActiveProviding2.default;
	  modwide.Excavating = _Excavating2.default;
	  new _Overseer2.default().parseCommands();
	  modwide.resetHive = () => {
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
	  modwide.setMissingCreepRoles = function () {
	    let role = arguments.length <= 0 || arguments[0] === undefined ? _constants2.default.ROLE_ZERG : arguments[0];

	    for (let creepName in Game.creeps) {
	      let creep = Game.creeps[creepName];
	      if (!creep.memory.role) {
	        creep.memory.role = role;
	      }
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
	        let specialRoomState = room.memory.specialState;
	        let priorityQueues = false;
	        if (room.memory.priorityQueues && Object.keys(room.memory.priorityQueues).length > 0) {
	          priorityQueues = _.mapValues(room.memory.priorityQueues, queue => new _PriorityQueue2.default(queue));
	        }
	        if (Game.time % 3 == 0) {
	          let overlord = new _Overlord2.default(roomName);
	          if (priorityQueues) {
	            overlord.update(priorityQueues);
	          }
	        }
	        let zerglings = room.find(FIND_MY_CREEPS, { filter: c => c.memory.role == 'zergling' || // TODO remove zergling
	          c.memory.role == _constants2.default.ROLE_ZERG });
	        if (zerglings.length > 0) {
	          zerglings.forEach(zerglingCreep => {
	            let zergling = new _Zergling2.default(zerglingCreep);
	            zergling.run(priorityQueues, specialRoomState);
	          });
	        }

	        if (room.memory.links && room.memory.links.providers) {
	          nextTarget: for (let target of room.memory.links.providers) {
	            let targetLink = Game.getObjectById(target);
	            if (targetLink.energy < targetLink.energyCapacity) {
	              if (room.memory.links && room.memory.links.sources.length) {
	                for (let source of room.memory.links.sources) {
	                  let sourceLink = Game.getObjectById(source);
	                  if (sourceLink.energy > 0) {
	                    sourceLink.transferEnergy(targetLink);
	                    continue nextTarget;
	                  }
	                }
	              }
	            }
	          }
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
	      } else if (creep.memory.role == 'zergling') {} else if (creep.memory.role == _constants2.default.ROLE_ZERG) {} else if (creep.memory.role == _constants2.default.KIND_SWEEPER) {
	        _sweeper2.default.run(creep);
	      } else {
	        creep.say("ROLE?!");
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

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _helper = __webpack_require__(2);

	var _helper2 = _interopRequireDefault(_helper);

	var _hiveMind = __webpack_require__(3);

	var _hiveMind2 = _interopRequireDefault(_hiveMind);

	var _PriorityQueue = __webpack_require__(4);

	var _PriorityQueue2 = _interopRequireDefault(_PriorityQueue);

	var _constants = __webpack_require__(5);

	var _constants2 = _interopRequireDefault(_constants);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	Room.prototype.spawns = function () {
	  let filter = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

	  let findFilter = null;
	  if (typeof filter === 'function') {
	    findFilter = s => s.structureType === STRUCTURE_SPAWN && filter(s);
	  } else {
	    findFilter = Object.assign({ structureType: STRUCTURE_SPAWN }, filter);
	  }
	  let options = { filter: findFilter };
	  return this.find(FIND_MY_STRUCTURES, options);
	};

	Room.prototype.queue = function (queueName) {
	  return new _PriorityQueue2.default(this.memory.priorityQueues[queueName]);
	};

	Room.prototype.pushToQueue = function (queue, item, priority) {
	  if (typeof queue == 'string') {
	    if (!this.memory.priorityQueues[queue]) {
	      throw new Error('Queue?');
	    }
	    queue = new _PriorityQueue2.default(this.memory.priorityQueues[queue]);
	  }

	  if (queue) {
	    let itemId = _hiveMind2.default.push(item);
	    let queueData = { id: itemId, prio: priority };
	    queue.queue(queueData);
	    return itemId;
	  } else {
	    throw new Error('Queue?');
	  }
	};

	Room.prototype.drawCoordinates = function (coordinates) {
	  for (let i = 0, len = coordinates.length; i < len; i++) {
	    let coordinate = _helper2.default.decodeCoordinate(coordinates, i);
	    this.createFlag(this.posByXY(coordinate), `${ coordinate.x }-${ coordinate.y }`);
	  }
	};

	Room.prototype.clearDrawings = function () {
	  let flags = this.find(FIND_FLAGS, { filter: { color: COLOR_WHITE } });
	  for (flag of flags) {
	    flag.remove();
	  }
	};

	Room.prototype.posByXY = function (_ref) {
	  let x = _ref.x;
	  let y = _ref.y;

	  return new RoomPosition(x, y, this.name);
	};

	Room.prototype.maxSpawnCost = function () {
	  throw new Error('WATT IS EnerGYMAZ');
	  return _.sum(room.find(FIND_MY_STRUCTURES, { filter: struc => struc.structureType == STRUCTURE_EXTENSION || struc.structureType == STRUCTURE_SPAWN }), 'energyMax');
	};

	// TODO
	Room.prototype.safeArea = function () {
	  return this.posByXY({ x: _constants2.default.ROOM_CENTER_X, y: _constants2.default.ROOM_CENTER_Y });
	};

	Room.prototype.accessibleControllingRooms = function () {
	  let controlledRooms = [this];
	  // Control remote rooms too
	  for (let remoteName in this.memory.connectedRemoteRooms || []) {
	    let data = this.memory.connectedRemoteRooms[[remoteName]];
	    if (data.parsed && data.active) {
	      if (Game.rooms[remoteName]) {
	        controlledRooms.push(Game.rooms[remoteName]);
	      }
	    }
	  }
	  return controlledRooms;
	};

/***/ },
/* 2 */
/***/ function(module, exports) {

	"use strict";

	modwide.log = {
	    cyan: str => console.log(`<span style="color: #00BFFF">${ str }</span>`),
	    red: str => console.log(`<span style="color: red">${ str }</span>`),
	    green: str => console.log(`<span style="color: #aadd33">${ str }</span>`),
	    blue: str => console.log(`<span style="color: blue">${ str }</span>`),
	    orange: str => console.log(`<span style="color: orange">${ str }</span>`)
	};

	module.exports = {
	    randomProperty: function (obj) {
	        let keys = Object.keys(obj);
	        return obj[keys[keys.length * Math.random() << 0]];
	    },
	    encodeCoordinate: function (pos) {
	        return String.fromCodePoint(pos.x | pos.y << 6);
	    },
	    decodeCoordinate: function (string, index) {
	        let val = string.charCodeAt(index);
	        let x = val & 0x3F;
	        let y = val >> 6 & 0x3F;
	        return { x: x, y: y };
	    }
	};

/***/ },
/* 3 */
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
	    let opts = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

	    const filter = opts.filter || (() => true);
	    const roomName = typeof room === 'string' ? room : room.name;
	    return _.filter(this.data, entry => (entry.fromSource && entry.fromSource.roomName == roomName || entry.toTarget && entry.toTarget.roomName == roomName || entry.byRoomName == roomName || entry.roomName == roomName) && filter());
	  },

	  filter: function (filter) {
	    return _.filter(this.data, filter);
	  },

	  _generateId: function () {
	    let index = (Memory['hiveMindIndex'] || 1) + 1;
	    Memory['hiveMindIndex'] = index;
	    return index;
	  }
	};

	module.exports = hiveMind;

/***/ },
/* 4 */
/***/ function(module, exports) {

	"use strict";

	class PriorityQueue {
	  constructor(initialValues) {
	    this.itemCount = () => this.data.length;

	    this._completeSort = () => {
	      if (this.data.length > 0) {
	        for (let i in [...Array(this.data.length).keys()]) {
	          this._bubbleUp(i, log);
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

	    this.filter = filter => {
	      return _.filter(this.data, filter);
	    };

	    this.removeBy = filter => {
	      _.remove(this.data, filter);
	    };

	    this.updatePrioById = (id, prio) => {
	      for (let index = 0; index < this.data.length; index += 1) {
	        let item = this.data[index];
	        if (item.id === id) {
	          const oldPrio = item.prio;
	          item.prio = prio;
	          if (prio < oldPrio) {
	            this._bubbleUp(index, true);
	          } else {
	            this._bubbleDown(index);
	          }
	          return true;
	        }
	      }
	      return false;
	    };

	    this.clear = () => {
	      this.length = 0;
	      this.data.length = 0;
	    };

	    this._bubbleUp = (pos, log) => {
	      while (pos > 0) {
	        let left = pos - 1;
	        if (log) {}
	        if (this.comparator(this.data[pos], this.data[left]) < 0) {
	          let x = this.data[left];
	          this.data[left] = this.data[pos];
	          this.data[pos] = x;
	          pos = left;
	        } else {
	          break;
	        }
	      }
	    };

	    this._bubbleDown = pos => {
	      let last = this.data.length - 1;
	      while (pos + 1 <= last) {
	        let right = pos + 1;
	        if (log) {}
	        if (this.comparator(this.data[pos], this.data[right]) > 0) {
	          let x = this.data[right];
	          this.data[right] = this.data[pos];
	          this.data[pos] = x;
	          pos = right;
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

	    this.length = 0;
	    this.data = initialValues;
	    this._completeSort();
	  }

	  comparator(a, b) {
	    return a.prio - b.prio;
	  }

	}

	modwide.lol = PriorityQueue;

	module.exports = PriorityQueue;

/***/ },
/* 5 */
/***/ function(module, exports) {

	'use strict';

	const ROLE_ZERG = 'zerg';
	const KIND_DRONE = 1; /* Carry stuff */
	const KIND_ZERGLING = 2; /* Work stuff */
	const KIND_INFESTOR = 3; /* Mine stuff from sources */
	const KIND_CORRUPTOR = 4; /* Claim Controller */
	const KIND_MUTALISK = 5; /* Scout stuff */
	const KIND_SWEEPER = 6;

	const SCOUT = 'scout';
	const SPAWN = 'spawn';
	const EXCAVATE = 'excavate';
	const UPGRADE = 'upgrade';

	const SOURCE = 'source';

	/// TODO deprecated for OBJ_CONSTRUCTION_SITE
	const CONSTRUCTION_SITE = "constrSite";

	const REMOTE_PRIORITIES_MODIFIER = 0.5;
	const REMOTE_PRIORITY_PROVIDING_MODIFIER = 100;
	const PROVIDING_AMOUNT_MODIFIER = 0.1;
	const REMOTE_PRIORITY_CONSTRUCTION_MODIFIER = 50;
	const RANGE_PRIORITY_MODIFIER = 2;
	// Max Steps that are considered when changing the prio
	const RANGE_PRIORITY_THRESHOLD = 50 * RANGE_PRIORITY_MODIFIER;

	const SEED = 'seed';

	const RESERVE = 'reserve';
	const DOWNGRADE = 'downgrade';

	const CONTROLLER_CLAIM = 'claim';
	const CONTROLLER_RESERVE = 'reserve';
	const CONTROLLER_DOWNGRADE = 'downgrade';

	const TYPE_SOURCE = 0;
	const TYPE_TARGET = 1;
	const TYPE_SEED = 2;

	const WORK_REQUESTING = 'workReq';
	const RESOURCE_REQUESTING = 'resourceReq';
	const ACTIVE_PROVIDING = 'actProv';

	const OBJ_CONSTRUCTION_SITE = 'objConSite';
	const OBJ_CREEP = 'objCreep';
	const OBJ_FLAG = 'objFlag';
	const OBJ_GAME = 'objGame';
	const OBJ_MAP = 'objMap';
	const OBJ_MARKET = 'objMarket';
	const OBJ_MINERAL = 'objMineral';
	const OBJ_NUKE = 'objNuke';
	const OBJ_RESOURCE = 'objResource';
	const OBJ_ROOM = 'objRoom';
	const OBJ_ROOM_OBJECT = 'objRoomObject';
	const OBJ_POSITION = 'objPosition';
	const OBJ_SOURCE = 'objSource';
	const OBJ_STRUCTURE = 'objStructure';

	const _exports = Object.freeze({
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
	  ZERG_KINDS: [KIND_DRONE, KIND_ZERGLING, KIND_INFESTOR, KIND_CORRUPTOR, KIND_MUTALISK],
	  ZERG_PARTS_TEMPLATES: {
	    [KIND_DRONE]: [CARRY],
	    [KIND_ZERGLING]: [WORK, WORK, WORK, CARRY, CARRY],
	    [KIND_INFESTOR]: [WORK],
	    [KIND_CORRUPTOR]: [CLAIM],
	    [KIND_MUTALISK]: [MOVE]
	  },
	  PRIO_QUEUES: [ACTIVE_PROVIDING, WORK_REQUESTING, RESOURCE_REQUESTING, WORK, CARRY, SEED, SCOUT, EXCAVATE, UPGRADE, SPAWN],

	  NEW_QUEUES_FOR_KINDS: {
	    [KIND_DRONE]: [RESOURCE_REQUESTING],
	    [KIND_ZERGLING]: [WORK_REQUESTING],
	    [KIND_INFESTOR]: [EXCAVATE],
	    [KIND_CORRUPTOR]: [SEED],
	    [KIND_MUTALISK]: [SCOUT]
	  },

	  QUEUES_FOR_KINDS: {
	    [KIND_DRONE]: [CARRY],
	    [KIND_ZERGLING]: [WORK, CARRY],
	    [KIND_INFESTOR]: [EXCAVATE],
	    [KIND_CORRUPTOR]: [SEED],
	    [KIND_MUTALISK]: [SCOUT]
	  },

	  CONTROLLER_CLAIM: CONTROLLER_CLAIM,
	  CONTROLLER_RESERVE: CONTROLLER_RESERVE,
	  CONTROLLER_DOWNGRADE: CONTROLLER_DOWNGRADE,

	  CONTROLLER_RESERVE_MAX: 5000,

	  PRIORITIES: {
	    [ACTIVE_PROVIDING]: {
	      [OBJ_RESOURCE]: 1950,
	      [STRUCTURE_CONTAINER]: 2000
	    },
	    [RESOURCE_REQUESTING]: {
	      [STRUCTURE_SPAWN]: 1000,
	      [STRUCTURE_EXTENSION]: 1100,
	      [STRUCTURE_TOWER]: 1200,
	      [STRUCTURE_LINK]: 1800,
	      [STRUCTURE_STORAGE]: 2000,
	      [STRUCTURE_CONTROLLER]: 9000,
	      [STRUCTURE_CONTAINER]: 10000
	    },
	    [WORK_REQUESTING]: {
	      [OBJ_CONSTRUCTION_SITE]: 1900
	    },
	    [EXCAVATE]: {
	      [SOURCE]: 1000
	    },
	    [SPAWN]: {
	      [KIND_SWEEPER]: 1000,
	      [KIND_INFESTOR]: 2000,
	      [KIND_CORRUPTOR]: 5000
	    },
	    [SEED]: {
	      [CLAIM]: 1000,
	      [RESERVE]: 2000,
	      [DOWNGRADE]: 3000
	    }
	  },

	  SOURCE: SOURCE,

	  REMOTE_PRIORITIES_MODIFIER: REMOTE_PRIORITIES_MODIFIER,
	  REMOTE_PRIORITY_PROVIDING_MODIFIER: REMOTE_PRIORITY_PROVIDING_MODIFIER,
	  PROVIDING_AMOUNT_MODIFIER: PROVIDING_AMOUNT_MODIFIER,
	  CONSTRUCTION_SITE: CONSTRUCTION_SITE,
	  REMOTE_PRIORITY_CONSTRUCTION_MODIFIER: REMOTE_PRIORITY_CONSTRUCTION_MODIFIER,
	  RANGE_PRIORITY_MODIFIER: RANGE_PRIORITY_MODIFIER,

	  ///TODO If we need some more stuff for Shiny#type, we can use the following
	  OBJ_CONSTRUCTION_SITE: OBJ_CONSTRUCTION_SITE,
	  OBJ_CREEP: OBJ_CREEP,
	  OBJ_FLAG: OBJ_FLAG,
	  OBJ_GAME: OBJ_GAME,
	  OBJ_MAP: OBJ_MAP,
	  OBJ_MARKET: OBJ_MARKET,
	  OBJ_MINERAL: OBJ_MINERAL,
	  OBJ_NUKE: OBJ_NUKE,
	  OBJ_RESOURCE: OBJ_RESOURCE,
	  OBJ_ROOM: OBJ_ROOM,
	  OBJ_ROOM_OBJECT: OBJ_ROOM_OBJECT,
	  OBJ_POSITION: OBJ_POSITION,
	  OBJ_SOURCE: OBJ_SOURCE,
	  OBJ_STRUCTURE: OBJ_STRUCTURE,

	  ROLE_ZERG: ROLE_ZERG,
	  KIND_DRONE: KIND_DRONE,
	  KIND_ZERGLING: KIND_ZERGLING,
	  KIND_INFESTOR: KIND_INFESTOR,
	  KIND_CORRUPTOR: KIND_CORRUPTOR,
	  KIND_MUTALISK: KIND_MUTALISK,
	  KIND_SWEEPER: KIND_SWEEPER,

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

	  CARRY: CARRY,
	  WORK: WORK,

	  WORK_REQUESTING: WORK_REQUESTING,
	  RESOURCE_REQUESTING: RESOURCE_REQUESTING,
	  ACTIVE_PROVIDING: ACTIVE_PROVIDING,
	  RANGE_PRIORITY_THRESHOLD: RANGE_PRIORITY_THRESHOLD
	});

	module.exports = _exports;

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _hiveMind = __webpack_require__(3);

	var _hiveMind2 = _interopRequireDefault(_hiveMind);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	Creep.prototype.activeItem = function () {
	  if (!this.memory.item || !this.memory.item.id) {
	    return null;
	  }
	  return _hiveMind2.default[this.memory.item.id];
	};

	Creep.prototype.hasItem = function () {
	  return this.memory.item && this.memory.item.id;
	};

	Creep.prototype.itemMatches = function (filter) {
	  if (!this.hasItem()) {
	    console.log('Item does not exist');return false;
	  }
	  return _.matches(filter)(this.activeItem());
	};

/***/ },
/* 7 */
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
	        } else {
	            let creeps = room.find(FIND_MY_CREEPS, { filter: c => c.hits < c.hitsMax });
	            if (creeps.length) {
	                const towers = room.find(FIND_MY_STRUCTURES, { filter: { structureType: STRUCTURE_TOWER } });
	                towers.forEach(tower => tower.heal(creeps[0]));
	            }
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
	        const surroundingCreeps = position.findInRange(FIND_HOSTILE_CREEPS, 1);
	        // const  = room.lookForAtArea(
	        //     LOOK_CREEPS, position.y - 1, position.x - 1, position.y + 1, position.x + 1, true
	        // )
	        // const surroundingCreeps = _.map(surroundingCreepData, (d)=> d.creep)
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
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	const role = __webpack_require__(9);

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
/* 9 */
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
	  },

	  getLackingSourceLink(creep) {
	    let sources = creep.room.find(FIND_MY_STRUCTURES, { filter: struc => struc.structureType == STRUCTURE_LINK && struc.energy < struc.energyCapacity });

	    if (sources.length) {
	      return sources[0];
	    } else {
	      return null;
	    }
	  },

	  getNonVoidProviderLink(creep) {
	    let sources = creep.room.find(FIND_MY_STRUCTURES, { filter: struc => struc.structureType == STRUCTURE_LINK && struc.energy > 0 });

	    if (sources.length) {
	      return sources[0];
	    } else {
	      return null;
	    }
	  }
	};

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	const role = __webpack_require__(9);

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
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	const role = __webpack_require__(9);

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
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	const role = __webpack_require__(9);

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
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	const role = __webpack_require__(9);

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
	            if (!structure || structure.hits >= structure.hitsMax) {
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
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	const role = __webpack_require__(9);

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
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _constants = __webpack_require__(5);

	var _constants2 = _interopRequireDefault(_constants);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	const Spawner = __webpack_require__(16);

	var spawnCreepWatcher = {
	  run: function (spawn) {
	    const spawner = new Spawner();
	    const harvesters = _.filter(Game.creeps, creep => creep.memory.role == 'harvester' && (creep.pos.roomName == spawn.pos.roomName || creep.memory.myRoomName === spawn.pos.roomName));
	    if (harvesters.length < spawn.memory.harvesterSize) {
	      const res = spawner.harvester(spawn);
	      if (res != ERR_NOT_ENOUGH_ENERGY && harvesters.length != 0) {} else {
	        spawner.rebootHarvester(spawn);
	        console.log('Trying to spawn reboot-Harvester...');
	      }
	    }

	    let excavators = _.filter(Game.creeps, creep => creep.memory.role == 'excavator' && (creep.pos.roomName == spawn.pos.roomName || creep.memory.myRoomName === spawn.pos.roomName));
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

	    const upgraders = _.filter(Game.creeps, creep => creep.memory.role == 'upgrader' && (creep.pos.roomName == spawn.pos.roomName || creep.memory.myRoomName === spawn.pos.roomName));
	    if (upgraders.length < spawn.memory.upgraderSize) {
	      const newName = spawner.upgrader(spawn);
	      //console.log('Spawning new upgrader: ' + newName);
	    }

	    let builders = _.filter(Game.creeps, creep => creep.memory.role == 'builder' && (creep.pos.roomName == spawn.pos.roomName || creep.memory.myRoomName === spawn.pos.roomName));
	    if (builders.length < spawn.memory.builderSize) {
	      const newName = spawner.builder(spawn);
	      //console.log('Spawning new builder: ' + newName);
	    }

	    let zerglings = _.filter(Game.creeps, creep => (creep.memory.role == _constants2.default.ROLE_ZERG || creep.memory.role == 'zergling') && creep.memory.kind && creep.memory.kind[0] == WORK && (creep.pos.roomName == spawn.pos.roomName || creep.memory.myRoomName === spawn.pos.roomName));
	    if (zerglings.length < spawn.memory.zerglingSize) {
	      const newName = spawner.zergling(spawn);
	    }

	    let drones = _.filter(Game.creeps, creep => (creep.memory.role == _constants2.default.ROLE_ZERG || creep.memory.role == 'zergling') && creep.memory.kind && creep.memory.kind[0] == CARRY && (creep.pos.roomName == spawn.pos.roomName || creep.memory.myRoomName === spawn.pos.roomName));
	    if (drones.length < spawn.memory.droneSize) {
	      const newName = spawner.drone(spawn);
	    }

	    let repairers = _.filter(Game.creeps, creep => creep.memory.role == 'repairer' && (creep.pos.roomName == spawn.pos.roomName || creep.memory.myRoomName === spawn.pos.roomName));
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
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	__webpack_require__(5);

	var _Spawning = __webpack_require__(17);

	var _Spawning2 = _interopRequireDefault(_Spawning);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	class Spawner {
	  constructor() {
	    var _this = this;

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

	    this.fighter = function (spawn) {
	      let maxEnergy = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];

	      const body = _this.calcCreepBody(spawn.room, [ATTACK], maxEnergy, false);
	      return Game.spawns[spawn.name].createCreep(body, 'Fighter' + _this.newCreepIndex(), { role: 'fighter' });
	    };

	    this.wreckingBall = spawn => {
	      let body = this.calcCreepBody(spawn.room, [WORK], 0, false);
	      return Game.spawns[spawn.name].createCreep(body, 'WreckingBall' + this.newCreepIndex(), { role: 'fighter' });
	    };

	    this.rangedFighter = spawn => {
	      return Game.spawns[spawn.name].createCreep([MOVE, MOVE, MOVE, MOVE, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK], 'RangedFighter' + this.newCreepIndex(), { role: 'rangedFighter' });
	    };

	    this.healer = function (spawn) {
	      let maxEnergy = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];

	      let body = _this.calcCreepBody(spawn.room, [HEAL], maxEnergy, false);
	      return Game.spawns[spawn.name].createCreep(body, 'Healer' + _this.newCreepIndex(), { role: 'healer' });
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

	    this.zergling = function (spawn) {
	      let opts = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

	      let usingStreet = true;
	      opts = Object.assign({}, opts, { role: 'zergling', kind: [WORK, CARRY] });
	      if (opts['usingStreet'] != undefined) {
	        usingStreet = opts['usingStreet'];
	        delete opts['usingStreet'];
	      }
	      let name = 'Zergling' + _this.newCreepIndex();
	      let body = _this.calcCreepBody(spawn.room, [WORK, WORK, WORK, CARRY, CARRY], 0, usingStreet);
	      return Game.spawns[spawn.name].createCreep(body, name, opts);
	    };

	    this.newCreepIndex = function () {
	      let index = Memory.creepIndex;
	      Memory.creepIndex += 1;
	      return index;
	    };

	    this.yellowBox = function (spawnRoom) {
	      let test = arguments.length <= 1 || arguments[1] === undefined ? true : arguments[1];

	      const spawning = new _Spawning2.default(spawnRoom);
	      const groupId = 1;
	      spawning.newItem({
	        role: 'fighter',
	        memory: { hasAssignedItself: false, isMaster: true, groupId: groupId },
	        body: [MOVE, WORK]
	      }, 1000);
	      spawning.newItem({
	        role: 'fighter',
	        memory: {
	          hasAssignedItself: false,
	          isSubordinate: true,
	          groupControl: true,
	          groupId: groupId
	        },
	        body: [MOVE, HEAL]
	      }, 1000);
	      spawning.newItem({
	        role: 'fighter',
	        memory: {
	          hasAssignedItself: false,
	          isSubordinate: true,
	          groupControl: true,
	          groupId: groupId
	        },
	        body: [MOVE, HEAL]
	      }, 1000);
	      spawning.newItem({
	        role: 'fighter',
	        memory: {
	          hasAssignedItself: false,
	          isSubordinate: true,
	          groupControl: true,
	          groupId: groupId
	        },
	        body: [MOVE, HEAL]
	      }, 1000);
	    };

	    this.calcInfestorCreepBody = (spawnRoom, sourceAmount, destinationRange) => {};

	    this.calcCreepBody = function (room, parts) {
	      let maxCost = arguments.length <= 2 || arguments[2] === undefined ? 0 : arguments[2];
	      let usingStreet = arguments.length <= 3 || arguments[3] === undefined ? true : arguments[3];

	      let partCost = {
	        [WORK]: 100,
	        [CARRY]: 50,
	        [MOVE]: 50,
	        [ATTACK]: 80,
	        [RANGED_ATTACK]: 150,
	        [HEAL]: 250
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

	  /**
	   * @param spawnRoom - The room in which the infestor should be spawned
	   * @param sourceAmount - The amount of energy the source contains
	   *  (one of [1500, 3000, 4500])
	   * @param destinationRange - The length of the path to the source to be mined
	   */


	};

	module.exports = Spawner;

/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _constants = __webpack_require__(5);

	var _constants2 = _interopRequireDefault(_constants);

	var _Queueing = __webpack_require__(18);

	var _Queueing2 = _interopRequireDefault(_Queueing);

	var _hiveMind = __webpack_require__(3);

	var _hiveMind2 = _interopRequireDefault(_hiveMind);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	/**
	 * Spawn creeps
	 * TODO Maintain the queue by removing unspawnable items (for example if
	 * extensions got destroyed)
	 */
	class Spawning extends _Queueing2.default {

	  constructor(room) {
	    let queue = arguments.length <= 1 || arguments[1] === undefined ? _constants2.default.SPAWN : arguments[1];

	    super(room, queue);

	    _initialiseProps.call(this);
	  }

	  /**
	   * Generates a new Spawning-item.
	   */
	  newItem(data, prio) {
	    let opts = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

	    let creepMemory = data.memory || {};
	    if (!_.isUndefined(opts.assignItem)) {
	      creepMemory.item = creepMemory.item || {};
	      let itemId = _hiveMind2.default.push(opts.assignItem.data);
	      creepMemory.item.id = itemId;
	      if (!_.isUndefined(opts.assignItem.priority)) {
	        creepMemory.item.prio = opts.assignItem.priority;
	      } else {
	        creepMemory.item.prio = 0;
	      }
	    }
	    if (_.isUndefined(creepMemory.myRoomName)) {
	      creepMemory.myRoomName = this.room.name;
	    }
	    if (_.isUndefined(creepMemory.role)) {
	      creepMemory.role = this._roleOrDefaultOf(data);
	    }

	    // Set the data
	    const hiveMindData = {
	      memory: creepMemory,
	      kind: data.kind || _constants2.default.KIND_ZERGLING,
	      role: this._roleOrDefaultOf(data),
	      body: data.body || undefined
	    };
	    return super.newItem(hiveMindData, prio);
	  }

	  itemDone(itemId) {
	    super.itemDone(itemId);
	  }

	  itemGenerator() {
	    // Simple target-zerg-count
	    for (let type of this.room.memory.targetZergCount) {
	      const count = this.room.memory.targetZergCount[type];
	      const existingZergs = _.filter(Game.creeps, zerg => zerg.memory.role === type && (zerg.memory.byRoomName === this.room.name || zerg.pos.roomName === this.room.name));
	      let queuedCreeps = this.queue.filter({ memory: { kind: type, role: _constants2.default.ROLE_ZERG } }).length;
	      while (count > existingZergs + queuedCreeps) {
	        this.newItem({
	          role: _constants2.default.ZERG,
	          kind: type,
	          memory: { body: this.bodyFor(type) }
	        });
	      }
	    }
	  }

	  bodyFor(zergType) {
	    const maxSpawnCost = this.room.maxSpawnCost();
	    let body = _constants2.default.ZERG_PARTS_TEMPLATES[zergType];
	    return this.calcCreepBody(this.room, body, maxSpawnCost);
	  }

	  /**
	   * TODO Probably doesnt belong here
	   */
	  itemVerwertor() {
	    if (this.queue.itemCount() > 0) {
	      while (queue.peek()) {
	        const queueItem = queue.peek();
	        const itemData = _hiveMind2.default.data[queueItem.id];
	        const spawnPriority = _constants2.default.PRIORITIES[_constants2.default.SPAWN][_constants2.default.KIND_CORRUPTOR];
	        const memory = {
	          kind: _constants2.default.KIND_CORRUPTOR,
	          memory: {
	            role: _constants2.default.ZERG,
	            item: queueItem
	          }
	        };
	        const res = this.room.pushToQueue(_constants2.default.SPAWN, { memory: creepMemory, kind: creepMemory.kind }, spawnPriority);
	        if (res) {
	          queue.dequeue();
	        }
	      }
	    }
	  }

	  spawnCreep(spawnPriority, creepMemory) {
	    let opts = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

	    if (!_.isUndefined(opts.assignItem)) {
	      creepMemory.item = creepMemory.item || {};
	      let itemId = _hiveMind2.default.push(opts.assignItem.data);
	      creepMemory.item.id = itemId;
	      if (!_.isUndefined(opts.assignItem.priority)) {
	        creepMemory.item.prio = opts.assignItem.priority;
	      } else {
	        creepMemory.item.prio = 0;
	      }
	    }
	    if (_.isUndefined(creepMemory.myRoomName)) {
	      creepMemory.myRoomName = this.room.name;
	    }
	    this.room.pushToQueue(_constants2.default.SPAWN, { memory: creepMemory, kind: creepMemory.kind }, spawnPriority);
	  }

	  calculateStepsFromSpawnOf(room, targetPos) {
	    //TODO Implement me
	    return 0;
	  }
	}

	var _initialiseProps = function () {
	  this._roleOrDefaultOf = data => data.role || data.memory.role || _constants2.default.ROLE_ZERG;

	  this.calcCreepBody = function (room, parts) {
	    let maxCost = arguments.length <= 2 || arguments[2] === undefined ? 0 : arguments[2];
	    let usingStreet = arguments.length <= 3 || arguments[3] === undefined ? true : arguments[3];

	    let partCost = {
	      [WORK]: 100,
	      [CARRY]: 50,
	      [MOVE]: 50,
	      [ATTACK]: 80,
	      [RANGED_ATTACK]: 150,
	      [HEAL]: 250
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
	};

	module.exports = Spawning;

/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _hiveMind = __webpack_require__(3);

	var _hiveMind2 = _interopRequireDefault(_hiveMind);

	var _PriorityQueue = __webpack_require__(4);

	var _PriorityQueue2 = _interopRequireDefault(_PriorityQueue);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	/**
	 * Basic helper-class for Queueing stuff
	 * Combines hiveMind & PriorityQueue for some noice helper-methods
	 */
	class Queueing {
	  constructor(room, queue) {
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
	        case STRUCTURE_LINK:
	          name = 'Link';break;
	        default:
	          name = '???';break;
	      }
	      if (struc instanceof ConstructionSite) {
	        return `ConstructionSite of ${ name }`;
	      } else {
	        return name;
	      }
	    };

	    if (typeof room === 'string') {
	      this.roomName = room;
	      this.room = Game.rooms[this.roomName];
	    } else {
	      this.roomName = room.name;
	      this.room = room;
	    }
	    if (typeof queue === 'string') {
	      this.queueType = queue;
	      this.queue = this.room.queue(queue);
	    } else if (queue === null) {} else {
	      this.queueType = 'ADD ME';
	      this.queue = queue;
	    }
	  }

	  newItem(data, prio) {
	    let queue = arguments.length <= 2 || arguments[2] === undefined ? this.queue : arguments[2];

	    const itemId = _hiveMind2.default.push(data);
	    data.kind = data.kind || this.queueType;
	    queue.queue({ id: itemId, prio: prio });
	    return itemId;
	  }

	  itemDone(itemId) {
	    _hiveMind2.default.delete(itemId);
	  }

	  allItems() {
	    if (_.isUndefined(this._allItems)) {
	      this._allItems = _hiveMind2.default.allForRoom(this.room || this.roomName);
	    }
	    return this._allItems;
	  }

	  filterQueue(filter) {
	    return _.filter(this.queue, filter);
	  }

	  log() {
	    /// TODO Make a nice log-output
	    console.log(JSON.stringify(this.queue));
	  }

	  log() {
	    let opts = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

	    const queue = opts.queue || this.queue;
	    if (!queue) {
	      log.orange('No prioqueue!');return;
	    }
	    console.log(`<span style="color: #33aaff">` + `====== Queue: ${ queue.constructor.name }</span>`);
	    for (let queueItem of queue.data) {
	      let item = Memory['hiveMind'][queueItem.id];
	      if (!item) {
	        continue;
	      }
	      console.log(this._stringifyQueueItem(queueItem, item));
	    }
	  }

	  _stringifyQueueItem(queueItem, hiveMindItem) {
	    return `    - <span style="color: orange">Item:</span> ` + `${ JSON.stringify(hiveMindItem) }`;
	  }

	  /**
	   * A meta-item is one which assigned-status has been set to false.
	   * It basically is a queue-item with an overarching hiveMindItem from which
	   * multiple hiveMind-items can be generated.
	   */
	  editMetaItemOrNewItem(onNewItem, onEditItem, existingItems) {
	    if (!existingItems.length) {
	      onNewItem();
	    } else {
	      const nonAssignedExistingItems = _.filter(existingItems, { assigned: false });
	      if (nonAssignedExistingItems.length) {
	        onEditItem(nonAssignedExistingItems[0]);
	      } else {
	        onNewItem();
	      }
	    }
	  }

	  /**
	   * Generates a new item that "gets" the amount of resources from the meta item
	   */
	  generateNewItemFromMetaItem(metaItem, amountToGet) {
	    let hiveMindData = _hiveMind2.default.data[metaItem.id];
	    let clonedData = JSON.parse(JSON.stringify(hiveMindData));
	    let clonedItem = JSON.parse(JSON.stringify(metaItem));
	    clonedData.amount = hiveMindData.amount > amountToGet ? amountToGet : hiveMindData.amount;
	    hiveMindData.amount -= clonedData.amount;
	    const newId = _hiveMind2.default.push(clonedData);
	    clonedItem.id = newId;
	    return clonedItem;
	  }

	  reorderByRangeFrom(position) {
	    let opts = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

	    const filter = opts.filter || (() => true);
	    // Ignores items that are massively less prioritized
	    const useRangeThreshold = opts.useRangeThreshold || true;
	    let firstPrio = null;
	    let queueData = _.transform(this.queue.data, (result, queueItem, index) => {
	      if (useRangeThreshold && firstPrio !== null && firstPrio < queueItem.prio - $.RANGE_PRIORITY_THRESHOLD) {
	        // Ditch the items that are massively less prioritized
	        // Since all following Priorities will be the same or even higher,
	        // all of them wont be prioritized better than the already re-queued
	        // items
	        return false;
	      }
	      const hiveMindData = _hiveMind2.default.data[queueItem.id];
	      let prio = 0;
	      if (filter(queueItem, hiveMindData)) {
	        if (firstPrio === null) {
	          firstPrio = queueItem.prio;
	        }
	        const range = position.getLinearRangeTo(new RoomPosition(hiveMindData.x, hiveMindData.y, hiveMindData.roomName));
	        prio = queueItem.prio + range * $.PRIORITY_RANGE_MODIFER;
	      }
	      // Do I really need remote-priorities-mod? I dont think so. Datt range.
	      // else {
	      //   prio = queueItem.prio + $.REMOTE_PRIORITIES_PROVIDING_MODIFIER
	      // }
	      result.push({ id: queueItem.id, prio: prio });
	      return true;
	    });
	    return new _PriorityQueue2.default(queueData);
	  }

	}

	module.exports = Queueing;

/***/ },
/* 19 */
/***/ function(module, exports) {

	'use strict';

	const roleFighter = {

	  assignItself(creep) {
	    if (!Memory.zergSubordinates) {
	      Memory.zergSubordinates = {};
	    }
	    if (!Memory.zergSubordinates[creep.memory.groupId]) {
	      Memory.zergSubordinates[creep.memory.groupId] = {};
	    }
	    let group = Memory.zergSubordinates[creep.memory.groupId];
	    if (creep.memory.isMaster) {
	      group['masterId'] = creep.id;
	    } else if (creep.memory.isSubordinate) {
	      if (!group['subordinateIds']) {
	        group['subordinateIds'] = [];
	      }
	      group['subordinateIds'].push(creep.id);
	    }
	    creep.memory.hasAssignedItself = true;
	  },

	  subPositionForIndex(index, position, moveDir) {

	    const directions = {
	      [TOP]: { x: 0, y: 1 },
	      [TOP_RIGHT]: { x: -1, y: 1 },
	      [RIGHT]: { x: -1, y: 0 },
	      [BOTTOM_RIGHT]: { x: -1, y: -1 },
	      [BOTTOM]: { x: 0, y: -1 },
	      [BOTTOM_LEFT]: { x: 1, y: -1 },
	      [LEFT]: { x: 1, y: 0 },
	      [TOP_LEFT]: { x: 1, y: 1 }
	    };
	    let behind = directions[moveDir];
	    let relativePos = null;
	    let dir = null;
	    switch (index) {
	      case 0:
	        relativePos = directions[moveDir];
	        break;
	      case 1:
	        dir = moveDir - 1 >= 1 ? moveDir - 1 : 8 + (moveDir - 1);
	        relativePos = directions[dir];
	        break;
	      case 2:
	        // If moveDir is straight (top, right, left, bottom) we want one of the
	        // creeps to stand directly besides the attacker
	        dir = null;
	        if (moveDir % 2 === 1) {
	          dir = moveDir - 2 >= 1 ? moveDir - 2 : 8 + (moveDir - 2);
	        } else {
	          dir = moveDir + 1 <= 8 ? moveDir + 1 : moveDir + 1 - 8;
	        }
	        relativePos = directions[dir];
	        break;
	    }
	    console.log(` = relativePos: ${ JSON.stringify(relativePos) }`);
	    let x = relativePos.x + position.x;
	    let y = relativePos.y + position.y;
	    console.log(`  = x: ${ x }`);
	    console.log(`  = y: ${ y }`);
	    if (x < 0) {
	      x = 50 + x;
	    } else if (x > 50) {
	      x = x - 50;
	    }
	    if (y < 0) {
	      y = 50 + x;
	    } else if (y > 50) {
	      y = x - 50;
	    }

	    return new RoomPosition(x, y, position.roomName);
	  },

	  run(creep) {
	    let itsMaster = Game.getObjectById(_.get(Memory, ['zergSubordinates', creep.memory.groupId, 'masterId']));
	    if (creep.memory.hasAssignedItself === false) {
	      this.assignItself(creep);
	    }
	    if (creep.memory.isMaster) {

	      // Control master here, like getting target, moving to it

	      let path = null;
	      let target = this.flagToGoFor(creep);
	      if (target) {
	        this.attackOnFlag(creep, target);
	      } else {
	        // Scorched earth
	        target = this.scorchTarget(creep);
	      }
	      if (target) {
	        path = creep.pos.findPathTo(target);
	      }
	      if (path) {
	        let masterDir = null;
	        let masterPos = null;
	        if (path.length) {
	          masterDir = path[0].direction; // Which dir is the master going?
	          masterPos = new RoomPosition(path[0].x, path[0].y, creep.room.name);
	          creep.move(masterDir);
	        } else {
	          masterDir = creep.pos.getDirectionTo(target);
	        }
	        if (!masterDir) {
	          log.red('masterDir undefined');
	          masterDir = 1;
	          masterPos = creep.pos;
	        }

	        if (creep.pos.inRangeTo(target, this.attackRange(creep))) {
	          this.destroy(creep, target);
	        } else {
	          this.attackVicinity(creep);
	          this.heal(creep);
	        }

	        // Try to move the target with the master
	        const subs = _.get(Memory, ['zergSubordinates', creep.memory.groupId, 'subordinateIds']);
	        log.red(subs.length);
	        if (subs && subs.length) {
	          subs.forEach((sub, index) => {
	            console.log(`  = Sub-index is ${ index }`);
	            Game.getObjectById(sub).moveTo(this.subPositionForIndex(index, masterPos, masterDir), { ignoreCreeps: false });
	          });
	        }
	      } else {
	        creep.say('No Path');
	        this.attackVicinity(creep);
	        this.heal(creep);
	      }
	    } else if (creep.memory.isSubordinate && itsMaster && creep.memory.groupControl) {
	      // Master controlls my movement
	      this.attackVicinity(creep);
	      this.heal(creep);
	    } else if (creep.memory.isSubordinate && itsMaster) {
	      creep.moveTo(itsMaster);
	    } else {
	      // Standard attack on flag
	      creep.say('Master down?');
	      if (!this.moveAndAttackOnFlag(creep)) {
	        this.attackVicinity(creep);
	        this.heal(creep);
	      }
	    }
	  },

	  attackOnFlag(creep, flag) {
	    if (creep.pos.inRangeTo(flag, this.attackRange(creep))) {
	      let targets = flag.pos.look();
	      if (targets.length) {
	        this.destroy(creep, targets[0]);
	        return true;
	      }
	    }
	  },

	  flagToGoFor(creep) {
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
	      if (flag.room) {
	        let targets = flag.pos.look();
	        if (targets.length) {
	          return flag;
	        } else {
	          return false;
	        }
	      } else {
	        return flag.pos;
	      }
	    } else {
	      return false;
	    }
	  },

	  moveAndAttackOnFlag(creep) {
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
	      if (creep.pos.inRangeTo(flag, this.attackRange(creep))) {
	        let targets = flag.pos.look();
	        if (targets.length) {
	          this.destroy(creep, targets[0]);
	          return true;
	        }
	      } else {
	        creep.moveTo(flag);
	        return false;
	      }
	    }
	  },

	  attackRange(creep) {
	    if (creep.getActiveBodyparts(RANGED_ATTACK) > 0) {
	      return 3;
	    } else {
	      return 1;
	    }
	  },

	  attackVicinity(creep) {
	    let targets = creep.pos.findInRange(FIND_HOSTILE_CREEPS, this.attackRange(creep));
	    if (targets.length > 0) {
	      this.destroy(creep, targets[0]);
	    }
	  },

	  destroy(creep, target) {
	    if (target instanceof Flag) {
	      let targets = _.reject(target.pos.look(), t => t instanceof Flag);
	      target = targets[0];
	    }
	    if (creep.getActiveBodyparts(WORK) > 0 && !(target instanceof Creep)) {
	      log.orange(`dismantling! ${ creep.dismantle(target.id) }, ${ JSON.stringify(target) }`);
	      creep.dismantle(target);
	    } else {
	      creep.attack(target);
	    }
	    if (creep.getActiveBodyparts(RANGED_ATTACK) > 0) {
	      creep.rangedAttack(target);
	    }
	  },

	  heal(creep) {
	    if (creep.hitsMax - _.sum(_.filter(creep.body, (b, k) => k == HEAL)) >= creep.hits) {
	      creep.heal(creep);
	    } else {
	      let targets = creep.pos.findInRange(FIND_MY_CREEPS, 1, { filter: creep => creep.hitsMax - creep.hits > 0 });
	      if (!(targets.length > 0)) {
	        targets = creep.pos.findInRange(FIND_MY_CREEPS, 2, { filter: creep => creep.hitsMax - creep.hits > 0 });
	      }
	      if (targets.length > 0) {
	        targets = _.sortByOrder(targets, c => c.maxHits - c.hits, 'asc');
	        creep.heal(targets[0]);
	      }
	    }
	  },

	  scorchTarget(creep) {
	    const room = creep.room;
	    targets = room.find(FIND_HOSTILE_STRUCTURES, s => s.structureType === STRUCTURE_TOWER);
	    if (targets.length) {
	      return creep.findClosestByPath(targets);
	    }
	    targets = room.find(FIND_HOSTILE_STRUCTURES, s => s.structureType === STRUCTURE_SPAWN);
	    if (targets.length) {
	      return creep.findClosestByPath(targets);
	    }
	    targets = room.find(FIND_HOSTILE_STRUCTURES, s => s.structureType === STRUCTURE_EXTENSION);
	    if (targets.length) {
	      return creep.findClosestByPath(targets);
	    }
	    return false;
	  }
	};

	module.exports = roleFighter;

/***/ },
/* 20 */
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
/* 21 */
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
/* 22 */
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
/* 23 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _constants = __webpack_require__(5);

	var _constants2 = _interopRequireDefault(_constants);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	const roleSweeper = {
	  run(creep) {
	    let mem = creep.memory;
	    if (mem.targetRoomName) {
	      if (creep.room.name != mem.targetRoomName) {
	        creep.moveTo(new RoomPosition(25, 25, mem.targetRoomName));
	      } else {
	        const target = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
	        if (!target) {
	          creep.say('⚘☀', true);return;
	        }
	        if (creep.pos.inRangeTo(target, 1)) {
	          this.destroy(creep, target);
	        } else {
	          creep.moveTo(target);
	        }
	      }
	    }
	  },

	  destroy(creep, target) {
	    if (creep.getActiveBodyparts(WORK) > 0 && !(target instanceof Creep)) {
	      console.log(creep.dismantle(Game.getObjectById('57a2ac0b0ed300e43ec06811')));
	    } else {
	      creep.attack(target);
	    }
	  }
	};

	module.exports = roleSweeper;

/***/ },
/* 24 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _constants = __webpack_require__(5);

	var _constants2 = _interopRequireDefault(_constants);

	var _hiveMind = __webpack_require__(3);

	var _hiveMind2 = _interopRequireDefault(_hiveMind);

	var _PriorityQueue = __webpack_require__(4);

	var _PriorityQueue2 = _interopRequireDefault(_PriorityQueue);

	var _Spawning = __webpack_require__(17);

	var _Spawning2 = _interopRequireDefault(_Spawning);

	var _ActiveProviding = __webpack_require__(25);

	var _ActiveProviding2 = _interopRequireDefault(_ActiveProviding);

	var _Requesting = __webpack_require__(28);

	var _Requesting2 = _interopRequireDefault(_Requesting);

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
	  [STRUCTURE_LINK]: 1800,
	  [CONSTRUCTION_SITE]: 1900,
	  [STRUCTURE_STORAGE]: 2000,
	  [STRUCTURE_CONTROLLER]: 9000,
	  [STRUCTURE_CONTAINER]: 10000
	};

	class Overlord {
	  constructor(roomName) {
	    var _this = this;

	    this.update = queues => {

	      this.defend();
	      this.existingItems = _hiveMind2.default.allForRoom(this.room);

	      this.spawn();

	      if (queues[WORK]) {
	        this.work(queues[WORK]);
	      }
	      if (queues[CARRY]) {
	        this.carry(queues[CARRY]);
	      }
	      if (queues[_constants2.default.EXCAVATE]) {
	        this.excavate(queues[_constants2.default.EXCAVATE]);
	      }

	      // new ActiveProviding(this.room).itemGenerator()
	      // new Requesting(this.room).itemGenerator()

	      this.remote(queues);
	    };

	    this.spawn = () => {
	      // Explicit Spawns
	      let queue = this.room.queue(_constants2.default.SPAWN);
	      if (queue && queue.itemCount() > 0) {
	        let spawningSpawns = [];
	        while (queue.peek()) {
	          let queueItem = queue.peek();
	          let data = _hiveMind2.default.data[queueItem.id];
	          let body = [];
	          if (data.kind === _constants2.default.KIND_INFESTOR) {
	            // FIXME: Hardcoded INFESTOR STUFF
	            body = [WORK, WORK, WORK, WORK, WORK, MOVE, MOVE, MOVE];
	            // body = [MOVE]
	          } else {
	            body = data.body ? data.body : this.calcCreepBody(_constants2.default.ZERG_PARTS_TEMPLATES[data.kind]);
	          }
	          let spawns = this.room.spawns(s => s.canCreateCreep(body) === OK && !(spawningSpawns.indexOf(s) !== -1));
	          if (spawns.length) {
	            let memory = data.memory ? data.memory : { role: _constants2.default.ROLE_ZERG };
	            if (!memory.kind) {
	              memory.kind = data.kind;
	            }
	            log.green(`Creating creep with mem ${ JSON.stringify(memory) }`);
	            let res = spawns[0].createCreep(body, `${ data.kind }${ this.newCreepIndex() }`, memory);
	            spawningSpawns.push(spawns[0]);
	            if (typeof res === 'string') {
	              queue.dequeue();
	              _hiveMind2.default.remove(queueItem.id);
	            } else {
	              console.log("Spawn noped", res);
	            }
	          } else {
	            break;
	          }
	        }
	      }
	    };

	    this.newCreepIndex = function () {
	      let index = Memory.creepIndex;
	      Memory.creepIndex += 1;
	      return index;
	    };

	    this.work = queue => {

	      // let targetData = this.findWorkTargetFor(RESOURCE_ENERGY)
	      // console.log('targetData', JSON.stringify(targetData))

	      let conSites = this.room.find(FIND_CONSTRUCTION_SITES);
	      if (conSites.length > 0) {
	        for (let conSite of conSites) {
	          let targetItems = _.filter(this.existingItems, item => _.get(item, ['toTarget', 'id']) == conSite.id);
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
	        let targetItems = _.filter(this.existingItems, item => _.get(item, ['toTarget', 'id']) == controller.id);
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
	        lacking = lacking.concat(this.room.memory.links.sources.map(source => Game.getObjectById(source)));
	      }
	      if (lacking.length > 0) {
	        // lacking = _.sortByOrder(lacking, 'energy', 'asc')
	        for (let target of lacking) {
	          this.genTargetCarryTasksFor(target, queue, RESOURCE_ENERGY, PRIOS[target.structureType]);
	        }
	      }

	      // Find the targets that have stuff and generate tasks for them
	      let sources = this.room.find(FIND_DROPPED_RESOURCES);
	      sources = sources.concat(this.room.find(FIND_STRUCTURES, { filter: this.filterNonVoidEnergyContainers }));
	      if (sources.length) {
	        for (let source of sources) {
	          this.genSourceTasks(source, queue, CARRY, { dontFindTarget: true });
	        }
	      }

	      /// TODO Add A passive queue?!?!

	      // let links = this.room.find(FIND_MY_STRUCTURES, {filter: (struc)=> (
	      //   struc.structureType == STRUCTURE_LINK &&
	      //   struc.energy > 0 &&
	      //   this.room.memory.links.providers.includes(struc.id)
	      // )})
	      // if(sources.length) {
	      //   for(let source of sources) {
	      //     this.genSourceTasks(
	      //       source, queue, CARRY, {dontFindTarget: true}
	      //     )
	      //   }
	      // }
	    };

	    this.genTargetCarryTasksFor = (target, queue, resType, prio) => {
	      let current = target.store ? _.sum(target.store) : target.energy;
	      let max = target.storeCapacity ? target.storeCapacity : target.energyCapacity;

	      let targetItems = _.filter(this.existingItems, item => _.get(item, ['toTarget', 'id']) == target.id);
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

	    this.genSourceTasks = function (source, queue, taskType) {
	      let options = arguments.length <= 3 || arguments[3] === undefined ? {} : arguments[3];

	      let dontFindTarget = options.dontFindTarget || false;
	      let sourceItems = _.filter(_this.existingItems, item => item.fromSource && item.fromSource.id == source.id && item.stage != TYPE_TARGET);
	      let existingDrawAmount = _.sum(sourceItems, 'fromSource.amount');
	      let stillStored = 0;
	      if (source.store) {
	        stillStored = source.store[RESOURCE_ENERGY] - existingDrawAmount;
	      } else {
	        stillStored = source.amount - existingDrawAmount;
	      }
	      let itemCount = sourceItems.length;
	      while (stillStored > _this.creepCarryAmount && itemCount < _this.maxItemsPerTask) {
	        let targetData = null;
	        if (taskType == CARRY && !dontFindTarget) {
	          targetData = _this.findCarryTargetFor(source, RESOURCE_ENERGY);
	        } else if (taskType == WORK && !dontFindTarget) {
	          targetData = _this.findWorkTargetFor(source, RESOURCE_ENERGY);
	        }

	        let target = false;
	        let prio = 6666;
	        if (targetData && targetData.target) {
	          target = targetData.target;
	          prio = targetData.prio;
	        } else if (dontFindTarget) {} else {
	          break; // No suitable target found
	        }
	        _this.addItem(queue, source, target, RESOURCE_ENERGY, _this.creepCarryAmount, prio);
	        stillStored -= _this.creepCarryAmount;
	        itemCount += 1;
	      }
	    };

	    this.genSourceTask = (source, queue, taskType) => {
	      let sourceItems = _.filter(this.existingItems, item => item.fromSource && item.fromSource.id == source.id && item.stage != TYPE_TARGET);
	      let existingDrawAmount = _.sum(sourceItems, 'fromSource.amount');
	      let stillStored = 0;
	      if (source.store) {
	        stillStored = source.store[RESOURCE_ENERGY] - existingDrawAmount;
	      } else {
	        stillStored = source.amount - existingDrawAmount;
	      }
	      let itemCount = sourceItems.length;
	      if (stillStored > this.creepCarryAmount && itemCount < this.maxItemsPerTask) {
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
	          let spawnItems = _.filter(this.existingItems, item => _.get(item, ['toTarget', 'id']) == spawn.id);
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
	          let extensionItems = _.filter(this.existingItems, item => _.get(item, ['toTarget', 'id']) == extension.id);
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
	          let towerItems = _.filter(this.existingItems, item => _.get(item, ['toTarget', 'id']) == tower.id);
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
	        let storageItems = _.filter(this.existingItems, item => _.get(item, ['toTarget', 'id']) == storage.id);
	        let existingAddAmount = storageItems.length * this.creepCarryAmount;
	        let ullage = storage.storeCapacity - (_.sum(storage.store) + existingAddAmount);
	        if (ullage > 0) {
	          return storage;
	        }
	      }
	    };

	    this.filterNonVoidEnergyContainers = object => object.structureType == STRUCTURE_CONTAINER && object.store[RESOURCE_ENERGY] > this.creepCarryAmount;

	    this.filterNonVoidEnergyStorage = object => object.structureType == STRUCTURE_STORAGE && object.store[RESOURCE_ENERGY] > 1000;

	    this.addItem = (queue, source, target, res, targetAmount, priority) => {
	      let data = {
	        res: res,
	        stage: null,
	        assigned: false,
	        byRoomName: this.room.name
	      };
	      if (target) {
	        data['toTarget'] = {
	          id: target.id,
	          x: target.pos.x,
	          y: target.pos.y,
	          roomName: target.pos.roomName,
	          amount: targetAmount
	        };
	      }
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

	    this.getFloatingItems = function (queue) {
	      let customFilter = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];

	      let filter = null;
	      if (customFilter != null) {
	        filter = q => {
	          let item = _hiveMind2.default.data[q.id];
	          return item && !item.toTarget && !item.assigned && item.fromSource && customFilter(q, item);
	        };
	      } else {
	        filter = q => {
	          let item = _hiveMind2.default.data[q.id];
	          return item && !item.toTarget && item.fromSource && !item.assigned;
	        };
	      }
	      return queue.filter(filter);
	    };

	    this.applyPathCostToQueueRating = function (startPosition, queueData, hiveAccessor) {
	      let modifier = arguments.length <= 3 || arguments[3] === undefined ? 1.0 : arguments[3];

	      return _.compact(queueData.map(data => {
	        let objectDescriptor = _.get(_hiveMind2.default.data[data.id], hiveAccessor);
	        let obj = Game.getObjectById(_.get(objectDescriptor, 'id'));
	        if (!obj) {
	          if (objectDescriptor.roomName && !Game.rooms[objectDescriptor.roomName]) {
	            // No info on object, return some very high path
	            return { id: data.id, prio: data['prio'] + 20000 * modifier };
	          } else {
	            // We can see its room, but it isnt there
	            return null;
	          }
	          return { id: data.id, prio: data['prio'] + pathLength * modifier };
	        }
	        let pathLength = startPosition.findPathTo(obj).length;
	        return { id: data.id, prio: data['prio'] + pathLength * modifier };
	      }));
	    };

	    this.findSourceForCreep = (creep, item, resType) => {

	      let queue = this.room.queue(CARRY);
	      let queueItems = this.getFloatingItems(queue, (queueItem, item) => resType === item.res && (!_.get(item.toTarget, 'amount') || item.toTarget.amount <= item.fromSource.amount));
	      let gameItems = queueItems.map(q => Game.getObjectById(_hiveMind2.default.data[q.id].fromSource.id));
	      let pathAdjustedQueue = new _PriorityQueue2.default(this.applyPathCostToQueueRating(creep.pos, queueItems, 'fromSource'));
	      let queueItem = pathAdjustedQueue.dequeue();
	      if (queueItem) {
	        _hiveMind2.default.data[creep.memory.item.id].fromSource = _hiveMind2.default.data[queueItem.id].fromSource;
	        _hiveMind2.default.data[creep.memory.item.id].assigned = true;
	        let itemData = _hiveMind2.default.data[creep.memory.item.id];
	        if (itemData.fromSource && !itemData.fromSource.amount) {
	          itemData.fromSource.amount = creep.carryCapacity;
	        }
	        queue.removeBy({ id: queueItem.id }); // Keep original queue in sync
	        _hiveMind2.default.remove(queueItem.id);
	        return true;
	      }

	      // Try dropped resources first
	      let droppedViableRes = creep.room.find(FIND_DROPPED_RESOURCES, { filter: res => res.resourceType == resType && res.amount > item.toTarget.amount && res.amount > _.sum(_.filter(this.existingItems, item => item.fromSource.id == res.id), 'fromSource.amount') + item.toTarget.amount });
	      if (droppedViableRes.length) {

	        // FIXME THIS IS THE ROOT OF THE FRIGGIN PROBLEMS! FIX IT
	        // This is why all the creeps go to the same source
	        return creep.pos.findClosestByPath(droppedViableRes);
	      }

	      // HAAACKS
	      if (this.room.memory.connectedRemoteRooms) {
	        for (let remoteName in this.room.memory.connectedRemoteRooms) {
	          let data = this.room.memory.connectedRemoteRooms[remoteName];
	          if (data.parsed) {
	            if (Game.rooms[remoteName]) {
	              let room = Game.rooms[remoteName];
	              let sources = room.find(FIND_DROPPED_RESOURCES, { filter: res => res.resourceType == resType && res.amount > item.toTarget.amount && res.amount > _.sum(_.filter(this.existingItems, item => item.fromSource.id == res.id), 'fromSource.amount') + item.toTarget.amount + 1500 // HAAACKS
	              });
	              if (sources.length > 0) {
	                return sources[0];
	                // return creep.pos.findClosestByPath(sources)
	              }
	            }
	          }
	        }
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
	      if (this.room.memory.links && this.room.memory.links.providers.length) {
	        let providers = _.filter(this.room.memory.links.providers.map(providerLinkId => Game.getObjectById(providerLinkId)), prov => prov.energy > 0);
	        structures = structures.concat(providers);
	      }
	      if (structures.length > 0) {
	        return creep.pos.findClosestByPath(structures);
	      } else {
	        // Mine resources themself
	        let isBootstrapping = this.room.find(FIND_STRUCTURES, { filter: { structureType: STRUCTURE_CONTAINER } }).length == 0;
	        if (isBootstrapping) {
	          let sources = creep.room.find(FIND_SOURCES, { filter: source => source.energy > 0 });
	          return creep.pos.findClosestByPath(sources);
	        }
	      }
	    };

	    this.remote = queues => {
	      // Controls the remote expansions
	      if (this.room.memory.connectedRemoteRooms) {
	        for (let remoteName in this.room.memory.connectedRemoteRooms) {
	          let data = this.room.memory.connectedRemoteRooms[remoteName];
	          if (data.parsed) {
	            // Make sure every source has an item assigned to it in the hiveMind
	            for (let source of data.sources) {
	              let x = source.x;
	              let y = source.y;
	              let id = source.id;

	              let sourceItemExists = _hiveMind2.default.filter({ fromSource: { x: x, y: y, roomName: remoteName, id: id } }).length > 0;
	              if (!sourceItemExists) {
	                this.room.pushToQueue(_constants2.default.EXCAVATE, {
	                  fromSource: { x: x, y: y, roomName: remoteName, id: id },
	                  res: RESOURCE_ENERGY,
	                  stage: null,
	                  continuous: true
	                }, _constants2.default.PRIORITIES[_constants2.default.EXCAVATE][_constants2.default.SOURCE] * _constants2.default.REMOTE_PRIORITIES_MODIFIER);
	              }
	            }

	            if (Game.rooms[remoteName]) {
	              // Generate carry-tasks for remote stuff
	              let room = Game.rooms[remoteName];
	              let sources = room.find(FIND_DROPPED_RESOURCES);
	              if (sources.length) {
	                for (let source of sources) {
	                  this.genSourceTasks(source, queues[CARRY], CARRY, { dontFindTarget: true });
	                }
	              }
	              //defend room
	              this.defend(room);
	            }
	          } else {
	            this.initiateRemoteRoomParsing(remoteName);
	          }
	        }
	      }
	    };

	    this.initiateRemoteRoomParsing = remoteRoomName => {
	      log.cyan(`Please give me info on remoteRoom ${ remoteRoomName }`);
	      // Scout, cache & pave path with roads
	      // let mutalisks = _.filter(
	      //   Game.creeps,
	      //   (c)=> (
	      //     c.hasItem() && _.get(
	      //       c.activeItem(), ['toTarget', 'roomName']
	      //     ) === remoteRoomName
	      //   )
	      // )
	      // console.log(JSON.stringify(mutalisks))
	      // if(mutalisks.length < 1) {
	      // this.room.pushToQueue(
	      //   $.SPAWN, {role: $.ROLE_ZERG, kind: $.KIND_MUTALISK, body: [MOVE]}
	      // )
	      // this.room.pushToQueue($.SCOUT, {toTarget: {roomName: remoteRoomName}})
	      // }
	    };

	    this.excavate = queue => {
	      if (queue && queue.itemCount() > 0) {
	        log.cyan('Excavate queue has stuff!');
	        let spawningSpawns = [];
	        while (queue.peek()) {
	          let queueItem = queue.dequeue();
	          log.cyan(`Dequeuing ${ JSON.stringify(queueItem) }`);
	          let itemData = _hiveMind2.default.data[queueItem.id];
	          let spawnPrio = _constants2.default.PRIORITIES[_constants2.default.SPAWN][_constants2.default.KIND_INFESTOR];
	          if (itemData.fromSource.roomName != this.room.name) {
	            log.cyan(`Remote excavate`);
	            // Remote work
	            spawnPrio = spawnPrio * _constants2.default.REMOTE_PRIORITIES_MODIFIER;
	          }
	          log.cyan(`Pushing to spawn-queue`);
	          new _Spawning2.default(this.room).newItem({ kind: _constants2.default.KIND_INFESTOR, memory: { item: queueItem } }, spawnPrio);
	        }
	      }
	    };

	    this.defend = function () {
	      let room = arguments.length <= 0 || arguments[0] === undefined ? _this.room : arguments[0];

	      if (room.find(FIND_HOSTILE_CREEPS).length > 0) {
	        if (!_.get(room.memory, ['specialState', _constants2.default.UNDER_ATTACK])) {
	          room.memory.specialState[_constants2.default.UNDER_ATTACK] = true;
	          // Respond
	          new _Spawning2.default(_this.room).newItem({
	            role: _constants2.default.KIND_SWEEPER,
	            kind: _constants2.default.KIND_SWEEPER,
	            body: [MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK],
	            memory: {
	              targetRoomName: room.name
	            }
	          });
	        }
	      } else {
	        if (_.get(room.memory, ['specialState', _constants2.default.UNDER_ATTACK])) {
	          room.memory.specialState[_constants2.default.UNDER_ATTACK] = false;
	        }
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
	          if (!item) {
	            continue;
	          }
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
	        case STRUCTURE_LINK:
	          name = 'Link';break;
	        default:
	          name = '???';break;
	      }
	      if (struc instanceof ConstructionSite) {
	        return `ConstructionSite of ${ name }`;
	      } else {
	        return name;
	      }
	    };

	    this.calcCreepBody = function (parts) {
	      let maxCost = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];
	      let usingStreet = arguments.length <= 2 || arguments[2] === undefined ? true : arguments[2];

	      let partCost = {
	        [WORK]: 100,
	        [CARRY]: 50,
	        [MOVE]: 50,
	        [ATTACK]: 80,
	        [RANGED_ATTACK]: 150,
	        [HEAL]: 250
	      };
	      let roomMaxCost = _.sum(_this.room.find(FIND_MY_STRUCTURES, { filter: struc => struc.structureType == STRUCTURE_EXTENSION || struc.structureType == STRUCTURE_SPAWN }), 'energy');
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
	   * @var itemData {
	   *    kind: [Calcs body from that],
	   *    memory: [Puts into creeds memory, doesnt need kind]
	   *  }
	   */


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


	  /**
	   * Items that can be used to satisfy the demands of a target
	   * Eg items that only have a source
	   */


	  /**
	   * @param hiveAccessor - for example ['fromSource', 'id']
	   */


	  // getLackingSourceLink() {
	  //   let sources = this.room.find(FIND_MY_STRUCTURES, {filter: (struc)=> (
	  //     struc.structureType == STRUCTURE_LINK &&
	  //     struc.energy < struc.energyCapacity
	  //   )})
	  //
	  //   if(sources.length) {
	  //     return sources[0]
	  //   }
	  //   else {
	  //     return null
	  //   }
	  // }
	  //
	  // getNonVoidProviderLink() {
	  //   let sources = this.room.find(FIND_MY_STRUCTURES, {filter: (struc)=> (
	  //     struc.structureType == STRUCTURE_LINK &&
	  //     struc.energy > 0
	  //   )})
	  //
	  //   if(sources.length) {
	  //     return sources[0]
	  //   }
	  //   else {
	  //     return null
	  //   }
	  // }
	  //
	}

	module.exports = Overlord;

/***/ },
/* 25 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _constants = __webpack_require__(5);

	var _constants2 = _interopRequireDefault(_constants);

	var _Queueing = __webpack_require__(18);

	var _Queueing2 = _interopRequireDefault(_Queueing);

	var _hiveMind = __webpack_require__(3);

	var _hiveMind2 = _interopRequireDefault(_hiveMind);

	var _Shiny = __webpack_require__(26);

	var _Shiny2 = _interopRequireDefault(_Shiny);

	var _screepsProfiler = __webpack_require__(27);

	var _screepsProfiler2 = _interopRequireDefault(_screepsProfiler);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	/**
	 * Active Providers
	 * Things that need to be taken care of, like mined resources that should be put
	 * into the storage
	 */
	class ActiveProviding extends _Queueing2.default {

	  constructor(room) {
	    let queue = arguments.length <= 1 || arguments[1] === undefined ? _constants2.default.ACTIVE_PROVIDING : arguments[1];

	    super(room, queue);

	    this.filterNonVoidEnergyContainers = object => object.structureType == STRUCTURE_CONTAINER && object.store[RESOURCE_ENERGY] > 0;
	  }

	  /**
	   * Generates a new Providing-item.
	   *
	   * Abstracts quite a bit and is somewhat intelligent.
	   * If you pass a `provider` in data and you want energy from it or it only has
	   * one resource, you only have to pass the prio and you are set.
	   *
	   * @param prio - If given as a function, it will execute it with the
	   *    calculated hiveMind-data and the return-value will be used as the prio
	   */
	  newItem(data, prio) {
	    let opts = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

	    let type = data.type;
	    let amount = data.amount;
	    if (!type) {
	      const resourceData = this._calcResourceOf(data.provider);
	      type = resourceData.type;
	      amount = amount || resourceData.amount;
	    }
	    if (!amount) {
	      amount = this._calcCarryAmountOf(data.provider, type);
	    }
	    const hiveMindData = {
	      roomName: data.roomName || _.get(data.provider, ['pos', 'roomName']),
	      objId: data.id || _.get(data.provider, ['id']) || undefined,
	      x: data.x || _.get(data.provider, ['pos', 'x']) || undefined,
	      y: data.y || _.get(data.provider, ['pos', 'y']) || undefined,
	      type: type,
	      amount: amount,
	      assigned: false
	    };
	    if (typeof prio === 'function') {
	      prio = prio(hiveMindData);
	    }
	    return super.newItem(hiveMindData, prio);
	  }

	  _calcResourceOf(provider) {
	    let goods = new _Shiny2.default(provider).allGoods();
	    _.each(goods, (amount, name) => {
	      if (amount === 0) {
	        delete goods[name];
	      }
	    });
	    const availableResourceTypes = Object.keys(goods);
	    if (!availableResourceTypes.length) {
	      return false;
	    } else if (availableResourceTypes.length === 1) {
	      // If one resource is found, type is obvious
	      const type = availableResourceTypes[0];
	      return { type: type, amount: goods[type] };
	    } else if (availableResourceTypes.indexOf(RESOURCE_ENERGY) !== -1) {
	      // Default to Energy if more than one resource found
	      return { type: RESOURCE_ENERGY, amount: goods[RESOURCE_ENERGY] };
	    } else {
	      // Else basically give up and return at least something
	      log.orange(`Providing#calcTypeOf just returned ${ availableResourceTypes[0] } ` + `for ${ provider }`);
	      const type = availableResourceTypes[0];
	      return { type: type, amount: goods[type] };
	    }
	  }

	  _calcCarryAmountOf(object, type) {
	    return new _Shiny2.default(provider).goods(type);
	  }

	  itemDone(itemId) {
	    super.itemDone(itemId);
	  }

	  itemGenerator() {

	    const rooms = this.room.accessibleControllingRooms();
	    let sources = [];
	    rooms.forEach(room => {
	      // Resources
	      sources = sources.concat(room.find(FIND_DROPPED_RESOURCES));
	      // Energy Containers
	      sources = sources.concat(room.find(FIND_STRUCTURES, { filter: this.filterNonVoidEnergyContainers }));
	    });

	    if (sources.length) {
	      for (let source of sources) {
	        const existingItems = _.filter(_hiveMind2.default.allForRoom(source.room), { objId: source.id, type: RESOURCE_ENERGY });
	        // If existing items do not exist, create a new one
	        // If existing items do exist, search for the one that isnt assigned
	        // (meaning that it kinda represents this source) and change datt
	        const sourceShiny = new _Shiny2.default(source);
	        const needed = _.sum(existingItems, 'amount');
	        let availableEnergy = sourceShiny.goods(RESOURCE_ENERGY) - needed;

	        const onNewItem = () => {
	          if (availableEnergy > 0) {
	            this.newItem({ amount: availableEnergy, provider: source }, data => this._prioForShiny(sourceShiny, data.amount));
	          }
	        };
	        const onEditItem = existingItem => {
	          existingItem['amount'] += availableEnergy;
	          if (existingItem.amount < 0) {
	            _hiveMind2.default.remove(existingItem.id);
	          } else {
	            this.queue.updatePrioById(existingItem.id, this._prioForShiny(new _Shiny2.default(Game.getObjectById(existingItem.objId)), existingItem.amount));
	          }
	        };
	        // Take negative availableEnergy into account and change the
	        // existingItem based on that if necessary
	        this.editMetaItemOrNewItem(onNewItem, onEditItem, existingItems);
	      }
	    }
	  }

	  _prioForShiny(shiny, amount) {
	    let prio = _constants2.default.PRIORITIES[_constants2.default.ACTIVE_PROVIDING][shiny.type()] - Math.floor(amount * _constants2.default.PROVIDING_AMOUNT_MODIFIER);
	    if (this.room.name != shiny.obj.room.name) {
	      prio += _constants2.default.REMOTE_PRIORITY_PROVIDING_MODIFIER;
	    }
	    return prio;
	  }

	}

	_screepsProfiler2.default.registerObject(ActiveProviding, 'ActiveProviding');
	module.exports = ActiveProviding;

/***/ },
/* 26 */
/***/ function(module, exports) {

	'use strict';

	/**
	 * A shiny thing
	 * Abstracts away working with Structures, resources etc
	 */
	class Shiny {

	  constructor(object) {
	    this.obj = object;
	  }

	  /**
	   * Returns the amount of resources the shiny thing has.
	   * Defaults to RESOURCE_ENERGY if resourceType is not given
	   */
	  goods() {
	    let resourceType = arguments.length <= 0 || arguments[0] === undefined ? null : arguments[0];

	    // Resources
	    if ((resourceType === null || resourceType === this.obj.resourceType) && this.obj instanceof Resource) {
	      return this.obj.amount;
	    }
	    // Labs
	    else if (this.obj instanceof StructureLab) {
	        if (resourceType === RESOURCE_ENERGY) {
	          return this.obj.energy;
	        } else {
	          if (this.obj.mineralType === resourceType) {
	            return this.obj.mineralAmount;
	          } else {
	            return 0;
	          }
	        }
	      }
	      // Creeps
	      else if (this.obj.carry) {
	          return _.get(this.obj, ['carry', resourceType]) || 0;
	        }
	        // Nuker
	        else if (this.obj instanceof StructureNuker) {
	            if (resourceType === null || resourceType === RESOURCE_ENERGY) {
	              return this.obj.energy;
	            } else if (resourceType === RESOURCE_GHODIUM) {
	              return this.obj.ghodium;
	            } else {
	              return 0;
	            }
	          }
	          // Sources, Links, Spawns, Towers
	          else if ((resourceType === null || resourceType === RESOURCE_ENERGY) && !_.isUndefined(this.obj.energy)) {
	              return this.obj.energy;
	            }
	            // Minerals
	            else if (!_.isUndefined(this.obj.mineralAmount)) {
	                if (this.obj.mineralType === resourceType) {
	                  return this.obj.mineralAmount;
	                } else {
	                  return 0;
	                }
	              }
	              // Containers, Storages, Terminals
	              else {
	                  return _.get(this.obj, ['store', resourceType]) || 0;
	                }
	  }

	  /**
	   * Returns all the goods of the shiny
	   * Its format is the same as the store-var of some of the structures;
	   * {<resourceType>: <resourceAmount>}
	   */
	  allGoods() {
	    // Resources
	    if (this.obj instanceof Resource) {
	      return { [this.obj.resourceType]: this.obj.amount };
	    }
	    // Labs
	    else if (this.obj instanceof StructureLab) {
	        return { [this.obj.mineralType]: resource, [RESOURCE_ENERGY]: this.obj.energy };
	      }
	      // Creeps
	      else if (this.obj.carry) {
	          return this.obj.carry;
	        }
	        // Nuker
	        else if (this.obj instanceof StructureNuker) {
	            return { [RESOURCE_GHODIUM]: this.obj.ghodium, [RESOURCE_ENERGY]: this.obj.energy };
	          }
	          // Sources, Links, Spawns, Towers
	          else if (!_.isUndefined(this.obj.energy)) {
	              return { [RESOURCE_ENERGY]: this.obj.energy };
	            }
	            // Minerals
	            else if (!_.isUndefined(this.obj.mineralAmount)) {
	                return { [this.obj.mineralType]: this.obj.mineralAmount };
	              }
	              // Containers, Storages, Terminals
	              else {
	                  return this.obj.store;
	                }
	  }

	  neededGoods() {
	    let localResourceType = arguments.length <= 0 || arguments[0] === undefined ? null : arguments[0];

	    // Labs
	    if (this.obj instanceof StructureLab) {
	      const type = this.obj.mineralType ? this.obj.mineralType : localResourceType;
	      return {
	        [type]: this.obj.mineralCapacity - this.obj.mineralAmount,
	        [RESOURCE_ENERGY]: this.obj.energyCapacity - this.obj.energy
	      };
	    }
	    // Nuker
	    else if (this.obj instanceof StructureNuker) {
	        return {
	          [RESOURCE_GHODIUM]: this.obj.ghodiumCapacity - this.obj.ghodium,
	          [RESOURCE_ENERGY]: this.obj.energyCapacity - this.obj.energy
	        };
	      } else if (this.obj instanceof ConstructionSite) {
	        return {
	          [RESOURCE_ENERGY]: this.obj.progressTotal - this.obj.progress
	        };
	      } else if (this.obj instanceof StructureController) {
	        return {
	          [RESOURCE_ENERGY]: this.obj.progressTotal - this.obj.progress
	        };
	      }
	      // Sources, Links, Spawns, Towers, Extensions
	      else if (!_.isUndefined(this.obj.energy)) {
	          return {
	            [RESOURCE_ENERGY]: this.obj.energyCapacity - this.obj.energy
	          };
	        } else {
	          log.orange(`   == Dunno what to do with ${ this.obj }`);
	        }
	  }

	  type() {
	    if (this.obj.structureType) {
	      return this.obj.structureType;
	    } else if (this.obj instanceof Resource) {
	      return $.OBJ_RESOURCE;
	    } else if (this.obj instanceof Creep) {
	      return $.OBJ_CREEP;
	    } else if (this.obj instanceof Mineral) {
	      return $.OBJ_MINERAL;
	    } else if (this.obj instanceof ConstructionSite) {
	      return $.OBJ_CONSTRUCTION_SITE;
	    } else if (this.obj instanceof Flag) {
	      return $.OBJ_FLAG;
	    } else if (this.obj instanceof Map) {
	      return $.OBJ_MAP;
	    } else if (this.obj instanceof Market) {
	      return $.OBJ_MARKET;
	    } else if (this.obj instanceof Nuke) {
	      return $.OBJ_NUKE;
	    } else if (this.obj instanceof Room) {
	      return $.OBJ_ROOM;
	    } else if (this.obj instanceof Source) {
	      return $.OBJ_SOURCE;
	    } else if (this.obj instanceof Structure) {
	      return $.OBJ_STRUCTURE;
	    } else if (this.obj instanceof RoomObject) {
	      return $.OBJ_ROOM_OBJECT;
	    } else if (this.obj instanceof Position) {
	      return $.OBJ_POSITION;
	    }
	  }
	}

	module.exports = Shiny;

/***/ },
/* 27 */
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


/***/ },
/* 28 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _constants = __webpack_require__(5);

	var _constants2 = _interopRequireDefault(_constants);

	var _Queueing = __webpack_require__(18);

	var _Queueing2 = _interopRequireDefault(_Queueing);

	var _hiveMind = __webpack_require__(3);

	var _hiveMind2 = _interopRequireDefault(_hiveMind);

	var _Shiny = __webpack_require__(26);

	var _Shiny2 = _interopRequireDefault(_Shiny);

	var _screepsProfiler = __webpack_require__(27);

	var _screepsProfiler2 = _interopRequireDefault(_screepsProfiler);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	/**
	 * Requesters
	 */
	class Requesting extends _Queueing2.default {

	  constructor(room) {
	    let queue = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];

	    // TODO Handles two queues at the same time.
	    // Maybe really should be splitted up.
	    const queues = {
	      [_constants2.default.WORK_REQUESTING]: room.queue(_constants2.default.WORK_REQUESTING),
	      [_constants2.default.RESOURCE_REQUESTING]: room.queue(_constants2.default.RESOURCE_REQUESTING)
	    };
	    if (queue) {
	      queue = queues[queue];
	    }
	    super(room, queue);
	    this.queues = queues;
	  }

	  /**
	   * Generates a new Requesting-item.
	   */
	  newItem(data, prio) {
	    let opts = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

	    let type = data.type;
	    let amount = data.amount;
	    if (!type) {
	      const resource = this._calcResourceOf(data.requester);
	      type = resource.type;
	      amount = resource.amount;
	    }
	    if (!amount) {
	      amount = this._calcNeededAmountOf(data.requester, type);
	    }
	    const hiveMindData = {
	      roomName: data.roomName || _.get(data.requester, ['pos', 'roomName']),
	      objId: data.id || _.get(data.requester, ['id']) || undefined,
	      x: data.x || _.get(data.requester, ['pos', 'x']) || undefined,
	      y: data.y || _.get(data.requester, ['pos', 'y']) || undefined,
	      type: type,
	      amount: amount,
	      assigned: false
	    };
	    const queue = data.queueType || this._calcQueueTypeOf(data.requester);
	    return super.newItem(hiveMindData, prio, this.queues[queue]);
	  }

	  _calcResourceOf(requester) {
	    let needs = new _Shiny2.default(requester).neededGoods();
	    _.each(needs, (amount, name) => {
	      if (amount === 0) {
	        delete needs[name];
	      }
	    });
	    const neededResourceTypes = Object.keys(needs);
	    if (!neededResourceTypes.length) {
	      return false;
	    } else if (neededResourceTypes.length === 1) {
	      // If one resource is found, type is obvious
	      const type = neededResourceTypes[0];
	      return { type: type, amount: needs[type] };
	    } else if (neededResourceTypes.indexOf(RESOURCE_ENERGY) !== -1) {
	      // Default to Energy if more than one resource found
	      return { type: RESOURCE_ENERGY, amount: needs[RESOURCE_ENERGY] };
	    } else {
	      // Else basically give up and return at least something
	      log.orange(`Requesting#calcTypeOf just returned ${ neededResourceTypes[0] } ` + `for ${ provider }`);
	      const type = neededResourceTypes[0];
	      return { type: type, amount: needs[type] };
	    }
	  }

	  _calcQueueTypeOf(requester) {
	    const type = new _Shiny2.default(requester).type();
	    if (type === _constants2.default.OBJ_CONSTRUCTION_SITE || type === STRUCTURE_CONTROLLER) {
	      return _constants2.default.WORK_REQUESTING;
	    } else {
	      return _constants2.default.RESOURCE_REQUESTING;
	    }
	  }

	  itemGenerator() {
	    if (this.room.name != 'E48N44') {
	      return;
	    }
	    // Get targets
	    const rooms = this.room.accessibleControllingRooms();
	    let targets = this.room.find(FIND_MY_STRUCTURES, { filter: structure => (structure.structureType == STRUCTURE_SPAWN || structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_TOWER) && structure.energy < structure.energyCapacity });
	    const sourceLinks = _.get(this.room.memory, ['links', 'sources']);
	    if (sourceLinks && sourceLinks.length > 0) {
	      targets = targets.concat(sourceLinks.map(source => Game.getObjectById(source)));
	    }
	    rooms.forEach(room => {
	      targets = targets.concat(this.room.find(FIND_CONSTRUCTION_SITES));
	      targets = targets.concat(this.room.find(FIND_STRUCTURES, { filter: { structureType: STRUCTURE_CONTROLLER } }));
	    });
	    // Generate Items
	    if (targets.length > 0) {
	      for (let target of targets) {
	        if (!target) {
	          log.red('NOPE');
	        }
	        const existingItems = _.filter(_hiveMind2.default.allForRoom(target.room), { objId: target.id, type: RESOURCE_ENERGY });
	        const targetShiny = new _Shiny2.default(target);
	        const alreadyRequested = _.sum(existingItems, 'amount');
	        const stillNeededEnergy = _.get(targetShiny.neededGoods(), RESOURCE_ENERGY) - alreadyRequested;

	        if (stillNeededEnergy === 0) {
	          continue;
	        }
	        const queueType = this._calcQueueTypeOf(target);
	        // log.cyan(`    > Needed Goods: ${JSON.stringify(targetShiny.neededGoods())}`)
	        log.cyan(`    > Requested: ${ alreadyRequested }`);
	        // log.cyan(`    > Energy needed: ${stillNeededEnergy}`)

	        const onNewItem = () => {
	          if (stillNeededEnergy > 0) {
	            log.orange(`    > Creating new item`);
	            this.newItem({
	              amount: stillNeededEnergy,
	              requester: target,
	              queueType: queueType
	            }, data => this._prioForShiny(targetShiny, data.amount));
	          }
	        };
	        const onEditItem = existingItem => {
	          log.orange(`    > Editing item ${ existingItem.id }`);
	          existingItem['amount'] += stillNeededEnergy;
	          if (existingItem.amount < 0) {
	            _hiveMind2.default.remove(existingItem.id);
	          } else {
	            this.queues[queueType].updatePrioById(existingItem.id, this._prioForShiny(new _Shiny2.default(Game.getObjectById(existingItem.objId)), existingItem.amount));
	          }
	        };

	        this.editMetaItemOrNewItem(onNewItem, onEditItem, existingItems);
	      }
	    }
	  }

	  _prioForShiny(shiny, amount) {
	    const type = shiny.type();
	    let prio = 0;
	    if (type === _constants2.default.OBJ_CONSTRUCTION_SITE) {
	      prio = _constants2.default.PRIORITIES[_constants2.default.WORK_REQUESTING][type];
	      if (this.room.name != shiny.obj.room.name) {
	        prio += _constants2.default.REMOTE_PRIORITY_CONSTRUCTION_MODIFIER;
	      }
	    } else if (type === _constants2.default.STRUCTURE_CONTROLLER) {
	      prio = _constants2.default.PRIORITIES[_constants2.default.WORK_REQUESTING][type];
	    } else {
	      prio = _constants2.default.PRIORITIES[_constants2.default.RESOURCE_REQUESTING][type];
	    }
	    return prio;
	  }

	}

	_screepsProfiler2.default.registerObject(Requesting, 'Requesting');
	module.exports = Requesting;

/***/ },
/* 29 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _constants = __webpack_require__(5);

	var _constants2 = _interopRequireDefault(_constants);

	var _PriorityQueue = __webpack_require__(4);

	var _PriorityQueue2 = _interopRequireDefault(_PriorityQueue);

	var _hiveMind = __webpack_require__(3);

	var _hiveMind2 = _interopRequireDefault(_hiveMind);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	/**
	 * Inter-room control
	 */
	class Overseer {
	  constructor() {
	    var _this = this;

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
	          if (room.memory.priorityQueues && Object.keys(room.memory.priorityQueues).length && Object.keys(room.memory.priorityQueues).some(queueName => room.memory.priorityQueues[queueName].some(queueItem => {
	            const queueItemData = _hiveMind2.default.data[queueItem.id];
	            return (queueItem.id == item.id || queueName === _constants2.default.SPAWN && _.get(queueItemData, ['memory', 'item', 'id']) === item.id) &&
	            // referred items still exist
	            // If id is set and we can see the room, we can check if the item
	            // still exists
	            (
	            // not able to check if item exist because we dont know the
	            // room or the id
	            !_.get(queueItemData, ['fromSource', 'id']) || !Game.rooms[_.get(queueItemData, ['fromSource', 'roomName'])] || Game.getObjectById(queueItemData.fromSource.id)) && (!_.get(queueItemData, ['toTarget', 'id']) || !Game.rooms[_.get(queueItemData, ['toTarget', 'roomName'])] || Game.getObjectById(queueItemData.toTarget.id));
	          }))) {
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
	        delete _hiveMind2.default.data[itemId];
	        oldItemCount += 1;
	      }

	      for (let roomName in Game.rooms) {
	        let room = Game.rooms[roomName];
	        if (!room.memory.priorityQueues) {
	          continue;
	        }
	        for (let queueName in room.memory.priorityQueues) {
	          let queueData = room.memory.priorityQueues[queueName];
	          for (let queueItem of queueData) {
	            if (!_hiveMind2.default.data[queueItem.id]) {
	              console.log("<span style='color: #ddaa33'>Item missing:</span>\n    ", JSON.stringify(queueItem));
	              new _PriorityQueue2.default(queueData).removeBy({ id: queueItem.id });
	            }
	          }
	        }
	      }

	      Memory.stats['hiveMind.oldItemCount'] = oldItemCount;
	    };

	    this.maintainRoomMemory = () => {
	      // Only main rooms
	      let rooms = this.myMainRooms();
	      for (let room of rooms) {
	        let mem = room.memory;
	        if (!mem.priorityQueues) {
	          mem.priorityQueues = {};
	        }
	        for (let prioType of _constants2.default.PRIO_QUEUES) {
	          if (!mem.priorityQueues[prioType]) {
	            mem.priorityQueues[prioType] = [];
	          }
	        }
	        if (!mem.targetZergCount) {
	          mem.targetZergCount = {};
	        }
	        for (let kind of _constants2.default.ZERG_KINDS) {
	          if (!mem.targetZergCount[kind]) {
	            mem.targetZergCount[kind] = _constants2.default.ROOM_DEFAULT_TARGET_ZERG_COUNT[kind];
	          }
	        }
	        if (!mem.connectedRemoteRooms) {
	          mem.connectedRemoteRooms = {};
	        }
	        if (!mem.links) {
	          mem.links = { sources: [], providers: [] };
	        }
	      }

	      //For all rooms
	      for (let roomName in Game.rooms) {
	        let room = Game.rooms[roomName];
	        let mem = room.memory;
	        if (!mem.specialState) {
	          mem.specialState = {
	            [_constants2.default.UNDER_ATTACK]: false
	          };
	        }
	      }
	    };

	    this.generateRemoteRoom = function (remoteRoomName) {
	      let targetRoomName = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];

	      if (targetRoomName === null) {
	        let generalRemotePos = new RoomPosition(_constants2.default.ROOM_CENTER_X, _constants2.default.ROOM_CENTER_Y, remoteRoomName);
	        let candidates = _this.myMainRooms();
	        throw new Error('NOT IMPLEMENTED YET');
	      } else {
	        let targetRoom = Game.rooms[targetRoomName];
	        if (!targetRoom) {
	          throw new Error('targetRoom?');
	        }
	        if (!targetRoom.memory.connectedRemoteRooms[remoteRoomName]) {
	          targetRoom.memory.connectedRemoteRooms[remoteRoomName] = {
	            active: true,
	            parsed: false
	          };
	        }
	        return true;
	      }
	    };

	    this.myMainRooms = () => {
	      return _.uniq(_.map(Game.spawns, spawn => spawn.room));
	    };
	  }

	  /**
	   * Integrity check of the data
	   */
	  check() {
	    this.removeOldHiveMindItems();
	    this.maintainRoomMemory();
	  }

	  /**
	   * Parse simple user-commands into more complex things
	   */
	  parseCommands() {
	    //Parse flags into memory
	    for (let flagName in Game.flags) {
	      let flag = Game.flags[flagName];
	      if (flag.color == _constants2.default.FLAG_IDENTIFIERS.remoteRoom.color && flag.secondaryColor == _constants2.default.FLAG_IDENTIFIERS.remoteRoom.secondaryColor) {
	        let targetRoomName = null;
	        if (this.myMainRooms().map(r => r.name).indexOf(flag.name) !== -1) {
	          targetRoomName = flag.name;
	        }
	        if (this.generateRemoteRoom(flag.pos.roomName, targetRoomName)) {
	          flag.remove();
	        }
	      }
	    }
	  }

	  /**
	   * Rooms with spawns in them
	   */
	}

	module.exports = Overseer;

/***/ },
/* 30 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _constants = __webpack_require__(5);

	var _constants2 = _interopRequireDefault(_constants);

	var _hiveMind = __webpack_require__(3);

	var _hiveMind2 = _interopRequireDefault(_hiveMind);

	var _Overlord = __webpack_require__(24);

	var _Overlord2 = _interopRequireDefault(_Overlord);

	var _screepsProfiler = __webpack_require__(27);

	var _screepsProfiler2 = _interopRequireDefault(_screepsProfiler);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	const role = __webpack_require__(9);

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
	 *   myRoomName = The room the zergling is supposed to be in
	 */

	class Zergling {

	  constructor(zergling) {
	    var _this = this;

	    this.run = function (priorityQueues) {
	      let opts = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];


	      try {
	        if (_this.zergling.ticksToLive == 1) {
	          _this.zergling.say('For the ☣');
	        }
	        if (opts[_constants2.default.UNDER_ATTACK]) {
	          if (_this.flee()) {
	            _this.zergling.say('Nope');
	            return;
	          }
	        }

	        _this.priorityQueues = priorityQueues;
	        if (!_this.mem.item) {
	          if (_this.mem.myRoomName && _this.zergling.pos.roomName != _this.mem.myRoomName) {
	            _this.zergling.moveTo(Game.rooms[_this.mem.myRoomName].controller);
	            return;
	          }
	          if (!_this.mem.kind) {
	            _this.zergling.say('calcKind');
	            _this.calcKind();
	          }
	          if (!_this.mem.myRoomName) {
	            _this.mem.myRoomName = _this.zergling.pos.roomName;
	          }
	          if (_this.findWork(priorityQueues)) {
	            _this.work();
	          } else {
	            _this.vacation();
	          }
	        } else if (_this.mem.sourcing === null || _.isUndefined(_this.mem.sourcing)) {
	          // Zerg has item, but hasnt found a source for it yet
	          if (_this.initWorkStart()) {
	            _this.work();
	          } else {
	            _this.vacation();
	          }
	        } else {
	          _this.work();
	        }
	        if (!_this.hasWorked && _this.mem.kind[0] == WORK) {
	          _this.repairSurroundings();
	        }
	      } catch (e) {
	        console.log('<span style="color: red">Creep Error`d:\n' + e.stack + '\n');
	        if (_this.mem.item && !_hiveMind2.default.data[_this.mem.item.id]) {
	          log.cyan('Cleaning up missing hiveMind-Data');
	          _this.mem.item = null;
	          _this.mem.sourcing = null;
	        }
	      } finally {
	        if (_this.zergling.tickstoLive == 2) {
	          _this.zergling.say('For the ☣');
	        }
	        if (_this.zergling.ticksToLive == 1) {
	          _this.swarmPurposeFulfilled();
	        }
	      }
	    };

	    this.calcKind = () => {
	      if (_.isEqual(this.zergling.body, [MOVE])) {
	        this.mem.kind = [_constants2.default.SCOUT];
	        return;
	      }
	      let parts = [];
	      for (let type of [WORK, CARRY]) {
	        parts.push({ type: type, count: _.reduce(this.zergling.body, (sum, b) => b.type == type ? sum + 1 : sum, 0) });
	      }
	      // Transporters should always have a WORK for on-the-fly repairs
	      let workPartIndex = _.findIndex(parts, 'type', WORK);
	      parts[workPartIndex].count = (parts[workPartIndex].count - 1) * 2;
	      parts = _.sortByOrder(parts, 'count', 'desc');

	      this.mem.kind = [];
	      parts.forEach(part => {
	        if (part.count > 0) {
	          this.mem.kind.push(part.type);
	        }
	      });
	    };

	    this.findWork = priorityQueues => {

	      let queues = [];
	      if (Array.isArray(this.mem.kind)) {
	        // Old Style (kind contains the queuenames)
	        queues = this.mem.kind;
	      } else {
	        // New Style (kind contains the kind)
	        queues = _constants2.default.QUEUES_FOR_KINDS[this.mem.kind];
	      }
	      for (let queueName of queues) {
	        let queue = priorityQueues[queueName];
	        if (!queue) {
	          //newstyle
	          queue = priorityQueues[_constants2.default.QUEUES_FOR_KINDS[this.mem.kind]];
	        }
	        if (queue) {
	          if (queue.peek()) {
	            this.mem.item = queue.dequeue();
	            let itemData = _hiveMind2.default.data[this.mem.item.id];
	            itemData.assigned = true;
	            if (itemData.fromSource && !itemData.fromSource.amount) {
	              itemData.fromSource.amount = this.zergling.carryCapacity;
	            }
	            return this.initWorkStart();
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

	    this.initWorkStart = () => {
	      if (_.isUndefined(_hiveMind2.default.data[this.mem.item.id].fromSource) && this.mem.kind !== _constants2.default.KIND_CORRUPTOR) {
	        // fromSource does not exist
	        let item = _hiveMind2.default.data[this.mem.item.id];
	        if (_.isUndefined(_.get(item, ['toTarget', 'amount']))) {
	          this.done(MY_ERR_WTF, 'initWorkStart#amount');return;
	        }
	        if (this.zergling.carry[item.res] >= item.toTarget.amount) {
	          // We have enough energy left for the target, dont need no source
	          this.zergling.say('♻➟▣', true);
	          _hiveMind2.default.data[this.mem.item.id].stage = TYPE_TARGET;
	          this.mem.sourcing = false;
	          return true;
	        } else {
	          // search for a source
	          let source = new _Overlord2.default(this.zergling.pos.roomName).findSourceForCreep(this.zergling, _hiveMind2.default.data[this.mem.item.id], item.res);
	          if (source === true) {
	            // Thanks, Overlord. You already assigned me the source
	          } else if (source) {
	            _hiveMind2.default.data[this.mem.item.id].fromSource = {
	              id: source.id, x: source.pos.x, y: source.pos.y,
	              roomName: source.pos.roomName,
	              amount: this.creepCarryCapacity
	            };
	            this.zergling.say('⚗', true);
	            _hiveMind2.default.data[this.mem.item.id].stage = TYPE_SOURCE;
	            this.mem.sourcing = true;
	            return true;
	          } else {
	            this.zergling.say('⚗?', true);
	            this.mem.sourcing = null;
	            return false;
	          }
	        }
	      } else if (_hiveMind2.default.data[this.mem.item.id].fromSource === false) {
	        // Theres explicitly no source, for example with continuous tasks
	        this.zergling.say('▣ (✖⚗)', true);
	        _hiveMind2.default.data[this.mem.item.id].stage = TYPE_TARGET;
	        this.mem.sourcing = false;
	        return true;
	      } else {
	        _hiveMind2.default.data[this.mem.item.id].stage = TYPE_SOURCE;
	        this.mem.sourcing = true;
	        return true;
	      }
	    };

	    this.work = () => {
	      if (this.mem.sourcing) {
	        this.workWith(TYPE_SOURCE);
	      } else {
	        this.workWith(TYPE_TARGET);
	      }
	    };

	    this.workWith = type => {
	      let memObject = false;
	      const itemData = _hiveMind2.default.data[this.mem.item.id];
	      switch (type) {
	        case TYPE_SOURCE:
	          memObject = itemData.fromSource;
	          break;
	        case TYPE_TARGET:
	          memObject = itemData.toTarget;break;
	      }
	      if (!memObject) {
	        this.done(MY_ERR_WTF, 'workWith#memObject');return;
	      }
	      if (!memObject.id && !memObject.objId) {
	        this.done(MY_ERR_WTF, 'No memObject.id/objId; Not guessing.');return;
	      }
	      let object = Game.getObjectById(memObject.objId || memObject.id);
	      if (!object && !_.isUndefined(Game.rooms[memObject.roomName])) {
	        // Object doesnt exist but we can see the room. Nope
	        this.done(MY_ERR_WTF, 'workWith#object');
	        return;
	      }
	      let range = this.calcActionRange(type, object, itemData);
	      if (object) {
	        if (this.zergling.pos.inRangeTo(object, range)) {
	          switch (type) {
	            case TYPE_SOURCE:
	              this.withdrawFrom(object);break;
	            case TYPE_TARGET:
	              if (itemData.workType === _constants2.default.SEED) {
	                this.seedTo(object);
	              } else {
	                this.transferTo(object);
	              }
	              break;
	          }
	        } else {
	          if (object.structureType == STRUCTURE_CONTROLLER) {
	            let altFlags = _.filter(Game.flags, flag => flag.name == 'altCon' && flag.pos.roomName == this.zergling.room.name);
	            if (altFlags.length) {
	              this.zergling.moveTo(altFlags[0]);
	              return;
	            }
	          }
	          this.zergling.moveTo(object);
	        }
	      } else {
	        // Source can be missing because of two things: Either our Memory is
	        // corrupt, or the source is in a room we cannot currently see
	        this.zergling.moveTo(new RoomPosition(memObject.x, memObject.y, memObject.roomName));
	      }
	    };

	    this.withdrawFrom = source => {
	      let data = _hiveMind2.default.data[this.mem.item.id];
	      let type = data.type || RESOURCE_ENERGY;
	      // 0 amount == all you can
	      let amount = data.fromSource.amount ? data.fromSource.amount : null;
	      if (amount >= this.zergling.carryCapacity) {
	        amount = 0; // Withdraw all you can
	      }
	      let res;
	      if (source instanceof Resource) {
	        res = this.zergling.pickup(source);
	        this.hasWorked = true;
	        if (_.sum(this.zergling.carry) == this.zergling.carryCapacity) {
	          this.done();
	        }
	      } else if ((source.energy || source.mineralAmount) && source.cooldown === undefined) {
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
	      let data = _hiveMind2.default.data[this.mem.item.id];
	      let type = data.type || RESOURCE_ENERGY;
	      // 0 amount == all you can
	      let amount = data.toTarget.amount ? data.toTarget.amount : null;
	      let res;
	      if (this.zergling.carry[RESOURCE_ENERGY] == 0) {
	        this.done();
	      } else if (target instanceof ConstructionSite) {
	        res = this.zergling.build(target);
	        this.hasWorked = true;
	        if (this.zergling.carry[RESOURCE_ENERGY] == 0
	        // TODO: need to check if the target is done building in this tick
	        ) {
	            this.done();
	          }
	      } else if (target.structureType == STRUCTURE_CONTROLLER) {
	        res = this.zergling.upgradeController(target);
	        this.hasWorked = true;
	        // TODO carry - the upgradeController-energy for this tick
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

	    this.seedTo = object => {
	      let data = _hiveMind2.default.data[this.mem.item.id];
	      let type = data.type;
	      switch (type) {
	        case _constants2.default.RESERVE:
	          this.zergling.reserveController(object);break;
	        case _constants2.default.CLAIM:
	          this.zergling.claimController(object);break;
	        case _constants2.default.DOWNGRADE:
	          this.zergling.attackController(object);break;
	      }
	    };

	    this.done = function (res) {
	      let debugInfo = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];

	      let itemData = _hiveMind2.default.data[_.get(_this.mem, ['item', 'id'])];
	      if (_this.mem.sourcing) {
	        // Done SOURCING Stuff
	        if (_.get(itemData, 'continuous') && !_this.mem.toTarget) {
	          _this.zergling.say('↺⚗', true);
	          return; // We just source stuff, continue to do so
	        } else {
	          _hiveMind2.default.data[_this.mem.item.id].stage = TYPE_TARGET;
	          _this.mem.sourcing = false;
	          if (res == OK) {
	            _this.zergling.say('▣', true);
	          } else {
	            _this.handleActionResult(res, null, null, debugInfo);
	          }
	        }
	      } else {
	        // Done TARGETIING Stuff
	        if (_.get(itemData, 'continuous')) {
	          if (!_this.mem.fromSource) {
	            _this.zergling.say('↺▣', true);
	            return; // We just target stuff, continue to do so
	          } else {
	            _hiveMind2.default.data[_this.mem.item.id].stage = TYPE_SOURCE;
	            _this.mem.sourcing = true;
	            _this.zergling.say('↺ ➟ ⚗', true);
	            return;
	          }
	        } else {
	          _hiveMind2.default.remove(_this.mem.item.id);
	          _this.mem.sourcing = null;
	          _this.mem.item = null;
	          if (res == OK) {
	            _this.zergling.say('✓', true);
	          } else {
	            _this.handleActionResult(res, null, null, debugInfo);
	          }
	        }
	      }
	    };

	    this.calcActionRange = (type, object, itemData) => {
	      if (itemData.workType === _constants2.default.SEED) {
	        return 1;
	      }
	      switch (type) {
	        case TYPE_SOURCE:
	          return 1;break;
	        case TYPE_TARGET:
	          return object.structureType == STRUCTURE_CONTROLLER || object instanceof ConstructionSite ? 3 : 1;break;
	      }
	    };

	    this.newCalcActionRange = (object, item) => {
	      if (item.workType === _constants2.default.SEED) {
	        return 1;
	      }
	      if (object.structureType == STRUCTURE_CONTROLLER || object instanceof ConstructionSite) {
	        return 3;
	      } else {
	        return 1;
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
	          console.log('<span style="color: red">Got a WTF!</span>', `<span style="color: #aadd33">Id</span>: "${ _this.zergling.id }"`, `<span style="color: #33aadd">Pos</span>: ` + `"${ JSON.stringify(_this.zergling.pos) }"`, `<span style="color: #ddaa33">Mem</span>: "` + `${ JSON.stringify(_this.mem) }"`, `<span style="color: #aa33dd">More Info</span>: "` + `${ JSON.stringify(debugInfo) }"`);
	          _this.zergling.say('WTF?', true);
	          break;
	        // case ERR_NOT_ENOUGH_EXTENSIONS: this.zergling.say('', true); break
	        case ERR_RCL_NOT_ENOUGH:
	          _this.zergling.say('<!', true);break;
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
	        this.mem.item = item;
	        this.initWorkStart();
	        return false;
	      } else {
	        return true;
	      }
	    };

	    this.vacation = () => {
	      let statName = `room.${ this.zergling.room.name }.zergStats.` + `${ this.mem.kind[0] }.idleTicks`;
	      if (!Memory.stats[statName]) {
	        Memory.stats[statName] = 0;
	      }
	      Memory.stats[statName] += 1;
	      let hangar = this.zergling.room.find(FIND_MY_STRUCTURES, { filter: { structureType: STRUCTURE_SPAWN } })[0];
	      if (hangar && !this.zergling.pos.inRangeTo(hangar, 2)) {
	        this.zergling.moveTo(hangar);
	      }
	    };

	    this.flee = () => {
	      if (this.mem.myRoomName != this.zergling.room.name) {
	        log.orange(`Fleeing! ${ JSON.stringify(this.mem.kind) }`);
	        // Somewhere remote
	        if (Array.isArray(this.mem.kind) && this.mem.kind.indexOf('carry') !== -1) {
	          this.zergling.moveTo(Game.rooms[this.mem.myRoomName].safeArea());
	          return true;
	        }
	        switch (this.mem.kind) {
	          case _constants2.default.KIND_INFESTOR:
	          case _constants2.default.KIND_CORRUPTOR:
	          case _constants2.default.KIND_ZERGLING:
	          case _constants2.default.KIND_DRONE:
	            this.zergling.moveTo(Game.rooms[this.mem.myRoomName].safeArea());
	            return true;
	            break;
	          default:
	            break;
	        }
	        return false;
	      } else {
	        return false;
	      }
	    };

	    this.swarmPurposeFulfilled = () => {
	      if (this.mem.item) {
	        _hiveMind2.default.remove(this.mem.item.id);
	        this.mem.sourcing = null;
	        this.mem.item = null;
	      }
	    };

	    this.zergling = zergling;
	    this.hasWorked = false;
	    this.priorityQueues = null;
	    this.mem = this.zergling.memory;
	    this.kind = this.mem.kind[0];
	  }

	  /**
	   * Handles the memory-state for the new item, so that the creep starts working
	   */


	  /**
	   * Work with controllers
	   */


	  /*
	   * Zergling is idling
	   */


	  /*
	   * Make sure that the hiveMind-Item gets deleted before the zergling dies
	   */


	  newWork() {
	    if (this.mem.items && this.mem.items.length) {
	      let items = this.mem.items;
	      this.workOnItem(items[0]);
	    } else {
	      this.newFindItems();
	    }
	  }

	  workOnItem(item) {
	    data = _hiveMind2.default.data(item.id);
	    let object = Game.getObjectById(itemData.objId);
	    let knowsObject = true;
	    if (!object) {
	      if (_.isUndefined(Game.rooms[itemData.roomName])) {
	        // We cant see object bbut we cant see the room as well
	        /// TODO Implement checking of room with the Observer to help here?
	        object = new RoomPosition(itemData.x, itemData.y, itemData.roomName);
	        knowsObject = false;
	      } else {
	        // Object doesnt exist but we can see the room. Nope
	        this.done(MY_ERR_WTF, 'workOnItem#object: Couldnt find Object by Id');
	        return;
	      }
	    }
	    let range = this.newCalcActionRange(object, itemData);
	    if (knowsObject && this.zergling.pos.inRangeTo(object, range)) {

	      switch (itemData.kind) {
	        case _constants2.default.ACTIVE_PROVIDING:
	          this.withdrawFrom(object);break;
	        case _constants2.default.SEEDING:
	          this.seedTo(object);break;
	        case _constants2.default.WORK_REQUESTING:
	        case _constants2.default.RESOURCE_REQUESTING:
	          this.transferTo(object);
	          break;
	        default:
	          log.orange(`Kind what?! For creep ${ JSON.stringify(this.zergling) }`);
	      }
	    } else {
	      this.zergling.moveTo(object);
	    }
	  }

	  newSearchForItems() {

	    // Current amount of energy
	    // Do we need to refill?
	    // If yes: refill:
	    // Get first item of requester, sorted by range (Zerglings shouldnt refill from remotes)
	    // Get its resource-type
	    // If no, just set the resource-type to the carrying-type
	    // While we have enough energy to fulfill the coming request
	    // resort fitting requester-queue based on range of last added item
	    // Get first item from that queue

	    // refill: How do we know what resource to refill?

	    let position = null;
	    let providedResourceType = RESOURCE_ENERGY;
	    const itemFilter = (item, data) => position.roomName == data.roomName && data.type == providedResourceType //&&
	    // Dont filter by amount since we want to put all of our energy we have
	    // left into stuff.
	    // data.amount <= this.carry[providedResourceType]
	    ;
	    const myQueueType = _constants2.default.NEW_QUEUES_FOR_KINDS[this.mem.kind];

	    const requesting = new Requesting(Game.rooms[this.mem.myRoomName], myQueueType);
	    // First get a target-item to check if we have enough resources carried with
	    // us to satisfy it
	    const prioritizedItem = _.get(requesting.reorderByRangeFrom(this.zergling.pos, { filter: itemFilter }), 0);
	    if (!prioritizedItem) {
	      log.red('No prio item!');return;
	    }

	    const maxGrep = this.zergling.carryCapacity - _.sum(this.zergling.carry);
	    const minGrep = 200;
	    if (prioritizedItem.amount >= this.zergling.carry[providedResourceType]) {
	      // I would in theory need to find the next target to this source to find
	      // out how much energy I want, but thats getting too complicated for now.
	      // Just get as much energy as ye can

	      // Search for source, put it before the targets

	      const providing = new ActiveProviding(Game.rooms[this.mem.myRoomName]);
	      const activeSourceItem = _.get(providing.reorderByRangeFrom(this.zergling.pos, {
	        filter: (item, data) => data.amount >= minGrep
	      }), 0);
	      if (activeSourceItem) {
	        const newItem = providing.generateNewItemFromMetaItem(activeSourceItem, maxGrep);
	        this.mem.items.unshift(newItem);
	      } else {
	        // Search for passive sources
	        /// TODO
	      }
	    } else {
	      // Only put the range-ordered item actually into the items-memory when we
	      // dont have to get more energy from another source since we would be
	      // somewhere else by then, meaning the ranges would have changed
	      this.mem.items.unshift(prioritizedItem);
	    }

	    if (!this.mem.items.length) {
	      // we havent found a suitable target or source, give up
	      return false;
	    }

	    const prioItemPosition = new RoomPosition(prioritizedItem.x, prioritizedItem.y, prioritizedItem.roomName);

	    const queue = requesting.getFirstAccountingRangeFrom(position, { filter: itemFilter });

	    let antiEndlessLoop = 0;
	    while (this._unusedCarryAmountOf(providedResourceType) > 0) {
	      let lastItem = this.mem.items[-1];
	      let position = new RoomPosition(lastItem.x, lastItem.y, lastItem.roomName);
	      let queue = requesting.getFirstAccountingRangeFrom(position, { filter: itemFilter });
	      potentialItem = queue.peek();
	      potentialItemData = _hiveMind2.default.data[potentialItem.id];
	      if (potentialItemData.amount > this._unusedCarryAmountOf(providedResourceType)) {
	        // We cant take over whole task, we have to split from it
	        const newItem = requesting.generateNewItemFromMetaItem(potentialItem, this._unusedCarryAmountOf(providedResourceType));
	        if (newItem) {
	          this.mem.items.push(newItem);
	        }
	      } else {
	        // Take over whole task
	        queue.dequeue();
	        this.mem.items.push(potentialItem);
	      }
	      antiEndlessLoop += 1;
	      if (antiEndlessLoop > 50) {
	        log.red('ANTIENDLESSLOOP TRIGGERED');break;
	      }
	    }
	  }

	  _unusedCarryAmountOf(resource) {
	    return this.carry[resource] - _.sum(_.filter(this.mem.items, item => item.type == resource && item.kind != _constants2.default.ACTIVE_PROVIDING), 'amount');
	  }
	}

	_screepsProfiler2.default.registerObject(Zergling, 'Zergling');
	module.exports = Zergling;

/***/ },
/* 31 */
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
	        if (room.controller) {
	          Memory.stats[`room.${ roomName }.upgrade.progress`] = room.controller.progress;
	          Memory.stats[`room.${ roomName }.upgrade.progressTotal`] = room.controller.progressTotal;
	        }

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
/* 32 */
/***/ function(module, exports, __webpack_require__) {

	// ES2017 w/ Node 5
	__webpack_require__(33);
	__webpack_require__(68);
	__webpack_require__(70);
	__webpack_require__(77);
	__webpack_require__(81);


/***/ },
/* 33 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(34);
	module.exports = __webpack_require__(37).Object.entries;

/***/ },
/* 34 */
/***/ function(module, exports, __webpack_require__) {

	// https://github.com/tc39/proposal-object-values-entries
	var $export  = __webpack_require__(35)
	  , $entries = __webpack_require__(53)(true);

	$export($export.S, 'Object', {
	  entries: function entries(it){
	    return $entries(it);
	  }
	});

/***/ },
/* 35 */
/***/ function(module, exports, __webpack_require__) {

	var global    = __webpack_require__(36)
	  , core      = __webpack_require__(37)
	  , hide      = __webpack_require__(38)
	  , redefine  = __webpack_require__(48)
	  , ctx       = __webpack_require__(51)
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
/* 36 */
/***/ function(module, exports) {

	// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
	var global = module.exports = typeof window != 'undefined' && window.Math == Math
	  ? window : typeof self != 'undefined' && self.Math == Math ? self : Function('return this')();
	if(typeof __g == 'number')__g = global; // eslint-disable-line no-undef

/***/ },
/* 37 */
/***/ function(module, exports) {

	var core = module.exports = {version: '2.4.0'};
	if(typeof __e == 'number')__e = core; // eslint-disable-line no-undef

/***/ },
/* 38 */
/***/ function(module, exports, __webpack_require__) {

	var dP         = __webpack_require__(39)
	  , createDesc = __webpack_require__(47);
	module.exports = __webpack_require__(43) ? function(object, key, value){
	  return dP.f(object, key, createDesc(1, value));
	} : function(object, key, value){
	  object[key] = value;
	  return object;
	};

/***/ },
/* 39 */
/***/ function(module, exports, __webpack_require__) {

	var anObject       = __webpack_require__(40)
	  , IE8_DOM_DEFINE = __webpack_require__(42)
	  , toPrimitive    = __webpack_require__(46)
	  , dP             = Object.defineProperty;

	exports.f = __webpack_require__(43) ? Object.defineProperty : function defineProperty(O, P, Attributes){
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
/* 40 */
/***/ function(module, exports, __webpack_require__) {

	var isObject = __webpack_require__(41);
	module.exports = function(it){
	  if(!isObject(it))throw TypeError(it + ' is not an object!');
	  return it;
	};

/***/ },
/* 41 */
/***/ function(module, exports) {

	module.exports = function(it){
	  return typeof it === 'object' ? it !== null : typeof it === 'function';
	};

/***/ },
/* 42 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = !__webpack_require__(43) && !__webpack_require__(44)(function(){
	  return Object.defineProperty(__webpack_require__(45)('div'), 'a', {get: function(){ return 7; }}).a != 7;
	});

/***/ },
/* 43 */
/***/ function(module, exports, __webpack_require__) {

	// Thank's IE8 for his funny defineProperty
	module.exports = !__webpack_require__(44)(function(){
	  return Object.defineProperty({}, 'a', {get: function(){ return 7; }}).a != 7;
	});

/***/ },
/* 44 */
/***/ function(module, exports) {

	module.exports = function(exec){
	  try {
	    return !!exec();
	  } catch(e){
	    return true;
	  }
	};

/***/ },
/* 45 */
/***/ function(module, exports, __webpack_require__) {

	var isObject = __webpack_require__(41)
	  , document = __webpack_require__(36).document
	  // in old IE typeof document.createElement is 'object'
	  , is = isObject(document) && isObject(document.createElement);
	module.exports = function(it){
	  return is ? document.createElement(it) : {};
	};

/***/ },
/* 46 */
/***/ function(module, exports, __webpack_require__) {

	// 7.1.1 ToPrimitive(input [, PreferredType])
	var isObject = __webpack_require__(41);
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
/* 47 */
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
/* 48 */
/***/ function(module, exports, __webpack_require__) {

	var global    = __webpack_require__(36)
	  , hide      = __webpack_require__(38)
	  , has       = __webpack_require__(49)
	  , SRC       = __webpack_require__(50)('src')
	  , TO_STRING = 'toString'
	  , $toString = Function[TO_STRING]
	  , TPL       = ('' + $toString).split(TO_STRING);

	__webpack_require__(37).inspectSource = function(it){
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
/* 49 */
/***/ function(module, exports) {

	var hasOwnProperty = {}.hasOwnProperty;
	module.exports = function(it, key){
	  return hasOwnProperty.call(it, key);
	};

/***/ },
/* 50 */
/***/ function(module, exports) {

	var id = 0
	  , px = Math.random();
	module.exports = function(key){
	  return 'Symbol('.concat(key === undefined ? '' : key, ')_', (++id + px).toString(36));
	};

/***/ },
/* 51 */
/***/ function(module, exports, __webpack_require__) {

	// optional / simple context binding
	var aFunction = __webpack_require__(52);
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
/* 52 */
/***/ function(module, exports) {

	module.exports = function(it){
	  if(typeof it != 'function')throw TypeError(it + ' is not a function!');
	  return it;
	};

/***/ },
/* 53 */
/***/ function(module, exports, __webpack_require__) {

	var getKeys   = __webpack_require__(54)
	  , toIObject = __webpack_require__(56)
	  , isEnum    = __webpack_require__(67).f;
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
/* 54 */
/***/ function(module, exports, __webpack_require__) {

	// 19.1.2.14 / 15.2.3.14 Object.keys(O)
	var $keys       = __webpack_require__(55)
	  , enumBugKeys = __webpack_require__(66);

	module.exports = Object.keys || function keys(O){
	  return $keys(O, enumBugKeys);
	};

/***/ },
/* 55 */
/***/ function(module, exports, __webpack_require__) {

	var has          = __webpack_require__(49)
	  , toIObject    = __webpack_require__(56)
	  , arrayIndexOf = __webpack_require__(60)(false)
	  , IE_PROTO     = __webpack_require__(64)('IE_PROTO');

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
/* 56 */
/***/ function(module, exports, __webpack_require__) {

	// to indexed object, toObject with fallback for non-array-like ES3 strings
	var IObject = __webpack_require__(57)
	  , defined = __webpack_require__(59);
	module.exports = function(it){
	  return IObject(defined(it));
	};

/***/ },
/* 57 */
/***/ function(module, exports, __webpack_require__) {

	// fallback for non-array-like ES3 and non-enumerable old V8 strings
	var cof = __webpack_require__(58);
	module.exports = Object('z').propertyIsEnumerable(0) ? Object : function(it){
	  return cof(it) == 'String' ? it.split('') : Object(it);
	};

/***/ },
/* 58 */
/***/ function(module, exports) {

	var toString = {}.toString;

	module.exports = function(it){
	  return toString.call(it).slice(8, -1);
	};

/***/ },
/* 59 */
/***/ function(module, exports) {

	// 7.2.1 RequireObjectCoercible(argument)
	module.exports = function(it){
	  if(it == undefined)throw TypeError("Can't call method on  " + it);
	  return it;
	};

/***/ },
/* 60 */
/***/ function(module, exports, __webpack_require__) {

	// false -> Array#indexOf
	// true  -> Array#includes
	var toIObject = __webpack_require__(56)
	  , toLength  = __webpack_require__(61)
	  , toIndex   = __webpack_require__(63);
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
/* 61 */
/***/ function(module, exports, __webpack_require__) {

	// 7.1.15 ToLength
	var toInteger = __webpack_require__(62)
	  , min       = Math.min;
	module.exports = function(it){
	  return it > 0 ? min(toInteger(it), 0x1fffffffffffff) : 0; // pow(2, 53) - 1 == 9007199254740991
	};

/***/ },
/* 62 */
/***/ function(module, exports) {

	// 7.1.4 ToInteger
	var ceil  = Math.ceil
	  , floor = Math.floor;
	module.exports = function(it){
	  return isNaN(it = +it) ? 0 : (it > 0 ? floor : ceil)(it);
	};

/***/ },
/* 63 */
/***/ function(module, exports, __webpack_require__) {

	var toInteger = __webpack_require__(62)
	  , max       = Math.max
	  , min       = Math.min;
	module.exports = function(index, length){
	  index = toInteger(index);
	  return index < 0 ? max(index + length, 0) : min(index, length);
	};

/***/ },
/* 64 */
/***/ function(module, exports, __webpack_require__) {

	var shared = __webpack_require__(65)('keys')
	  , uid    = __webpack_require__(50);
	module.exports = function(key){
	  return shared[key] || (shared[key] = uid(key));
	};

/***/ },
/* 65 */
/***/ function(module, exports, __webpack_require__) {

	var global = __webpack_require__(36)
	  , SHARED = '__core-js_shared__'
	  , store  = global[SHARED] || (global[SHARED] = {});
	module.exports = function(key){
	  return store[key] || (store[key] = {});
	};

/***/ },
/* 66 */
/***/ function(module, exports) {

	// IE 8- don't enum bug keys
	module.exports = (
	  'constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf'
	).split(',');

/***/ },
/* 67 */
/***/ function(module, exports) {

	exports.f = {}.propertyIsEnumerable;

/***/ },
/* 68 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(69);
	module.exports = __webpack_require__(37).Object.values;

/***/ },
/* 69 */
/***/ function(module, exports, __webpack_require__) {

	// https://github.com/tc39/proposal-object-values-entries
	var $export = __webpack_require__(35)
	  , $values = __webpack_require__(53)(false);

	$export($export.S, 'Object', {
	  values: function values(it){
	    return $values(it);
	  }
	});

/***/ },
/* 70 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(71);
	module.exports = __webpack_require__(37).Object.getOwnPropertyDescriptors;

/***/ },
/* 71 */
/***/ function(module, exports, __webpack_require__) {

	// https://github.com/tc39/proposal-object-getownpropertydescriptors
	var $export        = __webpack_require__(35)
	  , ownKeys        = __webpack_require__(72)
	  , toIObject      = __webpack_require__(56)
	  , gOPD           = __webpack_require__(75)
	  , createProperty = __webpack_require__(76);

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
/* 72 */
/***/ function(module, exports, __webpack_require__) {

	// all object keys, includes non-enumerable and symbols
	var gOPN     = __webpack_require__(73)
	  , gOPS     = __webpack_require__(74)
	  , anObject = __webpack_require__(40)
	  , Reflect  = __webpack_require__(36).Reflect;
	module.exports = Reflect && Reflect.ownKeys || function ownKeys(it){
	  var keys       = gOPN.f(anObject(it))
	    , getSymbols = gOPS.f;
	  return getSymbols ? keys.concat(getSymbols(it)) : keys;
	};

/***/ },
/* 73 */
/***/ function(module, exports, __webpack_require__) {

	// 19.1.2.7 / 15.2.3.4 Object.getOwnPropertyNames(O)
	var $keys      = __webpack_require__(55)
	  , hiddenKeys = __webpack_require__(66).concat('length', 'prototype');

	exports.f = Object.getOwnPropertyNames || function getOwnPropertyNames(O){
	  return $keys(O, hiddenKeys);
	};

/***/ },
/* 74 */
/***/ function(module, exports) {

	exports.f = Object.getOwnPropertySymbols;

/***/ },
/* 75 */
/***/ function(module, exports, __webpack_require__) {

	var pIE            = __webpack_require__(67)
	  , createDesc     = __webpack_require__(47)
	  , toIObject      = __webpack_require__(56)
	  , toPrimitive    = __webpack_require__(46)
	  , has            = __webpack_require__(49)
	  , IE8_DOM_DEFINE = __webpack_require__(42)
	  , gOPD           = Object.getOwnPropertyDescriptor;

	exports.f = __webpack_require__(43) ? gOPD : function getOwnPropertyDescriptor(O, P){
	  O = toIObject(O);
	  P = toPrimitive(P, true);
	  if(IE8_DOM_DEFINE)try {
	    return gOPD(O, P);
	  } catch(e){ /* empty */ }
	  if(has(O, P))return createDesc(!pIE.f.call(O, P), O[P]);
	};

/***/ },
/* 76 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var $defineProperty = __webpack_require__(39)
	  , createDesc      = __webpack_require__(47);

	module.exports = function(object, index, value){
	  if(index in object)$defineProperty.f(object, index, createDesc(0, value));
	  else object[index] = value;
	};

/***/ },
/* 77 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(78);
	module.exports = __webpack_require__(37).String.padStart;


/***/ },
/* 78 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	// https://github.com/tc39/proposal-string-pad-start-end
	var $export = __webpack_require__(35)
	  , $pad    = __webpack_require__(79);

	$export($export.P, 'String', {
	  padStart: function padStart(maxLength /*, fillString = ' ' */){
	    return $pad(this, maxLength, arguments.length > 1 ? arguments[1] : undefined, true);
	  }
	});

/***/ },
/* 79 */
/***/ function(module, exports, __webpack_require__) {

	// https://github.com/tc39/proposal-string-pad-start-end
	var toLength = __webpack_require__(61)
	  , repeat   = __webpack_require__(80)
	  , defined  = __webpack_require__(59);

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
/* 80 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var toInteger = __webpack_require__(62)
	  , defined   = __webpack_require__(59);

	module.exports = function repeat(count){
	  var str = String(defined(this))
	    , res = ''
	    , n   = toInteger(count);
	  if(n < 0 || n == Infinity)throw RangeError("Count can't be negative");
	  for(;n > 0; (n >>>= 1) && (str += str))if(n & 1)res += str;
	  return res;
	};

/***/ },
/* 81 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(82);
	module.exports = __webpack_require__(37).String.padEnd;


/***/ },
/* 82 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	// https://github.com/tc39/proposal-string-pad-start-end
	var $export = __webpack_require__(35)
	  , $pad    = __webpack_require__(79);

	$export($export.P, 'String', {
	  padEnd: function padEnd(maxLength /*, fillString = ' ' */){
	    return $pad(this, maxLength, arguments.length > 1 ? arguments[1] : undefined, false);
	  }
	});

/***/ },
/* 83 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _constants = __webpack_require__(5);

	var _constants2 = _interopRequireDefault(_constants);

	var _Queueing = __webpack_require__(18);

	var _Queueing2 = _interopRequireDefault(_Queueing);

	var _Spawning = __webpack_require__(17);

	var _Spawning2 = _interopRequireDefault(_Spawning);

	var _hiveMind = __webpack_require__(3);

	var _hiveMind2 = _interopRequireDefault(_hiveMind);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	/**
	 * Claim, reserve, downgrade Controllers of other rooms
	 */
	class Seeding extends _Queueing2.default {

	  constructor(room) {
	    let queue = arguments.length <= 1 || arguments[1] === undefined ? _constants2.default.SEED : arguments[1];

	    super(room, queue);
	  }

	  /**
	   * Generates a new Seeding-item.
	   * @param data - The data of the item.
	   *    If data.toTarget does not exist, it will be generated by getting the
	   *    data from the given controller.
	   *    If steps do not exist, they will be calculated.
	   * @param prio - The priority of the item in the queue.
	   * @param controller - The target-controller. We need dis.
	   */
	  newItem(data, prio, controller) {
	    // Set toTarget if not defined
	    if (!data.toTarget) {
	      if (!controller) {
	        return ERR_NOT_FOUND;
	      }
	      data.toTarget = {
	        x: controller.pos.x,
	        y: controller.pos.y,
	        id: controller.id,
	        roomName: controller.room.name
	      };
	    }
	    // Calculate the steps
	    let steps = null;
	    if (data.steps) {
	      steps = data.steps;
	    } else {
	      if (!controller) {
	        return ERR_NOT_FOUND;
	      }
	      steps = this.calculateStepsFromSpawnOf(this.room, controller.pos);
	    }
	    // Set the data
	    const hiveMindData = {
	      type: data.type || _constants2.default.RESERVE,
	      workType: _constants2.default.SEED,
	      amount: data.amount || 0, // amount of 0 = all ye can
	      steps: steps,
	      byRoomName: this.room.name,
	      toTarget: {
	        x: _.get(data, ['toTarget', 'x']),
	        y: _.get(data, ['toTarget', 'y']),
	        roomName: _.get(data, ['toTarget', 'roomName']),
	        id: _.get(data, ['toTarget', 'id'])
	      }
	    };
	    return super.newItem(hiveMindData, prio);
	  }

	  itemDone(itemId) {
	    super.itemDone(itemId);
	  }

	  itemGenerator() {
	    // Reserve remote rooms
	    const remoteRooms = this.room.memory.connectedRemoteRooms;
	    for (let remoteName in remoteRooms) {
	      let remoteRoomData = remoteRooms[remoteName];
	      if (remoteRoomData.parsed) {
	        const remoteRoom = Game.rooms[remoteName];
	        if (remoteRoom) {
	          const controller = remoteRoom.controller;
	          if (controller) {
	            const pos = controller.pos;

	            let existingItems = _.filter(this.allItems().concat(new _Spawning2.default(this.room).allItems()), { toTarget: { x: pos.x, y: pos.y, roomName: pos.roomName } });
	            while (_constants2.default.CONTROLLER_RESERVE_MAX - ((_.get(controller, ['reservation', 'ticksToEnd']) || 0) + _.sum(existingItems, 'amount')) > 2000 && existingItems.length < 10) {
	              log.cyan(`Generating Reserve-item for room ${ controller.room.name }`);
	              console.log(`  Amount: ${ JSON.stringify(_.sum(existingItems, 'amount')) }`);
	              console.log(`  Calc: ${ _constants2.default.CONTROLLER_RESERVE_MAX - ((_.get(controller, ['reservation', 'ticksToEnd']) || 0) + _.sum(existingItems, 'amount')) }`);
	              console.log(`ExistingItems: ${ JSON.stringify(existingItems) }`);
	              const prio = _constants2.default.PRIORITIES[_constants2.default.SEED][_constants2.default.RESERVE] + Math.floor(_.get(controller, ['reservation', 'ticksToEnd']) * 0.01);
	              this.newItem({ type: _constants2.default.RESERVE, amount: 1000 }, prio, controller);
	              existingItems.push({ amount: 1000 });
	            }
	          } else {
	            // Room has no controller, maybe a sourcekeeper-room?
	          }
	        } else {
	            // Can't see, dunno
	          }
	      } else {
	          // Room-Layout should be investigated, but not my task
	        }
	    }
	  }

	  /**
	   * TODO Probably doesnt belong here
	   */
	  itemVerwertor() {
	    if (this.queue.itemCount() > 0) {
	      while (this.queue.peek()) {
	        const queueItem = this.queue.peek();
	        const itemData = _hiveMind2.default.data[queueItem.id];
	        const spawnPriority = _constants2.default.PRIORITIES[_constants2.default.SPAWN][_constants2.default.KIND_CORRUPTOR];
	        const memory = { item: queueItem };
	        const res = new _Spawning2.default(this.room).newItem({
	          role: _constants2.default.ROLE_ZERG, kind: _constants2.default.KIND_CORRUPTOR, memory: memory,
	          body: [CLAIM, CLAIM, CLAIM, CLAIM, CLAIM, MOVE, MOVE, MOVE, MOVE, MOVE]
	        }, spawnPriority);
	        log.blue(`YAYY:: ${ res }`);
	        // const res = this.room.pushToQueue(
	        //   $.SPAWN,
	        //   {memory: creepMemory, kind: creepMemory.kind},
	        //   spawnPriority
	        // )
	        if (res) {
	          this.queue.dequeue();
	        }
	      }
	    }
	  }

	  spawnCreep(spawnPriority, creepMemory) {
	    let opts = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

	    if (!_.isUndefined(opts.assignItem)) {
	      creepMemory.item = creepMemory.item || {};
	      let itemId = _hiveMind2.default.push(opts.assignItem.data);
	      creepMemory.item.id = itemId;
	      if (!_.isUndefined(opts.assignItem.priority)) {
	        creepMemory.item.prio = opts.assignItem.priority;
	      } else {
	        creepMemory.item.prio = 0;
	      }
	    }
	    if (_.isUndefined(creepMemory.myRoomName)) {
	      creepMemory.myRoomName = this.room.name;
	    }
	    this.room.pushToQueue(_constants2.default.SPAWN, { memory: creepMemory, kind: creepMemory.kind }, spawnPriority);
	  }

	  calculateStepsFromSpawnOf(room, targetPos) {
	    //TODO Implement me
	    return 0;
	  }
	}

	module.exports = Seeding;

/***/ },
/* 84 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _constants = __webpack_require__(5);

	var _constants2 = _interopRequireDefault(_constants);

	var _Queueing = __webpack_require__(18);

	var _Queueing2 = _interopRequireDefault(_Queueing);

	var _hiveMind = __webpack_require__(3);

	var _hiveMind2 = _interopRequireDefault(_hiveMind);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	/**
	 * Excavating sources
	 */
	class Excavating extends _Queueing2.default {

	  constructor(room) {
	    let queue = arguments.length <= 1 || arguments[1] === undefined ? _constants2.default.SPAWN : arguments[1];

	    super(room, queue);
	  }

	  /**
	   * Generates a new Excavating-item.
	   */
	  newItem(data, prio) {
	    let opts = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

	    hiveMindData = {
	      roomName: data.roomName || _.get(data.requester, ['pos', 'roomName']),
	      id: data.id || _.get(data.requester, ['id']) || undefined,
	      x: data.x || _.get(data.requester, ['pos', 'x']) || undefined,
	      y: data.y || _.get(data.requester, ['pos', 'y']) || undefined,
	      assigned: false
	    };
	  }

	  itemGenerator() {
	    if (this.room.memory.connectedRemoteRooms) {
	      for (let remoteName in this.room.memory.connectedRemoteRooms) {
	        const data = this.room.memory.connectedRemoteRooms[remoteName];
	        if (data.parsed) {
	          for (let source of data.sources) {
	            let x = source.x;
	            let y = source.y;
	            let id = source.id;

	            let sourceItemExists = _.filter(_hiveMind2.default.allForRoom(this.room), { fromSource: { x: x, y: y, roomName: remoteName, id: id } }).length > 0;
	            if (!sourceItemExists) {
	              this.newItem({ x: x, y: y, roomName: remoteName, id: id }, _constants2.default.PRIORITIES[_constants2.default.EXCAVATE][_constants2.default.SOURCE] * _constants2.default.REMOTE_PRIORITIES_MODIFIER);
	            }
	          }
	        }
	      }
	    }
	  }

	}

	module.exports = Excavating;

/***/ }
/******/ ]);
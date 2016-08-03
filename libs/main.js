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

	'use strict';

	var _fighter = __webpack_require__(1);

	var _fighter2 = _interopRequireDefault(_fighter);

	__webpack_require__(2);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var defense = __webpack_require__(53);
	var roleHarvester = __webpack_require__(55);
	var roleUpgrader = __webpack_require__(57);
	var roleBuilder = __webpack_require__(58);
	var roleExcavator = __webpack_require__(59);
	var roleRepairer = __webpack_require__(60);
	var roleTransporter = __webpack_require__(61);
	var spawnCreepWatcher = __webpack_require__(62);

	// import roleMaintainer from './role/maintainer'


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
	        } else if (creep.memory.role == 'fighter') {
	            _fighter2.default.run(creep);
	        }
	    }
	};

/***/ },
/* 1 */
/***/ function(module, exports) {

	"use strict";

	var roleFighter = {
	  run: function run(creep) {
	    var flags = _.filter(Game.flags, { color: COLOR_RED });
	    if (flags.length) {
	      var flag = flags[0];
	      creep.moveTo(flags[0]);
	      var targets = flag.pos.look();
	      if (targets.length) {
	        creep.attack(targets[0]);
	      }
	    }
	  }
	};

	module.exports = roleFighter;

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	// ES2017 w/ Node 5
	__webpack_require__(3);
	__webpack_require__(38);
	__webpack_require__(40);
	__webpack_require__(47);
	__webpack_require__(51);


/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(4);
	module.exports = __webpack_require__(7).Object.entries;

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	// https://github.com/tc39/proposal-object-values-entries
	var $export  = __webpack_require__(5)
	  , $entries = __webpack_require__(23)(true);

	$export($export.S, 'Object', {
	  entries: function entries(it){
	    return $entries(it);
	  }
	});

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	var global    = __webpack_require__(6)
	  , core      = __webpack_require__(7)
	  , hide      = __webpack_require__(8)
	  , redefine  = __webpack_require__(18)
	  , ctx       = __webpack_require__(21)
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
/* 6 */
/***/ function(module, exports) {

	// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
	var global = module.exports = typeof window != 'undefined' && window.Math == Math
	  ? window : typeof self != 'undefined' && self.Math == Math ? self : Function('return this')();
	if(typeof __g == 'number')__g = global; // eslint-disable-line no-undef

/***/ },
/* 7 */
/***/ function(module, exports) {

	var core = module.exports = {version: '2.4.0'};
	if(typeof __e == 'number')__e = core; // eslint-disable-line no-undef

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	var dP         = __webpack_require__(9)
	  , createDesc = __webpack_require__(17);
	module.exports = __webpack_require__(13) ? function(object, key, value){
	  return dP.f(object, key, createDesc(1, value));
	} : function(object, key, value){
	  object[key] = value;
	  return object;
	};

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	var anObject       = __webpack_require__(10)
	  , IE8_DOM_DEFINE = __webpack_require__(12)
	  , toPrimitive    = __webpack_require__(16)
	  , dP             = Object.defineProperty;

	exports.f = __webpack_require__(13) ? Object.defineProperty : function defineProperty(O, P, Attributes){
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
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	var isObject = __webpack_require__(11);
	module.exports = function(it){
	  if(!isObject(it))throw TypeError(it + ' is not an object!');
	  return it;
	};

/***/ },
/* 11 */
/***/ function(module, exports) {

	module.exports = function(it){
	  return typeof it === 'object' ? it !== null : typeof it === 'function';
	};

/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = !__webpack_require__(13) && !__webpack_require__(14)(function(){
	  return Object.defineProperty(__webpack_require__(15)('div'), 'a', {get: function(){ return 7; }}).a != 7;
	});

/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	// Thank's IE8 for his funny defineProperty
	module.exports = !__webpack_require__(14)(function(){
	  return Object.defineProperty({}, 'a', {get: function(){ return 7; }}).a != 7;
	});

/***/ },
/* 14 */
/***/ function(module, exports) {

	module.exports = function(exec){
	  try {
	    return !!exec();
	  } catch(e){
	    return true;
	  }
	};

/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	var isObject = __webpack_require__(11)
	  , document = __webpack_require__(6).document
	  // in old IE typeof document.createElement is 'object'
	  , is = isObject(document) && isObject(document.createElement);
	module.exports = function(it){
	  return is ? document.createElement(it) : {};
	};

/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	// 7.1.1 ToPrimitive(input [, PreferredType])
	var isObject = __webpack_require__(11);
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
/* 17 */
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
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	var global    = __webpack_require__(6)
	  , hide      = __webpack_require__(8)
	  , has       = __webpack_require__(19)
	  , SRC       = __webpack_require__(20)('src')
	  , TO_STRING = 'toString'
	  , $toString = Function[TO_STRING]
	  , TPL       = ('' + $toString).split(TO_STRING);

	__webpack_require__(7).inspectSource = function(it){
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
/* 19 */
/***/ function(module, exports) {

	var hasOwnProperty = {}.hasOwnProperty;
	module.exports = function(it, key){
	  return hasOwnProperty.call(it, key);
	};

/***/ },
/* 20 */
/***/ function(module, exports) {

	var id = 0
	  , px = Math.random();
	module.exports = function(key){
	  return 'Symbol('.concat(key === undefined ? '' : key, ')_', (++id + px).toString(36));
	};

/***/ },
/* 21 */
/***/ function(module, exports, __webpack_require__) {

	// optional / simple context binding
	var aFunction = __webpack_require__(22);
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
/* 22 */
/***/ function(module, exports) {

	module.exports = function(it){
	  if(typeof it != 'function')throw TypeError(it + ' is not a function!');
	  return it;
	};

/***/ },
/* 23 */
/***/ function(module, exports, __webpack_require__) {

	var getKeys   = __webpack_require__(24)
	  , toIObject = __webpack_require__(26)
	  , isEnum    = __webpack_require__(37).f;
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
/* 24 */
/***/ function(module, exports, __webpack_require__) {

	// 19.1.2.14 / 15.2.3.14 Object.keys(O)
	var $keys       = __webpack_require__(25)
	  , enumBugKeys = __webpack_require__(36);

	module.exports = Object.keys || function keys(O){
	  return $keys(O, enumBugKeys);
	};

/***/ },
/* 25 */
/***/ function(module, exports, __webpack_require__) {

	var has          = __webpack_require__(19)
	  , toIObject    = __webpack_require__(26)
	  , arrayIndexOf = __webpack_require__(30)(false)
	  , IE_PROTO     = __webpack_require__(34)('IE_PROTO');

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
/* 26 */
/***/ function(module, exports, __webpack_require__) {

	// to indexed object, toObject with fallback for non-array-like ES3 strings
	var IObject = __webpack_require__(27)
	  , defined = __webpack_require__(29);
	module.exports = function(it){
	  return IObject(defined(it));
	};

/***/ },
/* 27 */
/***/ function(module, exports, __webpack_require__) {

	// fallback for non-array-like ES3 and non-enumerable old V8 strings
	var cof = __webpack_require__(28);
	module.exports = Object('z').propertyIsEnumerable(0) ? Object : function(it){
	  return cof(it) == 'String' ? it.split('') : Object(it);
	};

/***/ },
/* 28 */
/***/ function(module, exports) {

	var toString = {}.toString;

	module.exports = function(it){
	  return toString.call(it).slice(8, -1);
	};

/***/ },
/* 29 */
/***/ function(module, exports) {

	// 7.2.1 RequireObjectCoercible(argument)
	module.exports = function(it){
	  if(it == undefined)throw TypeError("Can't call method on  " + it);
	  return it;
	};

/***/ },
/* 30 */
/***/ function(module, exports, __webpack_require__) {

	// false -> Array#indexOf
	// true  -> Array#includes
	var toIObject = __webpack_require__(26)
	  , toLength  = __webpack_require__(31)
	  , toIndex   = __webpack_require__(33);
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
/* 31 */
/***/ function(module, exports, __webpack_require__) {

	// 7.1.15 ToLength
	var toInteger = __webpack_require__(32)
	  , min       = Math.min;
	module.exports = function(it){
	  return it > 0 ? min(toInteger(it), 0x1fffffffffffff) : 0; // pow(2, 53) - 1 == 9007199254740991
	};

/***/ },
/* 32 */
/***/ function(module, exports) {

	// 7.1.4 ToInteger
	var ceil  = Math.ceil
	  , floor = Math.floor;
	module.exports = function(it){
	  return isNaN(it = +it) ? 0 : (it > 0 ? floor : ceil)(it);
	};

/***/ },
/* 33 */
/***/ function(module, exports, __webpack_require__) {

	var toInteger = __webpack_require__(32)
	  , max       = Math.max
	  , min       = Math.min;
	module.exports = function(index, length){
	  index = toInteger(index);
	  return index < 0 ? max(index + length, 0) : min(index, length);
	};

/***/ },
/* 34 */
/***/ function(module, exports, __webpack_require__) {

	var shared = __webpack_require__(35)('keys')
	  , uid    = __webpack_require__(20);
	module.exports = function(key){
	  return shared[key] || (shared[key] = uid(key));
	};

/***/ },
/* 35 */
/***/ function(module, exports, __webpack_require__) {

	var global = __webpack_require__(6)
	  , SHARED = '__core-js_shared__'
	  , store  = global[SHARED] || (global[SHARED] = {});
	module.exports = function(key){
	  return store[key] || (store[key] = {});
	};

/***/ },
/* 36 */
/***/ function(module, exports) {

	// IE 8- don't enum bug keys
	module.exports = (
	  'constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf'
	).split(',');

/***/ },
/* 37 */
/***/ function(module, exports) {

	exports.f = {}.propertyIsEnumerable;

/***/ },
/* 38 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(39);
	module.exports = __webpack_require__(7).Object.values;

/***/ },
/* 39 */
/***/ function(module, exports, __webpack_require__) {

	// https://github.com/tc39/proposal-object-values-entries
	var $export = __webpack_require__(5)
	  , $values = __webpack_require__(23)(false);

	$export($export.S, 'Object', {
	  values: function values(it){
	    return $values(it);
	  }
	});

/***/ },
/* 40 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(41);
	module.exports = __webpack_require__(7).Object.getOwnPropertyDescriptors;

/***/ },
/* 41 */
/***/ function(module, exports, __webpack_require__) {

	// https://github.com/tc39/proposal-object-getownpropertydescriptors
	var $export        = __webpack_require__(5)
	  , ownKeys        = __webpack_require__(42)
	  , toIObject      = __webpack_require__(26)
	  , gOPD           = __webpack_require__(45)
	  , createProperty = __webpack_require__(46);

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
/* 42 */
/***/ function(module, exports, __webpack_require__) {

	// all object keys, includes non-enumerable and symbols
	var gOPN     = __webpack_require__(43)
	  , gOPS     = __webpack_require__(44)
	  , anObject = __webpack_require__(10)
	  , Reflect  = __webpack_require__(6).Reflect;
	module.exports = Reflect && Reflect.ownKeys || function ownKeys(it){
	  var keys       = gOPN.f(anObject(it))
	    , getSymbols = gOPS.f;
	  return getSymbols ? keys.concat(getSymbols(it)) : keys;
	};

/***/ },
/* 43 */
/***/ function(module, exports, __webpack_require__) {

	// 19.1.2.7 / 15.2.3.4 Object.getOwnPropertyNames(O)
	var $keys      = __webpack_require__(25)
	  , hiddenKeys = __webpack_require__(36).concat('length', 'prototype');

	exports.f = Object.getOwnPropertyNames || function getOwnPropertyNames(O){
	  return $keys(O, hiddenKeys);
	};

/***/ },
/* 44 */
/***/ function(module, exports) {

	exports.f = Object.getOwnPropertySymbols;

/***/ },
/* 45 */
/***/ function(module, exports, __webpack_require__) {

	var pIE            = __webpack_require__(37)
	  , createDesc     = __webpack_require__(17)
	  , toIObject      = __webpack_require__(26)
	  , toPrimitive    = __webpack_require__(16)
	  , has            = __webpack_require__(19)
	  , IE8_DOM_DEFINE = __webpack_require__(12)
	  , gOPD           = Object.getOwnPropertyDescriptor;

	exports.f = __webpack_require__(13) ? gOPD : function getOwnPropertyDescriptor(O, P){
	  O = toIObject(O);
	  P = toPrimitive(P, true);
	  if(IE8_DOM_DEFINE)try {
	    return gOPD(O, P);
	  } catch(e){ /* empty */ }
	  if(has(O, P))return createDesc(!pIE.f.call(O, P), O[P]);
	};

/***/ },
/* 46 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var $defineProperty = __webpack_require__(9)
	  , createDesc      = __webpack_require__(17);

	module.exports = function(object, index, value){
	  if(index in object)$defineProperty.f(object, index, createDesc(0, value));
	  else object[index] = value;
	};

/***/ },
/* 47 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(48);
	module.exports = __webpack_require__(7).String.padStart;


/***/ },
/* 48 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	// https://github.com/tc39/proposal-string-pad-start-end
	var $export = __webpack_require__(5)
	  , $pad    = __webpack_require__(49);

	$export($export.P, 'String', {
	  padStart: function padStart(maxLength /*, fillString = ' ' */){
	    return $pad(this, maxLength, arguments.length > 1 ? arguments[1] : undefined, true);
	  }
	});

/***/ },
/* 49 */
/***/ function(module, exports, __webpack_require__) {

	// https://github.com/tc39/proposal-string-pad-start-end
	var toLength = __webpack_require__(31)
	  , repeat   = __webpack_require__(50)
	  , defined  = __webpack_require__(29);

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
/* 50 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var toInteger = __webpack_require__(32)
	  , defined   = __webpack_require__(29);

	module.exports = function repeat(count){
	  var str = String(defined(this))
	    , res = ''
	    , n   = toInteger(count);
	  if(n < 0 || n == Infinity)throw RangeError("Count can't be negative");
	  for(;n > 0; (n >>>= 1) && (str += str))if(n & 1)res += str;
	  return res;
	};

/***/ },
/* 51 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(52);
	module.exports = __webpack_require__(7).String.padEnd;


/***/ },
/* 52 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	// https://github.com/tc39/proposal-string-pad-start-end
	var $export = __webpack_require__(5)
	  , $pad    = __webpack_require__(49);

	$export($export.P, 'String', {
	  padEnd: function padEnd(maxLength /*, fillString = ' ' */){
	    return $pad(this, maxLength, arguments.length > 1 ? arguments[1] : undefined, false);
	  }
	});

/***/ },
/* 53 */
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

	var helper = __webpack_require__(54);

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
/* 54 */
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
/* 55 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var role = __webpack_require__(56);

	var roleHarvester = {

	  /** @param {Creep} creep **/
	  run: function run(creep) {

	    if (creep.carry.energy == creep.carryCapacity && creep.memory.harvesting) {
	      creep.memory.harvesting = false;
	    } else if (creep.carry.energy == 0 && !creep.memory.harvesting) {
	      creep.memory.harvesting = true;
	    }
	    if (creep.memory.harvesting) {
	      var void_extension = void 0,
	          storage = void 0;
	      if ((void_extension = this.getFirstVoidExtension(creep.room)) && (storage = creep.room.find(FIND_MY_STRUCTURES, { filter: { structureType: STRUCTURE_STORAGE } })[0])) {
	        if (creep.withdraw(storage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
	          creep.moveTo(storage);
	        }
	      } else {
	        var container = this.findNonVoidEnergyContainer(creep.room);
	        if (container) {
	          if (creep.withdraw(container, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
	            creep.moveTo(container);
	          }
	        } else {
	          var sources = creep.room.find(FIND_SOURCES);
	          var harvestResult = creep.harvest(sources[1]);
	          if (harvestResult == ERR_NOT_IN_RANGE) {
	            creep.moveTo(sources[1]);
	          }
	        }
	      }
	    } else {
	      var _void_extension = void 0;
	      if (Game.spawns['Underground Traaains'].energy < 300) {
	        if (creep.transfer(Game.spawns['Underground Traaains'], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
	          creep.moveTo(Game.spawns['Underground Traaains']);
	        }
	      } else if (_void_extension = this.getFirstVoidExtension(creep.room)) {
	        if (creep.transfer(_void_extension, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
	          creep.moveTo(_void_extension);
	        }
	      } else {
	        var prioStructure = void 0;
	        var tower = void 0;
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
	    var void_extensions = room.find(FIND_MY_STRUCTURES, { filter: this.filterNonVoidExtension });
	    if (void_extensions.length > 0) {
	      var void_extension = Array.isArray(void_extensions) ? void_extensions[0] : void_extensions;
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
/* 56 */
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
	  },
	  getStorageTarget: function getStorageTarget(creep) {
	    var void_extension = void 0;
	    if (Game.spawns['Underground Traaains'].energy < 300) {
	      if (creep.transfer(Game.spawns['Underground Traaains'], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
	        creep.moveTo(Game.spawns['Underground Traaains']);
	      }
	    } else if (void_extension = this.getFirstVoidExtension(creep.room)) {
	      if (creep.transfer(void_extension, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
	        creep.moveTo(void_extension);
	      }
	    } else {
	      var prioStructure = void 0;
	      var tower = void 0;
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
/* 57 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var role = __webpack_require__(56);

	var roleUpgrader = {

	    /** @param {Creep} creep **/
	    run: function run(creep) {
	        if (creep.carry.energy == creep.carryCapacity && creep.memory.harvesting) {
	            creep.memory.harvesting = false;
	        } else if (creep.carry.energy == 0 && !creep.memory.harvesting) {
	            creep.memory.harvesting = true;
	        }

	        if (creep.memory.harvesting) {
	            var container = void 0;
	            if (container = role.findNonVoidEnergyContainer(creep)) {
	                if (creep.withdraw(container, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
	                    creep.moveTo(container);
	                }
	            } else {
	                // Do nothing *SadPanda*
	            }
	        } else {
	            var prioStructure = void 0;
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
/* 58 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var role = __webpack_require__(56);

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
																	var target = this.getRepairTarget(creep);
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
/* 59 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var role = __webpack_require__(56);

	/**
	 * An Excavator should be defined by the following Memory-Vars:
	 *   fromSource - Id where to get the resources from
	 */

	var roleExcavator = {

	  /** @param {Creep} creep **/
	  run: function run(creep) {
	    var gPos = this.getExcavationPosition(creep);
	    if (gPos) {
	      if (gPos.x == creep.pos.x && gPos.y == creep.pos.y && gPos.roomName == creep.room.name) {
	        var source = Game.getObjectById(creep.memory.fromSource);
	        var res = creep.harvest(source);
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

	  getExcavationPosition: function getExcavationPosition(creep) {
	    if (creep.memory.excavationPosition) {
	      var pos = creep.memory.excavationPosition;
	      return new RoomPosition(pos.x, pos.y, pos.roomName);
	    } else {
	      var _pos = this.calcExcavationPosition(creep);
	      if (_pos) {
	        creep.memory.excavationPosition = {
	          x: _pos.x, y: _pos.y, roomName: _pos.roomName
	        };
	        return _pos;
	      } else {
	        return null;
	      }
	      return null;
	    }
	  },
	  calcExcavationPosition: function calcExcavationPosition(creep) {
	    var source = Game.getObjectById(creep.memory.fromSource);
	    if (source) {
	      var containers = source.pos.findInRange(FIND_STRUCTURES, 1, { filter: { structureType: STRUCTURE_CONTAINER } });
	      if (containers.length > 0) {
	        var container = containers[0];
	        return new RoomPosition(container.pos.x, container.pos.y, container.room.name);
	      } else {
	        // Any adjacent walkable tile to the source is fine, get the position
	        // to the closest one. Just dont call it to often.
	        var path = creep.pos.findPathTo(source);
	        if (path && path.length) {
	          var pos = path.slice(-1)[0];
	          return new RoomPosition(pos.x, pos.y, source.room);
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
/* 60 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var role = __webpack_require__(56);

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
	            var target = void 0;
	            if (target = this.getRepairTarget(creep)) {
	                if (creep.repair(target) == ERR_NOT_IN_RANGE) {
	                    creep.moveTo(target);
	                }
	            }
	        } else {
	            var container = void 0;
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
/* 61 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var role = __webpack_require__(56);

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
/* 62 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var spawner = __webpack_require__(63);

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
	            var memExcavator = null;
	            var _iteratorNormalCompletion = true;
	            var _didIteratorError = false;
	            var _iteratorError = undefined;

	            try {
	                var _loop = function _loop() {
	                    var memExcavator = _step.value;

	                    if (_.filter(excavators, function (ex) {
	                        return ex.memory.fromSource == memExcavator.fromSource;
	                    }).length == 0) {
	                        //console.log("Wanna spawn new excavator!");
	                        var newName = spawner.excavator(memExcavator.fromSource);
	                    }
	                };

	                for (var _iterator = spawn.memory.excavators[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
	                    _loop();
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
	            var memTransporter = null;
	            var _iteratorNormalCompletion2 = true;
	            var _didIteratorError2 = false;
	            var _iteratorError2 = undefined;

	            try {
	                var _loop2 = function _loop2() {
	                    var memTransporter = _step2.value;

	                    if (_.filter(transporters, function (ex) {
	                        return ex.memory.fromSource.id == memTransporter.fromSource.id && ex.memory.toTarget.id == memTransporter.toTarget.id;
	                    }).length == 0) {
	                        var newName = spawner.transporter(memTransporter);
	                    }
	                };

	                for (var _iterator2 = spawn.memory.transporters[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
	                    _loop2();
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
	            var newName = spawner.upgrader();
	            //console.log('Spawning new upgrader: ' + newName);
	        }

	        var builders = _.filter(Game.creeps, function (creep) {
	            return creep.memory.role == 'builder';
	        });
	        if (builders.length < spawn.memory.builderSize) {
	            var _newName = spawner.builder();
	            //console.log('Spawning new builder: ' + newName);
	        }

	        var repairers = _.filter(Game.creeps, function (creep) {
	            return creep.memory.role == 'repairer';
	        });
	        if (repairers.length < spawn.memory.repairerSize) {
	            var _newName2 = spawner.repairer();
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
/* 63 */
/***/ function(module, exports) {

	'use strict';

	var spawner = {
	    rebootHarvester: function rebootHarvester() {
	        return Game.spawns['Underground Traaains'].createCreep([WORK, CARRY, CARRY, MOVE, MOVE], 'Harvester' + this.newCreepIndex(), { role: 'harvester' });
	    },
	    harvester: function harvester() {
	        return Game.spawns['Underground Traaains'].createCreep([WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE], 'Harvester' + this.newCreepIndex(), { role: 'harvester' });
	    },
	    excavator: function excavator(fromSource) {
	        return Game.spawns['Underground Traaains'].createCreep([WORK, WORK, WORK, WORK, WORK, WORK, MOVE], 'Excavator' + this.newCreepIndex(), { role: 'excavator', fromSource: fromSource });
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
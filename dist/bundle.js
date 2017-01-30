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

	__webpack_require__(1);
	module.exports = __webpack_require__(3);


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global, process) {/**
	 * Copyright (c) 2014, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * https://raw.github.com/facebook/regenerator/master/LICENSE file. An
	 * additional grant of patent rights can be found in the PATENTS file in
	 * the same directory.
	 */

	!(function(global) {
	  "use strict";

	  var hasOwn = Object.prototype.hasOwnProperty;
	  var undefined; // More compressible than void 0.
	  var iteratorSymbol =
	    typeof Symbol === "function" && Symbol.iterator || "@@iterator";

	  var inModule = typeof module === "object";
	  var runtime = global.regeneratorRuntime;
	  if (runtime) {
	    if (inModule) {
	      // If regeneratorRuntime is defined globally and we're in a module,
	      // make the exports object identical to regeneratorRuntime.
	      module.exports = runtime;
	    }
	    // Don't bother evaluating the rest of this file if the runtime was
	    // already defined globally.
	    return;
	  }

	  // Define the runtime globally (as expected by generated code) as either
	  // module.exports (if we're in a module) or a new, empty object.
	  runtime = global.regeneratorRuntime = inModule ? module.exports : {};

	  function wrap(innerFn, outerFn, self, tryLocsList) {
	    // If outerFn provided, then outerFn.prototype instanceof Generator.
	    var generator = Object.create((outerFn || Generator).prototype);
	    var context = new Context(tryLocsList || []);

	    // The ._invoke method unifies the implementations of the .next,
	    // .throw, and .return methods.
	    generator._invoke = makeInvokeMethod(innerFn, self, context);

	    return generator;
	  }
	  runtime.wrap = wrap;

	  // Try/catch helper to minimize deoptimizations. Returns a completion
	  // record like context.tryEntries[i].completion. This interface could
	  // have been (and was previously) designed to take a closure to be
	  // invoked without arguments, but in all the cases we care about we
	  // already have an existing method we want to call, so there's no need
	  // to create a new function object. We can even get away with assuming
	  // the method takes exactly one argument, since that happens to be true
	  // in every case, so we don't have to touch the arguments object. The
	  // only additional allocation required is the completion record, which
	  // has a stable shape and so hopefully should be cheap to allocate.
	  function tryCatch(fn, obj, arg) {
	    try {
	      return { type: "normal", arg: fn.call(obj, arg) };
	    } catch (err) {
	      return { type: "throw", arg: err };
	    }
	  }

	  var GenStateSuspendedStart = "suspendedStart";
	  var GenStateSuspendedYield = "suspendedYield";
	  var GenStateExecuting = "executing";
	  var GenStateCompleted = "completed";

	  // Returning this object from the innerFn has the same effect as
	  // breaking out of the dispatch switch statement.
	  var ContinueSentinel = {};

	  // Dummy constructor functions that we use as the .constructor and
	  // .constructor.prototype properties for functions that return Generator
	  // objects. For full spec compliance, you may wish to configure your
	  // minifier not to mangle the names of these two functions.
	  function Generator() {}
	  function GeneratorFunction() {}
	  function GeneratorFunctionPrototype() {}

	  var Gp = GeneratorFunctionPrototype.prototype = Generator.prototype;
	  GeneratorFunction.prototype = Gp.constructor = GeneratorFunctionPrototype;
	  GeneratorFunctionPrototype.constructor = GeneratorFunction;
	  GeneratorFunction.displayName = "GeneratorFunction";

	  // Helper for defining the .next, .throw, and .return methods of the
	  // Iterator interface in terms of a single ._invoke method.
	  function defineIteratorMethods(prototype) {
	    ["next", "throw", "return"].forEach(function(method) {
	      prototype[method] = function(arg) {
	        return this._invoke(method, arg);
	      };
	    });
	  }

	  runtime.isGeneratorFunction = function(genFun) {
	    var ctor = typeof genFun === "function" && genFun.constructor;
	    return ctor
	      ? ctor === GeneratorFunction ||
	        // For the native GeneratorFunction constructor, the best we can
	        // do is to check its .name property.
	        (ctor.displayName || ctor.name) === "GeneratorFunction"
	      : false;
	  };

	  runtime.mark = function(genFun) {
	    if (Object.setPrototypeOf) {
	      Object.setPrototypeOf(genFun, GeneratorFunctionPrototype);
	    } else {
	      genFun.__proto__ = GeneratorFunctionPrototype;
	    }
	    genFun.prototype = Object.create(Gp);
	    return genFun;
	  };

	  // Within the body of any async function, `await x` is transformed to
	  // `yield regeneratorRuntime.awrap(x)`, so that the runtime can test
	  // `value instanceof AwaitArgument` to determine if the yielded value is
	  // meant to be awaited. Some may consider the name of this method too
	  // cutesy, but they are curmudgeons.
	  runtime.awrap = function(arg) {
	    return new AwaitArgument(arg);
	  };

	  function AwaitArgument(arg) {
	    this.arg = arg;
	  }

	  function AsyncIterator(generator) {
	    // This invoke function is written in a style that assumes some
	    // calling function (or Promise) will handle exceptions.
	    function invoke(method, arg) {
	      var result = generator[method](arg);
	      var value = result.value;
	      return value instanceof AwaitArgument
	        ? Promise.resolve(value.arg).then(invokeNext, invokeThrow)
	        : Promise.resolve(value).then(function(unwrapped) {
	            // When a yielded Promise is resolved, its final value becomes
	            // the .value of the Promise<{value,done}> result for the
	            // current iteration. If the Promise is rejected, however, the
	            // result for this iteration will be rejected with the same
	            // reason. Note that rejections of yielded Promises are not
	            // thrown back into the generator function, as is the case
	            // when an awaited Promise is rejected. This difference in
	            // behavior between yield and await is important, because it
	            // allows the consumer to decide what to do with the yielded
	            // rejection (swallow it and continue, manually .throw it back
	            // into the generator, abandon iteration, whatever). With
	            // await, by contrast, there is no opportunity to examine the
	            // rejection reason outside the generator function, so the
	            // only option is to throw it from the await expression, and
	            // let the generator function handle the exception.
	            result.value = unwrapped;
	            return result;
	          });
	    }

	    if (typeof process === "object" && process.domain) {
	      invoke = process.domain.bind(invoke);
	    }

	    var invokeNext = invoke.bind(generator, "next");
	    var invokeThrow = invoke.bind(generator, "throw");
	    var invokeReturn = invoke.bind(generator, "return");
	    var previousPromise;

	    function enqueue(method, arg) {
	      function callInvokeWithMethodAndArg() {
	        return invoke(method, arg);
	      }

	      return previousPromise =
	        // If enqueue has been called before, then we want to wait until
	        // all previous Promises have been resolved before calling invoke,
	        // so that results are always delivered in the correct order. If
	        // enqueue has not been called before, then it is important to
	        // call invoke immediately, without waiting on a callback to fire,
	        // so that the async generator function has the opportunity to do
	        // any necessary setup in a predictable way. This predictability
	        // is why the Promise constructor synchronously invokes its
	        // executor callback, and why async functions synchronously
	        // execute code before the first await. Since we implement simple
	        // async functions in terms of async generators, it is especially
	        // important to get this right, even though it requires care.
	        previousPromise ? previousPromise.then(
	          callInvokeWithMethodAndArg,
	          // Avoid propagating failures to Promises returned by later
	          // invocations of the iterator.
	          callInvokeWithMethodAndArg
	        ) : new Promise(function (resolve) {
	          resolve(callInvokeWithMethodAndArg());
	        });
	    }

	    // Define the unified helper method that is used to implement .next,
	    // .throw, and .return (see defineIteratorMethods).
	    this._invoke = enqueue;
	  }

	  defineIteratorMethods(AsyncIterator.prototype);

	  // Note that simple async functions are implemented on top of
	  // AsyncIterator objects; they just return a Promise for the value of
	  // the final result produced by the iterator.
	  runtime.async = function(innerFn, outerFn, self, tryLocsList) {
	    var iter = new AsyncIterator(
	      wrap(innerFn, outerFn, self, tryLocsList)
	    );

	    return runtime.isGeneratorFunction(outerFn)
	      ? iter // If outerFn is a generator, return the full iterator.
	      : iter.next().then(function(result) {
	          return result.done ? result.value : iter.next();
	        });
	  };

	  function makeInvokeMethod(innerFn, self, context) {
	    var state = GenStateSuspendedStart;

	    return function invoke(method, arg) {
	      if (state === GenStateExecuting) {
	        throw new Error("Generator is already running");
	      }

	      if (state === GenStateCompleted) {
	        if (method === "throw") {
	          throw arg;
	        }

	        // Be forgiving, per 25.3.3.3.3 of the spec:
	        // https://people.mozilla.org/~jorendorff/es6-draft.html#sec-generatorresume
	        return doneResult();
	      }

	      while (true) {
	        var delegate = context.delegate;
	        if (delegate) {
	          if (method === "return" ||
	              (method === "throw" && delegate.iterator[method] === undefined)) {
	            // A return or throw (when the delegate iterator has no throw
	            // method) always terminates the yield* loop.
	            context.delegate = null;

	            // If the delegate iterator has a return method, give it a
	            // chance to clean up.
	            var returnMethod = delegate.iterator["return"];
	            if (returnMethod) {
	              var record = tryCatch(returnMethod, delegate.iterator, arg);
	              if (record.type === "throw") {
	                // If the return method threw an exception, let that
	                // exception prevail over the original return or throw.
	                method = "throw";
	                arg = record.arg;
	                continue;
	              }
	            }

	            if (method === "return") {
	              // Continue with the outer return, now that the delegate
	              // iterator has been terminated.
	              continue;
	            }
	          }

	          var record = tryCatch(
	            delegate.iterator[method],
	            delegate.iterator,
	            arg
	          );

	          if (record.type === "throw") {
	            context.delegate = null;

	            // Like returning generator.throw(uncaught), but without the
	            // overhead of an extra function call.
	            method = "throw";
	            arg = record.arg;
	            continue;
	          }

	          // Delegate generator ran and handled its own exceptions so
	          // regardless of what the method was, we continue as if it is
	          // "next" with an undefined arg.
	          method = "next";
	          arg = undefined;

	          var info = record.arg;
	          if (info.done) {
	            context[delegate.resultName] = info.value;
	            context.next = delegate.nextLoc;
	          } else {
	            state = GenStateSuspendedYield;
	            return info;
	          }

	          context.delegate = null;
	        }

	        if (method === "next") {
	          context._sent = arg;

	          if (state === GenStateSuspendedYield) {
	            context.sent = arg;
	          } else {
	            context.sent = undefined;
	          }
	        } else if (method === "throw") {
	          if (state === GenStateSuspendedStart) {
	            state = GenStateCompleted;
	            throw arg;
	          }

	          if (context.dispatchException(arg)) {
	            // If the dispatched exception was caught by a catch block,
	            // then let that catch block handle the exception normally.
	            method = "next";
	            arg = undefined;
	          }

	        } else if (method === "return") {
	          context.abrupt("return", arg);
	        }

	        state = GenStateExecuting;

	        var record = tryCatch(innerFn, self, context);
	        if (record.type === "normal") {
	          // If an exception is thrown from innerFn, we leave state ===
	          // GenStateExecuting and loop back for another invocation.
	          state = context.done
	            ? GenStateCompleted
	            : GenStateSuspendedYield;

	          var info = {
	            value: record.arg,
	            done: context.done
	          };

	          if (record.arg === ContinueSentinel) {
	            if (context.delegate && method === "next") {
	              // Deliberately forget the last sent value so that we don't
	              // accidentally pass it on to the delegate.
	              arg = undefined;
	            }
	          } else {
	            return info;
	          }

	        } else if (record.type === "throw") {
	          state = GenStateCompleted;
	          // Dispatch the exception by looping back around to the
	          // context.dispatchException(arg) call above.
	          method = "throw";
	          arg = record.arg;
	        }
	      }
	    };
	  }

	  // Define Generator.prototype.{next,throw,return} in terms of the
	  // unified ._invoke helper method.
	  defineIteratorMethods(Gp);

	  Gp[iteratorSymbol] = function() {
	    return this;
	  };

	  Gp.toString = function() {
	    return "[object Generator]";
	  };

	  function pushTryEntry(locs) {
	    var entry = { tryLoc: locs[0] };

	    if (1 in locs) {
	      entry.catchLoc = locs[1];
	    }

	    if (2 in locs) {
	      entry.finallyLoc = locs[2];
	      entry.afterLoc = locs[3];
	    }

	    this.tryEntries.push(entry);
	  }

	  function resetTryEntry(entry) {
	    var record = entry.completion || {};
	    record.type = "normal";
	    delete record.arg;
	    entry.completion = record;
	  }

	  function Context(tryLocsList) {
	    // The root entry object (effectively a try statement without a catch
	    // or a finally block) gives us a place to store values thrown from
	    // locations where there is no enclosing try statement.
	    this.tryEntries = [{ tryLoc: "root" }];
	    tryLocsList.forEach(pushTryEntry, this);
	    this.reset(true);
	  }

	  runtime.keys = function(object) {
	    var keys = [];
	    for (var key in object) {
	      keys.push(key);
	    }
	    keys.reverse();

	    // Rather than returning an object with a next method, we keep
	    // things simple and return the next function itself.
	    return function next() {
	      while (keys.length) {
	        var key = keys.pop();
	        if (key in object) {
	          next.value = key;
	          next.done = false;
	          return next;
	        }
	      }

	      // To avoid creating an additional object, we just hang the .value
	      // and .done properties off the next function object itself. This
	      // also ensures that the minifier will not anonymize the function.
	      next.done = true;
	      return next;
	    };
	  };

	  function values(iterable) {
	    if (iterable) {
	      var iteratorMethod = iterable[iteratorSymbol];
	      if (iteratorMethod) {
	        return iteratorMethod.call(iterable);
	      }

	      if (typeof iterable.next === "function") {
	        return iterable;
	      }

	      if (!isNaN(iterable.length)) {
	        var i = -1, next = function next() {
	          while (++i < iterable.length) {
	            if (hasOwn.call(iterable, i)) {
	              next.value = iterable[i];
	              next.done = false;
	              return next;
	            }
	          }

	          next.value = undefined;
	          next.done = true;

	          return next;
	        };

	        return next.next = next;
	      }
	    }

	    // Return an iterator with no values.
	    return { next: doneResult };
	  }
	  runtime.values = values;

	  function doneResult() {
	    return { value: undefined, done: true };
	  }

	  Context.prototype = {
	    constructor: Context,

	    reset: function(skipTempReset) {
	      this.prev = 0;
	      this.next = 0;
	      this.sent = undefined;
	      this.done = false;
	      this.delegate = null;

	      this.tryEntries.forEach(resetTryEntry);

	      if (!skipTempReset) {
	        for (var name in this) {
	          // Not sure about the optimal order of these conditions:
	          if (name.charAt(0) === "t" &&
	              hasOwn.call(this, name) &&
	              !isNaN(+name.slice(1))) {
	            this[name] = undefined;
	          }
	        }
	      }
	    },

	    stop: function() {
	      this.done = true;

	      var rootEntry = this.tryEntries[0];
	      var rootRecord = rootEntry.completion;
	      if (rootRecord.type === "throw") {
	        throw rootRecord.arg;
	      }

	      return this.rval;
	    },

	    dispatchException: function(exception) {
	      if (this.done) {
	        throw exception;
	      }

	      var context = this;
	      function handle(loc, caught) {
	        record.type = "throw";
	        record.arg = exception;
	        context.next = loc;
	        return !!caught;
	      }

	      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
	        var entry = this.tryEntries[i];
	        var record = entry.completion;

	        if (entry.tryLoc === "root") {
	          // Exception thrown outside of any try block that could handle
	          // it, so set the completion value of the entire function to
	          // throw the exception.
	          return handle("end");
	        }

	        if (entry.tryLoc <= this.prev) {
	          var hasCatch = hasOwn.call(entry, "catchLoc");
	          var hasFinally = hasOwn.call(entry, "finallyLoc");

	          if (hasCatch && hasFinally) {
	            if (this.prev < entry.catchLoc) {
	              return handle(entry.catchLoc, true);
	            } else if (this.prev < entry.finallyLoc) {
	              return handle(entry.finallyLoc);
	            }

	          } else if (hasCatch) {
	            if (this.prev < entry.catchLoc) {
	              return handle(entry.catchLoc, true);
	            }

	          } else if (hasFinally) {
	            if (this.prev < entry.finallyLoc) {
	              return handle(entry.finallyLoc);
	            }

	          } else {
	            throw new Error("try statement without catch or finally");
	          }
	        }
	      }
	    },

	    abrupt: function(type, arg) {
	      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
	        var entry = this.tryEntries[i];
	        if (entry.tryLoc <= this.prev &&
	            hasOwn.call(entry, "finallyLoc") &&
	            this.prev < entry.finallyLoc) {
	          var finallyEntry = entry;
	          break;
	        }
	      }

	      if (finallyEntry &&
	          (type === "break" ||
	           type === "continue") &&
	          finallyEntry.tryLoc <= arg &&
	          arg <= finallyEntry.finallyLoc) {
	        // Ignore the finally entry if control is not jumping to a
	        // location outside the try/catch block.
	        finallyEntry = null;
	      }

	      var record = finallyEntry ? finallyEntry.completion : {};
	      record.type = type;
	      record.arg = arg;

	      if (finallyEntry) {
	        this.next = finallyEntry.finallyLoc;
	      } else {
	        this.complete(record);
	      }

	      return ContinueSentinel;
	    },

	    complete: function(record, afterLoc) {
	      if (record.type === "throw") {
	        throw record.arg;
	      }

	      if (record.type === "break" ||
	          record.type === "continue") {
	        this.next = record.arg;
	      } else if (record.type === "return") {
	        this.rval = record.arg;
	        this.next = "end";
	      } else if (record.type === "normal" && afterLoc) {
	        this.next = afterLoc;
	      }
	    },

	    finish: function(finallyLoc) {
	      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
	        var entry = this.tryEntries[i];
	        if (entry.finallyLoc === finallyLoc) {
	          this.complete(entry.completion, entry.afterLoc);
	          resetTryEntry(entry);
	          return ContinueSentinel;
	        }
	      }
	    },

	    "catch": function(tryLoc) {
	      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
	        var entry = this.tryEntries[i];
	        if (entry.tryLoc === tryLoc) {
	          var record = entry.completion;
	          if (record.type === "throw") {
	            var thrown = record.arg;
	            resetTryEntry(entry);
	          }
	          return thrown;
	        }
	      }

	      // The context.catch method must only be called with a location
	      // argument that corresponds to a known catch block.
	      throw new Error("illegal catch attempt");
	    },

	    delegateYield: function(iterable, resultName, nextLoc) {
	      this.delegate = {
	        iterator: values(iterable),
	        resultName: resultName,
	        nextLoc: nextLoc
	      };

	      return ContinueSentinel;
	    }
	  };
	})(
	  // Among the various tricks for obtaining a reference to the global
	  // object, this seems to be the most reliable technique that does not
	  // use indirect eval (which violates Content Security Policy).
	  typeof global === "object" ? global :
	  typeof window === "object" ? window :
	  typeof self === "object" ? self : this
	);

	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }()), __webpack_require__(2)))

/***/ },
/* 2 */
/***/ function(module, exports) {

	// shim for using process in browser
	var process = module.exports = {};

	// cached from whatever global is present so that test runners that stub it
	// don't break things.  But we need to wrap it in a try catch in case it is
	// wrapped in strict mode code which doesn't define any globals.  It's inside a
	// function because try/catches deoptimize in certain engines.

	var cachedSetTimeout;
	var cachedClearTimeout;

	function defaultSetTimout() {
	    throw new Error('setTimeout has not been defined');
	}
	function defaultClearTimeout () {
	    throw new Error('clearTimeout has not been defined');
	}
	(function () {
	    try {
	        if (typeof setTimeout === 'function') {
	            cachedSetTimeout = setTimeout;
	        } else {
	            cachedSetTimeout = defaultSetTimout;
	        }
	    } catch (e) {
	        cachedSetTimeout = defaultSetTimout;
	    }
	    try {
	        if (typeof clearTimeout === 'function') {
	            cachedClearTimeout = clearTimeout;
	        } else {
	            cachedClearTimeout = defaultClearTimeout;
	        }
	    } catch (e) {
	        cachedClearTimeout = defaultClearTimeout;
	    }
	} ())
	function runTimeout(fun) {
	    if (cachedSetTimeout === setTimeout) {
	        //normal enviroments in sane situations
	        return setTimeout(fun, 0);
	    }
	    // if setTimeout wasn't available but was latter defined
	    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
	        cachedSetTimeout = setTimeout;
	        return setTimeout(fun, 0);
	    }
	    try {
	        // when when somebody has screwed with setTimeout but no I.E. maddness
	        return cachedSetTimeout(fun, 0);
	    } catch(e){
	        try {
	            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
	            return cachedSetTimeout.call(null, fun, 0);
	        } catch(e){
	            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
	            return cachedSetTimeout.call(this, fun, 0);
	        }
	    }


	}
	function runClearTimeout(marker) {
	    if (cachedClearTimeout === clearTimeout) {
	        //normal enviroments in sane situations
	        return clearTimeout(marker);
	    }
	    // if clearTimeout wasn't available but was latter defined
	    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
	        cachedClearTimeout = clearTimeout;
	        return clearTimeout(marker);
	    }
	    try {
	        // when when somebody has screwed with setTimeout but no I.E. maddness
	        return cachedClearTimeout(marker);
	    } catch (e){
	        try {
	            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
	            return cachedClearTimeout.call(null, marker);
	        } catch (e){
	            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
	            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
	            return cachedClearTimeout.call(this, marker);
	        }
	    }



	}
	var queue = [];
	var draining = false;
	var currentQueue;
	var queueIndex = -1;

	function cleanUpNextTick() {
	    if (!draining || !currentQueue) {
	        return;
	    }
	    draining = false;
	    if (currentQueue.length) {
	        queue = currentQueue.concat(queue);
	    } else {
	        queueIndex = -1;
	    }
	    if (queue.length) {
	        drainQueue();
	    }
	}

	function drainQueue() {
	    if (draining) {
	        return;
	    }
	    var timeout = runTimeout(cleanUpNextTick);
	    draining = true;

	    var len = queue.length;
	    while(len) {
	        currentQueue = queue;
	        queue = [];
	        while (++queueIndex < len) {
	            if (currentQueue) {
	                currentQueue[queueIndex].run();
	            }
	        }
	        queueIndex = -1;
	        len = queue.length;
	    }
	    currentQueue = null;
	    draining = false;
	    runClearTimeout(timeout);
	}

	process.nextTick = function (fun) {
	    var args = new Array(arguments.length - 1);
	    if (arguments.length > 1) {
	        for (var i = 1; i < arguments.length; i++) {
	            args[i - 1] = arguments[i];
	        }
	    }
	    queue.push(new Item(fun, args));
	    if (queue.length === 1 && !draining) {
	        runTimeout(drainQueue);
	    }
	};

	// v8 likes predictible objects
	function Item(fun, array) {
	    this.fun = fun;
	    this.array = array;
	}
	Item.prototype.run = function () {
	    this.fun.apply(null, this.array);
	};
	process.title = 'browser';
	process.browser = true;
	process.env = {};
	process.argv = [];
	process.version = ''; // empty string to avoid regexp issues
	process.versions = {};

	function noop() {}

	process.on = noop;
	process.addListener = noop;
	process.once = noop;
	process.off = noop;
	process.removeListener = noop;
	process.removeAllListeners = noop;
	process.emit = noop;

	process.binding = function (name) {
	    throw new Error('process.binding is not supported');
	};

	process.cwd = function () { return '/' };
	process.chdir = function (dir) {
	    throw new Error('process.chdir is not supported');
	};
	process.umask = function() { return 0; };


/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _inferno = __webpack_require__(4);

	var _inferno2 = _interopRequireDefault(_inferno);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

	var message = "Hello world";

	var loadData = function () {
	  var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(url) {
	    var response, data;
	    return regeneratorRuntime.wrap(function _callee$(_context) {
	      while (1) {
	        switch (_context.prev = _context.next) {
	          case 0:
	            _context.prev = 0;
	            _context.next = 3;
	            return fetch(url);

	          case 3:
	            response = _context.sent;
	            _context.next = 6;
	            return response.json();

	          case 6:
	            data = _context.sent;

	            console.log(data);
	            return _context.abrupt('return', data);

	          case 11:
	            _context.prev = 11;
	            _context.t0 = _context['catch'](0);

	            console.error('Error loading petitions data.');
	            return _context.abrupt('return', null);

	          case 15:
	          case 'end':
	            return _context.stop();
	        }
	      }
	    }, _callee, undefined, [[0, 11]]);
	  }));

	  return function loadData(_x) {
	    return _ref.apply(this, arguments);
	  };
	}();

	var renderFromJSON = function () {
	  var _ref2 = _asyncToGenerator(regeneratorRuntime.mark(function _callee2(url) {
	    var data;
	    return regeneratorRuntime.wrap(function _callee2$(_context2) {
	      while (1) {
	        switch (_context2.prev = _context2.next) {
	          case 0:
	            _context2.next = 2;
	            return loadData(url);

	          case 2:
	            _context2.t0 = _context2.sent;

	            if (_context2.t0) {
	              _context2.next = 5;
	              break;
	            }

	            _context2.t0 = null;

	          case 5:
	            data = _context2.t0;

	            _inferno2.default.render((0, _inferno.createVNode)(2, 'h1', null, data.length), document.getElementById("ukpi"));

	          case 7:
	          case 'end':
	            return _context2.stop();
	        }
	      }
	    }, _callee2, undefined);
	  }));

	  return function renderFromJSON(_x2) {
	    return _ref2.apply(this, arguments);
	  };
	}();

		renderFromJSON('petitions.json');

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(5);
	module.exports.default = module.exports;

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {/*!
	 * inferno v1.2.2
	 * (c) 2017 Dominic Gannaway
	 * Released under the MIT License.
	 */
	(function (global, factory) {
		 true ? factory(exports) :
		typeof define === 'function' && define.amd ? define(['exports'], factory) :
		(factory((global.Inferno = global.Inferno || {})));
	}(this, (function (exports) { 'use strict';

	var NO_OP = '$NO_OP';
	var ERROR_MSG = 'a runtime error occured! Use Inferno in development environment to find the error.';
	var isBrowser = typeof window !== 'undefined' && window.document;

	// this is MUCH faster than .constructor === Array and instanceof Array
	// in Node 7 and the later versions of V8, slower in older versions though
	var isArray = Array.isArray;
	function isStatefulComponent(o) {
	    return !isUndefined(o.prototype) && !isUndefined(o.prototype.render);
	}
	function isStringOrNumber(obj) {
	    var type = typeof obj;
	    return type === 'string' || type === 'number';
	}
	function isNullOrUndef(obj) {
	    return isUndefined(obj) || isNull(obj);
	}
	function isInvalid(obj) {
	    return isNull(obj) || obj === false || isTrue(obj) || isUndefined(obj);
	}
	function isFunction(obj) {
	    return typeof obj === 'function';
	}
	function isAttrAnEvent(attr) {
	    return attr[0] === 'o' && attr[1] === 'n' && attr.length > 3;
	}
	function isString(obj) {
	    return typeof obj === 'string';
	}
	function isNumber(obj) {
	    return typeof obj === 'number';
	}
	function isNull(obj) {
	    return obj === null;
	}
	function isTrue(obj) {
	    return obj === true;
	}
	function isUndefined(obj) {
	    return obj === undefined;
	}
	function isObject(o) {
	    return typeof o === 'object';
	}
	function throwError(message) {
	    if (!message) {
	        message = ERROR_MSG;
	    }
	    throw new Error(("Inferno Error: " + message));
	}
	function warning(message) {
	    console.warn(message);
	}
	var EMPTY_OBJ = {};

	function applyKey(key, vNode) {
	    vNode.key = key;
	    return vNode;
	}
	function applyKeyIfMissing(key, vNode) {
	    if (isNumber(key)) {
	        key = "." + key;
	    }
	    if (isNull(vNode.key) || vNode.key[0] === '.') {
	        return applyKey(key, vNode);
	    }
	    return vNode;
	}
	function applyKeyPrefix(key, vNode) {
	    vNode.key = key + vNode.key;
	    return vNode;
	}
	function _normalizeVNodes(nodes, result, index, currentKey) {
	    for (; index < nodes.length; index++) {
	        var n = nodes[index];
	        var key = currentKey + "." + index;
	        if (!isInvalid(n)) {
	            if (isArray(n)) {
	                _normalizeVNodes(n, result, 0, key);
	            }
	            else {
	                if (isStringOrNumber(n)) {
	                    n = createTextVNode(n);
	                }
	                else if (isVNode(n) && n.dom || (n.key && n.key[0] === '.')) {
	                    n = cloneVNode(n);
	                }
	                if (isNull(n.key) || n.key[0] === '.') {
	                    n = applyKey(key, n);
	                }
	                else {
	                    n = applyKeyPrefix(currentKey, n);
	                }
	                result.push(n);
	            }
	        }
	    }
	}
	function normalizeVNodes(nodes) {
	    var newNodes;
	    // we assign $ which basically means we've flagged this array for future note
	    // if it comes back again, we need to clone it, as people are using it
	    // in an immutable way
	    // tslint:disable
	    if (nodes['$']) {
	        nodes = nodes.slice();
	    }
	    else {
	        nodes['$'] = true;
	    }
	    // tslint:enable
	    for (var i = 0; i < nodes.length; i++) {
	        var n = nodes[i];
	        if (isInvalid(n) || isArray(n)) {
	            var result = (newNodes || nodes).slice(0, i);
	            _normalizeVNodes(nodes, result, i, "");
	            return result;
	        }
	        else if (isStringOrNumber(n)) {
	            if (!newNodes) {
	                newNodes = nodes.slice(0, i);
	            }
	            newNodes.push(applyKeyIfMissing(i, createTextVNode(n)));
	        }
	        else if ((isVNode(n) && n.dom) || (isNull(n.key) && !(n.flags & 64 /* HasNonKeyedChildren */))) {
	            if (!newNodes) {
	                newNodes = nodes.slice(0, i);
	            }
	            newNodes.push(applyKeyIfMissing(i, cloneVNode(n)));
	        }
	        else if (newNodes) {
	            newNodes.push(applyKeyIfMissing(i, cloneVNode(n)));
	        }
	    }
	    return newNodes || nodes;
	}
	function normalizeChildren(children) {
	    if (isArray(children)) {
	        return normalizeVNodes(children);
	    }
	    else if (isVNode(children) && children.dom) {
	        return cloneVNode(children);
	    }
	    return children;
	}
	function normalizeProps(vNode, props, children) {
	    if (!(vNode.flags & 28 /* Component */) && isNullOrUndef(children) && !isNullOrUndef(props.children)) {
	        vNode.children = props.children;
	    }
	    if (props.ref) {
	        vNode.ref = props.ref;
	        delete props.ref;
	    }
	    if (props.events) {
	        vNode.events = props.events;
	    }
	    if (!isNullOrUndef(props.key)) {
	        vNode.key = props.key;
	        delete props.key;
	    }
	}
	function copyPropsTo(copyFrom, copyTo) {
	    for (var prop in copyFrom) {
	        if (isUndefined(copyTo[prop])) {
	            copyTo[prop] = copyFrom[prop];
	        }
	    }
	}
	function normalizeElement(type, vNode) {
	    if (type === 'svg') {
	        vNode.flags = 128 /* SvgElement */;
	    }
	    else if (type === 'input') {
	        vNode.flags = 512 /* InputElement */;
	    }
	    else if (type === 'select') {
	        vNode.flags = 2048 /* SelectElement */;
	    }
	    else if (type === 'textarea') {
	        vNode.flags = 1024 /* TextareaElement */;
	    }
	    else if (type === 'media') {
	        vNode.flags = 256 /* MediaElement */;
	    }
	    else {
	        vNode.flags = 2 /* HtmlElement */;
	    }
	}
	function normalize(vNode) {
	    var props = vNode.props;
	    var hasProps = !isNull(props);
	    var type = vNode.type;
	    var children = vNode.children;
	    // convert a wrongly created type back to element
	    if (isString(type) && (vNode.flags & 28 /* Component */)) {
	        normalizeElement(type, vNode);
	        if (hasProps && props.children) {
	            vNode.children = props.children;
	            children = props.children;
	        }
	    }
	    if (hasProps) {
	        normalizeProps(vNode, props, children);
	    }
	    if (!isInvalid(children)) {
	        vNode.children = normalizeChildren(children);
	    }
	    if (hasProps && !isInvalid(props.children)) {
	        props.children = normalizeChildren(props.children);
	    }
	    if (process.env.NODE_ENV !== 'production') {
	        // This code will be stripped out from production CODE
	        // It will help users to track errors in their applications.
	        var verifyKeys = function (vNodes) {
	            var keyValues = vNodes.map(function (vnode) { return vnode.key; });
	            keyValues.some(function (item, idx) {
	                var hasDuplicate = keyValues.indexOf(item) !== idx;
	                if (hasDuplicate) {
	                    warning('Inferno normalisation(...): Encountered two children with same key, all keys must be unique within its siblings. Duplicated key is:' + item);
	                }
	                return hasDuplicate;
	            });
	        };
	        if (vNode.children && Array.isArray(vNode.children)) {
	            verifyKeys(vNode.children);
	        }
	    }
	}

	var options = {
	    recyclingEnabled: true,
	    findDOMNodeEnabled: false,
	    roots: null,
	    createVNode: null,
	    beforeRender: null,
	    afterRender: null,
	    afterMount: null,
	    afterUpdate: null,
	    beforeUnmount: null
	};

	function createVNode(flags, type, props, children, events, key, ref, noNormalise) {
	    if (flags & 16 /* ComponentUnknown */) {
	        flags = isStatefulComponent(type) ? 4 /* ComponentClass */ : 8 /* ComponentFunction */;
	    }
	    var vNode = {
	        children: isUndefined(children) ? null : children,
	        dom: null,
	        events: events || null,
	        flags: flags,
	        key: isUndefined(key) ? null : key,
	        props: props || null,
	        ref: ref || null,
	        type: type
	    };
	    if (!noNormalise) {
	        normalize(vNode);
	    }
	    if (options.createVNode) {
	        options.createVNode(vNode);
	    }
	    return vNode;
	}
	function cloneVNode(vNodeToClone, props) {
	    var _children = [], len = arguments.length - 2;
	    while ( len-- > 0 ) _children[ len ] = arguments[ len + 2 ];

	    var children = _children;
	    if (_children.length > 0 && !isNull(_children[0])) {
	        if (!props) {
	            props = {};
	        }
	        if (_children.length === 1) {
	            children = _children[0];
	        }
	        if (isUndefined(props.children)) {
	            props.children = children;
	        }
	        else {
	            if (isArray(children)) {
	                if (isArray(props.children)) {
	                    props.children = props.children.concat(children);
	                }
	                else {
	                    props.children = [props.children].concat(children);
	                }
	            }
	            else {
	                if (isArray(props.children)) {
	                    props.children.push(children);
	                }
	                else {
	                    props.children = [props.children];
	                    props.children.push(children);
	                }
	            }
	        }
	    }
	    children = null;
	    var newVNode;
	    if (isArray(vNodeToClone)) {
	        var tmpArray = [];
	        for (var i = 0; i < vNodeToClone.length; i++) {
	            tmpArray.push(cloneVNode(vNodeToClone[i]));
	        }
	        newVNode = tmpArray;
	    }
	    else {
	        var flags = vNodeToClone.flags;
	        var events = vNodeToClone.events || (props && props.events) || null;
	        var key = !isNullOrUndef(vNodeToClone.key) ? vNodeToClone.key : (props ? props.key : null);
	        var ref = vNodeToClone.ref || (props ? props.ref : null);
	        if (flags & 28 /* Component */) {
	            newVNode = createVNode(flags, vNodeToClone.type, Object.assign({}, vNodeToClone.props, props), null, events, key, ref, true);
	            var newProps = newVNode.props;
	            if (newProps) {
	                var newChildren = newProps.children;
	                // we need to also clone component children that are in props
	                // as the children may also have been hoisted
	                if (newChildren) {
	                    if (isArray(newChildren)) {
	                        for (var i$1 = 0; i$1 < newChildren.length; i$1++) {
	                            var child = newChildren[i$1];
	                            if (!isInvalid(child) && isVNode(child)) {
	                                newProps.children[i$1] = cloneVNode(child);
	                            }
	                        }
	                    }
	                    else if (isVNode(newChildren)) {
	                        newProps.children = cloneVNode(newChildren);
	                    }
	                }
	            }
	            newVNode.children = null;
	        }
	        else if (flags & 3970 /* Element */) {
	            children = (props && props.children) || vNodeToClone.children;
	            newVNode = createVNode(flags, vNodeToClone.type, Object.assign({}, vNodeToClone.props, props), children, events, key, ref, !children);
	        }
	        else if (flags & 1 /* Text */) {
	            newVNode = createTextVNode(vNodeToClone.children);
	        }
	    }
	    return newVNode;
	}
	function createVoidVNode() {
	    return createVNode(4096 /* Void */);
	}
	function createTextVNode(text) {
	    return createVNode(1 /* Text */, null, null, text, null, null, null, true);
	}
	function isVNode(o) {
	    return !!o.flags;
	}

	function constructDefaults(string, object, value) {
	    /* eslint no-return-assign: 0 */
	    string.split(',').forEach(function (i) { return object[i] = value; });
	}
	var xlinkNS = 'http://www.w3.org/1999/xlink';
	var xmlNS = 'http://www.w3.org/XML/1998/namespace';
	var svgNS = 'http://www.w3.org/2000/svg';
	var strictProps = {};
	var booleanProps = {};
	var namespaces = {};
	var isUnitlessNumber = {};
	var skipProps = {};
	var dehyphenProps = {
	    httpEquiv: 'http-equiv',
	    acceptCharset: 'accept-charset'
	};
	var probablyKebabProps = /^(accentH|arabicF|capH|font[FSVW]|glyph[NO]|horiz[AO]|panose1|renderingI|strikethrough[PT]|underline[PT]|v[AHIM]|vert[AO]|xH|alignmentB|baselineS|clip[PR]|color[IPR]|dominantB|enableB|fill[OR]|flood[COF]|imageR|letterS|lightingC|marker[EMS]|pointerE|shapeR|stop[CO]|stroke[DLMOW]|text[ADR]|unicodeB|wordS|writingM).*/;
	function kebabize(str, smallLetter, largeLetter) {
	    return (smallLetter + "-" + (largeLetter.toLowerCase()));
	}
	var delegatedProps = {};
	constructDefaults('xlink:href,xlink:arcrole,xlink:actuate,xlink:role,xlink:titlef,xlink:type', namespaces, xlinkNS);
	constructDefaults('xml:base,xml:lang,xml:space', namespaces, xmlNS);
	constructDefaults('volume,defaultValue,defaultChecked', strictProps, true);
	constructDefaults('children,childrenType,ref,key,selected,checked,multiple', skipProps, true);
	constructDefaults('onClick,onMouseDown,onMouseUp,onMouseMove,onSubmit,onDblClick,onKeyDown,onKeyUp,onKeyPress', delegatedProps, true);
	constructDefaults('muted,scoped,loop,open,checked,default,capture,disabled,readOnly,required,autoplay,controls,seamless,reversed,allowfullscreen,novalidate,hidden', booleanProps, true);
	constructDefaults('animationIterationCount,borderImageOutset,borderImageSlice,borderImageWidth,boxFlex,boxFlexGroup,boxOrdinalGroup,columnCount,flex,flexGrow,flexPositive,flexShrink,flexNegative,flexOrder,gridRow,gridColumn,fontWeight,lineClamp,lineHeight,opacity,order,orphans,tabSize,widows,zIndex,zoom,fillOpacity,floodOpacity,stopOpacity,strokeDasharray,strokeDashoffset,strokeMiterlimit,strokeOpacity,strokeWidth,', isUnitlessNumber, true);

	var Lifecycle = function Lifecycle() {
	    this.listeners = [];
	    this.fastUnmount = true;
	};
	Lifecycle.prototype.addListener = function addListener (callback) {
	    this.listeners.push(callback);
	};
	Lifecycle.prototype.trigger = function trigger () {
	        var this$1 = this;

	    for (var i = 0; i < this.listeners.length; i++) {
	        this$1.listeners[i]();
	    }
	};

	var isiOS = isBrowser && !!navigator.platform && /iPad|iPhone|iPod/.test(navigator.platform);
	var delegatedEvents = new Map();
	function handleEvent(name, lastEvent, nextEvent, dom) {
	    var delegatedRoots = delegatedEvents.get(name);
	    if (nextEvent) {
	        if (!delegatedRoots) {
	            delegatedRoots = { items: new Map(), count: 0, docEvent: null };
	            var docEvent = attachEventToDocument(name, delegatedRoots);
	            delegatedRoots.docEvent = docEvent;
	            delegatedEvents.set(name, delegatedRoots);
	        }
	        if (!lastEvent) {
	            delegatedRoots.count++;
	            if (isiOS && name === 'onClick') {
	                trapClickOnNonInteractiveElement(dom);
	            }
	        }
	        delegatedRoots.items.set(dom, nextEvent);
	    }
	    else if (delegatedRoots) {
	        if (delegatedRoots.items.has(dom)) {
	            delegatedRoots.count--;
	            delegatedRoots.items.delete(dom);
	            if (delegatedRoots.count === 0) {
	                document.removeEventListener(normalizeEventName(name), delegatedRoots.docEvent);
	                delegatedEvents.delete(name);
	            }
	        }
	    }
	}
	function dispatchEvent(event, dom, items, count, eventData) {
	    var eventsToTrigger = items.get(dom);
	    if (eventsToTrigger) {
	        count--;
	        // linkEvent object
	        eventData.dom = dom;
	        if (eventsToTrigger.event) {
	            eventsToTrigger.event(eventsToTrigger.data, event);
	        }
	        else {
	            eventsToTrigger(event);
	        }
	        if (eventData.stopPropagation) {
	            return;
	        }
	    }
	    if (count > 0) {
	        var parentDom = dom.parentNode;
	        if (parentDom || parentDom === document.body) {
	            dispatchEvent(event, parentDom, items, count, eventData);
	        }
	    }
	}
	function normalizeEventName(name) {
	    return name.substr(2).toLowerCase();
	}
	function attachEventToDocument(name, delegatedRoots) {
	    var docEvent = function (event) {
	        var eventData = {
	            stopPropagation: false,
	            dom: document
	        };
	        // we have to do this as some browsers recycle the same Event between calls
	        // so we need to make the property configurable
	        Object.defineProperty(event, 'currentTarget', {
	            configurable: true,
	            get: function get() {
	                return eventData.dom;
	            }
	        });
	        event.stopPropagation = function () {
	            eventData.stopPropagation = true;
	        };
	        var count = delegatedRoots.count;
	        if (count > 0) {
	            dispatchEvent(event, event.target, delegatedRoots.items, count, eventData);
	        }
	    };
	    document.addEventListener(normalizeEventName(name), docEvent);
	    return docEvent;
	}
	function emptyFn() { }
	function trapClickOnNonInteractiveElement(dom) {
	    // Mobile Safari does not fire properly bubble click events on
	    // non-interactive elements, which means delegated click listeners do not
	    // fire. The workaround for this bug involves attaching an empty click
	    // listener on the target node.
	    // http://www.quirksmode.org/blog/archives/2010/09/click_event_del.html
	    // Just set it using the onclick property so that we don't have to manage any
	    // bookkeeping for it. Not sure if we need to clear it when the listener is
	    // removed.
	    // TODO: Only do this for the relevant Safaris maybe?
	    dom.onclick = emptyFn;
	}

	var componentPools = new Map();
	var elementPools = new Map();
	function recycleElement(vNode, lifecycle, context, isSVG) {
	    var tag = vNode.type;
	    var key = vNode.key;
	    var pools = elementPools.get(tag);
	    if (!isUndefined(pools)) {
	        var pool = key === null ? pools.nonKeyed : pools.keyed.get(key);
	        if (!isUndefined(pool)) {
	            var recycledVNode = pool.pop();
	            if (!isUndefined(recycledVNode)) {
	                patchElement(recycledVNode, vNode, null, lifecycle, context, isSVG, true);
	                return vNode.dom;
	            }
	        }
	    }
	    return null;
	}
	function poolElement(vNode) {
	    var tag = vNode.type;
	    var key = vNode.key;
	    var pools = elementPools.get(tag);
	    if (isUndefined(pools)) {
	        pools = {
	            nonKeyed: [],
	            keyed: new Map()
	        };
	        elementPools.set(tag, pools);
	    }
	    if (isNull(key)) {
	        pools.nonKeyed.push(vNode);
	    }
	    else {
	        var pool = pools.keyed.get(key);
	        if (isUndefined(pool)) {
	            pool = [];
	            pools.keyed.set(key, pool);
	        }
	        pool.push(vNode);
	    }
	}
	function recycleComponent(vNode, lifecycle, context, isSVG) {
	    var type = vNode.type;
	    var key = vNode.key;
	    var pools = componentPools.get(type);
	    if (!isUndefined(pools)) {
	        var pool = key === null ? pools.nonKeyed : pools.keyed.get(key);
	        if (!isUndefined(pool)) {
	            var recycledVNode = pool.pop();
	            if (!isUndefined(recycledVNode)) {
	                var flags = vNode.flags;
	                var failed = patchComponent(recycledVNode, vNode, null, lifecycle, context, isSVG, flags & 4 /* ComponentClass */, true);
	                if (!failed) {
	                    return vNode.dom;
	                }
	            }
	        }
	    }
	    return null;
	}
	function poolComponent(vNode) {
	    var type = vNode.type;
	    var key = vNode.key;
	    var hooks = vNode.ref;
	    var nonRecycleHooks = hooks && (hooks.onComponentWillMount ||
	        hooks.onComponentWillUnmount ||
	        hooks.onComponentDidMount ||
	        hooks.onComponentWillUpdate ||
	        hooks.onComponentDidUpdate);
	    if (nonRecycleHooks) {
	        return;
	    }
	    var pools = componentPools.get(type);
	    if (isUndefined(pools)) {
	        pools = {
	            nonKeyed: [],
	            keyed: new Map()
	        };
	        componentPools.set(type, pools);
	    }
	    if (isNull(key)) {
	        pools.nonKeyed.push(vNode);
	    }
	    else {
	        var pool = pools.keyed.get(key);
	        if (isUndefined(pool)) {
	            pool = [];
	            pools.keyed.set(key, pool);
	        }
	        pool.push(vNode);
	    }
	}

	function unmount(vNode, parentDom, lifecycle, canRecycle, isRecycling) {
	    var flags = vNode.flags;
	    if (flags & 28 /* Component */) {
	        unmountComponent(vNode, parentDom, lifecycle, canRecycle, isRecycling);
	    }
	    else if (flags & 3970 /* Element */) {
	        unmountElement(vNode, parentDom, lifecycle, canRecycle, isRecycling);
	    }
	    else if (flags & (1 /* Text */ | 4096 /* Void */)) {
	        unmountVoidOrText(vNode, parentDom);
	    }
	}
	function unmountVoidOrText(vNode, parentDom) {
	    if (parentDom) {
	        removeChild(parentDom, vNode.dom);
	    }
	}
	var alreadyUnmounted = new WeakMap();
	function unmountComponent(vNode, parentDom, lifecycle, canRecycle, isRecycling) {
	    var instance = vNode.children;
	    var flags = vNode.flags;
	    var isStatefulComponent$$1 = flags & 4;
	    var ref = vNode.ref;
	    var dom = vNode.dom;
	    if (alreadyUnmounted.has(vNode) && !isRecycling && !parentDom) {
	        return;
	    }
	    alreadyUnmounted.set(vNode);
	    if (!isRecycling) {
	        if (isStatefulComponent$$1) {
	            if (!instance._unmounted) {
	                instance._ignoreSetState = true;
	                options.beforeUnmount && options.beforeUnmount(vNode);
	                instance.componentWillUnmount && instance.componentWillUnmount();
	                if (ref && !isRecycling) {
	                    ref(null);
	                }
	                instance._unmounted = true;
	                options.findDOMNodeEnabled && componentToDOMNodeMap.delete(instance);
	                var subLifecycle = instance._lifecycle;
	                if (!subLifecycle.fastUnmount) {
	                    unmount(instance._lastInput, null, subLifecycle, false, isRecycling);
	                }
	            }
	        }
	        else {
	            if (!isNullOrUndef(ref)) {
	                if (!isNullOrUndef(ref.onComponentWillUnmount)) {
	                    ref.onComponentWillUnmount(dom);
	                }
	            }
	            if (!lifecycle.fastUnmount) {
	                unmount(instance, null, lifecycle, false, isRecycling);
	            }
	        }
	    }
	    if (parentDom) {
	        var lastInput = instance._lastInput;
	        if (isNullOrUndef(lastInput)) {
	            lastInput = instance;
	        }
	        removeChild(parentDom, dom);
	    }
	    if (options.recyclingEnabled && !isStatefulComponent$$1 && (parentDom || canRecycle)) {
	        poolComponent(vNode);
	    }
	}
	function unmountElement(vNode, parentDom, lifecycle, canRecycle, isRecycling) {
	    var dom = vNode.dom;
	    var ref = vNode.ref;
	    var events = vNode.events;
	    if (alreadyUnmounted.has(vNode) && !isRecycling && !parentDom) {
	        return;
	    }
	    alreadyUnmounted.set(vNode);
	    if (!lifecycle.fastUnmount) {
	        if (ref && !isRecycling) {
	            unmountRef(ref);
	        }
	        var children = vNode.children;
	        if (!isNullOrUndef(children)) {
	            unmountChildren$1(children, lifecycle, isRecycling);
	        }
	    }
	    if (!isNull(events)) {
	        for (var name in events) {
	            // do not add a hasOwnProperty check here, it affects performance
	            patchEvent(name, events[name], null, dom);
	            events[name] = null;
	        }
	    }
	    if (parentDom) {
	        removeChild(parentDom, dom);
	    }
	    if (options.recyclingEnabled && (parentDom || canRecycle)) {
	        poolElement(vNode);
	    }
	}
	function unmountChildren$1(children, lifecycle, isRecycling) {
	    if (isArray(children)) {
	        for (var i = 0; i < children.length; i++) {
	            var child = children[i];
	            if (!isInvalid(child) && isObject(child)) {
	                unmount(child, null, lifecycle, false, isRecycling);
	            }
	        }
	    }
	    else if (isObject(children)) {
	        unmount(children, null, lifecycle, false, isRecycling);
	    }
	}
	function unmountRef(ref) {
	    if (isFunction(ref)) {
	        ref(null);
	    }
	    else {
	        if (isInvalid(ref)) {
	            return;
	        }
	        if (process.env.NODE_ENV !== 'production') {
	            throwError('string "refs" are not supported in Inferno 1.0. Use callback "refs" instead.');
	        }
	        throwError();
	    }
	}

	function createClassComponentInstance(vNode, Component, props, context, isSVG) {
	    if (isUndefined(context)) {
	        context = {};
	    }
	    var instance = new Component(props, context);
	    instance.context = context;
	    if (instance.props === EMPTY_OBJ) {
	        instance.props = props;
	    }
	    instance._patch = patch;
	    if (options.findDOMNodeEnabled) {
	        instance._componentToDOMNodeMap = componentToDOMNodeMap;
	    }
	    instance._unmounted = false;
	    instance._pendingSetState = true;
	    instance._isSVG = isSVG;
	    if (isFunction(instance.componentWillMount)) {
	        instance.componentWillMount();
	    }
	    var childContext = instance.getChildContext();
	    if (!isNullOrUndef(childContext)) {
	        instance._childContext = Object.assign({}, context, childContext);
	    }
	    else {
	        instance._childContext = context;
	    }
	    options.beforeRender && options.beforeRender(instance);
	    var input = instance.render(props, instance.state, context);
	    options.afterRender && options.afterRender(instance);
	    if (isArray(input)) {
	        if (process.env.NODE_ENV !== 'production') {
	            throwError('a valid Inferno VNode (or null) must be returned from a component render. You may have returned an array or an invalid object.');
	        }
	        throwError();
	    }
	    else if (isInvalid(input)) {
	        input = createVoidVNode();
	    }
	    else if (isStringOrNumber(input)) {
	        input = createTextVNode(input);
	    }
	    else {
	        if (input.dom) {
	            input = cloneVNode(input);
	        }
	        if (input.flags & 28 /* Component */) {
	            // if we have an input that is also a component, we run into a tricky situation
	            // where the root vNode needs to always have the correct DOM entry
	            // so we break monomorphism on our input and supply it our vNode as parentVNode
	            // we can optimise this in the future, but this gets us out of a lot of issues
	            input.parentVNode = vNode;
	        }
	    }
	    instance._pendingSetState = false;
	    instance._lastInput = input;
	    return instance;
	}
	function replaceLastChildAndUnmount(lastInput, nextInput, parentDom, lifecycle, context, isSVG, isRecycling) {
	    replaceVNode(parentDom, mount(nextInput, null, lifecycle, context, isSVG), lastInput, lifecycle, isRecycling);
	}
	function replaceVNode(parentDom, dom, vNode, lifecycle, isRecycling) {
	    var shallowUnmount = false;
	    // we cannot cache nodeType here as vNode might be re-assigned below
	    if (vNode.flags & 28 /* Component */) {
	        // if we are accessing a stateful or stateless component, we want to access their last rendered input
	        // accessing their DOM node is not useful to us here
	        unmount(vNode, null, lifecycle, false, isRecycling);
	        vNode = vNode.children._lastInput || vNode.children;
	        shallowUnmount = true;
	    }
	    replaceChild(parentDom, dom, vNode.dom);
	    unmount(vNode, null, lifecycle, false, isRecycling);
	}
	function createFunctionalComponentInput(vNode, component, props, context) {
	    var input = component(props, context);
	    if (isArray(input)) {
	        if (process.env.NODE_ENV !== 'production') {
	            throwError('a valid Inferno VNode (or null) must be returned from a component render. You may have returned an array or an invalid object.');
	        }
	        throwError();
	    }
	    else if (isInvalid(input)) {
	        input = createVoidVNode();
	    }
	    else if (isStringOrNumber(input)) {
	        input = createTextVNode(input);
	    }
	    else {
	        if (input.dom) {
	            input = cloneVNode(input);
	        }
	        if (input.flags & 28 /* Component */) {
	            // if we have an input that is also a component, we run into a tricky situation
	            // where the root vNode needs to always have the correct DOM entry
	            // so we break monomorphism on our input and supply it our vNode as parentVNode
	            // we can optimise this in the future, but this gets us out of a lot of issues
	            input.parentVNode = vNode;
	        }
	    }
	    return input;
	}
	function setTextContent(dom, text) {
	    if (text !== '') {
	        dom.textContent = text;
	    }
	    else {
	        dom.appendChild(document.createTextNode(''));
	    }
	}
	function updateTextContent(dom, text) {
	    dom.firstChild.nodeValue = text;
	}
	function appendChild(parentDom, dom) {
	    parentDom.appendChild(dom);
	}
	function insertOrAppend(parentDom, newNode, nextNode) {
	    if (isNullOrUndef(nextNode)) {
	        appendChild(parentDom, newNode);
	    }
	    else {
	        parentDom.insertBefore(newNode, nextNode);
	    }
	}
	function documentCreateElement(tag, isSVG) {
	    if (isSVG === true) {
	        return document.createElementNS(svgNS, tag);
	    }
	    else {
	        return document.createElement(tag);
	    }
	}
	function replaceWithNewNode(lastNode, nextNode, parentDom, lifecycle, context, isSVG, isRecycling) {
	    unmount(lastNode, null, lifecycle, false, isRecycling);
	    var dom = mount(nextNode, null, lifecycle, context, isSVG);
	    nextNode.dom = dom;
	    replaceChild(parentDom, dom, lastNode.dom);
	}
	function replaceChild(parentDom, nextDom, lastDom) {
	    if (!parentDom) {
	        parentDom = lastDom.parentNode;
	    }
	    parentDom.replaceChild(nextDom, lastDom);
	}
	function removeChild(parentDom, dom) {
	    parentDom.removeChild(dom);
	}
	function removeAllChildren(dom, children, lifecycle, isRecycling) {
	    dom.textContent = '';
	    if (!lifecycle.fastUnmount || (lifecycle.fastUnmount && options.recyclingEnabled && !isRecycling)) {
	        removeChildren(null, children, lifecycle, isRecycling);
	    }
	}
	function removeChildren(dom, children, lifecycle, isRecycling) {
	    for (var i = 0; i < children.length; i++) {
	        var child = children[i];
	        if (!isInvalid(child)) {
	            unmount(child, dom, lifecycle, true, isRecycling);
	        }
	    }
	}
	function isKeyed(lastChildren, nextChildren) {
	    return nextChildren.length && !isNullOrUndef(nextChildren[0]) && !isNullOrUndef(nextChildren[0].key)
	        && lastChildren.length && !isNullOrUndef(lastChildren[0]) && !isNullOrUndef(lastChildren[0].key);
	}

	function isCheckedType(type) {
	    return type === 'checkbox' || type === 'radio';
	}
	function isControlled(props) {
	    var usesChecked = isCheckedType(props.type);
	    return usesChecked ? !isNullOrUndef(props.checked) : !isNullOrUndef(props.value);
	}
	function onTextInputChange(e) {
	    var vNode = this.vNode;
	    var events = vNode.events || EMPTY_OBJ;
	    var dom = vNode.dom;
	    if (events.onInput) {
	        var event = events.onInput;
	        if (event.event) {
	            event.event(event.data, e);
	        }
	        else {
	            event(e);
	        }
	    }
	    else if (events.oninput) {
	        events.oninput(e);
	    }
	    // the user may have updated the vNode from the above onInput events
	    // so we need to get it from the context of `this` again
	    applyValue(this.vNode, dom);
	}
	function wrappedOnChange(e) {
	    var vNode = this.vNode;
	    var events = vNode.events || EMPTY_OBJ;
	    var event = events.onChange;
	    if (event.event) {
	        event.event(event.data, e);
	    }
	    else {
	        event(e);
	    }
	}
	function onCheckboxChange(e) {
	    var vNode = this.vNode;
	    var events = vNode.events || EMPTY_OBJ;
	    var dom = vNode.dom;
	    if (events.onClick) {
	        var event = events.onClick;
	        if (event.event) {
	            event.event(event.data, e);
	        }
	        else {
	            event(e);
	        }
	    }
	    else if (events.onclick) {
	        events.onclick(e);
	    }
	    // the user may have updated the vNode from the above onClick events
	    // so we need to get it from the context of `this` again
	    applyValue(this.vNode, dom);
	}
	function handleAssociatedRadioInputs(name) {
	    var inputs = document.querySelectorAll(("input[type=\"radio\"][name=\"" + name + "\"]"));
	    [].forEach.call(inputs, function (dom) {
	        var inputWrapper = wrappers.get(dom);
	        if (inputWrapper) {
	            var props = inputWrapper.vNode.props;
	            if (props) {
	                dom.checked = inputWrapper.vNode.props.checked;
	            }
	        }
	    });
	}
	function processInput(vNode, dom) {
	    var props = vNode.props || EMPTY_OBJ;
	    applyValue(vNode, dom);
	    if (isControlled(props)) {
	        var inputWrapper = wrappers.get(dom);
	        if (!inputWrapper) {
	            inputWrapper = {
	                vNode: vNode
	            };
	            if (isCheckedType(props.type)) {
	                dom.onclick = onCheckboxChange.bind(inputWrapper);
	                dom.onclick.wrapped = true;
	            }
	            else {
	                dom.oninput = onTextInputChange.bind(inputWrapper);
	                dom.oninput.wrapped = true;
	            }
	            if (props.onChange) {
	                dom.onchange = wrappedOnChange.bind(inputWrapper);
	                dom.onchange.wrapped = true;
	            }
	            wrappers.set(dom, inputWrapper);
	        }
	        inputWrapper.vNode = vNode;
	        return true;
	    }
	    return false;
	}
	function applyValue(vNode, dom) {
	    var props = vNode.props || EMPTY_OBJ;
	    var type = props.type;
	    var value = props.value;
	    var checked = props.checked;
	    var multiple = props.multiple;
	    if (type && type !== dom.type) {
	        dom.type = type;
	    }
	    if (multiple && multiple !== dom.multiple) {
	        dom.multiple = multiple;
	    }
	    if (isCheckedType(type)) {
	        if (!isNullOrUndef(value)) {
	            dom.value = value;
	        }
	        dom.checked = checked;
	        if (type === 'radio' && props.name) {
	            handleAssociatedRadioInputs(props.name);
	        }
	    }
	    else {
	        if (!isNullOrUndef(value) && dom.value !== value) {
	            dom.value = value;
	        }
	        else if (!isNullOrUndef(checked)) {
	            dom.checked = checked;
	        }
	    }
	}

	function isControlled$1(props) {
	    return !isNullOrUndef(props.value);
	}
	function updateChildOptionGroup(vNode, value) {
	    var type = vNode.type;
	    if (type === 'optgroup') {
	        var children = vNode.children;
	        if (isArray(children)) {
	            for (var i = 0; i < children.length; i++) {
	                updateChildOption(children[i], value);
	            }
	        }
	        else if (isVNode(children)) {
	            updateChildOption(children, value);
	        }
	    }
	    else {
	        updateChildOption(vNode, value);
	    }
	}
	function updateChildOption(vNode, value) {
	    var props = vNode.props || EMPTY_OBJ;
	    var dom = vNode.dom;
	    // we do this as multiple may have changed
	    dom.value = props.value;
	    if ((isArray(value) && value.indexOf(props.value) !== -1) || props.value === value) {
	        dom.selected = true;
	    }
	    else {
	        dom.selected = props.selected || false;
	    }
	}
	function onSelectChange(e) {
	    var vNode = this.vNode;
	    var events = vNode.events || EMPTY_OBJ;
	    var dom = vNode.dom;
	    if (events.onChange) {
	        var event = events.onChange;
	        if (event.event) {
	            event.event(event.data, e);
	        }
	        else {
	            event(e);
	        }
	    }
	    else if (events.onchange) {
	        events.onchange(e);
	    }
	    // the user may have updated the vNode from the above onChange events
	    // so we need to get it from the context of `this` again
	    applyValue$1(this.vNode, dom);
	}
	function processSelect(vNode, dom) {
	    var props = vNode.props || EMPTY_OBJ;
	    applyValue$1(vNode, dom);
	    if (isControlled$1(props)) {
	        var selectWrapper = wrappers.get(dom);
	        if (!selectWrapper) {
	            selectWrapper = {
	                vNode: vNode
	            };
	            dom.onchange = onSelectChange.bind(selectWrapper);
	            dom.onchange.wrapped = true;
	            wrappers.set(dom, selectWrapper);
	        }
	        selectWrapper.vNode = vNode;
	        return true;
	    }
	    return false;
	}
	function applyValue$1(vNode, dom) {
	    var props = vNode.props || EMPTY_OBJ;
	    if (props.multiple !== dom.multiple) {
	        dom.multiple = props.multiple;
	    }
	    var children = vNode.children;
	    if (!isInvalid(children)) {
	        var value = props.value;
	        if (isArray(children)) {
	            for (var i = 0; i < children.length; i++) {
	                updateChildOptionGroup(children[i], value);
	            }
	        }
	        else if (isVNode(children)) {
	            updateChildOptionGroup(children, value);
	        }
	    }
	}

	function isControlled$2(props) {
	    return !isNullOrUndef(props.value);
	}
	function wrappedOnChange$1(e) {
	    var vNode = this.vNode;
	    var events = vNode.events || EMPTY_OBJ;
	    var event = events.onChange;
	    if (event.event) {
	        event.event(event.data, e);
	    }
	    else {
	        event(e);
	    }
	}
	function onTextareaInputChange(e) {
	    var vNode = this.vNode;
	    var events = vNode.events || EMPTY_OBJ;
	    var dom = vNode.dom;
	    if (events.onInput) {
	        var event = events.onInput;
	        if (event.event) {
	            event.event(event.data, e);
	        }
	        else {
	            event(e);
	        }
	    }
	    else if (events.oninput) {
	        events.oninput(e);
	    }
	    // the user may have updated the vNode from the above onInput events
	    // so we need to get it from the context of `this` again
	    applyValue$2(this.vNode, dom);
	}
	function processTextarea(vNode, dom) {
	    var props = vNode.props || EMPTY_OBJ;
	    applyValue$2(vNode, dom);
	    var textareaWrapper = wrappers.get(dom);
	    if (isControlled$2(props)) {
	        if (!textareaWrapper) {
	            textareaWrapper = {
	                vNode: vNode
	            };
	            dom.oninput = onTextareaInputChange.bind(textareaWrapper);
	            dom.oninput.wrapped = true;
	            if (props.onChange) {
	                dom.onchange = wrappedOnChange$1.bind(textareaWrapper);
	                dom.onchange.wrapped = true;
	            }
	            wrappers.set(dom, textareaWrapper);
	        }
	        textareaWrapper.vNode = vNode;
	        return true;
	    }
	    return false;
	}
	function applyValue$2(vNode, dom) {
	    var props = vNode.props || EMPTY_OBJ;
	    var value = props.value;
	    var domValue = dom.value;
	    if (domValue !== value) {
	        if (!isNullOrUndef(value)) {
	            dom.value = value;
	        }
	        else if (domValue !== '') {
	            dom.value = '';
	        }
	    }
	}

	var wrappers = new Map();
	function processElement(flags, vNode, dom) {
	    if (flags & 512 /* InputElement */) {
	        return processInput(vNode, dom);
	    }
	    if (flags & 2048 /* SelectElement */) {
	        return processSelect(vNode, dom);
	    }
	    if (flags & 1024 /* TextareaElement */) {
	        return processTextarea(vNode, dom);
	    }
	    return false;
	}

	function patch(lastVNode, nextVNode, parentDom, lifecycle, context, isSVG, isRecycling) {
	    if (lastVNode !== nextVNode) {
	        var lastFlags = lastVNode.flags;
	        var nextFlags = nextVNode.flags;
	        if (nextFlags & 28 /* Component */) {
	            if (lastFlags & 28 /* Component */) {
	                patchComponent(lastVNode, nextVNode, parentDom, lifecycle, context, isSVG, nextFlags & 4 /* ComponentClass */, isRecycling);
	            }
	            else {
	                replaceVNode(parentDom, mountComponent(nextVNode, null, lifecycle, context, isSVG, nextFlags & 4 /* ComponentClass */), lastVNode, lifecycle, isRecycling);
	            }
	        }
	        else if (nextFlags & 3970 /* Element */) {
	            if (lastFlags & 3970 /* Element */) {
	                patchElement(lastVNode, nextVNode, parentDom, lifecycle, context, isSVG, isRecycling);
	            }
	            else {
	                replaceVNode(parentDom, mountElement(nextVNode, null, lifecycle, context, isSVG), lastVNode, lifecycle, isRecycling);
	            }
	        }
	        else if (nextFlags & 1 /* Text */) {
	            if (lastFlags & 1 /* Text */) {
	                patchText(lastVNode, nextVNode);
	            }
	            else {
	                replaceVNode(parentDom, mountText(nextVNode, null), lastVNode, lifecycle, isRecycling);
	            }
	        }
	        else if (nextFlags & 4096 /* Void */) {
	            if (lastFlags & 4096 /* Void */) {
	                patchVoid(lastVNode, nextVNode);
	            }
	            else {
	                replaceVNode(parentDom, mountVoid(nextVNode, null), lastVNode, lifecycle, isRecycling);
	            }
	        }
	        else {
	            // Error case: mount new one replacing old one
	            replaceLastChildAndUnmount(lastVNode, nextVNode, parentDom, lifecycle, context, isSVG, isRecycling);
	        }
	    }
	}
	function unmountChildren(children, dom, lifecycle, isRecycling) {
	    if (isVNode(children)) {
	        unmount(children, dom, lifecycle, true, isRecycling);
	    }
	    else if (isArray(children)) {
	        removeAllChildren(dom, children, lifecycle, isRecycling);
	    }
	    else {
	        dom.textContent = '';
	    }
	}
	function patchElement(lastVNode, nextVNode, parentDom, lifecycle, context, isSVG, isRecycling) {
	    var nextTag = nextVNode.type;
	    var lastTag = lastVNode.type;
	    if (lastTag !== nextTag) {
	        replaceWithNewNode(lastVNode, nextVNode, parentDom, lifecycle, context, isSVG, isRecycling);
	    }
	    else {
	        var dom = lastVNode.dom;
	        var lastProps = lastVNode.props;
	        var nextProps = nextVNode.props;
	        var lastChildren = lastVNode.children;
	        var nextChildren = nextVNode.children;
	        var lastFlags = lastVNode.flags;
	        var nextFlags = nextVNode.flags;
	        var lastRef = lastVNode.ref;
	        var nextRef = nextVNode.ref;
	        var lastEvents = lastVNode.events;
	        var nextEvents = nextVNode.events;
	        nextVNode.dom = dom;
	        if (isSVG || (nextFlags & 128 /* SvgElement */)) {
	            isSVG = true;
	        }
	        if (lastChildren !== nextChildren) {
	            patchChildren(lastFlags, nextFlags, lastChildren, nextChildren, dom, lifecycle, context, isSVG, isRecycling);
	        }
	        var hasControlledValue = false;
	        if (!(nextFlags & 2 /* HtmlElement */)) {
	            hasControlledValue = processElement(nextFlags, nextVNode, dom);
	        }
	        // inlined patchProps  -- starts --
	        if (lastProps !== nextProps) {
	            var lastPropsOrEmpty = lastProps || EMPTY_OBJ;
	            var nextPropsOrEmpty = nextProps || EMPTY_OBJ;
	            if (nextPropsOrEmpty !== EMPTY_OBJ) {
	                for (var prop in nextPropsOrEmpty) {
	                    // do not add a hasOwnProperty check here, it affects performance
	                    var nextValue = nextPropsOrEmpty[prop];
	                    var lastValue = lastPropsOrEmpty[prop];
	                    if (isNullOrUndef(nextValue)) {
	                        removeProp(prop, nextValue, dom);
	                    }
	                    else {
	                        patchProp(prop, lastValue, nextValue, dom, isSVG, hasControlledValue);
	                    }
	                }
	            }
	            if (lastPropsOrEmpty !== EMPTY_OBJ) {
	                for (var prop$1 in lastPropsOrEmpty) {
	                    // do not add a hasOwnProperty check here, it affects performance
	                    if (isNullOrUndef(nextPropsOrEmpty[prop$1])) {
	                        removeProp(prop$1, lastPropsOrEmpty[prop$1], dom);
	                    }
	                }
	            }
	        }
	        // inlined patchProps  -- ends --
	        if (lastEvents !== nextEvents) {
	            patchEvents(lastEvents, nextEvents, dom);
	        }
	        if (nextRef) {
	            if (lastRef !== nextRef || isRecycling) {
	                mountRef(dom, nextRef, lifecycle);
	            }
	        }
	    }
	}
	function patchChildren(lastFlags, nextFlags, lastChildren, nextChildren, dom, lifecycle, context, isSVG, isRecycling) {
	    var patchArray = false;
	    var patchKeyed = false;
	    if (nextFlags & 64 /* HasNonKeyedChildren */) {
	        patchArray = true;
	    }
	    else if ((lastFlags & 32 /* HasKeyedChildren */) && (nextFlags & 32 /* HasKeyedChildren */)) {
	        patchKeyed = true;
	        patchArray = true;
	    }
	    else if (isInvalid(nextChildren)) {
	        unmountChildren(lastChildren, dom, lifecycle, isRecycling);
	    }
	    else if (isInvalid(lastChildren)) {
	        if (isStringOrNumber(nextChildren)) {
	            setTextContent(dom, nextChildren);
	        }
	        else {
	            if (isArray(nextChildren)) {
	                mountArrayChildren(nextChildren, dom, lifecycle, context, isSVG);
	            }
	            else {
	                mount(nextChildren, dom, lifecycle, context, isSVG);
	            }
	        }
	    }
	    else if (isStringOrNumber(nextChildren)) {
	        if (isStringOrNumber(lastChildren)) {
	            updateTextContent(dom, nextChildren);
	        }
	        else {
	            unmountChildren(lastChildren, dom, lifecycle, isRecycling);
	            setTextContent(dom, nextChildren);
	        }
	    }
	    else if (isArray(nextChildren)) {
	        if (isArray(lastChildren)) {
	            patchArray = true;
	            if (isKeyed(lastChildren, nextChildren)) {
	                patchKeyed = true;
	            }
	        }
	        else {
	            unmountChildren(lastChildren, dom, lifecycle, isRecycling);
	            mountArrayChildren(nextChildren, dom, lifecycle, context, isSVG);
	        }
	    }
	    else if (isArray(lastChildren)) {
	        removeAllChildren(dom, lastChildren, lifecycle, isRecycling);
	        mount(nextChildren, dom, lifecycle, context, isSVG);
	    }
	    else if (isVNode(nextChildren)) {
	        if (isVNode(lastChildren)) {
	            patch(lastChildren, nextChildren, dom, lifecycle, context, isSVG, isRecycling);
	        }
	        else {
	            unmountChildren(lastChildren, dom, lifecycle, isRecycling);
	            mount(nextChildren, dom, lifecycle, context, isSVG);
	        }
	    }
	    if (patchArray) {
	        if (patchKeyed) {
	            patchKeyedChildren(lastChildren, nextChildren, dom, lifecycle, context, isSVG, isRecycling);
	        }
	        else {
	            patchNonKeyedChildren(lastChildren, nextChildren, dom, lifecycle, context, isSVG, isRecycling);
	        }
	    }
	}
	function patchComponent(lastVNode, nextVNode, parentDom, lifecycle, context, isSVG, isClass, isRecycling) {
	    var lastType = lastVNode.type;
	    var nextType = nextVNode.type;
	    var nextProps = nextVNode.props || EMPTY_OBJ;
	    var lastKey = lastVNode.key;
	    var nextKey = nextVNode.key;
	    var defaultProps = nextType.defaultProps;
	    if (!isUndefined(defaultProps)) {
	        copyPropsTo(defaultProps, nextProps);
	        nextVNode.props = nextProps;
	    }
	    if (lastType !== nextType) {
	        if (isClass) {
	            replaceWithNewNode(lastVNode, nextVNode, parentDom, lifecycle, context, isSVG, isRecycling);
	        }
	        else {
	            var lastInput = lastVNode.children._lastInput || lastVNode.children;
	            var nextInput = createFunctionalComponentInput(nextVNode, nextType, nextProps, context);
	            unmount(lastVNode, null, lifecycle, false, isRecycling);
	            patch(lastInput, nextInput, parentDom, lifecycle, context, isSVG, isRecycling);
	            var dom = nextVNode.dom = nextInput.dom;
	            nextVNode.children = nextInput;
	            mountFunctionalComponentCallbacks(nextVNode.ref, dom, lifecycle);
	        }
	    }
	    else {
	        if (isClass) {
	            if (lastKey !== nextKey) {
	                replaceWithNewNode(lastVNode, nextVNode, parentDom, lifecycle, context, isSVG, isRecycling);
	                return false;
	            }
	            var instance = lastVNode.children;
	            if (instance._unmounted) {
	                if (isNull(parentDom)) {
	                    return true;
	                }
	                replaceChild(parentDom, mountComponent(nextVNode, null, lifecycle, context, isSVG, nextVNode.flags & 4 /* ComponentClass */), lastVNode.dom);
	            }
	            else {
	                var lastState = instance.state;
	                var nextState = instance.state;
	                var lastProps = instance.props;
	                var childContext = instance.getChildContext();
	                nextVNode.children = instance;
	                instance._isSVG = isSVG;
	                if (!isNullOrUndef(childContext)) {
	                    childContext = Object.assign({}, context, childContext);
	                }
	                else {
	                    childContext = context;
	                }
	                var lastInput$1 = instance._lastInput;
	                var nextInput$1 = instance._updateComponent(lastState, nextState, lastProps, nextProps, context, false, false);
	                var didUpdate = true;
	                instance._childContext = childContext;
	                if (isInvalid(nextInput$1)) {
	                    nextInput$1 = createVoidVNode();
	                }
	                else if (nextInput$1 === NO_OP) {
	                    nextInput$1 = lastInput$1;
	                    didUpdate = false;
	                }
	                else if (isStringOrNumber(nextInput$1)) {
	                    nextInput$1 = createTextVNode(nextInput$1);
	                }
	                else if (isArray(nextInput$1)) {
	                    if (process.env.NODE_ENV !== 'production') {
	                        throwError('a valid Inferno VNode (or null) must be returned from a component render. You may have returned an array or an invalid object.');
	                    }
	                    throwError();
	                }
	                else if (isObject(nextInput$1) && nextInput$1.dom) {
	                    nextInput$1 = cloneVNode(nextInput$1);
	                }
	                if (nextInput$1.flags & 28 /* Component */) {
	                    nextInput$1.parentVNode = nextVNode;
	                }
	                else if (lastInput$1.flags & 28 /* Component */) {
	                    lastInput$1.parentVNode = nextVNode;
	                }
	                instance._lastInput = nextInput$1;
	                instance._vNode = nextVNode;
	                if (didUpdate) {
	                    var fastUnmount = lifecycle.fastUnmount;
	                    var subLifecycle = instance._lifecycle;
	                    lifecycle.fastUnmount = subLifecycle.fastUnmount;
	                    patch(lastInput$1, nextInput$1, parentDom, lifecycle, childContext, isSVG, isRecycling);
	                    subLifecycle.fastUnmount = lifecycle.fastUnmount;
	                    lifecycle.fastUnmount = fastUnmount;
	                    instance.componentDidUpdate(lastProps, lastState);
	                    options.afterUpdate && options.afterUpdate(nextVNode);
	                    options.findDOMNodeEnabled && componentToDOMNodeMap.set(instance, nextInput$1.dom);
	                }
	                nextVNode.dom = nextInput$1.dom;
	            }
	        }
	        else {
	            var shouldUpdate = true;
	            var lastProps$1 = lastVNode.props;
	            var nextHooks = nextVNode.ref;
	            var nextHooksDefined = !isNullOrUndef(nextHooks);
	            var lastInput$2 = lastVNode.children;
	            var nextInput$2 = lastInput$2;
	            nextVNode.dom = lastVNode.dom;
	            nextVNode.children = lastInput$2;
	            if (lastKey !== nextKey) {
	                shouldUpdate = true;
	            }
	            else {
	                if (nextHooksDefined && !isNullOrUndef(nextHooks.onComponentShouldUpdate)) {
	                    shouldUpdate = nextHooks.onComponentShouldUpdate(lastProps$1, nextProps);
	                }
	            }
	            if (shouldUpdate !== false) {
	                if (nextHooksDefined && !isNullOrUndef(nextHooks.onComponentWillUpdate)) {
	                    nextHooks.onComponentWillUpdate(lastProps$1, nextProps);
	                }
	                nextInput$2 = nextType(nextProps, context);
	                if (isInvalid(nextInput$2)) {
	                    nextInput$2 = createVoidVNode();
	                }
	                else if (isStringOrNumber(nextInput$2) && nextInput$2 !== NO_OP) {
	                    nextInput$2 = createTextVNode(nextInput$2);
	                }
	                else if (isArray(nextInput$2)) {
	                    if (process.env.NODE_ENV !== 'production') {
	                        throwError('a valid Inferno VNode (or null) must be returned from a component render. You may have returned an array or an invalid object.');
	                    }
	                    throwError();
	                }
	                else if (isObject(nextInput$2) && nextInput$2.dom) {
	                    nextInput$2 = cloneVNode(nextInput$2);
	                }
	                if (nextInput$2 !== NO_OP) {
	                    patch(lastInput$2, nextInput$2, parentDom, lifecycle, context, isSVG, isRecycling);
	                    nextVNode.children = nextInput$2;
	                    if (nextHooksDefined && !isNullOrUndef(nextHooks.onComponentDidUpdate)) {
	                        nextHooks.onComponentDidUpdate(lastProps$1, nextProps);
	                    }
	                    nextVNode.dom = nextInput$2.dom;
	                }
	            }
	            if (nextInput$2.flags & 28 /* Component */) {
	                nextInput$2.parentVNode = nextVNode;
	            }
	            else if (lastInput$2.flags & 28 /* Component */) {
	                lastInput$2.parentVNode = nextVNode;
	            }
	        }
	    }
	    return false;
	}
	function patchText(lastVNode, nextVNode) {
	    var nextText = nextVNode.children;
	    var dom = lastVNode.dom;
	    nextVNode.dom = dom;
	    if (lastVNode.children !== nextText) {
	        dom.nodeValue = nextText;
	    }
	}
	function patchVoid(lastVNode, nextVNode) {
	    nextVNode.dom = lastVNode.dom;
	}
	function patchNonKeyedChildren(lastChildren, nextChildren, dom, lifecycle, context, isSVG, isRecycling) {
	    var lastChildrenLength = lastChildren.length;
	    var nextChildrenLength = nextChildren.length;
	    var commonLength = lastChildrenLength > nextChildrenLength ? nextChildrenLength : lastChildrenLength;
	    var i = 0;
	    for (; i < commonLength; i++) {
	        var nextChild = nextChildren[i];
	        if (nextChild.dom) {
	            nextChild = nextChildren[i] = cloneVNode(nextChild);
	        }
	        patch(lastChildren[i], nextChild, dom, lifecycle, context, isSVG, isRecycling);
	    }
	    if (lastChildrenLength < nextChildrenLength) {
	        for (i = commonLength; i < nextChildrenLength; i++) {
	            var nextChild$1 = nextChildren[i];
	            if (nextChild$1.dom) {
	                nextChild$1 = nextChildren[i] = cloneVNode(nextChild$1);
	            }
	            appendChild(dom, mount(nextChild$1, null, lifecycle, context, isSVG));
	        }
	    }
	    else if (nextChildrenLength === 0) {
	        removeAllChildren(dom, lastChildren, lifecycle, isRecycling);
	    }
	    else if (lastChildrenLength > nextChildrenLength) {
	        for (i = commonLength; i < lastChildrenLength; i++) {
	            unmount(lastChildren[i], dom, lifecycle, false, isRecycling);
	        }
	    }
	}
	function patchKeyedChildren(a, b, dom, lifecycle, context, isSVG, isRecycling) {
	    var aLength = a.length;
	    var bLength = b.length;
	    var aEnd = aLength - 1;
	    var bEnd = bLength - 1;
	    var aStart = 0;
	    var bStart = 0;
	    var i;
	    var j;
	    var aNode;
	    var bNode;
	    var nextNode;
	    var nextPos;
	    var node;
	    if (aLength === 0) {
	        if (bLength !== 0) {
	            mountArrayChildren(b, dom, lifecycle, context, isSVG);
	        }
	        return;
	    }
	    else if (bLength === 0) {
	        removeAllChildren(dom, a, lifecycle, isRecycling);
	        return;
	    }
	    var aStartNode = a[aStart];
	    var bStartNode = b[bStart];
	    var aEndNode = a[aEnd];
	    var bEndNode = b[bEnd];
	    if (bStartNode.dom) {
	        b[bStart] = bStartNode = cloneVNode(bStartNode);
	    }
	    if (bEndNode.dom) {
	        b[bEnd] = bEndNode = cloneVNode(bEndNode);
	    }
	    // Step 1
	    /* eslint no-constant-condition: 0 */
	    outer: while (true) {
	        // Sync nodes with the same key at the beginning.
	        while (aStartNode.key === bStartNode.key) {
	            patch(aStartNode, bStartNode, dom, lifecycle, context, isSVG, isRecycling);
	            aStart++;
	            bStart++;
	            if (aStart > aEnd || bStart > bEnd) {
	                break outer;
	            }
	            aStartNode = a[aStart];
	            bStartNode = b[bStart];
	            if (bStartNode.dom) {
	                b[bStart] = bStartNode = cloneVNode(bStartNode);
	            }
	        }
	        // Sync nodes with the same key at the end.
	        while (aEndNode.key === bEndNode.key) {
	            patch(aEndNode, bEndNode, dom, lifecycle, context, isSVG, isRecycling);
	            aEnd--;
	            bEnd--;
	            if (aStart > aEnd || bStart > bEnd) {
	                break outer;
	            }
	            aEndNode = a[aEnd];
	            bEndNode = b[bEnd];
	            if (bEndNode.dom) {
	                b[bEnd] = bEndNode = cloneVNode(bEndNode);
	            }
	        }
	        // Move and sync nodes from right to left.
	        if (aEndNode.key === bStartNode.key) {
	            patch(aEndNode, bStartNode, dom, lifecycle, context, isSVG, isRecycling);
	            insertOrAppend(dom, bStartNode.dom, aStartNode.dom);
	            aEnd--;
	            bStart++;
	            aEndNode = a[aEnd];
	            bStartNode = b[bStart];
	            if (bStartNode.dom) {
	                b[bStart] = bStartNode = cloneVNode(bStartNode);
	            }
	            continue;
	        }
	        // Move and sync nodes from left to right.
	        if (aStartNode.key === bEndNode.key) {
	            patch(aStartNode, bEndNode, dom, lifecycle, context, isSVG, isRecycling);
	            nextPos = bEnd + 1;
	            nextNode = nextPos < b.length ? b[nextPos].dom : null;
	            insertOrAppend(dom, bEndNode.dom, nextNode);
	            aStart++;
	            bEnd--;
	            aStartNode = a[aStart];
	            bEndNode = b[bEnd];
	            if (bEndNode.dom) {
	                b[bEnd] = bEndNode = cloneVNode(bEndNode);
	            }
	            continue;
	        }
	        break;
	    }
	    if (aStart > aEnd) {
	        if (bStart <= bEnd) {
	            nextPos = bEnd + 1;
	            nextNode = nextPos < b.length ? b[nextPos].dom : null;
	            while (bStart <= bEnd) {
	                node = b[bStart];
	                if (node.dom) {
	                    b[bStart] = node = cloneVNode(node);
	                }
	                bStart++;
	                insertOrAppend(dom, mount(node, null, lifecycle, context, isSVG), nextNode);
	            }
	        }
	    }
	    else if (bStart > bEnd) {
	        while (aStart <= aEnd) {
	            unmount(a[aStart++], dom, lifecycle, false, isRecycling);
	        }
	    }
	    else {
	        aLength = aEnd - aStart + 1;
	        bLength = bEnd - bStart + 1;
	        var aNullable = a;
	        var sources = new Array(bLength);
	        // Mark all nodes as inserted.
	        for (i = 0; i < bLength; i++) {
	            sources[i] = -1;
	        }
	        var moved = false;
	        var pos = 0;
	        var patched = 0;
	        if ((bLength <= 4) || (aLength * bLength <= 16)) {
	            for (i = aStart; i <= aEnd; i++) {
	                aNode = a[i];
	                if (patched < bLength) {
	                    for (j = bStart; j <= bEnd; j++) {
	                        bNode = b[j];
	                        if (aNode.key === bNode.key) {
	                            sources[j - bStart] = i;
	                            if (pos > j) {
	                                moved = true;
	                            }
	                            else {
	                                pos = j;
	                            }
	                            if (bNode.dom) {
	                                b[j] = bNode = cloneVNode(bNode);
	                            }
	                            patch(aNode, bNode, dom, lifecycle, context, isSVG, isRecycling);
	                            patched++;
	                            aNullable[i] = null;
	                            break;
	                        }
	                    }
	                }
	            }
	        }
	        else {
	            var keyIndex = new Map();
	            for (i = bStart; i <= bEnd; i++) {
	                node = b[i];
	                keyIndex.set(node.key, i);
	            }
	            for (i = aStart; i <= aEnd; i++) {
	                aNode = a[i];
	                if (patched < bLength) {
	                    j = keyIndex.get(aNode.key);
	                    if (!isUndefined(j)) {
	                        bNode = b[j];
	                        sources[j - bStart] = i;
	                        if (pos > j) {
	                            moved = true;
	                        }
	                        else {
	                            pos = j;
	                        }
	                        if (bNode.dom) {
	                            b[j] = bNode = cloneVNode(bNode);
	                        }
	                        patch(aNode, bNode, dom, lifecycle, context, isSVG, isRecycling);
	                        patched++;
	                        aNullable[i] = null;
	                    }
	                }
	            }
	        }
	        if (aLength === a.length && patched === 0) {
	            removeAllChildren(dom, a, lifecycle, isRecycling);
	            while (bStart < bLength) {
	                node = b[bStart];
	                if (node.dom) {
	                    b[bStart] = node = cloneVNode(node);
	                }
	                bStart++;
	                insertOrAppend(dom, mount(node, null, lifecycle, context, isSVG), null);
	            }
	        }
	        else {
	            i = aLength - patched;
	            while (i > 0) {
	                aNode = aNullable[aStart++];
	                if (!isNull(aNode)) {
	                    unmount(aNode, dom, lifecycle, true, isRecycling);
	                    i--;
	                }
	            }
	            if (moved) {
	                var seq = lis_algorithm(sources);
	                j = seq.length - 1;
	                for (i = bLength - 1; i >= 0; i--) {
	                    if (sources[i] === -1) {
	                        pos = i + bStart;
	                        node = b[pos];
	                        if (node.dom) {
	                            b[pos] = node = cloneVNode(node);
	                        }
	                        nextPos = pos + 1;
	                        nextNode = nextPos < b.length ? b[nextPos].dom : null;
	                        insertOrAppend(dom, mount(node, dom, lifecycle, context, isSVG), nextNode);
	                    }
	                    else {
	                        if (j < 0 || i !== seq[j]) {
	                            pos = i + bStart;
	                            node = b[pos];
	                            nextPos = pos + 1;
	                            nextNode = nextPos < b.length ? b[nextPos].dom : null;
	                            insertOrAppend(dom, node.dom, nextNode);
	                        }
	                        else {
	                            j--;
	                        }
	                    }
	                }
	            }
	            else if (patched !== bLength) {
	                for (i = bLength - 1; i >= 0; i--) {
	                    if (sources[i] === -1) {
	                        pos = i + bStart;
	                        node = b[pos];
	                        if (node.dom) {
	                            b[pos] = node = cloneVNode(node);
	                        }
	                        nextPos = pos + 1;
	                        nextNode = nextPos < b.length ? b[nextPos].dom : null;
	                        insertOrAppend(dom, mount(node, null, lifecycle, context, isSVG), nextNode);
	                    }
	                }
	            }
	        }
	    }
	}
	// // https://en.wikipedia.org/wiki/Longest_increasing_subsequence
	function lis_algorithm(a) {
	    var p = a.slice(0);
	    var result = [0];
	    var i;
	    var j;
	    var u;
	    var v;
	    var c;
	    for (i = 0; i < a.length; i++) {
	        if (a[i] === -1) {
	            continue;
	        }
	        j = result[result.length - 1];
	        if (a[j] < a[i]) {
	            p[i] = j;
	            result.push(i);
	            continue;
	        }
	        u = 0;
	        v = result.length - 1;
	        while (u < v) {
	            c = ((u + v) / 2) | 0;
	            if (a[result[c]] < a[i]) {
	                u = c + 1;
	            }
	            else {
	                v = c;
	            }
	        }
	        if (a[i] < a[result[u]]) {
	            if (u > 0) {
	                p[i] = result[u - 1];
	            }
	            result[u] = i;
	        }
	    }
	    u = result.length;
	    v = result[u - 1];
	    while (u-- > 0) {
	        result[u] = v;
	        v = p[v];
	    }
	    return result;
	}
	function patchProp(prop, lastValue, nextValue, dom, isSVG, hasControlledValue) {
	    if (skipProps[prop] || hasControlledValue && prop === 'value') {
	        return;
	    }
	    if (booleanProps[prop]) {
	        dom[prop] = !!nextValue;
	    }
	    else if (strictProps[prop]) {
	        var value = isNullOrUndef(nextValue) ? '' : nextValue;
	        if (dom[prop] !== value) {
	            dom[prop] = value;
	        }
	    }
	    else if (lastValue !== nextValue) {
	        if (isAttrAnEvent(prop)) {
	            patchEvent(prop, lastValue, nextValue, dom);
	        }
	        else if (isNullOrUndef(nextValue)) {
	            dom.removeAttribute(prop);
	        }
	        else if (prop === 'className') {
	            if (isSVG) {
	                dom.setAttribute('class', nextValue);
	            }
	            else {
	                dom.className = nextValue;
	            }
	        }
	        else if (prop === 'style') {
	            patchStyle(lastValue, nextValue, dom);
	        }
	        else if (prop === 'dangerouslySetInnerHTML') {
	            var lastHtml = lastValue && lastValue.__html;
	            var nextHtml = nextValue && nextValue.__html;
	            if (lastHtml !== nextHtml) {
	                if (!isNullOrUndef(nextHtml)) {
	                    dom.innerHTML = nextHtml;
	                }
	            }
	        }
	        else {
	            var dehyphenProp;
	            if (dehyphenProps[prop]) {
	                dehyphenProp = dehyphenProps[prop];
	            }
	            else if (isSVG && prop.match(probablyKebabProps)) {
	                dehyphenProp = prop.replace(/([a-z])([A-Z]|1)/g, kebabize);
	                dehyphenProps[prop] = dehyphenProp;
	            }
	            else {
	                dehyphenProp = prop;
	            }
	            var ns = namespaces[prop];
	            if (ns) {
	                dom.setAttributeNS(ns, dehyphenProp, nextValue);
	            }
	            else {
	                dom.setAttribute(dehyphenProp, nextValue);
	            }
	        }
	    }
	}
	function patchEvents(lastEvents, nextEvents, dom) {
	    lastEvents = lastEvents || EMPTY_OBJ;
	    nextEvents = nextEvents || EMPTY_OBJ;
	    if (nextEvents !== EMPTY_OBJ) {
	        for (var name in nextEvents) {
	            // do not add a hasOwnProperty check here, it affects performance
	            patchEvent(name, lastEvents[name], nextEvents[name], dom);
	        }
	    }
	    if (lastEvents !== EMPTY_OBJ) {
	        for (var name$1 in lastEvents) {
	            // do not add a hasOwnProperty check here, it affects performance
	            if (isNullOrUndef(nextEvents[name$1])) {
	                patchEvent(name$1, lastEvents[name$1], null, dom);
	            }
	        }
	    }
	}
	function patchEvent(name, lastValue, nextValue, dom) {
	    if (lastValue !== nextValue) {
	        var nameLowerCase = name.toLowerCase();
	        var domEvent = dom[nameLowerCase];
	        // if the function is wrapped, that means it's been controlled by a wrapper
	        if (domEvent && domEvent.wrapped) {
	            return;
	        }
	        if (delegatedProps[name]) {
	            handleEvent(name, lastValue, nextValue, dom);
	        }
	        else {
	            if (lastValue !== nextValue) {
	                if (!isFunction(nextValue) && !isNullOrUndef(nextValue)) {
	                    var linkEvent = nextValue.event;
	                    if (linkEvent && isFunction(linkEvent)) {
	                        if (!dom._data) {
	                            dom[nameLowerCase] = function (e) {
	                                linkEvent(e.currentTarget._data, e);
	                            };
	                        }
	                        dom._data = nextValue.data;
	                    }
	                    else {
	                        if (process.env.NODE_ENV !== 'production') {
	                            throwError(("an event on a VNode \"" + name + "\". was not a function or a valid linkEvent."));
	                        }
	                        throwError();
	                    }
	                }
	                else {
	                    dom[nameLowerCase] = nextValue;
	                }
	            }
	        }
	    }
	}
	// We are assuming here that we come from patchProp routine
	// -nextAttrValue cannot be null or undefined
	function patchStyle(lastAttrValue, nextAttrValue, dom) {
	    if (isString(nextAttrValue)) {
	        dom.style.cssText = nextAttrValue;
	        return;
	    }
	    for (var style in nextAttrValue) {
	        // do not add a hasOwnProperty check here, it affects performance
	        var value = nextAttrValue[style];
	        if (isNumber(value) && !isUnitlessNumber[style]) {
	            dom.style[style] = value + 'px';
	        }
	        else {
	            dom.style[style] = value;
	        }
	    }
	    if (!isNullOrUndef(lastAttrValue)) {
	        for (var style$1 in lastAttrValue) {
	            if (isNullOrUndef(nextAttrValue[style$1])) {
	                dom.style[style$1] = '';
	            }
	        }
	    }
	}
	function removeProp(prop, lastValue, dom) {
	    if (prop === 'className') {
	        dom.removeAttribute('class');
	    }
	    else if (prop === 'value') {
	        dom.value = '';
	    }
	    else if (prop === 'style') {
	        dom.removeAttribute('style');
	    }
	    else if (isAttrAnEvent(prop)) {
	        handleEvent(name, lastValue, null, dom);
	    }
	    else {
	        dom.removeAttribute(prop);
	    }
	}

	function mount(vNode, parentDom, lifecycle, context, isSVG) {
	    var flags = vNode.flags;
	    if (flags & 3970 /* Element */) {
	        return mountElement(vNode, parentDom, lifecycle, context, isSVG);
	    }
	    else if (flags & 28 /* Component */) {
	        return mountComponent(vNode, parentDom, lifecycle, context, isSVG, flags & 4 /* ComponentClass */);
	    }
	    else if (flags & 4096 /* Void */) {
	        return mountVoid(vNode, parentDom);
	    }
	    else if (flags & 1 /* Text */) {
	        return mountText(vNode, parentDom);
	    }
	    else {
	        if (process.env.NODE_ENV !== 'production') {
	            if (typeof vNode === 'object') {
	                throwError(("mount() received an object that's not a valid VNode, you should stringify it first. Object: \"" + (JSON.stringify(vNode)) + "\"."));
	            }
	            else {
	                throwError(("mount() expects a valid VNode, instead it received an object with the type \"" + (typeof vNode) + "\"."));
	            }
	        }
	        throwError();
	    }
	}
	function mountText(vNode, parentDom) {
	    var dom = document.createTextNode(vNode.children);
	    vNode.dom = dom;
	    if (parentDom) {
	        appendChild(parentDom, dom);
	    }
	    return dom;
	}
	function mountVoid(vNode, parentDom) {
	    var dom = document.createTextNode('');
	    vNode.dom = dom;
	    if (parentDom) {
	        appendChild(parentDom, dom);
	    }
	    return dom;
	}
	function mountElement(vNode, parentDom, lifecycle, context, isSVG) {
	    if (options.recyclingEnabled) {
	        var dom$1 = recycleElement(vNode, lifecycle, context, isSVG);
	        if (!isNull(dom$1)) {
	            if (!isNull(parentDom)) {
	                appendChild(parentDom, dom$1);
	            }
	            return dom$1;
	        }
	    }
	    var tag = vNode.type;
	    var flags = vNode.flags;
	    if (isSVG || (flags & 128 /* SvgElement */)) {
	        isSVG = true;
	    }
	    var dom = documentCreateElement(tag, isSVG);
	    var children = vNode.children;
	    var props = vNode.props;
	    var events = vNode.events;
	    var ref = vNode.ref;
	    vNode.dom = dom;
	    if (!isNull(children)) {
	        if (isStringOrNumber(children)) {
	            setTextContent(dom, children);
	        }
	        else if (isArray(children)) {
	            mountArrayChildren(children, dom, lifecycle, context, isSVG);
	        }
	        else if (isVNode(children)) {
	            mount(children, dom, lifecycle, context, isSVG);
	        }
	    }
	    var hasControlledValue = false;
	    if (!(flags & 2 /* HtmlElement */)) {
	        hasControlledValue = processElement(flags, vNode, dom);
	    }
	    if (!isNull(props)) {
	        for (var prop in props) {
	            // do not add a hasOwnProperty check here, it affects performance
	            patchProp(prop, null, props[prop], dom, isSVG, hasControlledValue);
	        }
	    }
	    if (!isNull(events)) {
	        for (var name in events) {
	            // do not add a hasOwnProperty check here, it affects performance
	            patchEvent(name, null, events[name], dom);
	        }
	    }
	    if (!isNull(ref)) {
	        mountRef(dom, ref, lifecycle);
	    }
	    if (!isNull(parentDom)) {
	        appendChild(parentDom, dom);
	    }
	    return dom;
	}
	function mountArrayChildren(children, dom, lifecycle, context, isSVG) {
	    for (var i = 0; i < children.length; i++) {
	        var child = children[i];
	        // TODO: Verify can string/number be here. might cause de-opt
	        if (!isInvalid(child)) {
	            if (child.dom) {
	                children[i] = child = cloneVNode(child);
	            }
	            mount(children[i], dom, lifecycle, context, isSVG);
	        }
	    }
	}
	function mountComponent(vNode, parentDom, lifecycle, context, isSVG, isClass) {
	    if (options.recyclingEnabled) {
	        var dom$1 = recycleComponent(vNode, lifecycle, context, isSVG);
	        if (!isNull(dom$1)) {
	            if (!isNull(parentDom)) {
	                appendChild(parentDom, dom$1);
	            }
	            return dom$1;
	        }
	    }
	    var type = vNode.type;
	    var props = vNode.props || EMPTY_OBJ;
	    var defaultProps = type.defaultProps;
	    var ref = vNode.ref;
	    var dom;
	    if (!isUndefined(defaultProps)) {
	        copyPropsTo(defaultProps, props);
	        vNode.props = props;
	    }
	    if (isClass) {
	        var instance = createClassComponentInstance(vNode, type, props, context, isSVG);
	        // If instance does not have componentWillUnmount specified we can enable fastUnmount
	        var input = instance._lastInput;
	        var prevFastUnmount = lifecycle.fastUnmount;
	        // we store the fastUnmount value, but we set it back to true on the lifecycle
	        // we do this so we can determine if the component render has a fastUnmount or not
	        lifecycle.fastUnmount = true;
	        instance._vNode = vNode;
	        vNode.dom = dom = mount(input, null, lifecycle, instance._childContext, isSVG);
	        // we now create a lifecycle for this component and store the fastUnmount value
	        var subLifecycle = instance._lifecycle = new Lifecycle();
	        // children lifecycle can fastUnmount if itself does need unmount callback and within its cycle there was none
	        subLifecycle.fastUnmount = isUndefined(instance.componentWillUnmount) && lifecycle.fastUnmount;
	        // higher lifecycle can fastUnmount only if previously it was able to and this children doesnt have any
	        lifecycle.fastUnmount = prevFastUnmount && subLifecycle.fastUnmount;
	        if (!isNull(parentDom)) {
	            appendChild(parentDom, dom);
	        }
	        mountClassComponentCallbacks(vNode, ref, instance, lifecycle);
	        options.findDOMNodeEnabled && componentToDOMNodeMap.set(instance, dom);
	        vNode.children = instance;
	    }
	    else {
	        var input$1 = createFunctionalComponentInput(vNode, type, props, context);
	        vNode.dom = dom = mount(input$1, null, lifecycle, context, isSVG);
	        vNode.children = input$1;
	        mountFunctionalComponentCallbacks(ref, dom, lifecycle);
	        if (!isNull(parentDom)) {
	            appendChild(parentDom, dom);
	        }
	    }
	    return dom;
	}
	function mountClassComponentCallbacks(vNode, ref, instance, lifecycle) {
	    if (ref) {
	        if (isFunction(ref)) {
	            ref(instance);
	        }
	        else {
	            if (process.env.NODE_ENV !== 'production') {
	                if (isStringOrNumber(ref)) {
	                    throwError('string "refs" are not supported in Inferno 1.0. Use callback "refs" instead.');
	                }
	                else if (isObject(ref) && (vNode.flags & 4 /* ComponentClass */)) {
	                    throwError('functional component lifecycle events are not supported on ES2015 class components.');
	                }
	                else {
	                    throwError(("a bad value for \"ref\" was used on component: \"" + (JSON.stringify(ref)) + "\""));
	                }
	            }
	            throwError();
	        }
	    }
	    var cDM = instance.componentDidMount;
	    var afterMount = options.afterMount;
	    if (!isUndefined(cDM) || !isNull(afterMount)) {
	        lifecycle.addListener(function () {
	            afterMount && afterMount(vNode);
	            cDM && instance.componentDidMount();
	        });
	    }
	}
	function mountFunctionalComponentCallbacks(ref, dom, lifecycle) {
	    if (ref) {
	        if (!isNullOrUndef(ref.onComponentWillMount)) {
	            ref.onComponentWillMount();
	        }
	        if (!isNullOrUndef(ref.onComponentDidMount)) {
	            lifecycle.addListener(function () { return ref.onComponentDidMount(dom); });
	        }
	        if (!isNullOrUndef(ref.onComponentWillUnmount)) {
	            lifecycle.fastUnmount = false;
	        }
	    }
	}
	function mountRef(dom, value, lifecycle) {
	    if (isFunction(value)) {
	        lifecycle.fastUnmount = false;
	        lifecycle.addListener(function () { return value(dom); });
	    }
	    else {
	        if (isInvalid(value)) {
	            return;
	        }
	        if (process.env.NODE_ENV !== 'production') {
	            throwError('string "refs" are not supported in Inferno 1.0. Use callback "refs" instead.');
	        }
	        throwError();
	    }
	}

	function normalizeChildNodes(parentDom) {
	    var dom = parentDom.firstChild;
	    while (dom) {
	        if (dom.nodeType === 8) {
	            if (dom.data === '!') {
	                var placeholder = document.createTextNode('');
	                parentDom.replaceChild(placeholder, dom);
	                dom = dom.nextSibling;
	            }
	            else {
	                var lastDom = dom.previousSibling;
	                parentDom.removeChild(dom);
	                dom = lastDom || parentDom.firstChild;
	            }
	        }
	        else {
	            dom = dom.nextSibling;
	        }
	    }
	}
	function hydrateComponent(vNode, dom, lifecycle, context, isSVG, isClass) {
	    var type = vNode.type;
	    var props = vNode.props || EMPTY_OBJ;
	    var ref = vNode.ref;
	    vNode.dom = dom;
	    if (isClass) {
	        var _isSVG = dom.namespaceURI === svgNS;
	        var defaultProps = type.defaultProps;
	        if (!isUndefined(defaultProps)) {
	            copyPropsTo(defaultProps, props);
	            vNode.props = props;
	        }
	        var instance = createClassComponentInstance(vNode, type, props, context, _isSVG);
	        // If instance does not have componentWillUnmount specified we can enable fastUnmount
	        var prevFastUnmount = lifecycle.fastUnmount;
	        var input = instance._lastInput;
	        // we store the fastUnmount value, but we set it back to true on the lifecycle
	        // we do this so we can determine if the component render has a fastUnmount or not
	        lifecycle.fastUnmount = true;
	        instance._vComponent = vNode;
	        instance._vNode = vNode;
	        hydrate(input, dom, lifecycle, instance._childContext, _isSVG);
	        // we now create a lifecycle for this component and store the fastUnmount value
	        var subLifecycle = instance._lifecycle = new Lifecycle();
	        // children lifecycle can fastUnmount if itself does need unmount callback and within its cycle there was none
	        subLifecycle.fastUnmount = isUndefined(instance.componentWillUnmount) && lifecycle.fastUnmount;
	        // higher lifecycle can fastUnmount only if previously it was able to and this children doesnt have any
	        lifecycle.fastUnmount = prevFastUnmount && subLifecycle.fastUnmount;
	        mountClassComponentCallbacks(vNode, ref, instance, lifecycle);
	        options.findDOMNodeEnabled && componentToDOMNodeMap.set(instance, dom);
	        vNode.children = instance;
	    }
	    else {
	        var input$1 = createFunctionalComponentInput(vNode, type, props, context);
	        hydrate(input$1, dom, lifecycle, context, isSVG);
	        vNode.children = input$1;
	        vNode.dom = input$1.dom;
	        mountFunctionalComponentCallbacks(ref, dom, lifecycle);
	    }
	    return dom;
	}
	function hydrateElement(vNode, dom, lifecycle, context, isSVG) {
	    var tag = vNode.type;
	    var children = vNode.children;
	    var props = vNode.props;
	    var events = vNode.events;
	    var flags = vNode.flags;
	    var ref = vNode.ref;
	    if (isSVG || (flags & 128 /* SvgElement */)) {
	        isSVG = true;
	    }
	    if (dom.nodeType !== 1 || dom.tagName.toLowerCase() !== tag) {
	        if (process.env.NODE_ENV !== 'production') {
	            warning('Inferno hydration: Server-side markup doesn\'t match client-side markup or Initial render target is not empty');
	        }
	        var newDom = mountElement(vNode, null, lifecycle, context, isSVG);
	        vNode.dom = newDom;
	        replaceChild(dom.parentNode, newDom, dom);
	        return newDom;
	    }
	    vNode.dom = dom;
	    if (children) {
	        hydrateChildren(children, dom, lifecycle, context, isSVG);
	    }
	    var hasControlledValue = false;
	    if (!(flags & 2 /* HtmlElement */)) {
	        hasControlledValue = processElement(flags, vNode, dom);
	    }
	    if (props) {
	        for (var prop in props) {
	            patchProp(prop, null, props[prop], dom, isSVG, hasControlledValue);
	        }
	    }
	    if (events) {
	        for (var name in events) {
	            patchEvent(name, null, events[name], dom);
	        }
	    }
	    if (ref) {
	        mountRef(dom, ref, lifecycle);
	    }
	    return dom;
	}
	function hydrateChildren(children, parentDom, lifecycle, context, isSVG) {
	    normalizeChildNodes(parentDom);
	    var dom = parentDom.firstChild;
	    if (isArray(children)) {
	        for (var i = 0; i < children.length; i++) {
	            var child = children[i];
	            if (!isNull(child) && isObject(child)) {
	                if (dom) {
	                    dom = hydrate(child, dom, lifecycle, context, isSVG);
	                    dom = dom.nextSibling;
	                }
	                else {
	                    mount(child, parentDom, lifecycle, context, isSVG);
	                }
	            }
	        }
	    }
	    else if (isStringOrNumber(children)) {
	        if (dom && dom.nodeType === 3) {
	            if (dom.nodeValue !== children) {
	                dom.nodeValue = children;
	            }
	        }
	        else if (children) {
	            parentDom.textContent = children;
	        }
	        dom = dom.nextSibling;
	    }
	    else if (isObject(children)) {
	        hydrate(children, dom, lifecycle, context, isSVG);
	        dom = dom.nextSibling;
	    }
	    // clear any other DOM nodes, there should be only a single entry for the root
	    while (dom) {
	        var nextSibling = dom.nextSibling;
	        parentDom.removeChild(dom);
	        dom = nextSibling;
	    }
	}
	function hydrateText(vNode, dom) {
	    if (dom.nodeType !== 3) {
	        var newDom = mountText(vNode, null);
	        vNode.dom = newDom;
	        replaceChild(dom.parentNode, newDom, dom);
	        return newDom;
	    }
	    var text = vNode.children;
	    if (dom.nodeValue !== text) {
	        dom.nodeValue = text;
	    }
	    vNode.dom = dom;
	    return dom;
	}
	function hydrateVoid(vNode, dom) {
	    vNode.dom = dom;
	    return dom;
	}
	function hydrate(vNode, dom, lifecycle, context, isSVG) {
	    var flags = vNode.flags;
	    if (flags & 28 /* Component */) {
	        return hydrateComponent(vNode, dom, lifecycle, context, isSVG, flags & 4 /* ComponentClass */);
	    }
	    else if (flags & 3970 /* Element */) {
	        return hydrateElement(vNode, dom, lifecycle, context, isSVG);
	    }
	    else if (flags & 1 /* Text */) {
	        return hydrateText(vNode, dom);
	    }
	    else if (flags & 4096 /* Void */) {
	        return hydrateVoid(vNode, dom);
	    }
	    else {
	        if (process.env.NODE_ENV !== 'production') {
	            throwError(("hydrate() expects a valid VNode, instead it received an object with the type \"" + (typeof vNode) + "\"."));
	        }
	        throwError();
	    }
	}
	function hydrateRoot(input, parentDom, lifecycle) {
	    var dom = parentDom && parentDom.firstChild;
	    if (dom) {
	        hydrate(input, dom, lifecycle, {}, false);
	        dom = parentDom.firstChild;
	        // clear any other DOM nodes, there should be only a single entry for the root
	        while (dom = dom.nextSibling) {
	            parentDom.removeChild(dom);
	        }
	        return true;
	    }
	    return false;
	}

	// rather than use a Map, like we did before, we can use an array here
	// given there shouldn't be THAT many roots on the page, the difference
	// in performance is huge: https://esbench.com/bench/5802a691330ab09900a1a2da
	var roots = [];
	var componentToDOMNodeMap = new Map();
	options.roots = roots;
	function findDOMNode(ref) {
	    if (!options.findDOMNodeEnabled) {
	        if (process.env.NODE_ENV !== 'production') {
	            throwError('findDOMNode() has been disabled, use Inferno.options.findDOMNodeEnabled = true; enabled findDOMNode(). Warning this can significantly impact performance!');
	        }
	        throwError();
	    }
	    var dom = ref && ref.nodeType ? ref : null;
	    return componentToDOMNodeMap.get(ref) || dom;
	}
	function getRoot(dom) {
	    for (var i = 0; i < roots.length; i++) {
	        var root = roots[i];
	        if (root.dom === dom) {
	            return root;
	        }
	    }
	    return null;
	}
	function setRoot(dom, input, lifecycle) {
	    var root = {
	        dom: dom,
	        input: input,
	        lifecycle: lifecycle
	    };
	    roots.push(root);
	    return root;
	}
	function removeRoot(root) {
	    for (var i = 0; i < roots.length; i++) {
	        if (roots[i] === root) {
	            roots.splice(i, 1);
	            return;
	        }
	    }
	}
	if (process.env.NODE_ENV !== 'production') {
	    if (isBrowser && document.body === null) {
	        warning('Inferno warning: you cannot initialize inferno without "document.body". Wait on "DOMContentLoaded" event, add script to bottom of body, or use async/defer attributes on script tag.');
	    }
	}
	var documentBody = isBrowser ? document.body : null;
	function render(input, parentDom) {
	    if (documentBody === parentDom) {
	        if (process.env.NODE_ENV !== 'production') {
	            throwError('you cannot render() to the "document.body". Use an empty element as a container instead.');
	        }
	        throwError();
	    }
	    if (input === NO_OP) {
	        return;
	    }
	    var root = getRoot(parentDom);
	    if (isNull(root)) {
	        var lifecycle = new Lifecycle();
	        if (!isInvalid(input)) {
	            if (input.dom) {
	                input = cloneVNode(input);
	            }
	            if (!hydrateRoot(input, parentDom, lifecycle)) {
	                mount(input, parentDom, lifecycle, {}, false);
	            }
	            root = setRoot(parentDom, input, lifecycle);
	            lifecycle.trigger();
	        }
	    }
	    else {
	        var lifecycle$1 = root.lifecycle;
	        lifecycle$1.listeners = [];
	        if (isNullOrUndef(input)) {
	            unmount(root.input, parentDom, lifecycle$1, false, false);
	            removeRoot(root);
	        }
	        else {
	            if (input.dom) {
	                input = cloneVNode(input);
	            }
	            patch(root.input, input, parentDom, lifecycle$1, {}, false, false);
	        }
	        lifecycle$1.trigger();
	        root.input = input;
	    }
	    if (root) {
	        var rootInput = root.input;
	        if (rootInput && (rootInput.flags & 28 /* Component */)) {
	            return rootInput.children;
	        }
	    }
	}
	function createRenderer(_parentDom) {
	    var parentDom = _parentDom || null;
	    return function renderer(lastInput, nextInput) {
	        if (!parentDom) {
	            parentDom = lastInput;
	        }
	        render(nextInput, parentDom);
	    };
	}

	function linkEvent(data, event) {
	    return { data: data, event: event };
	}

	if (process.env.NODE_ENV !== 'production') {
		Object.freeze(EMPTY_OBJ);
		var testFunc = function testFn() {};
		if ((testFunc.name || testFunc.toString()).indexOf('testFn') === -1) {
			warning(('It looks like you\'re using a minified copy of the development build ' +
					'of Inferno. When deploying Inferno apps to production, make sure to use ' +
					'the production build which skips development warnings and is faster. ' +
					'See http://infernojs.org for more details.'
			));
		}
	}

	// This will be replaced by rollup
	var version = '1.2.2';

	// we duplicate it so it plays nicely with different module loading systems
	var index = {
		linkEvent: linkEvent,
		// core shapes
		createVNode: createVNode,

		// cloning
		cloneVNode: cloneVNode,

		// used to shared common items between Inferno libs
		NO_OP: NO_OP,
		EMPTY_OBJ: EMPTY_OBJ,

		// DOM
		render: render,
		findDOMNode: findDOMNode,
		createRenderer: createRenderer,
		options: options,
		version: version
	};

	exports['default'] = index;
	exports.linkEvent = linkEvent;
	exports.createVNode = createVNode;
	exports.cloneVNode = cloneVNode;
	exports.NO_OP = NO_OP;
	exports.EMPTY_OBJ = EMPTY_OBJ;
	exports.render = render;
	exports.findDOMNode = findDOMNode;
	exports.createRenderer = createRenderer;
	exports.options = options;
	exports.version = version;

	Object.defineProperty(exports, '__esModule', { value: true });

	})));

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(2)))

/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map
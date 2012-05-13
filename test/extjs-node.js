var Ext = module.exports;
var extBasePath = "/Users/age/git/explorer/node_modules/extjs-node/src/ext/src";

/**
 * @class Ext
 * @singleton
 */
var Ext = Ext || {};
Ext._startTime = new Date().getTime();
(function() {
    var global = this,
        objectPrototype = Object.prototype,
        toString = objectPrototype.toString,
        enumerables = true,
        enumerablesTest = { toString: 1 },
        emptyFn = function () {},
        // This is the "$previous" method of a hook function on an instance. When called, it
        // calls through the class prototype by the name of the called method.
        callOverrideParent = function () {
            var method = callOverrideParent.caller.caller; // skip callParent (our caller)
            return method.$owner.prototype[method.$name].apply(this, arguments);
        },
        i;

    Ext.global = global;

    for (i in enumerablesTest) {
        enumerables = null;
    }

    if (enumerables) {
        enumerables = ['hasOwnProperty', 'valueOf', 'isPrototypeOf', 'propertyIsEnumerable',
                       'toLocaleString', 'toString', 'constructor'];
    }

    /**
     * An array containing extra enumerables for old browsers
     * @property {String[]}
     */
    Ext.enumerables = enumerables;

    /**
     * Copies all the properties of config to the specified object.
     * Note that if recursive merging and cloning without referencing the original objects / arrays is needed, use
     * {@link Ext.Object#merge} instead.
     * @param {Object} object The receiver of the properties
     * @param {Object} config The source of the properties
     * @param {Object} [defaults] A different object that will also be applied for default values
     * @return {Object} returns obj
     */
    Ext.apply = function(object, config, defaults) {
        if (defaults) {
            Ext.apply(object, defaults);
        }

        if (object && config && typeof config === 'object') {
            var i, j, k;

            for (i in config) {
                object[i] = config[i];
            }

            if (enumerables) {
                for (j = enumerables.length; j--;) {
                    k = enumerables[j];
                    if (config.hasOwnProperty(k)) {
                        object[k] = config[k];
                    }
                }
            }
        }

        return object;
    };

    Ext.buildSettings = Ext.apply({
        baseCSSPrefix: 'x-',
        scopeResetCSS: false
    }, Ext.buildSettings || {});

    Ext.apply(Ext, {

        /**
         * @property {String} [name='Ext']
         * <p>The name of the property in the global namespace (The <code>window</code> in browser environments) which refers to the current instance of Ext.</p>
         * <p>This is usually <code>"Ext"</code>, but if a sandboxed build of ExtJS is being used, this will be an alternative name.</p>
         * <p>If code is being generated for use by <code>eval</code> or to create a <code>new Function</code>, and the global instance
         * of Ext must be referenced, this is the name that should be built into the code.</p>
         */
        name: Ext.sandboxName || 'Ext',

        /**
         * A reusable empty function
         */
        emptyFn: emptyFn,

        /**
         * A zero length string which will pass a truth test. Useful for passing to methods
         * which use a truth test to reject <i>falsy</i> values where a string value must be cleared.
         */
        emptyString: new String(),

        baseCSSPrefix: Ext.buildSettings.baseCSSPrefix,

        /**
         * Copies all the properties of config to object if they don't already exist.
         * @param {Object} object The receiver of the properties
         * @param {Object} config The source of the properties
         * @return {Object} returns obj
         */
        applyIf: function(object, config) {
            var property;

            if (object) {
                for (property in config) {
                    if (object[property] === undefined) {
                        object[property] = config[property];
                    }
                }
            }

            return object;
        },

        /**
         * Iterates either an array or an object. This method delegates to
         * {@link Ext.Array#each Ext.Array.each} if the given value is iterable, and {@link Ext.Object#each Ext.Object.each} otherwise.
         *
         * @param {Object/Array} object The object or array to be iterated.
         * @param {Function} fn The function to be called for each iteration. See and {@link Ext.Array#each Ext.Array.each} and
         * {@link Ext.Object#each Ext.Object.each} for detailed lists of arguments passed to this function depending on the given object
         * type that is being iterated.
         * @param {Object} scope (Optional) The scope (`this` reference) in which the specified function is executed.
         * Defaults to the object being iterated itself.
         * @markdown
         */
        iterate: function(object, fn, scope) {
            if (Ext.isEmpty(object)) {
                return;
            }

            if (scope === undefined) {
                scope = object;
            }

            if (Ext.isIterable(object)) {
                Ext.Array.each.call(Ext.Array, object, fn, scope);
            }
            else {
                Ext.Object.each.call(Ext.Object, object, fn, scope);
            }
        }
    });

    Ext.apply(Ext, {

        /**
         * This method deprecated. Use {@link Ext#define Ext.define} instead.
         * @method
         * @param {Function} superclass
         * @param {Object} overrides
         * @return {Function} The subclass constructor from the <tt>overrides</tt> parameter, or a generated one if not provided.
         * @deprecated 4.0.0 Use {@link Ext#define Ext.define} instead
         */
        extend: (function() {
            // inline overrides
            var objectConstructor = objectPrototype.constructor,
                inlineOverrides = function(o) {
                for (var m in o) {
                    if (!o.hasOwnProperty(m)) {
                        continue;
                    }
                    this[m] = o[m];
                }
            };

            return function(subclass, superclass, overrides) {
                // First we check if the user passed in just the superClass with overrides
                if (Ext.isObject(superclass)) {
                    overrides = superclass;
                    superclass = subclass;
                    subclass = overrides.constructor !== objectConstructor ? overrides.constructor : function() {
                        superclass.apply(this, arguments);
                    };
                }

                //<debug>
                if (!superclass) {
                    Ext.Error.raise({
                        sourceClass: 'Ext',
                        sourceMethod: 'extend',
                        msg: 'Attempting to extend from a class which has not been loaded on the page.'
                    });
                }
                //</debug>

                // We create a new temporary class
                var F = function() {},
                    subclassProto, superclassProto = superclass.prototype;

                F.prototype = superclassProto;
                subclassProto = subclass.prototype = new F();
                subclassProto.constructor = subclass;
                subclass.superclass = superclassProto;

                if (superclassProto.constructor === objectConstructor) {
                    superclassProto.constructor = superclass;
                }

                subclass.override = function(overrides) {
                    Ext.override(subclass, overrides);
                };

                subclassProto.override = inlineOverrides;
                subclassProto.proto = subclassProto;

                subclass.override(overrides);
                subclass.extend = function(o) {
                    return Ext.extend(subclass, o);
                };

                return subclass;
            };
        }()),

        /**
         * Overrides members of the specified `target` with the given values.
         * 
         * If the `target` is a class declared using {@link Ext#define Ext.define}, the
         * `override` method of that class is called (see {@link Ext.Base#override}) given
         * the `overrides`.
         *
         * If the `target` is a function, it is assumed to be a constructor and the contents
         * of `overrides` are applied to its `prototype` using {@link Ext#apply Ext.apply}.
         * 
         * If the `target` is an instance of a class declared using {@link Ext#define Ext.define},
         * the `overrides` are applied to only that instance. In this case, methods are
         * specially processed to allow them to use {@link Ext.Base#callParent}.
         * 
         *      var panel = new Ext.Panel({ ... });
         *      
         *      Ext.override(panel, {
         *          initComponent: function () {
         *              // extra processing...
         *              
         *              this.callParent();
         *          }
         *      });
         *
         * If the `target` is none of these, the `overrides` are applied to the `target`
         * using {@link Ext#apply Ext.apply}.
         *
         * Please refer to {@link Ext#define Ext.define} and {@link Ext.Base#override} for
         * further details.
         *
         * @param {Object} target The target to override.
         * @param {Object} overrides The properties to add or replace on `target`. 
         * @method override
         */
        override: function (target, overrides) {
            if (target.$isClass) {
                target.override(overrides);
            } else if (typeof target == 'function') {
                Ext.apply(target.prototype, overrides);
            } else {
                var owner = target.self,
                    name, value;

                if (owner && owner.$isClass) { // if (instance of Ext.define'd class)
                    for (name in overrides) {
                        if (overrides.hasOwnProperty(name)) {
                            value = overrides[name];

                            if (typeof value == 'function') {
                                //<debug>
                                if (owner.$className) {
                                    value.displayName = owner.$className + '#' + name;
                                }
                                //</debug>

                                value.$name = name;
                                value.$owner = owner;
                                value.$previous = target.hasOwnProperty(name)
                                    ? target[name] // already hooked, so call previous hook
                                    : callOverrideParent; // calls by name on prototype
                            }

                            target[name] = value;
                        }
                    }
                } else {
                    Ext.apply(target, overrides);
                }
            }

            return target;
        }
    });

    // A full set of static methods to do type checking
    Ext.apply(Ext, {

        /**
         * Returns the given value itself if it's not empty, as described in {@link Ext#isEmpty}; returns the default
         * value (second argument) otherwise.
         *
         * @param {Object} value The value to test
         * @param {Object} defaultValue The value to return if the original value is empty
         * @param {Boolean} allowBlank (optional) true to allow zero length strings to qualify as non-empty (defaults to false)
         * @return {Object} value, if non-empty, else defaultValue
         */
        valueFrom: function(value, defaultValue, allowBlank){
            return Ext.isEmpty(value, allowBlank) ? defaultValue : value;
        },

        /**
         * Returns the type of the given variable in string format. List of possible values are:
         *
         * - `undefined`: If the given value is `undefined`
         * - `null`: If the given value is `null`
         * - `string`: If the given value is a string
         * - `number`: If the given value is a number
         * - `boolean`: If the given value is a boolean value
         * - `date`: If the given value is a `Date` object
         * - `function`: If the given value is a function reference
         * - `object`: If the given value is an object
         * - `array`: If the given value is an array
         * - `regexp`: If the given value is a regular expression
         * - `element`: If the given value is a DOM Element
         * - `textnode`: If the given value is a DOM text node and contains something other than whitespace
         * - `whitespace`: If the given value is a DOM text node and contains only whitespace
         *
         * @param {Object} value
         * @return {String}
         * @markdown
         */
        typeOf: function(value) {
            var type,
                typeToString;
            
            if (value === null) {
                return 'null';
            }

            type = typeof value;

            if (type === 'undefined' || type === 'string' || type === 'number' || type === 'boolean') {
                return type;
            }

            typeToString = toString.call(value);

            switch(typeToString) {
                case '[object Array]':
                    return 'array';
                case '[object Date]':
                    return 'date';
                case '[object Boolean]':
                    return 'boolean';
                case '[object Number]':
                    return 'number';
                case '[object RegExp]':
                    return 'regexp';
            }

            if (type === 'function') {
                return 'function';
            }

            if (type === 'object') {
                if (value.nodeType !== undefined) {
                    if (value.nodeType === 3) {
                        return (/\S/).test(value.nodeValue) ? 'textnode' : 'whitespace';
                    }
                    else {
                        return 'element';
                    }
                }

                return 'object';
            }

            //<debug error>
            Ext.Error.raise({
                sourceClass: 'Ext',
                sourceMethod: 'typeOf',
                msg: 'Failed to determine the type of the specified value "' + value + '". This is most likely a bug.'
            });
            //</debug>
        },

        /**
         * Returns true if the passed value is empty, false otherwise. The value is deemed to be empty if it is either:
         *
         * - `null`
         * - `undefined`
         * - a zero-length array
         * - a zero-length string (Unless the `allowEmptyString` parameter is set to `true`)
         *
         * @param {Object} value The value to test
         * @param {Boolean} allowEmptyString (optional) true to allow empty strings (defaults to false)
         * @return {Boolean}
         * @markdown
         */
        isEmpty: function(value, allowEmptyString) {
            return (value === null) || (value === undefined) || (!allowEmptyString ? value === '' : false) || (Ext.isArray(value) && value.length === 0);
        },

        /**
         * Returns true if the passed value is a JavaScript Array, false otherwise.
         *
         * @param {Object} target The target to test
         * @return {Boolean}
         * @method
         */
        isArray: ('isArray' in Array) ? Array.isArray : function(value) {
            return toString.call(value) === '[object Array]';
        },

        /**
         * Returns true if the passed value is a JavaScript Date object, false otherwise.
         * @param {Object} object The object to test
         * @return {Boolean}
         */
        isDate: function(value) {
            return toString.call(value) === '[object Date]';
        },

        /**
         * Returns true if the passed value is a JavaScript Object, false otherwise.
         * @param {Object} value The value to test
         * @return {Boolean}
         * @method
         */
        isObject: (toString.call(null) === '[object Object]') ?
        function(value) {
            // check ownerDocument here as well to exclude DOM nodes
            return value !== null && value !== undefined && toString.call(value) === '[object Object]' && value.ownerDocument === undefined;
        } :
        function(value) {
            return toString.call(value) === '[object Object]';
        },

        /**
         * @private
         */
        isSimpleObject: function(value) {
            return value instanceof Object && value.constructor === Object;
        },
        /**
         * Returns true if the passed value is a JavaScript 'primitive', a string, number or boolean.
         * @param {Object} value The value to test
         * @return {Boolean}
         */
        isPrimitive: function(value) {
            var type = typeof value;

            return type === 'string' || type === 'number' || type === 'boolean';
        },

        /**
         * Returns true if the passed value is a JavaScript Function, false otherwise.
         * @param {Object} value The value to test
         * @return {Boolean}
         * @method
         */
        isFunction:
        // Safari 3.x and 4.x returns 'function' for typeof <NodeList>, hence we need to fall back to using
        // Object.prototype.toString (slower)
        (typeof document !== 'undefined' && typeof document.getElementsByTagName('body') === 'function') ? function(value) {
            return toString.call(value) === '[object Function]';
        } : function(value) {
            return typeof value === 'function';
        },

        /**
         * Returns true if the passed value is a number. Returns false for non-finite numbers.
         * @param {Object} value The value to test
         * @return {Boolean}
         */
        isNumber: function(value) {
            return typeof value === 'number' && isFinite(value);
        },

        /**
         * Validates that a value is numeric.
         * @param {Object} value Examples: 1, '1', '2.34'
         * @return {Boolean} True if numeric, false otherwise
         */
        isNumeric: function(value) {
            return !isNaN(parseFloat(value)) && isFinite(value);
        },

        /**
         * Returns true if the passed value is a string.
         * @param {Object} value The value to test
         * @return {Boolean}
         */
        isString: function(value) {
            return typeof value === 'string';
        },

        /**
         * Returns true if the passed value is a boolean.
         *
         * @param {Object} value The value to test
         * @return {Boolean}
         */
        isBoolean: function(value) {
            return typeof value === 'boolean';
        },

        /**
         * Returns true if the passed value is an HTMLElement
         * @param {Object} value The value to test
         * @return {Boolean}
         */
        isElement: function(value) {
            return value ? value.nodeType === 1 : false;
        },

        /**
         * Returns true if the passed value is a TextNode
         * @param {Object} value The value to test
         * @return {Boolean}
         */
        isTextNode: function(value) {
            return value ? value.nodeName === "#text" : false;
        },

        /**
         * Returns true if the passed value is defined.
         * @param {Object} value The value to test
         * @return {Boolean}
         */
        isDefined: function(value) {
            return typeof value !== 'undefined';
        },

        /**
         * Returns true if the passed value is iterable, false otherwise
         * @param {Object} value The value to test
         * @return {Boolean}
         */
        isIterable: function(value) {
            var type = typeof value,
                checkLength = false;
            if (value && type != 'string') {
                // Functions have a length property, so we need to filter them out
                if (type == 'function') {
                    // In Safari, NodeList/HTMLCollection both return "function" when using typeof, so we need
                    // to explicitly check them here.
                    if (Ext.isSafari) {
                        checkLength = value instanceof NodeList || value instanceof HTMLCollection;
                    }
                } else {
                    checkLength = true;
                }
            }
            return checkLength ? value.length !== undefined : false;
        }
    });

    Ext.apply(Ext, {

        /**
         * Clone simple variables including array, {}-like objects, DOM nodes and Date without keeping the old reference.
         * A reference for the object itself is returned if it's not a direct decendant of Object. For model cloning,
         * see {@link Model#copy Model.copy}.
         * 
         * @param {Object} item The variable to clone
         * @return {Object} clone
         */
        clone: function(item) {
            var type,
                i,
                j,
                k,
                clone,
                key;
            
            if (item === null || item === undefined) {
                return item;
            }

            // DOM nodes
            // TODO proxy this to Ext.Element.clone to handle automatic id attribute changing
            // recursively
            if (item.nodeType && item.cloneNode) {
                return item.cloneNode(true);
            }

            type = toString.call(item);

            // Date
            if (type === '[object Date]') {
                return new Date(item.getTime());
            }


            // Array
            if (type === '[object Array]') {
                i = item.length;

                clone = [];

                while (i--) {
                    clone[i] = Ext.clone(item[i]);
                }
            }
            // Object
            else if (type === '[object Object]' && item.constructor === Object) {
                clone = {};

                for (key in item) {
                    clone[key] = Ext.clone(item[key]);
                }

                if (enumerables) {
                    for (j = enumerables.length; j--;) {
                        k = enumerables[j];
                        clone[k] = item[k];
                    }
                }
            }

            return clone || item;
        },

        /**
         * @private
         * Generate a unique reference of Ext in the global scope, useful for sandboxing
         */
        getUniqueGlobalNamespace: function() {
            var uniqueGlobalNamespace = this.uniqueGlobalNamespace,
                i;

            if (uniqueGlobalNamespace === undefined) {
                i = 0;

                do {
                    uniqueGlobalNamespace = 'ExtBox' + (++i);
                } while (Ext.global[uniqueGlobalNamespace] !== undefined);

                Ext.global[uniqueGlobalNamespace] = Ext;
                this.uniqueGlobalNamespace = uniqueGlobalNamespace;
            }

            return uniqueGlobalNamespace;
        },
        
        /**
         * @private
         */
        functionFactoryCache: {},
        
        cacheableFunctionFactory: function() {
            var me = this,
                args = Array.prototype.slice.call(arguments),
                cache = me.functionFactoryCache,
                idx, fn, ln;
                
             if (Ext.isSandboxed) {
                ln = args.length;
                if (ln > 0) {
                    ln--;
                    args[ln] = 'var Ext=window.' + Ext.name + ';' + args[ln];
                }
            }
            idx = args.join('');
            fn = cache[idx];
            if (!fn) {
                fn = Function.prototype.constructor.apply(Function.prototype, args);
                
                cache[idx] = fn;
            }
            return fn;
        },
        
        functionFactory: function() {
            var me = this,
                args = Array.prototype.slice.call(arguments),
                ln;
                
            if (Ext.isSandboxed) {
                ln = args.length;
                if (ln > 0) {
                    ln--;
                    args[ln] = 'var Ext=window.' + Ext.name + ';' + args[ln];
                }
            }
     
            return Function.prototype.constructor.apply(Function.prototype, args);
        },

        /**
         * @private
         * @property
         */
        Logger: {
            verbose: emptyFn,
            log: emptyFn,
            info: emptyFn,
            warn: emptyFn,
            error: function(message) {
                throw new Error(message);
            },
            deprecate: emptyFn
        }
    });

    /**
     * Old alias to {@link Ext#typeOf}
     * @deprecated 4.0.0 Use {@link Ext#typeOf} instead
     * @method
     * @inheritdoc Ext#typeOf
     */
    Ext.type = Ext.typeOf;

}());

/*
 * This method evaluates the given code free of any local variable. In some browsers this
 * will be at global scope, in others it will be in a function.
 * @parma {String} code The code to evaluate.
 * @private
 * @method
 */
Ext.globalEval = Ext.global.execScript
    ? function(code) {
        execScript(code);
    }
    : function($$code) {
        // IMPORTANT: because we use eval we cannot place this in the above function or it
        // will break the compressor's ability to rename local variables...
        (function(){
            eval($$code);
        }());
    };
 /**
 * @author Jacky Nguyen <jacky@sencha.com>
 * @docauthor Jacky Nguyen <jacky@sencha.com>
 * @class Ext.Version
 *
 * A utility class that wrap around a string version number and provide convenient
 * method to perform comparison. See also: {@link Ext.Version#compare compare}. Example:

    var version = new Ext.Version('1.0.2beta');
    console.log("Version is " + version); // Version is 1.0.2beta

    console.log(version.getMajor()); // 1
    console.log(version.getMinor()); // 0
    console.log(version.getPatch()); // 2
    console.log(version.getBuild()); // 0
    console.log(version.getRelease()); // beta

    console.log(version.isGreaterThan('1.0.1')); // True
    console.log(version.isGreaterThan('1.0.2alpha')); // True
    console.log(version.isGreaterThan('1.0.2RC')); // False
    console.log(version.isGreaterThan('1.0.2')); // False
    console.log(version.isLessThan('1.0.2')); // True

    console.log(version.match(1.0)); // True
    console.log(version.match('1.0.2')); // True

 * @markdown
 */
(function() {

// Current core version
var version = '4.1.0', Version;
    Ext.Version = Version = Ext.extend(Object, {

        /**
         * @param {String/Number} version The version number in the follow standard format: major[.minor[.patch[.build[release]]]]
         * Examples: 1.0 or 1.2.3beta or 1.2.3.4RC
         * @return {Ext.Version} this
         */
        constructor: function(version) {
            var parts, releaseStartIndex;

            if (version instanceof Version) {
                return version;
            }

            this.version = this.shortVersion = String(version).toLowerCase().replace(/_/g, '.').replace(/[\-+]/g, '');

            releaseStartIndex = this.version.search(/([^\d\.])/);

            if (releaseStartIndex !== -1) {
                this.release = this.version.substr(releaseStartIndex, version.length);
                this.shortVersion = this.version.substr(0, releaseStartIndex);
            }

            this.shortVersion = this.shortVersion.replace(/[^\d]/g, '');

            parts = this.version.split('.');

            this.major = parseInt(parts.shift() || 0, 10);
            this.minor = parseInt(parts.shift() || 0, 10);
            this.patch = parseInt(parts.shift() || 0, 10);
            this.build = parseInt(parts.shift() || 0, 10);

            return this;
        },

        /**
         * Override the native toString method
         * @private
         * @return {String} version
         */
        toString: function() {
            return this.version;
        },

        /**
         * Override the native valueOf method
         * @private
         * @return {String} version
         */
        valueOf: function() {
            return this.version;
        },

        /**
         * Returns the major component value
         * @return {Number} major
         */
        getMajor: function() {
            return this.major || 0;
        },

        /**
         * Returns the minor component value
         * @return {Number} minor
         */
        getMinor: function() {
            return this.minor || 0;
        },

        /**
         * Returns the patch component value
         * @return {Number} patch
         */
        getPatch: function() {
            return this.patch || 0;
        },

        /**
         * Returns the build component value
         * @return {Number} build
         */
        getBuild: function() {
            return this.build || 0;
        },

        /**
         * Returns the release component value
         * @return {Number} release
         */
        getRelease: function() {
            return this.release || '';
        },

        /**
         * Returns whether this version if greater than the supplied argument
         * @param {String/Number} target The version to compare with
         * @return {Boolean} True if this version if greater than the target, false otherwise
         */
        isGreaterThan: function(target) {
            return Version.compare(this.version, target) === 1;
        },

        /**
         * Returns whether this version if greater than or equal to the supplied argument
         * @param {String/Number} target The version to compare with
         * @return {Boolean} True if this version if greater than or equal to the target, false otherwise
         */
        isGreaterThanOrEqual: function(target) {
            return Version.compare(this.version, target) >= 0;
        },

        /**
         * Returns whether this version if smaller than the supplied argument
         * @param {String/Number} target The version to compare with
         * @return {Boolean} True if this version if smaller than the target, false otherwise
         */
        isLessThan: function(target) {
            return Version.compare(this.version, target) === -1;
        },

        /**
         * Returns whether this version if less than or equal to the supplied argument
         * @param {String/Number} target The version to compare with
         * @return {Boolean} True if this version if less than or equal to the target, false otherwise
         */
        isLessThanOrEqual: function(target) {
            return Version.compare(this.version, target) <= 0;
        },

        /**
         * Returns whether this version equals to the supplied argument
         * @param {String/Number} target The version to compare with
         * @return {Boolean} True if this version equals to the target, false otherwise
         */
        equals: function(target) {
            return Version.compare(this.version, target) === 0;
        },

        /**
         * Returns whether this version matches the supplied argument. Example:
         * <pre><code>
         * var version = new Ext.Version('1.0.2beta');
         * console.log(version.match(1)); // True
         * console.log(version.match(1.0)); // True
         * console.log(version.match('1.0.2')); // True
         * console.log(version.match('1.0.2RC')); // False
         * </code></pre>
         * @param {String/Number} target The version to compare with
         * @return {Boolean} True if this version matches the target, false otherwise
         */
        match: function(target) {
            target = String(target);
            return this.version.substr(0, target.length) === target;
        },

        /**
         * Returns this format: [major, minor, patch, build, release]. Useful for comparison
         * @return {Number[]}
         */
        toArray: function() {
            return [this.getMajor(), this.getMinor(), this.getPatch(), this.getBuild(), this.getRelease()];
        },

        /**
         * Returns shortVersion version without dots and release
         * @return {String}
         */
        getShortVersion: function() {
            return this.shortVersion;
        },

        /**
         * Convenient alias to {@link Ext.Version#isGreaterThan isGreaterThan}
         * @param {String/Number} target
         * @return {Boolean}
         */
        gt: function() {
            return this.isGreaterThan.apply(this, arguments);
        },

        /**
         * Convenient alias to {@link Ext.Version#isLessThan isLessThan}
         * @param {String/Number} target
         * @return {Boolean}
         */
        lt: function() {
            return this.isLessThan.apply(this, arguments);
        },

        /**
         * Convenient alias to {@link Ext.Version#isGreaterThanOrEqual isGreaterThanOrEqual}
         * @param {String/Number} target
         * @return {Boolean}
         */
        gtEq: function() {
            return this.isGreaterThanOrEqual.apply(this, arguments);
        },

        /**
         * Convenient alias to {@link Ext.Version#isLessThanOrEqual isLessThanOrEqual}
         * @param {String/Number} target
         * @return {Boolean}
         */
        ltEq: function() {
            return this.isLessThanOrEqual.apply(this, arguments);
        }
    });

    Ext.apply(Version, {
        // @private
        releaseValueMap: {
            'dev': -6,
            'alpha': -5,
            'a': -5,
            'beta': -4,
            'b': -4,
            'rc': -3,
            '#': -2,
            'p': -1,
            'pl': -1
        },

        /**
         * Converts a version component to a comparable value
         *
         * @static
         * @param {Object} value The value to convert
         * @return {Object}
         */
        getComponentValue: function(value) {
            return !value ? 0 : (isNaN(value) ? this.releaseValueMap[value] || value : parseInt(value, 10));
        },

        /**
         * Compare 2 specified versions, starting from left to right. If a part contains special version strings,
         * they are handled in the following order:
         * 'dev' < 'alpha' = 'a' < 'beta' = 'b' < 'RC' = 'rc' < '#' < 'pl' = 'p' < 'anything else'
         *
         * @static
         * @param {String} current The current version to compare to
         * @param {String} target The target version to compare to
         * @return {Number} Returns -1 if the current version is smaller than the target version, 1 if greater, and 0 if they're equivalent
         */
        compare: function(current, target) {
            var currentValue, targetValue, i;

            current = new Version(current).toArray();
            target = new Version(target).toArray();

            for (i = 0; i < Math.max(current.length, target.length); i++) {
                currentValue = this.getComponentValue(current[i]);
                targetValue = this.getComponentValue(target[i]);

                if (currentValue < targetValue) {
                    return -1;
                } else if (currentValue > targetValue) {
                    return 1;
                }
            }

            return 0;
        }
    });

    Ext.apply(Ext, {
        /**
         * @private
         */
        versions: {},

        /**
         * @private
         */
        lastRegisteredVersion: null,

        /**
         * Set version number for the given package name.
         *
         * @param {String} packageName The package name, for example: 'core', 'touch', 'extjs'
         * @param {String/Ext.Version} version The version, for example: '1.2.3alpha', '2.4.0-dev'
         * @return {Ext}
         */
        setVersion: function(packageName, version) {
            Ext.versions[packageName] = new Version(version);
            Ext.lastRegisteredVersion = Ext.versions[packageName];

            return this;
        },

        /**
         * Get the version number of the supplied package name; will return the last registered version
         * (last Ext.setVersion call) if there's no package name given.
         *
         * @param {String} packageName (Optional) The package name, for example: 'core', 'touch', 'extjs'
         * @return {Ext.Version} The version
         */
        getVersion: function(packageName) {
            if (packageName === undefined) {
                return Ext.lastRegisteredVersion;
            }

            return Ext.versions[packageName];
        },

        /**
         * Create a closure for deprecated code.
         *
    // This means Ext.oldMethod is only supported in 4.0.0beta and older.
    // If Ext.getVersion('extjs') returns a version that is later than '4.0.0beta', for example '4.0.0RC',
    // the closure will not be invoked
    Ext.deprecate('extjs', '4.0.0beta', function() {
        Ext.oldMethod = Ext.newMethod;

        ...
    });

         * @param {String} packageName The package name
         * @param {String} since The last version before it's deprecated
         * @param {Function} closure The callback function to be executed with the specified version is less than the current version
         * @param {Object} scope The execution scope (<tt>this</tt>) if the closure
         * @markdown
         */
        deprecate: function(packageName, since, closure, scope) {
            if (Version.compare(Ext.getVersion(packageName), since) < 1) {
                closure.call(scope);
            }
        }
    }); // End Versioning

    Ext.setVersion('core', version);

}());
 /**
 * @class Ext.String
 *
 * A collection of useful static methods to deal with strings
 * @singleton
 */

Ext.String = (function() {
    var trimRegex     = /^[\x09\x0a\x0b\x0c\x0d\x20\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u2028\u2029\u202f\u205f\u3000]+|[\x09\x0a\x0b\x0c\x0d\x20\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u2028\u2029\u202f\u205f\u3000]+$/g,
        escapeRe      = /('|\\)/g,
        formatRe      = /\{(\d+)\}/g,
        escapeRegexRe = /([-.*+?\^${}()|\[\]\/\\])/g,
        basicTrimRe   = /^\s+|\s+$/g,
        whitespaceRe  = /\s+/,
        varReplace    = /(^[^a-z]*|[^\w])/gi,
        charToEntity,
        entityToChar,
        charToEntityRegex,
        entityToCharRegex,
        htmlEncodeReplaceFn = function(match, capture) {
            return charToEntity[capture];
        },
        htmlDecodeReplaceFn = function(match, capture) {
            return (capture in entityToChar) ? entityToChar[capture] : String.fromCharCode(parseInt(capture.substr(2), 10));
        };

    return {

        /**
         * Converts a string of characters into a legal, parseable Javascript `var` name as long as the passed
         * string contains at least one alphabetic character. Non alphanumeric characters, and *leading* non alphabetic
         * characters will be removed.
         * @param {String} s A string to be converted into a `var` name.
         * @return {String} A legal Javascript `var` name.
         */
        createVarName: function(s) {
            return s.replace(varReplace, '');
        },

        /**
         * Convert certain characters (&, <, >, ', and ") to their HTML character equivalents for literal display in web pages.
         * @param {String} value The string to encode
         * @return {String} The encoded text
         * @method
         */
        htmlEncode: function(value) {
            return (!value) ? value : String(value).replace(charToEntityRegex, htmlEncodeReplaceFn);
        },

        /**
         * Convert certain characters (&, <, >, ', and ") from their HTML character equivalents.
         * @param {String} value The string to decode
         * @return {String} The decoded text
         * @method
         */
        htmlDecode: function(value) {
            return (!value) ? value : String(value).replace(entityToCharRegex, htmlDecodeReplaceFn);
        },

        /**
         * Adds a set of character entity definitions to the set used by
         * {@link Ext.String#htmlEncode} and {@link Ext.String#htmlDecode}.
         *
         * This object should be keyed by the entity name sequence,
         * with the value being the textual representation of the entity.
         *
         *      Ext.String.addCharacterEntities({
         *          '&amp;Uuml;':'Ü',
         *          '&amp;ccedil;':'ç',
         *          '&amp;ntilde;':'ñ',
         *          '&amp;egrave;':'è'
         *      });
         *      var s = Ext.String.htmlEncode("A string with entities: èÜçñ");
         *
         * Note: the values of the character entites defined on this object are expected
         * to be single character values.  As such, the actual values represented by the
         * characters are sensitive to the character encoding of the javascript source
         * file when defined in string literal form. Script tasgs referencing server
         * resources with character entities must ensure that the 'charset' attribute
         * of the script node is consistent with the actual character encoding of the
         * server resource.
         *
         * The set of character entities may be reset back to the default state by using
         * the {@link Ext.String#resetCharacterEntities} method
         *
         * @param {Object} entities The set of character entities to add to the current
         * definitions.
         */
        addCharacterEntities: function(newEntities) {
            var charKeys = [],
                entityKeys = [],
                key, echar;
            for (key in newEntities) {
                echar = newEntities[key];
                entityToChar[key] = echar;
                charToEntity[echar] = key;
                charKeys.push(echar);
                entityKeys.push(key);
            }
            charToEntityRegex = new RegExp('(' + charKeys.join('|') + ')', 'g');
            entityToCharRegex = new RegExp('(' + entityKeys.join('|') + '|&#[0-9]{1,5};' + ')', 'g');
        },

        /**
         * Resets the set of character entity definitions used by
         * {@link Ext.String#htmlEncode} and {@link Ext.String#htmlDecode} back to the
         * default state.
         */
        resetCharacterEntities: function() {
            charToEntity = {};
            entityToChar = {};
            // add the default set
            this.addCharacterEntities({
                '&amp;'     :   '&',
                '&gt;'      :   '>',
                '&lt;'      :   '<',
                '&quot;'    :   '"',
                '&#39;'     :   "'"
            });
        },

        /**
         * Appends content to the query string of a URL, handling logic for whether to place
         * a question mark or ampersand.
         * @param {String} url The URL to append to.
         * @param {String} string The content to append to the URL.
         * @return {String} The resulting URL
         */
        urlAppend : function(url, string) {
            if (!Ext.isEmpty(string)) {
                return url + (url.indexOf('?') === -1 ? '?' : '&') + string;
            }

            return url;
        },

        /**
         * Trims whitespace from either end of a string, leaving spaces within the string intact.  Example:
         * @example
    var s = '  foo bar  ';
    alert('-' + s + '-');         //alerts "- foo bar -"
    alert('-' + Ext.String.trim(s) + '-');  //alerts "-foo bar-"

         * @param {String} string The string to escape
         * @return {String} The trimmed string
         */
        trim: function(string) {
            return string.replace(trimRegex, "");
        },

        /**
         * Capitalize the given string
         * @param {String} string
         * @return {String}
         */
        capitalize: function(string) {
            return string.charAt(0).toUpperCase() + string.substr(1);
        },

        /**
         * Uncapitalize the given string
         * @param {String} string
         * @return {String}
         */
        uncapitalize: function(string) {
            return string.charAt(0).toLowerCase() + string.substr(1);
        },

        /**
         * Truncate a string and add an ellipsis ('...') to the end if it exceeds the specified length
         * @param {String} value The string to truncate
         * @param {Number} length The maximum length to allow before truncating
         * @param {Boolean} word True to try to find a common word break
         * @return {String} The converted text
         */
        ellipsis: function(value, len, word) {
            if (value && value.length > len) {
                if (word) {
                    var vs = value.substr(0, len - 2),
                    index = Math.max(vs.lastIndexOf(' '), vs.lastIndexOf('.'), vs.lastIndexOf('!'), vs.lastIndexOf('?'));
                    if (index !== -1 && index >= (len - 15)) {
                        return vs.substr(0, index) + "...";
                    }
                }
                return value.substr(0, len - 3) + "...";
            }
            return value;
        },

        /**
         * Escapes the passed string for use in a regular expression
         * @param {String} string
         * @return {String}
         */
        escapeRegex: function(string) {
            return string.replace(escapeRegexRe, "\\$1");
        },

        /**
         * Escapes the passed string for ' and \
         * @param {String} string The string to escape
         * @return {String} The escaped string
         */
        escape: function(string) {
            return string.replace(escapeRe, "\\$1");
        },

        /**
         * Utility function that allows you to easily switch a string between two alternating values.  The passed value
         * is compared to the current string, and if they are equal, the other value that was passed in is returned.  If
         * they are already different, the first value passed in is returned.  Note that this method returns the new value
         * but does not change the current string.
         * <pre><code>
        // alternate sort directions
        sort = Ext.String.toggle(sort, 'ASC', 'DESC');

        // instead of conditional logic:
        sort = (sort == 'ASC' ? 'DESC' : 'ASC');
           </code></pre>
         * @param {String} string The current string
         * @param {String} value The value to compare to the current string
         * @param {String} other The new value to use if the string already equals the first value passed in
         * @return {String} The new value
         */
        toggle: function(string, value, other) {
            return string === value ? other : value;
        },

        /**
         * Pads the left side of a string with a specified character.  This is especially useful
         * for normalizing number and date strings.  Example usage:
         *
         * <pre><code>
    var s = Ext.String.leftPad('123', 5, '0');
    // s now contains the string: '00123'
           </code></pre>
         * @param {String} string The original string
         * @param {Number} size The total length of the output string
         * @param {String} character (optional) The character with which to pad the original string (defaults to empty string " ")
         * @return {String} The padded string
         */
        leftPad: function(string, size, character) {
            var result = String(string);
            character = character || " ";
            while (result.length < size) {
                result = character + result;
            }
            return result;
        },

        /**
         * Allows you to define a tokenized string and pass an arbitrary number of arguments to replace the tokens.  Each
         * token must be unique, and must increment in the format {0}, {1}, etc.  Example usage:
         * <pre><code>
    var cls = 'my-class', text = 'Some text';
    var s = Ext.String.format('&lt;div class="{0}">{1}&lt;/div>', cls, text);
    // s now contains the string: '&lt;div class="my-class">Some text&lt;/div>'
           </code></pre>
         * @param {String} string The tokenized string to be formatted
         * @param {String} value1 The value to replace token {0}
         * @param {String} value2 Etc...
         * @return {String} The formatted string
         */
        format: function(format) {
            var args = Ext.Array.toArray(arguments, 1);
            return format.replace(formatRe, function(m, i) {
                return args[i];
            });
        },

        /**
         * Returns a string with a specified number of repititions a given string pattern.
         * The pattern be separated by a different string.
         *
         *      var s = Ext.String.repeat('---', 4); // = '------------'
         *      var t = Ext.String.repeat('--', 3, '/'); // = '--/--/--'
         *
         * @param {String} pattern The pattern to repeat.
         * @param {Number} count The number of times to repeat the pattern (may be 0).
         * @param {String} sep An option string to separate each pattern.
         */
        repeat: function(pattern, count, sep) {
            for (var buf = [], i = count; i--; ) {
                buf.push(pattern);
            }
            return buf.join(sep || '');
        },

        /**
         * Splits a string of space separated words into an array, trimming as needed. If the
         * words are already an array, it is returned.
         *
         * @param {String/Array} words
         */
        splitWords: function (words) {
            if (words && typeof words == 'string') {
                return words.replace(basicTrimRe, '').split(whitespaceRe);
            }
            return words || [];
        }
    };
}());

// initialize the default encode / decode entities
Ext.String.resetCharacterEntities();

/**
 * Old alias to {@link Ext.String#htmlEncode}
 * @deprecated Use {@link Ext.String#htmlEncode} instead
 * @method
 * @member Ext
 * @inheritdoc Ext.String#htmlEncode
 */
Ext.htmlEncode = Ext.String.htmlEncode;


/**
 * Old alias to {@link Ext.String#htmlDecode}
 * @deprecated Use {@link Ext.String#htmlDecode} instead
 * @method
 * @member Ext
 * @inheritdoc Ext.String#htmlDecode
 */
Ext.htmlDecode = Ext.String.htmlDecode;

/**
 * Old alias to {@link Ext.String#urlAppend}
 * @deprecated Use {@link Ext.String#urlAppend} instead
 * @method
 * @member Ext
 * @inheritdoc Ext.String#urlAppend
 */
Ext.urlAppend = Ext.String.urlAppend; /**
 * @class Ext.Array
 * @singleton
 * @author Jacky Nguyen <jacky@sencha.com>
 * @docauthor Jacky Nguyen <jacky@sencha.com>
 *
 * A set of useful static methods to deal with arrays; provide missing methods for older browsers.
 */
(function() {

    var arrayPrototype = Array.prototype,
        slice = arrayPrototype.slice,
        supportsSplice = (function () {
            var array = [],
                lengthBefore,
                j = 20;

            if (!array.splice) {
                return false;
            }

            // This detects a bug in IE8 splice method:
            // see http://social.msdn.microsoft.com/Forums/en-US/iewebdevelopment/thread/6e946d03-e09f-4b22-a4dd-cd5e276bf05a/

            while (j--) {
                array.push("A");
            }

            array.splice(15, 0, "F", "F", "F", "F", "F","F","F","F","F","F","F","F","F","F","F","F","F","F","F","F","F");

            lengthBefore = array.length; //41
            array.splice(13, 0, "XXX"); // add one element

            if (lengthBefore+1 != array.length) {
                return false;
            }
            // end IE8 bug

            return true;
        }()),
        supportsForEach = 'forEach' in arrayPrototype,
        supportsMap = 'map' in arrayPrototype,
        supportsIndexOf = 'indexOf' in arrayPrototype,
        supportsEvery = 'every' in arrayPrototype,
        supportsSome = 'some' in arrayPrototype,
        supportsFilter = 'filter' in arrayPrototype,
        supportsSort = (function() {
            var a = [1,2,3,4,5].sort(function(){ return 0; });
            return a[0] === 1 && a[1] === 2 && a[2] === 3 && a[3] === 4 && a[4] === 5;
        }()),
        supportsSliceOnNodeList = true,
        ExtArray,
        erase,
        replace,
        splice;

    try {
        // IE 6 - 8 will throw an error when using Array.prototype.slice on NodeList
        if (typeof document !== 'undefined') {
            slice.call(document.getElementsByTagName('body'));
        }
    } catch (e) {
        supportsSliceOnNodeList = false;
    }

    function fixArrayIndex (array, index) {
        return (index < 0) ? Math.max(0, array.length + index)
                           : Math.min(array.length, index);
    }

    /*
    Does the same work as splice, but with a slightly more convenient signature. The splice
    method has bugs in IE8, so this is the implementation we use on that platform.

    The rippling of items in the array can be tricky. Consider two use cases:

                  index=2
                  removeCount=2
                 /=====\
        +---+---+---+---+---+---+---+---+
        | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 |
        +---+---+---+---+---+---+---+---+
                         /  \/  \/  \/  \
                        /   /\  /\  /\   \
                       /   /  \/  \/  \   +--------------------------+
                      /   /   /\  /\   +--------------------------+   \
                     /   /   /  \/  +--------------------------+   \   \
                    /   /   /   /+--------------------------+   \   \   \
                   /   /   /   /                             \   \   \   \
                  v   v   v   v                               v   v   v   v
        +---+---+---+---+---+---+       +---+---+---+---+---+---+---+---+---+
        | 0 | 1 | 4 | 5 | 6 | 7 |       | 0 | 1 | a | b | c | 4 | 5 | 6 | 7 |
        +---+---+---+---+---+---+       +---+---+---+---+---+---+---+---+---+
        A                               B        \=========/
                                                 insert=[a,b,c]

    In case A, it is obvious that copying of [4,5,6,7] must be left-to-right so
    that we don't end up with [0,1,6,7,6,7]. In case B, we have the opposite; we
    must go right-to-left or else we would end up with [0,1,a,b,c,4,4,4,4].
    */
    function replaceSim (array, index, removeCount, insert) {
        var add = insert ? insert.length : 0,
            length = array.length,
            pos = fixArrayIndex(array, index),
            remove,
            tailOldPos,
            tailNewPos,
            tailCount,
            lengthAfterRemove,
            i;

        // we try to use Array.push when we can for efficiency...
        if (pos === length) {
            if (add) {
                array.push.apply(array, insert);
            }
        } else {
            remove = Math.min(removeCount, length - pos);
            tailOldPos = pos + remove;
            tailNewPos = tailOldPos + add - remove;
            tailCount = length - tailOldPos;
            lengthAfterRemove = length - remove;

            if (tailNewPos < tailOldPos) { // case A
                for (i = 0; i < tailCount; ++i) {
                    array[tailNewPos+i] = array[tailOldPos+i];
                }
            } else if (tailNewPos > tailOldPos) { // case B
                for (i = tailCount; i--; ) {
                    array[tailNewPos+i] = array[tailOldPos+i];
                }
            } // else, add == remove (nothing to do)

            if (add && pos === lengthAfterRemove) {
                array.length = lengthAfterRemove; // truncate array
                array.push.apply(array, insert);
            } else {
                array.length = lengthAfterRemove + add; // reserves space
                for (i = 0; i < add; ++i) {
                    array[pos+i] = insert[i];
                }
            }
        }

        return array;
    }

    function replaceNative (array, index, removeCount, insert) {
        if (insert && insert.length) {
            if (index < array.length) {
                array.splice.apply(array, [index, removeCount].concat(insert));
            } else {
                array.push.apply(array, insert);
            }
        } else {
            array.splice(index, removeCount);
        }
        return array;
    }

    function eraseSim (array, index, removeCount) {
        return replaceSim(array, index, removeCount);
    }

    function eraseNative (array, index, removeCount) {
        array.splice(index, removeCount);
        return array;
    }

    function spliceSim (array, index, removeCount) {
        var pos = fixArrayIndex(array, index),
            removed = array.slice(index, fixArrayIndex(array, pos+removeCount));

        if (arguments.length < 4) {
            replaceSim(array, pos, removeCount);
        } else {
            replaceSim(array, pos, removeCount, slice.call(arguments, 3));
        }

        return removed;
    }

    function spliceNative (array) {
        return array.splice.apply(array, slice.call(arguments, 1));
    }

    erase = supportsSplice ? eraseNative : eraseSim;
    replace = supportsSplice ? replaceNative : replaceSim;
    splice = supportsSplice ? spliceNative : spliceSim;

    // NOTE: from here on, use erase, replace or splice (not native methods)...

    ExtArray = Ext.Array = {
        /**
         * Iterates an array or an iterable value and invoke the given callback function for each item.
         *
         *     var countries = ['Vietnam', 'Singapore', 'United States', 'Russia'];
         *
         *     Ext.Array.each(countries, function(name, index, countriesItSelf) {
         *         console.log(name);
         *     });
         *
         *     var sum = function() {
         *         var sum = 0;
         *
         *         Ext.Array.each(arguments, function(value) {
         *             sum += value;
         *         });
         *
         *         return sum;
         *     };
         *
         *     sum(1, 2, 3); // returns 6
         *
         * The iteration can be stopped by returning false in the function callback.
         *
         *     Ext.Array.each(countries, function(name, index, countriesItSelf) {
         *         if (name === 'Singapore') {
         *             return false; // break here
         *         }
         *     });
         *
         * {@link Ext#each Ext.each} is alias for {@link Ext.Array#each Ext.Array.each}
         *
         * @param {Array/NodeList/Object} iterable The value to be iterated. If this
         * argument is not iterable, the callback function is called once.
         * @param {Function} fn The callback function. If it returns false, the iteration stops and this method returns
         * the current `index`.
         * @param {Object} fn.item The item at the current `index` in the passed `array`
         * @param {Number} fn.index The current `index` within the `array`
         * @param {Array} fn.allItems The `array` itself which was passed as the first argument
         * @param {Boolean} fn.return Return false to stop iteration.
         * @param {Object} scope (Optional) The scope (`this` reference) in which the specified function is executed.
         * @param {Boolean} reverse (Optional) Reverse the iteration order (loop from the end to the beginning)
         * Defaults false
         * @return {Boolean} See description for the `fn` parameter.
         */
        each: function(array, fn, scope, reverse) {
            array = ExtArray.from(array);

            var i,
                ln = array.length;

            if (reverse !== true) {
                for (i = 0; i < ln; i++) {
                    if (fn.call(scope || array[i], array[i], i, array) === false) {
                        return i;
                    }
                }
            }
            else {
                for (i = ln - 1; i > -1; i--) {
                    if (fn.call(scope || array[i], array[i], i, array) === false) {
                        return i;
                    }
                }
            }

            return true;
        },

        /**
         * Iterates an array and invoke the given callback function for each item. Note that this will simply
         * delegate to the native Array.prototype.forEach method if supported. It doesn't support stopping the
         * iteration by returning false in the callback function like {@link Ext.Array#each}. However, performance
         * could be much better in modern browsers comparing with {@link Ext.Array#each}
         *
         * @param {Array} array The array to iterate
         * @param {Function} fn The callback function.
         * @param {Object} fn.item The item at the current `index` in the passed `array`
         * @param {Number} fn.index The current `index` within the `array`
         * @param {Array}  fn.allItems The `array` itself which was passed as the first argument
         * @param {Object} scope (Optional) The execution scope (`this`) in which the specified function is executed.
         */
        forEach: supportsForEach ? function(array, fn, scope) {
            return array.forEach(fn, scope);
        } : function(array, fn, scope) {
            var i = 0,
                ln = array.length;

            for (; i < ln; i++) {
                fn.call(scope, array[i], i, array);
            }
        },

        /**
         * Get the index of the provided `item` in the given `array`, a supplement for the
         * missing arrayPrototype.indexOf in Internet Explorer.
         *
         * @param {Array} array The array to check
         * @param {Object} item The item to look for
         * @param {Number} from (Optional) The index at which to begin the search
         * @return {Number} The index of item in the array (or -1 if it is not found)
         */
        indexOf: supportsIndexOf ? function(array, item, from) {
            return array.indexOf(item, from);
         } : function(array, item, from) {
            var i, length = array.length;

            for (i = (from < 0) ? Math.max(0, length + from) : from || 0; i < length; i++) {
                if (array[i] === item) {
                    return i;
                }
            }

            return -1;
        },

        /**
         * Checks whether or not the given `array` contains the specified `item`
         *
         * @param {Array} array The array to check
         * @param {Object} item The item to look for
         * @return {Boolean} True if the array contains the item, false otherwise
         */
        contains: supportsIndexOf ? function(array, item) {
            return array.indexOf(item) !== -1;
        } : function(array, item) {
            var i, ln;

            for (i = 0, ln = array.length; i < ln; i++) {
                if (array[i] === item) {
                    return true;
                }
            }

            return false;
        },

        /**
         * Converts any iterable (numeric indices and a length property) into a true array.
         *
         *     function test() {
         *         var args = Ext.Array.toArray(arguments),
         *             fromSecondToLastArgs = Ext.Array.toArray(arguments, 1);
         *
         *         alert(args.join(' '));
         *         alert(fromSecondToLastArgs.join(' '));
         *     }
         *
         *     test('just', 'testing', 'here'); // alerts 'just testing here';
         *                                      // alerts 'testing here';
         *
         *     Ext.Array.toArray(document.getElementsByTagName('div')); // will convert the NodeList into an array
         *     Ext.Array.toArray('splitted'); // returns ['s', 'p', 'l', 'i', 't', 't', 'e', 'd']
         *     Ext.Array.toArray('splitted', 0, 3); // returns ['s', 'p', 'l']
         *
         * {@link Ext#toArray Ext.toArray} is alias for {@link Ext.Array#toArray Ext.Array.toArray}
         *
         * @param {Object} iterable the iterable object to be turned into a true Array.
         * @param {Number} start (Optional) a zero-based index that specifies the start of extraction. Defaults to 0
         * @param {Number} end (Optional) a 1-based index that specifies the end of extraction. Defaults to the last
         * index of the iterable value
         * @return {Array} array
         */
        toArray: function(iterable, start, end){
            if (!iterable || !iterable.length) {
                return [];
            }

            if (typeof iterable === 'string') {
                iterable = iterable.split('');
            }

            if (supportsSliceOnNodeList) {
                return slice.call(iterable, start || 0, end || iterable.length);
            }

            var array = [],
                i;

            start = start || 0;
            end = end ? ((end < 0) ? iterable.length + end : end) : iterable.length;

            for (i = start; i < end; i++) {
                array.push(iterable[i]);
            }

            return array;
        },

        /**
         * Plucks the value of a property from each item in the Array. Example:
         *
         *     Ext.Array.pluck(Ext.query("p"), "className"); // [el1.className, el2.className, ..., elN.className]
         *
         * @param {Array/NodeList} array The Array of items to pluck the value from.
         * @param {String} propertyName The property name to pluck from each element.
         * @return {Array} The value from each item in the Array.
         */
        pluck: function(array, propertyName) {
            var ret = [],
                i, ln, item;

            for (i = 0, ln = array.length; i < ln; i++) {
                item = array[i];

                ret.push(item[propertyName]);
            }

            return ret;
        },

        /**
         * Creates a new array with the results of calling a provided function on every element in this array.
         *
         * @param {Array} array
         * @param {Function} fn Callback function for each item
         * @param {Object} scope Callback function scope
         * @return {Array} results
         */
        map: supportsMap ? function(array, fn, scope) {
            //<debug>
            if (!fn) {
                Ext.Error.raise('Ext.Array.map must have a callback function passed as second argument.');
            }
            //</debug>
            return array.map(fn, scope);
        } : function(array, fn, scope) {
            //<debug>
            if (!fn) {
                Ext.Error.raise('Ext.Array.map must have a callback function passed as second argument.');
            }
            //</debug>
            var results = [],
                i = 0,
                len = array.length;

            for (; i < len; i++) {
                results[i] = fn.call(scope, array[i], i, array);
            }

            return results;
        },

        /**
         * Executes the specified function for each array element until the function returns a falsy value.
         * If such an item is found, the function will return false immediately.
         * Otherwise, it will return true.
         *
         * @param {Array} array
         * @param {Function} fn Callback function for each item
         * @param {Object} scope Callback function scope
         * @return {Boolean} True if no false value is returned by the callback function.
         */
        every: supportsEvery ? function(array, fn, scope) {
            //<debug>
            if (!fn) {
                Ext.Error.raise('Ext.Array.every must have a callback function passed as second argument.');
            }
            //</debug>
            return array.every(fn, scope);
        } : function(array, fn, scope) {
            //<debug>
            if (!fn) {
                Ext.Error.raise('Ext.Array.every must have a callback function passed as second argument.');
            }
            //</debug>
            var i = 0,
                ln = array.length;

            for (; i < ln; ++i) {
                if (!fn.call(scope, array[i], i, array)) {
                    return false;
                }
            }

            return true;
        },

        /**
         * Executes the specified function for each array element until the function returns a truthy value.
         * If such an item is found, the function will return true immediately. Otherwise, it will return false.
         *
         * @param {Array} array
         * @param {Function} fn Callback function for each item
         * @param {Object} scope Callback function scope
         * @return {Boolean} True if the callback function returns a truthy value.
         */
        some: supportsSome ? function(array, fn, scope) {
            //<debug>
            if (!fn) {
                Ext.Error.raise('Ext.Array.some must have a callback function passed as second argument.');
            }
            //</debug>
            return array.some(fn, scope);
        } : function(array, fn, scope) {
            //<debug>
            if (!fn) {
                Ext.Error.raise('Ext.Array.some must have a callback function passed as second argument.');
            }
            //</debug>
            var i = 0,
                ln = array.length;

            for (; i < ln; ++i) {
                if (fn.call(scope, array[i], i, array)) {
                    return true;
                }
            }

            return false;
        },

        /**
         * Filter through an array and remove empty item as defined in {@link Ext#isEmpty Ext.isEmpty}
         *
         * See {@link Ext.Array#filter}
         *
         * @param {Array} array
         * @return {Array} results
         */
        clean: function(array) {
            var results = [],
                i = 0,
                ln = array.length,
                item;

            for (; i < ln; i++) {
                item = array[i];

                if (!Ext.isEmpty(item)) {
                    results.push(item);
                }
            }

            return results;
        },

        /**
         * Returns a new array with unique items
         *
         * @param {Array} array
         * @return {Array} results
         */
        unique: function(array) {
            var clone = [],
                i = 0,
                ln = array.length,
                item;

            for (; i < ln; i++) {
                item = array[i];

                if (ExtArray.indexOf(clone, item) === -1) {
                    clone.push(item);
                }
            }

            return clone;
        },

        /**
         * Creates a new array with all of the elements of this array for which
         * the provided filtering function returns true.
         *
         * @param {Array} array
         * @param {Function} fn Callback function for each item
         * @param {Object} scope Callback function scope
         * @return {Array} results
         */
        filter: supportsFilter ? function(array, fn, scope) {
            //<debug>
            if (!fn) {
                Ext.Error.raise('Ext.Array.filter must have a callback function passed as second argument.');
            }
            //</debug>
            return array.filter(fn, scope);
        } : function(array, fn, scope) {
            //<debug>
            if (!fn) {
                Ext.Error.raise('Ext.Array.filter must have a callback function passed as second argument.');
            }
            //</debug>
            var results = [],
                i = 0,
                ln = array.length;

            for (; i < ln; i++) {
                if (fn.call(scope, array[i], i, array)) {
                    results.push(array[i]);
                }
            }

            return results;
        },

        /**
         * Converts a value to an array if it's not already an array; returns:
         *
         * - An empty array if given value is `undefined` or `null`
         * - Itself if given value is already an array
         * - An array copy if given value is {@link Ext#isIterable iterable} (arguments, NodeList and alike)
         * - An array with one item which is the given value, otherwise
         *
         * @param {Object} value The value to convert to an array if it's not already is an array
         * @param {Boolean} newReference (Optional) True to clone the given array and return a new reference if necessary,
         * defaults to false
         * @return {Array} array
         */
        from: function(value, newReference) {
            if (value === undefined || value === null) {
                return [];
            }

            if (Ext.isArray(value)) {
                return (newReference) ? slice.call(value) : value;
            }

            var type = typeof value;
            // Both strings and functions will have a length property. In phantomJS, NodeList
            // instances report typeof=='function' but don't have an apply method...
            if (value && value.length !== undefined && type !== 'string' && (type !== 'function' || !value.apply)) {
                return ExtArray.toArray(value);
            }

            return [value];
        },

        /**
         * Removes the specified item from the array if it exists
         *
         * @param {Array} array The array
         * @param {Object} item The item to remove
         * @return {Array} The passed array itself
         */
        remove: function(array, item) {
            var index = ExtArray.indexOf(array, item);

            if (index !== -1) {
                erase(array, index, 1);
            }

            return array;
        },

        /**
         * Push an item into the array only if the array doesn't contain it yet
         *
         * @param {Array} array The array
         * @param {Object} item The item to include
         */
        include: function(array, item) {
            if (!ExtArray.contains(array, item)) {
                array.push(item);
            }
        },

        /**
         * Clone a flat array without referencing the previous one. Note that this is different
         * from Ext.clone since it doesn't handle recursive cloning. It's simply a convenient, easy-to-remember method
         * for Array.prototype.slice.call(array)
         *
         * @param {Array} array The array
         * @return {Array} The clone array
         */
        clone: function(array) {
            return slice.call(array);
        },

        /**
         * Merge multiple arrays into one with unique items.
         *
         * {@link Ext.Array#union} is alias for {@link Ext.Array#merge}
         *
         * @param {Array} array1
         * @param {Array} array2
         * @param {Array} etc
         * @return {Array} merged
         */
        merge: function() {
            var args = slice.call(arguments),
                array = [],
                i, ln;

            for (i = 0, ln = args.length; i < ln; i++) {
                array = array.concat(args[i]);
            }

            return ExtArray.unique(array);
        },

        /**
         * Merge multiple arrays into one with unique items that exist in all of the arrays.
         *
         * @param {Array} array1
         * @param {Array} array2
         * @param {Array} etc
         * @return {Array} intersect
         */
        intersect: function() {
            var intersection = [],
                arrays = slice.call(arguments),
                arraysLength,
                array,
                arrayLength,
                minArray,
                minArrayIndex,
                minArrayCandidate,
                minArrayLength,
                element,
                elementCandidate,
                elementCount,
                i, j, k;

            if (!arrays.length) {
                return intersection;
            }

            // Find the smallest array
            arraysLength = arrays.length;
            for (i = minArrayIndex = 0; i < arraysLength; i++) {
                minArrayCandidate = arrays[i];
                if (!minArray || minArrayCandidate.length < minArray.length) {
                    minArray = minArrayCandidate;
                    minArrayIndex = i;
                }
            }

            minArray = ExtArray.unique(minArray);
            erase(arrays, minArrayIndex, 1);

            // Use the smallest unique'd array as the anchor loop. If the other array(s) do contain
            // an item in the small array, we're likely to find it before reaching the end
            // of the inner loop and can terminate the search early.
            minArrayLength = minArray.length;
            arraysLength = arrays.length;
            for (i = 0; i < minArrayLength; i++) {
                element = minArray[i];
                elementCount = 0;

                for (j = 0; j < arraysLength; j++) {
                    array = arrays[j];
                    arrayLength = array.length;
                    for (k = 0; k < arrayLength; k++) {
                        elementCandidate = array[k];
                        if (element === elementCandidate) {
                            elementCount++;
                            break;
                        }
                    }
                }

                if (elementCount === arraysLength) {
                    intersection.push(element);
                }
            }

            return intersection;
        },

        /**
         * Perform a set difference A-B by subtracting all items in array B from array A.
         *
         * @param {Array} arrayA
         * @param {Array} arrayB
         * @return {Array} difference
         */
        difference: function(arrayA, arrayB) {
            var clone = slice.call(arrayA),
                ln = clone.length,
                i, j, lnB;

            for (i = 0,lnB = arrayB.length; i < lnB; i++) {
                for (j = 0; j < ln; j++) {
                    if (clone[j] === arrayB[i]) {
                        erase(clone, j, 1);
                        j--;
                        ln--;
                    }
                }
            }

            return clone;
        },

        /**
         * Returns a shallow copy of a part of an array. This is equivalent to the native
         * call "Array.prototype.slice.call(array, begin, end)". This is often used when "array"
         * is "arguments" since the arguments object does not supply a slice method but can
         * be the context object to Array.prototype.slice.
         *
         * @param {Array} array The array (or arguments object).
         * @param {Number} begin The index at which to begin. Negative values are offsets from
         * the end of the array.
         * @param {Number} end The index at which to end. The copied items do not include
         * end. Negative values are offsets from the end of the array. If end is omitted,
         * all items up to the end of the array are copied.
         * @return {Array} The copied piece of the array.
         * @method slice
         */
        // Note: IE6 will return [] on slice.call(x, undefined).
        slice: ([1,2].slice(1, undefined).length ?
            function (array, begin, end) {
                return slice.call(array, begin, end);
            } :
            // at least IE6 uses arguments.length for variadic signature
            function (array, begin, end) {
                // After tested for IE 6, the one below is of the best performance
                // see http://jsperf.com/slice-fix
                if (typeof begin === 'undefined') {
                    return slice.call(array);
                }
                if (typeof end === 'undefined') {
                    return slice.call(array, begin);
                }
                return slice.call(array, begin, end);
            }
        ),

        /**
         * Sorts the elements of an Array.
         * By default, this method sorts the elements alphabetically and ascending.
         *
         * @param {Array} array The array to sort.
         * @param {Function} sortFn (optional) The comparison function.
         * @return {Array} The sorted array.
         */
        sort: supportsSort ? function(array, sortFn) {
            if (sortFn) {
                return array.sort(sortFn);
            } else {
                return array.sort();
            }
         } : function(array, sortFn) {
            var length = array.length,
                i = 0,
                comparison,
                j, min, tmp;

            for (; i < length; i++) {
                min = i;
                for (j = i + 1; j < length; j++) {
                    if (sortFn) {
                        comparison = sortFn(array[j], array[min]);
                        if (comparison < 0) {
                            min = j;
                        }
                    } else if (array[j] < array[min]) {
                        min = j;
                    }
                }
                if (min !== i) {
                    tmp = array[i];
                    array[i] = array[min];
                    array[min] = tmp;
                }
            }

            return array;
        },

        /**
         * Recursively flattens into 1-d Array. Injects Arrays inline.
         *
         * @param {Array} array The array to flatten
         * @return {Array} The 1-d array.
         */
        flatten: function(array) {
            var worker = [];

            function rFlatten(a) {
                var i, ln, v;

                for (i = 0, ln = a.length; i < ln; i++) {
                    v = a[i];

                    if (Ext.isArray(v)) {
                        rFlatten(v);
                    } else {
                        worker.push(v);
                    }
                }

                return worker;
            }

            return rFlatten(array);
        },

        /**
         * Returns the minimum value in the Array.
         *
         * @param {Array/NodeList} array The Array from which to select the minimum value.
         * @param {Function} comparisonFn (optional) a function to perform the comparision which determines minimization.
         * If omitted the "<" operator will be used. Note: gt = 1; eq = 0; lt = -1
         * @return {Object} minValue The minimum value
         */
        min: function(array, comparisonFn) {
            var min = array[0],
                i, ln, item;

            for (i = 0, ln = array.length; i < ln; i++) {
                item = array[i];

                if (comparisonFn) {
                    if (comparisonFn(min, item) === 1) {
                        min = item;
                    }
                }
                else {
                    if (item < min) {
                        min = item;
                    }
                }
            }

            return min;
        },

        /**
         * Returns the maximum value in the Array.
         *
         * @param {Array/NodeList} array The Array from which to select the maximum value.
         * @param {Function} comparisonFn (optional) a function to perform the comparision which determines maximization.
         * If omitted the ">" operator will be used. Note: gt = 1; eq = 0; lt = -1
         * @return {Object} maxValue The maximum value
         */
        max: function(array, comparisonFn) {
            var max = array[0],
                i, ln, item;

            for (i = 0, ln = array.length; i < ln; i++) {
                item = array[i];

                if (comparisonFn) {
                    if (comparisonFn(max, item) === -1) {
                        max = item;
                    }
                }
                else {
                    if (item > max) {
                        max = item;
                    }
                }
            }

            return max;
        },

        /**
         * Calculates the mean of all items in the array.
         *
         * @param {Array} array The Array to calculate the mean value of.
         * @return {Number} The mean.
         */
        mean: function(array) {
            return array.length > 0 ? ExtArray.sum(array) / array.length : undefined;
        },

        /**
         * Calculates the sum of all items in the given array.
         *
         * @param {Array} array The Array to calculate the sum value of.
         * @return {Number} The sum.
         */
        sum: function(array) {
            var sum = 0,
                i, ln, item;

            for (i = 0,ln = array.length; i < ln; i++) {
                item = array[i];

                sum += item;
            }

            return sum;
        },

        /**
         * Creates a map (object) keyed by the elements of the given array. The values in
         * the map are the index+1 of the array element. For example:
         * 
         *      var map = Ext.Array.toMap(['a','b','c']);
         *
         *      // map = { a: 1, b: 2, c: 3 };
         * 
         * Or a key property can be specified:
         * 
         *      var map = Ext.Array.toMap([
         *              { name: 'a' },
         *              { name: 'b' },
         *              { name: 'c' }
         *          ], 'name');
         *
         *      // map = { a: 1, b: 2, c: 3 };
         * 
         * Lastly, a key extractor can be provided:
         * 
         *      var map = Ext.Array.toMap([
         *              { name: 'a' },
         *              { name: 'b' },
         *              { name: 'c' }
         *          ], function (obj) { return obj.name.toUpperCase(); });
         *
         *      // map = { A: 1, B: 2, C: 3 };
         */
        toMap: function(array, getKey, scope) {
            var map = {},
                i = array.length;

            if (!getKey) {
                while (i--) {
                    map[array[i]] = i+1;
                }
            } else if (typeof getKey == 'string') {
                while (i--) {
                    map[array[i][getKey]] = i+1;
                }
            } else {
                while (i--) {
                    map[getKey.call(scope, array[i])] = i+1;
                }
            }

            return map;
        },

        //<debug>
        _replaceSim: replaceSim, // for unit testing
        _spliceSim: spliceSim,
        //</debug>

        /**
         * Removes items from an array. This is functionally equivalent to the splice method
         * of Array, but works around bugs in IE8's splice method and does not copy the
         * removed elements in order to return them (because very often they are ignored).
         *
         * @param {Array} array The Array on which to replace.
         * @param {Number} index The index in the array at which to operate.
         * @param {Number} removeCount The number of items to remove at index.
         * @return {Array} The array passed.
         * @method
         */
        erase: erase,

        /**
         * Inserts items in to an array.
         *
         * @param {Array} array The Array in which to insert.
         * @param {Number} index The index in the array at which to operate.
         * @param {Array} items The array of items to insert at index.
         * @return {Array} The array passed.
         */
        insert: function (array, index, items) {
            return replace(array, index, 0, items);
        },

        /**
         * Replaces items in an array. This is functionally equivalent to the splice method
         * of Array, but works around bugs in IE8's splice method and is often more convenient
         * to call because it accepts an array of items to insert rather than use a variadic
         * argument list.
         *
         * @param {Array} array The Array on which to replace.
         * @param {Number} index The index in the array at which to operate.
         * @param {Number} removeCount The number of items to remove at index (can be 0).
         * @param {Array} insert (optional) An array of items to insert at index.
         * @return {Array} The array passed.
         * @method
         */
        replace: replace,

        /**
         * Replaces items in an array. This is equivalent to the splice method of Array, but
         * works around bugs in IE8's splice method. The signature is exactly the same as the
         * splice method except that the array is the first argument. All arguments following
         * removeCount are inserted in the array at index.
         *
         * @param {Array} array The Array on which to replace.
         * @param {Number} index The index in the array at which to operate.
         * @param {Number} removeCount The number of items to remove at index (can be 0).
         * @param {Object...} elements The elements to add to the array. If you don't specify
         * any elements, splice simply removes elements from the array.
         * @return {Array} An array containing the removed items.
         * @method
         */
        splice: splice,

        /**
         * Pushes new items onto the end of an Array.
         *
         * Passed parameters may be single items, or arrays of items. If an Array is found in the argument list, all its
         * elements are pushed into the end of the target Array.
         *
         * @param {Array} target The Array onto which to push new items
         * @param {Object...} elements The elements to add to the array. Each parameter may
         * be an Array, in which case all the elements of that Array will be pushed into the end of the
         * destination Array.
         * @return {Array} An array containing all the new items push onto the end.
         *
         */
        push: function(array) {
            var len = arguments.length,
                i = 1,
                newItem;

            if (array === undefined) {
                array = [];
            } else if (!Ext.isArray(array)) {
                array = [array];
            }
            for (; i < len; i++) {
                newItem = arguments[i];
                Array.prototype.push[Ext.isArray(newItem) ? 'apply' : 'call'](array, newItem);
            }
            return array;
        }
    };

    /**
     * @method
     * @member Ext
     * @inheritdoc Ext.Array#each
     */
    Ext.each = ExtArray.each;

    /**
     * @method
     * @member Ext.Array
     * @inheritdoc Ext.Array#merge
     */
    ExtArray.union = ExtArray.merge;

    /**
     * Old alias to {@link Ext.Array#min}
     * @deprecated 4.0.0 Use {@link Ext.Array#min} instead
     * @method
     * @member Ext
     * @inheritdoc Ext.Array#min
     */
    Ext.min = ExtArray.min;

    /**
     * Old alias to {@link Ext.Array#max}
     * @deprecated 4.0.0 Use {@link Ext.Array#max} instead
     * @method
     * @member Ext
     * @inheritdoc Ext.Array#max
     */
    Ext.max = ExtArray.max;

    /**
     * Old alias to {@link Ext.Array#sum}
     * @deprecated 4.0.0 Use {@link Ext.Array#sum} instead
     * @method
     * @member Ext
     * @inheritdoc Ext.Array#sum
     */
    Ext.sum = ExtArray.sum;

    /**
     * Old alias to {@link Ext.Array#mean}
     * @deprecated 4.0.0 Use {@link Ext.Array#mean} instead
     * @method
     * @member Ext
     * @inheritdoc Ext.Array#mean
     */
    Ext.mean = ExtArray.mean;

    /**
     * Old alias to {@link Ext.Array#flatten}
     * @deprecated 4.0.0 Use {@link Ext.Array#flatten} instead
     * @method
     * @member Ext
     * @inheritdoc Ext.Array#flatten
     */
    Ext.flatten = ExtArray.flatten;

    /**
     * Old alias to {@link Ext.Array#clean}
     * @deprecated 4.0.0 Use {@link Ext.Array#clean} instead
     * @method
     * @member Ext
     * @inheritdoc Ext.Array#clean
     */
    Ext.clean = ExtArray.clean;

    /**
     * Old alias to {@link Ext.Array#unique}
     * @deprecated 4.0.0 Use {@link Ext.Array#unique} instead
     * @method
     * @member Ext
     * @inheritdoc Ext.Array#unique
     */
    Ext.unique = ExtArray.unique;

    /**
     * Old alias to {@link Ext.Array#pluck Ext.Array.pluck}
     * @deprecated 4.0.0 Use {@link Ext.Array#pluck Ext.Array.pluck} instead
     * @method
     * @member Ext
     * @inheritdoc Ext.Array#pluck
     */
    Ext.pluck = ExtArray.pluck;

    /**
     * @method
     * @member Ext
     * @inheritdoc Ext.Array#toArray
     */
    Ext.toArray = function() {
        return ExtArray.toArray.apply(ExtArray, arguments);
    };
}());
 /**
 * @class Ext.Number
 *
 * A collection of useful static methods to deal with numbers
 * @singleton
 */

Ext.Number = new function() {

    var me = this,
        isToFixedBroken = (0.9).toFixed() !== '1',
        math = Math;

    Ext.apply(this, {
        /**
         * Checks whether or not the passed number is within a desired range.  If the number is already within the
         * range it is returned, otherwise the min or max value is returned depending on which side of the range is
         * exceeded. Note that this method returns the constrained value but does not change the current number.
         * @param {Number} number The number to check
         * @param {Number} min The minimum number in the range
         * @param {Number} max The maximum number in the range
         * @return {Number} The constrained value if outside the range, otherwise the current value
         */
        constrain: function(number, min, max) {
            var x = parseFloat(number);

            // Watch out for NaN in Chrome 18
            // V8bug: http://code.google.com/p/v8/issues/detail?id=2056

            // Operators are faster than Math.min/max. See http://jsperf.com/number-constrain
            // ... and (x < Nan) || (x < undefined) == false
            // ... same for (x > NaN) || (x > undefined)
            // so if min or max are undefined or NaN, we never return them... sadly, this
            // is not true of null (but even Math.max(-1,null)==0 and isNaN(null)==false)
            return (x < min) ? min : ((x > max) ? max : x);
        },

        /**
         * Snaps the passed number between stopping points based upon a passed increment value.
         *
         * The difference between this and {@link #snapInRange} is that {@link #snapInRange} uses the minValue
         * when calculating snap points:
         *
         *     r = Ext.Number.snap(56, 2, 55, 65);        // Returns 56 - snap points are zero based
         *
         *     r = Ext.Number.snapInRange(56, 2, 55, 65); // Returns 57 - snap points are based from minValue
         *
         * @param {Number} value The unsnapped value.
         * @param {Number} increment The increment by which the value must move.
         * @param {Number} minValue The minimum value to which the returned value must be constrained. Overrides the increment.
         * @param {Number} maxValue The maximum value to which the returned value must be constrained. Overrides the increment.
         * @return {Number} The value of the nearest snap target.
         */
        snap : function(value, increment, minValue, maxValue) {
            var m;

            // If no value passed, or minValue was passed and value is less than minValue (anything < undefined is false)
            // Then use the minValue (or zero if the value was undefined)
            if (value === undefined || value < minValue) {
                return minValue || 0;
            }

            if (increment) {
                m = value % increment;
                if (m !== 0) {
                    value -= m;
                    if (m * 2 >= increment) {
                        value += increment;
                    } else if (m * 2 < -increment) {
                        value -= increment;
                    }
                }
            }
            return me.constrain(value, minValue,  maxValue);
        },

        /**
         * Snaps the passed number between stopping points based upon a passed increment value.
         *
         * The difference between this and {@link #snap} is that {@link #snap} does not use the minValue
         * when calculating snap points:
         *
         *     r = Ext.Number.snap(56, 2, 55, 65);        // Returns 56 - snap points are zero based
         *
         *     r = Ext.Number.snapInRange(56, 2, 55, 65); // Returns 57 - snap points are based from minValue
         *
         * @param {Number} value The unsnapped value.
         * @param {Number} increment The increment by which the value must move.
         * @param {Number} [minValue=0] The minimum value to which the returned value must be constrained.
         * @param {Number} [maxValue=Infinity] The maximum value to which the returned value must be constrained.
         * @return {Number} The value of the nearest snap target.
         */
        snapInRange : function(value, increment, minValue, maxValue) {
            var tween;

            // default minValue to zero
            minValue = (minValue || 0);

            // If value is undefined, or less than minValue, use minValue
            if (value === undefined || value < minValue) {
                return minValue;
            }

            // Calculate how many snap points from the minValue the passed value is.
            if (increment && (tween = ((value - minValue) % increment))) {
                value -= tween;
                tween *= 2;
                if (tween >= increment) {
                    value += increment;
                }
            }

            // If constraining within a maximum, ensure the maximum is on a snap point
            if (maxValue !== undefined) {
                if (value > (maxValue = me.snapInRange(maxValue, increment, minValue))) {
                    value = maxValue;
                }
            }

            return value;
        },

        /**
         * Formats a number using fixed-point notation
         * @param {Number} value The number to format
         * @param {Number} precision The number of digits to show after the decimal point
         */
        toFixed: isToFixedBroken ? function(value, precision) {
            precision = precision || 0;
            var pow = math.pow(10, precision);
            return (math.round(value * pow) / pow).toFixed(precision);
        } : function(value, precision) {
            return value.toFixed(precision);
        },

        /**
         * Validate that a value is numeric and convert it to a number if necessary. Returns the specified default value if
         * it is not.

    Ext.Number.from('1.23', 1); // returns 1.23
    Ext.Number.from('abc', 1); // returns 1

         * @param {Object} value
         * @param {Number} defaultValue The value to return if the original value is non-numeric
         * @return {Number} value, if numeric, defaultValue otherwise
         */
        from: function(value, defaultValue) {
            if (isFinite(value)) {
                value = parseFloat(value);
            }

            return !isNaN(value) ? value : defaultValue;
        },

        /**
         * Returns a random integer between the specified range (inclusive)
         * @param {Number} from Lowest value to return.
         * @param {Number} to Highst value to return.
         * @return {Number} A random integer within the specified range.
         */
        randomInt: function (from, to) {
           return math.floor(math.random() * (to - from + 1) + from);
        }
    });

    /**
     * @deprecated 4.0.0 Please use {@link Ext.Number#from} instead.
     * @member Ext
     * @method num
     * @inheritdoc Ext.Number#from
     */
    Ext.num = function() {
        return me.from.apply(this, arguments);
    };
}; /**
 * @class Ext.Date
 * A set of useful static methods to deal with date
 * Note that if Ext.Date is required and loaded, it will copy all methods / properties to
 * this object for convenience
 *
 * The date parsing and formatting syntax contains a subset of
 * <a href="http://www.php.net/date">PHP's date() function</a>, and the formats that are
 * supported will provide results equivalent to their PHP versions.
 *
 * The following is a list of all currently supported formats:
 * <pre class="">
Format  Description                                                               Example returned values
------  -----------------------------------------------------------------------   -----------------------
  d     Day of the month, 2 digits with leading zeros                             01 to 31
  D     A short textual representation of the day of the week                     Mon to Sun
  j     Day of the month without leading zeros                                    1 to 31
  l     A full textual representation of the day of the week                      Sunday to Saturday
  N     ISO-8601 numeric representation of the day of the week                    1 (for Monday) through 7 (for Sunday)
  S     English ordinal suffix for the day of the month, 2 characters             st, nd, rd or th. Works well with j
  w     Numeric representation of the day of the week                             0 (for Sunday) to 6 (for Saturday)
  z     The day of the year (starting from 0)                                     0 to 364 (365 in leap years)
  W     ISO-8601 week number of year, weeks starting on Monday                    01 to 53
  F     A full textual representation of a month, such as January or March        January to December
  m     Numeric representation of a month, with leading zeros                     01 to 12
  M     A short textual representation of a month                                 Jan to Dec
  n     Numeric representation of a month, without leading zeros                  1 to 12
  t     Number of days in the given month                                         28 to 31
  L     Whether it&#39;s a leap year                                                  1 if it is a leap year, 0 otherwise.
  o     ISO-8601 year number (identical to (Y), but if the ISO week number (W)    Examples: 1998 or 2004
        belongs to the previous or next year, that year is used instead)
  Y     A full numeric representation of a year, 4 digits                         Examples: 1999 or 2003
  y     A two digit representation of a year                                      Examples: 99 or 03
  a     Lowercase Ante meridiem and Post meridiem                                 am or pm
  A     Uppercase Ante meridiem and Post meridiem                                 AM or PM
  g     12-hour format of an hour without leading zeros                           1 to 12
  G     24-hour format of an hour without leading zeros                           0 to 23
  h     12-hour format of an hour with leading zeros                              01 to 12
  H     24-hour format of an hour with leading zeros                              00 to 23
  i     Minutes, with leading zeros                                               00 to 59
  s     Seconds, with leading zeros                                               00 to 59
  u     Decimal fraction of a second                                              Examples:
        (minimum 1 digit, arbitrary number of digits allowed)                     001 (i.e. 0.001s) or
                                                                                  100 (i.e. 0.100s) or
                                                                                  999 (i.e. 0.999s) or
                                                                                  999876543210 (i.e. 0.999876543210s)
  O     Difference to Greenwich time (GMT) in hours and minutes                   Example: +1030
  P     Difference to Greenwich time (GMT) with colon between hours and minutes   Example: -08:00
  T     Timezone abbreviation of the machine running the code                     Examples: EST, MDT, PDT ...
  Z     Timezone offset in seconds (negative if west of UTC, positive if east)    -43200 to 50400
  c     ISO 8601 date
        Notes:                                                                    Examples:
        1) If unspecified, the month / day defaults to the current month / day,   1991 or
           the time defaults to midnight, while the timezone defaults to the      1992-10 or
           browser's timezone. If a time is specified, it must include both hours 1993-09-20 or
           and minutes. The "T" delimiter, seconds, milliseconds and timezone     1994-08-19T16:20+01:00 or
           are optional.                                                          1995-07-18T17:21:28-02:00 or
        2) The decimal fraction of a second, if specified, must contain at        1996-06-17T18:22:29.98765+03:00 or
           least 1 digit (there is no limit to the maximum number                 1997-05-16T19:23:30,12345-0400 or
           of digits allowed), and may be delimited by either a '.' or a ','      1998-04-15T20:24:31.2468Z or
        Refer to the examples on the right for the various levels of              1999-03-14T20:24:32Z or
        date-time granularity which are supported, or see                         2000-02-13T21:25:33
        http://www.w3.org/TR/NOTE-datetime for more info.                         2001-01-12 22:26:34
  U     Seconds since the Unix Epoch (January 1 1970 00:00:00 GMT)                1193432466 or -2138434463
  MS    Microsoft AJAX serialized dates                                           \/Date(1238606590509)\/ (i.e. UTC milliseconds since epoch) or
                                                                                  \/Date(1238606590509+0800)\/
</pre>
 *
 * Example usage (note that you must escape format specifiers with '\\' to render them as character literals):
 * <pre><code>
// Sample date:
// 'Wed Jan 10 2007 15:05:01 GMT-0600 (Central Standard Time)'

var dt = new Date('1/10/2007 03:05:01 PM GMT-0600');
console.log(Ext.Date.format(dt, 'Y-m-d'));                          // 2007-01-10
console.log(Ext.Date.format(dt, 'F j, Y, g:i a'));                  // January 10, 2007, 3:05 pm
console.log(Ext.Date.format(dt, 'l, \\t\\he jS \\of F Y h:i:s A')); // Wednesday, the 10th of January 2007 03:05:01 PM
</code></pre>
 *
 * Here are some standard date/time patterns that you might find helpful.  They
 * are not part of the source of Ext.Date, but to use them you can simply copy this
 * block of code into any script that is included after Ext.Date and they will also become
 * globally available on the Date object.  Feel free to add or remove patterns as needed in your code.
 * <pre><code>
Ext.Date.patterns = {
    ISO8601Long:"Y-m-d H:i:s",
    ISO8601Short:"Y-m-d",
    ShortDate: "n/j/Y",
    LongDate: "l, F d, Y",
    FullDateTime: "l, F d, Y g:i:s A",
    MonthDay: "F d",
    ShortTime: "g:i A",
    LongTime: "g:i:s A",
    SortableDateTime: "Y-m-d\\TH:i:s",
    UniversalSortableDateTime: "Y-m-d H:i:sO",
    YearMonth: "F, Y"
};
</code></pre>
 *
 * Example usage:
 * <pre><code>
var dt = new Date();
console.log(Ext.Date.format(dt, Ext.Date.patterns.ShortDate));
</code></pre>
 * <p>Developer-written, custom formats may be used by supplying both a formatting and a parsing function
 * which perform to specialized requirements. The functions are stored in {@link #parseFunctions} and {@link #formatFunctions}.</p>
 * @singleton
 */

/*
 * Most of the date-formatting functions below are the excellent work of Baron Schwartz.
 * (see http://www.xaprb.com/blog/2005/12/12/javascript-closures-for-runtime-efficiency/)
 * They generate precompiled functions from format patterns instead of parsing and
 * processing each pattern every time a date is formatted. These functions are available
 * on every Date object.
 */

(function() {

// create private copy of Ext's Ext.util.Format.format() method
// - to remove unnecessary dependency
// - to resolve namespace conflict with MS-Ajax's implementation
function xf(format) {
    var args = Array.prototype.slice.call(arguments, 1);
    return format.replace(/\{(\d+)\}/g, function(m, i) {
        return args[i];
    });
}

Ext.Date = {
    /**
     * Returns the current timestamp
     * @return {Number} The current timestamp
     * @method
     */
    now: Date.now || function() {
        return +new Date();
    },

    /**
     * @private
     * Private for now
     */
    toString: function(date) {
        var pad = Ext.String.leftPad;

        return date.getFullYear() + "-"
            + pad(date.getMonth() + 1, 2, '0') + "-"
            + pad(date.getDate(), 2, '0') + "T"
            + pad(date.getHours(), 2, '0') + ":"
            + pad(date.getMinutes(), 2, '0') + ":"
            + pad(date.getSeconds(), 2, '0');
    },

    /**
     * Returns the number of milliseconds between two dates
     * @param {Date} dateA The first date
     * @param {Date} dateB (optional) The second date, defaults to now
     * @return {Number} The difference in milliseconds
     */
    getElapsed: function(dateA, dateB) {
        return Math.abs(dateA - (dateB || new Date()));
    },

    /**
     * Global flag which determines if strict date parsing should be used.
     * Strict date parsing will not roll-over invalid dates, which is the
     * default behaviour of javascript Date objects.
     * (see {@link #parse} for more information)
     * Defaults to <tt>false</tt>.
     * @type Boolean
    */
    useStrict: false,

    // private
    formatCodeToRegex: function(character, currentGroup) {
        // Note: currentGroup - position in regex result array (see notes for Ext.Date.parseCodes below)
        var p = utilDate.parseCodes[character];

        if (p) {
          p = typeof p == 'function'? p() : p;
          utilDate.parseCodes[character] = p; // reassign function result to prevent repeated execution
        }

        return p ? Ext.applyIf({
          c: p.c ? xf(p.c, currentGroup || "{0}") : p.c
        }, p) : {
            g: 0,
            c: null,
            s: Ext.String.escapeRegex(character) // treat unrecognised characters as literals
        };
    },

    /**
     * <p>An object hash in which each property is a date parsing function. The property name is the
     * format string which that function parses.</p>
     * <p>This object is automatically populated with date parsing functions as
     * date formats are requested for Ext standard formatting strings.</p>
     * <p>Custom parsing functions may be inserted into this object, keyed by a name which from then on
     * may be used as a format string to {@link #parse}.<p>
     * <p>Example:</p><pre><code>
Ext.Date.parseFunctions['x-date-format'] = myDateParser;
</code></pre>
     * <p>A parsing function should return a Date object, and is passed the following parameters:<div class="mdetail-params"><ul>
     * <li><code>date</code> : String<div class="sub-desc">The date string to parse.</div></li>
     * <li><code>strict</code> : Boolean<div class="sub-desc">True to validate date strings while parsing
     * (i.e. prevent javascript Date "rollover") (The default must be false).
     * Invalid date strings should return null when parsed.</div></li>
     * </ul></div></p>
     * <p>To enable Dates to also be <i>formatted</i> according to that format, a corresponding
     * formatting function must be placed into the {@link #formatFunctions} property.
     * @property parseFunctions
     * @type Object
     */
    parseFunctions: {
        "MS": function(input, strict) {
            // note: the timezone offset is ignored since the MS Ajax server sends
            // a UTC milliseconds-since-Unix-epoch value (negative values are allowed)
            var re = new RegExp('\\/Date\\(([-+])?(\\d+)(?:[+-]\\d{4})?\\)\\/'),
                r = (input || '').match(re);
            return r? new Date(((r[1] || '') + r[2]) * 1) : null;
        }
    },
    parseRegexes: [],

    /**
     * <p>An object hash in which each property is a date formatting function. The property name is the
     * format string which corresponds to the produced formatted date string.</p>
     * <p>This object is automatically populated with date formatting functions as
     * date formats are requested for Ext standard formatting strings.</p>
     * <p>Custom formatting functions may be inserted into this object, keyed by a name which from then on
     * may be used as a format string to {@link #format}. Example:</p><pre><code>
Ext.Date.formatFunctions['x-date-format'] = myDateFormatter;
</code></pre>
     * <p>A formatting function should return a string representation of the passed Date object, and is passed the following parameters:<div class="mdetail-params"><ul>
     * <li><code>date</code> : Date<div class="sub-desc">The Date to format.</div></li>
     * </ul></div></p>
     * <p>To enable date strings to also be <i>parsed</i> according to that format, a corresponding
     * parsing function must be placed into the {@link #parseFunctions} property.
     * @property formatFunctions
     * @type Object
     */
    formatFunctions: {
        "MS": function() {
            // UTC milliseconds since Unix epoch (MS-AJAX serialized date format (MRSF))
            return '\\/Date(' + this.getTime() + ')\\/';
        }
    },

    y2kYear : 50,

    /**
     * Date interval constant
     * @type String
     */
    MILLI : "ms",

    /**
     * Date interval constant
     * @type String
     */
    SECOND : "s",

    /**
     * Date interval constant
     * @type String
     */
    MINUTE : "mi",

    /** Date interval constant
     * @type String
     */
    HOUR : "h",

    /**
     * Date interval constant
     * @type String
     */
    DAY : "d",

    /**
     * Date interval constant
     * @type String
     */
    MONTH : "mo",

    /**
     * Date interval constant
     * @type String
     */
    YEAR : "y",

    /**
     * <p>An object hash containing default date values used during date parsing.</p>
     * <p>The following properties are available:<div class="mdetail-params"><ul>
     * <li><code>y</code> : Number<div class="sub-desc">The default year value. (defaults to undefined)</div></li>
     * <li><code>m</code> : Number<div class="sub-desc">The default 1-based month value. (defaults to undefined)</div></li>
     * <li><code>d</code> : Number<div class="sub-desc">The default day value. (defaults to undefined)</div></li>
     * <li><code>h</code> : Number<div class="sub-desc">The default hour value. (defaults to undefined)</div></li>
     * <li><code>i</code> : Number<div class="sub-desc">The default minute value. (defaults to undefined)</div></li>
     * <li><code>s</code> : Number<div class="sub-desc">The default second value. (defaults to undefined)</div></li>
     * <li><code>ms</code> : Number<div class="sub-desc">The default millisecond value. (defaults to undefined)</div></li>
     * </ul></div></p>
     * <p>Override these properties to customize the default date values used by the {@link #parse} method.</p>
     * <p><b>Note: In countries which experience Daylight Saving Time (i.e. DST), the <tt>h</tt>, <tt>i</tt>, <tt>s</tt>
     * and <tt>ms</tt> properties may coincide with the exact time in which DST takes effect.
     * It is the responsiblity of the developer to account for this.</b></p>
     * Example Usage:
     * <pre><code>
// set default day value to the first day of the month
Ext.Date.defaults.d = 1;

// parse a February date string containing only year and month values.
// setting the default day value to 1 prevents weird date rollover issues
// when attempting to parse the following date string on, for example, March 31st 2009.
Ext.Date.parse('2009-02', 'Y-m'); // returns a Date object representing February 1st 2009
</code></pre>
     * @property defaults
     * @type Object
     */
    defaults: {},

    //<locale type="array">
    /**
     * @property {String[]} dayNames
     * An array of textual day names.
     * Override these values for international dates.
     * Example:
     * <pre><code>
Ext.Date.dayNames = [
    'SundayInYourLang',
    'MondayInYourLang',
    ...
];
</code></pre>
     */
    dayNames : [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday"
    ],
    //</locale>

    //<locale type="array">
    /**
     * @property {String[]} monthNames
     * An array of textual month names.
     * Override these values for international dates.
     * Example:
     * <pre><code>
Ext.Date.monthNames = [
    'JanInYourLang',
    'FebInYourLang',
    ...
];
</code></pre>
     */
    monthNames : [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December"
    ],
    //</locale>

    //<locale type="object">
    /**
     * @property {Object} monthNumbers
     * An object hash of zero-based javascript month numbers (with short month names as keys. note: keys are case-sensitive).
     * Override these values for international dates.
     * Example:
     * <pre><code>
Ext.Date.monthNumbers = {
    'LongJanNameInYourLang': 0,
    'ShortJanNameInYourLang':0,
    'LongFebNameInYourLang':1,
    'ShortFebNameInYourLang':1,
    ...
};
</code></pre>
     */
    monthNumbers : {
        January: 0,
        Jan: 0,
        February: 1,
        Feb: 1,
        March: 2,
        Mar: 2,
        April: 3,
        Apr: 3,
        May: 4,
        June: 5,
        Jun: 5,
        July: 6,
        Jul: 6,
        August: 7,
        Aug: 7,
        September: 8,
        Sep: 8,
        October: 9,
        Oct: 9,
        November: 10,
        Nov: 10,
        December: 11,
        Dec: 11
    },
    //</locale>
    
    //<locale>
    /**
     * @property {String} defaultFormat
     * <p>The date format string that the {@link Ext.util.Format#dateRenderer}
     * and {@link Ext.util.Format#date} functions use.  See {@link Ext.Date} for details.</p>
     * <p>This may be overridden in a locale file.</p>
     */
    defaultFormat : "m/d/Y",
    //</locale>
    //<locale type="function">
    /**
     * Get the short month name for the given month number.
     * Override this function for international dates.
     * @param {Number} month A zero-based javascript month number.
     * @return {String} The short month name.
     */
    getShortMonthName : function(month) {
        return Ext.Date.monthNames[month].substring(0, 3);
    },
    //</locale>

    //<locale type="function">
    /**
     * Get the short day name for the given day number.
     * Override this function for international dates.
     * @param {Number} day A zero-based javascript day number.
     * @return {String} The short day name.
     */
    getShortDayName : function(day) {
        return Ext.Date.dayNames[day].substring(0, 3);
    },
    //</locale>

    //<locale type="function">
    /**
     * Get the zero-based javascript month number for the given short/full month name.
     * Override this function for international dates.
     * @param {String} name The short/full month name.
     * @return {Number} The zero-based javascript month number.
     */
    getMonthNumber : function(name) {
        // handle camel casing for english month names (since the keys for the Ext.Date.monthNumbers hash are case sensitive)
        return Ext.Date.monthNumbers[name.substring(0, 1).toUpperCase() + name.substring(1, 3).toLowerCase()];
    },
    //</locale>

    /**
     * Checks if the specified format contains hour information
     * @param {String} format The format to check
     * @return {Boolean} True if the format contains hour information
     * @method
     */
    formatContainsHourInfo : (function(){
        var stripEscapeRe = /(\\.)/g,
            hourInfoRe = /([gGhHisucUOPZ]|MS)/;
        return function(format){
            return hourInfoRe.test(format.replace(stripEscapeRe, ''));
        };
    }()),

    /**
     * Checks if the specified format contains information about
     * anything other than the time.
     * @param {String} format The format to check
     * @return {Boolean} True if the format contains information about
     * date/day information.
     * @method
     */
    formatContainsDateInfo : (function(){
        var stripEscapeRe = /(\\.)/g,
            dateInfoRe = /([djzmnYycU]|MS)/;

        return function(format){
            return dateInfoRe.test(format.replace(stripEscapeRe, ''));
        };
    }()),
    
    /**
     * Removes all escaping for a date format string. In date formats,
     * using a '\' can be used to escape special characters.
     * @param {String} format The format to unescape
     * @return {String} The unescaped format
     * @method
     */
    unescapeFormat: (function() { 
        var slashRe = /\\/gi;
        return function(format) {
            // Escape the format, since \ can be used to escape special
            // characters in a date format. For example, in a spanish
            // locale the format may be: 'd \\de F \\de Y'
            return format.replace(slashRe, '');
        }
    }()),

    /**
     * The base format-code to formatting-function hashmap used by the {@link #format} method.
     * Formatting functions are strings (or functions which return strings) which
     * will return the appropriate value when evaluated in the context of the Date object
     * from which the {@link #format} method is called.
     * Add to / override these mappings for custom date formatting.
     * Note: Ext.Date.format() treats characters as literals if an appropriate mapping cannot be found.
     * Example:
     * <pre><code>
Ext.Date.formatCodes.x = "Ext.util.Format.leftPad(this.getDate(), 2, '0')";
console.log(Ext.Date.format(new Date(), 'X'); // returns the current day of the month
</code></pre>
     * @type Object
     */
    formatCodes : {
        d: "Ext.String.leftPad(this.getDate(), 2, '0')",
        D: "Ext.Date.getShortDayName(this.getDay())", // get localised short day name
        j: "this.getDate()",
        l: "Ext.Date.dayNames[this.getDay()]",
        N: "(this.getDay() ? this.getDay() : 7)",
        S: "Ext.Date.getSuffix(this)",
        w: "this.getDay()",
        z: "Ext.Date.getDayOfYear(this)",
        W: "Ext.String.leftPad(Ext.Date.getWeekOfYear(this), 2, '0')",
        F: "Ext.Date.monthNames[this.getMonth()]",
        m: "Ext.String.leftPad(this.getMonth() + 1, 2, '0')",
        M: "Ext.Date.getShortMonthName(this.getMonth())", // get localised short month name
        n: "(this.getMonth() + 1)",
        t: "Ext.Date.getDaysInMonth(this)",
        L: "(Ext.Date.isLeapYear(this) ? 1 : 0)",
        o: "(this.getFullYear() + (Ext.Date.getWeekOfYear(this) == 1 && this.getMonth() > 0 ? +1 : (Ext.Date.getWeekOfYear(this) >= 52 && this.getMonth() < 11 ? -1 : 0)))",
        Y: "Ext.String.leftPad(this.getFullYear(), 4, '0')",
        y: "('' + this.getFullYear()).substring(2, 4)",
        a: "(this.getHours() < 12 ? 'am' : 'pm')",
        A: "(this.getHours() < 12 ? 'AM' : 'PM')",
        g: "((this.getHours() % 12) ? this.getHours() % 12 : 12)",
        G: "this.getHours()",
        h: "Ext.String.leftPad((this.getHours() % 12) ? this.getHours() % 12 : 12, 2, '0')",
        H: "Ext.String.leftPad(this.getHours(), 2, '0')",
        i: "Ext.String.leftPad(this.getMinutes(), 2, '0')",
        s: "Ext.String.leftPad(this.getSeconds(), 2, '0')",
        u: "Ext.String.leftPad(this.getMilliseconds(), 3, '0')",
        O: "Ext.Date.getGMTOffset(this)",
        P: "Ext.Date.getGMTOffset(this, true)",
        T: "Ext.Date.getTimezone(this)",
        Z: "(this.getTimezoneOffset() * -60)",

        c: function() { // ISO-8601 -- GMT format
            var c, code, i, l, e;
            for (c = "Y-m-dTH:i:sP", code = [], i = 0, l = c.length; i < l; ++i) {
                e = c.charAt(i);
                code.push(e == "T" ? "'T'" : utilDate.getFormatCode(e)); // treat T as a character literal
            }
            return code.join(" + ");
        },
        /*
        c: function() { // ISO-8601 -- UTC format
            return [
              "this.getUTCFullYear()", "'-'",
              "Ext.util.Format.leftPad(this.getUTCMonth() + 1, 2, '0')", "'-'",
              "Ext.util.Format.leftPad(this.getUTCDate(), 2, '0')",
              "'T'",
              "Ext.util.Format.leftPad(this.getUTCHours(), 2, '0')", "':'",
              "Ext.util.Format.leftPad(this.getUTCMinutes(), 2, '0')", "':'",
              "Ext.util.Format.leftPad(this.getUTCSeconds(), 2, '0')",
              "'Z'"
            ].join(" + ");
        },
        */

        U: "Math.round(this.getTime() / 1000)"
    },

    /**
     * Checks if the passed Date parameters will cause a javascript Date "rollover".
     * @param {Number} year 4-digit year
     * @param {Number} month 1-based month-of-year
     * @param {Number} day Day of month
     * @param {Number} hour (optional) Hour
     * @param {Number} minute (optional) Minute
     * @param {Number} second (optional) Second
     * @param {Number} millisecond (optional) Millisecond
     * @return {Boolean} true if the passed parameters do not cause a Date "rollover", false otherwise.
     */
    isValid : function(y, m, d, h, i, s, ms) {
        // setup defaults
        h = h || 0;
        i = i || 0;
        s = s || 0;
        ms = ms || 0;

        // Special handling for year < 100
        var dt = utilDate.add(new Date(y < 100 ? 100 : y, m - 1, d, h, i, s, ms), utilDate.YEAR, y < 100 ? y - 100 : 0);

        return y == dt.getFullYear() &&
            m == dt.getMonth() + 1 &&
            d == dt.getDate() &&
            h == dt.getHours() &&
            i == dt.getMinutes() &&
            s == dt.getSeconds() &&
            ms == dt.getMilliseconds();
    },

    /**
     * Parses the passed string using the specified date format.
     * Note that this function expects normal calendar dates, meaning that months are 1-based (i.e. 1 = January).
     * The {@link #defaults} hash will be used for any date value (i.e. year, month, day, hour, minute, second or millisecond)
     * which cannot be found in the passed string. If a corresponding default date value has not been specified in the {@link #defaults} hash,
     * the current date's year, month, day or DST-adjusted zero-hour time value will be used instead.
     * Keep in mind that the input date string must precisely match the specified format string
     * in order for the parse operation to be successful (failed parse operations return a null value).
     * <p>Example:</p><pre><code>
//dt = Fri May 25 2007 (current date)
var dt = new Date();

//dt = Thu May 25 2006 (today&#39;s month/day in 2006)
dt = Ext.Date.parse("2006", "Y");

//dt = Sun Jan 15 2006 (all date parts specified)
dt = Ext.Date.parse("2006-01-15", "Y-m-d");

//dt = Sun Jan 15 2006 15:20:01
dt = Ext.Date.parse("2006-01-15 3:20:01 PM", "Y-m-d g:i:s A");

// attempt to parse Sun Feb 29 2006 03:20:01 in strict mode
dt = Ext.Date.parse("2006-02-29 03:20:01", "Y-m-d H:i:s", true); // returns null
</code></pre>
     * @param {String} input The raw date string.
     * @param {String} format The expected date string format.
     * @param {Boolean} strict (optional) True to validate date strings while parsing (i.e. prevents javascript Date "rollover")
                        (defaults to false). Invalid date strings will return null when parsed.
     * @return {Date} The parsed Date.
     */
    parse : function(input, format, strict) {
        var p = utilDate.parseFunctions;
        if (p[format] == null) {
            utilDate.createParser(format);
        }
        return p[format](input, Ext.isDefined(strict) ? strict : utilDate.useStrict);
    },

    // Backwards compat
    parseDate: function(input, format, strict){
        return utilDate.parse(input, format, strict);
    },


    // private
    getFormatCode : function(character) {
        var f = utilDate.formatCodes[character];

        if (f) {
          f = typeof f == 'function'? f() : f;
          utilDate.formatCodes[character] = f; // reassign function result to prevent repeated execution
        }

        // note: unknown characters are treated as literals
        return f || ("'" + Ext.String.escape(character) + "'");
    },

    // private
    createFormat : function(format) {
        var code = [],
            special = false,
            ch = '',
            i;

        for (i = 0; i < format.length; ++i) {
            ch = format.charAt(i);
            if (!special && ch == "\\") {
                special = true;
            } else if (special) {
                special = false;
                code.push("'" + Ext.String.escape(ch) + "'");
            } else {
                code.push(utilDate.getFormatCode(ch));
            }
        }
        utilDate.formatFunctions[format] = Ext.functionFactory("return " + code.join('+'));
    },

    // private
    createParser : (function() {
        var code = [
            "var dt, y, m, d, h, i, s, ms, o, z, zz, u, v,",
                "def = Ext.Date.defaults,",
                "results = String(input).match(Ext.Date.parseRegexes[{0}]);", // either null, or an array of matched strings

            "if(results){",
                "{1}",

                "if(u != null){", // i.e. unix time is defined
                    "v = new Date(u * 1000);", // give top priority to UNIX time
                "}else{",
                    // create Date object representing midnight of the current day;
                    // this will provide us with our date defaults
                    // (note: clearTime() handles Daylight Saving Time automatically)
                    "dt = Ext.Date.clearTime(new Date);",

                    // date calculations (note: these calculations create a dependency on Ext.Number.from())
                    "y = Ext.Number.from(y, Ext.Number.from(def.y, dt.getFullYear()));",
                    "m = Ext.Number.from(m, Ext.Number.from(def.m - 1, dt.getMonth()));",
                    "d = Ext.Number.from(d, Ext.Number.from(def.d, dt.getDate()));",

                    // time calculations (note: these calculations create a dependency on Ext.Number.from())
                    "h  = Ext.Number.from(h, Ext.Number.from(def.h, dt.getHours()));",
                    "i  = Ext.Number.from(i, Ext.Number.from(def.i, dt.getMinutes()));",
                    "s  = Ext.Number.from(s, Ext.Number.from(def.s, dt.getSeconds()));",
                    "ms = Ext.Number.from(ms, Ext.Number.from(def.ms, dt.getMilliseconds()));",

                    "if(z >= 0 && y >= 0){",
                        // both the year and zero-based day of year are defined and >= 0.
                        // these 2 values alone provide sufficient info to create a full date object

                        // create Date object representing January 1st for the given year
                        // handle years < 100 appropriately
                        "v = Ext.Date.add(new Date(y < 100 ? 100 : y, 0, 1, h, i, s, ms), Ext.Date.YEAR, y < 100 ? y - 100 : 0);",

                        // then add day of year, checking for Date "rollover" if necessary
                        "v = !strict? v : (strict === true && (z <= 364 || (Ext.Date.isLeapYear(v) && z <= 365))? Ext.Date.add(v, Ext.Date.DAY, z) : null);",
                    "}else if(strict === true && !Ext.Date.isValid(y, m + 1, d, h, i, s, ms)){", // check for Date "rollover"
                        "v = null;", // invalid date, so return null
                    "}else{",
                        // plain old Date object
                        // handle years < 100 properly
                        "v = Ext.Date.add(new Date(y < 100 ? 100 : y, m, d, h, i, s, ms), Ext.Date.YEAR, y < 100 ? y - 100 : 0);",
                    "}",
                "}",
            "}",

            "if(v){",
                // favour UTC offset over GMT offset
                "if(zz != null){",
                    // reset to UTC, then add offset
                    "v = Ext.Date.add(v, Ext.Date.SECOND, -v.getTimezoneOffset() * 60 - zz);",
                "}else if(o){",
                    // reset to GMT, then add offset
                    "v = Ext.Date.add(v, Ext.Date.MINUTE, -v.getTimezoneOffset() + (sn == '+'? -1 : 1) * (hr * 60 + mn));",
                "}",
            "}",

            "return v;"
        ].join('\n');

        return function(format) {
            var regexNum = utilDate.parseRegexes.length,
                currentGroup = 1,
                calc = [],
                regex = [],
                special = false,
                ch = "",
                i = 0,
                len = format.length,
                atEnd = [],
                obj;

            for (; i < len; ++i) {
                ch = format.charAt(i);
                if (!special && ch == "\\") {
                    special = true;
                } else if (special) {
                    special = false;
                    regex.push(Ext.String.escape(ch));
                } else {
                    obj = utilDate.formatCodeToRegex(ch, currentGroup);
                    currentGroup += obj.g;
                    regex.push(obj.s);
                    if (obj.g && obj.c) {
                        if (obj.calcAtEnd) {
                            atEnd.push(obj.c);
                        } else {
                            calc.push(obj.c);
                        }
                    }
                }
            }
            
            calc = calc.concat(atEnd);

            utilDate.parseRegexes[regexNum] = new RegExp("^" + regex.join('') + "$", 'i');
            utilDate.parseFunctions[format] = Ext.functionFactory("input", "strict", xf(code, regexNum, calc.join('')));
        };
    }()),

    // private
    parseCodes : {
        /*
         * Notes:
         * g = {Number} calculation group (0 or 1. only group 1 contributes to date calculations.)
         * c = {String} calculation method (required for group 1. null for group 0. {0} = currentGroup - position in regex result array)
         * s = {String} regex pattern. all matches are stored in results[], and are accessible by the calculation mapped to 'c'
         */
        d: {
            g:1,
            c:"d = parseInt(results[{0}], 10);\n",
            s:"(3[0-1]|[1-2][0-9]|0[1-9])" // day of month with leading zeroes (01 - 31)
        },
        j: {
            g:1,
            c:"d = parseInt(results[{0}], 10);\n",
            s:"(3[0-1]|[1-2][0-9]|[1-9])" // day of month without leading zeroes (1 - 31)
        },
        D: function() {
            for (var a = [], i = 0; i < 7; a.push(utilDate.getShortDayName(i)), ++i); // get localised short day names
            return {
                g:0,
                c:null,
                s:"(?:" + a.join("|") +")"
            };
        },
        l: function() {
            return {
                g:0,
                c:null,
                s:"(?:" + utilDate.dayNames.join("|") + ")"
            };
        },
        N: {
            g:0,
            c:null,
            s:"[1-7]" // ISO-8601 day number (1 (monday) - 7 (sunday))
        },
        //<locale type="object" property="parseCodes">
        S: {
            g:0,
            c:null,
            s:"(?:st|nd|rd|th)"
        },
        //</locale>
        w: {
            g:0,
            c:null,
            s:"[0-6]" // javascript day number (0 (sunday) - 6 (saturday))
        },
        z: {
            g:1,
            c:"z = parseInt(results[{0}], 10);\n",
            s:"(\\d{1,3})" // day of the year (0 - 364 (365 in leap years))
        },
        W: {
            g:0,
            c:null,
            s:"(?:\\d{2})" // ISO-8601 week number (with leading zero)
        },
        F: function() {
            return {
                g:1,
                c:"m = parseInt(Ext.Date.getMonthNumber(results[{0}]), 10);\n", // get localised month number
                s:"(" + utilDate.monthNames.join("|") + ")"
            };
        },
        M: function() {
            for (var a = [], i = 0; i < 12; a.push(utilDate.getShortMonthName(i)), ++i); // get localised short month names
            return Ext.applyIf({
                s:"(" + a.join("|") + ")"
            }, utilDate.formatCodeToRegex("F"));
        },
        m: {
            g:1,
            c:"m = parseInt(results[{0}], 10) - 1;\n",
            s:"(1[0-2]|0[1-9])" // month number with leading zeros (01 - 12)
        },
        n: {
            g:1,
            c:"m = parseInt(results[{0}], 10) - 1;\n",
            s:"(1[0-2]|[1-9])" // month number without leading zeros (1 - 12)
        },
        t: {
            g:0,
            c:null,
            s:"(?:\\d{2})" // no. of days in the month (28 - 31)
        },
        L: {
            g:0,
            c:null,
            s:"(?:1|0)"
        },
        o: function() {
            return utilDate.formatCodeToRegex("Y");
        },
        Y: {
            g:1,
            c:"y = parseInt(results[{0}], 10);\n",
            s:"(\\d{4})" // 4-digit year
        },
        y: {
            g:1,
            c:"var ty = parseInt(results[{0}], 10);\n"
                + "y = ty > Ext.Date.y2kYear ? 1900 + ty : 2000 + ty;\n", // 2-digit year
            s:"(\\d{1,2})"
        },
        /*
         * In the am/pm parsing routines, we allow both upper and lower case
         * even though it doesn't exactly match the spec. It gives much more flexibility
         * in being able to specify case insensitive regexes.
         */
        //<locale type="object" property="parseCodes">
        a: {
            g:1,
            c:"if (/(am)/i.test(results[{0}])) {\n"
                + "if (!h || h == 12) { h = 0; }\n"
                + "} else { if (!h || h < 12) { h = (h || 0) + 12; }}",
            s:"(am|pm|AM|PM)",
            calcAtEnd: true
        },
        //</locale>
        //<locale type="object" property="parseCodes">
        A: {
            g:1,
            c:"if (/(am)/i.test(results[{0}])) {\n"
                + "if (!h || h == 12) { h = 0; }\n"
                + "} else { if (!h || h < 12) { h = (h || 0) + 12; }}",
            s:"(AM|PM|am|pm)",
            calcAtEnd: true
        },
        //</locale>
        g: {
            g:1,
            c:"h = parseInt(results[{0}], 10);\n",
            s:"(1[0-2]|[0-9])" //  12-hr format of an hour without leading zeroes (1 - 12)
        },
        G: {
            g:1,
            c:"h = parseInt(results[{0}], 10);\n",
            s:"(2[0-3]|1[0-9]|[0-9])" // 24-hr format of an hour without leading zeroes (0 - 23)
        },
        h: {
            g:1,
            c:"h = parseInt(results[{0}], 10);\n",
            s:"(1[0-2]|0[1-9])" //  12-hr format of an hour with leading zeroes (01 - 12)
        },
        H: {
            g:1,
            c:"h = parseInt(results[{0}], 10);\n",
            s:"(2[0-3]|[0-1][0-9])" //  24-hr format of an hour with leading zeroes (00 - 23)
        },
        i: {
            g:1,
            c:"i = parseInt(results[{0}], 10);\n",
            s:"([0-5][0-9])" // minutes with leading zeros (00 - 59)
        },
        s: {
            g:1,
            c:"s = parseInt(results[{0}], 10);\n",
            s:"([0-5][0-9])" // seconds with leading zeros (00 - 59)
        },
        u: {
            g:1,
            c:"ms = results[{0}]; ms = parseInt(ms, 10)/Math.pow(10, ms.length - 3);\n",
            s:"(\\d+)" // decimal fraction of a second (minimum = 1 digit, maximum = unlimited)
        },
        O: {
            g:1,
            c:[
                "o = results[{0}];",
                "var sn = o.substring(0,1),", // get + / - sign
                    "hr = o.substring(1,3)*1 + Math.floor(o.substring(3,5) / 60),", // get hours (performs minutes-to-hour conversion also, just in case)
                    "mn = o.substring(3,5) % 60;", // get minutes
                "o = ((-12 <= (hr*60 + mn)/60) && ((hr*60 + mn)/60 <= 14))? (sn + Ext.String.leftPad(hr, 2, '0') + Ext.String.leftPad(mn, 2, '0')) : null;\n" // -12hrs <= GMT offset <= 14hrs
            ].join("\n"),
            s: "([+-]\\d{4})" // GMT offset in hrs and mins
        },
        P: {
            g:1,
            c:[
                "o = results[{0}];",
                "var sn = o.substring(0,1),", // get + / - sign
                    "hr = o.substring(1,3)*1 + Math.floor(o.substring(4,6) / 60),", // get hours (performs minutes-to-hour conversion also, just in case)
                    "mn = o.substring(4,6) % 60;", // get minutes
                "o = ((-12 <= (hr*60 + mn)/60) && ((hr*60 + mn)/60 <= 14))? (sn + Ext.String.leftPad(hr, 2, '0') + Ext.String.leftPad(mn, 2, '0')) : null;\n" // -12hrs <= GMT offset <= 14hrs
            ].join("\n"),
            s: "([+-]\\d{2}:\\d{2})" // GMT offset in hrs and mins (with colon separator)
        },
        T: {
            g:0,
            c:null,
            s:"[A-Z]{1,4}" // timezone abbrev. may be between 1 - 4 chars
        },
        Z: {
            g:1,
            c:"zz = results[{0}] * 1;\n" // -43200 <= UTC offset <= 50400
                  + "zz = (-43200 <= zz && zz <= 50400)? zz : null;\n",
            s:"([+-]?\\d{1,5})" // leading '+' sign is optional for UTC offset
        },
        c: function() {
            var calc = [],
                arr = [
                    utilDate.formatCodeToRegex("Y", 1), // year
                    utilDate.formatCodeToRegex("m", 2), // month
                    utilDate.formatCodeToRegex("d", 3), // day
                    utilDate.formatCodeToRegex("H", 4), // hour
                    utilDate.formatCodeToRegex("i", 5), // minute
                    utilDate.formatCodeToRegex("s", 6), // second
                    {c:"ms = results[7] || '0'; ms = parseInt(ms, 10)/Math.pow(10, ms.length - 3);\n"}, // decimal fraction of a second (minimum = 1 digit, maximum = unlimited)
                    {c:[ // allow either "Z" (i.e. UTC) or "-0530" or "+08:00" (i.e. UTC offset) timezone delimiters. assumes local timezone if no timezone is specified
                        "if(results[8]) {", // timezone specified
                            "if(results[8] == 'Z'){",
                                "zz = 0;", // UTC
                            "}else if (results[8].indexOf(':') > -1){",
                                utilDate.formatCodeToRegex("P", 8).c, // timezone offset with colon separator
                            "}else{",
                                utilDate.formatCodeToRegex("O", 8).c, // timezone offset without colon separator
                            "}",
                        "}"
                    ].join('\n')}
                ],
                i,
                l;

            for (i = 0, l = arr.length; i < l; ++i) {
                calc.push(arr[i].c);
            }

            return {
                g:1,
                c:calc.join(""),
                s:[
                    arr[0].s, // year (required)
                    "(?:", "-", arr[1].s, // month (optional)
                        "(?:", "-", arr[2].s, // day (optional)
                            "(?:",
                                "(?:T| )?", // time delimiter -- either a "T" or a single blank space
                                arr[3].s, ":", arr[4].s,  // hour AND minute, delimited by a single colon (optional). MUST be preceded by either a "T" or a single blank space
                                "(?::", arr[5].s, ")?", // seconds (optional)
                                "(?:(?:\\.|,)(\\d+))?", // decimal fraction of a second (e.g. ",12345" or ".98765") (optional)
                                "(Z|(?:[-+]\\d{2}(?::)?\\d{2}))?", // "Z" (UTC) or "-0530" (UTC offset without colon delimiter) or "+08:00" (UTC offset with colon delimiter) (optional)
                            ")?",
                        ")?",
                    ")?"
                ].join("")
            };
        },
        U: {
            g:1,
            c:"u = parseInt(results[{0}], 10);\n",
            s:"(-?\\d+)" // leading minus sign indicates seconds before UNIX epoch
        }
    },

    //Old Ext.Date prototype methods.
    // private
    dateFormat: function(date, format) {
        return utilDate.format(date, format);
    },

    /**
     * Compares if two dates are equal by comparing their values.
     * @param {Date} date1
     * @param {Date} date2
     * @return {Boolean} True if the date values are equal
     */
    isEqual: function(date1, date2) {
        // check we have 2 date objects
        if (date1 && date2) {
            return (date1.getTime() === date2.getTime());
        }
        // one or both isn't a date, only equal if both are falsey
        return !(date1 || date2);
    },

    /**
     * Formats a date given the supplied format string.
     * @param {Date} date The date to format
     * @param {String} format The format string
     * @return {String} The formatted date or an empty string if date parameter is not a JavaScript Date object
     */
    format: function(date, format) {
        var formatFunctions = utilDate.formatFunctions;

        if (!Ext.isDate(date)) {
            return '';
        }

        if (formatFunctions[format] == null) {
            utilDate.createFormat(format);
        }

        return formatFunctions[format].call(date) + '';
    },

    /**
     * Get the timezone abbreviation of the current date (equivalent to the format specifier 'T').
     *
     * Note: The date string returned by the javascript Date object's toString() method varies
     * between browsers (e.g. FF vs IE) and system region settings (e.g. IE in Asia vs IE in America).
     * For a given date string e.g. "Thu Oct 25 2007 22:55:35 GMT+0800 (Malay Peninsula Standard Time)",
     * getTimezone() first tries to get the timezone abbreviation from between a pair of parentheses
     * (which may or may not be present), failing which it proceeds to get the timezone abbreviation
     * from the GMT offset portion of the date string.
     * @param {Date} date The date
     * @return {String} The abbreviated timezone name (e.g. 'CST', 'PDT', 'EDT', 'MPST' ...).
     */
    getTimezone : function(date) {
        // the following list shows the differences between date strings from different browsers on a WinXP SP2 machine from an Asian locale:
        //
        // Opera  : "Thu, 25 Oct 2007 22:53:45 GMT+0800" -- shortest (weirdest) date string of the lot
        // Safari : "Thu Oct 25 2007 22:55:35 GMT+0800 (Malay Peninsula Standard Time)" -- value in parentheses always gives the correct timezone (same as FF)
        // FF     : "Thu Oct 25 2007 22:55:35 GMT+0800 (Malay Peninsula Standard Time)" -- value in parentheses always gives the correct timezone
        // IE     : "Thu Oct 25 22:54:35 UTC+0800 2007" -- (Asian system setting) look for 3-4 letter timezone abbrev
        // IE     : "Thu Oct 25 17:06:37 PDT 2007" -- (American system setting) look for 3-4 letter timezone abbrev
        //
        // this crazy regex attempts to guess the correct timezone abbreviation despite these differences.
        // step 1: (?:\((.*)\) -- find timezone in parentheses
        // step 2: ([A-Z]{1,4})(?:[\-+][0-9]{4})?(?: -?\d+)?) -- if nothing was found in step 1, find timezone from timezone offset portion of date string
        // step 3: remove all non uppercase characters found in step 1 and 2
        return date.toString().replace(/^.* (?:\((.*)\)|([A-Z]{1,4})(?:[\-+][0-9]{4})?(?: -?\d+)?)$/, "$1$2").replace(/[^A-Z]/g, "");
    },

    /**
     * Get the offset from GMT of the current date (equivalent to the format specifier 'O').
     * @param {Date} date The date
     * @param {Boolean} colon (optional) true to separate the hours and minutes with a colon (defaults to false).
     * @return {String} The 4-character offset string prefixed with + or - (e.g. '-0600').
     */
    getGMTOffset : function(date, colon) {
        var offset = date.getTimezoneOffset();
        return (offset > 0 ? "-" : "+")
            + Ext.String.leftPad(Math.floor(Math.abs(offset) / 60), 2, "0")
            + (colon ? ":" : "")
            + Ext.String.leftPad(Math.abs(offset % 60), 2, "0");
    },

    /**
     * Get the numeric day number of the year, adjusted for leap year.
     * @param {Date} date The date
     * @return {Number} 0 to 364 (365 in leap years).
     */
    getDayOfYear: function(date) {
        var num = 0,
            d = Ext.Date.clone(date),
            m = date.getMonth(),
            i;

        for (i = 0, d.setDate(1), d.setMonth(0); i < m; d.setMonth(++i)) {
            num += utilDate.getDaysInMonth(d);
        }
        return num + date.getDate() - 1;
    },

    /**
     * Get the numeric ISO-8601 week number of the year.
     * (equivalent to the format specifier 'W', but without a leading zero).
     * @param {Date} date The date
     * @return {Number} 1 to 53
     * @method
     */
    getWeekOfYear : (function() {
        // adapted from http://www.merlyn.demon.co.uk/weekcalc.htm
        var ms1d = 864e5, // milliseconds in a day
            ms7d = 7 * ms1d; // milliseconds in a week

        return function(date) { // return a closure so constants get calculated only once
            var DC3 = Date.UTC(date.getFullYear(), date.getMonth(), date.getDate() + 3) / ms1d, // an Absolute Day Number
                AWN = Math.floor(DC3 / 7), // an Absolute Week Number
                Wyr = new Date(AWN * ms7d).getUTCFullYear();

            return AWN - Math.floor(Date.UTC(Wyr, 0, 7) / ms7d) + 1;
        };
    }()),

    /**
     * Checks if the current date falls within a leap year.
     * @param {Date} date The date
     * @return {Boolean} True if the current date falls within a leap year, false otherwise.
     */
    isLeapYear : function(date) {
        var year = date.getFullYear();
        return !!((year & 3) == 0 && (year % 100 || (year % 400 == 0 && year)));
    },

    /**
     * Get the first day of the current month, adjusted for leap year.  The returned value
     * is the numeric day index within the week (0-6) which can be used in conjunction with
     * the {@link #monthNames} array to retrieve the textual day name.
     * Example:
     * <pre><code>
var dt = new Date('1/10/2007'),
    firstDay = Ext.Date.getFirstDayOfMonth(dt);
console.log(Ext.Date.dayNames[firstDay]); //output: 'Monday'
     * </code></pre>
     * @param {Date} date The date
     * @return {Number} The day number (0-6).
     */
    getFirstDayOfMonth : function(date) {
        var day = (date.getDay() - (date.getDate() - 1)) % 7;
        return (day < 0) ? (day + 7) : day;
    },

    /**
     * Get the last day of the current month, adjusted for leap year.  The returned value
     * is the numeric day index within the week (0-6) which can be used in conjunction with
     * the {@link #monthNames} array to retrieve the textual day name.
     * Example:
     * <pre><code>
var dt = new Date('1/10/2007'),
    lastDay = Ext.Date.getLastDayOfMonth(dt);
console.log(Ext.Date.dayNames[lastDay]); //output: 'Wednesday'
     * </code></pre>
     * @param {Date} date The date
     * @return {Number} The day number (0-6).
     */
    getLastDayOfMonth : function(date) {
        return utilDate.getLastDateOfMonth(date).getDay();
    },


    /**
     * Get the date of the first day of the month in which this date resides.
     * @param {Date} date The date
     * @return {Date}
     */
    getFirstDateOfMonth : function(date) {
        return new Date(date.getFullYear(), date.getMonth(), 1);
    },

    /**
     * Get the date of the last day of the month in which this date resides.
     * @param {Date} date The date
     * @return {Date}
     */
    getLastDateOfMonth : function(date) {
        return new Date(date.getFullYear(), date.getMonth(), utilDate.getDaysInMonth(date));
    },

    /**
     * Get the number of days in the current month, adjusted for leap year.
     * @param {Date} date The date
     * @return {Number} The number of days in the month.
     * @method
     */
    getDaysInMonth: (function() {
        var daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

        return function(date) { // return a closure for efficiency
            var m = date.getMonth();

            return m == 1 && utilDate.isLeapYear(date) ? 29 : daysInMonth[m];
        };
    }()),

    //<locale type="function">
    /**
     * Get the English ordinal suffix of the current day (equivalent to the format specifier 'S').
     * @param {Date} date The date
     * @return {String} 'st, 'nd', 'rd' or 'th'.
     */
    getSuffix : function(date) {
        switch (date.getDate()) {
            case 1:
            case 21:
            case 31:
                return "st";
            case 2:
            case 22:
                return "nd";
            case 3:
            case 23:
                return "rd";
            default:
                return "th";
        }
    },
    //</locale>

    /**
     * Creates and returns a new Date instance with the exact same date value as the called instance.
     * Dates are copied and passed by reference, so if a copied date variable is modified later, the original
     * variable will also be changed.  When the intention is to create a new variable that will not
     * modify the original instance, you should create a clone.
     *
     * Example of correctly cloning a date:
     * <pre><code>
//wrong way:
var orig = new Date('10/1/2006');
var copy = orig;
copy.setDate(5);
console.log(orig);  //returns 'Thu Oct 05 2006'!

//correct way:
var orig = new Date('10/1/2006'),
    copy = Ext.Date.clone(orig);
copy.setDate(5);
console.log(orig);  //returns 'Thu Oct 01 2006'
     * </code></pre>
     * @param {Date} date The date
     * @return {Date} The new Date instance.
     */
    clone : function(date) {
        return new Date(date.getTime());
    },

    /**
     * Checks if the current date is affected by Daylight Saving Time (DST).
     * @param {Date} date The date
     * @return {Boolean} True if the current date is affected by DST.
     */
    isDST : function(date) {
        // adapted from http://sencha.com/forum/showthread.php?p=247172#post247172
        // courtesy of @geoffrey.mcgill
        return new Date(date.getFullYear(), 0, 1).getTimezoneOffset() != date.getTimezoneOffset();
    },

    /**
     * Attempts to clear all time information from this Date by setting the time to midnight of the same day,
     * automatically adjusting for Daylight Saving Time (DST) where applicable.
     * (note: DST timezone information for the browser's host operating system is assumed to be up-to-date)
     * @param {Date} date The date
     * @param {Boolean} clone true to create a clone of this date, clear the time and return it (defaults to false).
     * @return {Date} this or the clone.
     */
    clearTime : function(date, clone) {
        if (clone) {
            return Ext.Date.clearTime(Ext.Date.clone(date));
        }

        // get current date before clearing time
        var d = date.getDate(),
            hr,
            c;

        // clear time
        date.setHours(0);
        date.setMinutes(0);
        date.setSeconds(0);
        date.setMilliseconds(0);

        if (date.getDate() != d) { // account for DST (i.e. day of month changed when setting hour = 0)
            // note: DST adjustments are assumed to occur in multiples of 1 hour (this is almost always the case)
            // refer to http://www.timeanddate.com/time/aboutdst.html for the (rare) exceptions to this rule

            // increment hour until cloned date == current date
            for (hr = 1, c = utilDate.add(date, Ext.Date.HOUR, hr); c.getDate() != d; hr++, c = utilDate.add(date, Ext.Date.HOUR, hr));

            date.setDate(d);
            date.setHours(c.getHours());
        }

        return date;
    },

    /**
     * Provides a convenient method for performing basic date arithmetic. This method
     * does not modify the Date instance being called - it creates and returns
     * a new Date instance containing the resulting date value.
     *
     * Examples:
     * <pre><code>
// Basic usage:
var dt = Ext.Date.add(new Date('10/29/2006'), Ext.Date.DAY, 5);
console.log(dt); //returns 'Fri Nov 03 2006 00:00:00'

// Negative values will be subtracted:
var dt2 = Ext.Date.add(new Date('10/1/2006'), Ext.Date.DAY, -5);
console.log(dt2); //returns 'Tue Sep 26 2006 00:00:00'

     * </code></pre>
     *
     * @param {Date} date The date to modify
     * @param {String} interval A valid date interval enum value.
     * @param {Number} value The amount to add to the current date.
     * @return {Date} The new Date instance.
     */
    add : function(date, interval, value) {
        var d = Ext.Date.clone(date),
            Date = Ext.Date,
            day;
        if (!interval || value === 0) {
            return d;
        }

        switch(interval.toLowerCase()) {
            case Ext.Date.MILLI:
                d.setMilliseconds(d.getMilliseconds() + value);
                break;
            case Ext.Date.SECOND:
                d.setSeconds(d.getSeconds() + value);
                break;
            case Ext.Date.MINUTE:
                d.setMinutes(d.getMinutes() + value);
                break;
            case Ext.Date.HOUR:
                d.setHours(d.getHours() + value);
                break;
            case Ext.Date.DAY:
                d.setDate(d.getDate() + value);
                break;
            case Ext.Date.MONTH:
                day = date.getDate();
                if (day > 28) {
                    day = Math.min(day, Ext.Date.getLastDateOfMonth(Ext.Date.add(Ext.Date.getFirstDateOfMonth(date), Ext.Date.MONTH, value)).getDate());
                }
                d.setDate(day);
                d.setMonth(date.getMonth() + value);
                break;
            case Ext.Date.YEAR:
                day = date.getDate();
                if (day > 28) {
                    day = Math.min(day, Ext.Date.getLastDateOfMonth(Ext.Date.add(Ext.Date.getFirstDateOfMonth(date), Ext.Date.YEAR, value)).getDate());
                }
                d.setDate(day);
                d.setFullYear(date.getFullYear() + value);
                break;
        }
        return d;
    },

    /**
     * Checks if a date falls on or between the given start and end dates.
     * @param {Date} date The date to check
     * @param {Date} start Start date
     * @param {Date} end End date
     * @return {Boolean} true if this date falls on or between the given start and end dates.
     */
    between : function(date, start, end) {
        var t = date.getTime();
        return start.getTime() <= t && t <= end.getTime();
    },

    //Maintains compatibility with old static and prototype window.Date methods.
    compat: function() {
        var nativeDate = window.Date,
            p, u,
            statics = ['useStrict', 'formatCodeToRegex', 'parseFunctions', 'parseRegexes', 'formatFunctions', 'y2kYear', 'MILLI', 'SECOND', 'MINUTE', 'HOUR', 'DAY', 'MONTH', 'YEAR', 'defaults', 'dayNames', 'monthNames', 'monthNumbers', 'getShortMonthName', 'getShortDayName', 'getMonthNumber', 'formatCodes', 'isValid', 'parseDate', 'getFormatCode', 'createFormat', 'createParser', 'parseCodes'],
            proto = ['dateFormat', 'format', 'getTimezone', 'getGMTOffset', 'getDayOfYear', 'getWeekOfYear', 'isLeapYear', 'getFirstDayOfMonth', 'getLastDayOfMonth', 'getDaysInMonth', 'getSuffix', 'clone', 'isDST', 'clearTime', 'add', 'between'],
            sLen    = statics.length,
            pLen    = proto.length,
            stat, prot, s;

        //Append statics
        for (s = 0; s < sLen; s++) {
            stat = statics[s];
            nativeDate[stat] = utilDate[stat];
        }

        //Append to prototype
        for (p = 0; p < pLen; p++) {
            prot = proto[p];
            nativeDate.prototype[prot] = function() {
                var args = Array.prototype.slice.call(arguments);
                args.unshift(this);
                return utilDate[prot].apply(utilDate, args);
            };
        }
    }
};

var utilDate = Ext.Date;

}());
 /**
 * @author Jacky Nguyen <jacky@sencha.com>
 * @docauthor Jacky Nguyen <jacky@sencha.com>
 * @class Ext.Object
 *
 * A collection of useful static methods to deal with objects.
 *
 * @singleton
 */

(function() {

// The "constructor" for chain:
var TemplateClass = function(){},
    ExtObject = Ext.Object = {

    /**
     * Returns a new object with the given object as the prototype chain.
     * @param {Object} object The prototype chain for the new object.
     */
    chain: function (object) {
        TemplateClass.prototype = object;
        var result = new TemplateClass();
        TemplateClass.prototype = null;
        return result;
    },

    /**
     * Converts a `name` - `value` pair to an array of objects with support for nested structures. Useful to construct
     * query strings. For example:
     *
     *     var objects = Ext.Object.toQueryObjects('hobbies', ['reading', 'cooking', 'swimming']);
     *
     *     // objects then equals:
     *     [
     *         { name: 'hobbies', value: 'reading' },
     *         { name: 'hobbies', value: 'cooking' },
     *         { name: 'hobbies', value: 'swimming' },
     *     ];
     *
     *     var objects = Ext.Object.toQueryObjects('dateOfBirth', {
     *         day: 3,
     *         month: 8,
     *         year: 1987,
     *         extra: {
     *             hour: 4
     *             minute: 30
     *         }
     *     }, true); // Recursive
     *
     *     // objects then equals:
     *     [
     *         { name: 'dateOfBirth[day]', value: 3 },
     *         { name: 'dateOfBirth[month]', value: 8 },
     *         { name: 'dateOfBirth[year]', value: 1987 },
     *         { name: 'dateOfBirth[extra][hour]', value: 4 },
     *         { name: 'dateOfBirth[extra][minute]', value: 30 },
     *     ];
     *
     * @param {String} name
     * @param {Object/Array} value
     * @param {Boolean} [recursive=false] True to traverse object recursively
     * @return {Array}
     */
    toQueryObjects: function(name, value, recursive) {
        var self = ExtObject.toQueryObjects,
            objects = [],
            i, ln;

        if (Ext.isArray(value)) {
            for (i = 0, ln = value.length; i < ln; i++) {
                if (recursive) {
                    objects = objects.concat(self(name + '[' + i + ']', value[i], true));
                }
                else {
                    objects.push({
                        name: name,
                        value: value[i]
                    });
                }
            }
        }
        else if (Ext.isObject(value)) {
            for (i in value) {
                if (value.hasOwnProperty(i)) {
                    if (recursive) {
                        objects = objects.concat(self(name + '[' + i + ']', value[i], true));
                    }
                    else {
                        objects.push({
                            name: name,
                            value: value[i]
                        });
                    }
                }
            }
        }
        else {
            objects.push({
                name: name,
                value: value
            });
        }

        return objects;
    },

    /**
     * Takes an object and converts it to an encoded query string.
     *
     * Non-recursive:
     *
     *     Ext.Object.toQueryString({foo: 1, bar: 2}); // returns "foo=1&bar=2"
     *     Ext.Object.toQueryString({foo: null, bar: 2}); // returns "foo=&bar=2"
     *     Ext.Object.toQueryString({'some price': '$300'}); // returns "some%20price=%24300"
     *     Ext.Object.toQueryString({date: new Date(2011, 0, 1)}); // returns "date=%222011-01-01T00%3A00%3A00%22"
     *     Ext.Object.toQueryString({colors: ['red', 'green', 'blue']}); // returns "colors=red&colors=green&colors=blue"
     *
     * Recursive:
     *
     *     Ext.Object.toQueryString({
     *         username: 'Jacky',
     *         dateOfBirth: {
     *             day: 1,
     *             month: 2,
     *             year: 1911
     *         },
     *         hobbies: ['coding', 'eating', 'sleeping', ['nested', 'stuff']]
     *     }, true); // returns the following string (broken down and url-decoded for ease of reading purpose):
     *     // username=Jacky
     *     //    &dateOfBirth[day]=1&dateOfBirth[month]=2&dateOfBirth[year]=1911
     *     //    &hobbies[0]=coding&hobbies[1]=eating&hobbies[2]=sleeping&hobbies[3][0]=nested&hobbies[3][1]=stuff
     *
     * @param {Object} object The object to encode
     * @param {Boolean} [recursive=false] Whether or not to interpret the object in recursive format.
     * (PHP / Ruby on Rails servers and similar).
     * @return {String} queryString
     */
    toQueryString: function(object, recursive) {
        var paramObjects = [],
            params = [],
            i, j, ln, paramObject, value;

        for (i in object) {
            if (object.hasOwnProperty(i)) {
                paramObjects = paramObjects.concat(ExtObject.toQueryObjects(i, object[i], recursive));
            }
        }

        for (j = 0, ln = paramObjects.length; j < ln; j++) {
            paramObject = paramObjects[j];
            value = paramObject.value;

            if (Ext.isEmpty(value)) {
                value = '';
            }
            else if (Ext.isDate(value)) {
                value = Ext.Date.toString(value);
            }

            params.push(encodeURIComponent(paramObject.name) + '=' + encodeURIComponent(String(value)));
        }

        return params.join('&');
    },

    /**
     * Converts a query string back into an object.
     *
     * Non-recursive:
     *
     *     Ext.Object.fromQueryString("foo=1&bar=2"); // returns {foo: 1, bar: 2}
     *     Ext.Object.fromQueryString("foo=&bar=2"); // returns {foo: null, bar: 2}
     *     Ext.Object.fromQueryString("some%20price=%24300"); // returns {'some price': '$300'}
     *     Ext.Object.fromQueryString("colors=red&colors=green&colors=blue"); // returns {colors: ['red', 'green', 'blue']}
     *
     * Recursive:
     *
     *     Ext.Object.fromQueryString(
     *         "username=Jacky&"+
     *         "dateOfBirth[day]=1&dateOfBirth[month]=2&dateOfBirth[year]=1911&"+
     *         "hobbies[0]=coding&hobbies[1]=eating&hobbies[2]=sleeping&"+
     *         "hobbies[3][0]=nested&hobbies[3][1]=stuff", true);
     *
     *     // returns
     *     {
     *         username: 'Jacky',
     *         dateOfBirth: {
     *             day: '1',
     *             month: '2',
     *             year: '1911'
     *         },
     *         hobbies: ['coding', 'eating', 'sleeping', ['nested', 'stuff']]
     *     }
     *
     * @param {String} queryString The query string to decode
     * @param {Boolean} [recursive=false] Whether or not to recursively decode the string. This format is supported by
     * PHP / Ruby on Rails servers and similar.
     * @return {Object}
     */
    fromQueryString: function(queryString, recursive) {
        var parts = queryString.replace(/^\?/, '').split('&'),
            object = {},
            temp, components, name, value, i, ln,
            part, j, subLn, matchedKeys, matchedName,
            keys, key, nextKey;

        for (i = 0, ln = parts.length; i < ln; i++) {
            part = parts[i];

            if (part.length > 0) {
                components = part.split('=');
                name = decodeURIComponent(components[0]);
                value = (components[1] !== undefined) ? decodeURIComponent(components[1]) : '';

                if (!recursive) {
                    if (object.hasOwnProperty(name)) {
                        if (!Ext.isArray(object[name])) {
                            object[name] = [object[name]];
                        }

                        object[name].push(value);
                    }
                    else {
                        object[name] = value;
                    }
                }
                else {
                    matchedKeys = name.match(/(\[):?([^\]]*)\]/g);
                    matchedName = name.match(/^([^\[]+)/);

                    //<debug error>
                    if (!matchedName) {
                        throw new Error('[Ext.Object.fromQueryString] Malformed query string given, failed parsing name from "' + part + '"');
                    }
                    //</debug>

                    name = matchedName[0];
                    keys = [];

                    if (matchedKeys === null) {
                        object[name] = value;
                        continue;
                    }

                    for (j = 0, subLn = matchedKeys.length; j < subLn; j++) {
                        key = matchedKeys[j];
                        key = (key.length === 2) ? '' : key.substring(1, key.length - 1);
                        keys.push(key);
                    }

                    keys.unshift(name);

                    temp = object;

                    for (j = 0, subLn = keys.length; j < subLn; j++) {
                        key = keys[j];

                        if (j === subLn - 1) {
                            if (Ext.isArray(temp) && key === '') {
                                temp.push(value);
                            }
                            else {
                                temp[key] = value;
                            }
                        }
                        else {
                            if (temp[key] === undefined || typeof temp[key] === 'string') {
                                nextKey = keys[j+1];

                                temp[key] = (Ext.isNumeric(nextKey) || nextKey === '') ? [] : {};
                            }

                            temp = temp[key];
                        }
                    }
                }
            }
        }

        return object;
    },

    /**
     * Iterates through an object and invokes the given callback function for each iteration.
     * The iteration can be stopped by returning `false` in the callback function. For example:
     *
     *     var person = {
     *         name: 'Jacky'
     *         hairColor: 'black'
     *         loves: ['food', 'sleeping', 'wife']
     *     };
     *
     *     Ext.Object.each(person, function(key, value, myself) {
     *         console.log(key + ":" + value);
     *
     *         if (key === 'hairColor') {
     *             return false; // stop the iteration
     *         }
     *     });
     *
     * @param {Object} object The object to iterate
     * @param {Function} fn The callback function.
     * @param {String} fn.key
     * @param {Object} fn.value
     * @param {Object} fn.object The object itself
     * @param {Object} [scope] The execution scope (`this`) of the callback function
     */
    each: function(object, fn, scope) {
        for (var property in object) {
            if (object.hasOwnProperty(property)) {
                if (fn.call(scope || object, property, object[property], object) === false) {
                    return;
                }
            }
        }
    },

    /**
     * Merges any number of objects recursively without referencing them or their children.
     *
     *     var extjs = {
     *         companyName: 'Ext JS',
     *         products: ['Ext JS', 'Ext GWT', 'Ext Designer'],
     *         isSuperCool: true,
     *         office: {
     *             size: 2000,
     *             location: 'Palo Alto',
     *             isFun: true
     *         }
     *     };
     *
     *     var newStuff = {
     *         companyName: 'Sencha Inc.',
     *         products: ['Ext JS', 'Ext GWT', 'Ext Designer', 'Sencha Touch', 'Sencha Animator'],
     *         office: {
     *             size: 40000,
     *             location: 'Redwood City'
     *         }
     *     };
     *
     *     var sencha = Ext.Object.merge(extjs, newStuff);
     *
     *     // extjs and sencha then equals to
     *     {
     *         companyName: 'Sencha Inc.',
     *         products: ['Ext JS', 'Ext GWT', 'Ext Designer', 'Sencha Touch', 'Sencha Animator'],
     *         isSuperCool: true,
     *         office: {
     *             size: 40000,
     *             location: 'Redwood City',
     *             isFun: true
     *         }
     *     }
     *
     * @param {Object} destination The object into which all subsequent objects are merged.
     * @param {Object...} object Any number of objects to merge into the destination.
     * @return {Object} merged The destination object with all passed objects merged in.
     */
    merge: function(destination) {
        var i = 1,
            ln = arguments.length,
            mergeFn = ExtObject.merge,
            cloneFn = Ext.clone,
            object, key, value, sourceKey;

        for (; i < ln; i++) {
            object = arguments[i];

            for (key in object) {
                value = object[key];
                if (value && value.constructor === Object) {
                    sourceKey = destination[key];
                    if (sourceKey && sourceKey.constructor === Object) {
                        mergeFn(sourceKey, value);
                    }
                    else {
                        destination[key] = cloneFn(value);
                    }
                }
                else {
                    destination[key] = value;
                }
            }
        }

        return destination;
    },

    /**
     * @private
     * @param destination
     */
    mergeIf: function(destination) {
        var i = 1,
            ln = arguments.length,
            cloneFn = Ext.clone,
            object, key, value;

        for (; i < ln; i++) {
            object = arguments[i];

            for (key in object) {
                if (!(key in destination)) {
                    value = object[key];

                    if (value && value.constructor === Object) {
                        destination[key] = cloneFn(value);
                    }
                    else {
                        destination[key] = value;
                    }
                }
            }
        }

        return destination;
    },

    /**
     * Returns the first matching key corresponding to the given value.
     * If no matching value is found, null is returned.
     *
     *     var person = {
     *         name: 'Jacky',
     *         loves: 'food'
     *     };
     *
     *     alert(Ext.Object.getKey(person, 'food')); // alerts 'loves'
     *
     * @param {Object} object
     * @param {Object} value The value to find
     */
    getKey: function(object, value) {
        for (var property in object) {
            if (object.hasOwnProperty(property) && object[property] === value) {
                return property;
            }
        }

        return null;
    },

    /**
     * Gets all values of the given object as an array.
     *
     *     var values = Ext.Object.getValues({
     *         name: 'Jacky',
     *         loves: 'food'
     *     }); // ['Jacky', 'food']
     *
     * @param {Object} object
     * @return {Array} An array of values from the object
     */
    getValues: function(object) {
        var values = [],
            property;

        for (property in object) {
            if (object.hasOwnProperty(property)) {
                values.push(object[property]);
            }
        }

        return values;
    },

    /**
     * Gets all keys of the given object as an array.
     *
     *     var values = Ext.Object.getKeys({
     *         name: 'Jacky',
     *         loves: 'food'
     *     }); // ['name', 'loves']
     *
     * @param {Object} object
     * @return {String[]} An array of keys from the object
     * @method
     */
    getKeys: (typeof Object.keys == 'function')
        ? function(object){
            if (!object) {
                return [];
            }
            return Object.keys(object);
        }
        : function(object) {
            var keys = [],
                property;

            for (property in object) {
                if (object.hasOwnProperty(property)) {
                    keys.push(property);
                }
            }

            return keys;
        },

    /**
     * Gets the total number of this object's own properties
     *
     *     var size = Ext.Object.getSize({
     *         name: 'Jacky',
     *         loves: 'food'
     *     }); // size equals 2
     *
     * @param {Object} object
     * @return {Number} size
     */
    getSize: function(object) {
        var size = 0,
            property;

        for (property in object) {
            if (object.hasOwnProperty(property)) {
                size++;
            }
        }

        return size;
    },

    /**
     * @private
     */
    classify: function(object) {
        var prototype = object,
            objectProperties = [],
            propertyClassesMap = {},
            objectClass = function() {
                var i = 0,
                    ln = objectProperties.length,
                    property;

                for (; i < ln; i++) {
                    property = objectProperties[i];
                    this[property] = new propertyClassesMap[property]();
                }
            },
            key, value;

        for (key in object) {
            if (object.hasOwnProperty(key)) {
                value = object[key];

                if (value && value.constructor === Object) {
                    objectProperties.push(key);
                    propertyClassesMap[key] = ExtObject.classify(value);
                }
            }
        }

        objectClass.prototype = prototype;

        return objectClass;
    }
};

/**
 * A convenient alias method for {@link Ext.Object#merge}.
 *
 * @member Ext
 * @method merge
 * @inheritdoc Ext.Object#merge
 */
Ext.merge = Ext.Object.merge;

/**
 * @private
 */
Ext.mergeIf = Ext.Object.mergeIf;

/**
 *
 * @member Ext
 * @method urlEncode
 * @inheritdoc Ext.Object#toQueryString
 * @deprecated 4.0.0 Use {@link Ext.Object#toQueryString} instead
 */
Ext.urlEncode = function() {
    var args = Ext.Array.from(arguments),
        prefix = '';

    // Support for the old `pre` argument
    if ((typeof args[1] === 'string')) {
        prefix = args[1] + '&';
        args[1] = false;
    }

    return prefix + ExtObject.toQueryString.apply(ExtObject, args);
};

/**
 * Alias for {@link Ext.Object#fromQueryString}.
 *
 * @member Ext
 * @method urlDecode
 * @inheritdoc Ext.Object#fromQueryString
 * @deprecated 4.0.0 Use {@link Ext.Object#fromQueryString} instead
 */
Ext.urlDecode = function() {
    return ExtObject.fromQueryString.apply(ExtObject, arguments);
};

}());
 /**
 * @class Ext.Function
 *
 * A collection of useful static methods to deal with function callbacks
 * @singleton
 * @alternateClassName Ext.util.Functions
 */
Ext.Function = {

    /**
     * A very commonly used method throughout the framework. It acts as a wrapper around another method
     * which originally accepts 2 arguments for `name` and `value`.
     * The wrapped function then allows "flexible" value setting of either:
     *
     * - `name` and `value` as 2 arguments
     * - one single object argument with multiple key - value pairs
     *
     * For example:
     *
     *     var setValue = Ext.Function.flexSetter(function(name, value) {
     *         this[name] = value;
     *     });
     *
     *     // Afterwards
     *     // Setting a single name - value
     *     setValue('name1', 'value1');
     *
     *     // Settings multiple name - value pairs
     *     setValue({
     *         name1: 'value1',
     *         name2: 'value2',
     *         name3: 'value3'
     *     });
     *
     * @param {Function} setter
     * @returns {Function} flexSetter
     */
    flexSetter: function(fn) {
        return function(a, b) {
            var k, i;

            if (a === null) {
                return this;
            }

            if (typeof a !== 'string') {
                for (k in a) {
                    if (a.hasOwnProperty(k)) {
                        fn.call(this, k, a[k]);
                    }
                }

                if (Ext.enumerables) {
                    for (i = Ext.enumerables.length; i--;) {
                        k = Ext.enumerables[i];
                        if (a.hasOwnProperty(k)) {
                            fn.call(this, k, a[k]);
                        }
                    }
                }
            } else {
                fn.call(this, a, b);
            }

            return this;
        };
    },

    /**
     * Create a new function from the provided `fn`, change `this` to the provided scope, optionally
     * overrides arguments for the call. (Defaults to the arguments passed by the caller)
     *
     * {@link Ext#bind Ext.bind} is alias for {@link Ext.Function#bind Ext.Function.bind}
     *
     * @param {Function} fn The function to delegate.
     * @param {Object} scope (optional) The scope (`this` reference) in which the function is executed.
     * **If omitted, defaults to the default global environment object (usually the browser window).**
     * @param {Array} args (optional) Overrides arguments for the call. (Defaults to the arguments passed by the caller)
     * @param {Boolean/Number} appendArgs (optional) if True args are appended to call args instead of overriding,
     * if a number the args are inserted at the specified position
     * @return {Function} The new function
     */
    bind: function(fn, scope, args, appendArgs) {
        if (arguments.length === 2) {
            return function() {
                return fn.apply(scope, arguments);
            };
        }

        var method = fn,
            slice = Array.prototype.slice;

        return function() {
            var callArgs = args || arguments;

            if (appendArgs === true) {
                callArgs = slice.call(arguments, 0);
                callArgs = callArgs.concat(args);
            }
            else if (typeof appendArgs == 'number') {
                callArgs = slice.call(arguments, 0); // copy arguments first
                Ext.Array.insert(callArgs, appendArgs, args);
            }

            return method.apply(scope || Ext.global, callArgs);
        };
    },

    /**
     * Create a new function from the provided `fn`, the arguments of which are pre-set to `args`.
     * New arguments passed to the newly created callback when it's invoked are appended after the pre-set ones.
     * This is especially useful when creating callbacks.
     *
     * For example:
     *
     *     var originalFunction = function(){
     *         alert(Ext.Array.from(arguments).join(' '));
     *     };
     *
     *     var callback = Ext.Function.pass(originalFunction, ['Hello', 'World']);
     *
     *     callback(); // alerts 'Hello World'
     *     callback('by Me'); // alerts 'Hello World by Me'
     *
     * {@link Ext#pass Ext.pass} is alias for {@link Ext.Function#pass Ext.Function.pass}
     *
     * @param {Function} fn The original function
     * @param {Array} args The arguments to pass to new callback
     * @param {Object} scope (optional) The scope (`this` reference) in which the function is executed.
     * @return {Function} The new callback function
     */
    pass: function(fn, args, scope) {
        if (!Ext.isArray(args)) {
            if (Ext.isIterable(args)) {
                args = Ext.Array.clone(args);
            } else {
                args = args !== undefined ? [args] : [];
            }
        }

        return function() {
            var fnArgs = [].concat(args);
            fnArgs.push.apply(fnArgs, arguments);
            return fn.apply(scope || this, fnArgs);
        };
    },

    /**
     * Create an alias to the provided method property with name `methodName` of `object`.
     * Note that the execution scope will still be bound to the provided `object` itself.
     *
     * @param {Object/Function} object
     * @param {String} methodName
     * @return {Function} aliasFn
     */
    alias: function(object, methodName) {
        return function() {
            return object[methodName].apply(object, arguments);
        };
    },

    /**
     * Create a "clone" of the provided method. The returned method will call the given
     * method passing along all arguments and the "this" pointer and return its result.
     *
     * @param {Function} method
     * @return {Function} cloneFn
     */
    clone: function(method) {
        return function() {
            return method.apply(this, arguments);
        };
    },

    /**
     * Creates an interceptor function. The passed function is called before the original one. If it returns false,
     * the original one is not called. The resulting function returns the results of the original function.
     * The passed function is called with the parameters of the original function. Example usage:
     *
     *     var sayHi = function(name){
     *         alert('Hi, ' + name);
     *     }
     *
     *     sayHi('Fred'); // alerts "Hi, Fred"
     *
     *     // create a new function that validates input without
     *     // directly modifying the original function:
     *     var sayHiToFriend = Ext.Function.createInterceptor(sayHi, function(name){
     *         return name == 'Brian';
     *     });
     *
     *     sayHiToFriend('Fred');  // no alert
     *     sayHiToFriend('Brian'); // alerts "Hi, Brian"
     *
     * @param {Function} origFn The original function.
     * @param {Function} newFn The function to call before the original
     * @param {Object} scope (optional) The scope (`this` reference) in which the passed function is executed.
     * **If omitted, defaults to the scope in which the original function is called or the browser window.**
     * @param {Object} returnValue (optional) The value to return if the passed function return false (defaults to null).
     * @return {Function} The new function
     */
    createInterceptor: function(origFn, newFn, scope, returnValue) {
        var method = origFn;
        if (!Ext.isFunction(newFn)) {
            return origFn;
        }
        else {
            return function() {
                var me = this,
                    args = arguments;
                newFn.target = me;
                newFn.method = origFn;
                return (newFn.apply(scope || me || Ext.global, args) !== false) ? origFn.apply(me || Ext.global, args) : returnValue || null;
            };
        }
    },

    /**
     * Creates a delegate (callback) which, when called, executes after a specific delay.
     *
     * @param {Function} fn The function which will be called on a delay when the returned function is called.
     * Optionally, a replacement (or additional) argument list may be specified.
     * @param {Number} delay The number of milliseconds to defer execution by whenever called.
     * @param {Object} scope (optional) The scope (`this` reference) used by the function at execution time.
     * @param {Array} args (optional) Override arguments for the call. (Defaults to the arguments passed by the caller)
     * @param {Boolean/Number} appendArgs (optional) if True args are appended to call args instead of overriding,
     * if a number the args are inserted at the specified position.
     * @return {Function} A function which, when called, executes the original function after the specified delay.
     */
    createDelayed: function(fn, delay, scope, args, appendArgs) {
        if (scope || args) {
            fn = Ext.Function.bind(fn, scope, args, appendArgs);
        }

        return function() {
            var me = this,
                args = Array.prototype.slice.call(arguments);

            setTimeout(function() {
                fn.apply(me, args);
            }, delay);
        };
    },

    /**
     * Calls this function after the number of millseconds specified, optionally in a specific scope. Example usage:
     *
     *     var sayHi = function(name){
     *         alert('Hi, ' + name);
     *     }
     *
     *     // executes immediately:
     *     sayHi('Fred');
     *
     *     // executes after 2 seconds:
     *     Ext.Function.defer(sayHi, 2000, this, ['Fred']);
     *
     *     // this syntax is sometimes useful for deferring
     *     // execution of an anonymous function:
     *     Ext.Function.defer(function(){
     *         alert('Anonymous');
     *     }, 100);
     *
     * {@link Ext#defer Ext.defer} is alias for {@link Ext.Function#defer Ext.Function.defer}
     *
     * @param {Function} fn The function to defer.
     * @param {Number} millis The number of milliseconds for the setTimeout call
     * (if less than or equal to 0 the function is executed immediately)
     * @param {Object} scope (optional) The scope (`this` reference) in which the function is executed.
     * **If omitted, defaults to the browser window.**
     * @param {Array} args (optional) Overrides arguments for the call. (Defaults to the arguments passed by the caller)
     * @param {Boolean/Number} appendArgs (optional) if True args are appended to call args instead of overriding,
     * if a number the args are inserted at the specified position
     * @return {Number} The timeout id that can be used with clearTimeout
     */
    defer: function(fn, millis, scope, args, appendArgs) {
        fn = Ext.Function.bind(fn, scope, args, appendArgs);
        if (millis > 0) {
            return setTimeout(Ext.supports.TimeoutActualLateness ? function () {
                fn();
            } : fn, millis);
        }
        fn();
        return 0;
    },

    /**
     * Create a combined function call sequence of the original function + the passed function.
     * The resulting function returns the results of the original function.
     * The passed function is called with the parameters of the original function. Example usage:
     *
     *     var sayHi = function(name){
     *         alert('Hi, ' + name);
     *     }
     *
     *     sayHi('Fred'); // alerts "Hi, Fred"
     *
     *     var sayGoodbye = Ext.Function.createSequence(sayHi, function(name){
     *         alert('Bye, ' + name);
     *     });
     *
     *     sayGoodbye('Fred'); // both alerts show
     *
     * @param {Function} originalFn The original function.
     * @param {Function} newFn The function to sequence
     * @param {Object} scope (optional) The scope (`this` reference) in which the passed function is executed.
     * If omitted, defaults to the scope in which the original function is called or the default global environment object (usually the browser window).
     * @return {Function} The new function
     */
    createSequence: function(originalFn, newFn, scope) {
        if (!newFn) {
            return originalFn;
        }
        else {
            return function() {
                var result = originalFn.apply(this, arguments);
                newFn.apply(scope || this, arguments);
                return result;
            };
        }
    },

    /**
     * Creates a delegate function, optionally with a bound scope which, when called, buffers
     * the execution of the passed function for the configured number of milliseconds.
     * If called again within that period, the impending invocation will be canceled, and the
     * timeout period will begin again.
     *
     * @param {Function} fn The function to invoke on a buffered timer.
     * @param {Number} buffer The number of milliseconds by which to buffer the invocation of the
     * function.
     * @param {Object} scope (optional) The scope (`this` reference) in which
     * the passed function is executed. If omitted, defaults to the scope specified by the caller.
     * @param {Array} args (optional) Override arguments for the call. Defaults to the arguments
     * passed by the caller.
     * @return {Function} A function which invokes the passed function after buffering for the specified time.
     */
    createBuffered: function(fn, buffer, scope, args) {
        var timerId;

        return function() {
            var callArgs = args || Array.prototype.slice.call(arguments, 0),
                me = scope || this;

            if (timerId) {
                clearTimeout(timerId);
            }

            timerId = setTimeout(function(){
                fn.apply(me, callArgs);
            }, buffer);
        };
    },

    /**
     * Creates a throttled version of the passed function which, when called repeatedly and
     * rapidly, invokes the passed function only after a certain interval has elapsed since the
     * previous invocation.
     *
     * This is useful for wrapping functions which may be called repeatedly, such as
     * a handler of a mouse move event when the processing is expensive.
     *
     * @param {Function} fn The function to execute at a regular time interval.
     * @param {Number} interval The interval **in milliseconds** on which the passed function is executed.
     * @param {Object} scope (optional) The scope (`this` reference) in which
     * the passed function is executed. If omitted, defaults to the scope specified by the caller.
     * @returns {Function} A function which invokes the passed function at the specified interval.
     */
    createThrottled: function(fn, interval, scope) {
        var lastCallTime, elapsed, lastArgs, timer, execute = function() {
            fn.apply(scope || this, lastArgs);
            lastCallTime = new Date().getTime();
        };

        return function() {
            elapsed = new Date().getTime() - lastCallTime;
            lastArgs = arguments;

            clearTimeout(timer);
            if (!lastCallTime || (elapsed >= interval)) {
                execute();
            } else {
                timer = setTimeout(execute, interval - elapsed);
            }
        };
    },


    /**
     * Adds behavior to an existing method that is executed before the
     * original behavior of the function.  For example:
     * 
     *     var soup = {
     *         contents: [],
     *         add: function(ingredient) {
     *             this.contents.push(ingredient);
     *         }
     *     };
     *     Ext.Function.interceptBefore(soup, "add", function(ingredient){
     *         if (!this.contents.length && ingredient !== "water") {
     *             // Always add water to start with
     *             this.contents.push("water");
     *         }
     *     });
     *     soup.add("onions");
     *     soup.add("salt");
     *     soup.contents; // will contain: water, onions, salt
     * 
     * @param {Object} object The target object
     * @param {String} methodName Name of the method to override
     * @param {Function} fn Function with the new behavior.  It will
     * be called with the same arguments as the original method.  The
     * return value of this function will be the return value of the
     * new method.
     * @param {Object} [scope] The scope to execute the interceptor function. Defaults to the object.
     * @return {Function} The new function just created.
     */
    interceptBefore: function(object, methodName, fn, scope) {
        var method = object[methodName] || Ext.emptyFn;

        return (object[methodName] = function() {
            var ret = fn.apply(scope || this, arguments);
            method.apply(this, arguments);

            return ret;
        });
    },

    /**
     * Adds behavior to an existing method that is executed after the
     * original behavior of the function.  For example:
     * 
     *     var soup = {
     *         contents: [],
     *         add: function(ingredient) {
     *             this.contents.push(ingredient);
     *         }
     *     };
     *     Ext.Function.interceptAfter(soup, "add", function(ingredient){
     *         // Always add a bit of extra salt
     *         this.contents.push("salt");
     *     });
     *     soup.add("water");
     *     soup.add("onions");
     *     soup.contents; // will contain: water, salt, onions, salt
     * 
     * @param {Object} object The target object
     * @param {String} methodName Name of the method to override
     * @param {Function} fn Function with the new behavior.  It will
     * be called with the same arguments as the original method.  The
     * return value of this function will be the return value of the
     * new method.
     * @param {Object} [scope] The scope to execute the interceptor function. Defaults to the object.
     * @return {Function} The new function just created.
     */
    interceptAfter: function(object, methodName, fn, scope) {
        var method = object[methodName] || Ext.emptyFn;

        return (object[methodName] = function() {
            method.apply(this, arguments);
            return fn.apply(scope || this, arguments);
        });
    }
};

/**
 * @method
 * @member Ext
 * @inheritdoc Ext.Function#defer
 */
Ext.defer = Ext.Function.alias(Ext.Function, 'defer');

/**
 * @method
 * @member Ext
 * @inheritdoc Ext.Function#pass
 */
Ext.pass = Ext.Function.alias(Ext.Function, 'pass');

/**
 * @method
 * @member Ext
 * @inheritdoc Ext.Function#bind
 */
Ext.bind = Ext.Function.alias(Ext.Function, 'bind');
 /**
 * @author Jacky Nguyen <jacky@sencha.com>
 * @docauthor Jacky Nguyen <jacky@sencha.com>
 * @class Ext.Base
 *
 * The root of all classes created with {@link Ext#define}.
 *
 * Ext.Base is the building block of all Ext classes. All classes in Ext inherit from Ext.Base.
 * All prototype and static members of this class are inherited by all other classes.
 */
(function(flexSetter) {

var noArgs = [],
    Base = function(){};

    // These static properties will be copied to every newly created class with {@link Ext#define}
    Ext.apply(Base, {
        $className: 'Ext.Base',

        $isClass: true,

        /**
         * Create a new instance of this Class.
         *
         *     Ext.define('My.cool.Class', {
         *         ...
         *     });
         *
         *     My.cool.Class.create({
         *         someConfig: true
         *     });
         *
         * All parameters are passed to the constructor of the class.
         *
         * @return {Object} the created instance.
         * @static
         * @inheritable
         */
        create: function() {
            return Ext.create.apply(Ext, [this].concat(Array.prototype.slice.call(arguments, 0)));
        },

        /**
         * @private
         * @param config
         */
        extend: function(parent) {
            var parentPrototype = parent.prototype,
                basePrototype, prototype, i, ln, name, statics;

            prototype = this.prototype = Ext.Object.chain(parentPrototype);
            prototype.self = this;

            this.superclass = prototype.superclass = parentPrototype;

            if (!parent.$isClass) {
                basePrototype = Ext.Base.prototype;

                for (i in basePrototype) {
                    if (i in prototype) {
                        prototype[i] = basePrototype[i];
                    }
                }
            }

            //<feature classSystem.inheritableStatics>
            // Statics inheritance
            statics = parentPrototype.$inheritableStatics;

            if (statics) {
                for (i = 0,ln = statics.length; i < ln; i++) {
                    name = statics[i];

                    if (!this.hasOwnProperty(name)) {
                        this[name] = parent[name];
                    }
                }
            }
            //</feature>

            if (parent.$onExtended) {
                this.$onExtended = parent.$onExtended.slice();
            }

            //<feature classSystem.config>
            prototype.config = new prototype.configClass();
            prototype.initConfigList = prototype.initConfigList.slice();
            prototype.initConfigMap = Ext.clone(prototype.initConfigMap);
            prototype.configMap = Ext.Object.chain(prototype.configMap);
            //</feature>
        },

        /**
         * @private
         */
        $onExtended: [],

        /**
         * @private
         */
        triggerExtended: function() {
            var callbacks = this.$onExtended,
                ln = callbacks.length,
                i, callback;

            if (ln > 0) {
                for (i = 0; i < ln; i++) {
                    callback = callbacks[i];
                    callback.fn.apply(callback.scope || this, arguments);
                }
            }
        },

        /**
         * @private
         */
        onExtended: function(fn, scope) {
            this.$onExtended.push({
                fn: fn,
                scope: scope
            });

            return this;
        },

        /**
         * @private
         * @param config
         */
        addConfig: function(config, fullMerge) {
            var prototype = this.prototype,
                configNameCache = Ext.Class.configNameCache,
                hasConfig = prototype.configMap,
                initConfigList = prototype.initConfigList,
                initConfigMap = prototype.initConfigMap,
                defaultConfig = prototype.config,
                initializedName, name, value;

            for (name in config) {
                if (config.hasOwnProperty(name)) {
                    if (!hasConfig[name]) {
                        hasConfig[name] = true;
                    }

                    value = config[name];

                    initializedName = configNameCache[name].initialized;

                    if (!initConfigMap[name] && value !== null && !prototype[initializedName]) {
                        initConfigMap[name] = true;
                        initConfigList.push(name);
                    }
                }
            }

            if (fullMerge) {
                Ext.merge(defaultConfig, config);
            }
            else {
                Ext.mergeIf(defaultConfig, config);
            }

            prototype.configClass = Ext.Object.classify(defaultConfig);
        },

        /**
         * Add / override static properties of this class.
         *
         *     Ext.define('My.cool.Class', {
         *         ...
         *     });
         *
         *     My.cool.Class.addStatics({
         *         someProperty: 'someValue',      // My.cool.Class.someProperty = 'someValue'
         *         method1: function() { ... },    // My.cool.Class.method1 = function() { ... };
         *         method2: function() { ... }     // My.cool.Class.method2 = function() { ... };
         *     });
         *
         * @param {Object} members
         * @return {Ext.Base} this
         * @static
         * @inheritable
         */
        addStatics: function(members) {
            var member, name;

            for (name in members) {
                if (members.hasOwnProperty(name)) {
                    member = members[name];
                    //<debug>
                    if (typeof member == 'function') {
                        member.displayName = Ext.getClassName(this) + '.' + name;
                    }
                    //</debug>
                    this[name] = member;
                }
            }

            return this;
        },

        /**
         * @private
         * @param {Object} members
         */
        addInheritableStatics: function(members) {
            var inheritableStatics,
                hasInheritableStatics,
                prototype = this.prototype,
                name, member;

            inheritableStatics = prototype.$inheritableStatics;
            hasInheritableStatics = prototype.$hasInheritableStatics;

            if (!inheritableStatics) {
                inheritableStatics = prototype.$inheritableStatics = [];
                hasInheritableStatics = prototype.$hasInheritableStatics = {};
            }

            for (name in members) {
                if (members.hasOwnProperty(name)) {
                    member = members[name];
                    //<debug>
                    if (typeof member == 'function') {
                        member.displayName = Ext.getClassName(this) + '.' + name;
                    }
                    //</debug>
                    this[name] = member;

                    if (!hasInheritableStatics[name]) {
                        hasInheritableStatics[name] = true;
                        inheritableStatics.push(name);
                    }
                }
            }

            return this;
        },

        /**
         * Add methods / properties to the prototype of this class.
         *
         *     Ext.define('My.awesome.Cat', {
         *         constructor: function() {
         *             ...
         *         }
         *     });
         *
         *      My.awesome.Cat.implement({
         *          meow: function() {
         *             alert('Meowww...');
         *          }
         *      });
         *
         *      var kitty = new My.awesome.Cat;
         *      kitty.meow();
         *
         * @param {Object} members
         * @static
         * @inheritable
         */
        addMembers: function(members) {
            var prototype = this.prototype,
                enumerables = Ext.enumerables,
                names = [],
                i, ln, name, member;

            for (name in members) {
                names.push(name);
            }

            if (enumerables) {
                names.push.apply(names, enumerables);
            }

            for (i = 0,ln = names.length; i < ln; i++) {
                name = names[i];

                if (members.hasOwnProperty(name)) {
                    member = members[name];

                    if (typeof member == 'function' && !member.$isClass && member !== Ext.emptyFn) {
                        member.$owner = this;
                        member.$name = name;
                        //<debug>
                        member.displayName = (this.$className || '') + '#' + name;
                        //</debug>
                    }

                    prototype[name] = member;
                }
            }

            return this;
        },

        /**
         * @private
         * @param name
         * @param member
         */
        addMember: function(name, member) {
            if (typeof member == 'function' && !member.$isClass && member !== Ext.emptyFn) {
                member.$owner = this;
                member.$name = name;
                //<debug>
                member.displayName = (this.$className || '') + '#' + name;
                //</debug>
            }

            this.prototype[name] = member;

            return this;
        },

        /**
         * @private
         */
        implement: function() {
            this.addMembers.apply(this, arguments);
        },

        /**
         * Borrow another class' members to the prototype of this class.
         *
         *     Ext.define('Bank', {
         *         money: '$$$',
         *         printMoney: function() {
         *             alert('$$$$$$$');
         *         }
         *     });
         *
         *     Ext.define('Thief', {
         *         ...
         *     });
         *
         *     Thief.borrow(Bank, ['money', 'printMoney']);
         *
         *     var steve = new Thief();
         *
         *     alert(steve.money); // alerts '$$$'
         *     steve.printMoney(); // alerts '$$$$$$$'
         *
         * @param {Ext.Base} fromClass The class to borrow members from
         * @param {Array/String} members The names of the members to borrow
         * @return {Ext.Base} this
         * @static
         * @inheritable
         * @private
         */
        borrow: function(fromClass, members) {
            var prototype = this.prototype,
                fromPrototype = fromClass.prototype,
                //<debug>
                className = Ext.getClassName(this),
                //</debug>
                i, ln, name, fn, toBorrow;

            members = Ext.Array.from(members);

            for (i = 0,ln = members.length; i < ln; i++) {
                name = members[i];

                toBorrow = fromPrototype[name];

                if (typeof toBorrow == 'function') {
                    fn = Ext.Function.clone(toBorrow);

                    //<debug>
                    if (className) {
                        fn.displayName = className + '#' + name;
                    }
                    //</debug>

                    fn.$owner = this;
                    fn.$name = name;

                    prototype[name] = fn;
                }
                else {
                    prototype[name] = toBorrow;
                }
            }

            return this;
        },

        /**
         * Override members of this class. Overridden methods can be invoked via
         * {@link Ext.Base#callParent}.
         *
         *     Ext.define('My.Cat', {
         *         constructor: function() {
         *             alert("I'm a cat!");
         *         }
         *     });
         *
         *     My.Cat.override({
         *         constructor: function() {
         *             alert("I'm going to be a cat!");
         *
         *             this.callParent(arguments);
         *
         *             alert("Meeeeoooowwww");
         *         }
         *     });
         *
         *     var kitty = new My.Cat(); // alerts "I'm going to be a cat!"
         *                               // alerts "I'm a cat!"
         *                               // alerts "Meeeeoooowwww"
         *
         * As of 4.1, direct use of this method is deprecated. Use {@link Ext#define Ext.define}
         * instead:
         *
         *     Ext.define('My.CatOverride', {
         *         override: 'My.Cat',
         *         constructor: function() {
         *             alert("I'm going to be a cat!");
         *
         *             this.callParent(arguments);
         *
         *             alert("Meeeeoooowwww");
         *         }
         *     });
         *
         * The above accomplishes the same result but can be managed by the {@link Ext.Loader}
         * which can properly order the override and its target class and the build process
         * can determine whether the override is needed based on the required state of the
         * target class (My.Cat).
         *
         * @param {Object} members The properties to add to this class. This should be
         * specified as an object literal containing one or more properties.
         * @return {Ext.Base} this class
         * @static
         * @inheritable
         * @markdown
         * @deprecated 4.1.0 Use {@link Ext#define Ext.define} instead
         */
        override: function(members) {
            var me = this,
                enumerables = Ext.enumerables,
                target = me.prototype,
                cloneFunction = Ext.Function.clone,
                name, index, member, statics, names, previous;

            if (arguments.length === 2) {
                name = members;
                members = {};
                members[name] = arguments[1];
                enumerables = null;
            }

            do {
                names = []; // clean slate for prototype (1st pass) and static (2nd pass)
                statics = null; // not needed 1st pass, but needs to be cleared for 2nd pass

                for (name in members) { // hasOwnProperty is checked in the next loop...
                    if (name == 'statics') {
                        statics = members[name];
                    } else if (name == 'config') {
                        me.addConfig(members[name], true);
                    } else {
                        names.push(name);
                    }
                }

                if (enumerables) {
                    names.push.apply(names, enumerables);
                }

                for (index = names.length; index--; ) {
                    name = names[index];

                    if (members.hasOwnProperty(name)) {
                        member = members[name];

                        if (typeof member == 'function' && !member.$className && member !== Ext.emptyFn) {
                            if (typeof member.$owner != 'undefined') {
                                member = cloneFunction(member);
                            }

                            //<debug>
                            if (me.$className) {
                                member.displayName = me.$className + '#' + name;
                            }
                            //</debug>

                            member.$owner = me;
                            member.$name = name;

                            previous = target[name];
                            if (previous) {
                                member.$previous = previous;
                            }
                        }

                        target[name] = member;
                    }
                }

                target = me; // 2nd pass is for statics
                members = statics; // statics will be null on 2nd pass
            } while (members);

            return this;
        },

        // Documented downwards
        callParent: function(args) {
            var method;

            // This code is intentionally inlined for the least number of debugger stepping
            return (method = this.callParent.caller) && (method.$previous ||
                  ((method = method.$owner ? method : method.caller) &&
                        method.$owner.superclass.$class[method.$name])).apply(this, args || noArgs);
        },

        //<feature classSystem.mixins>
        /**
         * Used internally by the mixins pre-processor
         * @private
         * @inheritable
         */
        mixin: function(name, mixinClass) {
            var mixin = mixinClass.prototype,
                prototype = this.prototype,
                key;

            if (typeof mixin.onClassMixedIn != 'undefined') {
                mixin.onClassMixedIn.call(mixinClass, this);
            }

            if (!prototype.hasOwnProperty('mixins')) {
                if ('mixins' in prototype) {
                    prototype.mixins = Ext.Object.chain(prototype.mixins);
                }
                else {
                    prototype.mixins = {};
                }
            }

            for (key in mixin) {
                if (key === 'mixins') {
                    Ext.merge(prototype.mixins, mixin[key]);
                }
                else if (typeof prototype[key] == 'undefined' && key != 'mixinId' && key != 'config') {
                    prototype[key] = mixin[key];
                }
            }

            //<feature classSystem.config>
            if ('config' in mixin) {
                this.addConfig(mixin.config, false);
            }
            //</feature>

            prototype.mixins[name] = mixin;
        },
        //</feature>

        /**
         * Get the current class' name in string format.
         *
         *     Ext.define('My.cool.Class', {
         *         constructor: function() {
         *             alert(this.self.getName()); // alerts 'My.cool.Class'
         *         }
         *     });
         *
         *     My.cool.Class.getName(); // 'My.cool.Class'
         *
         * @return {String} className
         * @static
         * @inheritable
         */
        getName: function() {
            return Ext.getClassName(this);
        },

        /**
         * Create aliases for existing prototype methods. Example:
         *
         *     Ext.define('My.cool.Class', {
         *         method1: function() { ... },
         *         method2: function() { ... }
         *     });
         *
         *     var test = new My.cool.Class();
         *
         *     My.cool.Class.createAlias({
         *         method3: 'method1',
         *         method4: 'method2'
         *     });
         *
         *     test.method3(); // test.method1()
         *
         *     My.cool.Class.createAlias('method5', 'method3');
         *
         *     test.method5(); // test.method3() -> test.method1()
         *
         * @param {String/Object} alias The new method name, or an object to set multiple aliases. See
         * {@link Ext.Function#flexSetter flexSetter}
         * @param {String/Object} origin The original method name
         * @static
         * @inheritable
         * @method
         */
        createAlias: flexSetter(function(alias, origin) {
            this.override(alias, function() {
                return this[origin].apply(this, arguments);
            });
        }),

        /**
         * @private
         */
        addXtype: function(xtype) {
            var prototype = this.prototype,
                xtypesMap = prototype.xtypesMap,
                xtypes = prototype.xtypes,
                xtypesChain = prototype.xtypesChain;

            if (!prototype.hasOwnProperty('xtypesMap')) {
                xtypesMap = prototype.xtypesMap = Ext.merge({}, prototype.xtypesMap || {});
                xtypes = prototype.xtypes = prototype.xtypes ? [].concat(prototype.xtypes) : [];
                xtypesChain = prototype.xtypesChain = prototype.xtypesChain ? [].concat(prototype.xtypesChain) : [];
                prototype.xtype = xtype;
            }

            if (!xtypesMap[xtype]) {
                xtypesMap[xtype] = true;
                xtypes.push(xtype);
                xtypesChain.push(xtype);
                Ext.ClassManager.setAlias(this, 'widget.' + xtype);
            }

            return this;
        }
    });

    Base.implement({
        isInstance: true,

        $className: 'Ext.Base',

        configClass: Ext.emptyFn,

        initConfigList: [],

        configMap: {},

        initConfigMap: {},

        /**
         * Get the reference to the class from which this object was instantiated. Note that unlike {@link Ext.Base#self},
         * `this.statics()` is scope-independent and it always returns the class from which it was called, regardless of what
         * `this` points to during run-time
         *
         *     Ext.define('My.Cat', {
         *         statics: {
         *             totalCreated: 0,
         *             speciesName: 'Cat' // My.Cat.speciesName = 'Cat'
         *         },
         *
         *         constructor: function() {
         *             var statics = this.statics();
         *
         *             alert(statics.speciesName);     // always equals to 'Cat' no matter what 'this' refers to
         *                                             // equivalent to: My.Cat.speciesName
         *
         *             alert(this.self.speciesName);   // dependent on 'this'
         *
         *             statics.totalCreated++;
         *         },
         *
         *         clone: function() {
         *             var cloned = new this.self;                      // dependent on 'this'
         *
         *             cloned.groupName = this.statics().speciesName;   // equivalent to: My.Cat.speciesName
         *
         *             return cloned;
         *         }
         *     });
         *
         *
         *     Ext.define('My.SnowLeopard', {
         *         extend: 'My.Cat',
         *
         *         statics: {
         *             speciesName: 'Snow Leopard'     // My.SnowLeopard.speciesName = 'Snow Leopard'
         *         },
         *
         *         constructor: function() {
         *             this.callParent();
         *         }
         *     });
         *
         *     var cat = new My.Cat();                 // alerts 'Cat', then alerts 'Cat'
         *
         *     var snowLeopard = new My.SnowLeopard(); // alerts 'Cat', then alerts 'Snow Leopard'
         *
         *     var clone = snowLeopard.clone();
         *     alert(Ext.getClassName(clone));         // alerts 'My.SnowLeopard'
         *     alert(clone.groupName);                 // alerts 'Cat'
         *
         *     alert(My.Cat.totalCreated);             // alerts 3
         *
         * @protected
         * @return {Ext.Class}
         */
        statics: function() {
            var method = this.statics.caller,
                self = this.self;

            if (!method) {
                return self;
            }

            return method.$owner;
        },

        /**
         * Call the "parent" method of the current method. That is the method previously
         * overridden by derivation or by an override (see {@link Ext#define}).
         *
         *      Ext.define('My.Base', {
         *          constructor: function (x) {
         *              this.x = x;
         *          },
         *
         *          statics: {
         *              method: function (x) {
         *                  return x;
         *              }
         *          }
         *      });
         *
         *      Ext.define('My.Derived', {
         *          extend: 'My.Base',
         *
         *          constructor: function () {
         *              this.callParent([21]);
         *          }
         *      });
         *
         *      var obj = new My.Derived();
         *
         *      alert(obj.x);  // alerts 21
         *
         * This can be used with an override as follows:
         *
         *      Ext.define('My.DerivedOverride', {
         *          override: 'My.Derived',
         *
         *          constructor: function (x) {
         *              this.callParent([x*2]); // calls original My.Derived constructor
         *          }
         *      });
         *
         *      var obj = new My.Derived();
         *
         *      alert(obj.x);  // now alerts 42
         *
         * This also works with static methods.
         *
         *      Ext.define('My.Derived2', {
         *          extend: 'My.Base',
         *
         *          statics: {
         *              method: function (x) {
         *                  return this.callParent([x*2]); // calls My.Base.method
         *              }
         *          }
         *      });
         *
         *      alert(My.Base.method(10);     // alerts 10
         *      alert(My.Derived2.method(10); // alerts 20
         *
         * Lastly, it also works with overridden static methods.
         *
         *      Ext.define('My.Derived2Override', {
         *          override: 'My.Derived2',
         *
         *          statics: {
         *              method: function (x) {
         *                  return this.callParent([x*2]); // calls My.Derived2.method
         *              }
         *          }
         *      });
         *
         *      alert(My.Derived2.method(10); // now alerts 40
         *
         * @protected
         * @param {Array/Arguments} args The arguments, either an array or the `arguments` object
         * from the current method, for example: `this.callParent(arguments)`
         * @return {Object} Returns the result of calling the parent method
         */
        callParent: function(args) {
            // NOTE: this code is deliberately as few expressions (and no function calls)
            // as possible so that a debugger can skip over this noise with the minimum number
            // of steps. Basically, just hit Step Into until you are where you really wanted
            // to be.
            var method,
                superMethod = (method = this.callParent.caller) && (method.$previous ||
                        ((method = method.$owner ? method : method.caller) &&
                                method.$owner.superclass[method.$name]));

            //<debug error>
            if (!superMethod) {
                method = this.callParent.caller;
                var parentClass, methodName;

                if (!method.$owner) {
                    if (!method.caller) {
                        throw new Error("Attempting to call a protected method from the public scope, which is not allowed");
                    }

                    method = method.caller;
                }

                parentClass = method.$owner.superclass;
                methodName = method.$name;

                if (!(methodName in parentClass)) {
                    throw new Error("this.callParent() was called but there's no such method (" + methodName +
                                ") found in the parent class (" + (Ext.getClassName(parentClass) || 'Object') + ")");
                }
            }
            //</debug>

            return superMethod.apply(this, args || noArgs);
        },

        /**
         * @property {Ext.Class} self
         *
         * Get the reference to the current class from which this object was instantiated. Unlike {@link Ext.Base#statics},
         * `this.self` is scope-dependent and it's meant to be used for dynamic inheritance. See {@link Ext.Base#statics}
         * for a detailed comparison
         *
         *     Ext.define('My.Cat', {
         *         statics: {
         *             speciesName: 'Cat' // My.Cat.speciesName = 'Cat'
         *         },
         *
         *         constructor: function() {
         *             alert(this.self.speciesName); // dependent on 'this'
         *         },
         *
         *         clone: function() {
         *             return new this.self();
         *         }
         *     });
         *
         *
         *     Ext.define('My.SnowLeopard', {
         *         extend: 'My.Cat',
         *         statics: {
         *             speciesName: 'Snow Leopard'         // My.SnowLeopard.speciesName = 'Snow Leopard'
         *         }
         *     });
         *
         *     var cat = new My.Cat();                     // alerts 'Cat'
         *     var snowLeopard = new My.SnowLeopard();     // alerts 'Snow Leopard'
         *
         *     var clone = snowLeopard.clone();
         *     alert(Ext.getClassName(clone));             // alerts 'My.SnowLeopard'
         *
         * @protected
         */
        self: Base,

        // Default constructor, simply returns `this`
        constructor: function() {
            return this;
        },

        //<feature classSystem.config>
        /**
         * Initialize configuration for this class. a typical example:
         *
         *     Ext.define('My.awesome.Class', {
         *         // The default config
         *         config: {
         *             name: 'Awesome',
         *             isAwesome: true
         *         },
         *
         *         constructor: function(config) {
         *             this.initConfig(config);
         *         }
         *     });
         *
         *     var awesome = new My.awesome.Class({
         *         name: 'Super Awesome'
         *     });
         *
         *     alert(awesome.getName()); // 'Super Awesome'
         *
         * @protected
         * @param {Object} config
         * @return {Object} mixins The mixin prototypes as key - value pairs
         */
        initConfig: function(config) {
            var instanceConfig = config,
                configNameCache = Ext.Class.configNameCache,
                defaultConfig = new this.configClass(),
                defaultConfigList = this.initConfigList,
                hasConfig = this.configMap,
                nameMap, i, ln, name, initializedName;

            this.initConfig = Ext.emptyFn;

            this.initialConfig = instanceConfig || {};

            this.config = config = (instanceConfig) ? Ext.merge(defaultConfig, config) : defaultConfig;

            if (instanceConfig) {
                defaultConfigList = defaultConfigList.slice();

                for (name in instanceConfig) {
                    if (hasConfig[name]) {
                        if (instanceConfig[name] !== null) {
                            defaultConfigList.push(name);
                            this[configNameCache[name].initialized] = false;
                        }
                    }
                }
            }

            for (i = 0,ln = defaultConfigList.length; i < ln; i++) {
                name = defaultConfigList[i];
                nameMap = configNameCache[name];
                initializedName = nameMap.initialized;

                if (!this[initializedName]) {
                    this[initializedName] = true;
                    this[nameMap.set].call(this, config[name]);
                }
            }

            return this;
        },

        /**
         * @private
         * @param config
         */
        hasConfig: function(name) {
            return Boolean(this.configMap[name]);
        },

        /**
         * @private
         */
        setConfig: function(config, applyIfNotSet) {
            if (!config) {
                return this;
            }

            var configNameCache = Ext.Class.configNameCache,
                currentConfig = this.config,
                hasConfig = this.configMap,
                initialConfig = this.initialConfig,
                name, value;

            applyIfNotSet = Boolean(applyIfNotSet);

            for (name in config) {
                if (applyIfNotSet && initialConfig.hasOwnProperty(name)) {
                    continue;
                }

                value = config[name];
                currentConfig[name] = value;

                if (hasConfig[name]) {
                    this[configNameCache[name].set](value);
                }
            }

            return this;
        },

        /**
         * @private
         * @param name
         */
        getConfig: function(name) {
            var configNameCache = Ext.Class.configNameCache;

            return this[configNameCache[name].get]();
        },

        /**
         *
         * @param name
         */
        getInitialConfig: function(name) {
            var config = this.config;

            if (!name) {
                return config;
            }
            else {
                return config[name];
            }
        },

        /**
         * @private
         * @param names
         * @param callback
         * @param scope
         */
        onConfigUpdate: function(names, callback, scope) {
            var self = this.self,
                //<debug>
                className = self.$className,
                //</debug>
                i, ln, name,
                updaterName, updater, newUpdater;

            names = Ext.Array.from(names);

            scope = scope || this;

            for (i = 0,ln = names.length; i < ln; i++) {
                name = names[i];
                updaterName = 'update' + Ext.String.capitalize(name);
                updater = this[updaterName] || Ext.emptyFn;
                newUpdater = function() {
                    updater.apply(this, arguments);
                    scope[callback].apply(scope, arguments);
                };
                newUpdater.$name = updaterName;
                newUpdater.$owner = self;
                //<debug>
                newUpdater.displayName = className + '#' + updaterName;
                //</debug>

                this[updaterName] = newUpdater;
            }
        },
        //</feature>

        destroy: function() {
            this.destroy = Ext.emptyFn;
        }
    });

    /**
     * Call the original method that was previously overridden with {@link Ext.Base#override}
     *
     *     Ext.define('My.Cat', {
     *         constructor: function() {
     *             alert("I'm a cat!");
     *         }
     *     });
     *
     *     My.Cat.override({
     *         constructor: function() {
     *             alert("I'm going to be a cat!");
     *
     *             this.callOverridden();
     *
     *             alert("Meeeeoooowwww");
     *         }
     *     });
     *
     *     var kitty = new My.Cat(); // alerts "I'm going to be a cat!"
     *                               // alerts "I'm a cat!"
     *                               // alerts "Meeeeoooowwww"
     *
     * @param {Array/Arguments} args The arguments, either an array or the `arguments` object
     * from the current method, for example: `this.callOverridden(arguments)`
     * @return {Object} Returns the result of calling the overridden method
     * @protected
     * @deprecated as of 4.1. Use {@link #callParent} instead.
     */
    Base.prototype.callOverridden = Base.prototype.callParent;

    Ext.Base = Base;

}(Ext.Function.flexSetter));
 /**
 * @author Jacky Nguyen <jacky@sencha.com>
 * @docauthor Jacky Nguyen <jacky@sencha.com>
 * @class Ext.Class
 *
 * Handles class creation throughout the framework. This is a low level factory that is used by Ext.ClassManager and generally
 * should not be used directly. If you choose to use Ext.Class you will lose out on the namespace, aliasing and depency loading
 * features made available by Ext.ClassManager. The only time you would use Ext.Class directly is to create an anonymous class.
 *
 * If you wish to create a class you should use {@link Ext#define Ext.define} which aliases
 * {@link Ext.ClassManager#create Ext.ClassManager.create} to enable namespacing and dynamic dependency resolution.
 *
 * Ext.Class is the factory and **not** the superclass of everything. For the base class that **all** Ext classes inherit
 * from, see {@link Ext.Base}.
 */
(function() {
    var ExtClass,
        Base = Ext.Base,
        baseStaticMembers = [],
        baseStaticMember, baseStaticMemberLength;

    for (baseStaticMember in Base) {
        if (Base.hasOwnProperty(baseStaticMember)) {
            baseStaticMembers.push(baseStaticMember);
        }
    }

    baseStaticMemberLength = baseStaticMembers.length;

    // Creates a constructor that has nothing extra in its scope chain.
    function makeCtor (className) {
        function constructor () {
            // Opera has some problems returning from a constructor when Dragonfly isn't running. The || null seems to
            // be sufficient to stop it misbehaving. Known to be required against 10.53, 11.51 and 11.61.
            return this.constructor.apply(this, arguments) || null;
        }
        //<debug>
        if (className) {
            constructor.displayName = className;
        }
        //</debug>
        return constructor;
    }

    /**
     * @method constructor
     * Create a new anonymous class.
     *
     * @param {Object} data An object represent the properties of this class
     * @param {Function} onCreated Optional, the callback function to be executed when this class is fully created.
     * Note that the creation process can be asynchronous depending on the pre-processors used.
     *
     * @return {Ext.Base} The newly created class
     */
    Ext.Class = ExtClass = function(Class, data, onCreated) {
        if (typeof Class != 'function') {
            onCreated = data;
            data = Class;
            Class = null;
        }

        if (!data) {
            data = {};
        }

        Class = ExtClass.create(Class, data);

        ExtClass.process(Class, data, onCreated);

        return Class;
    };

    Ext.apply(ExtClass, {
        /**
         * @private
         * @param Class
         * @param data
         * @param hooks
         */
        onBeforeCreated: function(Class, data, hooks) {
            Class.addMembers(data);

            hooks.onCreated.call(Class, Class);
        },

        /**
         * @private
         * @param Class
         * @param classData
         * @param onClassCreated
         */
        create: function(Class, data) {
            var name, i;

            if (!Class) {
                // This "helped" a bit in IE8 when we create 450k instances (3400ms->2700ms),
                // but removes some flexibility as a result because overrides cannot override
                // the constructor method... kept in case we want to reconsider because it is
                // more involved than just use the pass 'constructor'
                //
                //if (data.hasOwnProperty('constructor')) {
                //    Class = data.constructor;
                //    delete data.constructor;
                //    Class.$owner = Class;
                //    Class.$name = 'constructor';
                //} else {
                Class = makeCtor(
                    //<debug>
                    data.$className
                    //</debug>
                );
                //}
            }

            for (i = 0; i < baseStaticMemberLength; i++) {
                name = baseStaticMembers[i];
                Class[name] = Base[name];
            }

            return Class;
        },

        /**
         * @private
         * @param Class
         * @param data
         * @param onCreated
         */
        process: function(Class, data, onCreated) {
            var preprocessorStack = data.preprocessors || ExtClass.defaultPreprocessors,
                registeredPreprocessors = this.preprocessors,
                hooks = {
                    onBeforeCreated: this.onBeforeCreated
                },
                preprocessors = [],
                preprocessor, preprocessorsProperties,
                i, ln, j, subLn, preprocessorProperty, process;

            delete data.preprocessors;

            for (i = 0,ln = preprocessorStack.length; i < ln; i++) {
                preprocessor = preprocessorStack[i];

                if (typeof preprocessor == 'string') {
                    preprocessor = registeredPreprocessors[preprocessor];
                    preprocessorsProperties = preprocessor.properties;

                    if (preprocessorsProperties === true) {
                        preprocessors.push(preprocessor.fn);
                    }
                    else if (preprocessorsProperties) {
                        for (j = 0,subLn = preprocessorsProperties.length; j < subLn; j++) {
                            preprocessorProperty = preprocessorsProperties[j];

                            if (data.hasOwnProperty(preprocessorProperty)) {
                                preprocessors.push(preprocessor.fn);
                                break;
                            }
                        }
                    }
                }
                else {
                    preprocessors.push(preprocessor);
                }
            }

            hooks.onCreated = onCreated ? onCreated : Ext.emptyFn;
            hooks.preprocessors = preprocessors;

            this.doProcess(Class, data, hooks);
        },
        
        doProcess: function(Class, data, hooks){
            var me = this,
                preprocessor = hooks.preprocessors.shift();

            if (!preprocessor) {
                hooks.onBeforeCreated.apply(me, arguments);
                return;
            }

            if (preprocessor.call(me, Class, data, hooks, me.doProcess) !== false) {
                me.doProcess(Class, data, hooks);
            }
        },

        /** @private */
        preprocessors: {},

        /**
         * Register a new pre-processor to be used during the class creation process
         *
         * @param {String} name The pre-processor's name
         * @param {Function} fn The callback function to be executed. Typical format:
         *
         *     function(cls, data, fn) {
         *         // Your code here
         *
         *         // Execute this when the processing is finished.
         *         // Asynchronous processing is perfectly ok
         *         if (fn) {
         *             fn.call(this, cls, data);
         *         }
         *     });
         *
         * @param {Function} fn.cls The created class
         * @param {Object} fn.data The set of properties passed in {@link Ext.Class} constructor
         * @param {Function} fn.fn The callback function that **must** to be executed when this
         * pre-processor finishes, regardless of whether the processing is synchronous or aynchronous.
         * @return {Ext.Class} this
         * @private
         * @static
         */
        registerPreprocessor: function(name, fn, properties, position, relativeTo) {
            if (!position) {
                position = 'last';
            }

            if (!properties) {
                properties = [name];
            }

            this.preprocessors[name] = {
                name: name,
                properties: properties || false,
                fn: fn
            };

            this.setDefaultPreprocessorPosition(name, position, relativeTo);

            return this;
        },

        /**
         * Retrieve a pre-processor callback function by its name, which has been registered before
         *
         * @param {String} name
         * @return {Function} preprocessor
         * @private
         * @static
         */
        getPreprocessor: function(name) {
            return this.preprocessors[name];
        },

        /**
         * @private
         */
        getPreprocessors: function() {
            return this.preprocessors;
        },

        /**
         * @private
         */
        defaultPreprocessors: [],

        /**
         * Retrieve the array stack of default pre-processors
         * @return {Function[]} defaultPreprocessors
         * @private
         * @static
         */
        getDefaultPreprocessors: function() {
            return this.defaultPreprocessors;
        },

        /**
         * Set the default array stack of default pre-processors
         *
         * @private
         * @param {Array} preprocessors
         * @return {Ext.Class} this
         * @static
         */
        setDefaultPreprocessors: function(preprocessors) {
            this.defaultPreprocessors = Ext.Array.from(preprocessors);

            return this;
        },

        /**
         * Insert this pre-processor at a specific position in the stack, optionally relative to
         * any existing pre-processor. For example:
         *
         *     Ext.Class.registerPreprocessor('debug', function(cls, data, fn) {
         *         // Your code here
         *
         *         if (fn) {
         *             fn.call(this, cls, data);
         *         }
         *     }).setDefaultPreprocessorPosition('debug', 'last');
         *
         * @private
         * @param {String} name The pre-processor name. Note that it needs to be registered with
         * {@link Ext#registerPreprocessor registerPreprocessor} before this
         * @param {String} offset The insertion position. Four possible values are:
         * 'first', 'last', or: 'before', 'after' (relative to the name provided in the third argument)
         * @param {String} relativeName
         * @return {Ext.Class} this
         * @static
         */
        setDefaultPreprocessorPosition: function(name, offset, relativeName) {
            var defaultPreprocessors = this.defaultPreprocessors,
                index;

            if (typeof offset == 'string') {
                if (offset === 'first') {
                    defaultPreprocessors.unshift(name);

                    return this;
                }
                else if (offset === 'last') {
                    defaultPreprocessors.push(name);

                    return this;
                }

                offset = (offset === 'after') ? 1 : -1;
            }

            index = Ext.Array.indexOf(defaultPreprocessors, relativeName);

            if (index !== -1) {
                Ext.Array.splice(defaultPreprocessors, Math.max(0, index + offset), 0, name);
            }

            return this;
        },

        configNameCache: {},

        getConfigNameMap: function(name) {
            var cache = this.configNameCache,
                map = cache[name],
                capitalizedName;

            if (!map) {
                capitalizedName = name.charAt(0).toUpperCase() + name.substr(1);

                map = cache[name] = {
                    internal: name,
                    initialized: '_is' + capitalizedName + 'Initialized',
                    apply: 'apply' + capitalizedName,
                    update: 'update' + capitalizedName,
                    'set': 'set' + capitalizedName,
                    'get': 'get' + capitalizedName,
                    doSet : 'doSet' + capitalizedName,
                    changeEvent: name.toLowerCase() + 'change'
                };
            }

            return map;
        }
    });

    /**
     * @cfg {String} extend
     * The parent class that this class extends. For example:
     *
     *     Ext.define('Person', {
     *         say: function(text) { alert(text); }
     *     });
     *
     *     Ext.define('Developer', {
     *         extend: 'Person',
     *         say: function(text) { this.callParent(["print "+text]); }
     *     });
     */
    ExtClass.registerPreprocessor('extend', function(Class, data) {
        var Base = Ext.Base,
            basePrototype = Base.prototype,
            extend = data.extend,
            Parent, parentPrototype, i;

        delete data.extend;

        if (extend && extend !== Object) {
            Parent = extend;
        }
        else {
            Parent = Base;
        }

        parentPrototype = Parent.prototype;

        if (!Parent.$isClass) {
            for (i in basePrototype) {
                if (!parentPrototype[i]) {
                    parentPrototype[i] = basePrototype[i];
                }
            }
        }

        Class.extend(Parent);

        Class.triggerExtended.apply(Class, arguments);

        if (data.onClassExtended) {
            Class.onExtended(data.onClassExtended, Class);
            delete data.onClassExtended;
        }

    }, true);

    //<feature classSystem.statics>
    /**
     * @cfg {Object} statics
     * List of static methods for this class. For example:
     *
     *     Ext.define('Computer', {
     *          statics: {
     *              factory: function(brand) {
     *                  // 'this' in static methods refer to the class itself
     *                  return new this(brand);
     *              }
     *          },
     *
     *          constructor: function() { ... }
     *     });
     *
     *     var dellComputer = Computer.factory('Dell');
     */
    ExtClass.registerPreprocessor('statics', function(Class, data) {
        Class.addStatics(data.statics);

        delete data.statics;
    });
    //</feature>

    //<feature classSystem.inheritableStatics>
    /**
     * @cfg {Object} inheritableStatics
     * List of inheritable static methods for this class.
     * Otherwise just like {@link #statics} but subclasses inherit these methods.
     */
    ExtClass.registerPreprocessor('inheritableStatics', function(Class, data) {
        Class.addInheritableStatics(data.inheritableStatics);

        delete data.inheritableStatics;
    });
    //</feature>

    //<feature classSystem.config>
    /**
     * @cfg {Object} config
     * List of configuration options with their default values, for which automatically
     * accessor methods are generated.  For example:
     *
     *     Ext.define('SmartPhone', {
     *          config: {
     *              hasTouchScreen: false,
     *              operatingSystem: 'Other',
     *              price: 500
     *          },
     *          constructor: function(cfg) {
     *              this.initConfig(cfg);
     *          }
     *     });
     *
     *     var iPhone = new SmartPhone({
     *          hasTouchScreen: true,
     *          operatingSystem: 'iOS'
     *     });
     *
     *     iPhone.getPrice(); // 500;
     *     iPhone.getOperatingSystem(); // 'iOS'
     *     iPhone.getHasTouchScreen(); // true;
     */
    ExtClass.registerPreprocessor('config', function(Class, data) {
        var config = data.config,
            prototype = Class.prototype;

        delete data.config;

        Ext.Object.each(config, function(name, value) {
            var nameMap = ExtClass.getConfigNameMap(name),
                internalName = nameMap.internal,
                initializedName = nameMap.initialized,
                applyName = nameMap.apply,
                updateName = nameMap.update,
                setName = nameMap.set,
                getName = nameMap.get,
                hasOwnSetter = (setName in prototype) || data.hasOwnProperty(setName),
                hasOwnApplier = (applyName in prototype) || data.hasOwnProperty(applyName),
                hasOwnUpdater = (updateName in prototype) || data.hasOwnProperty(updateName),
                optimizedGetter, customGetter;

            if (value === null || (!hasOwnSetter && !hasOwnApplier && !hasOwnUpdater)) {
                prototype[internalName] = value;
                prototype[initializedName] = true;
            }
            else {
                prototype[initializedName] = false;
            }

            if (!hasOwnSetter) {
                data[setName] = function(value) {
                    var oldValue = this[internalName],
                        applier = this[applyName],
                        updater = this[updateName];

                    if (!this[initializedName]) {
                        this[initializedName] = true;
                    }

                    if (applier) {
                        value = applier.call(this, value, oldValue);
                    }

                    if (typeof value != 'undefined') {
                        this[internalName] = value;

                        if (updater && value !== oldValue) {
                            updater.call(this, value, oldValue);
                        }
                    }

                    return this;
                };
            }

            if (!(getName in prototype) || data.hasOwnProperty(getName)) {
                customGetter = data[getName] || false;

                if (customGetter) {
                    optimizedGetter = function() {
                        return customGetter.apply(this, arguments);
                    };
                }
                else {
                    optimizedGetter = function() {
                        return this[internalName];
                    };
                }

                data[getName] = function() {
                    var currentGetter;

                    if (!this[initializedName]) {
                        this[initializedName] = true;
                        this[setName](this.config[name]);
                    }

                    currentGetter = this[getName];

                    if ('$previous' in currentGetter) {
                        currentGetter.$previous = optimizedGetter;
                    }
                    else {
                        this[getName] = optimizedGetter;
                    }

                    return optimizedGetter.apply(this, arguments);
                };
            }
        });

        Class.addConfig(config, true);
    });
    //</feature>

    //<feature classSystem.mixins>
    /**
     * @cfg {String[]/Object} mixins
     * List of classes to mix into this class. For example:
     *
     *     Ext.define('CanSing', {
     *          sing: function() {
     *              alert("I'm on the highway to hell...")
     *          }
     *     });
     *
     *     Ext.define('Musician', {
     *          mixins: ['CanSing']
     *     })
     *
     * In this case the Musician class will get a `sing` method from CanSing mixin.
     *
     * But what if the Musician already has a `sing` method? Or you want to mix
     * in two classes, both of which define `sing`?  In such a cases it's good
     * to define mixins as an object, where you assign a name to each mixin:
     *
     *     Ext.define('Musician', {
     *          mixins: {
     *              canSing: 'CanSing'
     *          },
     * 
     *          sing: function() {
     *              // delegate singing operation to mixin
     *              this.mixins.canSing.sing.call(this);
     *          }
     *     })
     *
     * In this case the `sing` method of Musician will overwrite the
     * mixed in `sing` method. But you can access the original mixed in method
     * through special `mixins` property.
     */
    ExtClass.registerPreprocessor('mixins', function(Class, data, hooks) {
        var mixins = data.mixins,
            name, mixin, i, ln;

        delete data.mixins;

        Ext.Function.interceptBefore(hooks, 'onCreated', function() {
            if (mixins instanceof Array) {
                for (i = 0,ln = mixins.length; i < ln; i++) {
                    mixin = mixins[i];
                    name = mixin.prototype.mixinId || mixin.$className;

                    Class.mixin(name, mixin);
                }
            }
            else {
                for (var mixinName in mixins) {
                    if (mixins.hasOwnProperty(mixinName)) {
                        Class.mixin(mixinName, mixins[mixinName]);
                    }
                }
            }
        });
    });
    //</feature>

    //<feature classSystem.backwardsCompatible>
    // Backwards compatible
    Ext.extend = function(Class, Parent, members) {
        if (arguments.length === 2 && Ext.isObject(Parent)) {
            members = Parent;
            Parent = Class;
            Class = null;
        }

        var cls;

        if (!Parent) {
            throw new Error("[Ext.extend] Attempting to extend from a class which has not been loaded on the page.");
        }

        members.extend = Parent;
        members.preprocessors = [
            'extend'
            //<feature classSystem.statics>
            ,'statics'
            //</feature>
            //<feature classSystem.inheritableStatics>
            ,'inheritableStatics'
            //</feature>
            //<feature classSystem.mixins>
            ,'mixins'
            //</feature>
            //<feature classSystem.config>
            ,'config'
            //</feature>
        ];

        if (Class) {
            cls = new ExtClass(Class, members);
        }
        else {
            cls = new ExtClass(members);
        }

        cls.prototype.override = function(o) {
            for (var m in o) {
                if (o.hasOwnProperty(m)) {
                    this[m] = o[m];
                }
            }
        };

        return cls;
    };
    //</feature>

}());
 /**
 * @author Jacky Nguyen <jacky@sencha.com>
 * @docauthor Jacky Nguyen <jacky@sencha.com>
 * @class Ext.ClassManager
 *
 * Ext.ClassManager manages all classes and handles mapping from string class name to
 * actual class objects throughout the whole framework. It is not generally accessed directly, rather through
 * these convenient shorthands:
 *
 * - {@link Ext#define Ext.define}
 * - {@link Ext#create Ext.create}
 * - {@link Ext#widget Ext.widget}
 * - {@link Ext#getClass Ext.getClass}
 * - {@link Ext#getClassName Ext.getClassName}
 *
 * # Basic syntax:
 *
 *     Ext.define(className, properties);
 *
 * in which `properties` is an object represent a collection of properties that apply to the class. See
 * {@link Ext.ClassManager#create} for more detailed instructions.
 *
 *     Ext.define('Person', {
 *          name: 'Unknown',
 *
 *          constructor: function(name) {
 *              if (name) {
 *                  this.name = name;
 *              }
 *          },
 *
 *          eat: function(foodType) {
 *              alert("I'm eating: " + foodType);
 *
 *              return this;
 *          }
 *     });
 *
 *     var aaron = new Person("Aaron");
 *     aaron.eat("Sandwich"); // alert("I'm eating: Sandwich");
 *
 * Ext.Class has a powerful set of extensible {@link Ext.Class#registerPreprocessor pre-processors} which takes care of
 * everything related to class creation, including but not limited to inheritance, mixins, configuration, statics, etc.
 *
 * # Inheritance:
 *
 *     Ext.define('Developer', {
 *          extend: 'Person',
 *
 *          constructor: function(name, isGeek) {
 *              this.isGeek = isGeek;
 *
 *              // Apply a method from the parent class' prototype
 *              this.callParent([name]);
 *          },
 *
 *          code: function(language) {
 *              alert("I'm coding in: " + language);
 *
 *              this.eat("Bugs");
 *
 *              return this;
 *          }
 *     });
 *
 *     var jacky = new Developer("Jacky", true);
 *     jacky.code("JavaScript"); // alert("I'm coding in: JavaScript");
 *                               // alert("I'm eating: Bugs");
 *
 * See {@link Ext.Base#callParent} for more details on calling superclass' methods
 *
 * # Mixins:
 *
 *     Ext.define('CanPlayGuitar', {
 *          playGuitar: function() {
 *             alert("F#...G...D...A");
 *          }
 *     });
 *
 *     Ext.define('CanComposeSongs', {
 *          composeSongs: function() { ... }
 *     });
 *
 *     Ext.define('CanSing', {
 *          sing: function() {
 *              alert("I'm on the highway to hell...")
 *          }
 *     });
 *
 *     Ext.define('Musician', {
 *          extend: 'Person',
 *
 *          mixins: {
 *              canPlayGuitar: 'CanPlayGuitar',
 *              canComposeSongs: 'CanComposeSongs',
 *              canSing: 'CanSing'
 *          }
 *     })
 *
 *     Ext.define('CoolPerson', {
 *          extend: 'Person',
 *
 *          mixins: {
 *              canPlayGuitar: 'CanPlayGuitar',
 *              canSing: 'CanSing'
 *          },
 *
 *          sing: function() {
 *              alert("Ahem....");
 *
 *              this.mixins.canSing.sing.call(this);
 *
 *              alert("[Playing guitar at the same time...]");
 *
 *              this.playGuitar();
 *          }
 *     });
 *
 *     var me = new CoolPerson("Jacky");
 *
 *     me.sing(); // alert("Ahem...");
 *                // alert("I'm on the highway to hell...");
 *                // alert("[Playing guitar at the same time...]");
 *                // alert("F#...G...D...A");
 *
 * # Config:
 *
 *     Ext.define('SmartPhone', {
 *          config: {
 *              hasTouchScreen: false,
 *              operatingSystem: 'Other',
 *              price: 500
 *          },
 *
 *          isExpensive: false,
 *
 *          constructor: function(config) {
 *              this.initConfig(config);
 *          },
 *
 *          applyPrice: function(price) {
 *              this.isExpensive = (price > 500);
 *
 *              return price;
 *          },
 *
 *          applyOperatingSystem: function(operatingSystem) {
 *              if (!(/^(iOS|Android|BlackBerry)$/i).test(operatingSystem)) {
 *                  return 'Other';
 *              }
 *
 *              return operatingSystem;
 *          }
 *     });
 *
 *     var iPhone = new SmartPhone({
 *          hasTouchScreen: true,
 *          operatingSystem: 'iOS'
 *     });
 *
 *     iPhone.getPrice(); // 500;
 *     iPhone.getOperatingSystem(); // 'iOS'
 *     iPhone.getHasTouchScreen(); // true;
 *     iPhone.hasTouchScreen(); // true
 *
 *     iPhone.isExpensive; // false;
 *     iPhone.setPrice(600);
 *     iPhone.getPrice(); // 600
 *     iPhone.isExpensive; // true;
 *
 *     iPhone.setOperatingSystem('AlienOS');
 *     iPhone.getOperatingSystem(); // 'Other'
 *
 * # Statics:
 *
 *     Ext.define('Computer', {
 *          statics: {
 *              factory: function(brand) {
 *                 // 'this' in static methods refer to the class itself
 *                  return new this(brand);
 *              }
 *          },
 *
 *          constructor: function() { ... }
 *     });
 *
 *     var dellComputer = Computer.factory('Dell');
 *
 * Also see {@link Ext.Base#statics} and {@link Ext.Base#self} for more details on accessing
 * static properties within class methods
 *
 * @singleton
 */
(function(Class, alias, arraySlice, arrayFrom, global) {

    var Manager = Ext.ClassManager = {

        /**
         * @property {Object} classes
         * All classes which were defined through the ClassManager. Keys are the
         * name of the classes and the values are references to the classes.
         * @private
         */
        classes: {},

        /**
         * @private
         */
        existCache: {},

        /**
         * @private
         */
        namespaceRewrites: [{
            from: 'Ext.',
            to: Ext
        }],

        /**
         * @private
         */
        maps: {
            alternateToName: {},
            aliasToName: {},
            nameToAliases: {},
            nameToAlternates: {}
        },

        /** @private */
        enableNamespaceParseCache: true,

        /** @private */
        namespaceParseCache: {},

        /** @private */
        instantiators: [],

        /**
         * Checks if a class has already been created.
         *
         * @param {String} className
         * @return {Boolean} exist
         */
        isCreated: function(className) {
            var existCache = this.existCache,
                i, ln, part, root, parts;

            //<debug error>
            if (typeof className != 'string' || className.length < 1) {
                throw new Error("[Ext.ClassManager] Invalid classname, must be a string and must not be empty");
            }
            //</debug>

            if (this.classes[className] || existCache[className]) {
                return true;
            }

            root = global;
            parts = this.parseNamespace(className);

            for (i = 0, ln = parts.length; i < ln; i++) {
                part = parts[i];

                if (typeof part != 'string') {
                    root = part;
                } else {
                    if (!root || !root[part]) {
                        return false;
                    }

                    root = root[part];
                }
            }

            existCache[className] = true;

            this.triggerCreated(className);

            return true;
        },

        /**
         * @private
         */
        createdListeners: [],

        /**
         * @private
         */
        nameCreatedListeners: {},

        /**
         * @private
         */
        triggerCreated: function(className) {
            var listeners = this.createdListeners,
                nameListeners = this.nameCreatedListeners,
                alternateNames = this.maps.nameToAlternates[className],
                names = [className],
                i, ln, j, subLn, listener, name;

            for (i = 0,ln = listeners.length; i < ln; i++) {
                listener = listeners[i];
                listener.fn.call(listener.scope, className);
            }

            if (alternateNames) {
                names.push.apply(names, alternateNames);
            }

            for (i = 0,ln = names.length; i < ln; i++) {
                name = names[i];
                listeners = nameListeners[name];

                if (listeners) {
                    for (j = 0,subLn = listeners.length; j < subLn; j++) {
                        listener = listeners[j];
                        listener.fn.call(listener.scope, name);
                    }
                    delete nameListeners[name];
                }
            }
        },

        /**
         * @private
         */
        onCreated: function(fn, scope, className) {
            var listeners = this.createdListeners,
                nameListeners = this.nameCreatedListeners,
                listener = {
                    fn: fn,
                    scope: scope
                };

            if (className) {
                if (this.isCreated(className)) {
                    fn.call(scope, className);
                    return;
                }

                if (!nameListeners[className]) {
                    nameListeners[className] = [];
                }

                nameListeners[className].push(listener);
            }
            else {
                listeners.push(listener);
            }
        },

        /**
         * Supports namespace rewriting
         * @private
         */
        parseNamespace: function(namespace) {
            //<debug error>
            if (typeof namespace != 'string') {
                throw new Error("[Ext.ClassManager] Invalid namespace, must be a string");
            }
            //</debug>

            var cache = this.namespaceParseCache,
                parts,
                rewrites,
                root,
                name,
                rewrite, from, to, i, ln;

            if (this.enableNamespaceParseCache) {
                if (cache.hasOwnProperty(namespace)) {
                    return cache[namespace];
                }
            }

            parts = [];
            rewrites = this.namespaceRewrites;
            root = global;
            name = namespace;

            for (i = 0, ln = rewrites.length; i < ln; i++) {
                rewrite = rewrites[i];
                from = rewrite.from;
                to = rewrite.to;

                if (name === from || name.substring(0, from.length) === from) {
                    name = name.substring(from.length);

                    if (typeof to != 'string') {
                        root = to;
                    } else {
                        parts = parts.concat(to.split('.'));
                    }

                    break;
                }
            }

            parts.push(root);

            parts = parts.concat(name.split('.'));

            if (this.enableNamespaceParseCache) {
                cache[namespace] = parts;
            }

            return parts;
        },

        /**
         * Creates a namespace and assign the `value` to the created object
         *
         *     Ext.ClassManager.setNamespace('MyCompany.pkg.Example', someObject);
         *
         *     alert(MyCompany.pkg.Example === someObject); // alerts true
         *
         * @param {String} name
         * @param {Object} value
         */
        setNamespace: function(name, value) {
            var root = global,
                parts = this.parseNamespace(name),
                ln = parts.length - 1,
                leaf = parts[ln],
                i, part;

            for (i = 0; i < ln; i++) {
                part = parts[i];

                if (typeof part != 'string') {
                    root = part;
                } else {
                    if (!root[part]) {
                        root[part] = {};
                    }

                    root = root[part];
                }
            }

            root[leaf] = value;

            return root[leaf];
        },

        /**
         * The new Ext.ns, supports namespace rewriting
         * @private
         */
        createNamespaces: function() {
            var root = global,
                parts, part, i, j, ln, subLn;

            for (i = 0, ln = arguments.length; i < ln; i++) {
                parts = this.parseNamespace(arguments[i]);

                for (j = 0, subLn = parts.length; j < subLn; j++) {
                    part = parts[j];

                    if (typeof part != 'string') {
                        root = part;
                    } else {
                        if (!root[part]) {
                            root[part] = {};
                        }

                        root = root[part];
                    }
                }
            }

            return root;
        },

        /**
         * Sets a name reference to a class.
         *
         * @param {String} name
         * @param {Object} value
         * @return {Ext.ClassManager} this
         */
        set: function(name, value) {
            var me = this,
                maps = me.maps,
                nameToAlternates = maps.nameToAlternates,
                targetName = me.getName(value),
                alternates;

            me.classes[name] = me.setNamespace(name, value);

            if (targetName && targetName !== name) {
                maps.alternateToName[name] = targetName;
                alternates = nameToAlternates[targetName] || (nameToAlternates[targetName] = []);
                alternates.push(name);
            }

            return this;
        },

        /**
         * Retrieve a class by its name.
         *
         * @param {String} name
         * @return {Ext.Class} class
         */
        get: function(name) {
            var classes = this.classes,
                root,
                parts,
                part, i, ln;

            if (classes[name]) {
                return classes[name];
            }

            root = global;
            parts = this.parseNamespace(name);

            for (i = 0, ln = parts.length; i < ln; i++) {
                part = parts[i];

                if (typeof part != 'string') {
                    root = part;
                } else {
                    if (!root || !root[part]) {
                        return null;
                    }

                    root = root[part];
                }
            }

            return root;
        },

        /**
         * Register the alias for a class.
         *
         * @param {Ext.Class/String} cls a reference to a class or a className
         * @param {String} alias Alias to use when referring to this class
         */
        setAlias: function(cls, alias) {
            var aliasToNameMap = this.maps.aliasToName,
                nameToAliasesMap = this.maps.nameToAliases,
                className;

            if (typeof cls == 'string') {
                className = cls;
            } else {
                className = this.getName(cls);
            }

            if (alias && aliasToNameMap[alias] !== className) {
                //<debug info>
                if (aliasToNameMap[alias] && Ext.isDefined(global.console)) {
                    global.console.log("[Ext.ClassManager] Overriding existing alias: '" + alias + "' " +
                        "of: '" + aliasToNameMap[alias] + "' with: '" + className + "'. Be sure it's intentional.");
                }
                //</debug>

                aliasToNameMap[alias] = className;
            }

            if (!nameToAliasesMap[className]) {
                nameToAliasesMap[className] = [];
            }

            if (alias) {
                Ext.Array.include(nameToAliasesMap[className], alias);
            }

            return this;
        },

        /**
         * Get a reference to the class by its alias.
         *
         * @param {String} alias
         * @return {Ext.Class} class
         */
        getByAlias: function(alias) {
            return this.get(this.getNameByAlias(alias));
        },

        /**
         * Get the name of a class by its alias.
         *
         * @param {String} alias
         * @return {String} className
         */
        getNameByAlias: function(alias) {
            return this.maps.aliasToName[alias] || '';
        },

        /**
         * Get the name of a class by its alternate name.
         *
         * @param {String} alternate
         * @return {String} className
         */
        getNameByAlternate: function(alternate) {
            return this.maps.alternateToName[alternate] || '';
        },

        /**
         * Get the aliases of a class by the class name
         *
         * @param {String} name
         * @return {Array} aliases
         */
        getAliasesByName: function(name) {
            return this.maps.nameToAliases[name] || [];
        },

        /**
         * Get the name of the class by its reference or its instance;
         * usually invoked by the shorthand {@link Ext#getClassName Ext.getClassName}
         *
         *     Ext.ClassManager.getName(Ext.Action); // returns "Ext.Action"
         *
         * @param {Ext.Class/Object} object
         * @return {String} className
         */
        getName: function(object) {
            return object && object.$className || '';
        },

        /**
         * Get the class of the provided object; returns null if it's not an instance
         * of any class created with Ext.define. This is usually invoked by the shorthand {@link Ext#getClass Ext.getClass}
         *
         *     var component = new Ext.Component();
         *
         *     Ext.ClassManager.getClass(component); // returns Ext.Component
         *
         * @param {Object} object
         * @return {Ext.Class} class
         */
        getClass: function(object) {
            return object && object.self || null;
        },

        /**
         * Defines a class.
         * @deprecated 4.1.0 Use {@link Ext#define} instead, as that also supports creating overrides.
         */
        create: function(className, data, createdFn) {
            //<debug error>
            if (typeof className != 'string') {
                throw new Error("[Ext.define] Invalid class name '" + className + "' specified, must be a non-empty string");
            }
            //</debug>

            data.$className = className;

            return new Class(data, function() {
                var postprocessorStack = data.postprocessors || Manager.defaultPostprocessors,
                    registeredPostprocessors = Manager.postprocessors,
                    postprocessors = [],
                    postprocessor, i, ln, j, subLn, postprocessorProperties, postprocessorProperty;

                delete data.postprocessors;

                for (i = 0,ln = postprocessorStack.length; i < ln; i++) {
                    postprocessor = postprocessorStack[i];

                    if (typeof postprocessor == 'string') {
                        postprocessor = registeredPostprocessors[postprocessor];
                        postprocessorProperties = postprocessor.properties;

                        if (postprocessorProperties === true) {
                            postprocessors.push(postprocessor.fn);
                        }
                        else if (postprocessorProperties) {
                            for (j = 0,subLn = postprocessorProperties.length; j < subLn; j++) {
                                postprocessorProperty = postprocessorProperties[j];

                                if (data.hasOwnProperty(postprocessorProperty)) {
                                    postprocessors.push(postprocessor.fn);
                                    break;
                                }
                            }
                        }
                    }
                    else {
                        postprocessors.push(postprocessor);
                    }
                }

                data.postprocessors = postprocessors;
                data.createdFn = createdFn;
                Manager.processCreate(className, this, data);
            });
        },
        
        processCreate: function(className, cls, clsData){
            var me = this,
                postprocessor = clsData.postprocessors.shift(),
                createdFn = clsData.createdFn;

            if (!postprocessor) {
                me.set(className, cls);

                if (createdFn) {
                     createdFn.call(cls, cls);
                }

                me.triggerCreated(className);
                return;
            }

            if (postprocessor.call(me, className, cls, clsData, me.processCreate) !== false) {
                me.processCreate(className, cls, clsData);
            }
        },

        createOverride: function (className, data, createdFn) {
            var me = this,
                overriddenClassName = data.override,
                requires = data.requires,
                uses = data.uses,
                classReady = function () {
                    var cls, temp;

                    if (requires) {
                        temp = requires;
                        requires = null; // do the real thing next time (which may be now)

                        // Since the override is going to be used (its target class is now
                        // created), we need to fetch the required classes for the override
                        // and call us back once they are loaded:
                        Ext.Loader.require(temp, classReady);
                    } else {
                        // The target class and the required classes for this override are
                        // ready, so we can apply the override now:
                        cls = me.get(overriddenClassName);

                        // We don't want to apply these:
                        delete data.override;
                        delete data.requires;
                        delete data.uses;

                        Ext.override(cls, data);

                        // This pushes the overridding file itself into Ext.Loader.history
                        // Hence if the target class never exists, the overriding file will
                        // never be included in the build.
                        me.triggerCreated(className);

                        if (uses) {
                            Ext.Loader.addUsedClasses(uses); // get these classes too!
                        }

                        if (createdFn) {
                            createdFn.call(cls); // last but not least!
                        }
                    }
                };

            me.existCache[className] = true;

            // Override the target class right after it's created
            me.onCreated(classReady, me, overriddenClassName);
 
            return me;
        },

        /**
         * Instantiate a class by its alias; usually invoked by the convenient shorthand {@link Ext#createByAlias Ext.createByAlias}
         * If {@link Ext.Loader} is {@link Ext.Loader#setConfig enabled} and the class has not been defined yet, it will
         * attempt to load the class via synchronous loading.
         *
         *     var window = Ext.ClassManager.instantiateByAlias('widget.window', { width: 600, height: 800, ... });
         *
         * @param {String} alias
         * @param {Object...} args Additional arguments after the alias will be passed to the
         * class constructor.
         * @return {Object} instance
         */
        instantiateByAlias: function() {
            var alias = arguments[0],
                args = arraySlice.call(arguments),
                className = this.getNameByAlias(alias);

            if (!className) {
                className = this.maps.aliasToName[alias];

                //<debug error>
                if (!className) {
                    throw new Error("[Ext.createByAlias] Cannot create an instance of unrecognized alias: " + alias);
                }
                //</debug>

                //<debug warn>
                if (global.console) {
                    global.console.warn("[Ext.Loader] Synchronously loading '" + className + "'; consider adding " +
                         "Ext.require('" + alias + "') above Ext.onReady");
                }
                //</debug>

                Ext.syncRequire(className);
            }

            args[0] = className;

            return this.instantiate.apply(this, args);
        },

        /**
         * @private
         */
        instantiate: function() {
            var name = arguments[0],
                nameType = typeof name,
                args = arraySlice.call(arguments, 1),
                alias = name,
                possibleName, cls;

            if (nameType != 'function') {
                if (nameType != 'string' && args.length === 0) {
                    args = [name];
                    name = name.xclass;
                }

                //<debug error>
                if (typeof name != 'string' || name.length < 1) {
                    throw new Error("[Ext.create] Invalid class name or alias '" + name + "' specified, must be a non-empty string");
                }
                //</debug>

                cls = this.get(name);
            }
            else {
                cls = name;
            }

            // No record of this class name, it's possibly an alias, so look it up
            if (!cls) {
                possibleName = this.getNameByAlias(name);

                if (possibleName) {
                    name = possibleName;

                    cls = this.get(name);
                }
            }

            // Still no record of this class name, it's possibly an alternate name, so look it up
            if (!cls) {
                possibleName = this.getNameByAlternate(name);

                if (possibleName) {
                    name = possibleName;

                    cls = this.get(name);
                }
            }

            // Still not existing at this point, try to load it via synchronous mode as the last resort
            if (!cls) {
                //<debug warn>
                if (global.console) {
                    global.console.warn("[Ext.Loader] Synchronously loading '" + name + "'; consider adding " +
                         "Ext.require('" + ((possibleName) ? alias : name) + "') above Ext.onReady");
                }
                //</debug>

                Ext.syncRequire(name);

                cls = this.get(name);
            }

            //<debug error>
            if (!cls) {
                throw new Error("[Ext.create] Cannot create an instance of unrecognized class name / alias: " + alias);
            }

            if (typeof cls != 'function') {
                throw new Error("[Ext.create] '" + name + "' is a singleton and cannot be instantiated");
            }
            //</debug>

            return this.getInstantiator(args.length)(cls, args);
        },

        /**
         * @private
         * @param name
         * @param args
         */
        dynInstantiate: function(name, args) {
            args = arrayFrom(args, true);
            args.unshift(name);

            return this.instantiate.apply(this, args);
        },

        /**
         * @private
         * @param length
         */
        getInstantiator: function(length) {
            var instantiators = this.instantiators,
                instantiator,
                i,
                args;

            instantiator = instantiators[length];

            if (!instantiator) {
                i = length;
                args = [];

                for (i = 0; i < length; i++) {
                    args.push('a[' + i + ']');
                }

                instantiator = instantiators[length] = new Function('c', 'a', 'return new c(' + args.join(',') + ')');
                //<debug>
                instantiator.displayName = "Ext.ClassManager.instantiate" + length;
                //</debug>
            }

            return instantiator;
        },

        /**
         * @private
         */
        postprocessors: {},

        /**
         * @private
         */
        defaultPostprocessors: [],

        /**
         * Register a post-processor function.
         *
         * @private
         * @param {String} name
         * @param {Function} postprocessor
         */
        registerPostprocessor: function(name, fn, properties, position, relativeTo) {
            if (!position) {
                position = 'last';
            }

            if (!properties) {
                properties = [name];
            }

            this.postprocessors[name] = {
                name: name,
                properties: properties || false,
                fn: fn
            };

            this.setDefaultPostprocessorPosition(name, position, relativeTo);

            return this;
        },

        /**
         * Set the default post processors array stack which are applied to every class.
         *
         * @private
         * @param {String/Array} The name of a registered post processor or an array of registered names.
         * @return {Ext.ClassManager} this
         */
        setDefaultPostprocessors: function(postprocessors) {
            this.defaultPostprocessors = arrayFrom(postprocessors);

            return this;
        },

        /**
         * Insert this post-processor at a specific position in the stack, optionally relative to
         * any existing post-processor
         *
         * @private
         * @param {String} name The post-processor name. Note that it needs to be registered with
         * {@link Ext.ClassManager#registerPostprocessor} before this
         * @param {String} offset The insertion position. Four possible values are:
         * 'first', 'last', or: 'before', 'after' (relative to the name provided in the third argument)
         * @param {String} relativeName
         * @return {Ext.ClassManager} this
         */
        setDefaultPostprocessorPosition: function(name, offset, relativeName) {
            var defaultPostprocessors = this.defaultPostprocessors,
                index;

            if (typeof offset == 'string') {
                if (offset === 'first') {
                    defaultPostprocessors.unshift(name);

                    return this;
                }
                else if (offset === 'last') {
                    defaultPostprocessors.push(name);

                    return this;
                }

                offset = (offset === 'after') ? 1 : -1;
            }

            index = Ext.Array.indexOf(defaultPostprocessors, relativeName);

            if (index !== -1) {
                Ext.Array.splice(defaultPostprocessors, Math.max(0, index + offset), 0, name);
            }

            return this;
        },

        /**
         * Converts a string expression to an array of matching class names. An expression can either refers to class aliases
         * or class names. Expressions support wildcards:
         *
         *      // returns ['Ext.window.Window']
         *     var window = Ext.ClassManager.getNamesByExpression('widget.window');
         *
         *     // returns ['widget.panel', 'widget.window', ...]
         *     var allWidgets = Ext.ClassManager.getNamesByExpression('widget.*');
         *
         *     // returns ['Ext.data.Store', 'Ext.data.ArrayProxy', ...]
         *     var allData = Ext.ClassManager.getNamesByExpression('Ext.data.*');
         *
         * @param {String} expression
         * @return {String[]} classNames
         */
        getNamesByExpression: function(expression) {
            var nameToAliasesMap = this.maps.nameToAliases,
                names = [],
                name, alias, aliases, possibleName, regex, i, ln;

            //<debug error>
            if (typeof expression != 'string' || expression.length < 1) {
                throw new Error("[Ext.ClassManager.getNamesByExpression] Expression " + expression + " is invalid, must be a non-empty string");
            }
            //</debug>

            if (expression.indexOf('*') !== -1) {
                expression = expression.replace(/\*/g, '(.*?)');
                regex = new RegExp('^' + expression + '$');

                for (name in nameToAliasesMap) {
                    if (nameToAliasesMap.hasOwnProperty(name)) {
                        aliases = nameToAliasesMap[name];

                        if (name.search(regex) !== -1) {
                            names.push(name);
                        }
                        else {
                            for (i = 0, ln = aliases.length; i < ln; i++) {
                                alias = aliases[i];

                                if (alias.search(regex) !== -1) {
                                    names.push(name);
                                    break;
                                }
                            }
                        }
                    }
                }

            } else {
                possibleName = this.getNameByAlias(expression);

                if (possibleName) {
                    names.push(possibleName);
                } else {
                    possibleName = this.getNameByAlternate(expression);

                    if (possibleName) {
                        names.push(possibleName);
                    } else {
                        names.push(expression);
                    }
                }
            }

            return names;
        }
    };

    //<feature classSystem.alias>
    /**
     * @cfg {String[]} alias
     * @member Ext.Class
     * List of short aliases for class names.  Most useful for defining xtypes for widgets:
     *
     *     Ext.define('MyApp.CoolPanel', {
     *         extend: 'Ext.panel.Panel',
     *         alias: ['widget.coolpanel'],
     *         title: 'Yeah!'
     *     });
     *
     *     // Using Ext.create
     *     Ext.create('widget.coolpanel');
     *
     *     // Using the shorthand for defining widgets by xtype
     *     Ext.widget('panel', {
     *         items: [
     *             {xtype: 'coolpanel', html: 'Foo'},
     *             {xtype: 'coolpanel', html: 'Bar'}
     *         ]
     *     });
     *
     * Besides "widget" for xtype there are alias namespaces like "feature" for ftype and "plugin" for ptype.
     */
    Manager.registerPostprocessor('alias', function(name, cls, data) {
        var aliases = data.alias,
            i, ln;

        for (i = 0,ln = aliases.length; i < ln; i++) {
            alias = aliases[i];

            this.setAlias(cls, alias);
        }

    }, ['xtype', 'alias']);
    //</feature>

    //<feature classSystem.singleton>
    /**
     * @cfg {Boolean} singleton
     * @member Ext.Class
     * When set to true, the class will be instantiated as singleton.  For example:
     *
     *     Ext.define('Logger', {
     *         singleton: true,
     *         log: function(msg) {
     *             console.log(msg);
     *         }
     *     });
     *
     *     Logger.log('Hello');
     */
    Manager.registerPostprocessor('singleton', function(name, cls, data, fn) {
        fn.call(this, name, new cls(), data);
        return false;
    });
    //</feature>

    //<feature classSystem.alternateClassName>
    /**
     * @cfg {String/String[]} alternateClassName
     * @member Ext.Class
     * Defines alternate names for this class.  For example:
     *
     *     Ext.define('Developer', {
     *         alternateClassName: ['Coder', 'Hacker'],
     *         code: function(msg) {
     *             alert('Typing... ' + msg);
     *         }
     *     });
     *
     *     var joe = Ext.create('Developer');
     *     joe.code('stackoverflow');
     *
     *     var rms = Ext.create('Hacker');
     *     rms.code('hack hack');
     */
    Manager.registerPostprocessor('alternateClassName', function(name, cls, data) {
        var alternates = data.alternateClassName,
            i, ln, alternate;

        if (!(alternates instanceof Array)) {
            alternates = [alternates];
        }

        for (i = 0, ln = alternates.length; i < ln; i++) {
            alternate = alternates[i];

            //<debug error>
            if (typeof alternate != 'string') {
                throw new Error("[Ext.define] Invalid alternate of: '" + alternate + "' for class: '" + name + "'; must be a valid string");
            }
            //</debug>

            this.set(alternate, cls);
        }
    });
    //</feature>

    Ext.apply(Ext, {
        /**
         * Instantiate a class by either full name, alias or alternate name.
         *
         * If {@link Ext.Loader} is {@link Ext.Loader#setConfig enabled} and the class has
         * not been defined yet, it will attempt to load the class via synchronous loading.
         *
         * For example, all these three lines return the same result:
         *
         *      // alias
         *      var window = Ext.create('widget.window', {
         *          width: 600,
         *          height: 800,
         *          ...
         *      });
         *
         *      // alternate name
         *      var window = Ext.create('Ext.Window', {
         *          width: 600,
         *          height: 800,
         *          ...
         *      });
         *
         *      // full class name
         *      var window = Ext.create('Ext.window.Window', {
         *          width: 600,
         *          height: 800,
         *          ...
         *      });
         *
         *      // single object with xclass property:
         *      var window = Ext.create({
         *          xclass: 'Ext.window.Window', // any valid value for 'name' (above)
         *          width: 600,
         *          height: 800,
         *          ...
         *      });
         *
         * @param {String} [name] The class name or alias. Can be specified as `xclass`
         * property if only one object parameter is specified.
         * @param {Object...} [args] Additional arguments after the name will be passed to
         * the class' constructor.
         * @return {Object} instance
         * @member Ext
         * @method create
         */
        create: alias(Manager, 'instantiate'),

        /**
         * Convenient shorthand to create a widget by its xtype or a config object.
         * See also {@link Ext.ClassManager#instantiateByAlias}.
         *
         *      var button = Ext.widget('button'); // Equivalent to Ext.create('widget.button');
         *
         *      var panel = Ext.widget('panel', { // Equivalent to Ext.create('widget.panel')
         *          title: 'Panel'
         *      });
         *
         *      var grid = Ext.widget({
         *          xtype: 'grid',
         *          ...
         *      });
         *
         * If a {@link Ext.Component component} instance is passed, it is simply returned.
         *
         * @member Ext
         * @param {String} [name] The xtype of the widget to create.
         * @param {Object} [config] The configuration object for the widget constructor.
         * @return {Object} The widget instance
         */
        widget: function(name, config) {
            // forms:
            //      1: (xtype)
            //      2: (xtype, config)
            //      3: (config)
            //      4: (xtype, component)
            //      5: (component)
            //      
            var xtype = name,
                alias, className, T, load;

            if (typeof xtype != 'string') { // if (form 3 or 5)
                // first arg is config or component
                config = name; // arguments[0]
                xtype = config.xtype;
            } else {
                config = config || {};
            }
            
            if (config.isComponent) {
                return config;
            }

            alias = 'widget.' + xtype;
            className = Manager.getNameByAlias(alias);

            // this is needed to support demand loading of the class
            if (!className) {
                load = true;
            }
            
            T = Manager.get(className);
            if (load || !T) {
                return Manager.instantiateByAlias(alias, config);
            }
            return new T(config);
        },

        /**
         * Convenient shorthand, see {@link Ext.ClassManager#instantiateByAlias}
         * @member Ext
         * @method createByAlias
         */
        createByAlias: alias(Manager, 'instantiateByAlias'),

        /**
         * @method
         * Defines a class or override. A basic class is defined like this:
         *
         *      Ext.define('My.awesome.Class', {
         *          someProperty: 'something',
         *
         *          someMethod: function() {
         *              alert(s + this.someProperty);
         *          }
         *
         *          ...
         *      });
         *
         *      var obj = new My.awesome.Class();
         *
         *      obj.someMethod('Say '); // alerts 'Say something'
         *
         * To defines an override, include the `override` property. The content of an
         * override is aggregated with the specified class in order to extend or modify
         * that class. This can be as simple as setting default property values or it can
         * extend and/or replace methods. This can also extend the statics of the class.
         *
         * One use for an override is to break a large class into manageable pieces.
         *
         *      // File: /src/app/Panel.js
         *
         *      Ext.define('My.app.Panel', {
         *          extend: 'Ext.panel.Panel',
         *          requires: [
         *              'My.app.PanelPart2',
         *              'My.app.PanelPart3'
         *          ]
         *
         *          constructor: function (config) {
         *              this.callParent(arguments); // calls Ext.panel.Panel's constructor
         *              //...
         *          },
         *
         *          statics: {
         *              method: function () {
         *                  return 'abc';
         *              }
         *          }
         *      });
         *
         *      // File: /src/app/PanelPart2.js
         *      Ext.define('My.app.PanelPart2', {
         *          override: 'My.app.Panel',
         *
         *          constructor: function (config) {
         *              this.callParent(arguments); // calls My.app.Panel's constructor
         *              //...
         *          }
         *      });
         *
         * Another use of overrides is to provide optional parts of classes that can be
         * independently required. In this case, the class may even be unaware of the
         * override altogether.
         *
         *      Ext.define('My.ux.CoolTip', {
         *          override: 'Ext.tip.ToolTip',
         *
         *          constructor: function (config) {
         *              this.callParent(arguments); // calls Ext.tip.ToolTip's constructor
         *              //...
         *          }
         *      });
         *
         * The above override can now be required as normal.
         *
         *      Ext.define('My.app.App', {
         *          requires: [
         *              'My.ux.CoolTip'
         *          ]
         *      });
         *
         * Overrides can also contain statics:
         *
         *      Ext.define('My.app.BarMod', {
         *          override: 'Ext.foo.Bar',
         *
         *          statics: {
         *              method: function (x) {
         *                  return this.callParent([x * 2]); // call Ext.foo.Bar.method
         *              }
         *          }
         *      });
         *
         * IMPORTANT: An override is only included in a build if the class it overrides is
         * required. Otherwise, the override, like the target class, is not included.
         *
         * @param {String} className The class name to create in string dot-namespaced format, for example:
         * 'My.very.awesome.Class', 'FeedViewer.plugin.CoolPager'
         * It is highly recommended to follow this simple convention:
         *  - The root and the class name are 'CamelCased'
         *  - Everything else is lower-cased
         * @param {Object} data The key - value pairs of properties to apply to this class. Property names can be of any valid
         * strings, except those in the reserved listed below:
         *  - `mixins`
         *  - `statics`
         *  - `config`
         *  - `alias`
         *  - `self`
         *  - `singleton`
         *  - `alternateClassName`
         *  - `override`
         *
         * @param {Function} createdFn Optional callback to execute after the class is created, the execution scope of which
         * (`this`) will be the newly created class itself.
         * @return {Ext.Base}
         * @markdown
         * @member Ext
         * @method define
         */
        define: function (className, data, createdFn) {
            if (data.override) {
                return Manager.createOverride.apply(Manager, arguments);
            }

            return Manager.create.apply(Manager, arguments);
        },

        /**
         * Convenient shorthand, see {@link Ext.ClassManager#getName}
         * @member Ext
         * @method getClassName
         */
        getClassName: alias(Manager, 'getName'),

        /**
         * Returns the displayName property or className or object. When all else fails, returns "Anonymous".
         * @param {Object} object
         * @return {String}
         */
        getDisplayName: function(object) {
            if (object) {
                if (object.displayName) {
                    return object.displayName;
                }

                if (object.$name && object.$class) {
                    return Ext.getClassName(object.$class) + '#' + object.$name;
                }

                if (object.$className) {
                    return object.$className;
                }
            }

            return 'Anonymous';
        },

        /**
         * Convenient shorthand, see {@link Ext.ClassManager#getClass}
         * @member Ext
         * @method getClass
         */
        getClass: alias(Manager, 'getClass'),

        /**
         * Creates namespaces to be used for scoping variables and classes so that they are not global.
         * Specifying the last node of a namespace implicitly creates all other nodes. Usage:
         *
         *     Ext.namespace('Company', 'Company.data');
         *
         *     // equivalent and preferable to the above syntax
         *     Ext.ns('Company.data');
         *
         *     Company.Widget = function() { ... };
         *
         *     Company.data.CustomStore = function(config) { ... };
         *
         * @param {String...} namespaces
         * @return {Object} The namespace object.
         * (If multiple arguments are passed, this will be the last namespace created)
         * @member Ext
         * @method namespace
         */
        namespace: alias(Manager, 'createNamespaces')
    });

    /**
     * Old name for {@link Ext#widget}.
     * @deprecated 4.0.0 Use {@link Ext#widget} instead.
     * @method createWidget
     * @member Ext
     */
    Ext.createWidget = Ext.widget;

    /**
     * Convenient alias for {@link Ext#namespace Ext.namespace}.
     * @inheritdoc Ext#namespace
     * @member Ext
     * @method ns
     */
    Ext.ns = Ext.namespace;

    Class.registerPreprocessor('className', function(cls, data) {
        if (data.$className) {
            cls.$className = data.$className;
            //<debug>
            cls.displayName = cls.$className;
            //</debug>
        }
    }, true, 'first');

    Class.registerPreprocessor('alias', function(cls, data) {
        var prototype = cls.prototype,
            xtypes = arrayFrom(data.xtype),
            aliases = arrayFrom(data.alias),
            widgetPrefix = 'widget.',
            widgetPrefixLength = widgetPrefix.length,
            xtypesChain = Array.prototype.slice.call(prototype.xtypesChain || []),
            xtypesMap = Ext.merge({}, prototype.xtypesMap || {}),
            i, ln, alias, xtype;

        for (i = 0,ln = aliases.length; i < ln; i++) {
            alias = aliases[i];

            //<debug error>
            if (typeof alias != 'string' || alias.length < 1) {
                throw new Error("[Ext.define] Invalid alias of: '" + alias + "' for class: '" + name + "'; must be a valid string");
            }
            //</debug>

            if (alias.substring(0, widgetPrefixLength) === widgetPrefix) {
                xtype = alias.substring(widgetPrefixLength);
                Ext.Array.include(xtypes, xtype);
            }
        }

        cls.xtype = data.xtype = xtypes[0];
        data.xtypes = xtypes;

        for (i = 0,ln = xtypes.length; i < ln; i++) {
            xtype = xtypes[i];

            if (!xtypesMap[xtype]) {
                xtypesMap[xtype] = true;
                xtypesChain.push(xtype);
            }
        }

        data.xtypesChain = xtypesChain;
        data.xtypesMap = xtypesMap;

        Ext.Function.interceptAfter(data, 'onClassCreated', function() {
            var mixins = prototype.mixins,
                key, mixin;

            for (key in mixins) {
                if (mixins.hasOwnProperty(key)) {
                    mixin = mixins[key];

                    xtypes = mixin.xtypes;

                    if (xtypes) {
                        for (i = 0,ln = xtypes.length; i < ln; i++) {
                            xtype = xtypes[i];

                            if (!xtypesMap[xtype]) {
                                xtypesMap[xtype] = true;
                                xtypesChain.push(xtype);
                            }
                        }
                    }
                }
            }
        });

        for (i = 0,ln = xtypes.length; i < ln; i++) {
            xtype = xtypes[i];

            //<debug error>
            if (typeof xtype != 'string' || xtype.length < 1) {
                throw new Error("[Ext.define] Invalid xtype of: '" + xtype + "' for class: '" + name + "'; must be a valid non-empty string");
            }
            //</debug>

            Ext.Array.include(aliases, widgetPrefix + xtype);
        }

        data.alias = aliases;

    }, ['xtype', 'alias']);

}(Ext.Class, Ext.Function.alias, Array.prototype.slice, Ext.Array.from, Ext.global));
 /**
 * Provides the ability to execute one or more arbitrary tasks in a asynchronous manner.
 * Generally, you can use the singleton {@link Ext.TaskManager} instead, but if needed,
 * you can create separate instances of TaskRunner. Any number of separate tasks can be
 * started at any time and will run independently of each other.
 * 
 * Example usage:
 *
 *      // Start a simple clock task that updates a div once per second
 *      var updateClock = function () {
 *          Ext.fly('clock').update(new Date().format('g:i:s A'));
 *      }
 *
 *      var runner = new Ext.util.TaskRunner();
 *      var task = runner.start({
 *          run: updateClock,
 *          interval: 1000
 *      }
 *
 * The equivalent using TaskManager:
 *
 *      var task = Ext.TaskManager.start({
 *          run: updateClock,
 *          interval: 1000
 *      });
 *
 * To end a running task:
 * 
 *      task.destroy();
 *
 * If a task needs to be started and stopped repeated over time, you can create a
 * {@link Ext.util.TaskRunner.Task Task} instance.
 *
 *      var task = runner.newTask({
 *          run: function () {
 *              // useful code
 *          },
 *          interval: 1000
 *      });
 *      
 *      task.start();
 *      
 *      // ...
 *      
 *      task.stop();
 *      
 *      // ...
 *      
 *      task.start();
 *
 * A re-usable, one-shot task can be managed similar to the above:
 *
 *      var task = runner.newTask({
 *          run: function () {
 *              // useful code to run once
 *          },
 *          repeat: 1
 *      });
 *      
 *      task.start();
 *      
 *      // ...
 *      
 *      task.start();
 *
 * See the {@link #start} method for details about how to configure a task object.
 *
 * Also see {@link Ext.util.DelayedTask}. 
 * 
 * @constructor
 * @param {Number/Object} [interval=10] The minimum precision in milliseconds supported by this
 * TaskRunner instance. Alternatively, a config object to apply to the new instance.
 */
Ext.define('Ext.util.TaskRunner', {
    /**
     * @cfg interval
     * The timer resolution.
     */
    interval: 10,

    /**
     * @property timerId
     * The id of the current timer.
     * @private
     */
    timerId: null,

    constructor: function (interval) {
        var me = this;

        if (typeof interval == 'number') {
            me.interval = interval;
        } else if (interval) {
            Ext.apply(me, interval);
        }

        me.tasks = [];
        me.timerFn = Ext.Function.bind(me.onTick, me);
    },

    /**
     * Creates a new {@link Ext.util.TaskRunner.Task Task} instance. These instances can
     * be easily started and stopped.
     * @param {Object} config The config object. For details on the supported properties,
     * see {@link #start}.
     */
    newTask: function (config) {
        var task = new Ext.util.TaskRunner.Task(config);
        task.manager = this;
        return task;
    },

    /**
     * Starts a new task.
     *
     * Before each invocation, Ext injects the property `taskRunCount` into the task object
     * so that calculations based on the repeat count can be performed.
     * 
     * The returned task will contain a `destroy` method that can be used to destroy the
     * task and cancel further calls. This is equivalent to the {@link #stop} method.
     *
     * @param {Object} task A config object that supports the following properties:
     * @param {Function} task.run The function to execute each time the task is invoked. The
     * function will be called at each interval and passed the `args` argument if specified,
     * and the current invocation count if not.
     * 
     * If a particular scope (`this` reference) is required, be sure to specify it using
     * the `scope` argument.
     * 
     * @param {Function} task.onError The function to execute in case of unhandled
     * error on task.run.
     *
     * @param {Boolean} task.run.return `false` from this function to terminate the task.
     *
     * @param {Number} task.interval The frequency in milliseconds with which the task
     * should be invoked.
     *
     * @param {Object[]} task.args An array of arguments to be passed to the function
     * specified by `run`. If not specified, the current invocation count is passed.
     *
     * @param {Object} task.scope The scope (`this` reference) in which to execute the
     * `run` function. Defaults to the task config object.
     *
     * @param {Number} task.duration The length of time in milliseconds to invoke the task
     * before stopping automatically (defaults to indefinite).
     *
     * @param {Number} task.repeat The number of times to invoke the task before stopping
     * automatically (defaults to indefinite).
     * @return {Object} The task
     */
    start: function(task) {
        var me = this,
            now = new Date().getTime();

        if (!task.pending) {
            me.tasks.push(task);
            task.pending = true; // don't allow the task to be added to me.tasks again
        }

        task.stopped = false; // might have been previously stopped...
        task.taskStartTime = now;
        task.taskRunTime = task.fireOnStart !== false ? 0 : task.taskStartTime;
        task.taskRunCount = 0;

        if (!me.firing) {
            if (task.fireOnStart !== false) {
                me.startTimer(0, now);
            } else {
                me.startTimer(task.interval, now);
            }
        }

        return task;
    },

    /**
     * Stops an existing running task.
     * @param {Object} task The task to stop
     * @return {Object} The task
     */
    stop: function(task) {
        // NOTE: we don't attempt to remove the task from me.tasks at this point because
        // this could be called from inside a task which would then corrupt the state of
        // the loop in onTick
        if (!task.stopped) {
            task.stopped = true;

            if (task.onStop) {
                task.onStop.call(task.scope || task, task);
            }
        }

        return task;
    },

    /**
     * Stops all tasks that are currently running.
     */
    stopAll: function() {
        // onTick will take care of cleaning up the mess after this point...
        Ext.each(this.tasks, this.stop, this);
    },

    //-------------------------------------------------------------------------

    firing: false,

    nextExpires: 1e99,

    // private
    onTick: function () {
        var me = this,
            tasks = me.tasks,
            now = new Date().getTime(),
            nextExpires = 1e99,
            len = tasks.length,
            expires, newTasks, i, task, rt, remove;

        me.timerId = null;
        me.firing = true; // ensure we don't startTimer during this loop...

        // tasks.length can be > len if start is called during a task.run call... so we
        // first check len to avoid tasks.length reference but eventually we need to also
        // check tasks.length. we avoid repeating use of tasks.length by setting len at
        // that time (to help the next loop)
        for (i = 0; i < len || i < (len = tasks.length); ++i) {
            task = tasks[i];

            if (!(remove = task.stopped)) {
                expires = task.taskRunTime + task.interval;

                if (expires <= now) {
                    rt = 1; // otherwise we have a stale "rt"
                    try {
                        rt = task.run.apply(task.scope || task, task.args || [++task.taskRunCount]);
                    } catch (taskError) {
                        try {
                            if (task.onError) {
                                rt = task.onError.call(task.scope || task, task, taskError);
                            }
                        } catch (ignore) { }
                    }
                    task.taskRunTime = now;
                    if (rt === false || task.taskRunCount === task.repeat) {
                        me.stop(task);
                        remove = true;
                    } else {
                        remove = task.stopped; // in case stop was called by run
                        expires = now + task.interval;
                    }
                }

                if (!remove && task.duration && task.duration <= (now - task.taskStartTime)) {
                    me.stop(task);
                    remove = true;
                }
            }

            if (remove) {
                task.pending = false; // allow the task to be added to me.tasks again

                // once we detect that a task needs to be removed, we copy the tasks that
                // will carry forward into newTasks... this way we avoid O(N*N) to remove
                // each task from the tasks array (and ripple the array down) and also the
                // potentially wasted effort of making a new tasks[] even if all tasks are
                // going into the next wave.
                if (!newTasks) {
                    newTasks = tasks.slice(0, i);
                    // we don't set me.tasks here because callbacks can also start tasks,
                    // which get added to me.tasks... so we will visit them in this loop
                    // and account for their expirations in nextExpires...
                }
            } else {
                if (newTasks) {
                    newTasks.push(task); // we've cloned the tasks[], so keep this one...
                }

                if (nextExpires > expires) {
                    nextExpires = expires; // track the nearest expiration time
                }
            }
        }

        if (newTasks) {
            // only now can we copy the newTasks to me.tasks since no user callbacks can
            // take place
            me.tasks = newTasks;
        }

        me.firing = false; // we're done, so allow startTimer afterwards

        if (me.tasks.length) {
            // we create a new Date here because all the callbacks could have taken a long
            // time... we want to base the next timeout on the current time (after the
            // callback storm):
            me.startTimer(nextExpires - now, new Date().getTime());
        }
    },

    // private
    startTimer: function (timeout, now) {
        var me = this,
            expires = now + timeout,
            timerId = me.timerId;

        // Check to see if this request is enough in advance of the current timer. If so,
        // we reschedule the timer based on this new expiration.
        if (timerId && me.nextExpires - expires > me.interval) {
            clearTimeout(timerId);
            timerId = null;
        }

        if (!timerId) {
            if (timeout < me.interval) {
                timeout = me.interval;
            }

            me.timerId = setTimeout(me.timerFn, timeout);
            me.nextExpires = expires;
        }
    }
},
function () {
    var me = this,
        proto = me.prototype;

    /**
     * Destroys this instance, stopping all tasks that are currently running.
     * @method destroy
     */
    proto.destroy = proto.stopAll;

    /**
    * @class Ext.TaskManager
    * @extends Ext.util.TaskRunner
    * @singleton
    *
    * A static {@link Ext.util.TaskRunner} instance that can be used to start and stop
    * arbitrary tasks. See {@link Ext.util.TaskRunner} for supported methods and task
    * config properties.
    *
    *    // Start a simple clock task that updates a div once per second
    *    var task = {
    *       run: function(){
    *           Ext.fly('clock').update(new Date().format('g:i:s A'));
    *       },
    *       interval: 1000 //1 second
    *    }
    *
    *    Ext.TaskManager.start(task);
    *
    * See the {@link #start} method for details about how to configure a task object.
    */
    Ext.util.TaskManager = Ext.TaskManager = new me();

    /**
     * Instances of this class are created by {@link Ext.util.TaskRunner#newTask} method.
     * 
     * For details on config properties, see {@link Ext.util.TaskRunner#start}.
     * @class Ext.util.TaskRunner.Task
     */
    me.Task = new Ext.Class({
        isTask: true,

        /**
         * This flag is set to `true` by {@link #stop}.
         * @private
         */
        stopped: true, // this avoids the odd combination of !stopped && !pending

        /**
         * Override default behavior
         */
        fireOnStart: false,

        constructor: function (config) {
            Ext.apply(this, config);
        },

        /**
         * Restarts this task, clearing it duration, expiration and run count.
         * @param {Number} [interval] Optionally reset this task's interval.
         */
        restart: function (interval) {
            if (interval !== undefined) {
                this.interval = interval;
            }

            this.manager.start(this);
        },

        /**
         * Starts this task if it is not already started.
         * @param {Number} [interval] Optionally reset this task's interval.
         */
        start: function (interval) {
            if (this.stopped) {
                this.restart(interval);
            }
        },

        /**
         * Stops this task.
         */
        stop: function () {
            this.manager.stop(this);
        }
    });

    proto = me.Task.prototype;

    /**
     * Destroys this instance, stopping this task's execution.
     * @method destroy
     */
    proto.destroy = proto.stop;
});
 /**
 * @class Ext.util.Format

This class is a centralized place for formatting functions. It includes
functions to format various different types of data, such as text, dates and numeric values.

__Localization__
This class contains several options for localization. These can be set once the library has loaded,
all calls to the functions from that point will use the locale settings that were specified.
Options include:
- thousandSeparator
- decimalSeparator
- currenyPrecision
- currencySign
- currencyAtEnd
This class also uses the default date format defined here: {@link Ext.Date#defaultFormat}.

__Using with renderers__
There are two helper functions that return a new function that can be used in conjunction with
grid renderers:

    columns: [{
        dataIndex: 'date',
        renderer: Ext.util.Format.dateRenderer('Y-m-d')
    }, {
        dataIndex: 'time',
        renderer: Ext.util.Format.numberRenderer('0.000')
    }]

Functions that only take a single argument can also be passed directly:
    columns: [{
        dataIndex: 'cost',
        renderer: Ext.util.Format.usMoney
    }, {
        dataIndex: 'productCode',
        renderer: Ext.util.Format.uppercase
    }]

__Using with XTemplates__
XTemplates can also directly use Ext.util.Format functions:

    new Ext.XTemplate([
        'Date: {startDate:date("Y-m-d")}',
        'Cost: {cost:usMoney}'
    ]);

 * @markdown
 * @singleton
 */
(function() {
    Ext.ns('Ext.util');

    Ext.util.Format = {};
    var UtilFormat     = Ext.util.Format,
        stripTagsRE    = /<\/?[^>]+>/gi,
        stripScriptsRe = /(?:<script.*?>)((\n|\r|.)*?)(?:<\/script>)/ig,
        nl2brRe        = /\r?\n/g,

        // A RegExp to remove from a number format string, all characters except digits and '.'
        formatCleanRe  = /[^\d\.]/g,

        // A RegExp to remove from a number format string, all characters except digits and the local decimal separator.
        // Created on first use. The local decimal separator character must be initialized for this to be created.
        I18NFormatCleanRe;

    Ext.apply(UtilFormat, {
        /**
         * @property {String} thousandSeparator
         * <p>The character that the {@link #number} function uses as a thousand separator.</p>
         * <p>This may be overridden in a locale file.</p>
         */
        //<locale>
        thousandSeparator: ',',
        //</locale>

        /**
         * @property {String} decimalSeparator
         * <p>The character that the {@link #number} function uses as a decimal point.</p>
         * <p>This may be overridden in a locale file.</p>
         */
        //<locale>
        decimalSeparator: '.',
        //</locale>

        /**
         * @property {Number} currencyPrecision
         * <p>The number of decimal places that the {@link #currency} function displays.</p>
         * <p>This may be overridden in a locale file.</p>
         */
        //<locale>
        currencyPrecision: 2,
        //</locale>

        /**
         * @property {String} currencySign
         * <p>The currency sign that the {@link #currency} function displays.</p>
         * <p>This may be overridden in a locale file.</p>
         */
         //<locale>
        currencySign: '$',
        //</locale>

        /**
         * @property {Boolean} currencyAtEnd
         * <p>This may be set to <code>true</code> to make the {@link #currency} function
         * append the currency sign to the formatted value.</p>
         * <p>This may be overridden in a locale file.</p>
         */
        //<locale>
        currencyAtEnd: false,
        //</locale>

        /**
         * Checks a reference and converts it to empty string if it is undefined
         * @param {Object} value Reference to check
         * @return {Object} Empty string if converted, otherwise the original value
         */
        undef : function(value) {
            return value !== undefined ? value : "";
        },

        /**
         * Checks a reference and converts it to the default value if it's empty
         * @param {Object} value Reference to check
         * @param {String} defaultValue The value to insert of it's undefined (defaults to "")
         * @return {String}
         */
        defaultValue : function(value, defaultValue) {
            return value !== undefined && value !== '' ? value : defaultValue;
        },

        /**
         * Returns a substring from within an original string
         * @param {String} value The original text
         * @param {Number} start The start index of the substring
         * @param {Number} length The length of the substring
         * @return {String} The substring
         */
        substr : 'ab'.substr(-1) != 'b'
        ? function (value, start, length) {
            var str = String(value);
            return (start < 0)
                ? str.substr(Math.max(str.length + start, 0), length)
                : str.substr(start, length);
        }
        : function(value, start, length) {
            return String(value).substr(start, length);
        },

        /**
         * Converts a string to all lower case letters
         * @param {String} value The text to convert
         * @return {String} The converted text
         */
        lowercase : function(value) {
            return String(value).toLowerCase();
        },

        /**
         * Converts a string to all upper case letters
         * @param {String} value The text to convert
         * @return {String} The converted text
         */
        uppercase : function(value) {
            return String(value).toUpperCase();
        },

        /**
         * Format a number as US currency
         * @param {Number/String} value The numeric value to format
         * @return {String} The formatted currency string
         */
        usMoney : function(v) {
            return UtilFormat.currency(v, '$', 2);
        },

        /**
         * Format a number as a currency
         * @param {Number/String} value The numeric value to format
         * @param {String} sign The currency sign to use (defaults to {@link #currencySign})
         * @param {Number} decimals The number of decimals to use for the currency (defaults to {@link #currencyPrecision})
         * @param {Boolean} end True if the currency sign should be at the end of the string (defaults to {@link #currencyAtEnd})
         * @return {String} The formatted currency string
         */
        currency: function(v, currencySign, decimals, end) {
            var negativeSign = '',
                format = ",0",
                i = 0;
            v = v - 0;
            if (v < 0) {
                v = -v;
                negativeSign = '-';
            }
            decimals = Ext.isDefined(decimals) ? decimals : UtilFormat.currencyPrecision;
            format += format + (decimals > 0 ? '.' : '');
            for (; i < decimals; i++) {
                format += '0';
            }
            v = UtilFormat.number(v, format);
            if ((end || UtilFormat.currencyAtEnd) === true) {
                return Ext.String.format("{0}{1}{2}", negativeSign, v, currencySign || UtilFormat.currencySign);
            } else {
                return Ext.String.format("{0}{1}{2}", negativeSign, currencySign || UtilFormat.currencySign, v);
            }
        },

        /**
         * Formats the passed date using the specified format pattern.
         * @param {String/Date} value The value to format. If a string is passed, it is converted to a Date by the Javascript
         * Date object's <a href="http://www.w3schools.com/jsref/jsref_parse.asp">parse()</a> method.
         * @param {String} format (Optional) Any valid date format string. Defaults to {@link Ext.Date#defaultFormat}.
         * @return {String} The formatted date string.
         */
        date: function(v, format) {
            if (!v) {
                return "";
            }
            if (!Ext.isDate(v)) {
                v = new Date(Date.parse(v));
            }
            return Ext.Date.dateFormat(v, format || Ext.Date.defaultFormat);
        },

        /**
         * Returns a date rendering function that can be reused to apply a date format multiple times efficiently
         * @param {String} format Any valid date format string. Defaults to {@link Ext.Date#defaultFormat}.
         * @return {Function} The date formatting function
         */
        dateRenderer : function(format) {
            return function(v) {
                return UtilFormat.date(v, format);
            };
        },

        /**
         * Strips all HTML tags
         * @param {Object} value The text from which to strip tags
         * @return {String} The stripped text
         */
        stripTags : function(v) {
            return !v ? v : String(v).replace(stripTagsRE, "");
        },

        /**
         * Strips all script tags
         * @param {Object} value The text from which to strip script tags
         * @return {String} The stripped text
         */
        stripScripts : function(v) {
            return !v ? v : String(v).replace(stripScriptsRe, "");
        },

        /**
         * Simple format for a file size (xxx bytes, xxx KB, xxx MB)
         * @param {Number/String} size The numeric value to format
         * @return {String} The formatted file size
         */
        fileSize : function(size) {
            if (size < 1024) {
                return size + " bytes";
            } else if (size < 1048576) {
                return (Math.round(((size*10) / 1024))/10) + " KB";
            } else {
                return (Math.round(((size*10) / 1048576))/10) + " MB";
            }
        },

        /**
         * It does simple math for use in a template, for example:<pre><code>
         * var tpl = new Ext.Template('{value} * 10 = {value:math("* 10")}');
         * </code></pre>
         * @return {Function} A function that operates on the passed value.
         * @method
         */
        math : (function(){
            var fns = {};

            return function(v, a){
                if (!fns[a]) {
                    fns[a] = Ext.functionFactory('v', 'return v ' + a + ';');
                }
                return fns[a](v);
            };
        }()),

        /**
         * Rounds the passed number to the required decimal precision.
         * @param {Number/String} value The numeric value to round.
         * @param {Number} precision The number of decimal places to which to round the first parameter's value.
         * @return {Number} The rounded value.
         */
        round : function(value, precision) {
            var result = Number(value);
            if (typeof precision == 'number') {
                precision = Math.pow(10, precision);
                result = Math.round(value * precision) / precision;
            }
            return result;
        },

        /**
         * <p>Formats the passed number according to the passed format string.</p>
         * <p>The number of digits after the decimal separator character specifies the number of
         * decimal places in the resulting string. The <u>local-specific</u> decimal character is used in the result.</p>
         * <p>The <i>presence</i> of a thousand separator character in the format string specifies that
         * the <u>locale-specific</u> thousand separator (if any) is inserted separating thousand groups.</p>
         * <p>By default, "," is expected as the thousand separator, and "." is expected as the decimal separator.</p>
         * <p><b>New to Ext JS 4</b></p>
         * <p>Locale-specific characters are always used in the formatted output when inserting
         * thousand and decimal separators.</p>
         * <p>The format string must specify separator characters according to US/UK conventions ("," as the
         * thousand separator, and "." as the decimal separator)</p>
         * <p>To allow specification of format strings according to local conventions for separator characters, add
         * the string <code>/i</code> to the end of the format string.</p>
         * <div style="margin-left:40px">examples (123456.789):
         * <div style="margin-left:10px">
         * 0 - (123456) show only digits, no precision<br>
         * 0.00 - (123456.78) show only digits, 2 precision<br>
         * 0.0000 - (123456.7890) show only digits, 4 precision<br>
         * 0,000 - (123,456) show comma and digits, no precision<br>
         * 0,000.00 - (123,456.78) show comma and digits, 2 precision<br>
         * 0,0.00 - (123,456.78) shortcut method, show comma and digits, 2 precision<br>
         * To allow specification of the formatting string using UK/US grouping characters (,) and decimal (.) for international numbers, add /i to the end.
         * For example: 0.000,00/i
         * </div></div>
         * @param {Number} v The number to format.
         * @param {String} format The way you would like to format this text.
         * @return {String} The formatted number.
         */
        number : function(v, formatString) {
            if (!formatString) {
                return v;
            }
            v = Ext.Number.from(v, NaN);
            if (isNaN(v)) {
                return '';
            }
            var comma = UtilFormat.thousandSeparator,
                dec   = UtilFormat.decimalSeparator,
                i18n  = false,
                neg   = v < 0,
                hasComma,
                psplit,
                fnum,
                cnum,
                parr,
                j,
                m,
                n,
                i;

            v = Math.abs(v);

            // The "/i" suffix allows caller to use a locale-specific formatting string.
            // Clean the format string by removing all but numerals and the decimal separator.
            // Then split the format string into pre and post decimal segments according to *what* the
            // decimal separator is. If they are specifying "/i", they are using the local convention in the format string.
            if (formatString.substr(formatString.length - 2) == '/i') {
                if (!I18NFormatCleanRe) {
                    I18NFormatCleanRe = new RegExp('[^\\d\\' + UtilFormat.decimalSeparator + ']','g');
                }
                formatString = formatString.substr(0, formatString.length - 2);
                i18n   = true;
                hasComma = formatString.indexOf(comma) != -1;
                psplit = formatString.replace(I18NFormatCleanRe, '').split(dec);
            } else {
                hasComma = formatString.indexOf(',') != -1;
                psplit = formatString.replace(formatCleanRe, '').split('.');
            }

            if (psplit.length > 2) {
                //<debug>
                Ext.Error.raise({
                    sourceClass: "Ext.util.Format",
                    sourceMethod: "number",
                    value: v,
                    formatString: formatString,
                    msg: "Invalid number format, should have no more than 1 decimal"
                });
                //</debug>
            } else if (psplit.length > 1) {
                v = Ext.Number.toFixed(v, psplit[1].length);
            } else {
                v = Ext.Number.toFixed(v, 0);
            }

            fnum = v.toString();

            psplit = fnum.split('.');

            if (hasComma) {
                cnum = psplit[0];
                parr = [];
                j = cnum.length;
                m = Math.floor(j / 3);
                n = cnum.length % 3 || 3;

                for (i = 0; i < j; i += n) {
                    if (i !== 0) {
                        n = 3;
                    }

                    parr[parr.length] = cnum.substr(i, n);
                    m -= 1;
                }
                fnum = parr.join(comma);
                if (psplit[1]) {
                    fnum += dec + psplit[1];
                }
            } else {
                if (psplit[1]) {
                    fnum = psplit[0] + dec + psplit[1];
                }
            }

            if (neg) {
                /*
                 * Edge case. If we have a very small negative number it will get rounded to 0,
                 * however the initial check at the top will still report as negative. Replace
                 * everything but 1-9 and check if the string is empty to determine a 0 value.
                 */
                neg = fnum.replace(/[^1-9]/g, '') !== '';
            }

            return (neg ? '-' : '') + formatString.replace(/[\d,?\.?]+/, fnum);
        },

        /**
         * Returns a number rendering function that can be reused to apply a number format multiple times efficiently
         * @param {String} format Any valid number format string for {@link #number}
         * @return {Function} The number formatting function
         */
        numberRenderer : function(format) {
            return function(v) {
                return UtilFormat.number(v, format);
            };
        },

        /**
         * Selectively do a plural form of a word based on a numeric value. For example, in a template,
         * {commentCount:plural("Comment")}  would result in "1 Comment" if commentCount was 1 or would be "x Comments"
         * if the value is 0 or greater than 1.
         * @param {Number} value The value to compare against
         * @param {String} singular The singular form of the word
         * @param {String} plural (optional) The plural form of the word (defaults to the singular with an "s")
         */
        plural : function(v, s, p) {
            return v +' ' + (v == 1 ? s : (p ? p : s+'s'));
        },

        /**
         * Converts newline characters to the HTML tag &lt;br/>
         * @param {String} The string value to format.
         * @return {String} The string with embedded &lt;br/> tags in place of newlines.
         */
        nl2br : function(v) {
            return Ext.isEmpty(v) ? '' : v.replace(nl2brRe, '<br/>');
        },

        /**
         * Alias for {@link Ext.String#capitalize}.
         * @method
         * @inheritdoc Ext.String#capitalize
         */
        capitalize: Ext.String.capitalize,

        /**
         * Alias for {@link Ext.String#ellipsis}.
         * @method
         * @inheritdoc Ext.String#ellipsis
         */
        ellipsis: Ext.String.ellipsis,

        /**
         * Alias for {@link Ext.String#format}.
         * @method
         * @inheritdoc Ext.String#format
         */
        format: Ext.String.format,

        /**
         * Alias for {@link Ext.String#htmlDecode}.
         * @method
         * @inheritdoc Ext.String#htmlDecode
         */
        htmlDecode: Ext.String.htmlDecode,

        /**
         * Alias for {@link Ext.String#htmlEncode}.
         * @method
         * @inheritdoc Ext.String#htmlEncode
         */
        htmlEncode: Ext.String.htmlEncode,

        /**
         * Alias for {@link Ext.String#leftPad}.
         * @method
         * @inheritdoc Ext.String#leftPad
         */
        leftPad: Ext.String.leftPad,

        /**
         * Alias for {@link Ext.String#trim}.
         * @method
         * @inheritdoc Ext.String#trim
         */
        trim : Ext.String.trim,

        /**
         * Parses a number or string representing margin sizes into an object. Supports CSS-style margin declarations
         * (e.g. 10, "10", "10 10", "10 10 10" and "10 10 10 10" are all valid options and would return the same result)
         * @param {Number/String} v The encoded margins
         * @return {Object} An object with margin sizes for top, right, bottom and left
         */
        parseBox : function(box) {
          box = Ext.isEmpty(box) ? '' : box;
            if (Ext.isNumber(box)) {
                box = box.toString();
            }
            var parts  = box.split(' '),
                ln = parts.length;

            if (ln == 1) {
                parts[1] = parts[2] = parts[3] = parts[0];
            }
            else if (ln == 2) {
                parts[2] = parts[0];
                parts[3] = parts[1];
            }
            else if (ln == 3) {
                parts[3] = parts[1];
            }

            return {
                top   :parseInt(parts[0], 10) || 0,
                right :parseInt(parts[1], 10) || 0,
                bottom:parseInt(parts[2], 10) || 0,
                left  :parseInt(parts[3], 10) || 0
            };
        },

        /**
         * Escapes the passed string for use in a regular expression
         * @param {String} str
         * @return {String}
         */
        escapeRegex : function(s) {
            return s.replace(/([\-.*+?\^${}()|\[\]\/\\])/g, "\\$1");
        }
    });
}());
 /**
 * @author Jacky Nguyen <jacky@sencha.com>
 * @docauthor Jacky Nguyen <jacky@sencha.com>
 * @class Ext.Loader
 *
 * Ext.Loader is the heart of the new dynamic dependency loading capability in Ext JS 4+. It is most commonly used
 * via the {@link Ext#require} shorthand. Ext.Loader supports both asynchronous and synchronous loading
 * approaches, and leverage their advantages for the best development flow. We'll discuss about the pros and cons of each approach:
 *
 * # Asynchronous Loading #
 *
 * - Advantages:
 *     + Cross-domain
 *     + No web server needed: you can run the application via the file system protocol (i.e: `file://path/to/your/index
 *  .html`)
 *     + Best possible debugging experience: error messages come with the exact file name and line number
 *
 * - Disadvantages:
 *     + Dependencies need to be specified before-hand
 *
 * ### Method 1: Explicitly include what you need: ###
 *
 *     // Syntax
 *     Ext.require({String/Array} expressions);
 *
 *     // Example: Single alias
 *     Ext.require('widget.window');
 *
 *     // Example: Single class name
 *     Ext.require('Ext.window.Window');
 *
 *     // Example: Multiple aliases / class names mix
 *     Ext.require(['widget.window', 'layout.border', 'Ext.data.Connection']);
 *
 *     // Wildcards
 *     Ext.require(['widget.*', 'layout.*', 'Ext.data.*']);
 *
 * ### Method 2: Explicitly exclude what you don't need: ###
 *
 *     // Syntax: Note that it must be in this chaining format.
 *     Ext.exclude({String/Array} expressions)
 *        .require({String/Array} expressions);
 *
 *     // Include everything except Ext.data.*
 *     Ext.exclude('Ext.data.*').require('*');
 *
 *     // Include all widgets except widget.checkbox*,
 *     // which will match widget.checkbox, widget.checkboxfield, widget.checkboxgroup, etc.
 *     Ext.exclude('widget.checkbox*').require('widget.*');
 *
 * # Synchronous Loading on Demand #
 *
 * - Advantages:
 *     + There's no need to specify dependencies before-hand, which is always the convenience of including ext-all.js
 *  before
 *
 * - Disadvantages:
 *     + Not as good debugging experience since file name won't be shown (except in Firebug at the moment)
 *     + Must be from the same domain due to XHR restriction
 *     + Need a web server, same reason as above
 *
 * There's one simple rule to follow: Instantiate everything with Ext.create instead of the `new` keyword
 *
 *     Ext.create('widget.window', { ... }); // Instead of new Ext.window.Window({...});
 *
 *     Ext.create('Ext.window.Window', {}); // Same as above, using full class name instead of alias
 *
 *     Ext.widget('window', {}); // Same as above, all you need is the traditional `xtype`
 *
 * Behind the scene, {@link Ext.ClassManager} will automatically check whether the given class name / alias has already
 *  existed on the page. If it's not, Ext.Loader will immediately switch itself to synchronous mode and automatic load the given
 *  class and all its dependencies.
 *
 * # Hybrid Loading - The Best of Both Worlds #
 *
 * It has all the advantages combined from asynchronous and synchronous loading. The development flow is simple:
 *
 * ### Step 1: Start writing your application using synchronous approach.
 *
 * Ext.Loader will automatically fetch all dependencies on demand as they're needed during run-time. For example:
 *
 *     Ext.onReady(function(){
 *         var window = Ext.createWidget('window', {
 *             width: 500,
 *             height: 300,
 *             layout: {
 *                 type: 'border',
 *                 padding: 5
 *             },
 *             title: 'Hello Dialog',
 *             items: [{
 *                 title: 'Navigation',
 *                 collapsible: true,
 *                 region: 'west',
 *                 width: 200,
 *                 html: 'Hello',
 *                 split: true
 *             }, {
 *                 title: 'TabPanel',
 *                 region: 'center'
 *             }]
 *         });
 *
 *         window.show();
 *     })
 *
 * ### Step 2: Along the way, when you need better debugging ability, watch the console for warnings like these: ###
 *
 *     [Ext.Loader] Synchronously loading 'Ext.window.Window'; consider adding Ext.require('Ext.window.Window') before your application's code
 *     ClassManager.js:432
 *     [Ext.Loader] Synchronously loading 'Ext.layout.container.Border'; consider adding Ext.require('Ext.layout.container.Border') before your application's code
 *
 * Simply copy and paste the suggested code above `Ext.onReady`, i.e:
 *
 *     Ext.require('Ext.window.Window');
 *     Ext.require('Ext.layout.container.Border');
 *
 *     Ext.onReady(...);
 *
 * Everything should now load via asynchronous mode.
 *
 * # Deployment #
 *
 * It's important to note that dynamic loading should only be used during development on your local machines.
 * During production, all dependencies should be combined into one single JavaScript file. Ext.Loader makes
 * the whole process of transitioning from / to between development / maintenance and production as easy as
 * possible. Internally {@link Ext.Loader#history Ext.Loader.history} maintains the list of all dependencies your application
 * needs in the exact loading sequence. It's as simple as concatenating all files in this array into one,
 * then include it on top of your application.
 *
 * This process will be automated with Sencha Command, to be released and documented towards Ext JS 4 Final.
 *
 * @singleton
 */

Ext.Loader = new function() {
    var Loader = this,
        Manager = Ext.ClassManager,
        Class = Ext.Class,
        flexSetter = Ext.Function.flexSetter,
        alias = Ext.Function.alias,
        pass = Ext.Function.pass,
        defer = Ext.Function.defer,
        arrayErase = Ext.Array.erase,
        //<if nonBrowser>
        isNonBrowser = typeof window == 'undefined',
        isNodeJS = isNonBrowser && (typeof require == 'function'),
        isJsdb = isNonBrowser && typeof system != 'undefined' && system.program.search(/jsdb/) !== -1,
        isPhantomJS = (typeof phantom != 'undefined' && phantom.fs),
        //</if>
        dependencyProperties = ['extend', 'mixins', 'requires'],
        isInHistory = {},
        history = [],
        slashDotSlashRe = /\/\.\//g,
        dotRe = /\./g;

    Ext.apply(Loader, {

        /**
         * @private
         */
        isInHistory: isInHistory,

        /**
         * An array of class names to keep track of the dependency loading order.
         * This is not guaranteed to be the same everytime due to the asynchronous
         * nature of the Loader.
         *
         * @property {Array} history
         */
        history: history,

        /**
         * Configuration
         * @private
         */
        config: {
            /**
             * @cfg {Boolean} enabled
             * Whether or not to enable the dynamic dependency loading feature.
             */
            enabled: false,

            /**
             * @cfg {Boolean} scriptChainDelay
             * millisecond delay between asynchronous script injection (prevents stack overflow on some user agents)
             * 'false' disables delay but potentially increases stack load.
             */
            scriptChainDelay : false,

            /**
             * @cfg {Boolean} disableCaching
             * Appends current timestamp to script files to prevent caching.
             */
            disableCaching: true,

            /**
             * @cfg {String} disableCachingParam
             * The get parameter name for the cache buster's timestamp.
             */
            disableCachingParam: '_dc',

            /**
             * @cfg {Boolean} garbageCollect
             * True to prepare an asynchronous script tag for garbage collection (effective only
             * if {@link #preserveScripts preserveScripts} is false)
             */
            garbageCollect : false,

            /**
             * @cfg {Object} paths
             * The mapping from namespaces to file paths
             *
             *     {
             *         'Ext': '.', // This is set by default, Ext.layout.container.Container will be
             *                     // loaded from ./layout/Container.js
             *
             *         'My': './src/my_own_folder' // My.layout.Container will be loaded from
             *                                     // ./src/my_own_folder/layout/Container.js
             *     }
             *
             * Note that all relative paths are relative to the current HTML document.
             * If not being specified, for example, <code>Other.awesome.Class</code>
             * will simply be loaded from <code>./Other/awesome/Class.js</code>
             */
            paths: {
                'Ext': '.'
            },

            /**
             * @cfg {Boolean} preserveScripts
             * False to remove and optionally {@link #garbageCollect garbage-collect} asynchronously loaded scripts,
             * True to retain script element for browser debugger compatibility and improved load performance.
             */
            preserveScripts : true,

            /**
             * @cfg {String} scriptCharset
             * Optional charset to specify encoding of dynamic script content.
             */
            scriptCharset : undefined
        },

        /**
         * Set the configuration for the loader. This should be called right after ext-(debug).js
         * is included in the page, and before Ext.onReady. i.e:
         *
         *     <script type="text/javascript" src="ext-core-debug.js"></script>
         *     <script type="text/javascript">
         *         Ext.Loader.setConfig({
         *           enabled: true,
         *           paths: {
         *               'My': 'my_own_path'
         *           }
         *         });
         *     </script>
         *     <script type="text/javascript">
         *         Ext.require(...);
         *
         *         Ext.onReady(function() {
         *           // application code here
         *         });
         *     </script>
         *
         * Refer to config options of {@link Ext.Loader} for the list of possible properties
         *
         * @param {Object} config The config object to override the default values
         * @return {Ext.Loader} this
         */
        setConfig: function(name, value) {
            if (Ext.isObject(name) && arguments.length === 1) {
                Ext.merge(Loader.config, name);
            }
            else {
                Loader.config[name] = (Ext.isObject(value)) ? Ext.merge(Loader.config[name], value) : value;
            }

            return Loader;
        },

        /**
         * Get the config value corresponding to the specified name. If no name is given, will return the config object
         * @param {String} name The config property name
         * @return {Object}
         */
        getConfig: function(name) {
            if (name) {
                return Loader.config[name];
            }

            return Loader.config;
        },

        /**
         * Sets the path of a namespace.
         * For Example:
         *
         *     Ext.Loader.setPath('Ext', '.');
         *
         * @param {String/Object} name See {@link Ext.Function#flexSetter flexSetter}
         * @param {String} path See {@link Ext.Function#flexSetter flexSetter}
         * @return {Ext.Loader} this
         * @method
         */
        setPath: flexSetter(function(name, path) {
            Loader.config.paths[name] = path;

            return Loader;
        }),

        /**
         * Translates a className to a file path by adding the
         * the proper prefix and converting the .'s to /'s. For example:
         *
         *     Ext.Loader.setPath('My', '/path/to/My');
         *
         *     alert(Ext.Loader.getPath('My.awesome.Class')); // alerts '/path/to/My/awesome/Class.js'
         *
         * Note that the deeper namespace levels, if explicitly set, are always resolved first. For example:
         *
         *     Ext.Loader.setPath({
         *         'My': '/path/to/lib',
         *         'My.awesome': '/other/path/for/awesome/stuff',
         *         'My.awesome.more': '/more/awesome/path'
         *     });
         *
         *     alert(Ext.Loader.getPath('My.awesome.Class')); // alerts '/other/path/for/awesome/stuff/Class.js'
         *
         *     alert(Ext.Loader.getPath('My.awesome.more.Class')); // alerts '/more/awesome/path/Class.js'
         *
         *     alert(Ext.Loader.getPath('My.cool.Class')); // alerts '/path/to/lib/cool/Class.js'
         *
         *     alert(Ext.Loader.getPath('Unknown.strange.Stuff')); // alerts 'Unknown/strange/Stuff.js'
         *
         * @param {String} className
         * @return {String} path
         */
        getPath: function(className) {
            var path = '',
                paths = Loader.config.paths,
                prefix = Loader.getPrefix(className);

            if (prefix.length > 0) {
                if (prefix === className) {
                    return paths[prefix];
                }

                path = paths[prefix];
                className = className.substring(prefix.length + 1);
            }

            if (path.length > 0) {
                path += '/';
            }

            return path.replace(slashDotSlashRe, '/') + className.replace(dotRe, "/") + '.js';
        },

        /**
         * @private
         * @param {String} className
         */
        getPrefix: function(className) {
            var paths = Loader.config.paths,
                prefix, deepestPrefix = '';

            if (paths.hasOwnProperty(className)) {
                return className;
            }

            for (prefix in paths) {
                if (paths.hasOwnProperty(prefix) && prefix + '.' === className.substring(0, prefix.length + 1)) {
                    if (prefix.length > deepestPrefix.length) {
                        deepestPrefix = prefix;
                    }
                }
            }

            return deepestPrefix;
        },

        /**
         * @private
         * @param {String} className
         */
        isAClassNameWithAKnownPrefix: function(className) {
            var prefix = Loader.getPrefix(className);

            // we can only say it's really a class if className is not equal to any known namespace
            return prefix !== '' && prefix !== className;
        },

        /**
         * Loads all classes by the given names and all their direct dependencies; optionally executes the given callback function when
         * finishes, within the optional scope. This method is aliased by {@link Ext#require Ext.require} for convenience
         * @param {String/Array} expressions Can either be a string or an array of string
         * @param {Function} fn (Optional) The callback function
         * @param {Object} scope (Optional) The execution scope (`this`) of the callback function
         * @param {String/Array} excludes (Optional) Classes to be excluded, useful when being used with expressions
         */
        require: function(expressions, fn, scope, excludes) {
            if (fn) {
                fn.call(scope);
            }
        },

        /**
         * Synchronously loads all classes by the given names and all their direct dependencies; optionally executes the given callback function when finishes, within the optional scope. This method is aliased by {@link Ext#syncRequire} for convenience
         * @param {String/Array} expressions Can either be a string or an array of string
         * @param {Function} fn (Optional) The callback function
         * @param {Object} scope (Optional) The execution scope (`this`) of the callback function
         * @param {String/Array} excludes (Optional) Classes to be excluded, useful when being used with expressions
         */
        syncRequire: function() {},

        /**
         * Explicitly exclude files from being loaded. Useful when used in conjunction with a broad include expression.
         * Can be chained with more `require` and `exclude` methods, eg:
         *
         *     Ext.exclude('Ext.data.*').require('*');
         *
         *     Ext.exclude('widget.button*').require('widget.*');
         *
         * @param {Array} excludes
         * @return {Object} object contains `require` method for chaining
         */
        exclude: function(excludes) {
            return {
                require: function(expressions, fn, scope) {
                    return Loader.require(expressions, fn, scope, excludes);
                },

                syncRequire: function(expressions, fn, scope) {
                    return Loader.syncRequire(expressions, fn, scope, excludes);
                }
            };
        },

        /**
         * Add a new listener to be executed when all required scripts are fully loaded
         *
         * @param {Function} fn The function callback to be executed
         * @param {Object} scope The execution scope (<code>this</code>) of the callback function
         * @param {Boolean} withDomReady Whether or not to wait for document dom ready as well
         */
        onReady: function(fn, scope, withDomReady, options) {
            var oldFn;

            if (withDomReady !== false && Ext.onDocumentReady) {
                oldFn = fn;

                fn = function() {
                    Ext.onDocumentReady(oldFn, scope, options);
                };
            }

            fn.call(scope);
        }
    });

    //<feature classSystem.loader>
    var queue = [],
        isClassFileLoaded = {},
        isFileLoaded = {},
        classNameToFilePathMap = {},
        scriptElements = {},
        readyListeners = [],
        usedClasses = [],
        requiresMap = {};

    Ext.apply(Loader, {
        /**
         * @private
         */
        documentHead: typeof document != 'undefined' && (document.head || document.getElementsByTagName('head')[0]),

        /**
         * Flag indicating whether there are still files being loaded
         * @private
         */
        isLoading: false,

        /**
         * Maintain the queue for all dependencies. Each item in the array is an object of the format:
         *
         *     {
         *          requires: [...], // The required classes for this queue item
         *          callback: function() { ... } // The function to execute when all classes specified in requires exist
         *     }
         *
         * @private
         */
        queue: queue,

        /**
         * Maintain the list of files that have already been handled so that they never get double-loaded
         * @private
         */
        isClassFileLoaded: isClassFileLoaded,

        /**
         * @private
         */
        isFileLoaded: isFileLoaded,

        /**
         * Maintain the list of listeners to execute when all required scripts are fully loaded
         * @private
         */
        readyListeners: readyListeners,

        /**
         * Contains classes referenced in `uses` properties.
         * @private
         */
        optionalRequires: usedClasses,

        /**
         * Map of fully qualified class names to an array of dependent classes.
         * @private
         */
        requiresMap: requiresMap,

        /**
         * @private
         */
        numPendingFiles: 0,

        /**
         * @private
         */
        numLoadedFiles: 0,

        /** @private */
        hasFileLoadError: false,

        /**
         * @private
         */
        classNameToFilePathMap: classNameToFilePathMap,

        /**
         * The number of scripts loading via loadScript.
         * @private
         */
        scriptsLoading: 0,

        /**
         * @private
         */
        syncModeEnabled: false,

        scriptElements: scriptElements,

        /**
         * Refresh all items in the queue. If all dependencies for an item exist during looping,
         * it will execute the callback and call refreshQueue again. Triggers onReady when the queue is
         * empty
         * @private
         */
        refreshQueue: function() {
            var ln = queue.length,
                i, item, j, requires;

            // When the queue of loading classes reaches zero, trigger readiness

            if (!ln && !Loader.scriptsLoading) {
                return Loader.triggerReady();
            }

            for (i = 0; i < ln; i++) {
                item = queue[i];

                if (item) {
                    requires = item.requires;

                    // Don't bother checking when the number of files loaded
                    // is still less than the array length
                    if (requires.length > Loader.numLoadedFiles) {
                        continue;
                    }

                    // Remove any required classes that are loaded
                    for (j = 0; j < requires.length; ) {
                        if (Manager.isCreated(requires[j])) {
                            // Take out from the queue
                            arrayErase(requires, j, 1);
                        }
                        else {
                            j++;
                        }
                    }

                    // If we've ended up with no required classes, call the callback
                    if (item.requires.length === 0) {
                        arrayErase(queue, i, 1);
                        item.callback.call(item.scope);
                        Loader.refreshQueue();
                        break;
                    }
                }
            }

            return Loader;
        },

        /**
         * Inject a script element to document's head, call onLoad and onError accordingly
         * @private
         */
        injectScriptElement: function(url, onLoad, onError, scope, charset) {
            var script = document.createElement('script'),
                dispatched = false,
                config = Loader.config,
                onLoadFn = function() {

                    if(!dispatched) {
                        dispatched = true;
                        script.onload = script.onreadystatechange = script.onerror = null;
                        if (typeof config.scriptChainDelay == 'number') {
                            //free the stack (and defer the next script)
                            defer(onLoad, config.scriptChainDelay, scope);
                        } else {
                            onLoad.call(scope);
                        }
                        Loader.cleanupScriptElement(script, config.preserveScripts === false, config.garbageCollect);
                    }

                },
                onErrorFn = function(arg) {
                    defer(onError, 1, scope);   //free the stack
                    Loader.cleanupScriptElement(script, config.preserveScripts === false, config.garbageCollect);
                };

            script.type = 'text/javascript';
            script.onerror = onErrorFn;
            charset = charset || config.scriptCharset;
            if (charset) {
                script.charset = charset;
            }

            /*
             * IE9 Standards mode (and others) SHOULD follow the load event only
             * (Note: IE9 supports both onload AND readystatechange events)
             */
            if ('addEventListener' in script ) {
                script.onload = onLoadFn;
            } else if ('readyState' in script) {   // for <IE9 Compatability
                script.onreadystatechange = function() {
                    if ( this.readyState == 'loaded' || this.readyState == 'complete' ) {
                        onLoadFn();
                    }
                };
            } else {
                 script.onload = onLoadFn;
            }

            script.src = url;
            (Loader.documentHead || document.getElementsByTagName('head')[0]).appendChild(script);

            return script;
        },

        /**
         * @private
         */
        removeScriptElement: function(url) {
            if (scriptElements[url]) {
                Loader.cleanupScriptElement(scriptElements[url], true, !!Loader.getConfig('garbageCollect'));
                delete scriptElements[url];
            }

            return Loader;
        },

        /**
         * @private
         */
        cleanupScriptElement: function(script, remove, collect) {
            var prop;
            script.onload = script.onreadystatechange = script.onerror = null;
            if (remove) {
                Ext.removeNode(script);       // Remove, since its useless now
                if (collect) {
                    for (prop in script) {
                        try {
                            script[prop] = null;
                            delete script[prop];      // and prepare for GC
                        } catch (cleanEx) {
                            //ignore
                        }
                    }
                }
            }

            return Loader;
        },

        /**
         * Loads the specified script URL and calls the supplied callbacks. If this method
         * is called before {@link Ext#isReady}, the script's load will delay the transition
         * to ready. This can be used to load arbitrary scripts that may contain further
         * {@link Ext#require Ext.require} calls.
         *
         * @param {Object/String} options The options object or simply the URL to load.
         * @param {String} options.url The URL from which to load the script.
         * @param {Function} [options.onLoad] The callback to call on successful load.
         * @param {Function} [options.onError] The callback to call on failure to load.
         * @param {Object} [options.scope] The scope (`this`) for the supplied callbacks.
         */
        loadScript: function (options) {
            var config = Loader.getConfig(),
                isString = typeof options == 'string',
                url = isString ? options : options.url,
                onError = !isString && options.onError,
                onLoad = !isString && options.onLoad,
                scope = !isString && options.scope,
                onScriptError = function() {
                    Loader.numPendingFiles--;
                    Loader.scriptsLoading--;

                    if (onError) {
                        onError.call(scope, "Failed loading '" + url + "', please verify that the file exists");
                    }

                    if (Loader.numPendingFiles + Loader.scriptsLoading === 0) {
                        Loader.refreshQueue();
                    }
                },
                onScriptLoad = function () {
                    Loader.numPendingFiles--;
                    Loader.scriptsLoading--;

                    if (onLoad) {
                        onLoad.call(scope);
                    }

                    if (Loader.numPendingFiles + Loader.scriptsLoading === 0) {
                        Loader.refreshQueue();
                    }
                },
                src;

            Loader.isLoading = true;
            Loader.numPendingFiles++;
            Loader.scriptsLoading++;

            src = config.disableCaching ?
                (url + '?' + config.disableCachingParam + '=' + Ext.Date.now()) : url;

            scriptElements[url] = Loader.injectScriptElement(src, onScriptLoad, onScriptError);
        },

        /**
         * Load a script file, supports both asynchronous and synchronous approaches
         * @private
         */
        loadScriptFile: function(url, onLoad, onError, scope, synchronous) {
            if (isFileLoaded[url]) {
                return Loader;
            }

            var config = Loader.getConfig(),
                noCacheUrl = url + (config.disableCaching ? ('?' + config.disableCachingParam + '=' + Ext.Date.now()) : ''),
                isCrossOriginRestricted = false,
                xhr, status, onScriptError;

            scope = scope || Loader;

            Loader.isLoading = true;

            if (!synchronous) {
                onScriptError = function() {
                    //<debug error>
                    onError.call(scope, "Failed loading '" + url + "', please verify that the file exists", synchronous);
                    //</debug>
                };

                scriptElements[url] = Loader.injectScriptElement(noCacheUrl, onLoad, onScriptError, scope);
            } else {
                if (typeof XMLHttpRequest != 'undefined') {
                    xhr = new XMLHttpRequest();
                } else {
                    xhr = new ActiveXObject('Microsoft.XMLHTTP');
                }

                try {
                    xhr.open('GET', noCacheUrl, false);
                    xhr.send(null);
                } catch (e) {
                    isCrossOriginRestricted = true;
                }

                status = (xhr.status === 1223) ? 204 :
                    (xhr.status === 0 && (self.location || {}).protocol == 'file:') ? 200 : xhr.status;

                isCrossOriginRestricted = isCrossOriginRestricted || (status === 0);

                if (isCrossOriginRestricted
                    //<if isNonBrowser>
                    && !isPhantomJS
                    //</if>
                ) {
                    //<debug error>
                    onError.call(Loader, "Failed loading synchronously via XHR: '" + url + "'; It's likely that the file is either " +
                                       "being loaded from a different domain or from the local file system whereby cross origin " +
                                       "requests are not allowed due to security reasons. Use asynchronous loading with " +
                                       "Ext.require instead.", synchronous);
                    //</debug>
                }
                else if ((status >= 200 && status < 300) || (status === 304)
                    //<if isNonBrowser>
                    || isPhantomJS
                    //</if>
                ) {
                    // Debugger friendly, file names are still shown even though they're eval'ed code
                    // Breakpoints work on both Firebug and Chrome's Web Inspector
                    Ext.globalEval(xhr.responseText + "\n//@ sourceURL=" + url);

                    onLoad.call(scope);
                }
                else {
                    //<debug>
                    onError.call(Loader, "Failed loading synchronously via XHR: '" + url + "'; please " +
                                       "verify that the file exists. " +
                                       "XHR status code: " + status, synchronous);
                    //</debug>
                }

                // Prevent potential IE memory leak
                xhr = null;
            }
        },

        // documented above
        syncRequire: function() {
            var syncModeEnabled = Loader.syncModeEnabled;

            if (!syncModeEnabled) {
                Loader.syncModeEnabled = true;
            }

            Loader.require.apply(Loader, arguments);

            if (!syncModeEnabled) {
                Loader.syncModeEnabled = false;
            }

            Loader.refreshQueue();
        },

        // documented above
        require: function(expressions, fn, scope, excludes) {
            var excluded = {},
                included = {},
                excludedClassNames = [],
                possibleClassNames = [],
                classNames = [],
                references = [],
                callback,
                syncModeEnabled,
                filePath, expression, exclude, className,
                possibleClassName, i, j, ln, subLn;

            if (excludes) {
                // Convert possible single string to an array.
                excludes = (typeof excludes === 'string') ? [ excludes ] : excludes;

                for (i = 0,ln = excludes.length; i < ln; i++) {
                    exclude = excludes[i];

                    if (typeof exclude == 'string' && exclude.length > 0) {
                        excludedClassNames = Manager.getNamesByExpression(exclude);

                        for (j = 0,subLn = excludedClassNames.length; j < subLn; j++) {
                            excluded[excludedClassNames[j]] = true;
                        }
                    }
                }
            }

            // Convert possible single string to an array.
            expressions = (typeof expressions === 'string') ? [ expressions ] : (expressions ? expressions : []);

            if (fn) {
                if (fn.length > 0) {
                    callback = function() {
                        var classes = [],
                            i, ln;

                        for (i = 0,ln = references.length; i < ln; i++) {
                            classes.push(Manager.get(references[i]));
                        }

                        return fn.apply(this, classes);
                    };
                }
                else {
                    callback = fn;
                }
            }
            else {
                callback = Ext.emptyFn;
            }

            scope = scope || Ext.global;

            for (i = 0,ln = expressions.length; i < ln; i++) {
                expression = expressions[i];

                if (typeof expression == 'string' && expression.length > 0) {
                    possibleClassNames = Manager.getNamesByExpression(expression);
                    subLn = possibleClassNames.length;

                    for (j = 0; j < subLn; j++) {
                        possibleClassName = possibleClassNames[j];

                        if (excluded[possibleClassName] !== true) {
                            references.push(possibleClassName);

                            if (!Manager.isCreated(possibleClassName) && !included[possibleClassName]) {
                                included[possibleClassName] = true;
                                classNames.push(possibleClassName);
                            }
                        }
                    }
                }
            }

            // If the dynamic dependency feature is not being used, throw an error
            // if the dependencies are not defined
            if (classNames.length > 0) {
                if (!Loader.config.enabled) {
                    throw new Error("Ext.Loader is not enabled, so dependencies cannot be resolved dynamically. " +
                             "Missing required class" + ((classNames.length > 1) ? "es" : "") + ": " + classNames.join(', '));
                }
            }
            else {
                callback.call(scope);
                return Loader;
            }

            syncModeEnabled = Loader.syncModeEnabled;

            if (!syncModeEnabled) {
                queue.push({
                    requires: classNames.slice(), // this array will be modified as the queue is processed,
                                                  // so we need a copy of it
                    callback: callback,
                    scope: scope
                });
            }

            ln = classNames.length;

            for (i = 0; i < ln; i++) {
                className = classNames[i];

                filePath = Loader.getPath(className);

                // If we are synchronously loading a file that has already been asychronously loaded before
                // we need to destroy the script tag and revert the count
                // This file will then be forced loaded in synchronous
                if (syncModeEnabled && isClassFileLoaded.hasOwnProperty(className)) {
                    Loader.numPendingFiles--;
                    Loader.removeScriptElement(filePath);
                    delete isClassFileLoaded[className];
                }

                if (!isClassFileLoaded.hasOwnProperty(className)) {
                    isClassFileLoaded[className] = false;

                    classNameToFilePathMap[className] = filePath;

                    Loader.numPendingFiles++;
                    Loader.loadScriptFile(
                        filePath,
                        pass(Loader.onFileLoaded, [className, filePath], Loader),
                        pass(Loader.onFileLoadError, [className, filePath], Loader),
                        Loader,
                        syncModeEnabled
                    );
                }
            }

            if (syncModeEnabled) {
                callback.call(scope);

                if (ln === 1) {
                    return Manager.get(className);
                }
            }

            return Loader;
        },

        /**
         * @private
         * @param {String} className
         * @param {String} filePath
         */
        onFileLoaded: function(className, filePath) {
            Loader.numLoadedFiles++;

            isClassFileLoaded[className] = true;
            isFileLoaded[filePath] = true;

            Loader.numPendingFiles--;

            if (Loader.numPendingFiles === 0) {
                Loader.refreshQueue();
            }

            //<debug>
            if (!Loader.syncModeEnabled && Loader.numPendingFiles === 0 && Loader.isLoading && !Loader.hasFileLoadError) {
                var missingClasses = [],
                    missingPaths = [],
                    requires,
                    i, ln, j, subLn;

                for (i = 0,ln = queue.length; i < ln; i++) {
                    requires = queue[i].requires;

                    for (j = 0,subLn = requires.length; j < subLn; j++) {
                        if (isClassFileLoaded[requires[j]]) {
                            missingClasses.push(requires[j]);
                        }
                    }
                }

                if (missingClasses.length < 1) {
                    return;
                }

                missingClasses = Ext.Array.filter(Ext.Array.unique(missingClasses), function(item) {
                    return !requiresMap.hasOwnProperty(item);
                }, Loader);

                for (i = 0,ln = missingClasses.length; i < ln; i++) {
                    missingPaths.push(classNameToFilePathMap[missingClasses[i]]);
                }

                throw new Error("The following classes are not declared even if their files have been " +
                    "loaded: '" + missingClasses.join("', '") + "'. Please check the source code of their " +
                    "corresponding files for possible typos: '" + missingPaths.join("', '"));
            }
            //</debug>
        },

        /**
         * @private
         */
        onFileLoadError: function(className, filePath, errorMessage, isSynchronous) {
            Loader.numPendingFiles--;
            Loader.hasFileLoadError = true;

            //<debug error>
            throw new Error("[Ext.Loader] " + errorMessage);
            //</debug>
        },

        /**
         * @private
         * Ensure that any classes referenced in the `uses` property are loaded.
         */
        addUsedClasses: function (classes) {
            var cls, i, ln;

            if (classes) {
                classes = (typeof classes == 'string') ? [classes] : classes;
                for (i = 0, ln = classes.length; i < ln; i++) {
                    cls = classes[i];
                    if (typeof cls == 'string' && !Ext.Array.contains(usedClasses, cls)) {
                        usedClasses.push(cls);
                    }
                }
            }

            return Loader;
        },

        /**
         * @private
         */
        triggerReady: function() {
            var listener,
                i, refClasses = usedClasses;

            if (Loader.isLoading) {
                Loader.isLoading = false;

                if (refClasses.length !== 0) {
                    // Clone then empty the array to eliminate potential recursive loop issue
                    refClasses = refClasses.slice();
                    usedClasses.length = 0;
                    // this may immediately call us back if all 'uses' classes
                    // have been loaded
                    Loader.require(refClasses, Loader.triggerReady, Loader);
                    return Loader;
                }
            }

            // this method can be called with Loader.isLoading either true or false
            // (can be called with false when all 'uses' classes are already loaded)
            // this may bypass the above if condition
            while (readyListeners.length && !Loader.isLoading) {
                // calls to refreshQueue may re-enter triggerReady
                // so we cannot necessarily iterate the readyListeners array
                listener = readyListeners.shift();
                listener.fn.call(listener.scope);
            }

            return Loader;
        },

        // Documented above already
        onReady: function(fn, scope, withDomReady, options) {
            var oldFn;

            if (withDomReady !== false && Ext.onDocumentReady) {
                oldFn = fn;

                fn = function() {
                    Ext.onDocumentReady(oldFn, scope, options);
                };
            }

            if (!Loader.isLoading) {
                fn.call(scope);
            }
            else {
                readyListeners.push({
                    fn: fn,
                    scope: scope
                });
            }
        },

        /**
         * @private
         * @param {String} className
         */
        historyPush: function(className) {
            if (className && isClassFileLoaded.hasOwnProperty(className) && !isInHistory[className]) {
                isInHistory[className] = true;
                history.push(className);
            }
            return Loader;
        }
    });

    /**
     * Turns on or off the "cache buster" applied to dynamically loaded scripts. Normally
     * dynamically loaded scripts have an extra query parameter appended to avoid stale
     * cached scripts. This method can be used to disable this mechanism, and is primarily
     * useful for testing. This is done using a cookie.
     * @param {Boolean} disable True to disable the cache buster.
     * @param {String} [path="/"] An optional path to scope the cookie.
     * @private
     */
    Ext.disableCacheBuster = function (disable, path) {
        var date = new Date();
        date.setTime(date.getTime() + (disable ? 10*365 : -1) * 24*60*60*1000);
        date = date.toGMTString();
        document.cookie = 'ext-cache=1; expires=' + date + '; path='+(path || '/');
    };

    //<if nonBrowser>
    if (isNonBrowser) {
        if (isNodeJS) {
            Ext.apply(Loader, {
                syncModeEnabled: true,
                setPath: flexSetter(function(name, path) {
                    path = require('fs').realpathSync(path);
                    Loader.config.paths[name] = path;

                    return Loader;
                }),

                loadScriptFile: function(filePath, onLoad, onError, scope, synchronous) {
                    require(filePath);
                    onLoad.call(scope);
                }
            });
        }
        else if (isJsdb) {
            Ext.apply(Loader, {
                syncModeEnabled: true,
                loadScriptFile: function(filePath, onLoad, onError, scope, synchronous) {
                    load(filePath);
                    onLoad.call(scope);
                }
            });
        }
    }
    //</if>
    //</feature>

    /**
     * Convenient alias of {@link Ext.Loader#require}. Please see the introduction documentation of
     * {@link Ext.Loader} for examples.
     * @member Ext
     * @method require
     */
    Ext.require = alias(Loader, 'require');

    /**
     * Synchronous version of {@link Ext#require}, convenient alias of {@link Ext.Loader#syncRequire}.
     *
     * @member Ext
     * @method syncRequire
     */
    Ext.syncRequire = alias(Loader, 'syncRequire');

    /**
     * Convenient shortcut to {@link Ext.Loader#exclude}
     * @member Ext
     * @method exclude
     */
    Ext.exclude = alias(Loader, 'exclude');

    /**
     * @member Ext
     * @method onReady
     */
    Ext.onReady = function(fn, scope, options) {
        Loader.onReady(fn, scope, true, options);
    };

    /**
     * @cfg {String[]} requires
     * @member Ext.Class
     * List of classes that have to be loaded before instantiating this class.
     * For example:
     *
     *     Ext.define('Mother', {
     *         requires: ['Child'],
     *         giveBirth: function() {
     *             // we can be sure that child class is available.
     *             return new Child();
     *         }
     *     });
     */
    Class.registerPreprocessor('loader', function(cls, data, hooks, continueFn) {
        var me = this,
            dependencies = [],
            dependency,
            className = Manager.getName(cls),
            i, j, ln, subLn, value, propertyName, propertyValue,
            requiredMap, requiredDep;

        /*
        Loop through the dependencyProperties, look for string class names and push
        them into a stack, regardless of whether the property's value is a string, array or object. For example:
        {
              extend: 'Ext.MyClass',
              requires: ['Ext.some.OtherClass'],
              mixins: {
                  observable: 'Ext.util.Observable';
              }
        }
        which will later be transformed into:
        {
              extend: Ext.MyClass,
              requires: [Ext.some.OtherClass],
              mixins: {
                  observable: Ext.util.Observable;
              }
        }
        */

        for (i = 0,ln = dependencyProperties.length; i < ln; i++) {
            propertyName = dependencyProperties[i];

            if (data.hasOwnProperty(propertyName)) {
                propertyValue = data[propertyName];

                if (typeof propertyValue == 'string') {
                    dependencies.push(propertyValue);
                }
                else if (propertyValue instanceof Array) {
                    for (j = 0, subLn = propertyValue.length; j < subLn; j++) {
                        value = propertyValue[j];

                        if (typeof value == 'string') {
                            dependencies.push(value);
                        }
                    }
                }
                else if (typeof propertyValue != 'function') {
                    for (j in propertyValue) {
                        if (propertyValue.hasOwnProperty(j)) {
                            value = propertyValue[j];

                            if (typeof value == 'string') {
                                dependencies.push(value);
                            }
                        }
                    }
                }
            }
        }

        if (dependencies.length === 0) {
            return;
        }

        //<feature classSystem.loader>
        //<debug error>
        var deadlockPath = [],
            detectDeadlock;

        /*
        Automatically detect deadlocks before-hand,
        will throw an error with detailed path for ease of debugging. Examples of deadlock cases:

        - A extends B, then B extends A
        - A requires B, B requires C, then C requires A

        The detectDeadlock function will recursively transverse till the leaf, hence it can detect deadlocks
        no matter how deep the path is.
        */

        if (className) {
            requiresMap[className] = dependencies;
            //<debug>
            requiredMap = Loader.requiredByMap || (Loader.requiredByMap = {});

            for (i = 0,ln = dependencies.length; i < ln; i++) {
                dependency = dependencies[i];
                (requiredMap[dependency] || (requiredMap[dependency] = [])).push(className);
            }
            //</debug>
            detectDeadlock = function(cls) {
                deadlockPath.push(cls);

                if (requiresMap[cls]) {
                    if (Ext.Array.contains(requiresMap[cls], className)) {
                        throw new Error("Deadlock detected while loading dependencies! '" + className + "' and '" +
                                deadlockPath[1] + "' " + "mutually require each other. Path: " +
                                deadlockPath.join(' -> ') + " -> " + deadlockPath[0]);
                    }

                    for (i = 0,ln = requiresMap[cls].length; i < ln; i++) {
                        detectDeadlock(requiresMap[cls][i]);
                    }
                }
            };

            detectDeadlock(className);
        }

        //</debug>
        //</feature>

        Loader.require(dependencies, function() {
            for (i = 0,ln = dependencyProperties.length; i < ln; i++) {
                propertyName = dependencyProperties[i];

                if (data.hasOwnProperty(propertyName)) {
                    propertyValue = data[propertyName];

                    if (typeof propertyValue == 'string') {
                        data[propertyName] = Manager.get(propertyValue);
                    }
                    else if (propertyValue instanceof Array) {
                        for (j = 0, subLn = propertyValue.length; j < subLn; j++) {
                            value = propertyValue[j];

                            if (typeof value == 'string') {
                                data[propertyName][j] = Manager.get(value);
                            }
                        }
                    }
                    else if (typeof propertyValue != 'function') {
                        for (var k in propertyValue) {
                            if (propertyValue.hasOwnProperty(k)) {
                                value = propertyValue[k];

                                if (typeof value == 'string') {
                                    data[propertyName][k] = Manager.get(value);
                                }
                            }
                        }
                    }
                }
            }

            continueFn.call(me, cls, data, hooks);
        });

        return false;
    }, true, 'after', 'className');

    //<feature classSystem.loader>
    /**
     * @cfg {String[]} uses
     * @member Ext.Class
     * List of optional classes to load together with this class. These aren't neccessarily loaded before
     * this class is created, but are guaranteed to be available before Ext.onReady listeners are
     * invoked. For example:
     *
     *     Ext.define('Mother', {
     *         uses: ['Child'],
     *         giveBirth: function() {
     *             // This code might, or might not work:
     *             // return new Child();
     *
     *             // Instead use Ext.create() to load the class at the spot if not loaded already:
     *             return Ext.create('Child');
     *         }
     *     });
     */
    Manager.registerPostprocessor('uses', function(name, cls, data) {
        var uses = data.uses;
        if (uses) {
            Loader.addUsedClasses(uses);
        }
    });

    Manager.onCreated(Loader.historyPush);
    //</feature>
};
 /**
 * @class Ext.util.DelayedTask
 * 
 * The DelayedTask class provides a convenient way to "buffer" the execution of a method,
 * performing setTimeout where a new timeout cancels the old timeout. When called, the
 * task will wait the specified time period before executing. If durng that time period,
 * the task is called again, the original call will be cancelled. This continues so that
 * the function is only called a single time for each iteration.
 * 
 * This method is especially useful for things like detecting whether a user has finished
 * typing in a text field. An example would be performing validation on a keypress. You can
 * use this class to buffer the keypress events for a certain number of milliseconds, and
 * perform only if they stop for that amount of time.  
 * 
 * ## Usage
 * 
 *     var task = new Ext.util.DelayedTask(function(){
 *         alert(Ext.getDom('myInputField').value.length);
 *     });
 *     
 *     // Wait 500ms before calling our function. If the user presses another key
 *     // during that 500ms, it will be cancelled and we'll wait another 500ms.
 *     Ext.get('myInputField').on('keypress', function(){
 *         task.{@link #delay}(500);
 *     });
 * 
 * Note that we are using a DelayedTask here to illustrate a point. The configuration
 * option `buffer` for {@link Ext.util.Observable#addListener addListener/on} will
 * also setup a delayed task for you to buffer events.
 * 
 * @constructor The parameters to this constructor serve as defaults and are not required.
 * @param {Function} fn (optional) The default function to call. If not specified here, it must be specified during the {@link #delay} call.
 * @param {Object} scope (optional) The default scope (The <code><b>this</b></code> reference) in which the
 * function is called. If not specified, <code>this</code> will refer to the browser window.
 * @param {Array} args (optional) The default Array of arguments.
 */
Ext.util.DelayedTask = function(fn, scope, args) {
    var me = this,
        id,
        call = function() {
            clearInterval(id);
            id = null;
            fn.apply(scope, args || []);
        };

    /**
     * Cancels any pending timeout and queues a new one
     * @param {Number} delay The milliseconds to delay
     * @param {Function} newFn (optional) Overrides function passed to constructor
     * @param {Object} newScope (optional) Overrides scope passed to constructor. Remember that if no scope
     * is specified, <code>this</code> will refer to the browser window.
     * @param {Array} newArgs (optional) Overrides args passed to constructor
     */
    this.delay = function(delay, newFn, newScope, newArgs) {
        me.cancel();
        fn = newFn || fn;
        scope = newScope || scope;
        args = newArgs || args;
        id = setInterval(call, delay);
    };

    /**
     * Cancel the last queued timeout
     */
    this.cancel = function(){
        if (id) {
            clearInterval(id);
            id = null;
        }
    };
}; Ext.require('Ext.util.DelayedTask', function() {

    /**
     * Represents single event type that an Observable object listens to.
     * All actual listeners are tracked inside here.  When the event fires,
     * it calls all the registered listener functions.
     *
     * @private
     */
    Ext.util.Event = Ext.extend(Object, (function() {
        function createTargeted(handler, listener, o, scope){
            return function(){
                if (o.target === arguments[0]){
                    handler.apply(scope, arguments);
                }
            };
        }

        function createBuffered(handler, listener, o, scope) {
            listener.task = new Ext.util.DelayedTask();
            return function() {
                listener.task.delay(o.buffer, handler, scope, Ext.Array.toArray(arguments));
            };
        }

        function createDelayed(handler, listener, o, scope) {
            return function() {
                var task = new Ext.util.DelayedTask();
                if (!listener.tasks) {
                    listener.tasks = [];
                }
                listener.tasks.push(task);
                task.delay(o.delay || 10, handler, scope, Ext.Array.toArray(arguments));
            };
        }

        function createSingle(handler, listener, o, scope) {
            return function() {
                var event = listener.ev;

                if (event.removeListener(listener.fn, scope) && event.observable) {
                    // Removing from a regular Observable-owned, named event (not an anonymous
                    // event such as Ext's readyEvent): Decrement the listeners count
                    event.observable.hasListeners[event.name]--;
                }

                return handler.apply(scope, arguments);
            };
        }

        return {
            /**
             * @property {Boolean} isEvent
             * `true` in this class to identify an object as an instantiated Event, or subclass thereof.
             */
            isEvent: true,

            constructor: function(observable, name) {
                this.name = name;
                this.observable = observable;
                this.listeners = [];
            },

            addListener: function(fn, scope, options) {
                var me = this,
                    listener;
                    scope = scope || me.observable;

                //<debug error>
                if (!fn) {
                    Ext.Error.raise({
                        sourceClass: Ext.getClassName(this.observable),
                        sourceMethod: "addListener",
                        msg: "The specified callback function is undefined"
                    });
                }
                //</debug>

                if (!me.isListening(fn, scope)) {
                    listener = me.createListener(fn, scope, options);
                    if (me.firing) {
                        // if we are currently firing this event, don't disturb the listener loop
                        me.listeners = me.listeners.slice(0);
                    }
                    me.listeners.push(listener);
                }
            },

            createListener: function(fn, scope, o) {
                o = o || {};
                scope = scope || this.observable;

                var listener = {
                        fn: fn,
                        scope: scope,
                        o: o,
                        ev: this
                    },
                    handler = fn;

                // The order is important. The 'single' wrapper must be wrapped by the 'buffer' and 'delayed' wrapper
                // because the event removal that the single listener does destroys the listener's DelayedTask(s)
                if (o.single) {
                    handler = createSingle(handler, listener, o, scope);
                }
                if (o.target) {
                    handler = createTargeted(handler, listener, o, scope);
                }
                if (o.delay) {
                    handler = createDelayed(handler, listener, o, scope);
                }
                if (o.buffer) {
                    handler = createBuffered(handler, listener, o, scope);
                }

                listener.fireFn = handler;
                return listener;
            },

            findListener: function(fn, scope) {
                var listeners = this.listeners,
                i = listeners.length,
                listener,
                s;

                while (i--) {
                    listener = listeners[i];
                    if (listener) {
                        s = listener.scope;
                        if (listener.fn == fn && (s == scope || s == this.observable)) {
                            return i;
                        }
                    }
                }

                return - 1;
            },

            isListening: function(fn, scope) {
                return this.findListener(fn, scope) !== -1;
            },

            removeListener: function(fn, scope) {
                var me = this,
                    index,
                    listener,
                    k;
                index = me.findListener(fn, scope);
                if (index != -1) {
                    listener = me.listeners[index];

                    if (me.firing) {
                        me.listeners = me.listeners.slice(0);
                    }

                    // cancel and remove a buffered handler that hasn't fired yet
                    if (listener.task) {
                        listener.task.cancel();
                        delete listener.task;
                    }

                    // cancel and remove all delayed handlers that haven't fired yet
                    k = listener.tasks && listener.tasks.length;
                    if (k) {
                        while (k--) {
                            listener.tasks[k].cancel();
                        }
                        delete listener.tasks;
                    }

                    // remove this listener from the listeners array
                    Ext.Array.erase(me.listeners, index, 1);
                    return true;
                }

                return false;
            },

            // Iterate to stop any buffered/delayed events
            clearListeners: function() {
                var listeners = this.listeners,
                    i = listeners.length;

                while (i--) {
                    this.removeListener(listeners[i].fn, listeners[i].scope);
                }
            },

            fire: function() {
                var me = this,
                    listeners = me.listeners,
                    count = listeners.length,
                    i,
                    args,
                    listener;

                if (count > 0) {
                    me.firing = true;
                    for (i = 0; i < count; i++) {
                        listener = listeners[i];
                        args = arguments.length ? Array.prototype.slice.call(arguments, 0) : [];
                        if (listener.o) {
                            args.push(listener.o);
                        }
                        if (listener && listener.fireFn.apply(listener.scope || me.observable, args) === false) {
                            return (me.firing = false);
                        }
                    }
                }
                me.firing = false;
                return true;
            }
        };
    }()));
});



Ext.Loader.setConfig({
    enabled: true,
	paths: {
		'Ext':  extBasePath
    }
});


var window = {
    status:__defineSetter__("status", function(debugStatusMsg){
        console.log(debugStatusMsg);
    })
}

Ext.Error = {
    raise:function(msg){
        console.log("----------------ExtJS ERROR----------------");
        console.error(msg)
    }
}


Ext.callback = function(callback, scope, args, delay){
    if(Ext.isFunction(callback)){
        args = args || [];
        scope = scope || window;
        if (delay) {
            Ext.defer(callback, delay, scope, args);
        } else {
            callback.apply(scope, args);
        }
    }
};


Ext.Loader.isFileLoaded={"/Users/age/git/explorer/node_modules/extjs-node/src/ext/src/util/Observable.js":true,"/Users/age/git/explorer/node_modules/extjs-node/src/ext/src/util/HashMap.js":true,"/Users/age/git/explorer/node_modules/extjs-node/src/ext/src/AbstractManager.js":true,"/Users/age/git/explorer/node_modules/extjs-node/src/ext/src/data/association/Association.js":true,"/Users/age/git/explorer/node_modules/extjs-node/src/ext/src/ModelManager.js":true,"/Users/age/git/explorer/node_modules/extjs-node/src/ext/src/data/IdGenerator.js":true,"/Users/age/git/explorer/node_modules/extjs-node/src/ext/src/data/SortTypes.js":true,"/Users/age/git/explorer/node_modules/extjs-node/src/ext/src/data/Types.js":true,"/Users/age/git/explorer/node_modules/extjs-node/src/ext/src/data/Field.js":true,"/Users/age/git/explorer/node_modules/extjs-node/src/ext/src/util/Filter.js":true,"/Users/age/git/explorer/node_modules/extjs-node/src/ext/src/util/AbstractMixedCollection.js":true,"/Users/age/git/explorer/node_modules/extjs-node/src/ext/src/util/Sorter.js":true,"/Users/age/git/explorer/node_modules/extjs-node/src/ext/src/util/Sortable.js":true,"/Users/age/git/explorer/node_modules/extjs-node/src/ext/src/util/MixedCollection.js":true,"/Users/age/git/explorer/node_modules/extjs-node/src/ext/src/data/Errors.js":true,"/Users/age/git/explorer/node_modules/extjs-node/src/ext/src/data/Operation.js":true,"/Users/age/git/explorer/node_modules/extjs-node/src/ext/src/data/validations.js":true,"/Users/age/git/explorer/node_modules/extjs-node/src/ext/src/data/Model.js":true};

/**
 * Base class that provides a common interface for publishing events. Subclasses are expected to to have a property
 * "events" with all the events defined, and, optionally, a property "listeners" with configured listeners defined.
 *
 * For example:
 *
 *     Ext.define('Employee', {
 *         mixins: {
 *             observable: 'Ext.util.Observable'
 *         },
 *
 *         constructor: function (config) {
 *             // The Observable constructor copies all of the properties of `config` on
 *             // to `this` using {@link Ext#apply}. Further, the `listeners` property is
 *             // processed to add listeners.
 *             //
 *             this.mixins.observable.constructor.call(this, config);
 *
 *             this.addEvents(
 *                 'fired',
 *                 'quit'
 *             );
 *         }
 *     });
 *
 * This could then be used like this:
 *
 *     var newEmployee = new Employee({
 *         name: employeeName,
 *         listeners: {
 *             quit: function() {
 *                 // By default, "this" will be the object that fired the event.
 *                 alert(this.name + " has quit!");
 *             }
 *         }
 *     });
 */
Ext.define('Ext.util.Observable', {

    /* Begin Definitions */

    requires: ['Ext.util.Event'],

    statics: {
        /**
         * Removes **all** added captures from the Observable.
         *
         * @param {Ext.util.Observable} o The Observable to release
         * @static
         */
        releaseCapture: function(o) {
            o.fireEvent = this.prototype.fireEvent;
        },

        /**
         * Starts capture on the specified Observable. All events will be passed to the supplied function with the event
         * name + standard signature of the event **before** the event is fired. If the supplied function returns false,
         * the event will not fire.
         *
         * @param {Ext.util.Observable} o The Observable to capture events from.
         * @param {Function} fn The function to call when an event is fired.
         * @param {Object} scope (optional) The scope (`this` reference) in which the function is executed. Defaults to
         * the Observable firing the event.
         * @static
         */
        capture: function(o, fn, scope) {
            o.fireEvent = Ext.Function.createInterceptor(o.fireEvent, fn, scope);
        },

        /**
         * Sets observability on the passed class constructor.
         *
         * This makes any event fired on any instance of the passed class also fire a single event through
         * the **class** allowing for central handling of events on many instances at once.
         *
         * Usage:
         *
         *     Ext.util.Observable.observe(Ext.data.Connection);
         *     Ext.data.Connection.on('beforerequest', function(con, options) {
         *         console.log('Ajax request made to ' + options.url);
         *     });
         *
         * @param {Function} c The class constructor to make observable.
         * @param {Object} listeners An object containing a series of listeners to add. See {@link #addListener}.
         * @static
         */
        observe: function(cls, listeners) {
            if (cls) {
                if (!cls.isObservable) {
                    Ext.applyIf(cls, new this());
                    this.capture(cls.prototype, cls.fireEvent, cls);
                }
                if (Ext.isObject(listeners)) {
                    cls.on(listeners);
                }
            }
            return cls;
        },

        /**
         * Prepares a given class for observable instances. This method is called when a
         * class derives from this class or uses this class as a mixin.
         * @param {Function} T The class constructor to prepare.
         * @private
         */
        prepareClass: function (T, mixin) {
            // T.hasListeners is the object to track listeners on class T. This object's
            // prototype (__proto__) is the "hasListeners" of T.superclass.

            // Instances of T will create "hasListeners" that have T.hasListeners as their
            // immediate prototype (__proto__).

            if (!T.HasListeners) {
                // We create a HasListeners "class" for this class. The "prototype" of the
                // HasListeners class is an instance of the HasListeners class associated
                // with this class's super class (or with Observable).
                var Observable = Ext.util.Observable,
                    HasListeners = function () {},
                    SuperHL = T.superclass.HasListeners || (mixin && mixin.HasListeners) ||
                              Observable.HasListeners;

                // Make the HasListener class available on the class and its prototype:
                T.prototype.HasListeners = T.HasListeners = HasListeners;

                // And connect its "prototype" to the new HasListeners of our super class
                // (which is also the class-level "hasListeners" instance).
                HasListeners.prototype = T.hasListeners = new SuperHL();
            }
        }
    },

    /* End Definitions */

    /**
     * @cfg {Object} listeners
     *
     * A config object containing one or more event handlers to be added to this object during initialization. This
     * should be a valid listeners config object as specified in the {@link #addListener} example for attaching multiple
     * handlers at once.
     *
     * **DOM events from Ext JS {@link Ext.Component Components}**
     *
     * While _some_ Ext JS Component classes export selected DOM events (e.g. "click", "mouseover" etc), this is usually
     * only done when extra value can be added. For example the {@link Ext.view.View DataView}'s **`{@link
     * Ext.view.View#itemclick itemclick}`** event passing the node clicked on. To access DOM events directly from a
     * child element of a Component, we need to specify the `element` option to identify the Component property to add a
     * DOM listener to:
     *
     *     new Ext.panel.Panel({
     *         width: 400,
     *         height: 200,
     *         dockedItems: [{
     *             xtype: 'toolbar'
     *         }],
     *         listeners: {
     *             click: {
     *                 element: 'el', //bind to the underlying el property on the panel
     *                 fn: function(){ console.log('click el'); }
     *             },
     *             dblclick: {
     *                 element: 'body', //bind to the underlying body property on the panel
     *                 fn: function(){ console.log('dblclick body'); }
     *             }
     *         }
     *     });
     */

    /**
     * @property {Boolean} isObservable
     * `true` in this class to identify an object as an instantiated Observable, or subclass thereof.
     */
    isObservable: true,

    /**
     * @property {Object} hasListeners
     * @readonly
     * This object holds a key for any event that has a listener. The listener may be set
     * directly on the instance, or on its class or a super class (via {@link #observe}) or
     * on the {@link Ext.app.EventBus MVC EventBus}. The values of this object are truthy
     * (a non-zero number) and falsy (0 or undefined). They do not represent an exact count
     * of listeners. The value for an event is truthy if the event must be fired and is
     * falsy if there is no need to fire the event.
     * 
     * The intended use of this property is to avoid the expense of fireEvent calls when
     * there are no listeners. This can be particularly helpful when one would otherwise
     * have to call fireEvent hundreds or thousands of times. It is used like this:
     * 
     *      if (this.hasListeners.foo) {
     *          this.fireEvent('foo', this, arg1);
     *      }
     */

    constructor: function(config) {
        var me = this;

        Ext.apply(me, config);

        // The subclass may have already initialized it.
        if (!me.hasListeners) {
            me.hasListeners = new me.HasListeners();
        }

        me.events = me.events || {};
        if (me.listeners) {
            me.on(me.listeners);
            me.listeners = null; //Set as an instance property to pre-empt the prototype in case any are set there.
        }

        if (me.bubbleEvents) {
            me.enableBubble(me.bubbleEvents);
        }
    },

    onClassExtended: function (T) {
        if (!T.HasListeners) {
            // Some classes derive from us and some others derive from those classes. All
            // of these are passed to this method.
            Ext.util.Observable.prepareClass(T);
        }
    },

    // @private
    eventOptionsRe : /^(?:scope|delay|buffer|single|stopEvent|preventDefault|stopPropagation|normalized|args|delegate|element|vertical|horizontal|freezeEvent)$/,

    /**
     * Adds listeners to any Observable object (or Ext.Element) which are automatically removed when this Component is
     * destroyed.
     *
     * @param {Ext.util.Observable/Ext.Element} item The item to which to add a listener/listeners.
     * @param {Object/String} ename The event name, or an object containing event name properties.
     * @param {Function} fn (optional) If the `ename` parameter was an event name, this is the handler function.
     * @param {Object} scope (optional) If the `ename` parameter was an event name, this is the scope (`this` reference)
     * in which the handler function is executed.
     * @param {Object} opt (optional) If the `ename` parameter was an event name, this is the
     * {@link Ext.util.Observable#addListener addListener} options.
     */
    addManagedListener : function(item, ename, fn, scope, options) {
        var me = this,
            managedListeners = me.managedListeners = me.managedListeners || [],
            config;

        if (typeof ename !== 'string') {
            options = ename;
            for (ename in options) {
                if (options.hasOwnProperty(ename)) {
                    config = options[ename];
                    if (!me.eventOptionsRe.test(ename)) {
                        me.addManagedListener(item, ename, config.fn || config, config.scope || options.scope, config.fn ? config : options);
                    }
                }
            }
        }
        else {
            managedListeners.push({
                item: item,
                ename: ename,
                fn: fn,
                scope: scope,
                options: options
            });

            item.on(ename, fn, scope, options);
        }
    },

    /**
     * Removes listeners that were added by the {@link #mon} method.
     *
     * @param {Ext.util.Observable/Ext.Element} item The item from which to remove a listener/listeners.
     * @param {Object/String} ename The event name, or an object containing event name properties.
     * @param {Function} fn (optional) If the `ename` parameter was an event name, this is the handler function.
     * @param {Object} scope (optional) If the `ename` parameter was an event name, this is the scope (`this` reference)
     * in which the handler function is executed.
     */
    removeManagedListener : function(item, ename, fn, scope) {
        var me = this,
            options,
            config,
            managedListeners,
            length,
            i;

        if (typeof ename !== 'string') {
            options = ename;
            for (ename in options) {
                if (options.hasOwnProperty(ename)) {
                    config = options[ename];
                    if (!me.eventOptionsRe.test(ename)) {
                        me.removeManagedListener(item, ename, config.fn || config, config.scope || options.scope);
                    }
                }
            }
        }

        managedListeners = me.managedListeners ? me.managedListeners.slice() : [];

        for (i = 0, length = managedListeners.length; i < length; i++) {
            me.removeManagedListenerItem(false, managedListeners[i], item, ename, fn, scope);
        }
    },

    /**
     * Fires the specified event with the passed parameters (minus the event name, plus the `options` object passed
     * to {@link #addListener}).
     *
     * An event may be set to bubble up an Observable parent hierarchy (See {@link Ext.Component#getBubbleTarget}) by
     * calling {@link #enableBubble}.
     *
     * @param {String} eventName The name of the event to fire.
     * @param {Object...} args Variable number of parameters are passed to handlers.
     * @return {Boolean} returns false if any of the handlers return false otherwise it returns true.
     */
    fireEvent: function(eventName) {
        eventName = eventName.toLowerCase();
        var me = this,
            events = me.events,
            event = events && events[eventName],
            ret = true;

        // Only continue firing the event if there are listeners to be informed.
        // Bubbled events will always have a listener count, so will be fired.
        if (event && me.hasListeners[eventName]) {
            ret = me.continueFireEvent(eventName, Ext.Array.slice(arguments, 1), event.bubble);
        }
        return ret;
    },

    /**
     * Continue to fire event.
     * @private
     *
     * @param {String} eventName
     * @param {Array} args
     * @param {Boolean} bubbles
     */
    continueFireEvent: function(eventName, args, bubbles) {
        var target = this,
            queue, event,
            ret = true;

        do {
            if (target.eventsSuspended) {
                if ((queue = target.eventQueue)) {
                    queue.push([eventName, args, bubbles]);
                }
                return ret;
            } else {
                event = target.events[eventName];
                // Continue bubbling if event exists and it is `true` or the handler didn't returns false and it
                // configure to bubble.
                if (event && event != true) {
                    if ((ret = event.fire.apply(event, args)) === false) {
                        break;
                    }
                }
            }
        } while (bubbles && (target = target.getBubbleParent()));
        return ret;
    },

    /**
     * Gets the bubbling parent for an Observable
     * @private
     * @return {Ext.util.Observable} The bubble parent. null is returned if no bubble target exists
     */
    getBubbleParent: function(){
        var me = this, parent = me.getBubbleTarget && me.getBubbleTarget();
        if (parent && parent.isObservable) {
            return parent;
        }
        return null;
    },

    /**
     * Appends an event handler to this object.  For example:
     *
     *     myGridPanel.on("mouseover", this.onMouseOver, this);
     *
     * The method also allows for a single argument to be passed which is a config object
     * containing properties which specify multiple events. For example:
     *
     *     myGridPanel.on({
     *         cellClick: this.onCellClick,
     *         mouseover: this.onMouseOver,
     *         mouseout: this.onMouseOut,
     *         scope: this // Important. Ensure "this" is correct during handler execution
     *     });
     *
     * One can also specify options for each event handler separately:
     *
     *     myGridPanel.on({
     *         cellClick: {fn: this.onCellClick, scope: this, single: true},
     *         mouseover: {fn: panel.onMouseOver, scope: panel}
     *     });
     *
     * *Names* of methods in a specified scope may also be used. Note that
     * `scope` MUST be specified to use this option:
     *
     *     myGridPanel.on({
     *         cellClick: {fn: 'onCellClick', scope: this, single: true},
     *         mouseover: {fn: 'onMouseOver', scope: panel}
     *     });
     *
     * @param {String/Object} eventName The name of the event to listen for.
     * May also be an object who's property names are event names.
     *
     * @param {Function} [fn] The method the event invokes, or *if `scope` is specified, the *name* of the method within
     * the specified `scope`.  Will be called with arguments
     * given to {@link #fireEvent} plus the `options` parameter described below.
     *
     * @param {Object} [scope] The scope (`this` reference) in which the handler function is
     * executed. **If omitted, defaults to the object which fired the event.**
     *
     * @param {Object} [options] An object containing handler configuration.
     *
     * **Note:** Unlike in ExtJS 3.x, the options object will also be passed as the last
     * argument to every event handler.
     *
     * This object may contain any of the following properties:
     *
     * @param {Object} options.scope
     *   The scope (`this` reference) in which the handler function is executed. **If omitted,
     *   defaults to the object which fired the event.**
     *
     * @param {Number} options.delay
     *   The number of milliseconds to delay the invocation of the handler after the event fires.
     *
     * @param {Boolean} options.single
     *   True to add a handler to handle just the next firing of the event, and then remove itself.
     *
     * @param {Number} options.buffer
     *   Causes the handler to be scheduled to run in an {@link Ext.util.DelayedTask} delayed
     *   by the specified number of milliseconds. If the event fires again within that time,
     *   the original handler is _not_ invoked, but the new handler is scheduled in its place.
     *
     * @param {Ext.util.Observable} options.target
     *   Only call the handler if the event was fired on the target Observable, _not_ if the event
     *   was bubbled up from a child Observable.
     *
     * @param {String} options.element
     *   **This option is only valid for listeners bound to {@link Ext.Component Components}.**
     *   The name of a Component property which references an element to add a listener to.
     *
     *   This option is useful during Component construction to add DOM event listeners to elements of
     *   {@link Ext.Component Components} which will exist only after the Component is rendered.
     *   For example, to add a click listener to a Panel's body:
     *
     *       new Ext.panel.Panel({
     *           title: 'The title',
     *           listeners: {
     *               click: this.handlePanelClick,
     *               element: 'body'
     *           }
     *       });
     *
     * **Combining Options**
     *
     * Using the options argument, it is possible to combine different types of listeners:
     *
     * A delayed, one-time listener.
     *
     *     myPanel.on('hide', this.handleClick, this, {
     *         single: true,
     *         delay: 100
     *     });
     *
     */
    addListener: function(ename, fn, scope, options) {
        var me = this,
            config, event, hasListeners;

        if (typeof ename !== 'string') {
            options = ename;
            for (ename in options) {
                if (options.hasOwnProperty(ename)) {
                    config = options[ename];
                    if (!me.eventOptionsRe.test(ename)) {
                        me.addListener(ename, config.fn || config, config.scope || options.scope, config.fn ? config : options);
                    }
                }
            }
        } else {
            ename = ename.toLowerCase();
            me.events[ename] = me.events[ename] || true;
            event = me.events[ename] || true;
            if (Ext.isBoolean(event)) {
                me.events[ename] = event = new Ext.util.Event(me, ename);
            }

            // Allow listeners: { click: 'onClick', scope: myObject }
            if (typeof fn === 'string') {
                //<debug>
                if (!(scope[fn] || me[fn])) {
                    Ext.Error.raise('No method named "' + fn + '"');
                }
                //</debug>
                fn = scope[fn] || me[fn];
            }
            event.addListener(fn, scope, Ext.isObject(options) ? options : {});

            hasListeners = me.hasListeners;
            if (hasListeners.hasOwnProperty(ename)) {
                // if we already have listeners at this level, just increment the count...
                ++hasListeners[ename];
            } else {
                // otherwise, start the count at 1 (which hides whatever is in our prototype
                // chain)...
                hasListeners[ename] = 1;
            }
        }
    },

    /**
     * Removes an event handler.
     *
     * @param {String} eventName The type of event the handler was associated with.
     * @param {Function} fn The handler to remove. **This must be a reference to the function passed into the
     * {@link #addListener} call.**
     * @param {Object} scope (optional) The scope originally specified for the handler. It must be the same as the
     * scope argument specified in the original call to {@link #addListener} or the listener will not be removed.
     */
    removeListener: function(ename, fn, scope) {
        var me = this,
            config,
            event,
            options;

        if (typeof ename !== 'string') {
            options = ename;
            for (ename in options) {
                if (options.hasOwnProperty(ename)) {
                    config = options[ename];
                    if (!me.eventOptionsRe.test(ename)) {
                        me.removeListener(ename, config.fn || config, config.scope || options.scope);
                    }
                }
            }
        } else {
            ename = ename.toLowerCase();
            event = me.events[ename];
            if (event && event.isEvent) {
                event.removeListener(fn, scope);

                if (! --me.hasListeners[ename]) {
                    // Delete this entry, since 0 does not mean no one is listening, just
                    // that no one is *directly& listening. This allows the eventBus or
                    // class observers to "poke" through and expose their presence.
                    delete me.hasListeners[ename];
                }
            }
        }
    },

    /**
     * Removes all listeners for this object including the managed listeners
     */
    clearListeners: function() {
        var events = this.events,
            event,
            key;

        for (key in events) {
            if (events.hasOwnProperty(key)) {
                event = events[key];
                if (event.isEvent) {
                    event.clearListeners();
                }
            }
        }

        this.clearManagedListeners();
    },

    //<debug>
    purgeListeners : function() {
        if (Ext.global.console) {
            Ext.global.console.warn('Observable: purgeListeners has been deprecated. Please use clearListeners.');
        }
        return this.clearListeners.apply(this, arguments);
    },
    //</debug>

    /**
     * Removes all managed listeners for this object.
     */
    clearManagedListeners : function() {
        var managedListeners = this.managedListeners || [],
            i = 0,
            len = managedListeners.length;

        for (; i < len; i++) {
            this.removeManagedListenerItem(true, managedListeners[i]);
        }

        this.managedListeners = [];
    },

    /**
     * Remove a single managed listener item
     * @private
     * @param {Boolean} isClear True if this is being called during a clear
     * @param {Object} managedListener The managed listener item
     * See removeManagedListener for other args
     */
    removeManagedListenerItem: function(isClear, managedListener, item, ename, fn, scope){
        if (isClear || (managedListener.item === item && managedListener.ename === ename && (!fn || managedListener.fn === fn) && (!scope || managedListener.scope === scope))) {
            managedListener.item.un(managedListener.ename, managedListener.fn, managedListener.scope);
            if (!isClear) {
                Ext.Array.remove(this.managedListeners, managedListener);
            }
        }
    },

    //<debug>
    purgeManagedListeners : function() {
        if (Ext.global.console) {
            Ext.global.console.warn('Observable: purgeManagedListeners has been deprecated. Please use clearManagedListeners.');
        }
        return this.clearManagedListeners.apply(this, arguments);
    },
    //</debug>

    /**
     * Adds the specified events to the list of events which this Observable may fire.
     *
     * @param {Object/String...} eventNames Either an object with event names as properties with
     * a value of `true`. For example:
     *
     *     this.addEvents({
     *         storeloaded: true,
     *         storecleared: true
     *     });
     *
     * Or any number of event names as separate parameters. For example:
     *
     *     this.addEvents('storeloaded', 'storecleared');
     *
     */
    addEvents: function(o) {
        var me = this,
            events = me.events || (me.events = {}),
            arg, args, i;

        if (typeof o == 'string') {
            for (args = arguments, i = args.length; i--; ) {
                arg = args[i];
                if (!events[arg]) {
                    events[arg] = true;
                }
            }
        } else {
            Ext.applyIf(me.events, o);
        }
    },

    /**
     * Checks to see if this object has any listeners for a specified event, or whether the event bubbles. The answer
     * indicates whether the event needs firing or not.
     *
     * @param {String} eventName The name of the event to check for
     * @return {Boolean} `true` if the event is being listened for or bubbles, else `false`
     */
    hasListener: function(ename) {
        return !!this.hasListeners[ename.toLowerCase()];
    },

    /**
     * Suspends the firing of all events. (see {@link #resumeEvents})
     *
     * @param {Boolean} queueSuspended Pass as true to queue up suspended events to be fired
     * after the {@link #resumeEvents} call instead of discarding all suspended events.
     */
    suspendEvents: function(queueSuspended) {
        this.eventsSuspended = true;
        if (queueSuspended && !this.eventQueue) {
            this.eventQueue = [];
        }
    },

    /**
     * Resumes firing events (see {@link #suspendEvents}).
     *
     * If events were suspended using the `queueSuspended` parameter, then all events fired
     * during event suspension will be sent to any listeners now.
     */
    resumeEvents: function() {
        var me = this,
            queued = me.eventQueue,
            qLen, q;

        me.eventsSuspended = false;
        delete me.eventQueue;

        if (queued) {
            qLen = queued.length;
            for (q = 0; q < qLen; q++) {
                me.continueFireEvent.apply(me, queued[q]);
            }
        }
    },

    /**
     * Relays selected events from the specified Observable as if the events were fired by `this`.
     *
     * For example if you are extending Grid, you might decide to forward some events from store.
     * So you can do this inside your initComponent:
     *
     *     this.relayEvents(this.getStore(), ['load']);
     *
     * The grid instance will then have an observable 'load' event which will be passed the
     * parameters of the store's load event and any function fired with the grid's load event
     * would have access to the grid using the `this` keyword.
     *
     * @param {Object} origin The Observable whose events this object is to relay.
     * @param {String[]} events Array of event names to relay.
     * @param {String} [prefix] A common prefix to attach to the event names. For example:
     *
     *     this.relayEvents(this.getStore(), ['load', 'clear'], 'store');
     *
     * Now the grid will forward 'load' and 'clear' events of store as 'storeload' and 'storeclear'.
     */
    relayEvents : function(origin, events, prefix) {
        prefix = prefix || '';
        var me = this,
            len = events.length,
            i = 0,
            oldName,
            newName;

        for (; i < len; i++) {
            oldName = events[i];
            newName = prefix + oldName;
            me.events[newName] = me.events[newName] || true;
            origin.on(oldName, me.createRelayer(newName));
        }
    },

    /**
     * @private
     * Creates an event handling function which refires the event from this object as the passed event name.
     * @param newName
     * @param {Array} beginEnd (optional) The caller can specify on which indices to slice
     * @returns {Function}
     */
    createRelayer: function(newName, beginEnd){
        var me = this;
        return function(){
            return me.fireEvent.apply(me, [newName].concat(Array.prototype.slice.apply(arguments, beginEnd || [0, -1])));
        };
    },

    /**
     * Enables events fired by this Observable to bubble up an owner hierarchy by calling `this.getBubbleTarget()` if
     * present. There is no implementation in the Observable base class.
     *
     * This is commonly used by Ext.Components to bubble events to owner Containers.
     * See {@link Ext.Component#getBubbleTarget}. The default implementation in Ext.Component returns the
     * Component's immediate owner. But if a known target is required, this can be overridden to access the
     * required target more quickly.
     *
     * Example:
     *
     *     Ext.override(Ext.form.field.Base, {
     *         //  Add functionality to Field's initComponent to enable the change event to bubble
     *         initComponent : Ext.Function.createSequence(Ext.form.field.Base.prototype.initComponent, function() {
     *             this.enableBubble('change');
     *         }),
     *
     *         //  We know that we want Field's events to bubble directly to the FormPanel.
     *         getBubbleTarget : function() {
     *             if (!this.formPanel) {
     *                 this.formPanel = this.findParentByType('form');
     *             }
     *             return this.formPanel;
     *         }
     *     });
     *
     *     var myForm = new Ext.formPanel({
     *         title: 'User Details',
     *         items: [{
     *             ...
     *         }],
     *         listeners: {
     *             change: function() {
     *                 // Title goes red if form has been modified.
     *                 myForm.header.setStyle('color', 'red');
     *             }
     *         }
     *     });
     *
     * @param {String/String[]} eventNames The event name to bubble, or an Array of event names.
     */
    enableBubble: function(eventNames) {
        if (eventNames) {
            var me = this,
                names = (typeof eventNames == 'string') ? arguments : eventNames,
                length = names.length,
                events = me.events,
                ename, event, i;

            for (i = 0; i < length; ++i) {
                ename = names[i].toLowerCase();
                event = events[ename];

                if (!event || typeof event == 'boolean') {
                    events[ename] = event = new Ext.util.Event(me, ename);
                }

                // Event must fire if it bubbles (We don't know if anyone up the bubble hierarchy has listeners added)
                me.hasListeners[ename] = (me.hasListeners[ename]||0) + 1;

                event.bubble = true;
            }
        }
    }
}, function() {
    var Observable = this,
        proto = Observable.prototype,
        HasListeners = function () {},
        prepareMixin = function (T) {
            if (!T.HasListeners) {
                var proto = T.prototype;

                // Classes that use us as a mixin (best practice) need to be prepared.
                Observable.prepareClass(T, this);

                // Now that we are mixed in to class T, we need to watch T for derivations
                // and prepare them also.
                T.onExtended(function (U) {
                    Observable.prepareClass(U);
                });

                // Also, if a class uses us as a mixin and that class is then used as
                // a mixin, we need to be notified of that as well.
                if (proto.onClassMixedIn) {
                    // play nice with other potential overrides...
                    Ext.override(T, {
                        onClassMixedIn: function (U) {
                            prepareMixin.call(this, U);
                            this.callParent(arguments);
                        }
                    });
                } else {
                    // just us chickens, so add the method...
                    proto.onClassMixedIn = function (U) {
                        prepareMixin.call(this, U);
                    };
                }
            }
        };

    HasListeners.prototype = {
        //$$: 42  // to make sure we have a proper prototype
    };

    proto.HasListeners = Observable.HasListeners = HasListeners;

    Observable.createAlias({
        /**
         * @method
         * Shorthand for {@link #addListener}.
         * @inheritdoc Ext.util.Observable#addListener
         */
        on: 'addListener',
        /**
         * @method
         * Shorthand for {@link #removeListener}.
         * @inheritdoc Ext.util.Observable#removeListener
         */
        un: 'removeListener',
        /**
         * @method
         * Shorthand for {@link #addManagedListener}.
         * @inheritdoc Ext.util.Observable#addManagedListener
         */
        mon: 'addManagedListener',
        /**
         * @method
         * Shorthand for {@link #removeManagedListener}.
         * @inheritdoc Ext.util.Observable#removeManagedListener
         */
        mun: 'removeManagedListener'
    });

    //deprecated, will be removed in 5.0
    Observable.observeClass = Observable.observe;

    // this is considered experimental (along with beforeMethod, afterMethod, removeMethodListener?)
    // allows for easier interceptor and sequences, including cancelling and overwriting the return value of the call
    // private
    function getMethodEvent(method){
        var e = (this.methodEvents = this.methodEvents || {})[method],
            returnValue,
            v,
            cancel,
            obj = this,
            makeCall;

        if (!e) {
            this.methodEvents[method] = e = {};
            e.originalFn = this[method];
            e.methodName = method;
            e.before = [];
            e.after = [];

            makeCall = function(fn, scope, args){
                if((v = fn.apply(scope || obj, args)) !== undefined){
                    if (typeof v == 'object') {
                        if(v.returnValue !== undefined){
                            returnValue = v.returnValue;
                        }else{
                            returnValue = v;
                        }
                        cancel = !!v.cancel;
                    }
                    else
                        if (v === false) {
                            cancel = true;
                        }
                        else {
                            returnValue = v;
                        }
                }
            };

            this[method] = function(){
                var args = Array.prototype.slice.call(arguments, 0),
                    b, i, len;
                returnValue = v = undefined;
                cancel = false;

                for(i = 0, len = e.before.length; i < len; i++){
                    b = e.before[i];
                    makeCall(b.fn, b.scope, args);
                    if (cancel) {
                        return returnValue;
                    }
                }

                if((v = e.originalFn.apply(obj, args)) !== undefined){
                    returnValue = v;
                }

                for(i = 0, len = e.after.length; i < len; i++){
                    b = e.after[i];
                    makeCall(b.fn, b.scope, args);
                    if (cancel) {
                        return returnValue;
                    }
                }
                return returnValue;
            };
        }
        return e;
    }

    Ext.apply(proto, {
        onClassMixedIn: prepareMixin,

        // these are considered experimental
        // allows for easier interceptor and sequences, including cancelling and overwriting the return value of the call
        // adds an 'interceptor' called before the original method
        beforeMethod : function(method, fn, scope){
            getMethodEvent.call(this, method).before.push({
                fn: fn,
                scope: scope
            });
        },

        // adds a 'sequence' called after the original method
        afterMethod : function(method, fn, scope){
            getMethodEvent.call(this, method).after.push({
                fn: fn,
                scope: scope
            });
        },

        removeMethodListener: function(method, fn, scope){
            var e = this.getMethodEvent(method),
                i, len;
            for(i = 0, len = e.before.length; i < len; i++){
                if(e.before[i].fn == fn && e.before[i].scope == scope){
                    Ext.Array.erase(e.before, i, 1);
                    return;
                }
            }
            for(i = 0, len = e.after.length; i < len; i++){
                if(e.after[i].fn == fn && e.after[i].scope == scope){
                    Ext.Array.erase(e.after, i, 1);
                    return;
                }
            }
        },

        toggleEventLogging: function(toggle) {
            Ext.util.Observable[toggle ? 'capture' : 'releaseCapture'](this, function(en) {
                if (Ext.isDefined(Ext.global.console)) {
                    Ext.global.console.log(en, arguments);
                }
            });
        }
    });
});
 
/**
 * @class Ext.util.HashMap
 * <p>
 * Represents a collection of a set of key and value pairs. Each key in the HashMap
 * must be unique, the same key cannot exist twice. Access to items is provided via
 * the key only. Sample usage:
 * <pre><code>
var map = new Ext.util.HashMap();
map.add('key1', 1);
map.add('key2', 2);
map.add('key3', 3);

map.each(function(key, value, length){
    console.log(key, value, length);
});
 * </code></pre>
 * </p>
 *
 * <p>The HashMap is an unordered class,
 * there is no guarantee when iterating over the items that they will be in any particular
 * order. If this is required, then use a {@link Ext.util.MixedCollection}.
 * </p>
 */
Ext.define('Ext.util.HashMap', {
    mixins: {
        observable: 'Ext.util.Observable'
    },

    /**
     * @cfg {Function} keyFn A function that is used to retrieve a default key for a passed object.
     * A default is provided that returns the <b>id</b> property on the object. This function is only used
     * if the add method is called with a single argument.
     */

    /**
     * Creates new HashMap.
     * @param {Object} config (optional) Config object.
     */
    constructor: function(config) {
        config = config || {};

        var me = this,
            keyFn = config.keyFn;

        me.addEvents(
            /**
             * @event add
             * Fires when a new item is added to the hash
             * @param {Ext.util.HashMap} this.
             * @param {String} key The key of the added item.
             * @param {Object} value The value of the added item.
             */
            'add',
            /**
             * @event clear
             * Fires when the hash is cleared.
             * @param {Ext.util.HashMap} this.
             */
            'clear',
            /**
             * @event remove
             * Fires when an item is removed from the hash.
             * @param {Ext.util.HashMap} this.
             * @param {String} key The key of the removed item.
             * @param {Object} value The value of the removed item.
             */
            'remove',
            /**
             * @event replace
             * Fires when an item is replaced in the hash.
             * @param {Ext.util.HashMap} this.
             * @param {String} key The key of the replaced item.
             * @param {Object} value The new value for the item.
             * @param {Object} old The old value for the item.
             */
            'replace'
        );

        me.mixins.observable.constructor.call(me, config);
        me.clear(true);

        if (keyFn) {
            me.getKey = keyFn;
        }
    },

    /**
     * Gets the number of items in the hash.
     * @return {Number} The number of items in the hash.
     */
    getCount: function() {
        return this.length;
    },

    /**
     * Implementation for being able to extract the key from an object if only
     * a single argument is passed.
     * @private
     * @param {String} key The key
     * @param {Object} value The value
     * @return {Array} [key, value]
     */
    getData: function(key, value) {
        // if we have no value, it means we need to get the key from the object
        if (value === undefined) {
            value = key;
            key = this.getKey(value);
        }

        return [key, value];
    },

    /**
     * Extracts the key from an object. This is a default implementation, it may be overridden
     * @param {Object} o The object to get the key from
     * @return {String} The key to use.
     */
    getKey: function(o) {
        return o.id;
    },

    /**
     * Adds an item to the collection. Fires the {@link #event-add} event when complete.
     * @param {String} key <p>The key to associate with the item, or the new item.</p>
     * <p>If a {@link #getKey} implementation was specified for this HashMap,
     * or if the key of the stored items is in a property called <tt><b>id</b></tt>,
     * the HashMap will be able to <i>derive</i> the key for the new item.
     * In this case just pass the new item in this parameter.</p>
     * @param {Object} o The item to add.
     * @return {Object} The item added.
     */
    add: function(key, value) {
        var me = this;

        if (value === undefined) {
            value = key;
            key = me.getKey(value);
        }

        if (me.containsKey(key)) {
            return me.replace(key, value);
        }

        me.map[key] = value;
        ++me.length;
        if (me.hasListeners.add) {
            me.fireEvent('add', me, key, value);
        }
        return value;
    },

    /**
     * Replaces an item in the hash. If the key doesn't exist, the
     * {@link #method-add} method will be used.
     * @param {String} key The key of the item.
     * @param {Object} value The new value for the item.
     * @return {Object} The new value of the item.
     */
    replace: function(key, value) {
        var me = this,
            map = me.map,
            old;

        if (value === undefined) {
            value = key;
            key = me.getKey(value);
        }

        if (!me.containsKey(key)) {
            me.add(key, value);
        }
        old = map[key];
        map[key] = value;
        if (me.hasListeners.replace) {
            me.fireEvent('replace', me, key, value, old);
        }
        return value;
    },

    /**
     * Remove an item from the hash.
     * @param {Object} o The value of the item to remove.
     * @return {Boolean} True if the item was successfully removed.
     */
    remove: function(o) {
        var key = this.findKey(o);
        if (key !== undefined) {
            return this.removeAtKey(key);
        }
        return false;
    },

    /**
     * Remove an item from the hash.
     * @param {String} key The key to remove.
     * @return {Boolean} True if the item was successfully removed.
     */
    removeAtKey: function(key) {
        var me = this,
            value;

        if (me.containsKey(key)) {
            value = me.map[key];
            delete me.map[key];
            --me.length;
            if (me.hasListeners.remove) {
                me.fireEvent('remove', me, key, value);
            }
            return true;
        }
        return false;
    },

    /**
     * Retrieves an item with a particular key.
     * @param {String} key The key to lookup.
     * @return {Object} The value at that key. If it doesn't exist, <tt>undefined</tt> is returned.
     */
    get: function(key) {
        return this.map[key];
    },

    /**
     * Removes all items from the hash.
     * @return {Ext.util.HashMap} this
     */
    clear: function(/* private */ initial) {
        var me = this;
        me.map = {};
        me.length = 0;
        if (initial !== true && me.hasListeners.clear) {
            me.fireEvent('clear', me);
        }
        return me;
    },

    /**
     * Checks whether a key exists in the hash.
     * @param {String} key The key to check for.
     * @return {Boolean} True if they key exists in the hash.
     */
    containsKey: function(key) {
        return this.map[key] !== undefined;
    },

    /**
     * Checks whether a value exists in the hash.
     * @param {Object} value The value to check for.
     * @return {Boolean} True if the value exists in the dictionary.
     */
    contains: function(value) {
        return this.containsKey(this.findKey(value));
    },

    /**
     * Return all of the keys in the hash.
     * @return {Array} An array of keys.
     */
    getKeys: function() {
        return this.getArray(true);
    },

    /**
     * Return all of the values in the hash.
     * @return {Array} An array of values.
     */
    getValues: function() {
        return this.getArray(false);
    },

    /**
     * Gets either the keys/values in an array from the hash.
     * @private
     * @param {Boolean} isKey True to extract the keys, otherwise, the value
     * @return {Array} An array of either keys/values from the hash.
     */
    getArray: function(isKey) {
        var arr = [],
            key,
            map = this.map;
        for (key in map) {
            if (map.hasOwnProperty(key)) {
                arr.push(isKey ? key: map[key]);
            }
        }
        return arr;
    },

    /**
     * Executes the specified function once for each item in the hash.
     * Returning false from the function will cease iteration.
     *
     * The paramaters passed to the function are:
     * <div class="mdetail-params"><ul>
     * <li><b>key</b> : String<p class="sub-desc">The key of the item</p></li>
     * <li><b>value</b> : Number<p class="sub-desc">The value of the item</p></li>
     * <li><b>length</b> : Number<p class="sub-desc">The total number of items in the hash</p></li>
     * </ul></div>
     * @param {Function} fn The function to execute.
     * @param {Object} scope The scope to execute in. Defaults to <tt>this</tt>.
     * @return {Ext.util.HashMap} this
     */
    each: function(fn, scope) {
        // copy items so they may be removed during iteration.
        var items = Ext.apply({}, this.map),
            key,
            length = this.length;

        scope = scope || this;
        for (key in items) {
            if (items.hasOwnProperty(key)) {
                if (fn.call(scope, key, items[key], length) === false) {
                    break;
                }
            }
        }
        return this;
    },

    /**
     * Performs a shallow copy on this hash.
     * @return {Ext.util.HashMap} The new hash object.
     */
    clone: function() {
        var hash = new this.self(),
            map = this.map,
            key;

        hash.suspendEvents();
        for (key in map) {
            if (map.hasOwnProperty(key)) {
                hash.add(key, map[key]);
            }
        }
        hash.resumeEvents();
        return hash;
    },

    /**
     * @private
     * Find the key for a value.
     * @param {Object} value The value to find.
     * @return {Object} The value of the item. Returns <tt>undefined</tt> if not found.
     */
    findKey: function(value) {
        var key,
            map = this.map;

        for (key in map) {
            if (map.hasOwnProperty(key) && map[key] === value) {
                return key;
            }
        }
        return undefined;
    }
});
 
/**
 * Base Manager class
 */
Ext.define('Ext.AbstractManager', {

    /* Begin Definitions */

    requires: ['Ext.util.HashMap'],

    /* End Definitions */

    typeName: 'type',

    constructor: function(config) {
        Ext.apply(this, config || {});

        /**
         * @property {Ext.util.HashMap} all
         * Contains all of the items currently managed
         */
        this.all = new Ext.util.HashMap();

        this.types = {};
    },

    /**
     * Returns an item by id.
     * For additional details see {@link Ext.util.HashMap#get}.
     * @param {String} id The id of the item
     * @return {Object} The item, undefined if not found.
     */
    get : function(id) {
        return this.all.get(id);
    },

    /**
     * Registers an item to be managed
     * @param {Object} item The item to register
     */
    register: function(item) {
        //<debug>
        var all = this.all,
            key = all.getKey(item);
            
        if (all.containsKey(key)) {
            Ext.Error.raise('Registering duplicate id "' + key + '" with this manager');
        }
        //</debug>
        this.all.add(item);
    },

    /**
     * Unregisters an item by removing it from this manager
     * @param {Object} item The item to unregister
     */
    unregister: function(item) {
        this.all.remove(item);
    },

    /**
     * Registers a new item constructor, keyed by a type key.
     * @param {String} type The mnemonic string by which the class may be looked up.
     * @param {Function} cls The new instance class.
     */
    registerType : function(type, cls) {
        this.types[type] = cls;
        cls[this.typeName] = type;
    },

    /**
     * Checks if an item type is registered.
     * @param {String} type The mnemonic string by which the class may be looked up
     * @return {Boolean} Whether the type is registered.
     */
    isRegistered : function(type){
        return this.types[type] !== undefined;
    },

    /**
     * Creates and returns an instance of whatever this manager manages, based on the supplied type and
     * config object.
     * @param {Object} config The config object
     * @param {String} defaultType If no type is discovered in the config object, we fall back to this type
     * @return {Object} The instance of whatever this manager is managing
     */
    create: function(config, defaultType) {
        var type        = config[this.typeName] || config.type || defaultType,
            Constructor = this.types[type];

        //<debug>
        if (Constructor === undefined) {
            Ext.Error.raise("The '" + type + "' type has not been registered with this manager");
        }
        //</debug>

        return new Constructor(config);
    },

    /**
     * Registers a function that will be called when an item with the specified id is added to the manager.
     * This will happen on instantiation.
     * @param {String} id The item id
     * @param {Function} fn The callback function. Called with a single parameter, the item.
     * @param {Object} scope The scope (this reference) in which the callback is executed.
     * Defaults to the item.
     */
    onAvailable : function(id, fn, scope){
        var all = this.all,
            item;
        
        if (all.containsKey(id)) {
            item = all.get(id);
            fn.call(scope || item, item);
        } else {
            all.on('add', function(map, key, item){
                if (key == id) {
                    fn.call(scope || item, item);
                    all.un('add', fn, scope);
                }
            });
        }
    },
    
    /**
     * Executes the specified function once for each item in the collection.
     * @param {Function} fn The function to execute.
     * @param {String} fn.key The key of the item
     * @param {Number} fn.value The value of the item
     * @param {Number} fn.length The total number of items in the collection
     * @param {Boolean} fn.return False to cease iteration.
     * @param {Object} scope The scope to execute in. Defaults to `this`.
     */
    each: function(fn, scope){
        this.all.each(fn, scope || this);    
    },
    
    /**
     * Gets the number of items in the collection.
     * @return {Number} The number of items in the collection.
     */
    getCount: function(){
        return this.all.getCount();
    }
});
 
/**
 * @author Ed Spencer
 *
 * Associations enable you to express relationships between different {@link Ext.data.Model Models}. Let's say we're
 * writing an ecommerce system where Users can make Orders - there's a relationship between these Models that we can
 * express like this:
 *
 *     Ext.define('User', {
 *         extend: 'Ext.data.Model',
 *         fields: ['id', 'name', 'email'],
 *
 *         hasMany: {model: 'Order', name: 'orders'}
 *     });
 *
 *     Ext.define('Order', {
 *         extend: 'Ext.data.Model',
 *         fields: ['id', 'user_id', 'status', 'price'],
 *
 *         belongsTo: 'User'
 *     });
 *
 * We've set up two models - User and Order - and told them about each other. You can set up as many associations on
 * each Model as you need using the two default types - {@link Ext.data.HasManyAssociation hasMany} and {@link
 * Ext.data.BelongsToAssociation belongsTo}. There's much more detail on the usage of each of those inside their
 * documentation pages. If you're not familiar with Models already, {@link Ext.data.Model there is plenty on those too}.
 *
 * **Further Reading**
 *
 *   - {@link Ext.data.association.HasMany hasMany associations}
 *   - {@link Ext.data.association.BelongsTo belongsTo associations}
 *   - {@link Ext.data.association.HasOne hasOne associations}
 *   - {@link Ext.data.Model using Models}
 *
 * # Self association models
 *
 * We can also have models that create parent/child associations between the same type. Below is an example, where
 * groups can be nested inside other groups:
 *
 *     // Server Data
 *     {
 *         "groups": {
 *             "id": 10,
 *             "parent_id": 100,
 *             "name": "Main Group",
 *             "parent_group": {
 *                 "id": 100,
 *                 "parent_id": null,
 *                 "name": "Parent Group"
 *             },
 *             "child_groups": [{
 *                 "id": 2,
 *                 "parent_id": 10,
 *                 "name": "Child Group 1"
 *             },{
 *                 "id": 3,
 *                 "parent_id": 10,
 *                 "name": "Child Group 2"
 *             },{
 *                 "id": 4,
 *                 "parent_id": 10,
 *                 "name": "Child Group 3"
 *             }]
 *         }
 *     }
 *
 *     // Client code
 *     Ext.define('Group', {
 *         extend: 'Ext.data.Model',
 *         fields: ['id', 'parent_id', 'name'],
 *         proxy: {
 *             type: 'ajax',
 *             url: 'data.json',
 *             reader: {
 *                 type: 'json',
 *                 root: 'groups'
 *             }
 *         },
 *         associations: [{
 *             type: 'hasMany',
 *             model: 'Group',
 *             primaryKey: 'id',
 *             foreignKey: 'parent_id',
 *             autoLoad: true,
 *             associationKey: 'child_groups' // read child data from child_groups
 *         }, {
 *             type: 'belongsTo',
 *             model: 'Group',
 *             primaryKey: 'id',
 *             foreignKey: 'parent_id',
 *             associationKey: 'parent_group' // read parent data from parent_group
 *         }]
 *     });
 *
 *     Ext.onReady(function(){
 *
 *         Group.load(10, {
 *             success: function(group){
 *                 console.log(group.getGroup().get('name'));
 *
 *                 group.groups().each(function(rec){
 *                     console.log(rec.get('name'));
 *                 });
 *             }
 *         });
 *
 *     });
 *
 */
Ext.define('Ext.data.association.Association', {
    alternateClassName: 'Ext.data.Association',
    /**
     * @cfg {String} ownerModel (required)
     * The string name of the model that owns the association.
     */

    /**
     * @cfg {String} associatedModel (required)
     * The string name of the model that is being associated with.
     */

    /**
     * @cfg {String} primaryKey
     * The name of the primary key on the associated model. In general this will be the
     * {@link Ext.data.Model#idProperty} of the Model.
     */
    primaryKey: 'id',

    /**
     * @cfg {Ext.data.reader.Reader} reader
     * A special reader to read associated data
     */
    
    /**
     * @cfg {String} associationKey
     * The name of the property in the data to read the association from. Defaults to the name of the associated model.
     */

    defaultReaderType: 'json',

    statics: {
        AUTO_ID: 1000,
        
        create: function(association){
            if (!association.isAssociation) {
                if (Ext.isString(association)) {
                    association = {
                        type: association
                    };
                }

                switch (association.type) {
                    case 'belongsTo':
                        return new Ext.data.association.BelongsTo(association);
                    case 'hasMany':
                        return new Ext.data.association.HasMany(association);
                    case 'hasOne':
                        return new Ext.data.association.HasOne(association);
                    //TODO Add this back when it's fixed
//                    case 'polymorphic':
//                        return Ext.create('Ext.data.PolymorphicAssociation', association);
                    default:
                        //<debug>
                        Ext.Error.raise('Unknown Association type: "' + association.type + '"');
                        //</debug>
                }
            }
            return association;
        }
    },

    /**
     * Creates the Association object.
     * @param {Object} [config] Config object.
     */
    constructor: function(config) {
        Ext.apply(this, config);

        var types           = Ext.ModelManager.types,
            ownerName       = config.ownerModel,
            associatedName  = config.associatedModel,
            ownerModel      = types[ownerName],
            associatedModel = types[associatedName],
            ownerProto;

        //<debug>
        if (ownerModel === undefined) {
            Ext.Error.raise("The configured ownerModel was not valid (you tried " + ownerName + ")");
        }
        if (associatedModel === undefined) {
            Ext.Error.raise("The configured associatedModel was not valid (you tried " + associatedName + ")");
        }
        //</debug>

        this.ownerModel = ownerModel;
        this.associatedModel = associatedModel;

        /**
         * @property {String} ownerName
         * The name of the model that 'owns' the association
         */

        /**
         * @property {String} associatedName
         * The name of the model is on the other end of the association (e.g. if a User model hasMany Orders, this is
         * 'Order')
         */

        Ext.applyIf(this, {
            ownerName : ownerName,
            associatedName: associatedName
        });
        
        this.associationId = 'association' + (++this.statics().AUTO_ID);
    },

    /**
     * Get a specialized reader for reading associated data
     * @return {Ext.data.reader.Reader} The reader, null if not supplied
     */
    getReader: function(){
        var me = this,
            reader = me.reader,
            model = me.associatedModel;

        if (reader) {
            if (Ext.isString(reader)) {
                reader = {
                    type: reader
                };
            }
            if (reader.isReader) {
                reader.setModel(model);
            } else {
                Ext.applyIf(reader, {
                    model: model,
                    type : me.defaultReaderType
                });
            }
            me.reader = Ext.createByAlias('reader.' + reader.type, reader);
        }
        return me.reader || null;
    }
});
 
/**
 * @author Ed Spencer
 * @class Ext.ModelManager

The ModelManager keeps track of all {@link Ext.data.Model} types defined in your application.

__Creating Model Instances__

Model instances can be created by using the {@link Ext#create Ext.create} method. Ext.create replaces
the deprecated {@link #create Ext.ModelManager.create} method. It is also possible to create a model instance
this by using the Model type directly. The following 3 snippets are equivalent:

    Ext.define('User', {
        extend: 'Ext.data.Model',
        fields: ['first', 'last']
    });

    // method 1, create using Ext.create (recommended)
    Ext.create('User', {
        first: 'Ed',
        last: 'Spencer'
    });

    // method 2, create through the manager (deprecated)
    Ext.ModelManager.create({
        first: 'Ed',
        last: 'Spencer'
    }, 'User');

    // method 3, create on the type directly
    new User({
        first: 'Ed',
        last: 'Spencer'
    });

__Accessing Model Types__

A reference to a Model type can be obtained by using the {@link #getModel} function. Since models types
are normal classes, you can access the type directly. The following snippets are equivalent:

    Ext.define('User', {
        extend: 'Ext.data.Model',
        fields: ['first', 'last']
    });

    // method 1, access model type through the manager
    var UserType = Ext.ModelManager.getModel('User');

    // method 2, reference the type directly
    var UserType = User;

 * @markdown
 * @singleton
 */
Ext.define('Ext.ModelManager', {
    extend: 'Ext.AbstractManager',
    alternateClassName: 'Ext.ModelMgr',
    requires: ['Ext.data.association.Association'],
    
    singleton: true,

    typeName: 'mtype',

    /**
     * Private stack of associations that must be created once their associated model has been defined
     * @property {Ext.data.association.Association[]} associationStack
     */
    associationStack: [],

    /**
     * Registers a model definition. All model plugins marked with isDefault: true are bootstrapped
     * immediately, as are any addition plugins defined in the model config.
     * @private
     */
    registerType: function(name, config) {
        var proto = config.prototype,
            model;
        if (proto && proto.isModel) {
            // registering an already defined model
            model = config;
        } else {
            // passing in a configuration
            if (!config.extend) {
                config.extend = 'Ext.data.Model';
            }
            model = Ext.define(name, config);
        }
        this.types[name] = model;
        return model;
    },

    /**
     * @private
     * Private callback called whenever a model has just been defined. This sets up any associations
     * that were waiting for the given model to be defined
     * @param {Function} model The model that was just created
     */
    onModelDefined: function(model) {
        var stack  = this.associationStack,
            length = stack.length,
            create = [],
            association, i, created;

        for (i = 0; i < length; i++) {
            association = stack[i];

            if (association.associatedModel == model.modelName) {
                create.push(association);
            }
        }

        for (i = 0, length = create.length; i < length; i++) {
            created = create[i];
            this.types[created.ownerModel].prototype.associations.add(Ext.data.association.Association.create(created));
            Ext.Array.remove(stack, created);
        }
    },

    /**
     * Registers an association where one of the models defined doesn't exist yet.
     * The ModelManager will check when new models are registered if it can link them
     * together
     * @private
     * @param {Ext.data.association.Association} association The association
     */
    registerDeferredAssociation: function(association){
        this.associationStack.push(association);
    },

    /**
     * Returns the {@link Ext.data.Model} for a given model name
     * @param {String/Object} id The id of the model or the model instance.
     * @return {Ext.data.Model} a model class.
     */
    getModel: function(id) {
        var model = id;
        if (typeof model == 'string') {
            model = this.types[model];
        }
        return model;
    },

    /**
     * Creates a new instance of a Model using the given data.
     *
     * This method is deprecated.  Use {@link Ext#create Ext.create} instead.  For example:
     *
     *     Ext.create('User', {
     *         first: 'Ed',
     *         last: 'Spencer'
     *     });
     *
     * @param {Object} data Data to initialize the Model's fields with
     * @param {String} name The name of the model to create
     * @param {Number} id (Optional) unique id of the Model instance (see {@link Ext.data.Model})
     */
    create: function(config, name, id) {
        var Con = typeof name == 'function' ? name : this.types[name || config.name];

        return new Con(config, id);
    }
}, function() {

    /**
     * Old way for creating Model classes.  Instead use:
     *
     *     Ext.define("MyModel", {
     *         extend: "Ext.data.Model",
     *         fields: []
     *     });
     *
     * @param {String} name Name of the Model class.
     * @param {Object} config A configuration object for the Model you wish to create.
     * @return {Ext.data.Model} The newly registered Model
     * @member Ext
     * @deprecated 4.0.0 Use {@link Ext#define} instead.
     */
    Ext.regModel = function() {
        //<debug>
        if (Ext.isDefined(Ext.global.console)) {
            Ext.global.console.warn('Ext.regModel has been deprecated. Models can now be created by extending Ext.data.Model: Ext.define("MyModel", {extend: "Ext.data.Model", fields: []});.');
        }
        //</debug>
        return this.ModelManager.registerType.apply(this.ModelManager, arguments);
    };
});
 
/**
 * @author Don Griffin
 *
 * This class is a base for all id generators. It also provides lookup of id generators by
 * their id.
 * 
 * Generally, id generators are used to generate a primary key for new model instances. There
 * are different approaches to solving this problem, so this mechanism has both simple use
 * cases and is open to custom implementations. A {@link Ext.data.Model} requests id generation
 * using the {@link Ext.data.Model#idgen} property.
 *
 * # Identity, Type and Shared IdGenerators
 *
 * It is often desirable to share IdGenerators to ensure uniqueness or common configuration.
 * This is done by giving IdGenerator instances an id property by which they can be looked
 * up using the {@link #get} method. To configure two {@link Ext.data.Model Model} classes
 * to share one {@link Ext.data.SequentialIdGenerator sequential} id generator, you simply
 * assign them the same id:
 *
 *     Ext.define('MyApp.data.MyModelA', {
 *         extend: 'Ext.data.Model',
 *         idgen: {
 *             type: 'sequential',
 *             id: 'foo'
 *         }
 *     });
 *
 *     Ext.define('MyApp.data.MyModelB', {
 *         extend: 'Ext.data.Model',
 *         idgen: {
 *             type: 'sequential',
 *             id: 'foo'
 *         }
 *     });
 *
 * To make this as simple as possible for generator types that are shared by many (or all)
 * Models, the IdGenerator types (such as 'sequential' or 'uuid') are also reserved as
 * generator id's. This is used by the {@link Ext.data.UuidGenerator} which has an id equal
 * to its type ('uuid'). In other words, the following Models share the same generator:
 *
 *     Ext.define('MyApp.data.MyModelX', {
 *         extend: 'Ext.data.Model',
 *         idgen: 'uuid'
 *     });
 *
 *     Ext.define('MyApp.data.MyModelY', {
 *         extend: 'Ext.data.Model',
 *         idgen: 'uuid'
 *     });
 *
 * This can be overridden (by specifying the id explicitly), but there is no particularly
 * good reason to do so for this generator type.
 *
 * # Creating Custom Generators
 * 
 * An id generator should derive from this class and implement the {@link #generate} method.
 * The constructor will apply config properties on new instances, so a constructor is often
 * not necessary.
 *
 * To register an id generator type, a derived class should provide an `alias` like so:
 *
 *     Ext.define('MyApp.data.CustomIdGenerator', {
 *         extend: 'Ext.data.IdGenerator',
 *         alias: 'idgen.custom',
 *
 *         configProp: 42, // some config property w/default value
 *
 *         generate: function () {
 *             return ... // a new id
 *         }
 *     });
 *
 * Using the custom id generator is then straightforward:
 *
 *     Ext.define('MyApp.data.MyModel', {
 *         extend: 'Ext.data.Model',
 *         idgen: 'custom'
 *     });
 *     // or...
 *
 *     Ext.define('MyApp.data.MyModel', {
 *         extend: 'Ext.data.Model',
 *         idgen: {
 *             type: 'custom',
 *             configProp: value
 *         }
 *     });
 *
 * It is not recommended to mix shared generators with generator configuration. This leads
 * to unpredictable results unless all configurations match (which is also redundant). In
 * such cases, a custom generator with a default id is the best approach.
 *
 *     Ext.define('MyApp.data.CustomIdGenerator', {
 *         extend: 'Ext.data.SequentialIdGenerator',
 *         alias: 'idgen.custom',
 *
 *         id: 'custom', // shared by default
 *
 *         prefix: 'ID_',
 *         seed: 1000
 *     });
 *
 *     Ext.define('MyApp.data.MyModelX', {
 *         extend: 'Ext.data.Model',
 *         idgen: 'custom'
 *     });
 *
 *     Ext.define('MyApp.data.MyModelY', {
 *         extend: 'Ext.data.Model',
 *         idgen: 'custom'
 *     });
 *
 *     // the above models share a generator that produces ID_1000, ID_1001, etc..
 *
 */
Ext.define('Ext.data.IdGenerator', {

    /**
     * @property {Boolean} isGenerator
     * `true` in this class to identify an object as an instantiated IdGenerator, or subclass thereof.
     */
    isGenerator: true,

    /**
     * Initializes a new instance.
     * @param {Object} config (optional) Configuration object to be applied to the new instance.
     */
    constructor: function(config) {
        var me = this;

        Ext.apply(me, config);

        if (me.id) {
            Ext.data.IdGenerator.all[me.id] = me;
        }
    },

    /**
     * @cfg {String} id
     * The id by which to register a new instance. This instance can be found using the
     * {@link Ext.data.IdGenerator#get} static method.
     */

    getRecId: function (rec) {
        return rec.modelName + '-' + rec.internalId;
    },

    /**
     * Generates and returns the next id. This method must be implemented by the derived
     * class.
     *
     * @return {String} The next id.
     * @method generate
     * @abstract
     */

    statics: {
        /**
         * @property {Object} all
         * This object is keyed by id to lookup instances.
         * @private
         * @static
         */
        all: {},

        /**
         * Returns the IdGenerator given its config description.
         * @param {String/Object} config If this parameter is an IdGenerator instance, it is
         * simply returned. If this is a string, it is first used as an id for lookup and
         * then, if there is no match, as a type to create a new instance. This parameter
         * can also be a config object that contains a `type` property (among others) that
         * are used to create and configure the instance.
         * @static
         */
        get: function (config) {
            var generator,
                id,
                type;

            if (typeof config == 'string') {
                id = type = config;
                config = null;
            } else if (config.isGenerator) {
                return config;
            } else {
                id = config.id || config.type;
                type = config.type;
            }

            generator = this.all[id];
            if (!generator) {
                generator = Ext.create('idgen.' + type, config);
            }

            return generator;
        }
    }
});
 
/**
 * @class Ext.data.SortTypes
 * This class defines a series of static methods that are used on a
 * {@link Ext.data.Field} for performing sorting. The methods cast the 
 * underlying values into a data type that is appropriate for sorting on
 * that particular field.  If a {@link Ext.data.Field#type} is specified, 
 * the sortType will be set to a sane default if the sortType is not 
 * explicitly defined on the field. The sortType will make any necessary
 * modifications to the value and return it.
 * <ul>
 * <li><b>asText</b> - Removes any tags and converts the value to a string</li>
 * <li><b>asUCText</b> - Removes any tags and converts the value to an uppercase string</li>
 * <li><b>asUCText</b> - Converts the value to an uppercase string</li>
 * <li><b>asDate</b> - Converts the value into Unix epoch time</li>
 * <li><b>asFloat</b> - Converts the value to a floating point number</li>
 * <li><b>asInt</b> - Converts the value to an integer number</li>
 * </ul>
 * <p>
 * It is also possible to create a custom sortType that can be used throughout
 * an application.
 * <pre><code>
Ext.apply(Ext.data.SortTypes, {
    asPerson: function(person){
        // expects an object with a first and last name property
        return person.lastName.toUpperCase() + person.firstName.toLowerCase();
    }    
});

Ext.define('Employee', {
    extend: 'Ext.data.Model',
    fields: [{
        name: 'person',
        sortType: 'asPerson'
    }, {
        name: 'salary',
        type: 'float' // sortType set to asFloat
    }]
});
 * </code></pre>
 * </p>
 * @singleton
 * @docauthor Evan Trimboli <evan@sencha.com>
 */
Ext.define('Ext.data.SortTypes', {
    
    singleton: true,
    
    /**
     * Default sort that does nothing
     * @param {Object} s The value being converted
     * @return {Object} The comparison value
     */
    none : function(s) {
        return s;
    },

    /**
     * The regular expression used to strip tags
     * @type {RegExp}
     * @property
     */
    stripTagsRE : /<\/?[^>]+>/gi,

    /**
     * Strips all HTML tags to sort on text only
     * @param {Object} s The value being converted
     * @return {String} The comparison value
     */
    asText : function(s) {
        return String(s).replace(this.stripTagsRE, "");
    },

    /**
     * Strips all HTML tags to sort on text only - Case insensitive
     * @param {Object} s The value being converted
     * @return {String} The comparison value
     */
    asUCText : function(s) {
        return String(s).toUpperCase().replace(this.stripTagsRE, "");
    },

    /**
     * Case insensitive string
     * @param {Object} s The value being converted
     * @return {String} The comparison value
     */
    asUCString : function(s) {
        return String(s).toUpperCase();
    },

    /**
     * Date sorting
     * @param {Object} s The value being converted
     * @return {Number} The comparison value
     */
    asDate : function(s) {
        if(!s){
            return 0;
        }
        if(Ext.isDate(s)){
            return s.getTime();
        }
        return Date.parse(String(s));
    },

    /**
     * Float sorting
     * @param {Object} s The value being converted
     * @return {Number} The comparison value
     */
    asFloat : function(s) {
        var val = parseFloat(String(s).replace(/,/g, ""));
        return isNaN(val) ? 0 : val;
    },

    /**
     * Integer sorting
     * @param {Object} s The value being converted
     * @return {Number} The comparison value
     */
    asInt : function(s) {
        var val = parseInt(String(s).replace(/,/g, ""), 10);
        return isNaN(val) ? 0 : val;
    }
}); 
/**
 * @class Ext.data.Types
 * <p>This is a static class containing the system-supplied data types which may be given to a {@link Ext.data.Field Field}.<p/>
 * <p>The properties in this class are used as type indicators in the {@link Ext.data.Field Field} class, so to
 * test whether a Field is of a certain type, compare the {@link Ext.data.Field#type type} property against properties
 * of this class.</p>
 * <p>Developers may add their own application-specific data types to this class. Definition names must be UPPERCASE.
 * each type definition must contain three properties:</p>
 * <div class="mdetail-params"><ul>
 * <li><code>convert</code> : <i>Function</i><div class="sub-desc">A function to convert raw data values from a data block into the data
 * to be stored in the Field. The function is passed the collowing parameters:
 * <div class="mdetail-params"><ul>
 * <li><b>v</b> : Mixed<div class="sub-desc">The data value as read by the Reader, if undefined will use
 * the configured <tt>{@link Ext.data.Field#defaultValue defaultValue}</tt>.</div></li>
 * <li><b>rec</b> : Mixed<div class="sub-desc">The data object containing the row as read by the Reader.
 * Depending on the Reader type, this could be an Array ({@link Ext.data.reader.Array ArrayReader}), an object
 * ({@link Ext.data.reader.Json JsonReader}), or an XML element.</div></li>
 * </ul></div></div></li>
 * <li><code>sortType</code> : <i>Function</i> <div class="sub-desc">A function to convert the stored data into comparable form, as defined by {@link Ext.data.SortTypes}.</div></li>
 * <li><code>type</code> : <i>String</i> <div class="sub-desc">A textual data type name.</div></li>
 * </ul></div>
 * <p>For example, to create a VELatLong field (See the Microsoft Bing Mapping API) containing the latitude/longitude value of a datapoint on a map from a JsonReader data block
 * which contained the properties <code>lat</code> and <code>long</code>, you would define a new data type like this:</p>
 *<pre><code>
// Add a new Field data type which stores a VELatLong object in the Record.
Ext.data.Types.VELATLONG = {
    convert: function(v, data) {
        return new VELatLong(data.lat, data.long);
    },
    sortType: function(v) {
        return v.Latitude;  // When sorting, order by latitude
    },
    type: 'VELatLong'
};
</code></pre>
 * <p>Then, when declaring a Model, use: <pre><code>
var types = Ext.data.Types; // allow shorthand type access
Ext.define('Unit',
    extend: 'Ext.data.Model',
    fields: [
        { name: 'unitName', mapping: 'UnitName' },
        { name: 'curSpeed', mapping: 'CurSpeed', type: types.INT },
        { name: 'latitude', mapping: 'lat', type: types.FLOAT },
        { name: 'longitude', mapping: 'long', type: types.FLOAT },
        { name: 'position', type: types.VELATLONG }
    ]
});
</code></pre>
 * @singleton
 */
Ext.define('Ext.data.Types', {
    singleton: true,
    requires: ['Ext.data.SortTypes']
}, function() {
    var st = Ext.data.SortTypes;

    Ext.apply(Ext.data.Types, {
        /**
         * @property {RegExp} stripRe
         * A regular expression for stripping non-numeric characters from a numeric value. Defaults to <tt>/[\$,%]/g</tt>.
         * This should be overridden for localization.
         */
        stripRe: /[\$,%]/g,

        /**
         * @property {Object} AUTO
         * This data type means that no conversion is applied to the raw data before it is placed into a Record.
         */
        AUTO: {
            sortType: st.none,
            type: 'auto'
        },

        /**
         * @property {Object} STRING
         * This data type means that the raw data is converted into a String before it is placed into a Record.
         */
        STRING: {
            convert: function(v) {
                var defaultValue = this.useNull ? null : '';
                return (v === undefined || v === null) ? defaultValue : String(v);
            },
            sortType: st.asUCString,
            type: 'string'
        },

        /**
         * @property {Object} INT
         * This data type means that the raw data is converted into an integer before it is placed into a Record.
         * <p>The synonym <code>INTEGER</code> is equivalent.</p>
         */
        INT: {
            convert: function(v) {
                return v !== undefined && v !== null && v !== '' ?
                    parseInt(String(v).replace(Ext.data.Types.stripRe, ''), 10) : (this.useNull ? null : 0);
            },
            sortType: st.none,
            type: 'int'
        },

        /**
         * @property {Object} FLOAT
         * This data type means that the raw data is converted into a number before it is placed into a Record.
         * <p>The synonym <code>NUMBER</code> is equivalent.</p>
         */
        FLOAT: {
            convert: function(v) {
                return v !== undefined && v !== null && v !== '' ?
                    parseFloat(String(v).replace(Ext.data.Types.stripRe, ''), 10) : (this.useNull ? null : 0);
            },
            sortType: st.none,
            type: 'float'
        },

        /**
         * @property {Object} BOOL
         * <p>This data type means that the raw data is converted into a boolean before it is placed into
         * a Record. The string "true" and the number 1 are converted to boolean <code>true</code>.</p>
         * <p>The synonym <code>BOOLEAN</code> is equivalent.</p>
         */
        BOOL: {
            convert: function(v) {
                if (this.useNull && (v === undefined || v === null || v === '')) {
                    return null;
                }
                return v === true || v === 'true' || v == 1;
            },
            sortType: st.none,
            type: 'bool'
        },

        /**
         * @property {Object} DATE
         * This data type means that the raw data is converted into a Date before it is placed into a Record.
         * The date format is specified in the constructor of the {@link Ext.data.Field} to which this type is
         * being applied.
         */
        DATE: {
            convert: function(v) {
                var df = this.dateFormat,
                    parsed;

                if (!v) {
                    return null;
                }
                if (Ext.isDate(v)) {
                    return v;
                }
                if (df) {
                    if (df == 'timestamp') {
                        return new Date(v*1000);
                    }
                    if (df == 'time') {
                        return new Date(parseInt(v, 10));
                    }
                    return Ext.Date.parse(v, df);
                }

                parsed = Date.parse(v);
                return parsed ? new Date(parsed) : null;
            },
            sortType: st.asDate,
            type: 'date'
        }
    });

    Ext.apply(Ext.data.Types, {
        /**
         * @property {Object} BOOLEAN
         * <p>This data type means that the raw data is converted into a boolean before it is placed into
         * a Record. The string "true" and the number 1 are converted to boolean <code>true</code>.</p>
         * <p>The synonym <code>BOOL</code> is equivalent.</p>
         */
        BOOLEAN: this.BOOL,

        /**
         * @property {Object} INTEGER
         * This data type means that the raw data is converted into an integer before it is placed into a Record.
         * <p>The synonym <code>INT</code> is equivalent.</p>
         */
        INTEGER: this.INT,

        /**
         * @property {Object} NUMBER
         * This data type means that the raw data is converted into a number before it is placed into a Record.
         * <p>The synonym <code>FLOAT</code> is equivalent.</p>
         */
        NUMBER: this.FLOAT
    });
});
 
/**
 * @author Ed Spencer
 *
 * Fields are used to define what a Model is. They aren't instantiated directly - instead, when we create a class that
 * extends {@link Ext.data.Model}, it will automatically create a Field instance for each field configured in a {@link
 * Ext.data.Model Model}. For example, we might set up a model like this:
 *
 *     Ext.define('User', {
 *         extend: 'Ext.data.Model',
 *         fields: [
 *             'name', 'email',
 *             {name: 'age', type: 'int'},
 *             {name: 'gender', type: 'string', defaultValue: 'Unknown'}
 *         ]
 *     });
 *
 * Four fields will have been created for the User Model - name, email, age and gender. Note that we specified a couple
 * of different formats here; if we only pass in the string name of the field (as with name and email), the field is set
 * up with the 'auto' type. It's as if we'd done this instead:
 *
 *     Ext.define('User', {
 *         extend: 'Ext.data.Model',
 *         fields: [
 *             {name: 'name', type: 'auto'},
 *             {name: 'email', type: 'auto'},
 *             {name: 'age', type: 'int'},
 *             {name: 'gender', type: 'string', defaultValue: 'Unknown'}
 *         ]
 *     });
 *
 * # Types and conversion
 *
 * The {@link #type} is important - it's used to automatically convert data passed to the field into the correct format.
 * In our example above, the name and email fields used the 'auto' type and will just accept anything that is passed
 * into them. The 'age' field had an 'int' type however, so if we passed 25.4 this would be rounded to 25.
 *
 * Sometimes a simple type isn't enough, or we want to perform some processing when we load a Field's data. We can do
 * this using a {@link #convert} function. Here, we're going to create a new field based on another:
 *
 *     Ext.define('User', {
 *         extend: 'Ext.data.Model',
 *         fields: [
 *             {
 *                 name: 'firstName',
 *                 convert: function(value, record) {
 *                     var fullName  = record.get('name'),
 *                         splits    = fullName.split(" "),
 *                         firstName = splits[0];
 *
 *                     return firstName;
 *                 }
 *             },
 *             'name', 'email',
 *             {name: 'age', type: 'int'},
 *             {name: 'gender', type: 'string', defaultValue: 'Unknown'}
 *         ]
 *     });
 *
 * Now when we create a new User, the firstName is populated automatically based on the name:
 *
 *     var ed = Ext.create('User', {name: 'Ed Spencer'});
 *
 *     console.log(ed.get('firstName')); //logs 'Ed', based on our convert function
 *     
 * Fields which are configured with a custom ```convert``` function are read *after* all other fields
 * when constructing and reading records, so that if convert functions rely on other, non-converted fields
 * (as in this example), they can be sure of those fields being present.
 *
 * In fact, if we log out all of the data inside ed, we'll see this:
 *
 *     console.log(ed.data);
 *
 *     //outputs this:
 *     {
 *         age: 0,
 *         email: "",
 *         firstName: "Ed",
 *         gender: "Unknown",
 *         name: "Ed Spencer"
 *     }
 *
 * The age field has been given a default of zero because we made it an int type. As an auto field, email has defaulted
 * to an empty string. When we registered the User model we set gender's {@link #defaultValue} to 'Unknown' so we see
 * that now. Let's correct that and satisfy ourselves that the types work as we expect:
 *
 *     ed.set('gender', 'Male');
 *     ed.get('gender'); //returns 'Male'
 *
 *     ed.set('age', 25.4);
 *     ed.get('age'); //returns 25 - we wanted an int, not a float, so no decimal places allowed
 */
Ext.define('Ext.data.Field', {
    requires: ['Ext.data.Types', 'Ext.data.SortTypes'],
    alias: 'data.field',
    
    constructor : function(config) {
        if (Ext.isString(config)) {
            config = {name: config};
        }
        Ext.apply(this, config);
        
        var types = Ext.data.Types,
            st = this.sortType;

        if (this.type) {
            if (Ext.isString(this.type)) {
                this.type = types[this.type.toUpperCase()] || types.AUTO;
            }
        } else {
            this.type = types.AUTO;
        }

        // named sortTypes are supported, here we look them up
        if (Ext.isString(st)) {
            this.sortType = Ext.data.SortTypes[st];
        } else if(Ext.isEmpty(st)) {
            this.sortType = this.type.sortType;
        }

        // Reference this type's default converter if we did not recieve one in configuration.
        if (!config.hasOwnProperty('convert')) {
            this.convert = this.type.convert;
        }
        
        
        // If the converter has been nulled out, and we have not been configured
        // with a field-specific defaultValue, then coerce the inherited defaultValue into our data type.
        else if (!this.convert && !config.hasOwnProperty('defaultValue')) {
            this.defaultValue = this.type.convert(this.defaultValue);
        }
    },
    
    /**
     * @cfg {String} name
     *
     * The name by which the field is referenced within the Model. This is referenced by, for example, the `dataIndex`
     * property in column definition objects passed to {@link Ext.grid.property.HeaderContainer}.
     *
     * Note: In the simplest case, if no properties other than `name` are required, a field definition may consist of
     * just a String for the field name.
     */
    
    /**
     * @cfg {String/Object} type
     *
     * The data type for automatic conversion from received data to the *stored* value if
     * `{@link Ext.data.Field#convert convert}` has not been specified. This may be specified as a string value.
     * Possible values are
     *
     * - auto (Default, implies no conversion)
     * - string
     * - int
     * - float
     * - boolean
     * - date
     *
     * This may also be specified by referencing a member of the {@link Ext.data.Types} class.
     *
     * Developers may create their own application-specific data types by defining new members of the {@link
     * Ext.data.Types} class.
     */
    
    /**
     * @cfg {Function} [convert]
     *
     * A function which converts the value provided by the Reader into an object that will be stored in the Model.
     * 
     * If configured as `null`, then no conversion will be applied to the raw data property when this Field
     * is read. This will increase performance. but you must ensure that the data is of the correct type and does
     * not *need* converting.
     * 
     * It is passed the following parameters:
     *
     * - **v** : Mixed
     *
     *   The data value as read by the Reader, if undefined will use the configured `{@link Ext.data.Field#defaultValue
     *   defaultValue}`.
     *
     * - **rec** : Ext.data.Model
     *
     *   The data object containing the Model as read so far by the Reader. Note that the Model may not be fully populated
     *   at this point as the fields are read in the order that they are defined in your
     *   {@link Ext.data.Model#cfg-fields fields} array.
     *
     * Example of convert functions:
     *
     *     function fullName(v, record){
     *         return record.data.last + ', ' + record.data.first;
     *     }
     *
     *     function location(v, record){
     *         return !record.data.city ? '' : (record.data.city + ', ' + record.data.state);
     *     }
     *
     *     Ext.define('Dude', {
     *         extend: 'Ext.data.Model',
     *         fields: [
     *             {name: 'fullname',  convert: fullName},
     *             {name: 'firstname', mapping: 'name.first'},
     *             {name: 'lastname',  mapping: 'name.last'},
     *             {name: 'city', defaultValue: 'homeless'},
     *             'state',
     *             {name: 'location',  convert: location}
     *         ]
     *     });
     *
     *     // create the data store
     *     var store = Ext.create('Ext.data.Store', {
     *         reader: {
     *             type: 'json',
     *             model: 'Dude',
     *             idProperty: 'key',
     *             root: 'daRoot',
     *             totalProperty: 'total'
     *         }
     *     });
     *
     *     var myData = [
     *         { key: 1,
     *           name: { first: 'Fat',    last:  'Albert' }
     *           // notice no city, state provided in data object
     *         },
     *         { key: 2,
     *           name: { first: 'Barney', last:  'Rubble' },
     *           city: 'Bedrock', state: 'Stoneridge'
     *         },
     *         { key: 3,
     *           name: { first: 'Cliff',  last:  'Claven' },
     *           city: 'Boston',  state: 'MA'
     *         }
     *     ];
     */

    /**
     * @cfg {String} dateFormat
     *
     * Used when converting received data into a Date when the {@link #type} is specified as `"date"`.
     *
     * A format string for the {@link Ext.Date#parse Ext.Date.parse} function, or "timestamp" if the value provided by
     * the Reader is a UNIX timestamp, or "time" if the value provided by the Reader is a javascript millisecond
     * timestamp. See {@link Ext.Date}.
     */
    dateFormat: null,
    
    /**
     * @cfg {Boolean} useNull
     *
     * Use when converting received data into a Number type (either int or float). If the value cannot be
     * parsed, null will be used if useNull is true, otherwise the value will be 0. Defaults to false.
     */
    useNull: false,
    
    /**
     * @cfg {Object} [defaultValue=""]
     *
     * The default value used when the creating an instance from a raw data object, and the property referenced by the
     * `{@link Ext.data.Field#mapping mapping}` does not exist in that data object.
     * 
     * May be specified as `undefined` to prevent defaulting in a value.
     */
    defaultValue: "",

    /**
     * @cfg {String/Number} mapping
     *
     * (Optional) A path expression for use by the {@link Ext.data.reader.Reader} implementation that is creating the
     * {@link Ext.data.Model Model} to extract the Field value from the data object. If the path expression is the same
     * as the field name, the mapping may be omitted.
     *
     * The form of the mapping expression depends on the Reader being used.
     *
     * - {@link Ext.data.reader.Json}
     *
     *   The mapping is a string containing the javascript expression to reference the data from an element of the data
     *   item's {@link Ext.data.reader.Json#root root} Array. Defaults to the field name.
     *
     * - {@link Ext.data.reader.Xml}
     *
     *   The mapping is an {@link Ext.DomQuery} path to the data item relative to the DOM element that represents the
     *   {@link Ext.data.reader.Xml#record record}. Defaults to the field name.
     *
     * - {@link Ext.data.reader.Array}
     *
     *   The mapping is a number indicating the Array index of the field's value. Defaults to the field specification's
     *   Array position.
     *
     * If a more complex value extraction strategy is required, then configure the Field with a {@link #convert}
     * function. This is passed the whole row object, and may interrogate it in whatever way is necessary in order to
     * return the desired data.
     */
    mapping: null,

    /**
     * @cfg {Function} sortType
     *
     * A function which converts a Field's value to a comparable value in order to ensure correct sort ordering.
     * Predefined functions are provided in {@link Ext.data.SortTypes}. A custom sort example:
     *
     *     // current sort     after sort we want
     *     // +-+------+          +-+------+
     *     // |1|First |          |1|First |
     *     // |2|Last  |          |3|Second|
     *     // |3|Second|          |2|Last  |
     *     // +-+------+          +-+------+
     *
     *     sortType: function(value) {
     *        switch (value.toLowerCase()) // native toLowerCase():
     *        {
     *           case 'first': return 1;
     *           case 'second': return 2;
     *           default: return 3;
     *        }
     *     }
     */
    sortType : null,

    /**
     * @cfg {String} sortDir
     *
     * Initial direction to sort (`"ASC"` or `"DESC"`). Defaults to `"ASC"`.
     */
    sortDir : "ASC",

    /**
     * @cfg {Boolean} allowBlank
     * @private
     *
     * Used for validating a {@link Ext.data.Model model}. Defaults to true. An empty value here will cause
     * {@link Ext.data.Model}.{@link Ext.data.Model#isValid isValid} to evaluate to false.
     */
    allowBlank : true,

    /**
     * @cfg {Boolean} persist
     *
     * False to exclude this field from the {@link Ext.data.Model#modified} fields in a model. This will also exclude
     * the field from being written using a {@link Ext.data.writer.Writer}. This option is useful when model fields are
     * used to keep state on the client but do not need to be persisted to the server. Defaults to true.
     */
    persist: true
});
 
/**
 * Represents a filter that can be applied to a {@link Ext.util.MixedCollection MixedCollection}. Can either simply
 * filter on a property/value pair or pass in a filter function with custom logic. Filters are always used in the
 * context of MixedCollections, though {@link Ext.data.Store Store}s frequently create them when filtering and searching
 * on their records. Example usage:
 *
 *     //set up a fictional MixedCollection containing a few people to filter on
 *     var allNames = new Ext.util.MixedCollection();
 *     allNames.addAll([
 *         {id: 1, name: 'Ed',    age: 25},
 *         {id: 2, name: 'Jamie', age: 37},
 *         {id: 3, name: 'Abe',   age: 32},
 *         {id: 4, name: 'Aaron', age: 26},
 *         {id: 5, name: 'David', age: 32}
 *     ]);
 *
 *     var ageFilter = new Ext.util.Filter({
 *         property: 'age',
 *         value   : 32
 *     });
 *
 *     var longNameFilter = new Ext.util.Filter({
 *         filterFn: function(item) {
 *             return item.name.length > 4;
 *         }
 *     });
 *
 *     //a new MixedCollection with the 3 names longer than 4 characters
 *     var longNames = allNames.filter(longNameFilter);
 *
 *     //a new MixedCollection with the 2 people of age 32:
 *     var youngFolk = allNames.filter(ageFilter);
 *
 */
Ext.define('Ext.util.Filter', {

    /* Begin Definitions */

    /* End Definitions */
    /**
     * @cfg {String} property
     * The property to filter on. Required unless a {@link #filterFn} is passed
     */
    
    /**
     * @cfg {Function} filterFn
     * A custom filter function which is passed each item in the {@link Ext.util.MixedCollection} in turn. Should return
     * true to accept each item or false to reject it
     */
    
    /**
     * @cfg {Boolean} anyMatch
     * True to allow any match - no regex start/end line anchors will be added.
     */
    anyMatch: false,
    
    /**
     * @cfg {Boolean} exactMatch
     * True to force exact match (^ and $ characters added to the regex). Ignored if anyMatch is true.
     */
    exactMatch: false,
    
    /**
     * @cfg {Boolean} caseSensitive
     * True to make the regex case sensitive (adds 'i' switch to regex).
     */
    caseSensitive: false,
    
    /**
     * @cfg {String} root
     * Optional root property. This is mostly useful when filtering a Store, in which case we set the root to 'data' to
     * make the filter pull the {@link #property} out of the data object of each item
     */

    /**
     * Creates new Filter.
     * @param {Object} [config] Config object
     */
    constructor: function(config) {
        var me = this;
        Ext.apply(me, config);
        
        //we're aliasing filter to filterFn mostly for API cleanliness reasons, despite the fact it dirties the code here.
        //Ext.util.Sorter takes a sorterFn property but allows .sort to be called - we do the same here
        me.filter = me.filter || me.filterFn;
        
        if (me.filter === undefined) {
            if (me.property === undefined || me.value === undefined) {
                // Commented this out temporarily because it stops us using string ids in models. TODO: Remove this once
                // Model has been updated to allow string ids
                
                // Ext.Error.raise("A Filter requires either a property or a filterFn to be set");
            } else {
                me.filter = me.createFilterFn();
            }
            
            me.filterFn = me.filter;
        }
    },
    
    /**
     * @private
     * Creates a filter function for the configured property/value/anyMatch/caseSensitive options for this Filter
     */
    createFilterFn: function() {
        var me       = this,
            matcher  = me.createValueMatcher(),
            property = me.property;
        
        return function(item) {
            var value = me.getRoot.call(me, item)[property];
            return matcher === null ? value === null : matcher.test(value);
        };
    },
    
    /**
     * @private
     * Returns the root property of the given item, based on the configured {@link #root} property
     * @param {Object} item The item
     * @return {Object} The root property of the object
     */
    getRoot: function(item) {
        var root = this.root;
        return root === undefined ? item : item[root];
    },
    
    /**
     * @private
     * Returns a regular expression based on the given value and matching options
     */
    createValueMatcher : function() {
        var me            = this,
            value         = me.value,
            anyMatch      = me.anyMatch,
            exactMatch    = me.exactMatch,
            caseSensitive = me.caseSensitive,
            escapeRe      = Ext.String.escapeRegex;
            
        if (value === null) {
            return value;
        }
        
        if (!value.exec) { // not a regex
            value = String(value);

            if (anyMatch === true) {
                value = escapeRe(value);
            } else {
                value = '^' + escapeRe(value);
                if (exactMatch === true) {
                    value += '$';
                }
            }
            value = new RegExp(value, caseSensitive ? '' : 'i');
         }
         
         return value;
    }
}); 
/**
 * @class Ext.util.AbstractMixedCollection
 * @private
 */
Ext.define('Ext.util.AbstractMixedCollection', {
    requires: ['Ext.util.Filter'],

    mixins: {
        observable: 'Ext.util.Observable'
    },

    /**
     * @property {Boolean} isMixedCollection
     * `true` in this class to identify an objact as an instantiated MixedCollection, or subclass thereof.
     */
    isMixedCollection: true,

    /**
     * @private Mutation counter which is incremented upon add and remove.
     */
    generation: 0,

    constructor: function(allowFunctions, keyFn) {
        var me = this;

        me.items = [];
        me.map = {};
        me.keys = [];
        me.length = 0;

            /**
             * @event clear
             * Fires when the collection is cleared.
             */

            /**
             * @event add
             * Fires when an item is added to the collection.
             * @param {Number} index The index at which the item was added.
             * @param {Object} o The item added.
             * @param {String} key The key associated with the added item.
             */

            /**
             * @event replace
             * Fires when an item is replaced in the collection.
             * @param {String} key he key associated with the new added.
             * @param {Object} old The item being replaced.
             * @param {Object} new The new item.
             */
            /**
             * @event remove
             * Fires when an item is removed from the collection.
             * @param {Object} o The item being removed.
             * @param {String} key (optional) The key associated with the removed item.
             */

        me.allowFunctions = allowFunctions === true;

        if (keyFn) {
            me.getKey = keyFn;
        }

        me.mixins.observable.constructor.call(me);
    },

    /**
     * @cfg {Boolean} allowFunctions Specify <code>true</code> if the {@link #addAll}
     * function should add function references to the collection. Defaults to
     * <code>false</code>.
     */
    allowFunctions : false,

    /**
     * Adds an item to the collection. Fires the {@link #event-add} event when complete.
     * @param {String} key <p>The key to associate with the item, or the new item.</p>
     * <p>If a {@link #getKey} implementation was specified for this MixedCollection,
     * or if the key of the stored items is in a property called <code><b>id</b></code>,
     * the MixedCollection will be able to <i>derive</i> the key for the new item.
     * In this case just pass the new item in this parameter.</p>
     * @param {Object} o The item to add.
     * @return {Object} The item added.
     */
    add : function(key, obj){
        var me = this,
            myObj = obj,
            myKey = key,
            old;

        if (arguments.length == 1) {
            myObj = myKey;
            myKey = me.getKey(myObj);
        }
        if (typeof myKey != 'undefined' && myKey !== null) {
            old = me.map[myKey];
            if (typeof old != 'undefined') {
                return me.replace(myKey, myObj);
            }
            me.map[myKey] = myObj;
        }
        me.generation++;
        me.length++;
        me.items.push(myObj);
        me.keys.push(myKey);
        if (me.hasListeners.add) {
            me.fireEvent('add', me.length - 1, myObj, myKey);
        }
        return myObj;
    },

    /**
      * MixedCollection has a generic way to fetch keys if you implement getKey.  The default implementation
      * simply returns <b><code>item.id</code></b> but you can provide your own implementation
      * to return a different value as in the following examples:<pre><code>
// normal way
var mc = new Ext.util.MixedCollection();
mc.add(someEl.dom.id, someEl);
mc.add(otherEl.dom.id, otherEl);
//and so on

// using getKey
var mc = new Ext.util.MixedCollection();
mc.getKey = function(el){
   return el.dom.id;
};
mc.add(someEl);
mc.add(otherEl);

// or via the constructor
var mc = new Ext.util.MixedCollection(false, function(el){
   return el.dom.id;
});
mc.add(someEl);
mc.add(otherEl);
     * </code></pre>
     * @param {Object} item The item for which to find the key.
     * @return {Object} The key for the passed item.
     */
    getKey : function(o){
         return o.id;
    },

    /**
     * Replaces an item in the collection. Fires the {@link #event-replace} event when complete.
     * @param {String} key <p>The key associated with the item to replace, or the replacement item.</p>
     * <p>If you supplied a {@link #getKey} implementation for this MixedCollection, or if the key
     * of your stored items is in a property called <code><b>id</b></code>, then the MixedCollection
     * will be able to <i>derive</i> the key of the replacement item. If you want to replace an item
     * with one having the same key value, then just pass the replacement item in this parameter.</p>
     * @param o {Object} o (optional) If the first parameter passed was a key, the item to associate
     * with that key.
     * @return {Object}  The new item.
     */
    replace : function(key, o){
        var me = this,
            old,
            index;

        if (arguments.length == 1) {
            o = arguments[0];
            key = me.getKey(o);
        }
        old = me.map[key];
        if (typeof key == 'undefined' || key === null || typeof old == 'undefined') {
             return me.add(key, o);
        }
        me.generation++;
        index = me.indexOfKey(key);
        me.items[index] = o;
        me.map[key] = o;
        if (me.hasListeners.replace) {
            me.fireEvent('replace', key, old, o);
        }
        return o;
    },

    /**
     * Adds all elements of an Array or an Object to the collection.
     * @param {Object/Array} objs An Object containing properties which will be added
     * to the collection, or an Array of values, each of which are added to the collection.
     * Functions references will be added to the collection if <code>{@link #allowFunctions}</code>
     * has been set to <code>true</code>.
     */
    addAll : function(objs){
        var me = this,
            i = 0,
            args,
            len,
            key;

        if (arguments.length > 1 || Ext.isArray(objs)) {
            args = arguments.length > 1 ? arguments : objs;
            for (len = args.length; i < len; i++) {
                me.add(args[i]);
            }
        } else {
            for (key in objs) {
                if (objs.hasOwnProperty(key)) {
                    if (me.allowFunctions || typeof objs[key] != 'function') {
                        me.add(key, objs[key]);
                    }
                }
            }
        }
    },

    /**
     * Executes the specified function once for every item in the collection, passing the following arguments:
     * <div class="mdetail-params"><ul>
     * <li><b>item</b> : Mixed<p class="sub-desc">The collection item</p></li>
     * <li><b>index</b> : Number<p class="sub-desc">The item's index</p></li>
     * <li><b>length</b> : Number<p class="sub-desc">The total number of items in the collection</p></li>
     * </ul></div>
     * The function should return a boolean value. Returning false from the function will stop the iteration.
     * @param {Function} fn The function to execute for each item.
     * @param {Object} scope (optional) The scope (<code>this</code> reference) in which the function is executed. Defaults to the current item in the iteration.
     */
    each : function(fn, scope){
        var items = [].concat(this.items), // each safe for removal
            i = 0,
            len = items.length,
            item;

        for (; i < len; i++) {
            item = items[i];
            if (fn.call(scope || item, item, i, len) === false) {
                break;
            }
        }
    },

    /**
     * Executes the specified function once for every key in the collection, passing each
     * key, and its associated item as the first two parameters.
     * @param {Function} fn The function to execute for each item.
     * @param {Object} scope (optional) The scope (<code>this</code> reference) in which the function is executed. Defaults to the browser window.
     */
    eachKey : function(fn, scope){
        var keys = this.keys,
            items = this.items,
            i = 0,
            len = keys.length;

        for (; i < len; i++) {
            fn.call(scope || window, keys[i], items[i], i, len);
        }
    },

    /**
     * Returns the first item in the collection which elicits a true return value from the
     * passed selection function.
     * @param {Function} fn The selection function to execute for each item.
     * @param {Object} scope (optional) The scope (<code>this</code> reference) in which the function is executed. Defaults to the browser window.
     * @return {Object} The first item in the collection which returned true from the selection function, or null if none was found
     */
    findBy : function(fn, scope) {
        var keys = this.keys,
            items = this.items,
            i = 0,
            len = items.length;

        for (; i < len; i++) {
            if (fn.call(scope || window, items[i], keys[i])) {
                return items[i];
            }
        }
        return null;
    },

    //<deprecated since="0.99">
    find : function() {
        if (Ext.isDefined(Ext.global.console)) {
            Ext.global.console.warn('Ext.util.MixedCollection: find has been deprecated. Use findBy instead.');
        }
        return this.findBy.apply(this, arguments);
    },
    //</deprecated>

    /**
     * Inserts an item at the specified index in the collection. Fires the {@link #event-add} event when complete.
     * @param {Number} index The index to insert the item at.
     * @param {String} key The key to associate with the new item, or the item itself.
     * @param {Object} o (optional) If the second parameter was a key, the new item.
     * @return {Object} The item inserted.
     */
    insert : function(index, key, obj){
        var me = this,
            myKey = key,
            myObj = obj;

        if (arguments.length == 2) {
            myObj = myKey;
            myKey = me.getKey(myObj);
        }
        if (me.containsKey(myKey)) {
            me.suspendEvents();
            me.removeAtKey(myKey);
            me.resumeEvents();
        }
        if (index >= me.length) {
            return me.add(myKey, myObj);
        }
        me.generation++;
        me.length++;
        Ext.Array.splice(me.items, index, 0, myObj);
        if (typeof myKey != 'undefined' && myKey !== null) {
            me.map[myKey] = myObj;
        }
        Ext.Array.splice(me.keys, index, 0, myKey);
        if (me.hasListeners.add) {
            me.fireEvent('add', index, myObj, myKey);
        }
        return myObj;
    },

    /**
     * Remove an item from the collection.
     * @param {Object} o The item to remove.
     * @return {Object} The item removed or false if no item was removed.
     */
    remove : function(o) {
        this.generation++;
        return this.removeAt(this.indexOf(o));
    },

    /**
     * Remove all items in the passed array from the collection.
     * @param {Array} items An array of items to be removed.
     * @return {Ext.util.MixedCollection} this object
     */
    removeAll : function(items) {
        items = [].concat(items);
        var i, iLen = items.length;
        for (i = 0; i < iLen; i++) {
            this.remove(items[i]);
        }

        return this;
    },

    /**
     * Remove an item from a specified index in the collection. Fires the {@link #event-remove} event when complete.
     * @param {Number} index The index within the collection of the item to remove.
     * @return {Object} The item removed or false if no item was removed.
     */
    removeAt : function(index) {
        var me = this,
            o,
            key;

        if (index < me.length && index >= 0) {
            me.length--;
            o = me.items[index];
            Ext.Array.erase(me.items, index, 1);
            key = me.keys[index];
            if (typeof key != 'undefined') {
                delete me.map[key];
            }
            Ext.Array.erase(me.keys, index, 1);
            if (me.hasListeners.remove) {
                me.fireEvent('remove', o, key);
            }
            me.generation++;
            return o;
        }
        return false;
    },

    /**
     * Removed an item associated with the passed key fom the collection.
     * @param {String} key The key of the item to remove.
     * @return {Object} The item removed or false if no item was removed.
     */
    removeAtKey : function(key){
        return this.removeAt(this.indexOfKey(key));
    },

    /**
     * Returns the number of items in the collection.
     * @return {Number} the number of items in the collection.
     */
    getCount : function(){
        return this.length;
    },

    /**
     * Returns index within the collection of the passed Object.
     * @param {Object} o The item to find the index of.
     * @return {Number} index of the item. Returns -1 if not found.
     */
    indexOf : function(o){
        return Ext.Array.indexOf(this.items, o);
    },

    /**
     * Returns index within the collection of the passed key.
     * @param {String} key The key to find the index of.
     * @return {Number} index of the key.
     */
    indexOfKey : function(key){
        return Ext.Array.indexOf(this.keys, key);
    },

    /**
     * Returns the item associated with the passed key OR index.
     * Key has priority over index.  This is the equivalent
     * of calling {@link #getByKey} first, then if nothing matched calling {@link #getAt}.
     * @param {String/Number} key The key or index of the item.
     * @return {Object} If the item is found, returns the item.  If the item was not found, returns <code>undefined</code>.
     * If an item was found, but is a Class, returns <code>null</code>.
     */
    get : function(key) {
        var me = this,
            mk = me.map[key],
            item = mk !== undefined ? mk : (typeof key == 'number') ? me.items[key] : undefined;
        return typeof item != 'function' || me.allowFunctions ? item : null; // for prototype!
    },

    /**
     * Returns the item at the specified index.
     * @param {Number} index The index of the item.
     * @return {Object} The item at the specified index.
     */
    getAt : function(index) {
        return this.items[index];
    },

    /**
     * Returns the item associated with the passed key.
     * @param {String/Number} key The key of the item.
     * @return {Object} The item associated with the passed key.
     */
    getByKey : function(key) {
        return this.map[key];
    },

    /**
     * Returns true if the collection contains the passed Object as an item.
     * @param {Object} o  The Object to look for in the collection.
     * @return {Boolean} True if the collection contains the Object as an item.
     */
    contains : function(o){
        return typeof this.map[this.getKey(o)] != 'undefined';
    },

    /**
     * Returns true if the collection contains the passed Object as a key.
     * @param {String} key The key to look for in the collection.
     * @return {Boolean} True if the collection contains the Object as a key.
     */
    containsKey : function(key){
        return typeof this.map[key] != 'undefined';
    },

    /**
     * Removes all items from the collection.  Fires the {@link #event-clear} event when complete.
     */
    clear : function(){
        var me = this;

        me.length = 0;
        me.items = [];
        me.keys = [];
        me.map = {};
        me.generation++;
        if (me.hasListeners.clear) {
            me.fireEvent('clear');
        }
    },

    /**
     * Returns the first item in the collection.
     * @return {Object} the first item in the collection..
     */
    first : function() {
        return this.items[0];
    },

    /**
     * Returns the last item in the collection.
     * @return {Object} the last item in the collection..
     */
    last : function() {
        return this.items[this.length - 1];
    },

    /**
     * Collects all of the values of the given property and returns their sum
     * @param {String} property The property to sum by
     * @param {String} [root] 'root' property to extract the first argument from. This is used mainly when
     * summing fields in records, where the fields are all stored inside the 'data' object
     * @param {Number} [start=0] The record index to start at
     * @param {Number} [end=-1] The record index to end at
     * @return {Number} The total
     */
    sum: function(property, root, start, end) {
        var values = this.extractValues(property, root),
            length = values.length,
            sum    = 0,
            i;

        start = start || 0;
        end   = (end || end === 0) ? end : length - 1;

        for (i = start; i <= end; i++) {
            sum += values[i];
        }

        return sum;
    },

    /**
     * Collects unique values of a particular property in this MixedCollection
     * @param {String} property The property to collect on
     * @param {String} root (optional) 'root' property to extract the first argument from. This is used mainly when
     * summing fields in records, where the fields are all stored inside the 'data' object
     * @param {Boolean} allowBlank (optional) Pass true to allow null, undefined or empty string values
     * @return {Array} The unique values
     */
    collect: function(property, root, allowNull) {
        var values = this.extractValues(property, root),
            length = values.length,
            hits   = {},
            unique = [],
            value, strValue, i;

        for (i = 0; i < length; i++) {
            value = values[i];
            strValue = String(value);

            if ((allowNull || !Ext.isEmpty(value)) && !hits[strValue]) {
                hits[strValue] = true;
                unique.push(value);
            }
        }

        return unique;
    },

    /**
     * @private
     * Extracts all of the given property values from the items in the MC. Mainly used as a supporting method for
     * functions like sum and collect.
     * @param {String} property The property to extract
     * @param {String} root (optional) 'root' property to extract the first argument from. This is used mainly when
     * extracting field data from Model instances, where the fields are stored inside the 'data' object
     * @return {Array} The extracted values
     */
    extractValues: function(property, root) {
        var values = this.items;

        if (root) {
            values = Ext.Array.pluck(values, root);
        }

        return Ext.Array.pluck(values, property);
    },

    /**
     * Returns a range of items in this collection
     * @param {Number} startIndex (optional) The starting index. Defaults to 0.
     * @param {Number} endIndex (optional) The ending index. Defaults to the last item.
     * @return {Array} An array of items
     */
    getRange : function(start, end){
        var me = this,
            items = me.items,
            range = [],
            i;

        if (items.length < 1) {
            return range;
        }

        start = start || 0;
        end = Math.min(typeof end == 'undefined' ? me.length - 1 : end, me.length - 1);
        if (start <= end) {
            for (i = start; i <= end; i++) {
                range[range.length] = items[i];
            }
        } else {
            for (i = start; i >= end; i--) {
                range[range.length] = items[i];
            }
        }
        return range;
    },

    /**
     * <p>Filters the objects in this collection by a set of {@link Ext.util.Filter Filter}s, or by a single
     * property/value pair with optional parameters for substring matching and case sensitivity. See
     * {@link Ext.util.Filter Filter} for an example of using Filter objects (preferred). Alternatively,
     * MixedCollection can be easily filtered by property like this:</p>
<pre><code>
//create a simple store with a few people defined
var people = new Ext.util.MixedCollection();
people.addAll([
    {id: 1, age: 25, name: 'Ed'},
    {id: 2, age: 24, name: 'Tommy'},
    {id: 3, age: 24, name: 'Arne'},
    {id: 4, age: 26, name: 'Aaron'}
]);

//a new MixedCollection containing only the items where age == 24
var middleAged = people.filter('age', 24);
</code></pre>
     *
     *
     * @param {Ext.util.Filter[]/String} property A property on your objects, or an array of {@link Ext.util.Filter Filter} objects
     * @param {String/RegExp} value Either string that the property values
     * should start with or a RegExp to test against the property
     * @param {Boolean} [anyMatch=false] True to match any part of the string, not just the beginning
     * @param {Boolean} [caseSensitive=false] True for case sensitive comparison.
     * @return {Ext.util.MixedCollection} The new filtered collection
     */
    filter : function(property, value, anyMatch, caseSensitive) {
        var filters = [],
            filterFn;

        //support for the simple case of filtering by property/value
        if (Ext.isString(property)) {
            filters.push(new Ext.util.Filter({
                property     : property,
                value        : value,
                anyMatch     : anyMatch,
                caseSensitive: caseSensitive
            }));
        } else if (Ext.isArray(property) || property instanceof Ext.util.Filter) {
            filters = filters.concat(property);
        }

        //at this point we have an array of zero or more Ext.util.Filter objects to filter with,
        //so here we construct a function that combines these filters by ANDing them together
        filterFn = function(record) {
            var isMatch = true,
                length = filters.length,
                i,
                filter,
                fn,
                scope;
                

            for (i = 0; i < length; i++) {
                filter = filters[i];
                fn     = filter.filterFn;
                scope  = filter.scope;

                isMatch = isMatch && fn.call(scope, record);
            }

            return isMatch;
        };

        return this.filterBy(filterFn);
    },

    /**
     * Filter by a function. Returns a <i>new</i> collection that has been filtered.
     * The passed function will be called with each object in the collection.
     * If the function returns true, the value is included otherwise it is filtered.
     * @param {Function} fn The function to be called, it will receive the args o (the object), k (the key)
     * @param {Object} scope (optional) The scope (<code>this</code> reference) in which the function is executed. Defaults to this MixedCollection.
     * @return {Ext.util.MixedCollection} The new filtered collection
     */
    filterBy : function(fn, scope) {
        var me = this,
            newMC  = new this.self(),
            keys   = me.keys,
            items  = me.items,
            length = items.length,
            i;

        newMC.getKey = me.getKey;

        for (i = 0; i < length; i++) {
            if (fn.call(scope || me, items[i], keys[i])) {
                newMC.add(keys[i], items[i]);
            }
        }

        return newMC;
    },

    /**
     * Finds the index of the first matching object in this collection by a specific property/value.
     * @param {String} property The name of a property on your objects.
     * @param {String/RegExp} value A string that the property values
     * should start with or a RegExp to test against the property.
     * @param {Number} [start=0] The index to start searching at.
     * @param {Boolean} [anyMatch=false] True to match any part of the string, not just the beginning.
     * @param {Boolean} [caseSensitive=false] True for case sensitive comparison.
     * @return {Number} The matched index or -1
     */
    findIndex : function(property, value, start, anyMatch, caseSensitive){
        if(Ext.isEmpty(value, false)){
            return -1;
        }
        value = this.createValueMatcher(value, anyMatch, caseSensitive);
        return this.findIndexBy(function(o){
            return o && value.test(o[property]);
        }, null, start);
    },

    /**
     * Find the index of the first matching object in this collection by a function.
     * If the function returns <i>true</i> it is considered a match.
     * @param {Function} fn The function to be called, it will receive the args o (the object), k (the key).
     * @param {Object} [scope] The scope (<code>this</code> reference) in which the function is executed. Defaults to this MixedCollection.
     * @param {Number} [start=0] The index to start searching at.
     * @return {Number} The matched index or -1
     */
    findIndexBy : function(fn, scope, start){
        var me = this,
            keys = me.keys,
            items = me.items,
            i = start || 0,
            len = items.length;

        for (; i < len; i++) {
            if (fn.call(scope || me, items[i], keys[i])) {
                return i;
            }
        }
        return -1;
    },

    /**
     * Returns a regular expression based on the given value and matching options. This is used internally for finding and filtering,
     * and by Ext.data.Store#filter
     * @private
     * @param {String} value The value to create the regex for. This is escaped using Ext.escapeRe
     * @param {Boolean} anyMatch True to allow any match - no regex start/end line anchors will be added. Defaults to false
     * @param {Boolean} caseSensitive True to make the regex case sensitive (adds 'i' switch to regex). Defaults to false.
     * @param {Boolean} exactMatch True to force exact match (^ and $ characters added to the regex). Defaults to false. Ignored if anyMatch is true.
     */
    createValueMatcher : function(value, anyMatch, caseSensitive, exactMatch) {
        if (!value.exec) { // not a regex
            var er = Ext.String.escapeRegex;
            value = String(value);

            if (anyMatch === true) {
                value = er(value);
            } else {
                value = '^' + er(value);
                if (exactMatch === true) {
                    value += '$';
                }
            }
            value = new RegExp(value, caseSensitive ? '' : 'i');
        }
        return value;
    },

    /**
     * Creates a shallow copy of this collection
     * @return {Ext.util.MixedCollection}
     */
    clone : function() {
        var me = this,
            copy = new this.self(),
            keys = me.keys,
            items = me.items,
            i = 0,
            len = items.length;

        for(; i < len; i++){
            copy.add(keys[i], items[i]);
        }
        copy.getKey = me.getKey;
        return copy;
    }
});
 
/**
 * Represents a single sorter that can be applied to a Store. The sorter is used
 * to compare two values against each other for the purpose of ordering them. Ordering
 * is achieved by specifying either:
 *
 * - {@link #property A sorting property}
 * - {@link #sorterFn A sorting function}
 *
 * As a contrived example, we can specify a custom sorter that sorts by rank:
 *
 *     Ext.define('Person', {
 *         extend: 'Ext.data.Model',
 *         fields: ['name', 'rank']
 *     });
 *
 *     Ext.create('Ext.data.Store', {
 *         model: 'Person',
 *         proxy: 'memory',
 *         sorters: [{
 *             sorterFn: function(o1, o2){
 *                 var getRank = function(o){
 *                     var name = o.get('rank');
 *                     if (name === 'first') {
 *                         return 1;
 *                     } else if (name === 'second') {
 *                         return 2;
 *                     } else {
 *                         return 3;
 *                     }
 *                 },
 *                 rank1 = getRank(o1),
 *                 rank2 = getRank(o2);
 *
 *                 if (rank1 === rank2) {
 *                     return 0;
 *                 }
 *
 *                 return rank1 < rank2 ? -1 : 1;
 *             }
 *         }],
 *         data: [{
 *             name: 'Person1',
 *             rank: 'second'
 *         }, {
 *             name: 'Person2',
 *             rank: 'third'
 *         }, {
 *             name: 'Person3',
 *             rank: 'first'
 *         }]
 *     });
 */
Ext.define('Ext.util.Sorter', {

    /**
     * @cfg {String} property
     * The property to sort by. Required unless {@link #sorterFn} is provided. The property is extracted from the object
     * directly and compared for sorting using the built in comparison operators.
     */
    
    /**
     * @cfg {Function} sorterFn
     * A specific sorter function to execute. Can be passed instead of {@link #property}. This sorter function allows
     * for any kind of custom/complex comparisons. The sorterFn receives two arguments, the objects being compared. The
     * function should return:
     *
     *   - -1 if o1 is "less than" o2
     *   - 0 if o1 is "equal" to o2
     *   - 1 if o1 is "greater than" o2
     */
    
    /**
     * @cfg {String} root
     * Optional root property. This is mostly useful when sorting a Store, in which case we set the root to 'data' to
     * make the filter pull the {@link #property} out of the data object of each item
     */
    
    /**
     * @cfg {Function} transform
     * A function that will be run on each value before it is compared in the sorter. The function will receive a single
     * argument, the value.
     */
    
    /**
     * @cfg {String} direction
     * The direction to sort by.
     */
    direction: "ASC",
    
    constructor: function(config) {
        var me = this;
        
        Ext.apply(me, config);
        
        //<debug>
        if (me.property === undefined && me.sorterFn === undefined) {
            Ext.Error.raise("A Sorter requires either a property or a sorter function");
        }
        //</debug>
        
        me.updateSortFunction();
    },
    
    /**
     * @private
     * Creates and returns a function which sorts an array by the given property and direction
     * @return {Function} A function which sorts by the property/direction combination provided
     */
    createSortFunction: function(sorterFn) {
        var me        = this,
            property  = me.property,
            direction = me.direction || "ASC",
            modifier  = direction.toUpperCase() == "DESC" ? -1 : 1;
        
        //create a comparison function. Takes 2 objects, returns 1 if object 1 is greater,
        //-1 if object 2 is greater or 0 if they are equal
        return function(o1, o2) {
            return modifier * sorterFn.call(me, o1, o2);
        };
    },
    
    /**
     * @private
     * Basic default sorter function that just compares the defined property of each object
     */
    defaultSorterFn: function(o1, o2) {
        var me = this,
            transform = me.transform,
            v1 = me.getRoot(o1)[me.property],
            v2 = me.getRoot(o2)[me.property];
            
        if (transform) {
            v1 = transform(v1);
            v2 = transform(v2);
        }

        return v1 > v2 ? 1 : (v1 < v2 ? -1 : 0);
    },
    
    /**
     * @private
     * Returns the root property of the given item, based on the configured {@link #root} property
     * @param {Object} item The item
     * @return {Object} The root property of the object
     */
    getRoot: function(item) {
        return this.root === undefined ? item : item[this.root];
    },
    
    /**
     * Set the sorting direction for this sorter.
     * @param {String} direction The direction to sort in. Should be either 'ASC' or 'DESC'.
     */
    setDirection: function(direction) {
        var me = this;
        me.direction = direction;
        me.updateSortFunction();
    },
    
    /**
     * Toggles the sorting direction for this sorter.
     */
    toggle: function() {
        var me = this;
        me.direction = Ext.String.toggle(me.direction, "ASC", "DESC");
        me.updateSortFunction();
    },
    
    /**
     * Update the sort function for this sorter.
     * @param {Function} [fn] A new sorter function for this sorter. If not specified it will use the default
     * sorting function.
     */
    updateSortFunction: function(fn) {
        var me = this;
        fn = fn || me.sorterFn || me.defaultSorterFn;
        me.sort = me.createSortFunction(fn);
    }
}); 
/**
 * @docauthor Tommy Maintz <tommy@sencha.com>
 *
 * A mixin which allows a data component to be sorted. This is used by e.g. {@link Ext.data.Store} and {@link Ext.data.TreeStore}.
 *
 * **NOTE**: This mixin is mainly for internal use and most users should not need to use it directly. It
 * is more likely you will want to use one of the component classes that import this mixin, such as
 * {@link Ext.data.Store} or {@link Ext.data.TreeStore}.
 */
Ext.define("Ext.util.Sortable", {
    /**
     * @property {Boolean} isSortable
     * `true` in this class to identify an object as an instantiated Sortable, or subclass thereof.
     */
    isSortable: true,

    /**
     * @property {String} defaultSortDirection
     * The default sort direction to use if one is not specified.
     */
    defaultSortDirection: "ASC",

    requires: [
        'Ext.util.Sorter'
    ],

    /**
     * @property {String} sortRoot
     * The property in each item that contains the data to sort.
     */

    /**
     * Performs initialization of this mixin. Component classes using this mixin should call this method during their
     * own initialization.
     */
    initSortable: function() {
        var me = this,
            sorters = me.sorters;

        /**
         * @property {Ext.util.MixedCollection} sorters
         * The collection of {@link Ext.util.Sorter Sorters} currently applied to this Store
         */
        me.sorters = new Ext.util.AbstractMixedCollection(false, function(item) {
            return item.id || item.property;
        });

        if (sorters) {
            me.sorters.addAll(me.decodeSorters(sorters));
        }
    },

    /**
     * Sorts the data in the Store by one or more of its properties. Example usage:
     *
     *     //sort by a single field
     *     myStore.sort('myField', 'DESC');
     *
     *     //sorting by multiple fields
     *     myStore.sort([
     *         {
     *             property : 'age',
     *             direction: 'ASC'
     *         },
     *         {
     *             property : 'name',
     *             direction: 'DESC'
     *         }
     *     ]);
     *
     * Internally, Store converts the passed arguments into an array of {@link Ext.util.Sorter} instances, and delegates
     * the actual sorting to its internal {@link Ext.util.MixedCollection}.
     *
     * When passing a single string argument to sort, Store maintains a ASC/DESC toggler per field, so this code:
     *
     *     store.sort('myField');
     *     store.sort('myField');
     *
     * Is equivalent to this code, because Store handles the toggling automatically:
     *
     *     store.sort('myField', 'ASC');
     *     store.sort('myField', 'DESC');
     *
     * @param {String/Ext.util.Sorter[]} sorters Either a string name of one of the fields in this Store's configured
     * {@link Ext.data.Model Model}, or an array of sorter configurations.
     * @param {String} direction The overall direction to sort the data by. Defaults to "ASC".
     * @return {Ext.util.Sorter[]}
     */
    sort: function(sorters, direction, where, doSort) {
        var me = this,
            sorter, sorterFn,
            newSorters;

        if (Ext.isArray(sorters)) {
            doSort = where;
            where = direction;
            newSorters = sorters;
        }
        else if (Ext.isObject(sorters)) {
            doSort = where;
            where = direction;
            newSorters = [sorters];
        }
        else if (Ext.isString(sorters)) {
            sorter = me.sorters.get(sorters);

            if (!sorter) {
                sorter = {
                    property : sorters,
                    direction: direction
                };
                newSorters = [sorter];
            }
            else if (direction === undefined) {
                sorter.toggle();
            }
            else {
                sorter.setDirection(direction);
            }
        }

        if (newSorters && newSorters.length) {
            newSorters = me.decodeSorters(newSorters);
            if (Ext.isString(where)) {
                if (where === 'prepend') {
                    sorters = me.sorters.clone().items;

                    me.sorters.clear();
                    me.sorters.addAll(newSorters);
                    me.sorters.addAll(sorters);
                }
                else {
                    me.sorters.addAll(newSorters);
                }
            }
            else {
                me.sorters.clear();
                me.sorters.addAll(newSorters);
            }
        }

        if (doSort !== false) {
            me.onBeforeSort(newSorters);
            
            sorters = me.sorters.items;
            if (sorters.length) {
                // Sort using a generated sorter function which combines all of the Sorters passed
                me.doSort(me.generateComparator());
            }
        }

        return sorters;
    },

    /**
     * <p>Returns a comparator function which compares two items and returns -1, 0, or 1 depending
     * on the currently defined set of {@link #sorters}.</p>
     * <p>If there are no {@link #sorters} defined, it returns a function which returns <code>0</code> meaning that no sorting will occur.</p>
     */
    generateComparator: function() {
        var sorters = this.sorters.getRange();
        return sorters.length ? this.createComparator(sorters) : this.emptyComparator;
    },
    
    createComparator: function(sorters) {
        return function(r1, r2) {
            var result = sorters[0].sort(r1, r2),
                length = sorters.length,
                i = 1;

            // if we have more than one sorter, OR any additional sorter functions together
            for (; i < length; i++) {
                result = result || sorters[i].sort.call(this, r1, r2);
            }
            return result;
        };
    },
    
    emptyComparator: function(){
        return 0;
    },

    onBeforeSort: Ext.emptyFn,

    /**
     * @private
     * Normalizes an array of sorter objects, ensuring that they are all Ext.util.Sorter instances
     * @param {Object[]} sorters The sorters array
     * @return {Ext.util.Sorter[]} Array of Ext.util.Sorter objects
     */
    decodeSorters: function(sorters) {
        if (!Ext.isArray(sorters)) {
            if (sorters === undefined) {
                sorters = [];
            } else {
                sorters = [sorters];
            }
        }

        var length = sorters.length,
            Sorter = Ext.util.Sorter,
            fields = this.model ? this.model.prototype.fields : null,
            field,
            config, i;

        for (i = 0; i < length; i++) {
            config = sorters[i];

            if (!(config instanceof Sorter)) {
                if (Ext.isString(config)) {
                    config = {
                        property: config
                    };
                }

                Ext.applyIf(config, {
                    root     : this.sortRoot,
                    direction: "ASC"
                });

                //support for 3.x style sorters where a function can be defined as 'fn'
                if (config.fn) {
                    config.sorterFn = config.fn;
                }

                //support a function to be passed as a sorter definition
                if (typeof config == 'function') {
                    config = {
                        sorterFn: config
                    };
                }

                // ensure sortType gets pushed on if necessary
                if (fields && !config.transform) {
                    field = fields.get(config.property);
                    config.transform = field ? field.sortType : undefined;
                }
                sorters[i] = new Ext.util.Sorter(config);
            }
        }

        return sorters;
    },

    getSorters: function() {
        return this.sorters.items;
    }
}); 
/**
 * @class Ext.util.MixedCollection
 * <p>
 * Represents a collection of a set of key and value pairs. Each key in the MixedCollection
 * must be unique, the same key cannot exist twice. This collection is ordered, items in the
 * collection can be accessed by index  or via the key. Newly added items are added to
 * the end of the collection. This class is similar to {@link Ext.util.HashMap} however it
 * is heavier and provides more functionality. Sample usage:
 * <pre><code>
var coll = new Ext.util.MixedCollection();
coll.add('key1', 'val1');
coll.add('key2', 'val2');
coll.add('key3', 'val3');

console.log(coll.get('key1')); // prints 'val1'
console.log(coll.indexOfKey('key3')); // prints 2
 * </code></pre>
 *
 * <p>
 * The MixedCollection also has support for sorting and filtering of the values in the collection.
 * <pre><code>
var coll = new Ext.util.MixedCollection();
coll.add('key1', 100);
coll.add('key2', -100);
coll.add('key3', 17);
coll.add('key4', 0);
var biggerThanZero = coll.filterBy(function(value){
    return value > 0;
});
console.log(biggerThanZero.getCount()); // prints 2
 * </code></pre>
 * </p>
 */
Ext.define('Ext.util.MixedCollection', {
    extend: 'Ext.util.AbstractMixedCollection',
    mixins: {
        sortable: 'Ext.util.Sortable'
    },

    /**
     * Creates new MixedCollection.
     * @param {Boolean} allowFunctions Specify <tt>true</tt> if the {@link #addAll}
     * function should add function references to the collection. Defaults to
     * <tt>false</tt>.
     * @param {Function} keyFn A function that can accept an item of the type(s) stored in this MixedCollection
     * and return the key value for that item.  This is used when available to look up the key on items that
     * were passed without an explicit key parameter to a MixedCollection method.  Passing this parameter is
     * equivalent to providing an implementation for the {@link #getKey} method.
     */
    constructor: function() {
        var me = this;
        me.callParent(arguments);
        me.addEvents('sort');
        me.mixins.sortable.initSortable.call(me);
    },

    doSort: function(sorterFn) {
        this.sortBy(sorterFn);
    },

    /**
     * @private
     * Performs the actual sorting based on a direction and a sorting function. Internally,
     * this creates a temporary array of all items in the MixedCollection, sorts it and then writes
     * the sorted array data back into this.items and this.keys
     * @param {String} property Property to sort by ('key', 'value', or 'index')
     * @param {String} dir (optional) Direction to sort 'ASC' or 'DESC'. Defaults to 'ASC'.
     * @param {Function} fn (optional) Comparison function that defines the sort order.
     * Defaults to sorting by numeric value.
     */
    _sort : function(property, dir, fn){
        var me = this,
            i, len,
            dsc   = String(dir).toUpperCase() == 'DESC' ? -1 : 1,

            //this is a temporary array used to apply the sorting function
            c     = [],
            keys  = me.keys,
            items = me.items;

        //default to a simple sorter function if one is not provided
        fn = fn || function(a, b) {
            return a - b;
        };

        //copy all the items into a temporary array, which we will sort
        for(i = 0, len = items.length; i < len; i++){
            c[c.length] = {
                key  : keys[i],
                value: items[i],
                index: i
            };
        }

        //sort the temporary array
        Ext.Array.sort(c, function(a, b){
            var v = fn(a[property], b[property]) * dsc;
            if(v === 0){
                v = (a.index < b.index ? -1 : 1);
            }
            return v;
        });

        //copy the temporary array back into the main this.items and this.keys objects
        for(i = 0, len = c.length; i < len; i++){
            items[i] = c[i].value;
            keys[i]  = c[i].key;
        }

        me.fireEvent('sort', me);
    },

    /**
     * Sorts the collection by a single sorter function
     * @param {Function} sorterFn The function to sort by
     */
    sortBy: function(sorterFn) {
        var me     = this,
            items  = me.items,
            keys   = me.keys,
            length = items.length,
            temp   = [],
            i;

        //first we create a copy of the items array so that we can sort it
        for (i = 0; i < length; i++) {
            temp[i] = {
                key  : keys[i],
                value: items[i],
                index: i
            };
        }

        Ext.Array.sort(temp, function(a, b) {
            var v = sorterFn(a.value, b.value);
            if (v === 0) {
                v = (a.index < b.index ? -1 : 1);
            }

            return v;
        });

        //copy the temporary array back into the main this.items and this.keys objects
        for (i = 0; i < length; i++) {
            items[i] = temp[i].value;
            keys[i]  = temp[i].key;
        }

        me.fireEvent('sort', me, items, keys);
    },

    /**
     * Calculates the insertion index of the new item based upon the comparison function passed, or the current sort order.
     * @param {Object} newItem The new object to find the insertion position of.
     * @param {Function} [sorterFn] The function to sort by. This is the same as the sorting function
     * passed to {@link #sortBy}. It accepts 2 items from this MixedCollection, and returns -1 0, or 1
     * depending on the relative sort positions of the 2 compared items.
     *
     * If omitted, a function {@link #generateComparator generated} from the currently defined set of
     * {@link #sorters} will be used.
     *
     * @return {Number} The insertion point to add the new item into this MixedCollection at using {@link #insert}
     */
    findInsertionIndex: function(newItem, sorterFn) {
        var me    = this,
            items = me.items,
            start = 0,
            end   = items.length - 1,
            middle,
            comparison;

        if (!sorterFn) {
            sorterFn = me.generateComparator();
        }
        while (start <= end) {
            middle = (start + end) >> 1;
            comparison = sorterFn(newItem, items[middle]);
            if (comparison >= 0) {
                start = middle + 1;
            } else if (comparison < 0) {
                end = middle - 1;
            }
        }
        return start;
    },

    /**
     * Reorders each of the items based on a mapping from old index to new index. Internally this
     * just translates into a sort. The 'sort' event is fired whenever reordering has occured.
     * @param {Object} mapping Mapping from old item index to new item index
     */
    reorder: function(mapping) {
        var me = this,
            items = me.items,
            index = 0,
            length = items.length,
            order = [],
            remaining = [],
            oldIndex;

        me.suspendEvents();

        //object of {oldPosition: newPosition} reversed to {newPosition: oldPosition}
        for (oldIndex in mapping) {
            order[mapping[oldIndex]] = items[oldIndex];
        }

        for (index = 0; index < length; index++) {
            if (mapping[index] == undefined) {
                remaining.push(items[index]);
            }
        }

        for (index = 0; index < length; index++) {
            if (order[index] == undefined) {
                order[index] = remaining.shift();
            }
        }

        me.clear();
        me.addAll(order);

        me.resumeEvents();
        me.fireEvent('sort', me);
    },

    /**
     * Sorts this collection by <b>key</b>s.
     * @param {String} direction (optional) 'ASC' or 'DESC'. Defaults to 'ASC'.
     * @param {Function} fn (optional) Comparison function that defines the sort order.
     * Defaults to sorting by case insensitive string.
     */
    sortByKey : function(dir, fn){
        this._sort('key', dir, fn || function(a, b){
            var v1 = String(a).toUpperCase(), v2 = String(b).toUpperCase();
            return v1 > v2 ? 1 : (v1 < v2 ? -1 : 0);
        });
    }
});
 
/**
 * @author Ed Spencer
 * @class Ext.data.Errors
 *
 * <p>Wraps a collection of validation error responses and provides convenient functions for
 * accessing and errors for specific fields.</p>
 *
 * <p>Usually this class does not need to be instantiated directly - instances are instead created
 * automatically when {@link Ext.data.Model#validate validate} on a model instance:</p>
 *
<pre><code>
//validate some existing model instance - in this case it returned 2 failures messages
var errors = myModel.validate();

errors.isValid(); //false

errors.length; //2
errors.getByField('name');  // [{field: 'name',  message: 'must be present'}]
errors.getByField('title'); // [{field: 'title', message: 'is too short'}]
</code></pre>
 */
Ext.define('Ext.data.Errors', {
    extend: 'Ext.util.MixedCollection',

    /**
     * Returns true if there are no errors in the collection
     * @return {Boolean}
     */
    isValid: function() {
        return this.length === 0;
    },

    /**
     * Returns all of the errors for the given field
     * @param {String} fieldName The field to get errors for
     * @return {Object[]} All errors for the given field
     */
    getByField: function(fieldName) {
        var errors = [],
            error, field, i;

        for (i = 0; i < this.length; i++) {
            error = this.items[i];

            if (error.field == fieldName) {
                errors.push(error);
            }
        }

        return errors;
    }
});
 
/**
 * @author Ed Spencer
 *
 * Represents a single read or write operation performed by a {@link Ext.data.proxy.Proxy Proxy}. Operation objects are
 * used to enable communication between Stores and Proxies. Application developers should rarely need to interact with
 * Operation objects directly.
 *
 * Several Operations can be batched together in a {@link Ext.data.Batch batch}.
 */
Ext.define('Ext.data.Operation', {
    /**
     * @cfg {Boolean} synchronous
     * True if this Operation is to be executed synchronously. This property is inspected by a
     * {@link Ext.data.Batch Batch} to see if a series of Operations can be executed in parallel or not.
     */
    synchronous: true,

    /**
     * @cfg {String} action
     * The action being performed by this Operation. Should be one of 'create', 'read', 'update' or 'destroy'.
     */
    action: undefined,

    /**
     * @cfg {Ext.util.Filter[]} filters
     * Optional array of filter objects. Only applies to 'read' actions.
     */
    filters: undefined,

    /**
     * @cfg {Ext.util.Sorter[]} sorters
     * Optional array of sorter objects. Only applies to 'read' actions.
     */
    sorters: undefined,

    /**
     * @cfg {Ext.util.Grouper[]} groupers
     * Optional grouping configuration. Only applies to 'read' actions where grouping is desired.
     */
    groupers: undefined,

    /**
     * @cfg {Number} start
     * The start index (offset), used in paging when running a 'read' action.
     */
    start: undefined,

    /**
     * @cfg {Number} limit
     * The number of records to load. Used on 'read' actions when paging is being used.
     */
    limit: undefined,

    /**
     * @cfg {Ext.data.Batch} batch
     * The batch that this Operation is a part of.
     */
    batch: undefined,

    /**
     * @cfg {Function} callback
     * Function to execute when operation completed.
     * @cfg {Ext.data.Model[]} callback.records Array of records.
     * @cfg {Ext.data.Operation} callback.operation The Operation itself.
     * @cfg {Boolean} callback.success True when operation completed successfully.
     */
    callback: undefined,

    /**
     * @cfg {Object} scope
     * Scope for the {@link #callback} function.
     */
    scope: undefined,

    /**
     * @property {Boolean} started
     * The start status of this Operation. Use {@link #isStarted}.
     * @readonly
     * @private
     */
    started: false,

    /**
     * @property {Boolean} running
     * The run status of this Operation. Use {@link #isRunning}.
     * @readonly
     * @private
     */
    running: false,

    /**
     * @property {Boolean} complete
     * The completion status of this Operation. Use {@link #isComplete}.
     * @readonly
     * @private
     */
    complete: false,

    /**
     * @property {Boolean} success
     * Whether the Operation was successful or not. This starts as undefined and is set to true
     * or false by the Proxy that is executing the Operation. It is also set to false by {@link #setException}. Use
     * {@link #wasSuccessful} to query success status.
     * @readonly
     * @private
     */
    success: undefined,

    /**
     * @property {Boolean} exception
     * The exception status of this Operation. Use {@link #hasException} and see {@link #getError}.
     * @readonly
     * @private
     */
    exception: false,

    /**
     * @property {String/Object} error
     * The error object passed when {@link #setException} was called. This could be any object or primitive.
     * @private
     */
    error: undefined,

    /**
     * @property {RegExp} actionCommitRecordsRe
     * The RegExp used to categorize actions that require record commits.
     */
    actionCommitRecordsRe: /^(?:create|update)$/i,

    /**
     * @property {RegExp} actionSkipSyncRe
     * The RegExp used to categorize actions that skip local record synchronization. This defaults
     * to match 'destroy'.
     */
    actionSkipSyncRe: /^destroy$/i,

    /**
     * Creates new Operation object.
     * @param {Object} config (optional) Config object.
     */
    constructor: function(config) {
        Ext.apply(this, config || {});
    },

    /**
     * This method is called to commit data to this instance's records given the records in
     * the server response. This is followed by calling {@link Ext.data.Model#commit} on all
     * those records (for 'create' and 'update' actions).
     *
     * If this {@link #action} is 'destroy', any server records are ignored and the
     * {@link Ext.data.Model#commit} method is not called.
     *
     * @param {Ext.data.Model[]} serverRecords An array of {@link Ext.data.Model} objects returned by
     * the server.
     * @markdown
     */
    commitRecords: function (serverRecords) {
        var me = this,
            mc, index, clientRecords, serverRec, clientRec;

        if (!me.actionSkipSyncRe.test(me.action)) {
            clientRecords = me.records;

            if (clientRecords && clientRecords.length) {
                if (clientRecords.length > 1) {
                    // if this operation has multiple records, client records need to be matched up with server records
                    // so that any data returned from the server can be updated in the client records.
                    mc = new Ext.util.MixedCollection();
                    mc.addAll(serverRecords);

                    for (index = clientRecords.length; index--; ) {
                        clientRec = clientRecords[index];
                        serverRec = mc.findBy(me.matchClientRec, clientRec);

                        // Replace client record data with server record data
                        clientRec.copyFrom(serverRec);
                    }
                } else {
                    // operation only has one record, so just match the first client record up with the first server record
                    clientRec = clientRecords[0];
                    serverRec = serverRecords[0];
                    // if the client record is not a phantom, make sure the ids match before replacing the client data with server data.
                    if(serverRec && (clientRec.phantom || clientRec.getId() === serverRec.getId())) {
                        clientRec.copyFrom(serverRec);
                    }
                }

                if (me.actionCommitRecordsRe.test(me.action)) {
                    for (index = clientRecords.length; index--; ) {
                        clientRecords[index].commit();
                    }
                }
            }
        }
    },

    // Private.
    // Record matching function used by commitRecords
    // IMPORTANT: This is called in the scope of the clientRec being matched
    matchClientRec: function(record) {
        var clientRec = this,
            clientRecordId = clientRec.getId();

        if(clientRecordId && record.getId() === clientRecordId) {
            return true;
        }
        // if the server record cannot be found by id, find by internalId.
        // this allows client records that did not previously exist on the server
        // to be updated with the correct server id and data.
        return record.internalId === clientRec.internalId;
    },

    /**
     * Marks the Operation as started.
     */
    setStarted: function() {
        this.started = true;
        this.running = true;
    },

    /**
     * Marks the Operation as completed.
     */
    setCompleted: function() {
        this.complete = true;
        this.running  = false;
    },

    /**
     * Marks the Operation as successful.
     */
    setSuccessful: function() {
        this.success = true;
    },

    /**
     * Marks the Operation as having experienced an exception. Can be supplied with an option error message/object.
     * @param {String/Object} error (optional) error string/object
     */
    setException: function(error) {
        this.exception = true;
        this.success = false;
        this.running = false;
        this.error = error;
    },

    /**
     * Returns true if this Operation encountered an exception (see also {@link #getError})
     * @return {Boolean} True if there was an exception
     */
    hasException: function() {
        return this.exception === true;
    },

    /**
     * Returns the error string or object that was set using {@link #setException}
     * @return {String/Object} The error object
     */
    getError: function() {
        return this.error;
    },

    /**
     * Returns the {@link Ext.data.Model record}s associated with this operation.  For read operations the records as set by the {@link Ext.data.proxy.Proxy Proxy} will be returned (returns `null` if the proxy has not yet set the records).
     * For create, update, and destroy operations the operation's initially configured records will be returned, although the proxy may modify these records' data at some point after the operation is initialized.
     * @return {Ext.data.Model[]}
     */
    getRecords: function() {
        var resultSet = this.getResultSet();
        return this.records || (resultSet ? resultSet.records : null);
    },

    /**
     * Returns the ResultSet object (if set by the Proxy). This object will contain the {@link Ext.data.Model model}
     * instances as well as meta data such as number of instances fetched, number available etc
     * @return {Ext.data.ResultSet} The ResultSet object
     */
    getResultSet: function() {
        return this.resultSet;
    },

    /**
     * Returns true if the Operation has been started. Note that the Operation may have started AND completed, see
     * {@link #isRunning} to test if the Operation is currently running.
     * @return {Boolean} True if the Operation has started
     */
    isStarted: function() {
        return this.started === true;
    },

    /**
     * Returns true if the Operation has been started but has not yet completed.
     * @return {Boolean} True if the Operation is currently running
     */
    isRunning: function() {
        return this.running === true;
    },

    /**
     * Returns true if the Operation has been completed
     * @return {Boolean} True if the Operation is complete
     */
    isComplete: function() {
        return this.complete === true;
    },

    /**
     * Returns true if the Operation has completed and was successful
     * @return {Boolean} True if successful
     */
    wasSuccessful: function() {
        return this.isComplete() && this.success === true;
    },

    /**
     * @private
     * Associates this Operation with a Batch
     * @param {Ext.data.Batch} batch The batch
     */
    setBatch: function(batch) {
        this.batch = batch;
    },

    /**
     * Checks whether this operation should cause writing to occur.
     * @return {Boolean} Whether the operation should cause a write to occur.
     */
    allowWrite: function() {
        return this.action != 'read';
    }
});
 
/**
 * @author Ed Spencer
 *
 * This singleton contains a set of validation functions that can be used to validate any type of data. They are most
 * often used in {@link Ext.data.Model Models}, where they are automatically set up and executed.
 */
Ext.define('Ext.data.validations', {
    singleton: true,
    
    /**
     * @property {String} presenceMessage
     * The default error message used when a presence validation fails.
     */
    presenceMessage: 'must be present',
    
    /**
     * @property {String} lengthMessage
     * The default error message used when a length validation fails.
     */
    lengthMessage: 'is the wrong length',
    
    /**
     * @property {Boolean} formatMessage
     * The default error message used when a format validation fails.
     */
    formatMessage: 'is the wrong format',
    
    /**
     * @property {String} inclusionMessage
     * The default error message used when an inclusion validation fails.
     */
    inclusionMessage: 'is not included in the list of acceptable values',
    
    /**
     * @property {String} exclusionMessage
     * The default error message used when an exclusion validation fails.
     */
    exclusionMessage: 'is not an acceptable value',
    
    /**
     * @property {String} emailMessage
     * The default error message used when an email validation fails
     */
    emailMessage: 'is not a valid email address',
    
    /**
     * @property {RegExp} emailRe
     * The regular expression used to validate email addresses
     */
    emailRe: /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/,
    
    /**
     * Validates that the given value is present.
     * For example:
     *
     *     validations: [{type: 'presence', field: 'age'}]
     *
     * @param {Object} config Config object
     * @param {Object} value The value to validate
     * @return {Boolean} True if validation passed
     */
    presence: function(config, value) {
        // No configs read, so allow just value to be passed
        if (arguments.length === 1) {
            value = config;
        }
        
        //we need an additional check for zero here because zero is an acceptable form of present data
        return !!value || value === 0;
    },
    
    /**
     * Returns true if the given value is between the configured min and max values.
     * For example:
     *
     *     validations: [{type: 'length', field: 'name', min: 2}]
     *
     * @param {Object} config Config object
     * @param {String} value The value to validate
     * @return {Boolean} True if the value passes validation
     */
    length: function(config, value) {
        if (value === undefined || value === null) {
            return false;
        }
        
        var length = value.length,
            min    = config.min,
            max    = config.max;
        
        if ((min && length < min) || (max && length > max)) {
            return false;
        } else {
            return true;
        }
    },
    
    /**
     * Validates that an email string is in the correct format
     * @param {Object} config Config object
     * @param {String} email The email address
     * @return {Boolean} True if the value passes validation
     */
    email: function(config, email) {
        return Ext.data.validations.emailRe.test(email);
    },
    
    /**
     * Returns true if the given value passes validation against the configured `matcher` regex.
     * For example:
     *
     *     validations: [{type: 'format', field: 'username', matcher: /([a-z]+)[0-9]{2,3}/}]
     *
     * @param {Object} config Config object
     * @param {String} value The value to validate
     * @return {Boolean} True if the value passes the format validation
     */
    format: function(config, value) {
        return !!(config.matcher && config.matcher.test(value));
    },
    
    /**
     * Validates that the given value is present in the configured `list`.
     * For example:
     *
     *     validations: [{type: 'inclusion', field: 'gender', list: ['Male', 'Female']}]
     *
     * @param {Object} config Config object
     * @param {String} value The value to validate
     * @return {Boolean} True if the value is present in the list
     */
    inclusion: function(config, value) {
        return config.list && Ext.Array.indexOf(config.list,value) != -1;
    },
    
    /**
     * Validates that the given value is present in the configured `list`.
     * For example:
     *
     *     validations: [{type: 'exclusion', field: 'username', list: ['Admin', 'Operator']}]
     *
     * @param {Object} config Config object
     * @param {String} value The value to validate
     * @return {Boolean} True if the value is not present in the list
     */
    exclusion: function(config, value) {
        return config.list && Ext.Array.indexOf(config.list,value) == -1;
    }
}); 
/**
 * @author Ed Spencer
 *
 * A Model represents some object that your application manages. For example, one might define a Model for Users,
 * Products, Cars, or any other real-world object that we want to model in the system. Models are registered via the
 * {@link Ext.ModelManager model manager}, and are used by {@link Ext.data.Store stores}, which are in turn used by many
 * of the data-bound components in Ext.
 *
 * Models are defined as a set of fields and any arbitrary methods and properties relevant to the model. For example:
 *
 *     Ext.define('User', {
 *         extend: 'Ext.data.Model',
 *         fields: [
 *             {name: 'name',  type: 'string'},
 *             {name: 'age',   type: 'int', convert: null},
 *             {name: 'phone', type: 'string'},
 *             {name: 'alive', type: 'boolean', defaultValue: true, convert: null}
 *         ],
 *
 *         changeName: function() {
 *             var oldName = this.get('name'),
 *                 newName = oldName + " The Barbarian";
 *
 *             this.set('name', newName);
 *         }
 *     });
 *
 * The fields array is turned into a {@link Ext.util.MixedCollection MixedCollection} automatically by the {@link
 * Ext.ModelManager ModelManager}, and all other functions and properties are copied to the new Model's prototype.
 * 
 * By default, the built in numeric and boolean field types have a (@link Ext.data.Field#convert} function which coerces string
 * values in raw data into the field's type. For better performance with {@link Ext.data.reader.Json Json} or {@link Ext.data.reader.Array Array}
 * readers *if you are in control of the data fed into this Model*, you can null out the default convert function which will cause
 * the raw property to be copied directly into the Field's value.
 *
 * Now we can create instances of our User model and call any model logic we defined:
 *
 *     var user = Ext.create('User', {
 *         name : 'Conan',
 *         age  : 24,
 *         phone: '555-555-5555'
 *     });
 *
 *     user.changeName();
 *     user.get('name'); //returns "Conan The Barbarian"
 *
 * # Validations
 *
 * Models have built-in support for validations, which are executed against the validator functions in {@link
 * Ext.data.validations} ({@link Ext.data.validations see all validation functions}). Validations are easy to add to
 * models:
 *
 *     Ext.define('User', {
 *         extend: 'Ext.data.Model',
 *         fields: [
 *             {name: 'name',     type: 'string'},
 *             {name: 'age',      type: 'int'},
 *             {name: 'phone',    type: 'string'},
 *             {name: 'gender',   type: 'string'},
 *             {name: 'username', type: 'string'},
 *             {name: 'alive',    type: 'boolean', defaultValue: true}
 *         ],
 *
 *         validations: [
 *             {type: 'presence',  field: 'age'},
 *             {type: 'length',    field: 'name',     min: 2},
 *             {type: 'inclusion', field: 'gender',   list: ['Male', 'Female']},
 *             {type: 'exclusion', field: 'username', list: ['Admin', 'Operator']},
 *             {type: 'format',    field: 'username', matcher: /([a-z]+)[0-9]{2,3}/}
 *         ]
 *     });
 *
 * The validations can be run by simply calling the {@link #validate} function, which returns a {@link Ext.data.Errors}
 * object:
 *
 *     var instance = Ext.create('User', {
 *         name: 'Ed',
 *         gender: 'Male',
 *         username: 'edspencer'
 *     });
 *
 *     var errors = instance.validate();
 *
 * # Associations
 *
 * Models can have associations with other Models via {@link Ext.data.association.HasOne},
 * {@link Ext.data.association.BelongsTo belongsTo} and {@link Ext.data.association.HasMany hasMany} associations.
 * For example, let's say we're writing a blog administration application which deals with Users, Posts and Comments.
 * We can express the relationships between these models like this:
 *
 *     Ext.define('Post', {
 *         extend: 'Ext.data.Model',
 *         fields: ['id', 'user_id'],
 *
 *         belongsTo: 'User',
 *         hasMany  : {model: 'Comment', name: 'comments'}
 *     });
 *
 *     Ext.define('Comment', {
 *         extend: 'Ext.data.Model',
 *         fields: ['id', 'user_id', 'post_id'],
 *
 *         belongsTo: 'Post'
 *     });
 *
 *     Ext.define('User', {
 *         extend: 'Ext.data.Model',
 *         fields: ['id'],
 *
 *         hasMany: [
 *             'Post',
 *             {model: 'Comment', name: 'comments'}
 *         ]
 *     });
 *
 * See the docs for {@link Ext.data.association.HasOne}, {@link Ext.data.association.BelongsTo} and
 * {@link Ext.data.association.HasMany} for details on the usage and configuration of associations.
 * Note that associations can also be specified like this:
 *
 *     Ext.define('User', {
 *         extend: 'Ext.data.Model',
 *         fields: ['id'],
 *
 *         associations: [
 *             {type: 'hasMany', model: 'Post',    name: 'posts'},
 *             {type: 'hasMany', model: 'Comment', name: 'comments'}
 *         ]
 *     });
 *
 * # Using a Proxy
 *
 * Models are great for representing types of data and relationships, but sooner or later we're going to want to load or
 * save that data somewhere. All loading and saving of data is handled via a {@link Ext.data.proxy.Proxy Proxy}, which
 * can be set directly on the Model:
 *
 *     Ext.define('User', {
 *         extend: 'Ext.data.Model',
 *         fields: ['id', 'name', 'email'],
 *
 *         proxy: {
 *             type: 'rest',
 *             url : '/users'
 *         }
 *     });
 *
 * Here we've set up a {@link Ext.data.proxy.Rest Rest Proxy}, which knows how to load and save data to and from a
 * RESTful backend. Let's see how this works:
 *
 *     var user = Ext.create('User', {name: 'Ed Spencer', email: 'ed@sencha.com'});
 *
 *     user.save(); //POST /users
 *
 * Calling {@link #save} on the new Model instance tells the configured RestProxy that we wish to persist this Model's
 * data onto our server. RestProxy figures out that this Model hasn't been saved before because it doesn't have an id,
 * and performs the appropriate action - in this case issuing a POST request to the url we configured (/users). We
 * configure any Proxy on any Model and always follow this API - see {@link Ext.data.proxy.Proxy} for a full list.
 *
 * Loading data via the Proxy is equally easy:
 *
 *     //get a reference to the User model class
 *     var User = Ext.ModelManager.getModel('User');
 *
 *     //Uses the configured RestProxy to make a GET request to /users/123
 *     User.load(123, {
 *         success: function(user) {
 *             console.log(user.getId()); //logs 123
 *         }
 *     });
 *
 * Models can also be updated and destroyed easily:
 *
 *     //the user Model we loaded in the last snippet:
 *     user.set('name', 'Edward Spencer');
 *
 *     //tells the Proxy to save the Model. In this case it will perform a PUT request to /users/123 as this Model already has an id
 *     user.save({
 *         success: function() {
 *             console.log('The User was updated');
 *         }
 *     });
 *
 *     //tells the Proxy to destroy the Model. Performs a DELETE request to /users/123
 *     user.destroy({
 *         success: function() {
 *             console.log('The User was destroyed!');
 *         }
 *     });
 *
 * # Usage in Stores
 *
 * It is very common to want to load a set of Model instances to be displayed and manipulated in the UI. We do this by
 * creating a {@link Ext.data.Store Store}:
 *
 *     var store = Ext.create('Ext.data.Store', {
 *         model: 'User'
 *     });
 *
 *     //uses the Proxy we set up on Model to load the Store data
 *     store.load();
 *
 * A Store is just a collection of Model instances - usually loaded from a server somewhere. Store can also maintain a
 * set of added, updated and removed Model instances to be synchronized with the server via the Proxy. See the {@link
 * Ext.data.Store Store docs} for more information on Stores.
 *
 * @constructor
 * Creates new Model instance.
 * @param {Object} data An object containing keys corresponding to this model's fields, and their associated values
 */

Ext.define('Ext.data.Model', {
    alternateClassName: 'Ext.data.Record',

    mixins: {
        observable: 'Ext.util.Observable'
    },
    
    requires: [
        'Ext.ModelManager',
        'Ext.data.IdGenerator',
        'Ext.data.Field',
        'Ext.data.Errors',
        'Ext.data.Operation',
        'Ext.data.validations',
        'Ext.util.MixedCollection'
    ],

    compareConvertFields: function(f1, f2) {
        var f1SpecialConvert = f1.convert && f1.type && f1.convert !== f1.type.convert,
            f2SpecialConvert = f2.convert && f2.type && f2.convert !== f2.type.convert;

        if (f1SpecialConvert && !f2SpecialConvert) {
            return 1;
        }

        if (!f1SpecialConvert && f2SpecialConvert) {
            return -1;
        }
        return 0;
    },

    itemNameFn: function(item) {
        return item.name;
    },

    onClassExtended: function(cls, data, hooks) {
        var onBeforeClassCreated = hooks.onBeforeCreated;

        hooks.onBeforeCreated = function(cls, data) {
            var me = this,
                name = Ext.getClassName(cls),
                prototype = cls.prototype,
                superCls = cls.prototype.superclass,

                validations = data.validations || [],
                fields = data.fields || [],
                associations = data.associations || [],
                addAssociations = function(items, type) {
                    var i = 0,
                        len,
                        item;

                    if (items) {
                        items = Ext.Array.from(items);

                        for (len = items.length; i < len; ++i) {
                            item = items[i];

                            if (!Ext.isObject(item)) {
                                item = {model: item};
                            }

                            item.type = type;
                            associations.push(item);
                        }
                    }
                },
                idgen = data.idgen,

                fieldsMixedCollection = new Ext.util.MixedCollection(false, prototype.itemNameFn),

                associationsMixedCollection = new Ext.util.MixedCollection(false, prototype.itemNameFn),

                superValidations = superCls.validations,
                superFields = superCls.fields,
                superAssociations = superCls.associations,

                association, i, ln,
                dependencies = [],
                idProperty = data.idProperty || cls.prototype.idProperty,

                // Process each Field upon add into the collection
                onFieldAddReplace = function(arg0, arg1, arg2) {
                    var newField,
                        pos;

                    if (fieldsMixedCollection.events.add.firing) {
                        // Add event signature is (position, value, key);
                        pos = arg0;
                        newField  = arg1;
                    } else {
                        // Replace event signature is (key, oldValue, newValue);
                        newField = arg2;
                        pos = arg1.originalIndex;
                    }

                    // Set the originalIndex for ArrayReader to get the default mapping from in case
                    // compareConvertFields changes the order due to some fields having custom convert functions.
                    newField.originalIndex = pos;

                    // The field(s) which encapsulates the idProperty must never have a default value set
                    // if no value arrives from the server side. So override any possible prototype-provided
                    // defaultValue with undefined which will inhibit generation of defaulting code in Reader.buildRecordDataExtractor
                    if (newField.mapping === idProperty || (newField.mapping == null && newField.name === idProperty)) {
                        newField.defaultValue = undefined;
                    }
                },

                // Use the proxy from the class definition object if present, otherwise fall back to the inherited one, or the default    
                clsProxy = data.proxy || cls.prototype.proxy || cls.prototype.defaultProxyType,

                // Sort upon add function to be used in case of dynamically added Fields
                fieldConvertSortFn = function() {
                    fieldsMixedCollection.sortBy(prototype.compareConvertFields);
                };

            // Save modelName on class and its prototype
            cls.modelName = name;
            prototype.modelName = name;

            // Merge the validations of the superclass and the new subclass
            if (superValidations) {
                validations = superValidations.concat(validations);
            }

            data.validations = validations;

            // Merge the fields of the superclass and the new subclass
            if (superFields) {
                fields = superFields.items.concat(fields);
            }

            fieldsMixedCollection.on({
                add:     onFieldAddReplace,
                replace: onFieldAddReplace
            });  

            for (i = 0, ln = fields.length; i < ln; ++i) {
                fieldsMixedCollection.add(new Ext.data.Field(fields[i]));
            }
            if (!fieldsMixedCollection.get(idProperty)) {
                fieldsMixedCollection.add(new Ext.data.Field(idProperty));
            }

            // Ensure the Fields are on correct order: Fields with custom convert function last
            fieldConvertSortFn();
            fieldsMixedCollection.on({
                add:     fieldConvertSortFn,
                replace: fieldConvertSortFn
            });

            data.fields = fieldsMixedCollection;

            if (idgen) {
                data.idgen = Ext.data.IdGenerator.get(idgen);
            }

            //associations can be specified in the more convenient format (e.g. not inside an 'associations' array).
            //we support that here
            addAssociations(data.belongsTo, 'belongsTo');
            delete data.belongsTo;
            addAssociations(data.hasMany, 'hasMany');
            delete data.hasMany;
            addAssociations(data.hasOne, 'hasOne');
            delete data.hasOne;

            if (superAssociations) {
                associations = superAssociations.items.concat(associations);
            }

            for (i = 0, ln = associations.length; i < ln; ++i) {
                dependencies.push('association.' + associations[i].type.toLowerCase());
            }

            // If we have not been supplied with a Proxy *instance*, then add the proxy type to our dependency list
            if (clsProxy && !clsProxy.isProxy) {
                dependencies.push('proxy.' + (typeof clsProxy === 'string' ? clsProxy : clsProxy.type));
            }

            Ext.require(dependencies, function() {
                Ext.ModelManager.registerType(name, cls);

                for (i = 0, ln = associations.length; i < ln; ++i) {
                    association = associations[i];

                    Ext.apply(association, {
                        ownerModel: name,
                        associatedModel: association.model
                    });

                    if (Ext.ModelManager.getModel(association.model) === undefined) {
                        Ext.ModelManager.registerDeferredAssociation(association);
                    } else {
                        associationsMixedCollection.add(Ext.data.association.Association.create(association));
                    }
                }

                data.associations = associationsMixedCollection;

                // onBeforeCreated may get called *asynchronously* if any of those required classes caused
                // an asynchronous script load. This would mean that the class definition object
                // has not been applied to the prototype when the Model definition has returned.
                // The Reader constructor does not attempt to buildExtractors if the fields MixedCollection
                // has not yet been set. The cls.setProxy call triggers a build of extractor methods.
                onBeforeClassCreated.call(me, cls, data, hooks);

                cls.setProxy(clsProxy);

                // Fire the onModelDefined template method on ModelManager
                Ext.ModelManager.onModelDefined(cls);
            });
        };
    },

    inheritableStatics: {
        /**
         * Sets the Proxy to use for this model. Accepts any options that can be accepted by
         * {@link Ext#createByAlias Ext.createByAlias}.
         * @param {String/Object/Ext.data.proxy.Proxy} proxy The proxy
         * @return {Ext.data.proxy.Proxy}
         * @static
         * @inheritable
         */
        setProxy: function(proxy) {
            //make sure we have an Ext.data.proxy.Proxy object
            if (!proxy.isProxy) {
                if (typeof proxy == "string") {
                    proxy = {
                        type: proxy
                    };
                }
                proxy = Ext.createByAlias("proxy." + proxy.type, proxy);
            }
            proxy.setModel(this);
            this.proxy = this.prototype.proxy = proxy;

            return proxy;
        },

        /**
         * Returns the configured Proxy for this Model
         * @return {Ext.data.proxy.Proxy} The proxy
         * @static
         * @inheritable
         */
        getProxy: function() {
            return this.proxy;
        },

        /**
         * Apply a new set of field and/or property definitions to the existing model. This will replace any existing
         * fields, including fields inherited from superclasses. Mainly for reconfiguring the
         * model based on changes in meta data (called from Reader's onMetaChange method).
         * @static
         * @inheritable
         */
        setFields: function(fields, idProperty, clientIdProperty) {
            var me = this,
                proto = me.prototype,
                prototypeFields = proto.fields,
                len = fields ? fields.length : 0,
                i = 0;


            if (idProperty) {
                proto.idProperty = idProperty;
            }
            if (clientIdProperty) {
                proto.clientIdProperty = clientIdProperty;
            }

            if (prototypeFields) {
                prototypeFields.clear();
            }
            else {
                prototypeFields = me.prototype.fields = new Ext.util.MixedCollection(false, function(field) {
                    return field.name;
                });
            }

            for (; i < len; i++) {
                prototypeFields.add(new Ext.data.Field(fields[i]));
            }
            if (!prototypeFields.get(proto.idProperty)) {
                prototypeFields.add(new Ext.data.Field(proto.idProperty));
            }

            me.fields = prototypeFields;

            return prototypeFields;
        },

        /**
         * Returns an Array of {@link Ext.data.Field Field} definitions which define this Model's structure
         *
         * Fields are sorted upon Model class definition. Fields with custom {@link Ext.data.Field#convert convert} functions
         * are moved to *after* fields with no convert functions. This is so that convert functions which rely on existing
         * field values will be able to read those field values.
         *
         * @return {Ext.data.Field[]} The defined Fields for this Model.
         *
         */
        getFields: function() {
            return this.prototype.fields.items;
        },

        /**
         * Asynchronously loads a model instance by id. Sample usage:
         *
         *     Ext.define('MyApp.User', {
         *         extend: 'Ext.data.Model',
         *         fields: [
         *             {name: 'id', type: 'int'},
         *             {name: 'name', type: 'string'}
         *         ]
         *     });
         *
         *     MyApp.User.load(10, {
         *         scope: this,
         *         failure: function(record, operation) {
         *             //do something if the load failed
         *         },
         *         success: function(record, operation) {
         *             //do something if the load succeeded
         *         },
         *         callback: function(record, operation) {
         *             //do something whether the load succeeded or failed
         *         }
         *     });
         *
         * @param {Number/String} id The id of the model to load
         * @param {Object} config (optional) config object containing success, failure and callback functions, plus
         * optional scope
         * @static
         * @inheritable
         */
        load: function(id, config) {
            config = Ext.apply({}, config);
            config = Ext.applyIf(config, {
                action: 'read',
                id    : id
            });

            var operation  = new Ext.data.Operation(config),
                scope      = config.scope || this,
                record     = null,
                callback;

            callback = function(operation) {
                if (operation.wasSuccessful()) {
                    record = operation.getRecords()[0];
                    Ext.callback(config.success, scope, [record, operation]);
                } else {
                    Ext.callback(config.failure, scope, [record, operation]);
                }
                Ext.callback(config.callback, scope, [record, operation]);
            };

            this.proxy.read(operation, callback, this);
        }
    },

    statics: {
        PREFIX : 'ext-record',
        AUTO_ID: 1,
        EDIT   : 'edit',
        REJECT : 'reject',
        COMMIT : 'commit',

        /**
         * Generates a sequential id. This method is typically called when a record is {@link Ext#create
         * create}d and {@link #constructor no id has been specified}. The id will automatically be assigned to the
         * record. The returned id takes the form: {PREFIX}-{AUTO_ID}.
         *
         * - **PREFIX** : String - Ext.data.Model.PREFIX (defaults to 'ext-record')
         * - **AUTO_ID** : String - Ext.data.Model.AUTO_ID (defaults to 1 initially)
         *
         * @param {Ext.data.Model} rec The record being created. The record does not exist, it's a {@link #phantom}.
         * @return {String} auto-generated string id, `"ext-record-i++"`;
         * @static
         */
        id: function(rec) {
            var id = [this.PREFIX, '-', this.AUTO_ID++].join('');
            rec.phantom = true;
            rec.internalId = id;
            return id;
        }
    },

    /**
     * @cfg {String/Object} idgen
     * The id generator to use for this model. The default id generator does not generate
     * values for the {@link #idProperty}.
     *
     * This can be overridden at the model level to provide a custom generator for a model.
     * The simplest form of this would be:
     *
     *      Ext.define('MyApp.data.MyModel', {
     *          extend: 'Ext.data.Model',
     *          requires: ['Ext.data.SequentialIdGenerator'],
     *          idgen: 'sequential',
     *          ...
     *      });
     *
     * The above would generate {@link Ext.data.SequentialIdGenerator sequential} id's such
     * as 1, 2, 3 etc..
     *
     * Another useful id generator is {@link Ext.data.UuidGenerator}:
     *
     *      Ext.define('MyApp.data.MyModel', {
     *          extend: 'Ext.data.Model',
     *          requires: ['Ext.data.UuidGenerator'],
     *          idgen: 'uuid',
     *          ...
     *      });
     *
     * An id generation can also be further configured:
     *
     *      Ext.define('MyApp.data.MyModel', {
     *          extend: 'Ext.data.Model',
     *          idgen: {
     *              type: 'sequential',
     *              seed: 1000,
     *              prefix: 'ID_'
     *          }
     *      });
     *
     * The above would generate id's such as ID_1000, ID_1001, ID_1002 etc..
     *
     * If multiple models share an id space, a single generator can be shared:
     *
     *      Ext.define('MyApp.data.MyModelX', {
     *          extend: 'Ext.data.Model',
     *          idgen: {
     *              type: 'sequential',
     *              id: 'xy'
     *          }
     *      });
     *
     *      Ext.define('MyApp.data.MyModelY', {
     *          extend: 'Ext.data.Model',
     *          idgen: {
     *              type: 'sequential',
     *              id: 'xy'
     *          }
     *      });
     *
     * For more complex, shared id generators, a custom generator is the best approach.
     * See {@link Ext.data.IdGenerator} for details on creating custom id generators.
     *
     * @markdown
     */
    idgen: {
        isGenerator: true,
        type: 'default',

        generate: function () {
            return null;
        },
        getRecId: function (rec) {
            return rec.modelName + '-' + rec.internalId;
        }
    },

    /**
     * @property {Boolean} editing
     * Internal flag used to track whether or not the model instance is currently being edited.
     * @readonly
     */
    editing : false,

    /**
     * @property {Boolean} dirty
     * True if this Record has been modified.
     * @readonly
     */
    dirty : false,

    /**
     * @cfg {String} persistenceProperty
     * The name of the property on this Persistable object that its data is saved to. Defaults to 'data'
     * (i.e: all persistable data resides in `this.data`.)
     */
    persistenceProperty: 'data',

    evented: false,

    /**
     * @property {Boolean} isModel
     * `true` in this class to identify an object as an instantiated Model, or subclass thereof.
     */
    isModel: true,

    /**
     * @property {Boolean} phantom
     * True when the record does not yet exist in a server-side database (see {@link #setDirty}).
     * Any record which has a real database pk set as its id property is NOT a phantom -- it's real.
     */
    phantom : false,

    /**
     * @cfg {String} idProperty
     * The name of the field treated as this Model's unique id. Defaults to 'id'.
     */
    idProperty: 'id',

    /**
     * @cfg {String} [clientIdProperty]
     * The name of a property that is used for submitting this Model's unique client-side identifier
     * to the server when multiple phantom records are saved as part of the same {@link Ext.data.Operation Operation}.
     * In such a case, the server response should include the client id for each record
     * so that the server response data can be used to update the client-side records if necessary.
     * This property cannot have the same name as any of this Model's fields.
     */
    clientIdProperty: null,

    /**
     * @cfg {String} defaultProxyType
     * The string type of the default Model Proxy. Defaults to 'ajax'.
     */
    defaultProxyType: 'ajax',

    // Fields config and property
    /**
     * @cfg {Object[]/String[]} fields
     * The fields for this model. This is an Array of **{@link Ext.data.Field Field}** definition objects. A Field
     * definition may simply be the *name* of the Field, but a Field encapsulates {@link Ext.data.Field#type data type},
     * {@link Ext.data.Field#convert custom conversion} of raw data, and a {@link Ext.data.Field#mapping mapping}
     * property to specify by name of index, how to extract a field's value from a raw data object, so it is best practice
     * to specify a full set of {@link Ext.data.Field Field} config objects.
     */
    /**
     * @property {Ext.util.MixedCollection} fields
     * A {@link Ext.util.MixedCollection Collection} of the fields defined for this Model (including fields defined in superclasses)
     *
     * This is a collection of {@link Ext.data.Field} instances, each of which encapsulates information that the field was configured with.
     * By default, you can specify a field as simply a String, representing the *name* of the field, but a Field encapsulates
     * {@link Ext.data.Field#type data type}, {@link Ext.data.Field#convert custom conversion} of raw data, and a {@link Ext.data.Field#mapping mapping}
     * property to specify by name of index, how to extract a field's value from a raw data object.
     */

    /**
     * @cfg {Object[]} validations
     * An array of {@link Ext.data.validations validations} for this model.
     */

    // Associations configs and properties
    /**
     * @cfg {Object[]} associations
     * An array of {@link Ext.data.Association associations} for this model.
     */
    /**
     * @cfg {String/Object/String[]/Object[]} hasMany
     * One or more {@link Ext.data.HasManyAssociation HasMany associations} for this model.
     */
    /**
     * @cfg {String/Object/String[]/Object[]} belongsTo
     * One or more {@link Ext.data.BelongsToAssociation BelongsTo associations} for this model.
     */
    /**
     * @cfg {String/Object/Ext.data.proxy.Proxy} proxy
     * The {@link Ext.data.proxy.Proxy proxy} to use for this model.
     */

    /**
     * @event idchanged
     * Fired when this model's id changes
     * @param {Ext.data.Model} this
     * @param {Number/String} oldId The old id
     * @param {Number/String} newId The new id
     */

    // id, raw and convertedData not documented intentionally, meant to be used internally.
    constructor: function(data, id, raw, convertedData) {
        data = data || {};

        var me = this,
            fields,
            length,
            field,
            name,
            value,
            newId,
            persistenceProperty,
            i;


        /**
         * @property {Number/String} internalId
         * An internal unique ID for each Model instance, used to identify Models that don't have an ID yet
         * @private
         */
        me.internalId = (id || id === 0) ? id : Ext.data.Model.id(me);

        /**
         * @property {Object} raw The raw data used to create this model if created via a reader.
         */
        me.raw = raw;

        if (!me.data) {
            me.data = {};
        }

        /**
         * @property {Object} modified Key: value pairs of all fields whose values have changed
         */
        me.modified = {};

        // Deal with spelling error in previous releases
        if (me.persistanceProperty) {
            //<debug>
            if (Ext.isDefined(Ext.global.console)) {
                Ext.global.console.warn('Ext.data.Model: persistanceProperty has been deprecated. Use persistenceProperty instead.');
            }
            //</debug>
            me.persistenceProperty = me.persistanceProperty;
        }

        me[me.persistenceProperty] = convertedData || {};

        me.mixins.observable.constructor.call(me);

        if (!convertedData) {
            //add default field values if present
            fields = me.fields.items;
            length = fields.length;
            i = 0;
            persistenceProperty = me[me.persistenceProperty];

            if (Ext.isArray(data)) {
                for (; i < length; i++) {
                    field = fields[i];
                    name  = field.name;
                    value = data[i];

                    if (value === undefined) {
                        value = field.defaultValue;
                    }
                    // Have to map array data so the values get assigned to the named fields
                    // rather than getting set as the field names with undefined values.
                    if (field.convert) {
                        value = field.convert(value, me);
                    }
                    // On instance construction, do not create data properties based on undefined input properties
                    if (value !== undefined) {
                        persistenceProperty[name] = value;
                    }
                }

            } else {
               for (; i < length; i++) {
                    field = fields[i];
                    name  = field.name;
                    value = data[name];
                    if (value === undefined) {
                        value = field.defaultValue;
                    }
                    if (field.convert) {
                        value = field.convert(value, me);
                    }
                    // On instance construction, do not create data properties based on undefined input properties
                    if (value !== undefined) {
                        persistenceProperty[name] = value;
                    }
               }
            }
        }

        /**
         * @property {Ext.data.Store[]} stores
         * The {@link Ext.data.Store Stores} to which this instance is bound.
         */
        me.stores = [];

        if (me.getId()) {
            me.phantom = false;
        } else if (me.phantom) {
            newId = me.idgen.generate();
            if (newId !== null) {
                me.setId(newId);
            }
        }

        // clear any dirty/modified since we're initializing
        me.dirty = false;
        me.modified = {};

        if (typeof me.init == 'function') {
            me.init();
        }

        me.id = me.idgen.getRecId(me);
    },

    /**
     * Returns the value of the given field
     * @param {String} fieldName The field to fetch the value for
     * @return {Object} The value
     */
    get: function(field) {
        return this[this.persistenceProperty][field];
    },

    // This object is used whenever the set() method is called and given a string as the
    // first argument. This approach saves memory (and GC costs) since we could be called
    // a lot.
    _singleProp: {},

    /**
     * Sets the given field to the given value, marks the instance as dirty
     * @param {String/Object} fieldName The field to set, or an object containing key/value pairs
     * @param {Object} newValue The value to set
     * @return {String[]} The array of modified field names or null if nothing was modified.
     */
    set: function (fieldName, newValue) {
        var me = this,
            data = me[me.persistenceProperty],
            fields = me.fields,
            modified = me.modified,
            single = (typeof fieldName == 'string'),
            currentValue, field, idChanged, key, modifiedFieldNames, name, oldId,
            newId, value, values;

        if (single) {
            values = me._singleProp;
            values[fieldName] = newValue;
        } else {
            values = fieldName;
        }

        for (name in values) {
            if (values.hasOwnProperty(name)) {
                value = values[name];

                if (fields && (field = fields.get(name)) && field.convert) {
                    value = field.convert(value, me);
                }

                currentValue = data[name];
                if (me.isEqual(currentValue, value)) {
                    continue; // new value is the same, so no change...
                }

                data[name] = value;
                (modifiedFieldNames || (modifiedFieldNames = [])).push(name);

                if (field && field.persist) {
                    if (modified.hasOwnProperty(name)) {
                        if (me.isEqual(modified[name], value)) {
                            // The original value in me.modified equals the new value, so
                            // the field is no longer modified:
                            delete modified[name];

                            // We might have removed the last modified field, so check to
                            // see if there are any modified fields remaining and correct
                            // me.dirty:
                            me.dirty = false;
                            for (key in modified) {
                                if (modified.hasOwnProperty(key)){
                                    me.dirty = true;
                                    break;
                                }
                            }
                        }
                    } else {
                        me.dirty = true;
                        modified[name] = currentValue;
                    }
                }

                if (name == me.idProperty) {
                    idChanged = true;
                    oldId = currentValue;
                    newId = value;
                }
            }
        }

        if (single) {
            // cleanup our reused object for next time... important to do this before
            // we fire any events or call anyone else (like afterEdit)!
            delete values[fieldName];
        }

        if (idChanged) {
            me.fireEvent('idchanged', me, oldId, newId);
        }

        if (!me.editing && modifiedFieldNames) {
            me.afterEdit(modifiedFieldNames);
        }

        return modifiedFieldNames || null;
    },

    /**
     * @private
     * Copies data from the passed record into this record. If the passed record is undefined, does nothing.
     *
     * If this is a phantom record (represented only in the client, with no corresponding database entry), and
     * the source record is not a phantom, then this record acquires the id of the source record.
     *
     * @param {Ext.data.Model} sourceRecord The record to copy data from.
     */
    copyFrom: function(sourceRecord) {
        if (sourceRecord) {

            var me = this,
                fields = me.fields.items,
                fieldCount = fields.length,
                field, i = 0,
                myData = me[me.persistenceProperty],
                sourceData = sourceRecord[sourceRecord.persistenceProperty],
                value;

            for (; i < fieldCount; i++) {
                field = fields[i];

                // Do not use setters.
                // Copy returned values in directly from the data object.
                // Converters have already been called because new Records
                // have been created to copy from.
                // This is a direct record-to-record value copy operation.
                value = sourceData[field.name];
                if (value !== undefined) {
                    myData[field.name] = value;
                }
            }

            // If this is a phantom record being updated from a concrete record, copy the ID in.
            if (me.phantom && !sourceRecord.phantom) {
                me.setId(sourceRecord.getId());
            }
        }
    },

    /**
     * Checks if two values are equal, taking into account certain
     * special factors, for example dates.
     * @private
     * @param {Object} a The first value
     * @param {Object} b The second value
     * @return {Boolean} True if the values are equal
     */
    isEqual: function(a, b){
        if (Ext.isDate(a) && Ext.isDate(b)) {
            return Ext.Date.isEqual(a, b);
        }
        return a === b;
    },

    /**
     * Begins an edit. While in edit mode, no events (e.g.. the `update` event) are relayed to the containing store.
     * When an edit has begun, it must be followed by either {@link #endEdit} or {@link #cancelEdit}.
     */
    beginEdit : function(){
        var me = this;
        if (!me.editing) {
            me.editing = true;
            me.dirtySave = me.dirty;
            me.dataSave = Ext.apply({}, me[me.persistenceProperty]);
            me.modifiedSave = Ext.apply({}, me.modified);
        }
    },

    /**
     * Cancels all changes made in the current edit operation.
     */
    cancelEdit : function(){
        var me = this;
        if (me.editing) {
            me.editing = false;
            // reset the modified state, nothing changed since the edit began
            me.modified = me.modifiedSave;
            me[me.persistenceProperty] = me.dataSave;
            me.dirty = me.dirtySave;
            delete me.modifiedSave;
            delete me.dataSave;
            delete me.dirtySave;
        }
    },

    /**
     * Ends an edit. If any data was modified, the containing store is notified (ie, the store's `update` event will
     * fire).
     * @param {Boolean} silent True to not notify the store of the change
     * @param {String[]} modifiedFieldNames Array of field names changed during edit.
     */
    endEdit : function(silent, modifiedFieldNames){
        var me = this,
            changed;
        if (me.editing) {
            me.editing = false;
            if(!modifiedFieldNames) {
                modifiedFieldNames = me.getModifiedFieldNames();
            }
            changed = me.dirty || modifiedFieldNames.length > 0;
            delete me.modifiedSave;
            delete me.dataSave;
            delete me.dirtySave;
            if (changed && silent !== true) {
                me.afterEdit(modifiedFieldNames);
            }
        }
    },

    /**
     * Gets the names of all the fields that were modified during an edit
     * @private
     * @return {String[]} An array of modified field names
     */
    getModifiedFieldNames: function(){
        var me = this,
            saved = me.dataSave,
            data = me[me.persistenceProperty],
            modified = [],
            key;

        for (key in data) {
            if (data.hasOwnProperty(key)) {
                if (!me.isEqual(data[key], saved[key])) {
                    modified.push(key);
                }
            }
        }
        return modified; 
    },

    /**
     * Gets a hash of only the fields that have been modified since this Model was created or commited.
     * @return {Object}
     */
    getChanges : function(){
        var modified = this.modified,
            changes  = {},
            field;

        for (field in modified) {
            if (modified.hasOwnProperty(field)){
                changes[field] = this.get(field);
            }
        }

        return changes;
    },

    /**
     * Returns true if the passed field name has been `{@link #modified}` since the load or last commit.
     * @param {String} fieldName {@link Ext.data.Field#name}
     * @return {Boolean}
     */
    isModified : function(fieldName) {
        return this.modified.hasOwnProperty(fieldName);
    },

    /**
     * Marks this **Record** as `{@link #dirty}`. This method is used interally when adding `{@link #phantom}` records
     * to a {@link Ext.data.proxy.Server#writer writer enabled store}.
     *
     * Marking a record `{@link #dirty}` causes the phantom to be returned by {@link Ext.data.Store#getUpdatedRecords}
     * where it will have a create action composed for it during {@link Ext.data.Model#save model save} operations.
     */
    setDirty : function() {
        var me     = this,
            fields = me.fields.items,
            fLen   = fields.length,
            field, name, f;

        me.dirty = true;

        for (f = 0; f < fLen; f++) {
            field = fields[f];

            if (field.persist) {
                name  = field.name;
                me.modified[name] = me.get(name);
            }
        }
    },

    //<debug>
    markDirty : function() {
        if (Ext.isDefined(Ext.global.console)) {
            Ext.global.console.warn('Ext.data.Model: markDirty has been deprecated. Use setDirty instead.');
        }
        return this.setDirty.apply(this, arguments);
    },
    //</debug>

    /**
     * Usually called by the {@link Ext.data.Store} to which this model instance has been {@link #join joined}. Rejects
     * all changes made to the model instance since either creation, or the last commit operation. Modified fields are
     * reverted to their original values.
     *
     * Developers should subscribe to the {@link Ext.data.Store#update} event to have their code notified of reject
     * operations.
     *
     * @param {Boolean} silent (optional) True to skip notification of the owning store of the change.
     * Defaults to false.
     */
    reject : function(silent) {
        var me = this,
            modified = me.modified,
            field;

        for (field in modified) {
            if (modified.hasOwnProperty(field)) {
                if (typeof modified[field] != "function") {
                    me[me.persistenceProperty][field] = modified[field];
                }
            }
        }

        me.dirty = false;
        me.editing = false;
        me.modified = {};

        if (silent !== true) {
            me.afterReject();
        }
    },

    /**
     * Usually called by the {@link Ext.data.Store} which owns the model instance. Commits all changes made to the
     * instance since either creation or the last commit operation.
     *
     * Developers should subscribe to the {@link Ext.data.Store#update} event to have their code notified of commit
     * operations.
     *
     * @param {Boolean} silent (optional) True to skip notification of the owning store of the change.
     * Defaults to false.
     */
    commit : function(silent) {
        var me = this;

        me.phantom = me.dirty = me.editing = false;
        me.modified = {};

        if (silent !== true) {
            me.afterCommit();
        }
    },

    /**
     * Creates a copy (clone) of this Model instance.
     *
     * @param {String} [id] A new id, defaults to the id of the instance being copied.
     * See `{@link Ext.data.Model#id id}`. To generate a phantom instance with a new id use:
     *
     *     var rec = record.copy(); // clone the record
     *     Ext.data.Model.id(rec); // automatically generate a unique sequential id
     *
     * @return {Ext.data.Model}
     */
    copy : function(newId) {
        var me = this;

        return new me.self(Ext.apply({}, me[me.persistenceProperty]), newId);
    },

    /**
     * Sets the Proxy to use for this model. Accepts any options that can be accepted by
     * {@link Ext#createByAlias Ext.createByAlias}.
     *
     * @param {String/Object/Ext.data.proxy.Proxy} proxy The proxy
     * @return {Ext.data.proxy.Proxy}
     */
    setProxy: function(proxy) {
        //make sure we have an Ext.data.proxy.Proxy object
        if (!proxy.isProxy) {
            if (typeof proxy === "string") {
                proxy = {
                    type: proxy
                };
            }
            proxy = Ext.createByAlias("proxy." + proxy.type, proxy);
        }
        proxy.setModel(this.self);
        this.proxy = proxy;

        return proxy;
    },

    /**
     * Returns the configured Proxy for this Model.
     * @return {Ext.data.proxy.Proxy} The proxy
     */
    getProxy: function() {
        return this.proxy;
    },

    /**
     * Validates the current data against all of its configured {@link #validations}.
     * @return {Ext.data.Errors} The errors object
     */
    validate: function() {
        var errors      = new Ext.data.Errors(),
            validations = this.validations,
            validators  = Ext.data.validations,
            length, validation, field, valid, type, i;

        if (validations) {
            length = validations.length;

            for (i = 0; i < length; i++) {
                validation = validations[i];
                field = validation.field || validation.name;
                type  = validation.type;
                valid = validators[type](validation, this.get(field));

                if (!valid) {
                    errors.add({
                        field  : field,
                        message: validation.message || validators[type + 'Message']
                    });
                }
            }
        }

        return errors;
    },

    /**
     * Checks if the model is valid. See {@link #validate}.
     * @return {Boolean} True if the model is valid.
     */
    isValid: function(){
        return this.validate().isValid();
    },

    /**
     * Saves the model instance using the configured proxy.
     * @param {Object} options Options to pass to the proxy. Config object for {@link Ext.data.Operation}.
     * @return {Ext.data.Model} The Model instance
     */
    save: function(options) {
        options = Ext.apply({}, options);

        var me     = this,
            action = me.phantom ? 'create' : 'update',
            scope  = options.scope || me,
            stores = me.stores,
            i = 0,
            storeCount,
            store,
            args,
            operation,
            callback;

        Ext.apply(options, {
            records: [me],
            action : action
        });

        operation = new Ext.data.Operation(options);

        callback = function(operation) {
            args = [me, operation];
            if (operation.wasSuccessful()) {
                for(storeCount = stores.length; i < storeCount; i++) {
                    store = stores[i];
                    store.fireEvent('write', store, operation);
                    store.fireEvent('datachanged', store);
                    // Not firing refresh here, since it's a single record
                }
                Ext.callback(options.success, scope, args);
            } else {
                Ext.callback(options.failure, scope, args);
            }

            Ext.callback(options.callback, scope, args);
        };

        me.getProxy()[action](operation, callback, me);

        return me;
    },

    /**
     * Destroys the model using the configured proxy.
     * @param {Object} options Options to pass to the proxy. Config object for {@link Ext.data.Operation}.
     * @return {Ext.data.Model} The Model instance
     */
    destroy: function(options){
        options = Ext.apply({}, options);

        var me     = this,
            scope  = options.scope || me,
            stores = me.stores,
            i = 0,
            storeCount,
            store,
            args,
            operation,
            callback;

        Ext.apply(options, {
            records: [me],
            action : 'destroy'
        });

        operation = new Ext.data.Operation(options);
        callback = function(operation) {
            args = [me, operation];
            if (operation.wasSuccessful()) {
                for(storeCount = stores.length; i < storeCount; i++) {
                    store = stores[i];
                    store.fireEvent('write', store, operation);
                    store.fireEvent('datachanged', store);
                    // Not firing refresh here, since it's a single record
                }
                me.clearListeners();
                Ext.callback(options.success, scope, args);
            } else {
                Ext.callback(options.failure, scope, args);
            }
            Ext.callback(options.callback, scope, args);
        };

        me.getProxy().destroy(operation, callback, me);
        return me;
    },

    /**
     * Returns the unique ID allocated to this model instance as defined by {@link #idProperty}.
     * @return {Number/String} The id
     */
    getId: function() {
        return this.get(this.idProperty);
    },

    /**
     * @private
     */
    getObservableId: function() {
        return this.id;
    },

    /**
     * Sets the model instance's id field to the given id.
     * @param {Number/String} id The new id
     */
    setId: function(id) {
        this.set(this.idProperty, id);
        this.phantom  = !(id || id === 0);
    },

    /**
     * Tells this model instance that it has been added to a store.
     * @param {Ext.data.Store} store The store to which this model has been added.
     */
    join : function(store) {
        Ext.Array.include(this.stores, store);

        /**
         * @property {Ext.data.Store} store
         * The {@link Ext.data.Store Store} to which this instance belongs. NOTE: If this
         * instance is bound to multiple stores, this property will reference only the
         * first. To examine all the stores, use the {@link #stores} property instead.
         */
        this.store = this.stores[0]; // compat w/all releases ever
    },

    /**
     * Tells this model instance that it has been removed from the store.
     * @param {Ext.data.Store} store The store from which this model has been removed.
     */
    unjoin: function(store) {
        Ext.Array.remove(this.stores, store);
        this.store = this.stores[0] || null; // compat w/all releases ever
    },

    /**
     * @private
     * If this Model instance has been {@link #join joined} to a {@link Ext.data.Store store}, the store's
     * afterEdit method is called
     * @param {String[]} modifiedFieldNames Array of field names changed during edit.
     */
    afterEdit : function(modifiedFieldNames) {
        this.callStore('afterEdit', modifiedFieldNames);
    },

    /**
     * @private
     * If this Model instance has been {@link #join joined} to a {@link Ext.data.Store store}, the store's
     * afterReject method is called
     */
    afterReject : function() {
        this.callStore("afterReject");
    },

    /**
     * @private
     * If this Model instance has been {@link #join joined} to a {@link Ext.data.Store store}, the store's
     * afterCommit method is called
     */
    afterCommit: function() {
        this.callStore('afterCommit');
    },

    /**
     * @private
     * Helper function used by afterEdit, afterReject and afterCommit. Calls the given method on the
     * {@link Ext.data.Store store} that this instance has {@link #join joined}, if any. The store function
     * will always be called with the model instance as its single argument. If this model is joined to 
     * a Ext.data.NodeStore, then this method calls the given method on the NodeStore and the associated Ext.data.TreeStore
     * @param {String} fn The function to call on the store
     */
    callStore: function(fn) {
        var args = Ext.Array.clone(arguments),
            stores = this.stores,
            i = 0,
            len = stores.length,
            store, treeStore;

        args[0] = this;
        for (; i < len; ++i) {
            store = stores[i];
            if (store && typeof store[fn] == "function") {
                store[fn].apply(store, args);
            }
            // if the record is bound to a NodeStore call the TreeStore's method as well
            treeStore = store.treeStore;
            if (treeStore && typeof treeStore[fn] == "function") {
                treeStore[fn].apply(treeStore, args);
            }
        }
    },

    /**
     * Gets all values for each field in this model and returns an object
     * containing the current data.
     * @param {Boolean} includeAssociated True to also include associated data. Defaults to false.
     * @return {Object} An object hash containing all the values in this model
     */
    getData: function(includeAssociated){
        var me     = this,
            fields = me.fields.items,
            fLen   = fields.length,
            data   = {},
            name, f;

        for (f = 0; f < fLen; f++) {
            name = fields[f].name;
            data[name] = me.get(name);
        }

        if (includeAssociated === true) {
            Ext.apply(data, me.getAssociatedData());
        }
        return data;
    },

    /**
     * Gets all of the data from this Models *loaded* associations. It does this recursively - for example if we have a
     * User which hasMany Orders, and each Order hasMany OrderItems, it will return an object like this:
     *
     *     {
     *         orders: [
     *             {
     *                 id: 123,
     *                 status: 'shipped',
     *                 orderItems: [
     *                     ...
     *                 ]
     *             }
     *         ]
     *     }
     *
     * @return {Object} The nested data set for the Model's loaded associations
     */
    getAssociatedData: function(){
        return this.prepareAssociatedData({}, 1);
    },

    /**
     * @private
     * This complex-looking method takes a given Model instance and returns an object containing all data from
     * all of that Model's *loaded* associations. See {@link #getAssociatedData}
     * @param {Object} seenKeys A hash of all the associations we've already seen
     * @param {Number} depth The current depth
     * @return {Object} The nested data set for the Model's loaded associations
     */
    prepareAssociatedData: function(seenKeys, depth) {
        /**
         * In this method we use a breadth first strategy instead of depth
         * first. The reason for doing so is that it prevents messy & difficult
         * issues when figuring out which associations we've already processed
         * & at what depths.
         */
        var me               = this,
            associations     = me.associations.items,
            associationCount = associations.length,
            associationData  = {},
            // We keep 3 lists at the same index instead of using an array of objects.
            // The reasoning behind this is that this method gets called a lot
            // So we want to minimize the amount of objects we create for GC.
            toRead           = [],
            toReadKey        = [],
            toReadIndex      = [],
            associatedStore, associatedRecords, associatedRecord, o, index, result, seenDepth,
            associationId, associatedRecordCount, association, i, j, type, name;

        for (i = 0; i < associationCount; i++) {
            association = associations[i];
            associationId = association.associationId;
            
            seenDepth = seenKeys[associationId];
            if (seenDepth && seenDepth !== depth) {
                continue;
            }
            seenKeys[associationId] = depth;

            type = association.type;
            name = association.name;
            if (type == 'hasMany') {
                //this is the hasMany store filled with the associated data
                associatedStore = me[association.storeName];

                //we will use this to contain each associated record's data
                associationData[name] = [];

                //if it's loaded, put it into the association data
                if (associatedStore && associatedStore.getCount() > 0) {
                    associatedRecords = associatedStore.data.items;
                    associatedRecordCount = associatedRecords.length;

                    //now we're finally iterating over the records in the association. Get
                    // all the records so we can process them
                    for (j = 0; j < associatedRecordCount; j++) {
                        associatedRecord = associatedRecords[j];
                        associationData[name][j] = associatedRecord.getData();
                        toRead.push(associatedRecord);
                        toReadKey.push(name);
                        toReadIndex.push(j);
                    }
                }
            } else if (type == 'belongsTo' || type == 'hasOne') {
                associatedRecord = me[association.instanceName];
                // If we have a record, put it onto our list
                if (associatedRecord !== undefined) {
                    associationData[name] = associatedRecord.getData();
                    toRead.push(associatedRecord);
                    toReadKey.push(name);
                    toReadIndex.push(-1);
                }
            }
        }
        
        for (i = 0, associatedRecordCount = toRead.length; i < associatedRecordCount; ++i) {
            associatedRecord = toRead[i];
            o = associationData[toReadKey[i]];
            index = toReadIndex[i];
            result = associatedRecord.prepareAssociatedData(seenKeys, depth + 1);
            if (index === -1) {
                Ext.apply(o, result);
            } else {
                Ext.apply(o[index], result);
            }
        }

        return associationData;
    }
});

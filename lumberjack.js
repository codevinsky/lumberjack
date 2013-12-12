/*!
 * Lumberjack JavaScript Utility v0.2
 * http://github.com/jbail/lumberjack
 *
 * Copyright 2013 Jeff Bail
 * Released under the MIT license
 * http://opensource.org/licenses/MIT
 *
 * Date: 2013-11-24
 */
(function () {

  function Console(console, name, options) {
    var options = options || {},
        opts = {
          enabled: typeof options.enabled != 'undefined' ? options.enabled : true,
          color: typeof options.color != 'undefined' ? options.color : '#bada55',
          background: typeof options.background != 'undefined' ? options.background : '#111'
        }, 
        colorSupported = isColorSupported(),
        streams = {}, logs = [];



    //private
    function log(args, type) {
      var color;
      args = argumentsToArray(args);

      if (opts.enabled) {
        if (colorSupported && name != undefined && type ) {
          color = (type !== 'dir') ? '%c ' : '';
          //hat tip: http://stackoverflow.com/questions/7505623/colors-in-javascript-console
          args.unshift('%c ' + name + ' ', 'color:' + opts.color + '; background:' + opts.background);
          console[type].apply(console, args);
          args.splice(0, 1);
        } else {
          console[type].apply(console, args);
        }
      }

      args.push(new Date()) //add timestamp
      logs.push(args);
    };

    function argumentsToArray(args) {
      return Array.prototype.slice.call(args, 0);
    };

    function isColorSupported() {
      //it feels dirty doing user agent browser detection, but i don't think 
      //there's another way to detemine if the console supports color. 
      var ua = navigator.userAgent.toLowerCase();
      return ua.indexOf('firefox') != -1 || ua.indexOf('chrome') != -1;
    }



    //public
    this.stream = function (name, options) {
      var stream = streams[name];

      if (!stream) {
        stream = new Console(console, name, options);
        streams[name] = stream;
      }
      
      return stream;
    };

    this.on = function (name) {
      if (typeof name != 'undefined') {
        streams[name].on();
      } else {
        opts.enabled = true;
      }
    };
    
    this.off = function (name) {
      if (typeof name != 'undefined') {
        streams[name].off();
      } else {
        opts.enabled = false;
      }
    };
    
    this.logs = function () {
      return logs;
    }
    
    this.log = function () {
      log(arguments, 'log');
    };
    this.debug = function() {
      log(arguments, 'debug');
    }
    this.dir = function () {
      log(arguments, 'dir');
    };  
    
    this.info = function () {
      log(arguments, 'info');
    };
    
    this.warn = function () {
      log(arguments, 'warn');
    };
    
    this.error = function () {
      log(arguments, 'error');
    };  

    this.color = function (color) {
      opts.color = color;
    }

    this.background = function (background) {
      opts.background = background;
    }
  }


  //override window.console
  console = window.console;
  window.console = new Console(console);

})();
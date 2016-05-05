import { defaultEmberLog4jsConfig } from 'ember-log4js/default-configuration';
import { CircleBufferAppender } from 'ember-log4js/circlebuffer-appender';

// Polyfill Object.assign (for PhantomJS)  (FROM MDN)
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign
if (typeof Object.assign !== 'function') {
    (function() {
        Object.assign = function(target) {
            'use strict';
            if (target === undefined || target === null) {
                throw new TypeError('Cannot convert undefined or null to object');
            }

            var output = Object(target);
            for (var index = 1; index < arguments.length; index++) {
                var source = arguments[index];
                if (source !== undefined && source !== null) {
                    for (var nextKey in source) {
                        if (source.hasOwnProperty(nextKey)) {
                            output[nextKey] = source[nextKey];
                        }
                    }
                }
            }
            return output;
        };
    })();
}

export class EmberLog4javascriptLoggerFactory {

    constructor() {
        this._isInitialized=false;
        this.circleBufferAppender = new CircleBufferAppender();
    }

    getDefaultConfiguration() {
        var copyOfDefaultConfig = Object.assign({}, defaultEmberLog4jsConfig);
        return copyOfDefaultConfig;
    }


    getCircleBuffer() {
        return this.circleBufferAppender.getCircleBuffer();
    }

    resetCircleBufferToSize(size) {
        this.circleBufferAppender.setBufferSize(size);
    }

    isInitialized() {
        return this._isInitialized;
    }

    initialize(configuration) {

        // Skip if already initialized
        if (this._isInitialized) {
            return;
        }

        // Apply Configuration (as given ) or DEFAULT if not given.
        var usingDefaultConfiguration = false;
        if (!configuration) {
            usingDefaultConfiguration = true;
            configuration = this.getDefaultConfiguration();
        }

        // -- Standard sort of setup/configuration ---
        var defaultLoggerName = (configuration.defaultLoggerName) ? configuration.defaultLoggerName : 'ember-log4js.main';
        var ROOT_LEVEL = (configuration.ROOT_LEVEL) ? configuration.ROOT_LEVEL : 'INFO';
        var pattern = (configuration.patternLayout) ? configuration.patternLayout : "%d{HH:mm:ss} %-5p %c - %m%n";
        var loggingLevels = (configuration.loggingLevels) ? configuration.loggingLevels : {};

        this.defaultLoggerName = defaultLoggerName;
        this.defaultLogger = log4javascript.getLogger(this.defaultLoggerName);

        var loggerLayout = new log4javascript.PatternLayout(pattern);

        //Root Logger & All uses the console appender...
        var rootLogger = log4javascript.getRootLogger();
        var consoleAppender = new log4javascript.BrowserConsoleAppender();
        consoleAppender.setLayout(loggerLayout);
        rootLogger.addAppender(consoleAppender);
        rootLogger.addAppender(this.circleBufferAppender);

        var rootLoggerLevel = log4javascript.Level[ROOT_LEVEL];
        rootLogger.setLevel(rootLoggerLevel);

        for (var logspec in loggingLevels) {
            var levelSpec =  loggingLevels[logspec];
            var level = log4javascript.Level[levelSpec];
            log4javascript.getLogger(logspec).setLevel(level);
        }

        var configurationInfo = (usingDefaultConfiguration) ? 'DEFAULT CONFIGURATION' : 'a specified/custom configuartion';
        this.defaultLogger.info('Initializing logging using '+configurationInfo);
        this._isInitialized = true;
    }

    getRootLevel() {
        return log4javascript.getRootLogger().getLevel().name;
    }

    setRootLevel(levelArg) {

        var level = log4javascript.Level[levelArg];
        if (level === undefined) {
            log4javascript.error('Unable to set level to: ' + levelArg);
            throw 'Unable to set level to: ' + levelArg;
        }

        log4javascript.getRootLogger().setLevel(level);
    }
    getLogger(loggerName) {
        this.initialize();
        if (typeof loggerName!=='string') {
            loggerName=this.defaultLoggerName;
        }
        return log4javascript.getLogger(loggerName);
    }
}

var theEmberLog4javascriptLoggerFactory = new EmberLog4javascriptLoggerFactory();

export default theEmberLog4javascriptLoggerFactory;

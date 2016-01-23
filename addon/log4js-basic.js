import defaultConfiguration from 'ember-log4js/default-configuration';


class EmberLog4javascriptLogger {

    constructor() {
        this._isInitialized=false;
    }

    getDefaultConfiguration() {
        var copyOfDefaultConfig = Object.assign({},defaultConfiguration);
        return copyOfDefaultConfig;
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

    getLogger(loggerName) {
        this.initialize();
        if (typeof loggerName!=='string') {
            loggerName=this.defaultLoggerName;
        }
        return log4javascript.getLogger(loggerName);
    }
}

export var theEmberLog4javascriptLogger = new EmberLog4javascriptLogger();

export default theEmberLog4javascriptLogger;

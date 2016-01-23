
export var defaultEmberLog4javascriptConfiguration = {
    ROOT_LEVEL: 'INFO',
    loggingLevels: {
        // <loggerName> : <logLevel>
        // e..g   'package.dir1.dir2.foo-bar': 'INFO',   // one of ['INFO','DEBUG','ERROR',...]
    },
    patterLayout: '%d{HH:mm:ss} %-5p %c - %m%n',
    defaultLoggerName: 'ember-log4js.main'
};

export default defaultEmberLog4javascriptConfiguration;

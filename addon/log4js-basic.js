

var ROOT_LEVEL = log4javascript.Level.INFO;
var logConfigMap = {
  'dxref':'INFO',
  'dxref.services.data-service': 'INFO'     //DEBUG will show the exact responses...
};

var loggerLayout = new log4javascript.PatternLayout("%d{HH:mm:ss} %-5p %c - %m%n");

// -- Standard sort of setup/configuration ---

var rootLogger = log4javascript.getRootLogger();
var consoleAppender = new log4javascript.BrowserConsoleAppender();
consoleAppender.setLayout(loggerLayout);
rootLogger.addAppender(consoleAppender);
rootLogger.setLevel(ROOT_LEVEL);

for (var logspec in logConfigMap) {
  var levelSpec =  logConfigMap[logspec];
  var level = log4javascript.Level[levelSpec];
  log4javascript.getLogger(logspec).setLevel(level);
}


var logger = log4javascript.getLogger('ember-log4js.main');
export default logger;

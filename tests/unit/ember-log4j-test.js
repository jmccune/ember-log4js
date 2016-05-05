import LoggerFactory from 'ember-log4js/logger-factory';
import { module, test } from 'qunit';

module('Unit | EmberLog4js');


/** Necessary because sometimes there are messages logged by the logger
 * on startup and we don't want to capture them on our tests...
 * (Given that any test can run first, we must do this for any test
 * where we care about what we exactly capture).
 *
 */
function skipCircleBufferCaptureOfInitialMessages(size) {
    LoggerFactory.resetCircleBufferToSize(0);
    var logger = LoggerFactory.getLogger("circle-buffer-test");
    logger.info("reset");
    LoggerFactory.resetCircleBufferToSize(size);
    return logger;
}

test('validate basic promises', function(assert) {
    var logger = LoggerFactory.getLogger("foo.bar");
    logger.warn("This is a test!");
    assert.ok(true);
});


test('change of levels', function(assert) {

    var originalLevel = LoggerFactory.getRootLevel();
    assert.equal(originalLevel, 'INFO');

    LoggerFactory.setRootLevel('DEBUG');
    var result = LoggerFactory.getRootLevel();
    assert.equal(result, 'DEBUG');

    //NOTE: We're setting global state-- (the root log level)
    // which can affect other tests.
    // Reset to initial level.

    LoggerFactory.setRootLevel(originalLevel);

});

test('circle-buffer message capture', function(assert) {

    var logger = skipCircleBufferCaptureOfInitialMessages(10);

    logger.info("this is info message #1");
    logger.info("this is info message #2");
    //Doesn't show up-- below the log level!
    logger.debug("this is debug message #1");
    logger.warn("this is warn message #1");
    logger.info("this is info message #3");
    logger.error("this is error message #1");

    var buffer = LoggerFactory.getCircleBuffer();

    assert.equal(buffer[0].level, 'INFO');
    assert.equal(buffer[1].level, 'INFO');
    assert.equal(buffer[2].level, 'WARN');
    assert.equal(buffer[3].level, 'INFO');
    assert.equal(buffer[4].level, 'ERROR');

    assert.ok(buffer[0].message.indexOf('info message #1') > 0);
    assert.ok(buffer[1].message.indexOf('info message #2') > 0);
    assert.ok(buffer[2].message.indexOf('warn message #1') > 0);
    assert.ok(buffer[3].message.indexOf('info message #3') > 0);
    assert.ok(buffer[4].message.indexOf('error message #1') > 0);
});


test('circle-buffer overflow', function(assert) {
    var logger = skipCircleBufferCaptureOfInitialMessages(2);

    var buffer = LoggerFactory.getCircleBuffer();

    assert.equal(buffer.length, 0);

    //CHANGE STATE TO (1 Message Added, 1 Message In Buffer)
    logger.info("this is info message #1");

    // VERIFY
    buffer = LoggerFactory.getCircleBuffer();
    assert.equal(buffer[0].level, 'INFO');
    assert.ok(buffer[0].message.indexOf('info message #1') > 0);

    //CHANGE STATE TO (2 Message Added, 2 Message In Buffer)
    logger.info("this is info message #2");

    // VERIFY
    buffer = LoggerFactory.getCircleBuffer();
    assert.equal(buffer[0].level, 'INFO');
    assert.equal(buffer[1].level, 'INFO');

    assert.ok(buffer[0].message.indexOf('info message #1') > 0);
    assert.ok(buffer[1].message.indexOf('info message #2') > 0);


    //NULL OP
    //Doesn't show up-- (debug) is below the log level of Info
    logger.debug("this is debug message #1");

    // VERIFY
    buffer = LoggerFactory.getCircleBuffer();
    assert.equal(buffer[0].level, 'INFO');
    assert.equal(buffer[1].level, 'INFO');

    assert.ok(buffer[0].message.indexOf('info message #1') > 0);
    assert.ok(buffer[1].message.indexOf('info message #2') > 0);

    //CHANGE STATE TO (3 Message Added, 2 Message In Buffer)
    logger.warn("this is warn message #1");

    // VERIFY
    buffer = LoggerFactory.getCircleBuffer();
    assert.equal(buffer[0].level, 'INFO');
    assert.equal(buffer[1].level, 'WARN');

    assert.ok(buffer[0].message.indexOf('info message #2') > 0);
    assert.ok(buffer[1].message.indexOf('warn message #1') > 0);

    //CHANGE STATE TO (4 Message Added, 2 Message In Buffer)
    logger.info("this is info message #3");

    // VERIFY
    buffer = LoggerFactory.getCircleBuffer();
    assert.equal(buffer[0].level, 'WARN');
    assert.equal(buffer[1].level, 'INFO');

    assert.ok(buffer[0].message.indexOf('warn message #1') > 0);
    assert.ok(buffer[1].message.indexOf('info message #3') > 0);


});

import LoggerFactory from 'ember-log4js/logger-factory';
import { module, test } from 'qunit';

module('Unit | EmberLog4js');

test('validate basic promises', function(assert) {
    var logger = LoggerFactory.getLogger("foo.bar");
    logger.warn("This is a test!");
    assert.ok(true);
});


test('change of levels', function(assert) {

    var result = LoggerFactory.getRootLevel();
    assert.equal(result, 'DEBUG');
    LoggerFactory.setRootLevel('WARN');
    result = LoggerFactory.getRootLevel();
    assert.equal(result, 'WARN');

});

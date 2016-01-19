import logger from 'ember-log4js/log4js-basic';
import { module, test } from 'qunit';

module('Unit | EmberLog4js');

test('validate basic promises', function(assert) {
  logger.warn("This is a test!");
  assert.ok(true);
});


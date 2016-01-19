/* jshint node: true */
'use strict';

module.exports = {
  name: 'ember-log4js',
  afterInstall: function() {
    return this.addBowerPackageToProject('log4javascript', 'file:///Users/mccune/software/log4javascript/log4javascript-1.4.13/.git#master');
  }
};

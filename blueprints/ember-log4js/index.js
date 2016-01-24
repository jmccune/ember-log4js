/*jshint node:true*/
module.exports = {
    description: '',
    normalizeEntityName: function() {
        // this prevents an error when the entityName is
        // not specified (since that doesn't actually matter
        // to us
    },

    afterInstall: function() {
        return this.addBowerPackageToProject('log4javascript', 'file:///Users/mccune/software/log4javascript/log4javascript-1.4.13/.git#master');
    }
    // locals: function(options) {
    //   // Return custom template variables here.
    //   return {
    //     foo: options.entity.options.foo
    //   };
    // }

    // afterInstall: function(options) {
    //   // Perform extra work here.
    // }
};


module.exports = function(grunt) {
  grunt.loadNpmTasks('grunt-contrib-jasmine');
  grunt.initConfig({

    jasmine: {
      pozimobile: {
        src: [], // code under test is loaded by specs
        options: {
          specs: "spec/**/*Spec.js",
          helpers: [], // any required helpers are loaded by specs
          template: require('grunt-template-jasmine-requirejs'),
          templateOptions: {
            requireConfigFile: ['requirejsConfig.js']
          }
        }
      }
    }

  });
};


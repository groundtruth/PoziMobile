
module.exports = function(grunt) {
  grunt.loadNpmTasks('grunt-contrib-jasmine');
  grunt.initConfig({
    jasmine: {
      pozimobile: {
        // src: "js/**/*.js",
        options: {
          specs: "spec/**/*Spec.js",
          // specs: "spec/js/configSpec.js",
          template: require('grunt-template-jasmine-requirejs'),
          templateOptions: {
            requireConfigFile: ['requirejsConfig.js']
          }
        }
      }
    }
  });
};


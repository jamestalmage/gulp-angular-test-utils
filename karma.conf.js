module.exports = function(karma){
  karma.set({
    frameworks: ['mocha'],

    files: [
      "node_modules/angular/angular.js",
      "node_modules/angular-mocks/angular-mocks.js",
      "build/math.js",
      "build/math-test.js"
    ],

    // Use PhantomJS for Travis CI builds.
    // PhantomJS does not have source-map support, so use Chrome for testing that on developer machines
    browsers: [ process.env.TRAVIS ? 'PhantomJS' : 'Chrome'],

    preprocessors: {
      '**/*.js':'sourcemap'
    },

    singleRun: true,
    autoWatch: false
  });

};
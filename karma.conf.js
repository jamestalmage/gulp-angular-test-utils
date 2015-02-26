module.exports = function(karma){
  karma.set({
    frameworks: ['mocha'],

    files: [
      "node_modules/angular/angular.js",
      "node_modules/angular-mocks/angular-mocks.js",
      "build/math.js",
      "build/math-test.js"
    ],

    browsers: ['PhantomJS'],

    singleRun: true,
    autoWatch: false
  });
};
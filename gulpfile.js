var gulp = require('gulp');
var tang = require('./');
var sourcemaps = require('gulp-sourcemaps');
var karma = require('karma').server;
var testUtils = require('angular-test-utils-test-utils');


// --------------------------- //
// use gulp source-map support //
// --------------------------- //
gulp.task('instrument-files-gulp-source-maps', function (){
  return gulp.src('./fixtures/*.js')
    .pipe(sourcemaps.init())
    .pipe(tang())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('build/gulp-source-maps'))
});

gulp.task('karma-gulp-source-maps', ['instrument-files-gulp-source-maps'], function(cb) {
  karma.start(karmaConf('gulp-source-maps'), cb)
});

gulp.task('karma-gulp-source-maps-error', ['instrument-files-gulp-source-maps'], function(cb) {
  karma.start(karmaConf('gulp-source-maps', true), testUtils.validateErrorMapping(
    './build/gulp-source-maps-error-report.xml',
    /math-test-error.js:28:(5|11)/,   //Browsers differ- they measure from either start of `throw` or start of `new Error`
    cb
  ));
});


// -------------------------------- //
// use internal source-map handling //
// -------------------------------- //
gulp.task('instrument-files-internal-source-maps', function() {
  return gulp.src('./fixtures/*.js')
    .pipe(tang({
      sourceMap:true
    }))
    .pipe(gulp.dest('build/internal-source-maps'))
});

gulp.task('karma-internal-source-maps', ['instrument-files-internal-source-maps'], function(cb) {
  karma.start(karmaConf('internal-source-maps'), cb);
});

gulp.task('karma-internal-source-maps-error', ['instrument-files-internal-source-maps'], function(cb) {
  karma.start(karmaConf('internal-source-maps', true), testUtils.validateErrorMapping(
    './build/internal-source-maps-error-report.xml',
    /math-test-error.js:28:(5|11)/, //Browsers differ- they measure from either start of `throw` or start of `new Error`
    cb
  ));
});


// --------------------------------- //
// production build / no source-maps //
// --------------------------------- //
gulp.task('instrument-files-no-source-maps', function() {
  return gulp.src('./fixtures/*.js')
    .pipe(tang())
    .pipe(gulp.dest('build/no-source-maps'))
});

gulp.task('validate-no-source-maps', ['instrument-files-no-source-maps'], function() {
  ['./build/no-source-maps/math.js',
    './build/no-source-maps/math-test.js',
    './build/no-source-maps/math-test-error.js'].forEach(testUtils.validateNoSourceMap);
});

gulp.task('success', [
  'karma-gulp-source-maps',
  'karma-gulp-source-maps-error',
  'karma-internal-source-maps',
  'karma-internal-source-maps-error',
  'validate-no-source-maps'
], testUtils.success);

gulp.task('default',['success']);

function karmaConf(prefix, error){
  return testUtils.karmaTemplate(prefix, error,
    [
      'node_modules/angular/angular.js',
      'node_modules/angular-mocks/angular-mocks.js',
      'build/{prefix}/math.js',
      'build/{prefix}/math-test{error}.js'
    ],
    {
      preprocessors: {
        '**/*.js':'sourcemap'
      }
    }
  )
}
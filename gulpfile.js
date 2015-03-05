var gulp = require('gulp');
var plugin = require('./');
var sourcemaps = require('gulp-sourcemaps');
var fs = require('fs');
var karma = require('karma').server;
var convert = require('convert-source-map');


// --------------------------- //
// use gulp source-map support //
// --------------------------- //
gulp.task('instrument-files-gulp-source-maps', function (){
  return gulp.src('./fixtures/*.js')
    .pipe(sourcemaps.init())
    .pipe(plugin())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('build/gulp-source-maps'))
});

gulp.task('karma-gulp-source-maps', ['instrument-files-gulp-source-maps'], function(cb) {
  karma.start(karmaConf('gulp-source-maps'), cb)
});

gulp.task('karma-gulp-source-maps-error', ['instrument-files-gulp-source-maps'], function(cb) {
  karma.start(karmaConf('gulp-source-maps', true), validateErrorMapping(
    './build/gulp-source-maps-error-report.xml',
    /math-test-error.js:28:11/,
    cb
  ));
});


// -------------------------------- //
// use internal source-map handling //
// -------------------------------- //
gulp.task('instrument-files-internal-source-maps', function() {
  return gulp.src('./fixtures/*.js')
    .pipe(plugin({
      sourceMap:true
    }))
    .pipe(gulp.dest('build/internal-source-maps'))
});

gulp.task('karma-internal-source-maps', ['instrument-files-internal-source-maps'], function(cb) {
  karma.start(karmaConf('internal-source-maps'), cb);
});

gulp.task('karma-internal-source-maps-error', ['instrument-files-internal-source-maps'], function(cb) {
  karma.start(karmaConf('internal-source-maps', true), validateErrorMapping(
    './build/internal-source-maps-error-report.xml',
    /math-test-error.js:28:11/,
    cb
  ));
});


// -------------------------------- //
// use internal source-map handling //
// -------------------------------- //
gulp.task('instrument-files-no-source-maps', function() {
  return gulp.src('./fixtures/*.js')
    .pipe(plugin())
    .pipe(gulp.dest('build/no-source-maps'))
});

gulp.task('validate-no-source-maps', ['instrument-files-no-source-maps'], function() {
  ['math.js','math-test.js','math-test-error.js'].forEach(function(fileName) {
    var path = './build/no-source-maps/' + fileName;
    var code = fs.readFileSync(path).toString();
    if(convert.fromSource(code) !== null){
      throw new Error(path + ': found a source map when I should not have');
    }
  });
});

gulp.task('default', [
  'karma-gulp-source-maps',
  'karma-gulp-source-maps-error',
  'karma-internal-source-maps',
  'karma-internal-source-maps-error',
  'validate-no-source-maps'
]);

function validateErrorMapping(path, test, cb) {
  return function (e) {
    if (e) {
      var report = fs.readFileSync(path);
      if (test.test(report)) {
        cb();
      }
      else {
        cb(new Error('bad source mapping'));
      }
    }
    else {
      cb(new Error('expected error'));
    }
  };
}

/**
 * Creates a karma configuration for
 **/
var port = 9876;
function karmaConf(prefix, error){
  return {
    frameworks: ['mocha'],

    files: [
      'node_modules/angular/angular.js',
      'node_modules/angular-mocks/angular-mocks.js',
      'build/' + prefix + '/math.js',
      'build/' + prefix + '/math-test' + (error ? '-error.js' : '.js')
    ],

    port: port++,

    browsers: [process.env.TRAVIS ? 'Firefox' : 'Chrome'],

    preprocessors: {
      '**/*.js':'sourcemap'
    },

    reporters: ['junit'],

    junitReporter:{
      outputFile: 'build/' + prefix + (error ? '-error-report.xml' : '-report.xml')
    },

    singleRun: true,
    autoWatch: false
  };
}
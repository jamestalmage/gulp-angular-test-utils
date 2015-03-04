var gulp = require('gulp');
var plugin = require('./');
var sourcemaps = require('gulp-sourcemaps');
var path = require('path');
var karma = require('karma').server;

gulp.task('instrument-files', function (){
  return gulp.src('./fixtures/*.js')
    .pipe(sourcemaps.init())
    .pipe(plugin())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('build'))
});

gulp.task('karma', ['instrument-files'], function (cb) {
  karma.start({
    configFile: path.resolve('./karma.conf.js')
  },cb)
});

gulp.task('default', ['karma']);
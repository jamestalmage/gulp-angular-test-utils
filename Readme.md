gulp-ng-test-utils
------------------

Gulp is a great build system, but most users will benefit more by using the
[karma-preprocessor](https://github.com/jamestalmage/karma-angular-test-utils)
to apply the transforms for your test code. If you are not using karma,
or have a need to package your tests with the transforms include, then read on.

Install:
```
npm install --save-dev ng-test-utils gulp-ng-test-utils
```

Since this is all about testing, you almost certainly want to enable source-maps.
There are two ways to accomplish this.

Using `gulp-sourcemaps` is the recommended way if you are chaining this transform
together with others that support `gulp-sourcemaps`.

```javascript
var gulp = require('gulp');
var ngTestUtils = require('gulp-ng-test-utils');
var sourcemaps = require('gulp-sourcemaps');

gulp.task('instrument-test-files', function (){
  return gulp.src('tests/*.js')
    .pipe(sourcemaps.init())
    .pipe(ngTestUtils())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('build/tests'))
});
```

Using ng-test-utils internal source map support is handy if it is the only transform being applied
to your test code, or if up/downstream transforms do not support `gulp-sourcemaps`.

```javascript
gulp.task('instrument-test-files', function() {
  return gulp.src('tests/*.js')
    .pipe(plugin({
      sourceMap:true
    }))
    .pipe(gulp.dest('build/tests'))
});
```

Check out the `examples` and `gulpfile.js` folder on [github](https://github.com/jamestalmage/gulp-angular-test-utils)
for more ideas.

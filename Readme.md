gulp-tang
---------
Thirsty for for leaner Angular tests? Gulp some [tang](https://github.com/jamestalmage/tang)!

Gulp is a great build system, but most users will benefit more by using the
[karma-preprocessor](https://github.com/jamestalmage/karma-tang)
to apply the transforms for their tests. If you are not using karma,
or have a need to package up your tests with the transforms applied, then read on.

Install:
```
npm install --save-dev tang gulp-tang
```

Since this is all about testing, you almost certainly want to enable source-maps.
There are two ways to accomplish this.

Using `gulp-sourcemaps` is the recommended way if you are chaining this transform
together with others that support `gulp-sourcemaps`.

```javascript
var gulp = require('gulp');
var tang = require('gulp-tang');
var sourcemaps = require('gulp-sourcemaps');

gulp.task('instrument-test-files', function (){
  return gulp.src('tests/*.js')
    .pipe(sourcemaps.init())
    .pipe(tang())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('build/tests'))
});
```

Using `tang`s internal source map support is handy if it is the only transform being applied
to your test code, or if up/downstream transforms do not support `gulp-sourcemaps`.

```javascript
gulp.task('instrument-test-files', function() {
  return gulp.src('tests/*.js')
    .pipe(tang({
      sourceMap:true
    }))
    .pipe(gulp.dest('build/tests'))
});
```

Check out the `examples` and `gulpfile.js` folder on [github](https://github.com/jamestalmage/gulp-tang)
for more ideas.

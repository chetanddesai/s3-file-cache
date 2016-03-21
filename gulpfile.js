var gulp = require('gulp');
var istanbul = require('gulp-istanbul');
var mocha = require('gulp-mocha');

gulp.task('pre-test', function () {
  return gulp.src(['s3FileCache.js'])
    // Covering files
    .pipe(istanbul())
    // Force `require` to return covered files
    .pipe(istanbul.hookRequire());
});

gulp.task('test', ['pre-test'], function () {
  return gulp.src(['test/*.js'])
    .pipe(mocha())
    // Creating the reports after tests ran
    .pipe(istanbul.writeReports({
      reporters: ['lcov', 'json', 'text', 'text-summary']
    }))
    // Enforce a coverage of at least 80%
    .pipe(istanbul.enforceThresholds({ thresholds: { global: 80 } }));
});

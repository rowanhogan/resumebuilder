var gulp          = require('gulp'),
    autoprefixer  = require('gulp-autoprefixer'),
    browserify    = require('browserify'),
    connect       = require('gulp-connect'),
    fs            = require('fs'),
    ghPages       = require('gulp-gh-pages'),
    sass          = require('gulp-sass'),
    source        = require('vinyl-source-stream')
    templateCache = require('gulp-angular-templatecache');


gulp.task('browserify', function() {
  return browserify('./app/scripts/app.js')
    .bundle()
    .pipe(source('main.js'))
    .pipe(gulp.dest('./public/js/'));
});

gulp.task('connect', function () {
  connect.server({
    root: 'public',
    port: 4000
  });
});

gulp.task('setup', function () {
  fs.writeFileSync('./public/CNAME', 'resumebuilder.rowanhogan.com');
  gulp.src('./app/index.html').pipe(gulp.dest('./public'));
  gulp.src('./app/images/*.**').pipe(gulp.dest('./public/images'));
});

gulp.task('ghpages', function() {
  return gulp.src('./public/**/*')
    .pipe(ghPages());
});

gulp.task('sass', function () {
  gulp.src('./app/styles/*.scss')
    .pipe(sass({outputStyle: 'compressed'}))
    .pipe(autoprefixer())
    .pipe(gulp.dest('./public/css'));
});

gulp.task('templates', function () {
  return gulp.src('./app/views/**/*.html')
    .pipe(templateCache({
      root:   'views/',
      module: 'clientApp'
    }))
    .pipe(gulp.dest('./public/js/'));
});

gulp.task('watch', function() {
  gulp.watch('app/**/*.html', ['templates']);
  gulp.watch('app/**/*.js', ['browserify']);
  gulp.watch('app/**/*.scss', ['sass']);
})


gulp.task('build',    ['setup', 'templates', 'browserify', 'sass']);
gulp.task('deploy',   ['build', 'ghpages']);
gulp.task('default',  ['build', 'connect', 'watch']);

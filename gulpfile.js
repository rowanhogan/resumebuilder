var gulp          = require('gulp'),
    browserify    = require('browserify'),
    connect       = require('gulp-connect'),
    fs            = require('fs'),
    ghPages       = require('gulp-gh-pages'),
    mkdirp        = require("mkdirp"),
    plugins       = require('gulp-load-plugins')(),
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
  gulp.src('./app/index.html').pipe(gulp.dest('./public'));

  mkdirp('./public/', function (err) {
    if (err) return cb(err)
    fs.writeFileSync('./public/CNAME', 'resumebuilder.rowanhogan.com');
  });
});

gulp.task('images', function () {
  return gulp.src('./app/images/*.**')
    .pipe(gulp.dest('./public/images'));
});

gulp.task('ghpages', function() {
  return gulp.src('./public/**/*')
    .pipe(ghPages());
});

gulp.task('sass', function () {
  gulp.src('./app/styles/*.scss')
    .pipe(plugins.sass({outputStyle: 'compressed'}))
    .pipe(plugins.autoprefixer())
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
  gulp.watch('./app/**/*.html', ['templates']);
  gulp.watch('./app/**/*.js', ['browserify']);
  gulp.watch('./app/**/*.scss', ['sass']);
  gulp.watch('./app/index.html', ['setup']);
  gulp.watch('./app/images/*.**', ['images']);
});

gulp.task('build',    ['setup', 'templates', 'images', 'sass', 'browserify']);
gulp.task('default',  ['build', 'connect', 'watch']);

gulp.task('deploy',   plugins.sequence('build', 'ghpages'));


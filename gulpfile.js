var gulp          = require('gulp'),
    browserify    = require('browserify'),
    fs            = require('fs'),
    mkdirp        = require("mkdirp"),
    plugins       = require('gulp-load-plugins')(),
    source        = require('vinyl-source-stream');

gulp.task('browserify', function() {
  return browserify('./app/scripts/app.js')
    .bundle()
    .pipe(source('main.js'))
    .pipe(gulp.dest('./public/js/'));
});

gulp.task('connect', function () {
  plugins.connect.server({
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
    .pipe(plugins.ghPages());
});

gulp.task('sass', function () {
  gulp.src('./app/styles/*.scss')
    .pipe(plugins.sass({outputStyle: 'compressed'}))
    .pipe(plugins.autoprefixer())
    .pipe(gulp.dest('./public/css'));
});

gulp.task('templates', function () {
  return gulp.src('./app/views/**/*.html')
    .pipe(plugins.angularTemplatecache({
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


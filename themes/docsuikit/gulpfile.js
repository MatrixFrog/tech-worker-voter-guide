//
// Gulpfile
//
var gulp                   = require('gulp'),
    sass                   = require('gulp-sass'),
    changed                = require('gulp-changed'),
    autoprefixer           = require('gulp-autoprefixer'),
    rename                 = require('gulp-rename'),
    del                    = require('del'),
    concat                 = require('gulp-concat'),
    cssnano                = require('gulp-cssnano'),
    uglify                 = require('gulp-uglifyjs'),
    cache                  = require('gulp-cache'),
    imagemin               = require('gulp-imagemin'),
    imageminJpegRecompress = require('imagemin-jpeg-recompress'),
    pngquant               = require('imagemin-pngquant'),
    browserSync            = require('browser-sync').create();



//
// Gulp plumber error handler - displays if any error occurs during the process on your command
//
function errorLog(error) {
  console.error.bind(error);
  this.emit('end');
}



//
// SASS - Compile SASS files into CSS
//
gulp.task('sass', function () {
 // Theme
 gulp.src('./srv/scss/**/*.scss')
  .pipe(changed('./static/css/'))
  .pipe(sass({ outputStyle: 'expanded' }))
  .on('error', sass.logError)
  .pipe(autoprefixer([
      "last 1 major version",
      ">= 1%",
      "Chrome >= 45",
      "Firefox >= 38",
      "Edge >= 12",
      "Explorer >= 10",
      "iOS >= 9",
      "Safari >= 9",
      "Android >= 4.4",
      "Opera >= 30"], { cascade: true }))
  .pipe(gulp.dest('./static/css/'))
  .pipe(browserSync.stream());
});



//
// Gulp Watch and Tasks
//
//
gulp.task('watch', function() {
  gulp.watch('./src/scss/**/*.scss', ['sass']);
});

// Gulp Tasks
gulp.task('default', ['watch', 'sass', 'serve'])



//
// CSS minifier - merges and minifies the below given list of Front libraries into one theme.min.css
//
gulp.task('minCSS', function() {
  return gulp.src([
    './static/css/theme.css',
  ])
  .pipe(cssnano())
  .pipe(rename({suffix: '.min'}))
  .pipe(gulp.dest('./static/css/'));
});



//
// JavaSript minifier - merges and minifies the below given list of Front libraries into one theme.min.js
//
gulp.task('minJS', function() {
  return gulp.src([
    './static/js/main.js',
    './static/js/autocomplete.js',
    './static/js/custom-scrollbar.js',
    './static/js/sticky-sidebar.js',
    './static/js/header-fixing.js',
    './static/js/theme-custom.js'
  ])
  .pipe(concat('theme.min.js'))
  .pipe(uglify())
  .pipe(gulp.dest('./static/js/'));
});


//
// Image minifier - compresses images automatically
//

gulp.task('minIMG', function() {
  return gulp.src('./src/img-temp/**/*')
    .pipe(cache(imagemin([
      imagemin.gifsicle({interlaced: true}),
      imagemin.jpegtran({progressive: true}),
      imageminJpegRecompress({
        loops: 5,
        min: 65,
        max: 70,
        quality:'medium'
      }),
      imagemin.svgo(),
      imagemin.optipng({optimizationLevel: 3}),
      pngquant({quality: '65-70', speed: 5})
    ],{
      verbose: true
    })))
    .pipe(gulp.dest('./static/img-temp/'));
});


gulp.task('dist', ['minCSS', 'minJS', 'minIMG']);

(function() {
  'use strict';

  var gulp = require('gulp'),
    nodemon = require('gulp-nodemon'),
    watch = require('gulp-watch'),
    jshint = require('gulp-jshint'),
    livereload = require('gulp-livereload'),
    sass = require('gulp-sass'),
    stylish = require('jshint-stylish'),
    cssnano = require('gulp-cssnano'),
    rename = require('gulp-rename'),
    plumber = require('gulp-plumber'),
    pixrem = require('gulp-pixrem'),
    uglify = require('gulp-uglify'),
    htmlhint = require("gulp-htmlhint"),
    stream = require('event-stream'),
    concat = require('gulp-concat'),
    order = require("gulp-order"),
    inject = require('gulp-inject'),
    imagemin = require('gulp-imagemin'),
    clean = require('gulp-rimraf'),
    browserSync = require('browser-sync'),
    path = require('path'),
    url = require('url'),
    fs = require('fs');

  var paths = require( './build.config.js' );
  var jsApp = null,
      stylesApp = null;

  // removing files and folders.
  function cleanTask(directory) {
    return function() {
      return gulp.src(directory, {read: false})
        .pipe(clean());
    }
  }

  gulp.task('clean-sass', cleanTask(paths.deploy.css + "/styles.min.css"));
  gulp.task('clean-scripts', cleanTask(paths.deploy.scripts));
  gulp.task('clean-html', cleanTask(paths.deploy.templates));
  gulp.task('clean-vendor', cleanTask(paths.deploy.vendor));
  gulp.task('clean-assets', cleanTask([paths.deploy.fonts, paths.deploy.fonts]));
  gulp.task('clean-index', cleanTask(paths.deploy.index));

  gulp.task('clean', ['clean-vendor', 'clean-assets', 'clean-index' ]);

  //lint js files
  gulp.task('scripts', ['clean-scripts'], function() {
    jsApp = gulp.src(paths.app.scripts)
      .pipe(jshint())
      .pipe(jshint.reporter(stylish))
      .pipe(gulp.dest(paths.deploy.scripts));
  });

    //lint js files
  gulp.task('html', ['clean-html'], function() {
    gulp.src(paths.app.html)
      .pipe(htmlhint('.htmlhintrc'))
      .pipe(htmlhint.reporter("htmlhint-stylish"))
      .pipe(gulp.dest(paths.deploy.templates));
  });

  gulp.task('sass', ['clean-sass'],  function() {
    stylesApp = gulp.src(paths.app.sass + '/styles.scss')
      .pipe(sass().on('error', sass.logError))
      .pipe(plumber()) // Checks for errors
      .pipe(pixrem())  // add fallbacks for rem units
      .pipe(rename({ suffix: '.min' }))
      .pipe(cssnano()) // Minifies the result
      .pipe(gulp.dest(paths.deploy.css));
  });

  gulp.task('build', ['scripts', 'html', 'sass'], function() {
    // concat the all the vendor js to vendor.js

    var jsVendor = gulp.src(paths.vendor.js)
      .pipe(concat('vendor.js'))
      .pipe(gulp.dest(paths.deploy.vendor));

    // concat the all the vendor js to vendor.js
    var stylesVendor = gulp.src(paths.vendor.css)
      //.pipe(concat('vendor.js'))
      .pipe(gulp.dest(paths.deploy.css));

    var mapsVendor = gulp.src(paths.vendor.maps)
      .pipe(gulp.dest(paths.deploy.css));

    var mapsVendorJs = gulp.src(paths.vendor.mapsJs)
      .pipe(gulp.dest(paths.deploy.vendor));

    var fontsvendor = gulp.src(paths.vendor.fonts)
      .pipe(gulp.dest(paths.deploy.fonts));

    var fontsApp = gulp.src(paths.app.fonts)
      .pipe(gulp.dest(paths.deploy.fonts));

    var assetsApp = gulp.src(paths.app.assets)
      .pipe(imagemin())
      .pipe(gulp.dest(paths.deploy.assets));

    var all = stream.merge(jsVendor, jsApp, stylesVendor, stylesApp, mapsVendor)
      .pipe(order([
        '*vendor*',
        '*'
      ]));

    // inject the includes into index, write out to deploy directory
    gulp.src(paths.app.index)
      .pipe(inject(all, {ignorePath: paths.deploy.root}))
      .pipe(gulp.dest(paths.deploy.root));
  });

  gulp.task('bs-reload', function (done) {
    browserSync.reload();
    done();
  });

  gulp.task('browser-sync', ['build'], function () {
    var folder = path.resolve(__dirname, './build');
    var defaultFile = 'index.html';
    browserSync({
        server: {
            baseDir: "./build"
            
        },
        port: 8080,
        logConnections: true,
        logFileChanges: true,
        ghostMode: false,
        reloadDelay: 1000
    });

    gulp.watch(paths.app.scripts, ['scripts', 'bs-reload']);
    gulp.watch(paths.app.sass + '/*.scss', ['sass', 'bs-reload']);
    gulp.watch(paths.app.html, ['html', 'bs-reload']);
  });

  gulp.task('default', ['clean', 'browser-sync']);

}());

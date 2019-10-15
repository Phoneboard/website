"use strict";

// Load plugins
const autoprefixer = require("gulp-autoprefixer");
const browsersync = require("browser-sync").create();
const cleanCSS = require("gulp-clean-css");
const del = require("del");
const gulp = require("gulp");
const { series, parallel, src, dest } = require('gulp');
const header = require("gulp-header");
const merge = require("merge-stream");
const plumber = require("gulp-plumber");
const rename = require("gulp-rename");
const sass = require("gulp-sass");
const uglify = require("gulp-uglify");

// Load package.json for banner
const pkg = require('./package.json');

// Set the banner content
const banner = [
  //'/*!\n',
  //' * Start Bootstrap - <%= pkg.title %> v<%= pkg.version %> (<%= pkg.homepage %>)\n',
  //' * Copyright 2013-' + (new Date()).getFullYear(), ' <%= pkg.author %>\n',
  //' * Licensed under <%= pkg.license %> (https://github.com/BlackrockDigital/<%= pkg.name %>/blob/master/LICENSE)\n',
  //' */\n',*/
  //'\n'
].join('');

// BrowserSync
function browserSync(done) {
  browsersync.init({
    server: {
      baseDir: "./"
    },
    port: 3000
  });
  done();
}

// BrowserSync reload
function browserSyncReload(done) {
  browsersync.reload();
  done();
}

// Clean vendor
function clean() {
  return del(['./vendor/', './dist/']);
}

// Bring third party dependencies from node_modules into vendor directory
function modules() {
  // Bootstrap
  var bootstrap = src('./node_modules/bootstrap/dist/**/*')
    .pipe(dest('./vendor/bootstrap'));
  // Font Awesome
  var fontAwesome = src('./node_modules/@fortawesome/**/*')
    .pipe(dest('./vendor'));
  // jQuery Easing
  var jqueryEasing = src('./node_modules/jquery.easing/*.js')
    .pipe(dest('./vendor/jquery-easing'));
  // jQuery
  var jquery = src([
      './node_modules/jquery/dist/*',
      '!./node_modules/jquery/dist/core.js'
    ])
    .pipe(dest('./vendor/jquery'));
  // Simple Line Icons
  var simpleLineIconsFonts = src('./node_modules/simple-line-icons/fonts/**')
    .pipe(dest('./vendor/simple-line-icons/fonts'));
  var simpleLineIconsCSS = src('./node_modules/simple-line-icons/css/**')
    .pipe(dest('./vendor/simple-line-icons/css'));
  return merge(bootstrap, fontAwesome, jquery, jqueryEasing, simpleLineIconsFonts, simpleLineIconsCSS);
}

// CSS task
function css() {
  return gulp
    .src("./scss/**/*.scss")
    .pipe(plumber())
    .pipe(sass({
      outputStyle: "expanded",
      includePaths: "./node_modules",
    }))
    .on("error", sass.logError)
    .pipe(autoprefixer({
      browsers: ['last 2 versions'],
      cascade: false
    }))
    .pipe(header(banner, {
      pkg: pkg
    }))
    .pipe(dest("./css"))
    .pipe(rename({
      suffix: ".min"
    }))
    .pipe(cleanCSS())
    .pipe(dest("./css"))
    .pipe(browsersync.stream());
}

// JS task
function js() {
  return gulp
    .src([
      './js/*.js',
      '!./js/*.min.js'
    ])
    .pipe(uglify())
    .pipe(header(banner, {
      pkg: pkg
    }))
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(dest('./js'))
    .pipe(browsersync.stream());
}

const makeBundle = async() => {
  await clean();
  await modules();
  await css();
  await js();

  // jQuery Easing
  var jqueryEasing = src('./node_modules/jquery.easing/jquery.easing.min.js')
    .pipe(dest('./dist/js/'));

  var mainJS = src('./js/new-age.min.js')
    .pipe(dest('./dist/js/'));

  var mainCSS = src('./css/new-age.min.css')
    .pipe(dest('./dist/css/'));

  var html = src('./*.html')
    .pipe(dest('./dist/'));

  var img = src('./img/*')
    .pipe(dest('./dist/img/'));

  var other = src(['./CNAME', './ads.txt'])
    .pipe(dest('./dist/'));

  return merge(jqueryEasing, mainJS, mainCSS, html, img, other);
}

// Watch files
function watchFiles() {
  gulp.watch("./scss/**/*", css);
  gulp.watch("./js/**/*", js);
  gulp.watch("./**/*.html", browserSyncReload);
}

// Define complex tasks
const vendor = series(clean, modules);
const build = series(vendor, parallel(css, js));
const watch = series(build, parallel(watchFiles, browserSync));


// Export tasks
exports.css = css;
exports.js = js;
exports.clean = clean;
exports.vendor = vendor;
exports.build = build;
exports.watch = watch;
exports.bundle = makeBundle;
exports.default = build;

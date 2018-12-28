"use strict";

const gulp = require("gulp");
const sass = require("gulp-sass");
const browserSync = require("browser-sync").create();
const concat = require("gulp-concat");
const rev = require("gulp-rev");
const revRewrite = require("gulp-rev-rewrite");
const babel = require("gulp-babel");
const del = require("del");
const autoprefixer = require("gulp-autoprefixer");
const sourcemaps = require("gulp-sourcemaps");
const uglify = require("gulp-uglify");
const pump = require("pump");
const cleanCSS = require("gulp-clean-css");
const imagemin = require("gulp-imagemin");
const cache = require("gulp-cache");
sass.compiler = require("node-sass");

// style paths
var sass_src = "./src/sass/main.scss",
  sass_files = "./src/sass/*.scss",
  img_src = "./src/assets/**/",
  html_src = "./src/**/*.html",
  js_src = "./src/**/*.js",
  dist = "./dist",
  html_dest = "./dist/**/*.html",
  assets = "./dist/assets",
  build = "./dist/build/",
  temp = "./dist/build/temp/",
  js_temp = "./dist/build/temp/js",
  css_temp = "./dist/build/temp/css",
  jquery = "node_modules/jquery/dist/jquery.min.js",
  popperjs = "node_modules/popper.js/dist/umd/popper.min.js",
  bootstrap = "node_modules/bootstrap/dist/js/bootstrap.min.js";

// hashing task
gulp.task("hash", function() {
  return gulp
    .src([temp + "**/*.js", temp + "**/*.css"])
    .pipe(rev())
    .pipe(gulp.dest(dist))
    .pipe(rev.manifest())
    .pipe(gulp.dest(assets));
});

// cleaning dist folder
gulp.task(
  "clean-build",
  gulp.series("hash", done => {
    return del([build]);
    done();
  })
);

// inject hashed files to html
gulp.task(
  "update",
  gulp.series("clean-build", function(done) {
    const manifest = gulp.src(assets + "/rev-manifest.json");
    return gulp
      .src(html_dest)
      .pipe(revRewrite({ manifest }))
      .pipe(gulp.dest(dist));
    done();
  })
);

// Compile sass into CSS
gulp.task("build-sass", () => {
  return gulp
    .src(sass_src)
    .pipe(sourcemaps.init())
    .pipe(autoprefixer())
    .pipe(sass().on("error", sass.logError))
    .pipe(concat("style.css"))
    .pipe(sourcemaps.write())
    .pipe(cleanCSS({ compatibility: "ie8" }))
    .pipe(gulp.dest(css_temp))
    .pipe(browserSync.stream());
});

// bundle dependencies js
gulp.task("vendor-js", done => {
  return gulp
    .src([jquery, popperjs, bootstrap])
    .pipe(concat("vendor-bundle.js"))
    .pipe(gulp.dest(build));
  done();
});

// babel build task
gulp.task("build-js", () => {
  return gulp
    .src(js_src)
    .pipe(
      babel({
        presets: ["@babel/env"]
      })
    )
    .pipe(concat("main.js"))
    .pipe(gulp.dest(build));
});

// bundle all js
gulp.task(
  "bundle-js",
  gulp.series(gulp.parallel("vendor-js", "build-js"), done => {
    return gulp
      .src([build + "vendor-bundle.js", build + "main.js"])
      .pipe(sourcemaps.init())
      .pipe(concat("bundle.js"))
      .pipe(sourcemaps.write())
      .pipe(gulp.dest(js_temp));
    done();
  })
);

// uglifyJS
gulp.task(
  "compress-js",
  gulp.series("bundle-js", function(cb) {
    pump([gulp.src(temp + "**/*.js"), uglify(), gulp.dest(temp)], cb);
  })
);

// images optimising
gulp.task("optimise-img", () => {
  return gulp
    .src(img_src + "*.+(png|jpg|jpeg|gif|svg)")
    .pipe(
      cache(
        imagemin({
          interlaced: true
        })
      )
    )
    .pipe(gulp.dest(assets));
});

// html files build
gulp.task(
  "build-html",
  gulp.series(function(done) {
    return gulp.src(html_src).pipe(gulp.dest(dist));
    done();
  })
);

// build and minify
gulp.task(
  "build-compress",
  gulp.parallel("build-html", "build-sass", "compress-js", "optimise-img")
);

// build files
gulp.task(
  "build-all",
  gulp.parallel("build-html", "build-sass", "bundle-js", "optimise-img")
);

// clean previous build
gulp.task("clean", function(done) {
  return del([dist]);
  done();
});

// clean html files for update
gulp.task("clean-html", done => {
  del.sync([dist + "/*.html"]);
  done();
});

// delete assets except js and css files
gulp.task("delete-assets", () => {
  return del([assets + "/*", "!./dist/assets/rev-manifest.json"]);
});

// watching scss/js/html files
gulp.task("watch", function(done) {
  gulp.watch(sass_files, gulp.series("live-reload"));
  gulp.watch("./src/*.js", gulp.series("live-reload"));
  gulp.watch(html_src).on(
    "change",
    gulp.series(
      "clean-html",
      "build-html",
      "update",
      "delete-assets",
      "optimise-img",
      done => {
        browserSync.reload();
        done();
      }
    )
  );
  done();
});

// Static Server
gulp.task(
  "serve",
  gulp.parallel("watch", () => {
    browserSync.init({
      server: {
        baseDir: "./dist/"
      }
    });
  })
);

// live reloading
gulp.task(
  "live-reload",
  gulp.series("clean", "build-all", "update", function(done) {
    browserSync.reload();
    done();
  })
);

// build and serve
gulp.task("default", gulp.series("clean", "build-all", "update", "serve"));

// build for production
gulp.task("build", gulp.series("clean", "build-compress", "update"));

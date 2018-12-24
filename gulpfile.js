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

// style paths
var sass_src = "./app/sass/*.scss",
  img_src = "./app/assets/**/",
  js_src = "./app/*.js",
  html_src = "./app/*.html",
  assets = "./build/assets",
  dist = "./build/dist/",
  build = "./build",
  jquery = "node_modules/jquery/dist/jquery.min.js",
  popperjs = "node_modules/popper.js/dist/umd/popper.min.js",
  bootstrap = "node_modules/bootstrap/dist/js/bootstrap.min.js",
  js_dest = "./build/dist/js/",
  img_dest = "./build/assets";

// hashing task
gulp.task("hash", function() {
  return gulp
    .src([js_dest + "*.js", dist + "*.css"])
    .pipe(rev())
    .pipe(gulp.dest(assets))
    .pipe(rev.manifest())
    .pipe(gulp.dest(build));
});

// cleaning dist folder
gulp.task(
  "clean-dist",
  gulp.series("hash", done => {
    del([dist]);
    done();
  })
);

// inject hashed files to html
gulp.task(
  "hash-inject",
  gulp.series("clean-dist", function(done) {
    const manifest = gulp.src("./build/rev-manifest.json");
    return gulp
      .src("./build/*.html")
      .pipe(revRewrite({ manifest }))
      .pipe(gulp.dest(build));
    done();
  })
);

// Compile sass into CSS
gulp.task("build-sass", () => {
  return gulp
    .src(sass_src)
    .pipe(sourcemaps.init())
    .pipe(autoprefixer())
    .pipe(sass())
    .pipe(concat("style.css"))
    .pipe(sourcemaps.write())
    .pipe(cleanCSS({ compatibility: "ie8" }))
    .pipe(gulp.dest(dist))
    .pipe(browserSync.stream());
});

// bundle dependencies js
gulp.task("vendor-js", done => {
  return gulp
    .src([jquery, popperjs, bootstrap])
    .pipe(concat("vendor-bundle.js"))
    .pipe(gulp.dest(dist));
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
    .pipe(gulp.dest(dist));
});

// bundle all js
gulp.task(
  "bundle-js",
  gulp.series(gulp.parallel("vendor-js", "build-js"), done => {
    return gulp
      .src([dist + "vendor-bundle.js", dist + "main.js"])
      .pipe(concat("bundle.js"))
      .pipe(gulp.dest(js_dest));
    done();
  })
);

// uglifyJS
gulp.task(
  "compress-js",
  gulp.series("bundle-js", function(cb) {
    pump([gulp.src(js_dest + "*.js"), uglify(), gulp.dest(js_dest)], cb);
  })
);

// images optimising
gulp.task("optimise-img", () => {
  return gulp
    .src(img_src + "*.+(png|jpg|jpeg|gif|svg)")
    .pipe(imagemin({
      // Setting interlaced to true
      interlaced: true
    }))
    .pipe(gulp.dest(img_dest));
});

// html files build
gulp.task(
  "build-html",
  gulp.series(function(done) {
    gulp.src(html_src).pipe(gulp.dest("./build"));
    done();
  })
);

// build and minify
gulp.task(
  "build-compress",
  gulp.parallel("build-html", "build-sass", "optimise-img", "compress-js")
);

// build files
gulp.task(
  "build-all",
  gulp.parallel("build-html", "build-sass", "optimise-img", "bundle-js")
);

// hashing and update links
gulp.task("update", gulp.series("hash-inject"));

// clean previous build
gulp.task("clean", function(done) {
  del.sync([build]);
  done();
});

// watching scss/js/html files
gulp.task("watch", function() {
  gulp.watch(sass_src, gulp.series("live-reload"));
  gulp.watch("./app/*.js", gulp.series("live-reload"));
  gulp.watch(html_src).on("change", gulp.series("live-reload"));
});

// Static Server
gulp.task(
  "serve",
  gulp.parallel("watch", () => {
    browserSync.init({
      server: {
        baseDir: "./build/"
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
gulp.task("start", gulp.series("clean", "build-all", "update", "serve"));

// build for production
gulp.task("build", gulp.series("clean", "build-compress", "update"));

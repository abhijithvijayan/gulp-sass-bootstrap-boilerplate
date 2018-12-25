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
var sass_src = "./src/sass/*.scss",
  img_src = "./src/assets/**/",
  js_src = "./src/*.js",
  html_src = "./src/*.html",
  assets = "./dist/assets",
  build = "./dist/build/",
  dist = "./dist",
  jquery = "node_modules/jquery/dist/jquery.min.js",
  popperjs = "node_modules/popper.js/dist/umd/popper.min.js",
  bootstrap = "node_modules/bootstrap/dist/js/bootstrap.min.js",
  js_dest = "./dist/build/js/",
  img_dest = "./dist/assets";

// hashing task
gulp.task("hash", function() {
  return gulp
    .src([js_dest + "*.js", build + "*.css"])
    .pipe(rev())
    .pipe(gulp.dest(assets))
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
      .src("./dist/*.html")
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
    .pipe(sass())
    .pipe(concat("style.css"))
    .pipe(sourcemaps.write())
    .pipe(cleanCSS({ compatibility: "ie8" }))
    .pipe(gulp.dest(build))
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
    .pipe(
      imagemin({
        // Setting interlaced to true
        interlaced: true
      })
    )
    .pipe(gulp.dest(img_dest));
});

// html files build
gulp.task(
  "build-html",
  gulp.series(function(done) {
    return gulp.src(html_src).pipe(gulp.dest("./dist"));
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
  return del([
    assets + "/*.+(png|jpg|jpeg|gif|svg)",
    "!./dist/assets/*.js",
    "!./dist/assets/*.css"
  ]);
});

// watching scss/js/html files
gulp.task("watch", function(done) {
  gulp.watch(sass_src, gulp.series("live-reload"));
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

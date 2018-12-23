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

//style paths
var sassDir = "./app/sass/*.scss",
  jsDir = "./app/*.js",
  htmlDir = "./app/*.html",
  assets = "./build/assets",
  dist = "./build/dist/",
  build = "./build",
  popperjs = "node_modules/popper.js/dist/popper.js",
  jquery = "node_modules/jquery/dist/jquery.js",
  bootstrap = "node_modules/bootstrap/dist/js/bootstrap.js";

// hashing task
gulp.task("hash", function() {
  return gulp
    // .src([cssDest + "/*.css", jsDest + "/*.js"], { base: "./build/assets" })
    .src([dist + "/*.js", dist + "/*.css"])
    .pipe(rev())
    .pipe(gulp.dest(assets)) // write rev'd assets to build dir
    .pipe(rev.manifest())
    .pipe(gulp.dest(build)); // write manifest to build dir

});

gulp.task("clean-dist", gulp.series("hash", (done) => {
    del([dist]);
    done();
}));

// inject hashed files to html
gulp.task(
  "hash-inject",
  gulp.series("clean-dist", function(done) {
    const manifest = gulp.src("./build/rev-manifest.json");
    return (
      gulp
        .src("./build/*.html")
        // replacing links
        .pipe(revRewrite({ manifest }))
        .pipe(gulp.dest(build))
    );
    done();
  })
);

// Compile sass into CSS
gulp.task("build-sass", () => {
  return gulp
    .src(sassDir)
    .pipe(sourcemaps.init())
    .pipe(autoprefixer())
    .pipe(sass())
    .pipe(concat("style.min.css"))
    .pipe(sourcemaps.write())
    .pipe(cleanCSS({ compatibility: "ie8" }))
    .pipe(gulp.dest(dist))
    .pipe(browserSync.stream());
});

// babel build task
gulp.task("build-js", () => {
  return gulp
    .src([jquery, popperjs, bootstrap, jsDir])
    .pipe(
      babel({
        presets: ["@babel/env"]
      })
    )
    .pipe(concat("bundle.js"))
    .pipe(gulp.dest(dist)); // Write the renamed file
});

// uglifyJS
gulp.task(
  "compress-js",
  gulp.series("build-js", function(cb) {
    pump([gulp.src(dist + "/*.js"), uglify(), gulp.dest(dist)], cb);
  })
);

// html files build
gulp.task(
  "build-html",
  gulp.series(function(done) {
    // copy html files to build dir
    gulp.src(htmlDir).pipe(gulp.dest("./build"));
    done();
  })
);

// build task
gulp.task("build-all", gulp.parallel("build-html", "build-sass", "compress-js"));

// hashing and update links
gulp.task("update", gulp.series("hash-inject"));

// clean previous build
gulp.task("clean", function(done) {
  del.sync(["./build/**"]);
  done();
});

// watching scss/js/html files
gulp.task("watch", function() {
  // watch functions (to be corrected)
  gulp.watch(sassDir, gulp.series("live-reload"));
  gulp.watch("./app/*.js", gulp.series("live-reload"));
  gulp.watch(htmlDir).on("change", gulp.series("live-reload"));
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

// default task
gulp.task("default", gulp.series("clean", "build-all", "update", "serve"));

// build for production
gulp.task("build", gulp.series("clean", "build-all", "update"));
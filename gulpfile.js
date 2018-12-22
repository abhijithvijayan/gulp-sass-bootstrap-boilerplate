const gulp = require("gulp");
const sass = require("gulp-sass");
const browserSync = require("browser-sync").create();
const concat = require("gulp-concat");
const rev = require("gulp-rev");
const revRewrite = require("gulp-rev-rewrite");
const babel = require("gulp-babel");
const del = require('del');
const sourcemaps = require("gulp-sourcemaps");
const autoprefixer = require("gulp-autoprefixer");

//style paths
var sassDir = "./app/sass/*.scss",
  jsDir = "./app/*.js",
  htmlDir = "./app/*.html",
  cssDest = "./build/assets/css",
  jsDest = "./build/assets/js",
  assets = "./build/assets";

// hashing task
gulp.task("rev", function() {
  return (
    gulp
      .src([cssDest + "/*.css", jsDest + "/*.js"], { base: "./build/assets" })
      .pipe(rev())
      .pipe(gulp.dest(assets)) // write rev'd assets to build dir
      .pipe(rev.manifest())
      .pipe(gulp.dest("./build")) // write manifest to build dir
  );
});

gulp.task(
  "rev-rewrite",
  gulp.series("rev", function(done) {
    const manifest = gulp.src("./build/rev-manifest.json");
    gulp
      .src("./build/*.html")
      // replacing links
      .pipe(revRewrite({ manifest }))
      .pipe(gulp.dest("./build"));

    done();
  })
);

// Compile sass into CSS & auto-inject into browsers
gulp.task("sass", () => {
  return (
    gulp
      .src(sassDir)
      .pipe(sourcemaps.init())
      .pipe(autoprefixer())
      .pipe(sass())
      .pipe(concat("style.min.css"))
      .pipe(sourcemaps.write())
      .pipe(gulp.dest(cssDest))
      .pipe(browserSync.stream())
  );
});

// babel build task
gulp.task("js", () => {

  return gulp
    .src(jsDir)
    .pipe(
      babel({
        presets: ["@babel/env"]
      })
    )
    .pipe(concat("bundle.js"))
    .pipe(gulp.dest(jsDest)); // Write the renamed files
});

gulp.task(
  "html",
  gulp.series(function(done) {
    // copy html files to build dir
    gulp.src(htmlDir).pipe(gulp.dest("./build"));
    done();
  })
);

// clean previous build
gulp.task('clean', function(done) {
   del.sync(['./build/**']);
   done();
});

// watching js/scss/html files
gulp.task("watch", function() {
    // watch functions (to be corrected)
    gulp.watch(sassDir, gulp.series("default"));
    gulp.watch("./app/main.js", gulp.series("js"));
    gulp.watch(htmlDir).on("change", browserSync.reload);
});

// Static Server
gulp.task("serve", gulp.parallel("watch", () => {
  browserSync.init({
    server: {
      baseDir: "./build/"
    }
  });
}));

gulp.task("build", gulp.parallel("html", "sass", "js"));

gulp.task("update", gulp.series("rev-rewrite"));

// default task
gulp.task(
  "default",
  gulp.series("clean", "build", "update", "serve")
);

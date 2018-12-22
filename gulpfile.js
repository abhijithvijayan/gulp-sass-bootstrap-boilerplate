const gulp = require("gulp");
const sass = require("gulp-sass");
const browserSync = require("browser-sync").create();
const concat = require("gulp-concat");
const clean = require("gulp-clean");
const rev = require("gulp-rev");
const revRewrite = require("gulp-rev-rewrite");
const babel = require('gulp-babel');

//style paths
var sassDir = "./app/sass/*.scss",
  jsDir = "./app/*.js",
  htmlDir = "./app/*.html",
  cssDest = "./build/assets/css",
  jsDest = "./build/assets/js",
  assets = "./build/assets";

// function hash_reference() {
gulp.task(
  "rev",
  gulp.series(function(done) {
    gulp
      .src([cssDest + "/*.css", jsDest + "/*.js"], { base: "./build/assets" })
      // hashing
      .pipe(rev())
      .pipe(gulp.dest(assets)) // write rev'd assets to build dir
      .pipe(rev.manifest())
      .pipe(gulp.dest("./build")); // write manifest to build dir

    //   manifester();
    // cleanFiles('./build/assets')
    done();
  })
);

gulp.task(
  "rev-rewrite", gulp.series(function(done) {
    const manifest = gulp.src("./build/rev-manifest.json");
    gulp
      .src("./build/*.html")
      // replacing links
      .pipe(revRewrite({ manifest }))
      .pipe(gulp.dest("./build"));

    done();
  })
);

// deleting compiled files
function cleanFiles(loc) {
  return gulp.src(loc, { read: false }).pipe(clean());
}

// Compile sass into CSS & auto-inject into browsers
gulp.task("sass", () => {
  // cleaning build files
  cleanFiles(cssDest + "/*");

  return (
    gulp
      .src(sassDir)
      .pipe(sass())
      .pipe(concat("style.min.css"))

      //   .pipe(rev())
      .pipe(gulp.dest(cssDest))

      .pipe(browserSync.stream())
  );
});

gulp.task("js", () => {
  // clean js build files
  cleanFiles(jsDest + "/*");

  return (
    gulp
      .src(jsDir)
      .pipe(babel({
        presets: ['@babel/env']
       }))
      .pipe(concat("bundle.js"))
      // .pipe(rev())  // Add hashes to the files' names
      .pipe(gulp.dest(jsDest)) // Write the renamed files
  );
});


gulp.task("html", gulp.series(function(done) {
      // copy html files to build dir
    gulp.src(htmlDir)
        .pipe(gulp.dest("./build"));
    done();
}));

// Static Server + watching scss/html files
gulp.task("serve", () => {

  // hashing
  //   hash_reference();

  browserSync.init({
    server: {
      baseDir: "./build/"
    }
  });

  // watch functions
  gulp.watch(sassDir, gulp.series("sass"));
  gulp.watch("./app/main.js", gulp.series("js"));
  gulp.watch(htmlDir).on("change", browserSync.reload);
});

// default task
gulp.task("default", gulp.series(gulp.parallel("sass", "js"), "serve"));

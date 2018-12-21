const gulp = require("gulp");
const sass = require("gulp-sass");
const browserSync = require("browser-sync").create();
const concat = require("gulp-concat");
const clean = require("gulp-clean");
const rev = require("gulp-rev");
const revRewrite = require("gulp-rev-rewrite");

//style paths
var sassFiles = "./app/sass/*.scss",
    jsFileSrc = "./app/main.js",
    htmlFiles = "./app/*.html",
    cssDest = "./dist/assets/css/",
    jsDest = "./dist/assets/js";

function hash_reference() {

  gulp
    .src([cssDest + "/*.css", jsDest + "/*.js"], { base: "assets" })
    // hashing
    .pipe(rev())
    .pipe(gulp.dest("assets")) // write rev'd assets to build dir
    .pipe(rev.manifest())
    .pipe(gulp.dest("./dist")); // write manifest to build dir

  var manifester = () => {
    const manifest = gulp.src("./dist/rev-manifest.json");
    gulp
      .src("./dist/*.html")
      // replacing links
      .pipe(revRewrite({ manifest }))
      .pipe(gulp.dest("./dist"));
  };
  manifester();
   // cleanFiles('./dist/assets')
}

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
      .src(sassFiles)
      .pipe(sass())
      .pipe(concat("style.css"))

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
      .src(jsFileSrc)
      .pipe(concat("bundle.js"))
      // .pipe(rev())  // Add hashes to the files' names
      .pipe(gulp.dest(jsDest)) // Write the renamed files
  );
});

// Static Server + watching scss/html files
gulp.task("serve", () => {
  // copy html files to build dir
  gulp.src(htmlFiles).pipe(gulp.dest("./dist"));
  // hashing
  hash_reference();

  browserSync.init({
    server: {
      baseDir: "./dist/"
    }
  });

  // watch functions
  gulp.watch(sassFiles, gulp.series("sass"));
  gulp.watch("./app/main.js", gulp.series("js"));
  gulp.watch(htmlFiles).on("change", browserSync.reload);
});

// default task
gulp.task(
  "default",
  gulp.series(gulp.parallel("sass", "js"), "serve"), () => {}
);

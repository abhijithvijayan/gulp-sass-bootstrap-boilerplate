const gulp = require("gulp");
const sass = require("gulp-sass");
const browserSync = require("browser-sync").create();
const autoprefixer = require("gulp-autoprefixer");
const sourcemaps = require("gulp-sourcemaps");
const concat = require("gulp-concat");
const cleanCSS = require("gulp-clean-css");
const clean = require("gulp-clean");
const filter = require("gulp-filter");
const rev = require("gulp-rev");
const revRewrite = require("gulp-rev-rewrite");

function hash_reference() {

  gulp
    .src([cssDest + "/*.css", jsDest + "/*.js"], { base: "assets" })
    .pipe(rev())
    .pipe(gulp.dest('assets'))  // write rev'd assets to build dir
    .pipe(rev.manifest())
    .pipe(gulp.dest('./dist'))  // write manifest to build dir

    
    var manifester = () => {
    const manifest = gulp.src('./dist/rev-manifest.json');
    gulp
        .src('./dist/*.html')
        // .src(['./dist/*.html'], { base: "assets" })
        .pipe(revRewrite({ manifest }))
        .pipe(gulp.dest('./dist'));
    }
    manifester();
//   // cleanFiles('./dist/assets')
}


//style paths
var sassFiles = "./app/sass/*.scss",
  cssDest = "./dist/assets/css/",
  htmlFiles = "./app/*.html",
  jsDest = "./dist/assets/js";

// deleting compiled files
function cleanFiles(loc) {
  return gulp.src(loc, { read: false }).pipe(clean());
}

gulp.task("js", () => {
  cleanFiles(jsDest + "/*");
  return (
    gulp
      .src("./app/main.js")
      .pipe(concat("bundle.js"))
      // .pipe(rev())  // Add hashes to the files' names
      .pipe(gulp.dest(jsDest)) // Write the renamed files
  );
});

// Compile sass into CSS & auto-inject into browsers
gulp.task("sass", () => {
  cleanFiles(cssDest + "/*");
  return (
    gulp
      .src(sassFiles)
      .pipe(sourcemaps.init())
      .pipe(autoprefixer())
      .pipe(sass())
      .pipe(concat("style.css"))
      .pipe(cleanCSS())
      .pipe(sourcemaps.write())

      //   .pipe(rev())
      .pipe(gulp.dest(cssDest))

      .pipe(browserSync.stream())
  );
});

// Static Server + watching scss/html files
gulp.task("serve", () => {
  // copy html files
  gulp
    .src(htmlFiles)
    .pipe(gulp.dest("./dist"));
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
  gulp.series(gulp.parallel("sass", "js"), "serve"),
  () => {}
);

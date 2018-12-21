const gulp = require("gulp");
const sass = require("gulp-sass");
const browserSync = require("browser-sync").create();
const autoprefixer = require("gulp-autoprefixer");
const sourcemaps = require("gulp-sourcemaps");
const concat = require("gulp-concat");
const cleanCSS = require("gulp-clean-css");
const hash = require("gulp-hash");
const clean = require("gulp-clean");

//style paths
var sassFiles = "./app/sass/*.scss",
  cssDest = "./dist/assets/css/",
  htmlFiles = "./dist/*.html",
  jsFiles = "./dist/assets/js";

function cleanFiles(loc) {
    return gulp.src(loc, { read: false })
        .pipe(clean());
}

gulp.task("js", () => {
  cleanFiles(jsFiles + '/*');
  return ( 
    gulp
    .src("./app/main.js")
    .pipe(hash()) // Add hashes to the files' names
    .pipe(gulp.dest(jsFiles)) // Write the renamed files
    .pipe(
      hash.manifest("./dist/assets/js-manifest.json", {
        deleteOld: true,
        sourceDir: __dirname + jsFiles
      })
    )
    // writes the manifest file
    .pipe(gulp.dest("."))
  );
});

// Compile sass into CSS & auto-inject into browsers
gulp.task("sass", () => {
  cleanFiles(cssDest + '/*');
  return (
    gulp
      .src(sassFiles)
      .pipe(sourcemaps.init())
      .pipe(autoprefixer())
      .pipe(sass())
      .pipe(concat("style.css"))
      .pipe(cleanCSS())
      .pipe(sourcemaps.write())

      .pipe(hash())
      .pipe(gulp.dest(cssDest))
      .pipe(
        hash.manifest("./dist/assets/css-manifest.json", {
          // Generate the manifest file
          deleteOld: true,
          sourceDir: __dirname + cssDest
        })
      )
      // writes the manifest file
      .pipe(gulp.dest("."))

      .pipe(browserSync.stream())
  );
});

// Static Server + watching scss/html files
gulp.task("serve", () => {
  browserSync.init({
    server: {
      baseDir: "./app/"
    }
  });
  // watch functions
  gulp.watch(sassFiles, gulp.series("sass"));
  gulp.watch('./app/main.js', gulp.series("js"));
  gulp.watch(htmlFiles).on("change", browserSync.reload);
});

gulp.task(
  "default",
  gulp.series(gulp.parallel("sass", "js"), "serve"), () => {});

const gulp = require("gulp");
const sass = require("gulp-sass");
const browserSync = require("browser-sync").create();
const autoprefixer = require('gulp-autoprefixer');
const sourcemaps = require('gulp-sourcemaps');
const concat = require("gulp-concat");
const cleanCSS = require('gulp-clean-css')

//style paths
var sassFiles = "assets/styles/*.scss",
  cssDest = "assets/styles/",
  htmlFiles = "*.html";

// Compile sass into CSS & auto-inject into browsers
gulp.task("sass", () => {
  return gulp
    .src(sassFiles)
    .pipe(sourcemaps.init())
    .pipe(autoprefixer())
    .pipe(sass())
    .pipe(concat('styles.css'))
    .pipe(cleanCSS())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(cssDest))
    .pipe(browserSync.stream());
});

// Static Server + watching scss/html files
gulp.task("serve", () => {
    browserSync.init({
        server: {
            baseDir: "./"
        }
    });

  gulp.watch(sassFiles, gulp.series("sass"));
  gulp.watch(htmlFiles).on("change", browserSync.reload);
});

gulp.task(
  "default", gulp.series(gulp.parallel("sass", "serve"), () => {})
);

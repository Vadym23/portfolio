// Connect modules
const gulp = require('gulp');
const concat = require('gulp-concat');
const autoprefixer = require('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css');
const uglify = require('gulp-uglify');
const del = require('del');
const browserSync = require('browser-sync').create();
const htmlmin = require('gulp-htmlmin');
const imagemin = require('gulp-imagemin');
const ghPages = require('gulp-gh-pages');
// const pug = require('gulp-pug');

// const htmlFiles = [
//     './src/html/pages/index.html',
//     './src/html/pages/footer.html'
// ];

const cssFiles = [
    './node_modules/normalize.css/normalize.css',
    './src/css/style.css',
    './src/css/animate.css'
];

const jsFiles = [
    './src/js/wow.min.js'
];

// function pug () {
//     return gulp.src(htmlFiles)
//         .pipe(concat('all.html'))
//         .pipe(gulp.dest('./build/html'))
//         .pipe(browserSync.stream());   
// }

function htmls() {
    return gulp.src('src/*.html')
        .pipe(htmlmin({
             collapseWhitespace: true 
            }))
        .pipe(gulp.dest('build'));
}

function styles() {
    return gulp.src(cssFiles)
    // './src/css/**/*.css'
        .pipe(concat('bundle.css'))
        .pipe(autoprefixer({
            overrideBrowserslist: ['> 0.1%'],
            cascade: false
        }))
        .pipe(cleanCSS({
            level: 2
        }))
        .pipe(gulp.dest('./build/css'))
        .pipe(browserSync.stream());
}

function scripts() {
    return gulp.src(jsFiles)
        .pipe(concat('bundle.js'))
         .pipe(uglify({
             toplevel: true
         }))
        .pipe(gulp.dest('./build/js'))
        .pipe(browserSync.stream());
}

function imgs() { 
    return gulp.src('src/img/*')
        .pipe(imagemin())
        .pipe(gulp.dest('build/img'))
        .pipe(browserSync.stream());
}

function gh() {
    return gulp.src('./dist/**/*')
      .pipe(ghPages());
  }

function watch() {
    browserSync.init({
        server: {
            baseDir: "./build/"
        }
    });

    gulp.watch('./src/css/**/*.css', styles);
    gulp.watch('./src/js/**/*.js', scripts);
    gulp.watch('./src/img/**/*.png', imgs);
    gulp.watch("./*.html", browserSync.reload);
    // {jpg, jpeg, png, gif, ico}
}

function clean () {
    return del(['build/*'])
}

gulp.task('htmls', htmls);
gulp.task('styles', styles);
gulp.task('scripts', scripts);
gulp.task('imgs', imgs);
gulp.task('watch', watch);
gulp.task('clean', clean);
gulp.task('gh', gh);

gulp.task('build', gulp.series(clean,
        gulp.parallel(htmls, styles, scripts, imgs)
    ));
gulp.task('dev', gulp.series('build', 'watch'));

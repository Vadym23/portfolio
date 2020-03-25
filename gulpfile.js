// Connect modules
const gulp = require('gulp');
const concat = require('gulp-concat');

const htmlmin = require('gulp-htmlmin');
const cleanCSS = require('gulp-clean-css');
const uglify = require('gulp-uglify');
const tinypng = require('gulp-tinypng-compress');

const autoprefixer = require('gulp-autoprefixer');
const del = require('del');
const browserSync = require('browser-sync').create();

const ghPages = require('gh-pages');
const path = require('path');

// const ghPages = require('gulp-gh-pages');
// const pug = require('gulp-pug');

// const htmlFiles = [
//     './src/html/pages/index.html',
//     './src/html/pages/footer.html'
// ];

// CSS File list
const cssFiles = [
    './node_modules/normalize.css/normalize.css',
    './src/css/style.css',
    './src/css/animate.css'
];

// JS File list
const jsFiles = [
    './src/js/wow.min.js'
];

// function pug () {
//     return gulp.src(htmlFiles)
//         .pipe(concat('all.html'))
//         .pipe(gulp.dest('./build/html'))
//         .pipe(browserSync.stream());   
// }

// Gulp functions
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
    return gulp.src('src/img/*.{png,jpg,jpeg}')
        .pipe(tinypng({
            key: 'WTrTPN36fpBhrcGJ7Cd3vmsWGYh6lB7Z',
            sigFile: 'images/.tinypng-sigs',
            log: true
        }))
        .pipe(gulp.dest('build/img'))
        .pipe(browserSync.stream());
}

function deploy(cb) {
    ghPages.publish(path.join(process.cwd(), './build'), cb);
  }

function clean () {
    return del(['build/*'])
}

// function gh() {
//     return gulp.src('./build/**/*')
//       .pipe(ghPages());
//   }

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
}


// Gulp tasks
gulp.task('htmls', htmls);
gulp.task('styles', styles);
gulp.task('scripts', scripts);
gulp.task('imgs', imgs);
gulp.task('watch', watch);
gulp.task('clean', clean);
gulp.task('deploy', deploy);
// gulp.task('gh', gh);

gulp.task('build', gulp.series(clean,
        gulp.parallel(htmls, styles, scripts, imgs)
    ));
gulp.task('dev', gulp.series('build', 'watch'));

var gulp = require('gulp'),
    gutil = require('gulp-util'),
    browserify = require('gulp-browserify'),
    reactify = require('reactify'),
    uglify = require('gulp-uglify'),
    compass = require('gulp-compass'),
    autoprefixer = require('gulp-autoprefixer'),
    connect = require('gulp-connect'),
    csso = require('gulp-csso');

var paths = {
    js: 'js/*.js',
    sass: 'sass/*.scss'
};

gulp.task('browserify', function(){
    gulp.src('js/main.js')
        .pipe(browserify())
        .pipe(uglify())
        .pipe(gulp.dest('./build/js'));
});

gulp.task('sass', function(){
    gulp.src(paths.sass)
        .pipe(compass({
            config_file: './config.rb',
            css: './css'
        }).on('error', gutil.beep))
        .pipe(autoprefixer(['last 2 versions']))
        .pipe(csso())
        .pipe(gulp.dest('./css'))
        .pipe(connect.reload());
});

gulp.task('html', function(){
    gulp.src('*.html')
        .pipe(connect.reload());
});

gulp.task('watch', function(){
    gulp.watch(paths.js, ['browserify']);
    gulp.watch(paths.sass, ['sass']);
    gulp.watch('*.html', ['html']);
});

gulp.task('connect', function(){
    connect.server({
        livereload: true,
        port: 8400
    });
});

gulp.task('default', ['connect', 'watch']);
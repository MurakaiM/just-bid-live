const gulp = require('gulp');
const minify = require('gulp-minify');
const gzip = require('gulp-gzip');
const uglify = require('gulp-uglify-es').default;
const purify = require('gulp-purifycss');
const csso = require('gulp-csso');
const babel = require('gulp-babel');


gulp.task('compress-js', function() { 
    gulp.src('./Resources/dev/**/*.js')
    .pipe(babel({
        "presets": [ "es2015", "stage-0" ]
    }))
    .pipe(uglify())    
    .pipe(gulp.dest('./Resources/prod'));
})

gulp.task('compress-css', function() { 
    gulp.src('./Resources/dev/**/*.css')
    .pipe(csso())    
    .pipe(gulp.dest('./Resources/prod'));
})



gulp.task('purifycss', function(){
    gulp.src('./Resources/**/*.css')
    .pipe(purify(['./Resources/**/*.js', './Views/**/*.ejs']))  
    .pipe(gulp.dest('./Compressed'));
})
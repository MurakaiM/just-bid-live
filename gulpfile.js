const gulp = require('gulp');
const minify = require('gulp-minify');
const gzip = require('gulp-gzip');
const uglify = require('gulp-uglify-es').default;
const purify = require('gulp-purifycss');
const csso = require('gulp-csso');


gulp.task('compressjs', function() { 
    gulp.src('./Resources/**/*.js')
    .pipe(uglify())    
    .pipe(gulp.dest('./Compressed'));
})

gulp.task('purifycss', function(){
    gulp.src('./Resources/**/*.css')
    .pipe(purify(['./public/app/**/*.js', './public/**/*.html']))  
    .pipe(gulp.dest('./Compressed'));
})
const gulp = require('gulp');
const minify = require('gulp-minify');
const gzip = require('gulp-gzip');
const uglify = require('gulp-uglify-es').default;
const purify = require('gulp-purifycss');
const csso = require('gulp-csso');
const babel = require('gulp-babel');


gulp.task('compressjs', function() { 
    gulp.src('./Resources/**/*.js')
    .pipe(babel({
        presets: ['env']
    }))
    .pipe(uglify())    
    .pipe(gulp.dest('./Compressed'));
})

gulp.task('compresscss', function() { 
    gulp.src('./Resources/**/*.css')
    .pipe(csso())    
    .pipe(gulp.dest('./Compressed'));
})



gulp.task('purifycss', function(){
    gulp.src('./Resources/**/*.css')
    .pipe(purify(['./Resources/**/*.js', './Views/**/*.ejs']))  
    .pipe(gulp.dest('./Compressed'));
})
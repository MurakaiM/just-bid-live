const gulp = require('gulp');
const minify = require('gulp-minify');
const gzip = require('gulp-gzip');
const uglify = require('gulp-uglify-es').default;


gulp.task('compressjs', function() { 
    gulp.src('./Resources/**/*.js')
    .pipe(uglify())    
    .pipe(gulp.dest('./Resources/ZCompressed'));
});

gulp.task('compresscss', function() {
    gulp.src('./Resources/**/*.js')
    .pipe(uglify())   
    .pipe(gulp.dest('./Resources/ZCompressed'));
});
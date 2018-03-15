var gulp = require('gulp');
var sass = require('gulp-sass');
var browserSync = require('browser-sync').create();
var autopref = require( 'gulp-autoprefixer' );
var babel = require('gulp-babel');


gulp.task( 'sass', function() {
	return gulp.src("src/sass/*.sass")
		.pipe(sass())
		.pipe(autopref({
			browsers: ['last 2 versions'],
			cascade: false
			}))
		.pipe(gulp.dest("public/css"))
		.pipe(browserSync.stream());
});

gulp.task( 'js', function() {
	return gulp.src( 'src/js/*.js' )
		.pipe(babel({
			presets: ['@babel/env']
		}))
		.pipe(gulp.dest('public/scripts'))
		.pipe(browserSync.stream());
});


gulp.task( 'browser-sync', function() {
	browserSync.init({
		server: {
			baseDir: "./public"
		}
	});

});

gulp.task( 'default', [ 'sass', 'js', 'browser-sync' ], function() {
	gulp.watch("src/sass/*.sass", ['sass']);
	gulp.watch("src/js/*.js", ['js']);
	gulp.watch("public/*.html").on('change', browserSync.reload);
});
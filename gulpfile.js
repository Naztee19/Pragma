
'use strict';

//---------------------
//Plugins
//---------------------

var gulp = require('gulp'),
	sass = require('gulp-sass'),
	uglify = require('gulp-uglify'),
	uglifycss = require('gulp-uglifycss'),
	plumber = require('gulp-plumber'),
	sourcemaps = require('gulp-sourcemaps'),
	notify = require('gulp-notify'),
	prefix = require('gulp-autoprefixer'),
	merge = require('merge-stream'),
	browserSync = require('browser-sync').create(),
	chalk = require('chalk'),
	imagemin = require('gulp-imagemin'),
	modifyCssUrls = require('gulp-modify-css-urls');

//---------------------
//Settings
//---------------------

var src = {
	sass: "./app/src/assets/scss/**/*.scss",
	sassCompile2Dir: "./app/src/assets/css",
	css: "./app/src/assets/css/**/*.css",
	cssExclMin: "!./app/src/assets/css/min{,/**/*}",
	jsDir: "./app/src/assets/js",
	js: "./app/src/assets/js/**/*.js",
	jsExclMin: "!./app/src/assets/js/min{,/**/*}",
	imgsDir: "./app/src/assets/images",
	imgs: "./app/src/assets/images/**/*",
	imgsExclMin: "!./app/src/assets/images/min{,/**/*}",
	views: "./app/src/**/*.html"
};

var dest = {
	css: "./app/dist/assets/css/**/*.css",
	cssDir: "./app/dist/assets/css/",
	cssMinDir: "./app/dist/assets/css/min/",
	cssExclMin: "!./app/dist/assets/css/min{,/**/*}",
	jsDir: "./app/dist/assets/js",
	jsMinDir: "./app/dist/assets/js/min",
	js: "./app/dist/assets/js/**/*.js",
	jsExclMin: "!./app/dist/assets/js/min{,/**/*}",
	imgsDir: "./app/dist/assets/images",
	imgsMinDir: "./app/dist/assets/images/min/",
	imgs: "./app/dist/assets/images/**/*",
	imgsExclMin: "!./app/dist/assets/images/min{,/**/*}",
	views: "./app/dist/"
};

//---------------------
//Error Handler
//---------------------

var errorFree = true;
var onError = function (err) {

	errorFree = false;

	var subtitle = "error: ";
	var message = "<%= error.message %>";

	notify.onError({
		title: "<%= error.plugin %>",
		subtitle: subtitle,
		message: chalk.hex('#D54106')(message),
		sound: "Beep"
	})(err);

	this.emit('end');
};

//---------------------
//Task: Views
//---------------------

gulp.task('views', function () {

	var viewStream = gulp.src(src.views)
		.pipe(plumber({
			errorHandler: onError
		}))
		.pipe(gulp.dest(dest.views))
		/*.pipe(notify( function(f) {
			return errorFree ? {
			title: 'Gulp',
			subtitle: 'Sucess',
			message: 'Succesfully copied <%= file.path %>',
			sound: false
		}
		: false ;
		}))*/;

	return merge(viewStream);

});

//---------------------
//Task: SASS
//---------------------
gulp.task('sass', function () {

	var sassStream = gulp.src(src.sass)
		.pipe(plumber({
			errorHandler: onError
		}))
		.pipe(sass())
		.pipe(gulp.dest(src.sassCompile2Dir))
		/*.pipe(notify( function(f) {
			return errorFree ? {
			title: 'Gulp',
			subtitle: 'Sucess',
			message: 'Succesfully compiled <%= file.path %>',
			sound: false
		}
		: false ;
		}))*/;

	return merge(sassStream);

});

//---------------------
//Task: COMPRESS CSS
//---------------------
gulp.task('compress-css', gulp.series(['sass'], function () {

	var cssStream = gulp.src([src.css, src.cssExclMin])
		.pipe(plumber({
			errorHandler: onError
		}))
		.pipe(prefix({
            browsers: ['last 2 versions'],
            cascade: false
        }))
		.pipe(gulp.dest(dest.cssDir))
		.pipe(modifyCssUrls({
			prepend: '../'
		}))
		.pipe(uglifycss())
		.pipe(sourcemaps.init())
		.pipe(sourcemaps.write())
		.pipe(gulp.dest(dest.cssMinDir))
		/*.pipe(notify( function(f) {
			return errorFree ? {
			title: 'Gulp',
			subtitle: 'Sucess',
			message: 'Succesfully compressed <%= file.path %>',
			sound: false
		}
		: false ;
		}))*/;

	return merge(cssStream);

}));

//---------------------
//Task: COMPRESS SCRIPTS
//---------------------
gulp.task('compress-scripts', function () {

	var jsStream = gulp.src([src.js, src.jsExclMin])
		.pipe(plumber({
			errorHandler: onError
		}))
		.pipe(gulp.dest(dest.jsDir))
		.pipe(uglify())
		.pipe(sourcemaps.init())
		.pipe(sourcemaps.write())
		.pipe(gulp.dest(dest.jsMinDir))
		/*.pipe(notify( function(f) {
			return errorFree ? {
			title: 'Gulp',
			subtitle: 'success',
			message: 'Succesfully compressed <%= file.path %>',
			sound: false
		}
		: false ;
		}))*/;

	return merge(jsStream);
});

//---------------------
//Task: COMPRESS IMAGES
//---------------------
gulp.task('compress-images', function () {

	var imgStream = gulp.src([src.imgs, src.imgsExclMin])
		.pipe(plumber({
			errorHandler: onError
		}))
		.pipe(gulp.dest(dest.imgsDir))
		.pipe(imagemin())
		.pipe(gulp.dest(dest.imgsMinDir))
		/*.pipe(notify( function(f) {
			return errorFree ? {
			title: 'Gulp',
			subtitle: 'success',
			message: 'Succesfully compressed <%= file.path %>',
			sound: false
		}
		: false ;
		}))*/;

	return merge(imgStream);

});

//---------------------
//Task: Reloads
//---------------------

gulp.task('reload', function (done) {
	browserSync.reload();
	done();
});

gulp.task('sass-reload', gulp.series(['compress-css'], function (done) {
	browserSync.reload();
	done();
}));

//---------------------
//Task: Watch
//---------------------
gulp.task('watch',  gulp.series(['views'], function () {
	gulp.watch(src.views, gulp.parallel(['views', 'reload']));
	gulp.watch([src.sass], gulp.parallel(['sass-reload']));
	gulp.watch([src.js, src.jsExclMin], gulp.parallel(['compress-scripts', 'reload']));
	gulp.watch([src.imgs, src.imgsExclMin], gulp.parallel(['compress-images', 'reload']));
}));

//---------------------
//Task: Default
//---------------------
gulp.task('default', gulp.series(['watch']));

gulp.task('compile', gulp.series(['views', 'sass', 'compress-css', 'compress-scripts', 'compress-images', 'watch']));

// Static Server + watching scss/html files
gulp.task('serve', gulp.series(['compile'], function () {

    browserSync.init({
        server: "./app/dist/",
        startPath: "/index.html" // After it browser running
    });

}));
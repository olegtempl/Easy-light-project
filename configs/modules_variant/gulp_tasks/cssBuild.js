module.exports = function (gulp, pathSrc, pathBuild, sass, prefix, plumber, browserSync, reload, notify, onError) {
    return function () {
        gulp.src(pathSrc)
        .pipe(sass())						
		// .pipe(inlineimage()) ?
		.pipe(plumber({errorHandler: onError}))      
		.pipe(prefix('last 3 versions'))
        .pipe(gulp.dest(pathBuild))
        .pipe(reload({stream: true}));   
    };
};


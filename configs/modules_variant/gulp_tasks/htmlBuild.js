module.exports = function (gulp, pathSrc, pathBuild, pug, plumber, browserSync, reload, notify, onError) {
    return function () {
        gulp.src(pathSrc)
		.pipe(plumber({errorHandler: onError}))      
		.pipe(pug({pretty: true}))
		.pipe(gulp.dest(pathBuild))			  // output html
        .pipe(reload({stream: true}));      
    };
};

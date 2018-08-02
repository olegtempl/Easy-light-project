module.exports = function (gulp, pathSrc, pathBuild, messageBuildJs, uglify, plumber, browserSync, reload, notify, onError) {
    return function () {
        gulp.src(pathSrc)
		.pipe(notify({ message: messageBuildJs, onLast: true  }))
		.pipe(plumber()) 							  
		.pipe(uglify())
        .pipe(gulp.dest(pathBuild));
    };
};


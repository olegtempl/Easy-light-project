module.exports = function (gulp, pathSrc, pathBuild, messageBuildImage, imagemin, plumber, notify, onError) {
    return function () {
        gulp.src(pathSrc)
		.pipe(notify({ message: messageBuildImage, onLast: true  }))
		.pipe(imagemin({
			progressive: true,
			svgoPlugins: [{removeViewBox: false}],
			use: [pngquant()]
		}))
        .pipe(gulp.dest(pathBuild));
    };
};

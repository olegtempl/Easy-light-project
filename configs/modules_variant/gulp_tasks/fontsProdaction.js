module.exports = function (gulp, pathSrc, pathBuild, messageBuildFonts, notify, onError) {
    return function () {
        gulp.src(pathSrc)
		.pipe(notify({ message: messageBuildFonts, onLast: true  }))
        .pipe(gulp.dest(pathBuild));
    };
};

gulp.task('fontsBuild', function () {
	return gulp.src(path.build.fonts)
		.pipe(gulp.dest(path.prodaction.fonts))
});

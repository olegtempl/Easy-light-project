module.exports = function (gulp, pathSrc, pathBuild, plumber, browserSync, reload, notify, onError) {
    return function () {
        gulp.src(pathSrc)

        .pipe(gulp.dest(pathBuild));
    };
};


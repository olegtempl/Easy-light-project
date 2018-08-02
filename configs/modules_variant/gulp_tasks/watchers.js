module.exports = function (gulp, pathWatchPug, pathWatchScss, pathWatchImages, pathWatchJs,  pathWatchFonts ) {
    return function () {
        gulp.watch(pathWatchPug, ['pug']);
        gulp.watch(pathWatchScss, ['sass']);
        gulp.watch(pathWatchJs, ['js']);
        gulp.watch(pathWatchImages + '**/*', ['imageSync']);
        gulp.watch(pathWatchFonts + '**/*',  ['fontsSync']);
    };
};


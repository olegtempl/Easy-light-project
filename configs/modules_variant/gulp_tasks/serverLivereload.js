module.exports = function (gulp, configServerLivereload, browserSync, reload) {
    return function () {
        browserSync(configServerLivereload);
    };
};


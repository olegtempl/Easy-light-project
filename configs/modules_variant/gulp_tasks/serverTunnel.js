module.exports = function (gulp, configServerLocal, browserSync, reload) {
    return function () {
        browserSync(configServerLocal);
    };
};


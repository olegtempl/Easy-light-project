module.exports = function (gulp, pathSrc, pathProdaction, messageBuildHtml, plumber, checkFilesize, prettify, browserSync, reload, notify, onError) {
    return function () {
        gulp.src(pathSrc)
        .pipe(notify({ message: messageBuildHtml, onLast: true  }))
		.pipe(prettify.reporter())                        //  указывает имя и формат файлов для prettify
		.pipe(checkFilesize())                            //  указывает размер файла после обработки
        // return gulp.src(pathProdaction)              	  //  нужно указывать уже файл после beatify прогона
		.pipe(prettify.validate())                        //  если есть ошибка ее выведет репортер и скажет что сделать!
		.pipe(prettify.reporter())
        .pipe(gulp.dest(pathBuild));
    };
};


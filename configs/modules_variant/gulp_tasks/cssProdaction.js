module.exports = function (gulp, pathSrc, pathBuild, pathUncss, messageBuildCss, prettify, checkFilesize, csso, rename, uncss, plumber, browserSync, reload, notify, onError) {
    return function () {
        gulp.src(pathSrc)
        .pipe(notify({ message: messageBuildCss, onLast: true  }))
		.pipe(plumber()) 
	return gulp.src(pathSrc)							  
        .pipe(uncss({
           html: [pathUncss]
        }))
		.pipe(rename({suffix: '.min'}))               //  Добавляем суффикс .min  к сжатому
		.pipe(csso())
		.pipe(checkFilesize())                            //  указывает размер файла после обработки
        .pipe(gulp.dest(pathBuild));
	return gulp.src(path.prodaction.css)             //  нужно указывать уже файл после beatify прогона
		.pipe(prettify.validate())                        //  если есть ошибка ее выведет репортер и скажет что сделать!
		.pipe(prettify.reporter());
    };
};


// plugins for development
const	gulp = require('gulp'),
		rimraf = require('rimraf'),
		rename = require('gulp-rename'),
		pug = require('gulp-pug'),
		sass = require('gulp-sass'),
		notify = require('gulp-notify'),
		inlineimage = require('gulp-inline-image'),
		prefix = require('gulp-autoprefixer'),
		plumber = require('gulp-plumber'),
		dirSync = require('gulp-directory-sync'),
		browserSync = require('browser-sync'),
		reload = browserSync.reload,
		checkFilesize = require("gulp-check-filesize"),
		prettify = require('gulp-jsbeautifier');
// plugins for rollup		
const	rollup = require('rollup-stream'),
		source = require('vinyl-source-stream'),
		buffer = require('vinyl-buffer'),
		sourcemaps = require('gulp-sourcemaps'),
		babel = require('rollup-plugin-babel'),
		commonJs = require('rollup-plugin-commonjs'),
		resolveNodeModules = require('rollup-plugin-node-resolve');
// plugins for build
const 	purify = require('gulp-purifycss'),
		uglify = require('gulp-uglify'),
		imagemin = require('gulp-imagemin'),
		pngquant = require('imagemin-pngquant'),
		uncss = require('gulp-uncss'),
		cssmin = require('gulp-minify-css'),
		csso = require('gulp-csso');
//plugins for validation
const 	html5Lint = require('gulp-html5-lint');
//plugins for testing

const path = {
    src: { 
        pug: 	'src/pug/**/*.pug', 	
        js:  	'src/js/',  
	    scss:	'src/styles/**/*.scss',
	    images: 'src/images/',
	    fonts: 	'src/fonts/'
    },
    build: { 
        html:   'build/',
        js:   	'build/js/',
        css:  	'build/styles/',
        images: 'build/images/**/*',
        fonts: 	'build/fonts/**/*'
       },
	prodaction: { 
        html:   'prodaction/',
        js:     'prodaction/js/',
		css:    'prodaction/styles/',
		images: 'prodaction/images/',
	    fonts: 	'prodaction/fonts/',
		uncssHTML:  'prodaction/**/*.html' 
       },
    watch: { 
        pug: 	'src/pug/**/*.pug',
        js:   	'src/js/**/*.js',
	    scss:	'src/styles/**/*.scss',
	    images: 'src/images/**/*',
		fonts: 	'src/fonts/**/*',
		// for plugin uncss
	},
	tasks : './gulp_tasks/'
}; 
//-----------------------------------------------------Errors
const 	messageBuildHtml = 'Build prodaction version html',
		messageBuildCss = 'Build prodaction version css',
		messageBuildJs = 'Build prodaction version js',
		messageBuildImage = 'Build prodaction image',
		messageBuildFonts = 'Build fonts on prodaction',
		messageValidation = 'Validation started',
		messageTesting = 'Start the tests';
const onError = function (err) {
  notify.onError({
    title: 'Gulp',
    subtitle: 'Ahtung!',
    message: 'Error: <%= error.message %>',
  })(err);
  this.emit('end');
};
//-----------------------------------------------------Modules
//------------------------------Compilers 
	//----------------pug
	const modulePug = (nameFile) => require(path.tasks + nameFile)(gulp, path.src.pug,
							path.build.html, pug, plumber, browserSync, reload, notify, onError);
	gulp.task('pug', modulePug('htmlBuild'));
	//----------------scss
	const moduleScss = (nameFile) => require(path.tasks + nameFile)(gulp, path.src.scss, 
					path.build.css, sass, prefix, plumber, browserSync, reload, notify, onError);
	gulp.task('sass', moduleScss('cssBuild'));
//------------------------------Compilers prodaction
	//---------------- html ( no work)
	const  moduleHtml = (nameFile) => require(path.tasks + nameFile)(
				gulp, path.build.html, path.prodaction.html , messageBuildHtml,
				 plumber, checkFilesize, prettify,browserSync, reload, notify, onError);
	gulp.task('htmlBuild', moduleHtml('htmlProdaction'));
	//---------------- css
	// const  moduleCss = (nameFile) => require(path.tasks + nameFile)(gulp, path.build.css,
	// 				path.prodaction.css, path.prodaction.uncssHTML , messageBuildCss, prettify,
	// 				checkFilesize, csso, rename, uncss, plumber, browserSync, reload, notify, onError);
	// gulp.task('cssBuild', moduleCss('cssProdaction'));
	// //---------------- js
	// const  moduleJs = (nameFile) => require(path.tasks + nameFile)(gulp, path.build.css, path.prodaction.js, 
	// 				messageBuildJs,uglify, plumber, browserSync, reload, notify, onError );
	// gulp.task('jsBuild', moduleJs('jsProdaction'));
	//---------------- images
	// const  moduleImage = (nameFile) => require(path.tasks + nameFile)(gulp, path.build.images, path.prodaction.images, messageBuildImage, imagemin, plumber, notify, onError);
	// gulp.task('imageBuild', moduleImage('imageProdaction'));
	// //---------------- fonts
	// const  moduleFonts = (nameFile) => require(path.tasks + nameFile)(gulp, path.build.fonts, path.prodaction.fonts, messageBuildFonts, notify, onError );
	// gulp.task('fontsBuild', moduleFonts('fontsProdaction'));
//------------------------------Watchers
	const  moduleWatchers = (nameFile) => require(path.tasks + nameFile)(gulp, path.watch.pug, 
						path.watch.scss, path.watch.images, path.watch.js, path.watch.fonts);
	gulp.task('watch', moduleWatchers('watchers'));
//------------------------------Servers ( no work)
	// //----------------Tunnel
	// const  moduleTunnel = (nameFile) => require(path.tasks + nameFile)(gulp, browserSync, reload);
	// gulp.task('server', moduleTunnel('serverTunnel'));
	// //----------------Livereload
	// const  moduleLivereload = (nameFile) => require(path.tasks + nameFile)(gulp, browserSync, reload);
	// gulp.task('browser-sync', moduleLivereload('serverLivereload'));
//------------------------------------------------Synchronization 
	// const  moduleSyncImage = (nameFile) => require(path.tasks + nameFile)(gulp,  plumber, browserSync, reload, notify);
	// gulp.task('imageSync', module('synchronisationImages'));
	//------------------------------
	//------------------------------
	// const  moduleSyncFonts = (nameFile) => require(path.tasks + nameFile)(gulp,  plumber, browserSync, reload, notify);
	// gulp.task('fontsSync', moduleSyncFonts('synchronisationFonts'));
//-----------------------------------------------------Compilers
//js
// gulp.task('js', rollupJS(nameMainSrcfile, {
// 	basePath: path.src.js,
// 	format: typeModules,				
// 	distPath: path.build.js,
// 	sourcemap: sourceMap
//   }));
//-------------------------------------------------Servers
/* 
 * 	Сделать запуск по флагам ?
 * 
 *  */
//------------------------------Livepreload
const configServerLive = {
	port: 8081,
	server: {
		baseDir: path.build.html
	}
};
gulp.task('browser-sync', function () {
	// .pipe(notify({ message: messageLivepreload, onLast: true  }))
	browserSync(configServerLive);
});
//------------------------------Local Server
const configServerLocal = {
    server: {
        baseDir: path.prodaction.html
    },
    tunnel: true,
    host: 'localhost',
    port: 8081, // 9000
    logPrefix: 'Frontend_medved'
};
gulp.task('server', function () {  
	// .pipe(notify({ message: messageServerTunnel, onLast: true  }))
    browserSync(configServerLocal);
});
//------------------------------------------------Synchronization 
//Таски для синхронизации папок проекта между собой:
gulp.task('', function () {
	return gulp.src('')
		.pipe(plumber())
		.pipe(dirSync(path.src.images, path.build.images, {printSummary: true}))
		.pipe(browserSync.stream());
});

gulp.task('fontsSync', function () {
	return gulp.src('')
		.pipe(plumber())
		.pipe(dirSync(path.src.fonts, path.build.fonts, {printSummary: true}))
		.pipe(browserSync.stream());
});
//------------------------------------------------Building prodaction 
//------------------------------clean folder `build`
// gulp.task('cl





/*
 *			Доделать
 *		Продакшэн обработку
 *		Вынести в отдельную папку
 * 		Запуск валидации по AirnD
 *		Запуск тестов по mocha,jasmine ( на gulp или  бандлер парсель ?) 
 *		Добавить спрайты + scss миксины
 * 		Протестить uncss ( проблемы на продакшене)
 * 		Добавить коментарии JsDoc
 * 		Synchronization ?? ( в модуль или так оставить)
 * 
 * 
 */



// чeanBuildDir', function (cb) {
// // 	rimraf(path.build.html, cb);
// // });

//------------------------------------------------Validation
//testing your build files
// validation task
gulp.task('validation', function () {
	// добавить airNb для css, js, html - сохранить
	return gulp.src(buildDir + '**/*.html')
		.pipe(notify({ message: messageValidation, onLast: true  }))
		.pipe(html5Lint());
});
//------------------------------------------------Testing
// run tests on jasmine \ mocha
// gulp.task('test', function () { 

// 	.pipe(notify({ message: messageTesting, onLast: true  }))

// })

// for development
gulp.task('default', ['pug', 'sass', 'js', 'imageSync', 'fontsSync', 'watch', 'browser-sync']); 
// for production
gulp.task('build', ['fontsBuild', 'htmlBuild', 'jsBuild', 'cssBuild'] ); //, 

// gulp.task('build', ['cleanBuildDir'], function () {
// 	gulp.start('imgBuild', 'fontsBuild', 'htmlBuild', 'jsBuild', 'cssBuild');
// });






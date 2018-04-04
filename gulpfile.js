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
    }
}; 
//-----------------------------------------------------Js 
//------------------------------Bundler (RoolUp)
/* cjs - nodejs
 * iife - browser
 *  */
const nameMainSrcfile = 'index.js',
	  typeModules = 'cjs',
	  sourceMap = true;
const rollupJS = (inputFile, options) => {
		return () => {
		return rollup({
			input: options.basePath + inputFile,
			format: options.format,
			sourcemap: options.sourcemap,
			plugins: [
			babel(babelConfig),
			resolveNodeModules(),
			commonJs(),
			]
		})
		// point to the entry file.
		.pipe(source(inputFile, options.basePath))
		// we need to buffer the output, since many gulp plugins don't support streams.
		.pipe(buffer())
		.pipe(sourcemaps.init({loadMaps: true}))
		// some transformations like uglify, rename, etc.
		.pipe(sourcemaps.write('.'))
		.pipe(gulp.dest(options.distPath));
	};
};
//------------------------------Babel
const babelConfig = {
	"presets": [
	  [
		"es2015",
		{
		  "modules": false
		}
	  ]
	],
	"plugins": [
	  "external-helpers"
	],
	babelrc: false
  };
  

/*
 *			Доделать
 *		Обработку ошибок\уведомлений
 *		Продакшэн обработку
 *		Вынести в отдельную папку
 * 		Запуск валидации по AirnD
 *		Запуск тестов по mocha,jasmine ( на gulp или  бандлер парсель ?) 
 *		Добавить спрайты + scss миксины
 * 		Протестить uncss ( проблемы на продакшене)
 * 		Добавить коментарии JsDoc
 * 
 * 
 */

/* В документацию
"rollup-plugin-commonjs": "^8.4.1", <= this version is worked

// livepreload server directory `build`
// gulp.task('browser-sync') 
// create the tunnel for you site,directory `prodaction`
// gulp.task('server') 

// validation and linters the files
// gulp.task('validation')
// run tests on jasmine \ mocha
// gulp.task('test')


// run in development       
// gulp.task('default')
//	prodaction
// gulp.task('build')


 *
 *  */
//-----------------------------------------------------Errors
const 	messageBuildHtml = 'Build prodaction version html',
		messageBuildCss = 'Build prodaction version css',
		messageBuildJs = 'Build prodaction version js',
		messageBuildImage = 'Build prodaction image',
		messageBuildFonts = 'Build fonts on prodaction',
		// messageLivepreload = 'Server livepreload activaited',	   // no work	
		// messageServerTunnel = 'Tunnel for you project activaited',  // no work
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

//-----------------------------------------------------Compilers

// html+pug
gulp.task('pug', function () {		
	gulp.src(path.src.pug)		 
		.pipe(plumber({errorHandler: onError}))      
		.pipe(pug({pretty: true}))
		.pipe(gulp.dest(path.build.html))			  // output html
        .pipe(reload({stream: true}));               
});

//сss+scss(sass)
gulp.task('sass', function () {
	gulp.src(path.src.scss)
		.pipe(sass())						
		.pipe(inlineimage())
		.pipe(plumber({errorHandler: onError}))      
		.pipe(prefix('last 3 versions'))
		.pipe(gulp.dest(path.build.css))	// output css
        .pipe(reload({stream: true}));      
});

//js
gulp.task('js', rollupJS(nameMainSrcfile, {
	basePath: path.src.js,
	format: typeModules,				
	distPath: path.build.js,
	sourcemap: sourceMap
  }));
//-------------------------------------------------Watchers
gulp.task('watch', function () {
	gulp.watch(path.watch.pug, ['pug']);
	gulp.watch(path.watch.scss, ['sass']);
	gulp.watch(path.watch.js, ['js']);
	gulp.watch(path.watch.images + '**/*', ['imageSync']);
	gulp.watch(path.watch.fonts + '**/*',  ['fontsSync']);
});
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
}

gulp.task('server', function () {  
	// .pipe(notify({ message: messageServerTunnel, onLast: true  }))
    browserSync(configServerLocal);
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

gulp.task('browser-sync', function () {
	// .pipe(notify({ message: messageLivepreload, onLast: true  }))
	browserSync(configServerLive);
});

//-------------------------------------------------Synchronization
//Таски для синхронизации папок проекта между собой:
gulp.task('imageSync', function () {
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

// gulp.task('jsSync', function () {
// 	return gulp.src(build.js + '/**/*.js')
// 		.pipe(plumber())
// 		.pipe(gulp.dest(outputDir + 'js/'))
// 		.pipe(browserSync.stream());
// });
//------------------------------------------------Building prodaction 
//------------------------------clean folder `build`
// gulp.task('cleanBuildDir', function (cb) {
// 	rimraf(path.build.html, cb);
// });
// images
gulp.task('imgBuild', function () {
	return gulp.src(path.build.image)
		.pipe(notify({ message: messageBuildImage, onLast: true  }))
		.pipe(imagemin({
			progressive: true,
			svgoPlugins: [{removeViewBox: false}],
			use: [pngquant()]
		}))
		.pipe(gulp.dest(path.prodaction.image))
});
// fonts
gulp.task('fontsBuild', function () {
	return gulp.src(path.build.fonts)
		.pipe(notify({ message: messageBuildFonts, onLast: true  }))
		.pipe(gulp.dest(path.prodaction.fonts))
});
// html
gulp.task('htmlBuild', function () {
	gulp.src(path.build.html + '**/*.html')
		.pipe(notify({ message: messageBuildHtml, onLast: true  }))
		.pipe(prettify.reporter())                        //  указывает имя и формат файлов для prettify
		.pipe(checkFilesize())                            //  указывает размер файла после обработки
		.pipe(gulp.dest(path.prodaction.html))            //  Выплюнем их в папку prodaction
		.pipe(reload({stream: true}))                     //  И перезагрузим наш сервер для обновлений
	return gulp.src(path.prodaction.html)              	  //  нужно указывать уже файл после beatify прогона
		.pipe(prettify.validate())                        //  если есть ошибка ее выведет репортер и скажет что сделать!
		.pipe(prettify.reporter());

});
// minify js
gulp.task('jsBuild', function () {
	return gulp.src(path.build.js + '**/*.js')
		.pipe(notify({ message: messageBuildJs, onLast: true  }))
		.pipe(plumber()) 							  
		.pipe(uglify())
		.pipe(gulp.dest(path.prodaction.js))
	});
// minify css
gulp.task('cssBuild', function () {
	// return gulp.src(path.build.css)
		// .pipe(purify([outputDir + 'js/**/*', outputDir + '**/*.html'])) // очищение ??
	gulp.src(path.build.css)
		.pipe(notify({ message: messageBuildCss, onLast: true  }))
		.pipe(plumber()) 
	return gulp.src(path.build.css)							  
        .pipe(uncss({
           html: [path.prodaction.uncssHTML]
        }))
		.pipe(rename({suffix: '.min'}))               //  Добавляем суффикс .min  к сжатому
		.pipe(csso())
		.pipe(checkFilesize())                            //  указывает размер файла после обработки
		.pipe(gulp.dest(path.prodaction.css))
	return gulp.src(path.prodaction.css)             //  нужно указывать уже файл после beatify прогона
		.pipe(prettify.validate())                        //  если есть ошибка ее выведет репортер и скажет что сделать!
		.pipe(prettify.reporter());
});

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

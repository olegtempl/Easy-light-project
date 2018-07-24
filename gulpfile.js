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
	    zip = require('gulp-zip'),
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
		htmlmin = require('gulp-html-minifier'),
		csso = require('gulp-csso');
// plugins for tests
const   mocha = require('gulp-mocha');
// jasmine test
const Jasmine = require('jasmine'),
      jasmine = new Jasmine(),
      jasmineConfig = require('./configs/jasmine/jasmine.json');
// jasmine reporter
const JasmineclReporter = require('jasmine-console-reporter'),
      jasmineReporterConfig = require('./configs/jasmine/jasmineReporter.json'),
      reporter = new JasmineclReporter(jasmineReporterConfig);
// plugins for validations
const eslint = require('gulp-eslint'),
	 	  html5Lint = require('gulp-html5-lint');
// plugins for documentation
const jsdoc = require('gulp-jsdoc3');
// others
const cl = require('node-cl-log');
//------------------------------All paths on project
const path = require('./configs/path.json');
//------------------------------Messages for tasks
const message = require(path.messages);
//-----------------------------------------------------Servers
//------------------------------Livereload
const configServerLivereload = require(path.configs.serverLive);
//------------------------------Tunnel
const configServerTunnel = require(path.configs.serverTunnel);
//------------------------------Selenium
const commandServerSelenium = require(path.commands.serverSelenium);
//-----------------------------------------------------Shell commands
//------------------------------Start shell commands
const runCmd = require(path.commands.runCmd);
//------------------------------Start the gui tests
const commandGuiTests = require(path.commands.guiTests);
//------------------------------Start the make scrennshotes
const commandCreateScreenshots = require(path.commands.guiSreenshots);
//------------------------------Start the make scrennshotes
const commandPageSpeedTests = require(path.commands.pageSpeed);
//------------------------------
// const = require(path.commands.);
//-------------------------------------------------Servers
//------------------------------Livepreload
gulp.task('server', () => {
    browserSync(configServerTunnel);
});
//------------------------------Local Server
gulp.task('browser-sync', () => {
	browserSync(configServerLivereload);
});
//------------------------------Selenium Server
gulp.task('selenium', () => {
  gulp.src('')
  .pipe(notify({ message: message.servers.selenium , onLast: true  }))
  runCmd(commandServerSelenium);
});
//-------------------------------------------------Watchers
gulp.task('watch', () => {
	gulp.watch(path.watch.pug, ['pug']);
	gulp.watch(path.watch.scss, ['sass']);
	gulp.watch(path.watch.js, ['js']);
	gulp.watch(path.watch.images + '**/*', ['imageSync']);
	gulp.watch(path.watch.fonts + '**/*',  ['fontsSync']);
});
//-------------------------------------------------Synchronization
//
/**
 * @description Task for synchronizing folders for images and fonts
 *
 */
gulp.task('imageSync', () => {
	return gulp.src('')
		.pipe(plumber())
		.pipe(dirSync(path.src.images, path.build.images, {printSummary: true}))
		.pipe(browserSync.stream());
});
gulp.task('fontsSync', () => {
	return gulp.src('')
		.pipe(plumber())
		.pipe(dirSync(path.src.fonts, path.build.fonts, {printSummary: true}))
		.pipe(browserSync.stream());
});
//-----------------------------------------------------Js
/* cjs - nodejs
 * iife - browser
 *  */
/**
 * @description Task for run babel and rollup
 *
 */
//------------------------------Babel
const babelConfig = require(path.configs.babel);
//------------------------------JsDoc
const jsDocConfig = require(path.configs.jsDoc);
//------------------------------Bundler (RoolUp)
//------------------------------Config rollup
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
		.pipe(source(inputFile, options.basePath))
		.pipe(buffer())
		.pipe(sourcemaps.init({loadMaps: true}))
		.pipe(sourcemaps.write('.'))
		.pipe(gulp.dest(options.distPath));
	};
};
//-----------------------------------------------------Errors
//------------------------------Error handler
const onError = (err) => {
  notify.onError({
    title: 'Gulp',
    subtitle: 'Ahtung!',
    message: 'Error: <%= error.message %>',
  })(err);
  this.emit('end');
};
//-----------------------------------------------------Compilers
/**
 * @description Task for render pug to html
 * @return static html files
 */
gulp.task('pug', () => {
	gulp.src(path.src.pug)
		.pipe(plumber())
		.pipe(pug({pretty: true}))
		.pipe(gulp.dest(path.build.html))
    .pipe(reload({stream: true}));
});
/**
 * @description Task for render scss to css
 * @return static css file
 */
gulp.task('sass', () => {
	gulp.src(path.src.scss)
		.pipe(sass())
		.pipe(inlineimage())
		.pipe(plumber())
		.pipe(prefix('last 3 versions'))
		.pipe(gulp.dest(path.build.css))
    .pipe(reload({stream: true}));
});
/**
 * @description Task for render js(es6) > js(es3)
 * @return bundle file
 */
gulp.task('js', rollupJS(nameMainSrcfile, {
	basePath: path.src.js,
	format: typeModules,
	distPath: path.build.js,
	sourcemap: sourceMap
}));
//------------------------------------------------Building prodaction
//------------------------------images
/**
 * @description Task for minifacation and optimisation images
 * @return optimisation images
 */
gulp.task('imgBuild', () => {
	return gulp.src(path.build.image)
		.pipe(notify({ message: message.build.image , onLast: true  }))
		.pipe(imagemin({
			progressive: true,
			svgoPlugins: [{removeViewBox: false}],
			use: [pngquant()]
		}))
		.pipe(gulp.dest(path.prodaction.image))
});
//------------------------------fonts
/**
 * @description Task for synchronisation fonts
 * @return fonts
 */
gulp.task('fontsBuild', () => {
	return gulp.src(path.build.fonts)
		.pipe(notify({ message: message.build.fonts, onLast: true  }))
		.pipe(gulp.dest(path.prodaction.fonts))
});
//------------------------------html
/**
 * @description Task for minifacation and validation static html files
 * @return minifacation html files
 */
gulp.task('htmlBuild', () => {
	gulp.src(path.build.html + '*.html')
		.pipe(notify({ message: message.build.html, onLast: true  }))
		.pipe(htmlmin({collapseWhitespace: true}))
		.pipe(prettify.reporter())
		.pipe(checkFilesize())
		.pipe(gulp.dest(path.prodaction.html))
		.pipe(reload({stream: true}))
	return gulp.src(path.prodaction.html)               //  you need to specify the file after the beatify run
		.pipe(prettify.validate())                        //  if there is a mistake it will bring the reporter out and say what to do!
		.pipe(prettify.reporter());

});
//------------------------------minify js
/**
 * @description Task for minifacation static js files
 * @return minifacation js files
 */
gulp.task('jsBuild',  () => {
	return gulp.src(path.build.js + '**/*.js')
		.pipe(notify({ message: message.build.js, onLast: true  }))
		.pipe(plumber())
		.pipe(uglify())
		.pipe(gulp.dest(path.prodaction.js))
	});
//------------------------------minify css
/**
 * @description Task for minifacation and validation static css files
 * @return minifacation css files
 */
gulp.task('cssBuild', () =>  {
	gulp.src(path.build.css  + 'index.css')
		.pipe(notify({ message: message.build.css, onLast: true  }))
		.pipe(plumber())
        .pipe(uncss({
           html: [path.prodaction.html + '**/*.html']
        }))
		.pipe(csso())
		.pipe(checkFilesize())
		.pipe(gulp.dest(path.prodaction.css))
	return gulp.src(path.prodaction.css)              //  you need to specify the file after the beatify run
		.pipe(prettify.validate())                      //  if there is a mistake it will bring the reporter out and say what to do!
		.pipe(prettify.reporter());
});
//------------------------------Archive creation
/**
 * @description Task for archivated static files the final version to archive
 * @return archive of project
 */
gulp.task('zip', () =>
    gulp.src(path.prodaction.html)
        .pipe(zip('site.zip'))
        .pipe(gulp.dest(path.prodaction.html))
);
//------------------------------------------------Validation
//------------------------------Html
/**
 * @description Task for validation static html files
 * @return message for results of validation
 */
gulp.task('validation:html', () => {
	return gulp.src(buildDir + '**/*.html')
		.pipe(notify({ message: message.validation.html, onLast: true  }))
		.pipe(html5Lint());
});
//------------------------------Js
/**
 * @description Task for validation static js files
 * @return message for results of validation
 */
gulp.task('validation:js', () => {
  return gulp.src([path.validation.js,'!node_modules/**'])
    .pipe(notify({ message: message.validation.js, onLast: true  }))
    .pipe(eslint({
      fix: true
    }))
    .pipe(eslint.format())
    gulp.dest(jsFixedLinterOutput)
    .pipe(eslint.results(results => {
        cl.log(`Total Results: ${results.length}`);
        cl.log(`Total Warnings: ${results.warningCount}`);
        cl.log(`Total Errors: ${results.errorCount}`);
    }))
});
//------------------------------------------------Testing
//------------------------------Mocha
/**
 * @description Task for start the specs for mocha tests
 * @return results the tests
 */
gulp.task('test:mocha', () =>
  gulp.src('')
    .pipe(notify({ message: message.tests.mocha, onLast: true  }))
    .pipe(mocha())
);
//------------------------------Jasmine
/**
 * @description Task for start the specs for jasmine  tests
 * @return results the tests
 */
gulp.task('test:jasmine', () => {
  gulp.src('')
    .pipe(notify({ message: message.tests.jasmine, onLast: true  }))
  jasmine.loadConfig(jasmineConfig);
  jasmine.jasmine.DEFAULT_TIMEOUT_INTERVAL = 15000;
  jasmine.env.clearReporters();
  jasmine.addReporter(reporter);
  jasmine.execute();
});
//------------------------------GUI tests
/**
 * @description Task for start the specs for gui tests
 * @return results the tests
 */
gulp.task('test:gui', () => {
  gulp.src('')
    .pipe(notify({ message: message.tests.gui, onLast: true  }))
  runCmd(commandGuiTests);
});
//------------------------------GUI screenshots
/**
 * @description Task for start the take screenshots for specs
 * @return static images-screenshots
 */
gulp.task('screenshots', () => {
  gulp.src(path.tests.screenshots)
    .pipe(notify({ message: message.tests.screenshots, onLast: false  }))
  runCmd(commandCreateScreenshots);
});
//------------------------------Page speed tests
/**
 * @description Task for start the specs for page analyzer tests
 * @return results the tests
 */
gulp.task('test:speed', () => {
  gulp.src(path.tests.pageSpeed)
    .pipe(notify({ message: message.tests.pageSpeed, onLast: false  }))
  runCmd(commandPageSpeedTests);
});
//------------------------------------------------Documentation
//------------------------------JsDoc
/**
 * @description Task for generation documentation through the jsDoc
 * @return static documentation on docs directory
 */
gulp.task('doc:jsdoc', (cb) => {
  gulp.src([path.docs.jsDoc, `${path.build.js}index.js`], {read: false})
    .pipe(notify({ message: message.documentation.jsDoc, onLast: false  }))
    .pipe(jsdoc(jsDocConfig, cb));
});
//------------------------------Readme
/**
 * @description Task for generation documentation through the readme-bundler
 * @return static documentation on docs directory or project root on main file README
 */
// gulp.task('doc:readme', function (cb) {
//   gulp.src()
//     .pipe(notify({ message: message.documentation.readme, onLast: false  }))

// });
//------------------------------License
/**
 * @description Task for generation license file and copyright for all files in project
 * @return modified files with the copier added to them and the updated license file
 */
// gulp.task('doc:license', function (cb) {
//   gulp.src()
//     .pipe(notify({ message: message.documentation.license, onLast: false  }))

// });
/**
 * @description Task on project for development mode
 */
gulp.task('default', ['pug', 'sass', 'js', 'imageSync', 'fontsSync', 'watch', 'browser-sync']);
/**
 * @description Task on project for production mode
 */
gulp.task('build', ['fontsBuild', 'htmlBuild', 'jsBuild', 'cssBuild'] );
/** 
 * @description Task on project for presentation mode
 */
gulp.task('view', ['zip', 'server']);
/**
 * @description Task on project for run validation for all types of files
 */
gulp.task('validation', ['validation:html', 'validation:js']);
/**
 * @description Task on project for all documentation services
 */
gulp.task('doc', ['doc:jsdoc', 'doc:readme', 'doc:license']);
/**
 * @description Task on project for start generation of all types of documentation
 */
gulp.task('docs', ['jsDoc', 'readme']);

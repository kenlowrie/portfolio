var gulp = require('gulp'),
	gutil = require('gulp-util'),
	gulpif = require('gulp-if'),
	postcss = require('gulp-postcss'),
	precss = require('precss'),
	cssnano = require('cssnano'),
	autoprefixer = require('autoprefixer'),
	webserver = require('gulp-webserver2'),
	cached = require('gulp-cached'),
	include = require('gulp-html-tag-include'),
	minifyHTML = require('gulp-minify-html');

var env,
	srcDir,
	bldRoot,
	htmlSources,
	cssSources,
	gulpSources,
	outDir;

env = process.env.NODE_ENV || 'dev';
srcDir = 'src/';
bldRoot = 'build/';
htmlSources = [srcDir + '**/*.html'];
jsSources = [srcDir + 'resume/js/*.js'];
cssSources = [srcDir + '**/styles.css'];
gulpSources = [srcDir + 'gulpfiles/*.js'];

if (env === 'dev'){
	outDir = bldRoot + 'dev/';
} else {
	outDir = bldRoot + 'rel/';
}

console.log('Building klportfolio in ' + env + ' mode to ' + outDir);

gulp.task('cpimg', function(){
   gulp.src([srcDir + '**/img/*',srcDir + '**/img/photos/*'],{base: srcDir}) 
    .pipe(cached("imgcache"))
  	.pipe(gulp.dest(outDir));
});

gulp.task('js', function(){
   gulp.src(jsSources,{base: srcDir})
    .pipe(cached("jscache"))
  	.pipe(gulp.dest(outDir));
});

gulp.task('cpgulpsrc', function(){
   gulp.src(gulpSources)
    .pipe(cached("gulpcache"))
  	.pipe(gulp.dest(outDir));
});

gulp.task( 'html', function() {
	gulp.src(htmlSources)
	    .pipe(include())
		.on('error', gutil.log)
	    .pipe(cached('htmlcache'))
		.pipe(gulpif(env === 'rel', minifyHTML()))
		.pipe(gulp.dest(outDir))
});

var postcssTasks = [precss(),autoprefixer()];
if (env === 'rel'){
	postcssTasks = [precss(),autoprefixer(),cssnano()];
}

gulp.task( 'css', function() {
	gulp.src(cssSources)
		.pipe(postcss(postcssTasks))
		.on('error', gutil.log)
		.pipe(cached("csscache"))
		.pipe(gulp.dest(outDir))
});

gulp.task('watch', function() {
  gulp.watch(srcDir + '**/*.css', ['css']);
  gulp.watch(srcDir + 'resume/js/*.js', ['js']);
  gulp.watch(srcDir + '**/*.html', ['html']);
  gulp.watch(srcDir + 'tmpl/*', ['html']);
  gulp.watch(srcDir + '**/img/*', ['cpimg']);
  gulp.watch(srcDir + '**/img/photos/*', ['cpimg']);
});


gulp.task('webserver', function() {
  gulp.src(outDir)
    .pipe(webserver({
      livereload: true,
      open: true
    }));
});

var buildtasks=['html', 'css', 'js', 'cpimg','cpgulpsrc'];

gulp.task('build', buildtasks); 

gulp.task('default', buildtasks.concat(['webserver', 'watch']));

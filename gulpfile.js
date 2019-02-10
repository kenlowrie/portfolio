//gulpfile for klportfolio

const gulp = require('gulp'),
      gulpif = require('gulp-if'),
      gutillog = require('fancy-log'),
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
   return gulp.src([srcDir + '**/img/*',srcDir + '**/img/photos/*'],{base: srcDir}) 
       .pipe(cached("imgcache"))
       .pipe(gulp.dest(outDir))
});

//console.log('Registering task jscache');
gulp.task('js', function(){
   return gulp.src(jsSources,{base: srcDir})
       .pipe(cached("jscache"))
       .pipe(gulp.dest(outDir));
});

//console.log('Registering task cpgulpsrc');
gulp.task('cpgulpsrc', function(){
   return gulp.src(gulpSources)
       .pipe(cached("gulpcache"))
       .pipe(gulp.dest(outDir))
});

//console.log('Registering task html');
gulp.task( 'html', function() {
	return gulp.src(htmlSources)
	    .pipe(include())
		.on('error', gutillog)
	    .pipe(cached('htmlcache'))
		.pipe(gulpif(env === 'rel', minifyHTML()))
        .pipe(gulp.dest(outDir))
});

//console.log('Setting up postcssTasks ...');
var postcssTasks = [precss(),autoprefixer()];
if (env === 'rel'){
	postcssTasks = [precss(),autoprefixer(),cssnano()];
}

//console.log('Registering task css');
gulp.task( 'css', function() {
	return gulp.src(cssSources)
		.pipe(postcss(postcssTasks))
		.on('error', gutillog)
		.pipe(cached("csscache"))
        .pipe(gulp.dest(outDir))
});

//console.log('Registering task watch');
gulp.task('watch', function(done) {
  gulp.watch(srcDir + '**/*.css', gulp.series(['css']));
  gulp.watch(srcDir + 'resume/js/*.js', gulp.series(['js']));
  gulp.watch(srcDir + '**/*.html', gulp.series(['html']));
  gulp.watch(srcDir + 'tmpl/*', gulp.series(['html']));
  gulp.watch(srcDir + '**/img/*', gulp.series(['cpimg']));
  gulp.watch(srcDir + '**/img/photos/*', gulp.series(['cpimg']));
  done();
});

//console.log('Registering task webserver');
gulp.task('webserver', function() {
  gulp.src(outDir)
    .pipe(webserver({
      livereload: true,
      open: true
    }));
});

var buildtasks=['html', 'css', 'js', 'cpimg','cpgulpsrc'];

//console.log('Registering task build');
gulp.task('build', gulp.series(buildtasks)); 

//console.log('Registering task default');
gulp.task('default', gulp.parallel(buildtasks.concat(['webserver', 'watch'])));

//console.log('End of file');

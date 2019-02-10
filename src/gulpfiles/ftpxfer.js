'use strict';

var gulp = require('gulp');  
var gutillog = require( 'fancy-log' );  
var ftp = require( 'vinyl-ftp' );

/** Configuration **/
var user = process.env.FTP_USER;  
var password = process.env.FTP_PWD;  
var host = process.env.FTP_HOST;  
var port = 21;  
var localFilesGlob = ['**/*', '!ftpxfer.js'];  
var remoteFolder = '/public_html/cs'


// helper function to build an FTP connection based on our configuration
function getFtpConnection() {  
    return ftp.create({
        host: host,
        port: port,
        user: user,
        password: password,
        parallel: 5,
        timeOffset: -500,
        log: gutillog
    });
}

/**
 * Deploy task.
 * Copies the new files to the server
 *
 * Usage: `FTP_USER=someuser FTP_PWD=somepwd gulp ftp-deploy`
 */
gulp.task('ftp-deploy', function(done) {

    var conn = getFtpConnection();

    return gulp.src(localFilesGlob, {base: '.', buffer: false })
        .pipe( conn.newer( remoteFolder ) ) // only upload newer files 
        .pipe( conn.dest( remoteFolder ) )
    ;
});

/**
 * Watch deploy task.
 * Watches the local copy for changes and copies the new files to the server whenever an update is detected
 *
 * Usage: `FTP_USER=someuser FTP_PWD=somepwd gulp ftp-deploy-watch`
 */
gulp.task('ftp-deploy-watch', function(done) {

    var conn = getFtpConnection();

    const watcher = gulp.watch(localFilesGlob);
    watcher.on('change', function(path, stats){
        console.log('File ' + path + ' was changed');
        return gulp.src(path, {base: '.', buffer: false})
                   .pipe(conn.newer(remoteFolder))
                   .pipe(conn.dest(remoteFolder));
    });
    done()
});

gulp.task('default',gulp.series(['ftp-deploy']));

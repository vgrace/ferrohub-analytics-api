// grab our gulp packages
var gulp = require('gulp'),
	gutil = require('gulp-util'),
    nodemon = require('gulp-nodemon'),
    jshint = require('gulp-jshint'),
	swagger = require('./tasks/swagger.js'),
	watch = require('./tasks/watch.js'); 

// create a default task and just log a message
//gulp.task('default', function () {
//	return gutil.log('Gulp is running!')
//});

gulp.task('default', ['watch', 'lint', 'server', 'swagger-edit']);

gulp.task('lint', function () {
    gulp.src('./**/*.js')
      .pipe(jshint())
})

// start our server and listen for changes
gulp.task('server', function () {
    // configure nodemon
    nodemon({
        // the script to run the app
        script: 'app.js',
        // this listens to changes in any of these files/routes and restarts the application
        watch: ["app.js", "routes/", 'public/*', 'public/*/**'],
        ext: 'js'
        // Below i'm using es6 arrow functions but you can remove the arrow and have it a normal .on('restart', function() { // then place your stuff in here }
    }).on('restart', () => {
        gulp.src('app.js')
          // I've added notify, which displays a message on restart. Was more for me to test so you can remove this
          .pipe(notify('Running the start tasks and stuff'));
    });
});




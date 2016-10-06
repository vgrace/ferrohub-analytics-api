var gulp = require('gulp'),
	gutil = require('gulp-util');

gulp.task("watch", function () { 
	gulp.watch("api/swagger/swagger.yaml", ["swagger"]);
});
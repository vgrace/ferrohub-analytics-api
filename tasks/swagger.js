var gulp = require("gulp");
var yaml = require("js-yaml");
var path = require("path");
var fs = require("fs");
var exec = require('child_process').exec;

gulp.task("swagger", function () {
	var doc = yaml.safeLoad(fs.readFileSync(path.join(__dirname, "../api/swagger/swagger.yaml")));
	fs.writeFileSync(
		path.join(__dirname, "../public/swagger.json"),
		JSON.stringify(doc, null, " ")
	);
});

gulp.task('swagger-edit', function (cb) {
    exec('swagger project edit', function (err, stdout, stderr) {
        console.log(stdout);
        console.log(stderr);
        cb(err);
    });
})
var config       = require('../config')
if(!config.tasks.html) return

var browserSync  = require('browser-sync')
var data         = require('gulp-data')
var gulp         = require('gulp')
var gulpif       = require('gulp-if')
var handleErrors = require('../lib/handleErrors')
var htmlmin      = require('gulp-htmlmin')
var path         = require('path')
var render       = require('gulp-nunjucks-render')
var fs           = require('fs')

var exclude = path.normalize('!**/{' + config.tasks.html.excludeFolders.join(',') + '}/**');

var getData = function(langFolder) {
  var dataPath = path.resolve(config.root.src, config.tasks.html.src, 'content/' + langFolder + '.json')
  return JSON.parse(fs.readFileSync(dataPath, 'utf8'))
}

var compileLanguageTask = function(language) {
  var src = [path.join(config.root.src, config.tasks.html.src, '/**/*.{' + config.tasks.html.extensions + '}'), exclude];
  var dest = path.join(config.root.dest, config.tasks.html.dest, language);

  return gulp.src(src)
    .pipe(data(getData(language)))
    .on('error', handleErrors)
    .pipe(render({
      path: [path.join(config.root.src, config.tasks.html.src)],
      envOptions: {
        watch: false
      }
    }))
    .on('error', handleErrors)
    .pipe(gulpif(global.production, htmlmin(config.tasks.html.htmlmin)))
    .pipe(gulp.dest(dest))
    .on('end', browserSync.reload)
}

var languages = ["en", "fr"];
var htmlLangTask = function() {
  languages.forEach(function(langString) {
    compileLanguageTask(langString);
  });
}

gulp.task('html', htmlLangTask)
module.exports = htmlLangTask

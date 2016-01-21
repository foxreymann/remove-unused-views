var walk = require('walk');
const exec = require('child_process').exec;
var views = [];
var removedCounter = 0;
var removedNames = '';

// Walker options
var walker  = walk.walk('../roxhill-docker/src/roxhill-app/src/scripts/views', { followLinks: false });

walker.on('file', function(root, stat, next) {
  // Add this file to the list of views
  views.push(root + '/' + stat.name);
  next();
});

walker.on('end', function() {
  viewsCount = views.length;
  views.forEach(function(view, index) {
    grep(view);
  });
});

function grep(view) {
    var search = '\'' + view.substring(46, view.indexOf('.js')) + '\'',
        dir = '../roxhill-docker/src/roxhill-app/src/scripts',
        cmd = 'git grep "' + search + '"',
        options = {
          cwd: dir
        };

    const child = exec(cmd, options,
      (error, stdout, stderr) => {
        if(!stdout.length && error) {
            removeView(view);
            removeTemplate(view);
        }
    });
}

function removeView(view) {
    var cmd = 'rm ' + view,
        viewName = view.substring(38, view.indexOf('.js'));

    const child = exec(cmd,
      (error, stdout, stderr) => {
        if(!error) {
          removedCounter++;
          removedNames = removedNames + viewName + '\n';
        }
//        done();
    });
}

function removeTemplate(view) {
    var cmd = 'rm ',
        template = view.substring(0, view.indexOf('.js')).replace(/\/srcipts\/view/, /\/templates/) + '.html';

console.log(template);
    const child = exec(cmd + template,
      (error, stdout, stderr) => {
    });
}

function done() {
  console.log('no of views: ' + viewsCount);
  console.log('to remove ' + removedCounter);
  console.log(removedNames);
}

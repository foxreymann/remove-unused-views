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
    var search = view.substring(38, view.indexOf('.html')) + '\'',
        dir = '../roxhill-docker/src/roxhill-app/src/scripts/views',
        cmd = 'git grep "' + search + '"',
        options = {
          cwd: dir
        };

    const child = exec(cmd, options,
      (error, stdout, stderr) => {
        if(!stdout.length && error) {
            remove(view);
        }
    });
}

function remove(view) {
    var cmd = 'rm ' + view,
        viewName = view.substring(38, view.indexOf('.html'));

    const child = exec(cmd,
      (error, stdout, stderr) => {
        if(!error) {
          removedCounter++;
          removedNames = removedNames + viewName + '\n';
        }
        done();
    });
}

function done() {
  console.log('no of views: ' + viewsCount);
  console.log('to remove ' + removedCounter);
  console.log(removedNames);
}

var test = require('tape');
var ghe = require('./src/ghembedder');

test('accepts a node', function(t) {
  var el = nodeMaker({
    ghuserrepo: 'jquery/jquery',
    ghpath: 'src/core.js',
    ghlines: '4-10'
  })

  document.body.appendChild(el);
  ghe.load(el, function(err, library) {
    t.ifError(err);
    t.ok(el.innerHTML.length > 0);
    t.end();
  });
})

function nodeMaker(data) {
  var el = document.createElement('div');
  Object.keys(data).forEach(function(k) {
    el.setAttribute('data-' + k, data[k]);
  })
  return el;
}
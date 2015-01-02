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

test('escapes html entities', function(t) {
  var el = nodeMaker({
    ghuserrepo: 'facebook/react',
    ref: '4e5f5df4f6895ce4753d47b84c5e4ab9288c87ff',
    ghpath: 'examples/basic-jsx/index.html',
    ghlines: '1-4'
  })

  document.body.appendChild(el);
  ghe.load(el, function(err, library) {
    t.ifError(err);
    t.ok(el.innerHTML.match(/&lt;!DOCTYPE html&gt;/), '<!DOCTYPE html> becomes &lt;!DOCTYPE html&gt;');
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
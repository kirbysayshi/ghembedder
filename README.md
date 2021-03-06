# ghembedder

Embed any source file (or specific lines) from any public github repo in your page, with no server-side dependencies. Include [google-code-prettify][] (prettyPrint) for pretty colors!


## Getting Started

Download the [production version][min] or the [development version][max]. You may also want `prettify.js` and `prettify.css` from [google-code-prettify][]. It is not required, but if present will allow for syntax highlighting. 

	<!-- probaby just before closing body tag... -->
	<script src="path/to/gheembedder.min.js" type="text/javascript"></script>

	<div 
		data-ghuserrepo="jquery/jquery"
		data-ghpath="src/core.js"
		data-ghlines="743-768"></div>

	// somewhere after/during DOMReady
	ghembedder.autoload(); // requires browser to have EITHER document.querySelectorAll OR jquery 

	// OR

	// single specific instance (after page load, for example)
	ghembedder.load( document.querySelectorAll('div')[0] ); 

This will load lines 743-768 of src/core.js (jQuery.proxy) from the jquery repo!

## Demo

See [http://jsbin.com/suyela](http://jsbin.com/suyela) for a live working demo.

## Documentation

### ghembedder.autoload()
Find, read, and load all DOM nodes that have a `[gh-path]` attribute. Requires `document.querySelectorAll` or `jQuery`.
 
### ghembedder.load( cfg || DOMNode )
Given a DOM node, load a Github file. The DOM node requires a few `data-*` attributes, which are defined in the examples below. Internally, `ghembedder` turns the node into the following configuration object, which can also be passed to this method:

	{
		path: 'src/ghembedder.js'				// path relative to git repo root
		,userrepo: 'kirbysayshi/ghembedder'		// username/reponame
		,ref: 'master'							// ref id (sha), defaults to master
		,lineBegin: -1							// include all lines
		,lineEnd: -1							// include all lines 
		,el: el									// DOM node to embed within 
		,fileName: 'ghembedder.js'				// filename (used for anchor links internally)
		,tabSize: 4								// how many spaces a tab should equal
		,annotate: Boolean						// include link and line numbers at end of embedding
		,lang: 'lang-js'						// prettyPrint: which language to use for highlighting
		,linenos: Boolean						// prettyPrint: include line numbers
	}
   
I recommend always using a DOM node when possible for ease of use.

## Examples

All possible `data-*` attributes: 

	<div 
		data-ghpath=""			<!-- required, String: path to file, repo-relative -->
		data-ghuserrepo=""		<!-- required, String: username/reponame -->
		data-ghref=""			<!-- optional, String: provide a specific ref, defaults to master -->
		data-ghlines=""			<!-- optional, String: which lines to display (not specified == all), e.g.: 34-90 -->
		data-ghtabsize=""		<!-- optional, Number: how many spaces a tab character should occupy, defaults to 4 -->
		data-ghannotate=""		<!-- optional, Boolean: Display short filename, lines x-X, link to source -->
		data-ghlinenos=""		<!-- optional, prettyPrint, Boolean: display line numbers -->
		data-ghlang=""			<!-- optional, prettyPrint, String: which language to use for highlighting e.g.: lang-js -->
	></div>

Load lines 743-768 from `src/core.js` of the jQuery repo `@ 714b8ffd2b28af446fea8f25e369597d7c509cb4`

	<div 
		data-ghuserrepo="jquery/jquery"
		data-ghpath="/src/core.js"
		data-ghref="714b8ffd2b28af446fea8f25e369597d7c509cb4"
		data-ghlines="743-768"></div>

Load all lines from `src/ghembedder.js`:

	<div 
		data-ghpath="src/ghembedder.js"
		data-ghuserrepo="kirbysayshi/ghembedder"
	></div>

Load lines 340-350 from `src/ghembedder.js`:

	<div 
		data-ghpath="src/ghembedder.js"
		data-ghuserrepo="kirbysayshi/ghembedder"
		data-ghlines="340-350"
	></div>

load all lines from `src/ghembedder.js`, add annotation:

	<div 
		data-ghpath="src/ghembedder.js"
		data-ghuserrepo="kirbysayshi/ghembedder"
		data-ghannotate="true"
	></div>

load all lines from `src/ghembedder.js`, use line numbers (requires [google-code-prettify][]:

	<div 
		data-ghpath="src/ghembedder.js"
		data-ghuserrepo="kirbysayshi/ghembedder"
		data-ghlinenos="true"
	></div>

## Contributing
Please don't edit files in the "dist" subdirectory as they are generated. You'll find source code in the "src" subdirectory! 

- `npm install`

To run tests via zuul / phantomjs:

- `npm test`

To run tests in an actual browser:

- `npm run test-debug`

To build:

- `npm run dist`

## Release History

- 1.0.0: Remove btoa/atob shim. Always html escape content.
- 0.1.1: Basic html escaping if extension matches `.htm|.html`
- 0.1.0: initial release

## License

MIT

## Thanks

[google-code-prettify]: https://code.google.com/p/google-code-prettify/
[min]: https://raw.github.com/kirbysayshi/ghembedder/master/dist/ghembedder.min.js
[max]: https://raw.github.com/kirbysayshi/ghembedder/master/dist/ghembedder.js
[base64]: http://code.google.com/p/stringencoders/source/browse/trunk/javascript/base64.js?r=230

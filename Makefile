browserify: mapparserstream.js
	cat browserifyshim.js | browserify -s streampack > mapparserstream-browserified.js

minbrowserify: browserify
	uglifyjs mapparserstream-browserified.js -c -o mapparserstream-browserified.min.js

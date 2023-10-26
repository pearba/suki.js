/**
 * suki.js NPM pkg for Node, Deno & Bun
 */

const runtime = 'undefined' !== typeof Deno && 'deno' || 'undefined' !== typeof Bun && 'bun' || 'node'
,	isDeno = 'deno'===runtime
,	sjsFile = isDeno ? '' : __dirname + '/cjs-sjs-' + runtime + '.min.js.gz'
,	vm = require('node:vm')
,	zlib = require('node:zlib')
,	fs = require('node:fs')
,	path = require('node:path')
;

var includeFile = gz_file => {
		var exports = {}
		,	module = { exports }
		;
		vm.runInThisContext(
			wrapModule(
				zlib.gunzipSync(
					fs.readFileSync(
						path.normalize(gz_file)
					)
				).toString()
			)
		)(exports, require, module, __filename, __dirname);
		return module.exports;
	}
,	wrapModule = cjs_str => '(function (exports, require, module, __filename, __dirname) {' + cjs_str + '})'
,	sjs = isDeno ? require('./cjs-sjs-deno.min.js') : includeFile(sjsFile) //optimization for deno CDN
;

module.exports = sjs;

sjs.include = (lib_name, lib_file) => {
	try
	{
		sjs[lib_name] = '.gz'===lib_file.slice(-3) ? includeFile(lib_file) : require(lib_file);
	}
	catch (e)
	{
		console.error('include ' + lib_name + 'failed.', e.stack);
	}
};

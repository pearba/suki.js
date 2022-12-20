//Requires Deno version 1.29+ for Deno runtime

var LIB_FILE = __dirname + '/sjs.gz'
,	vm = require('vm')
,	mod = require('module')
,	zlib = require('zlib')
,	fs = require('fs')
,	path = require('path')
,	include_gz
,	sjs
;

include_gz = gz_file => {
	let exports = {}
	,	module = {exports}
	;
	vm.runInThisContext(
		mod.wrap(
			zlib.gunzipSync(
				fs.readFileSync(
					path.normalize(gz_file)
				)
			).toString()
		)
	)(exports, require, module, __filename, __dirname);
	return module.exports;
};

sjs = module.exports = include_gz(LIB_FILE);

sjs.include = (lib_name, lib_file) => {
	try
	{
		sjs[lib_name] = '.gz'===lib_file.slice(-3) ? include_gz(lib_file) : require(lib_file);
	}
	catch (e)
	{
		console.log('include ' + lib_name + 'failed./n/n' + e.stack);
	}
};

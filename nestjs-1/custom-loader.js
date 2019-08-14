const Module = require('module');
const path = require('path');
const config = require('./tsconfig.json');

if (config.compilerOptions == null) return;
if (config.compilerOptions.paths == null) return;

for (let path of Object.keys( config.compilerOptions.paths )) {

  if (path.substring(path.length - 4) === '**/*') {
    console.warn(`custom-loader.js: '**/*' ending at tsconfig.json is not supported. '${path}'`);
    return;
  }

  if (config.compilerOptions.paths[path].length !== 1) {
    console.warn(`custom-loader.js: multiple values at tsconfig.json are not supported. [${config.compilerOptions.paths[path]}]`);
    return;
  }
}

const customPaths = {
  "@src/": path.resolve(path.join(__dirname, 'src')) + '/',
  "@module/": path.resolve(path.join(__dirname, 'src', 'module')) + '/'
}

const originalResolveFilename = Module._resolveFilename;
Module._resolveFilename = function (request, _parent) {

  for (let key of Object.keys(customPaths)) {
    if (request.startsWith(key)) {

      const ref = customPaths[key] + request.substring(key.length);

      const modifiedArguments = [ref, ...[].slice.call(arguments, 1)];
      return originalResolveFilename.apply(this, modifiedArguments);
    }
  }
  return originalResolveFilename.apply(this, arguments);
}

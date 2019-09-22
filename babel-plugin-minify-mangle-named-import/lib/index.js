/**
 * @param {import('@babel/traverse').Scope} scope
 */
function generateMangleName(scope) {
  for (let number = 0; true; number++) {
    const name = number.toString(36).replace(/[0-9]/g, (n) => 'ABCDEFGHIJ'[+n]);

    if (scope.hasBinding(name)) {
      continue;
    }

    return name;
  }
}

/**
 * @return {import('@babel/core').PluginObj}
 */
module.exports = function() {
  return {
    name: 'minify-mangle-named-import',
    visitor: {
      ImportSpecifier(path) {
        const scope = path.scope;
        const localName = path.node.local.name;
        const mangleName = generateMangleName(scope);
        scope.rename(localName, mangleName);
      },
    },
  };
};

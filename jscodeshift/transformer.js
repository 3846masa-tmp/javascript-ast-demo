/**
 * @param {import('ast-types/lib/scope').Scope} currentScope
 * @param {string} variableName
 */
function isDeclaredInLocalScope(currentScope, variableName) {
  const declaredScope = currentScope.lookup(variableName);
  return declaredScope && !declaredScope.isGlobal;
}

/**
 * @param {import('jscodeshift').Identifier} node
 * @param {import('jscodeshift').ASTNode} parentNode
 */
function isNonPropertyKeyIdentifier(node, parentNode) {
  // Property key
  if (parentNode.type === 'Property' && parentNode.key === node) {
    return parentNode.computed;
  }
  // MemberExpression property
  if (parentNode.type === 'MemberExpression' && parentNode.property === node) {
    return parentNode.computed;
  }
  // ClassProperty key
  if (parentNode.type === 'ClassProperty' && parentNode.key === node) {
    return parentNode.computed;
  }
  // MethodDefinition key
  if (parentNode.type === 'MethodDefinition' && parentNode.key === node) {
    return parentNode.computed;
  }
  // JSXAttribute name
  if (parentNode.type === 'JSXAttribute' && parentNode.name === node) {
    return parentNode.computed;
  }

  return true;
}

/**
 * @param {import('jscodeshift').FileInfo} file
 * @param {import('jscodeshift').API} api
 * @param {*} _options
 */
module.exports = function(file, api, _options) {
  const j = api.jscodeshift;
  const root = j(file.source);

  root
    .find(j.ImportSpecifier)
    .filter(({ node }) => node.imported.name !== node.local.name)
    .filter(({ node, scope }) => {
      const importedName = node.imported.name;

      if (scope.declares(importedName)) {
        return false;
      }
      return true;
    })
    .filter(({ node }) => {
      const importedName = node.imported.name;
      const localName = node.local.name;

      const isConflictedInLocalScope =
        root
          .find(j.Identifier, { name: localName })
          .filter(({ node, parent: { node: parentNode } }) => {
            return isNonPropertyKeyIdentifier(node, parentNode);
          })
          .filter(({ scope }) => {
            return isDeclaredInLocalScope(scope, importedName);
          })
          .size() !== 0;

      return !isConflictedInLocalScope;
    })
    .forEach(({ node }) => {
      const importedName = node.imported.name;
      const localName = node.local.name;

      node.local = undefined;

      root
        .find(j.Identifier, { name: localName })
        .filter(({ node, parent: { node: parentNode } }) => {
          return isNonPropertyKeyIdentifier(node, parentNode);
        })
        .filter(({ scope }) => {
          return !isDeclaredInLocalScope(scope, localName);
        })
        .forEach(({ node }) => {
          node.name = importedName;
        });
    });

  return root.toSource();
};

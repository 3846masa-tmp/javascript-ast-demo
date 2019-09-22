/**
 * @param {import('eslint').Scope.Scope} currentScope
 * @param {string} variableName
 */
function isDeclaredInScopeOrUpper(currentScope, variableName) {
  for (let scope = currentScope; scope !== null; scope = scope.upper) {
    if (scope.variables.some(({ name }) => name === variableName)) {
      return true;
    }
  }
  return false;
}

/**
 * @type {import('eslint').Rule.RuleModule}
 */
const NoAliasImportRule = {
  meta: {
    fixable: 'code',
  },
  create(context) {
    return {
      /** @param {import('estree').ImportSpecifier} node */
      ImportSpecifier(node) {
        const importedName = node.imported.name;
        const localName = node.local.name;

        if (importedName === localName) {
          return;
        }

        const [variable] = context.getDeclaredVariables(node);
        const replaceable = variable.references.every((ref) => {
          const scope = ref.from;
          return !isDeclaredInScopeOrUpper(scope, importedName);
        });

        if (!replaceable) {
          return;
        }

        context.report({
          node,
          message: 'An alias import is not allowed.',
          fix(fixer) {
            return [
              fixer.replaceText(node, importedName),
              ...variable.references.map(({ identifier }) =>
                fixer.replaceText(identifier, importedName),
              ),
            ];
          },
        });
      },
    };
  },
};

module.exports = {
  rules: {
    'no-alias-import': NoAliasImportRule,
  },
};

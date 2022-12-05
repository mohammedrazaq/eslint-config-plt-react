/* eslint-disable */
/* istanbul ignore file */
const classNameHashMap = {
  'pl-': 'pis-',
  'pr-': 'pie-',
  'ml-': 'mis-',
  'mr-': 'mie-',
  '-pl-': '-pis-',
  '-pr-': '-pie-',
  '-ml-': '-mis-',
  '-mr-': '-mie-',
  'float-left': 'float-start',
  'float-right': 'float-end',
  'text-left': 'text-start',
  'text-right': 'text-end',
  'left-': 'inline-start-',
  'right-': 'inline-end-',
  '-left-': '-inline-start-',
  '-right-': '-inline-end-',
  'space-x-': 'space-i-',
  '-space-x-': '-space-i-',
  'border-l-': 'border-is-',
  'border-r-': 'border-ie-'
};

const deprecatedClasses = Object.keys(classNameHashMap);

/**
 * Gets the string value of a template literal
 * @param {*} expression The AST template literal expression
 * @returns {string} The resultant string
 */
function getTemplateLiteral(expression) {
  if (!expression.quasis) return '';

  return expression.quasis[0].value.raw;
}

/**
 * Returns a string of space seperated object key namesx
 * @param {*[]} properties The AST properties array from an ObjectExpression
 * @returns {string} The resultant string
 */
function getObjectKeys(properties) {
  return properties
    .map((prop) => {
      if (prop.key.type === 'Identifier') {
        return prop.key.name;
      }

      if (prop.key.type === 'Literal') {
        return prop.key.value;
      }
    })
    .join(' ');
}

/**
 * Returns a string of space seperated values of all the class names
 * @param {*} node The AST JSXAttribute node
 * @returns {string} A string of space seperated values
 */
function getClassNames(node) {
  if (!['className', 'classes'].includes(node.name.name)) {
    return '';
  }

  if (node.value.type === 'Literal') {
    return node.value.value;
  }

  if (node.value.type === 'JSXExpressionContainer') {
    if (node.value.expression.type === 'TemplateLiteral') {
      return getTemplateLiteral(node.value.expression);
    }

    if (node.value.expression.type === 'CallExpression') {
      return node.value.expression.arguments
        .map((arg) => {
          if (arg.type === 'Literal') {
            return arg.value;
          }

          if (arg.type === 'TemplateLiteral') {
            return getTemplateLiteral(arg);
          }

          if (arg.type === 'ObjectExpression') {
            return getObjectKeys(arg.properties);
          }

          return '';
        })
        .join(' ');
    }
  }

  return '';
}

/**
 * Given a deprecated className, will lookup the hash map and return the suggested replacement
 * @param {string} className The deprecated className used
 * @returns {string} The suggested replacement className
 */
function getSuggestedClass(className) {
  let prefix = '';

  // If className has a responsive prefix
  if (className.includes(':')) {
    const [pre, cls] = className.split(':');
    prefix = `${pre}:`;
    // eslint-disable-next-line
    className = cls;
  }

  if (classNameHashMap[className]) {
    return `${prefix}${classNameHashMap[className]}`;
  }

  // If className ends with `-X` where X is an integer, e.g 'ml-2'
  // Then return the suggested className with the same integer
  if (/.+-[0-9]$/.test(className)) {
    const num = className[className.length - 1];
    const key = className.slice(0, className.length - 1);
    return `${prefix}${classNameHashMap[key]}${num}`;
  }
  return '';
}

module.exports = {
  meta: {
    messages: {
      replaceClass:
        '`{{deprecatedClass}}` is not RTL friendly, consider replacing it with `{{suggestedClass}}`'
    }
  },
  create(context) {
    return {
      JSXAttribute(node) {
        // Convert the space seperated values to an array and drop all the leading/trailing whitespace
        const classNames = getClassNames(node).split(' ').filter(Boolean);

        // Check if any classNames used are deprecated
        const deprecatedClassNamesUsed = classNames.filter((name) =>
          deprecatedClasses.some((depName) => {
            const regexpStr = `^[s|m|l|x]?[m|d|g|l]?:?${depName}[0-9]?$`;
            const regexp = new RegExp(regexpStr, 'i');
            return regexp.test(name);
          })
        );

        // If no deprecated classNames then return
        if (!deprecatedClassNamesUsed.length) {
          return;
        }

        const deprecatedClass = deprecatedClassNamesUsed[0];
        const suggestedClass = getSuggestedClass(deprecatedClass);

        // Fire linting rule
        context.report({
          node,
          messageId: 'replaceClass',
          data: { deprecatedClass, suggestedClass }
        });
      }
    };
  }
};

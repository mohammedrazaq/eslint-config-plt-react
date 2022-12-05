/* eslint-disable */
/* istanbul ignore file */
const INGORE_STRINGS = ['icon-', 'fa-', 'grid-cols-'];

function validateTemplateLiteral(context, node, expression) {
  if (!expression.quasis) return;

  if (expression.quasis.length <= 1) return;

  let isValid = true;
  const problemStrings = [];

  expression.quasis.forEach((stringPart, i) => {
    const stringPartValue = stringPart.value.raw;
    const startsWithSpace = stringPartValue[0] === ' ';
    const endsWithSpace = stringPartValue[stringPartValue.length - 1] === ' ';
    const ignoreEnding = INGORE_STRINGS.map((i) =>
      stringPartValue.endsWith(i)
    ).some(Boolean);

    if (stringPartValue.length > 1) {
      if (i === 0) {
        if (!endsWithSpace && !ignoreEnding) {
          isValid = false;
          problemStrings.push(stringPartValue);
        }
      } else if (i === expression.quasis.length - 1) {
        if (!startsWithSpace) {
          isValid = false;
          problemStrings.push(stringPartValue);
        }
      } else if (!startsWithSpace || (!endsWithSpace && !ignoreEnding)) {
        isValid = false;
        problemStrings.push(stringPartValue);
      }
    }
  });

  if (!isValid) {
    context.report({
      node,
      message: `Do not use string interpolation for class names. We use PurgeCSS to remove
      unused classes by scanning files for matching full classes,partial strings will be removed.
      If you must use interpolation then add all of the possibilities to the PurgeCSS config in
      postcss.config.js. "${problemStrings}"`
    });
  }
}

module.exports = {
  create(context) {
    return {
      CallExpression(node) {
        if (node.callee.name === 'clsx') {
          if (node.arguments.length) {
            node.arguments.forEach((arg) => {
              if (arg.type === 'TemplateLiteral') {
                validateTemplateLiteral(context, node, arg);
              }
            });
          }
        }
      },
      JSXAttribute(node) {
        if (!['className', 'classes'].includes(node.name.name)) {
          return;
        }

        if (node.value.type === 'JSXExpressionContainer') {
          if (node.value.expression.type === 'TemplateLiteral') {
            validateTemplateLiteral(context, node, node.value.expression);
          }

          if (node.value.expression.type === 'CallExpression') {
            node.value.expression.arguments.forEach((arg) => {
              if (arg.type === 'TemplateLiteral') {
                validateTemplateLiteral(context, node, arg);
              }
            });
          }
        }
      }
    };
  }
};

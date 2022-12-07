const RuleTester = require("eslint").RuleTester;
const rule = require("../../../lib/rules/no-interpolated-classes");

const ruleTester = new RuleTester();

const common = {
  parserOptions: {
    ecmaVersion: 2020,
    ecmaFeatures: { jsx: true },
    sourceType: "module",
  },
};

ruleTester.run("no-interpolated-classes-rule", rule, {
  valid: [
    {
      code:
        "export default function() { return <MyComponent className={`m-1`} />; }",
      ...common,
    },
    {
      code:
        "export default function() { return <MyComponent className={`icon-${size}`} />; }",
      ...common,
    },
    {
      code:
        "export default function() { return <MyComponent className={`fa-${icon}`} />; }",
      ...common,
    },
    {
      code:
        "export default function() { return <MyComponent className={`grid-cols-${number}`} />; }",
      ...common,
    },
  ],

  invalid: [
    {
      code:
        "export default function() { return <MyComponent className={`text-${size}`} />; }",
      errors: [
        {
          message: `Do not use string interpolation for class names. We use PurgeCSS to remove
      unused classes by scanning files for matching full classes,partial strings will be removed.
      If you must use interpolation then add all of the possibilities to the PurgeCSS config in
      postcss.config.js. "text-"`,
        },
      ],
      ...common,
    },
  ],
});

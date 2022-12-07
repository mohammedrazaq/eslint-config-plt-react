const RuleTester = require("eslint").RuleTester;
const rule = require("../../../lib/rules/prefer-logical");

const ruleTester = new RuleTester();

const common = {
  parserOptions: {
    ecmaVersion: 2020,
    ecmaFeatures: { jsx: true },
    sourceType: "module",
  },
};

ruleTester.run("prefer-logical-rule", rule, {
  valid: [
    {
      code:
        'export default function() { return <MyComponent className="foo" />; }',
      ...common,
    },
    {
      code:
        'export default function() { return <MyComponent className="foo bar" />; }',
      ...common,
    },
    {
      code:
        "export default function() { return <MyComponent className={`foo bar`} />; }",
      ...common,
    },
    {
      code:
        'export default function() { return <MyComponent className={classnames("foo bar", { baz: true })} />; }',
      ...common,
    },
  ],

  invalid: [
    {
      code:
        'export default function() { return <MyComponent className="ml-1" />; }',
      errors: [
        {
          message:
            "`ml-1` is not RTL friendly, consider replacing it with `mis-1`",
        },
      ],
      ...common,
    },
    {
      code:
        "export default function() { return <MyComponent className={`ml-1`} />; }",
      errors: [
        {
          message:
            "`ml-1` is not RTL friendly, consider replacing it with `mis-1`",
        },
      ],
      ...common,
    },
    {
      code:
        'export default function() { return <MyComponent className={classnames("foo bar", { "ml-1": true })} />; }',
      errors: [
        {
          message:
            "`ml-1` is not RTL friendly, consider replacing it with `mis-1`",
        },
      ],
      ...common,
    },
    {
      code:
        'export default function() { return <MyComponent className="sm:ml-1" />; }',
      errors: [
        {
          message:
            "`sm:ml-1` is not RTL friendly, consider replacing it with `sm:mis-1`",
        },
      ],
      ...common,
    },
    {
      code:
        'export default function() { return <MyComponent className="md:ml-1" />; }',
      errors: [
        {
          message:
            "`md:ml-1` is not RTL friendly, consider replacing it with `md:mis-1`",
        },
      ],
      ...common,
    },
    {
      code:
        'export default function() { return <MyComponent className="xl:ml-1" />; }',
      errors: [
        {
          message:
            "`xl:ml-1` is not RTL friendly, consider replacing it with `xl:mis-1`",
        },
      ],
      ...common,
    },
    {
      code:
        'export default function() { return <MyComponent className="-ml-1" />; }',
      errors: [
        {
          message:
            "`-ml-1` is not RTL friendly, consider replacing it with `-mis-1`",
        },
      ],
      ...common,
    },
  ],
});

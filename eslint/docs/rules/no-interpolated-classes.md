# JSX classNames should not use interpolation

If JSX element includes `className` or, it is checked to make sure that only full class names are used.
As we use PurgeCSS to remove unused classes, those which use string templates will get removed.

## Rule Details

An Example which will give a warning

```jsx
// component.jsx - uses the margin-left class instead of margin-inline-start
export default function () {
  return <div className={`box-${variant}`} />;
}
```

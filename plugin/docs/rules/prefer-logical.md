# JSX classNames prefer CSS logical properties

If JSX element includes `className`, it is checked to contain non-RTL freidnly tailwind classes.
If a non-RTL friendly class is used, then it will suggest the CSS logical property replacement.

This plugin accounts for responsive prefixes such `md:pl-1` and negative prefixes such as `-pl-1`.

## Rule Details

The following patterns are considered warnings:

```jsx
// component.jsx - uses the margin-left class instead of margin-inline-start
export default function() {
	return <div className="ml-1" />;
}

// component.jsx - uses the text-left class instead of text-start
export default function() {
	return (
		<div className="text-left">
	);
}
```

## Deprecated classes with replacement

| Deprecated  | Replacement   |
| ----------- | ------------- |
| pl-         | pis-          |
| pr-         | pie-          |
| ml-         | mis-          |
| mr-         | mie-          |
| text-left   | text-start    |
| text-right  | text-end      |
| float-left  | float-start   |
| float-right | float-end     |
| left-       | inline-start- |
| right-      | inline-end-   |

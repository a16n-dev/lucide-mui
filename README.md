<p align="center" dir="auto">
<img src="https://github.com/easyrent-club/lucide-mui/assets/39721828/1f05c0a2-040f-4e82-a6db-c41741f88fcb)" width="200"  />
</p>

# Lucide Icons for MUI
This package provides [Lucide icons](https://lucide.dev/) as react components designed for use with [Material UI](https://mui.com/material-ui/), so that they can be used in the same way icons from `@mui/icons-material` are used.

## Installation
You can use either npm or yarn:

Using npm:

```bash
npm install --save lucide-mui
```
Using yarn:

```bash
yarn add lucide-mui
```
## Usage
`lucide-mui` is built with ES modules so it's completely tree-shakable. Each icon can be imported as a react component.


All icons can be imported using their names from the [Lucide documentation](https://lucide.dev/), converted to PascalCase.
For example, `arrow-left-circle` becomes `ArrowLeftCircle`
```jsx
import { ArrowLeftCircle } from 'lucide-mui';
```
You can then use these icons anywhere as you would material icons

```jsx
<Button startIcon={<ArrowLeftCircle/>}>Click me</Button>
```

They also support all props of the [`SvgIcon` Material UI component](https://mui.com/material-ui/api/svg-icon/):
```jsx
<ArrowLeftCircle color="primary" sx={{mx: 2}}/>
```

## Versioning
This package follows the versioning of Lucide icons

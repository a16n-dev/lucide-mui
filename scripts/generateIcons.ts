import {icons, IconNode} from "lucide";
import {writeFileSync, mkdirSync, rmSync} from "fs";

const toKebabCase = (string: string) => string.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();

const toCamelCase = (string: string) => string.replace(/-([a-z])/g, (g) => g[1].toUpperCase());

const objectToProps = (obj: Record<string, any>) => Object.entries(obj).map(([prop, value]) => `${toCamelCase(prop)}={${JSON.stringify(value)}}`).join(" ")

const DEFAULT_SVG_PROPS = {
    xmlns: "http://www.w3.org/2000/svg",
    width: 24,
    height: 24,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2,
    strokeLinecap: "round",
    strokeLinejoin: "round",
}


const iconDataToReact = (icon: IconNode): string => {

    return `<svg ${objectToProps(DEFAULT_SVG_PROPS)}>${icon.map(([tag, attrs]) => (
        `<${tag} ${objectToProps(attrs)}/>`
    )).join('\n')}</svg>`
}

// The path to generate icons to
const ICON_PATH = "icons";

// start by deleting the src directory (if it exists)
rmSync(`src/${ICON_PATH}`, {recursive: true, force: true});

mkdirSync(`src/${ICON_PATH}`, {recursive: true});

Object.entries(icons).forEach(([iconName, iconContent]) => {

    const iconNameLowerCase = toKebabCase(iconName);

    // filename is icon.ts
    const filename = `src/${ICON_PATH}/${iconNameLowerCase}.tsx`;


    const fileContent = `import {SvgIcon, SvgIconProps} from "@mui/material";
/**
 *  [${iconName} on lucide.dev](https://lucide.dev/icons/${toKebabCase(iconName)})
 */    
const ${iconName} = (props: SvgIconProps) => <SvgIcon {...props}>${iconDataToReact(iconContent)}</SvgIcon>;
    
export default ${iconName};
`
    // write the file to disk
    writeFileSync(filename, fileContent);
});

// generate test file
const testFile = `import '@testing-library/jest-dom'
import {render, screen} from "@testing-library/react";
import { expect, test } from 'vitest'
${Object.entries(icons).map(([iconName]) => `import ${iconName} from "./${ICON_PATH}/${toKebabCase(iconName)}";`).join("\n")}

${Object.entries(icons).map(([iconName]) => `test('${iconName} renders without error', () => {
    render(<${iconName} data-testid={"svg-element"}/>)

    expect(screen.getByTestId('svg-element')).toBeInTheDocument()
})`).join("\n\n")}
`

writeFileSync(`src/icons.test.tsx`, testFile);

// generate barrel file
const barrelExports = Object.entries(icons).map(([iconName]) => `export {default as ${iconName}, default as ${iconName}Icon} from './icons/${toKebabCase(iconName)}';`).join("\n");

writeFileSync(`src/index.ts`, barrelExports);

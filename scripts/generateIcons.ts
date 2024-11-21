import {icons} from "lucide";
import {writeFileSync, mkdirSync, rmSync} from "fs";

type SVGProps = Record<string, string | number>;
type IconNodeChild = readonly [tag: string, attrs: SVGProps];
type IconNode = readonly [tag: string, attrs: SVGProps, children?: IconNodeChild[]];

const toKebabCase = (string: string) => string.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();

const toCamelCase = (string: string) => string.replace(/-([a-z])/g, (g) => g[1].toUpperCase());

const iconDataToReact = (icon: IconNode | IconNodeChild): string => {
    const props = Object.entries(icon[1]).map(([prop, value])=> `${toCamelCase(prop)}={${JSON.stringify(value)}}`).join(" ")
    if(icon[2] === undefined){
        return `<${icon[0]} ${props}/>`
    } else {
        return `<${icon[0]} ${props}>${icon[2].map(iconDataToReact).join("")}</${icon[0]}>`
    }

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

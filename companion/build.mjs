import {readFile,writeFile,mkdir} from 'node:fs/promises';
const root=new URL('./',import.meta.url);
const html=await readFile(new URL('index.html',root),'utf8'),css=await readFile(new URL('style.css',root),'utf8');
const core=(await readFile(new URL('core.mjs',root),'utf8')).replace(/^export /gm,'');
const app=(await readFile(new URL('app.mjs',root),'utf8')).replace(/^import\s*\{[\s\S]*?\}\s*from '\.\/core\.mjs';\n/,'');
await mkdir(new URL('../dist/',root),{recursive:true});
await writeFile(new URL('../dist/MindBridge-Fraction-Workshop.html',root),html.replace(/<link rel="stylesheet" href="style.css"\s*\/?>/,`<style>${css}</style>`).replace('<script type="module" src="app.mjs"></script>',`<script type="module">${core}\n${app}</script>`));
console.log('Built dist/MindBridge-Fraction-Workshop.html');

import '../index.css';
import { App } from './app';
import { assertDefined } from './utils/assert';
// import { deprecatedRendering } from './__deprecated/main';

// deprecatedRendering();

const appRoot = document.getElementById('app');

assertDefined(appRoot, 'Root container - #app, is missing!');

const app = new App(appRoot as HTMLDivElement);
await app.init();
app.run();

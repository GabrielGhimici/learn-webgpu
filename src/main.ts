import '../index.css';
import { Canvas } from './core/canvas';
import { checkWebGPU } from './utils/check-webgpu';
import { renderTriangle } from './core/triangle';
import { renderPrimitives } from './core/primitives';
import { renderTrianglePrimitives } from './core/triangle-primitives';

const appContainer = document.getElementById('app');

if (appContainer) {
  const canvas = new Canvas();
  const htmlCanvas = canvas.element;
  appContainer.appendChild(htmlCanvas);
  checkWebGPU(htmlCanvas);
  await render(htmlCanvas);
} else {
  console.error('There is no app container present.');
}

async function render(canvas: HTMLCanvasElement) {
  const adapter = await navigator.gpu.requestAdapter();
  if (!adapter) {
    throw new Error('Unable to retrieve adapter');
  }
  const device = await adapter.requestDevice();
  const ctx = canvas.getContext('webgpu');
  if (!ctx) {
    throw new Error('Unable to retrieve canvas context!');
  }
  ctx.configure({
    device: device,
    format: navigator.gpu.getPreferredCanvasFormat(),
    alphaMode: 'opaque',
  });
  // renderTriangle(ctx, device);
  // renderPrimitives(ctx, device);
  // renderPrimitives(ctx, device, 'line-list');
  // renderPrimitives(ctx, device, 'line-strip');
  renderTrianglePrimitives(ctx, device);
  // renderTrianglePrimitives(ctx, device, 'triangle-strip');
}

import '../index.css';
import { Canvas } from './core/canvas';
import { checkWebGPU } from './utils/check-webgpu';
import { renderTriangle } from './core/triangle';

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
  const format = navigator.gpu.getPreferredCanvasFormat();
  const ctx = canvas.getContext('webgpu');
  if (!ctx) {
    throw new Error('Unable to retrieve canvas context!');
  }
  ctx.configure({
    device: device,
    format: format,
    alphaMode: 'opaque',
  });
  renderTriangle(ctx, device, format);
}

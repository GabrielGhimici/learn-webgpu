import '../index.css';
import { Canvas } from './core/Canvas';
import { checkWebGPU } from './utils/check-webgpu';
import triangleFragmentShader from './shaders/triangle.frag.wgsl';
import triangleVertexShader from './shaders/triangle.vert.wgsl';

const appContainer = document.getElementById('app');

if (appContainer) {
  const canvas = new Canvas();
  const htmlCanvas = canvas.element;
  appContainer.appendChild(htmlCanvas);
  checkWebGPU(htmlCanvas);
  await renderTriangle(htmlCanvas);
} else {
  console.error('There is no app container present.');
}

async function renderTriangle(canvas: HTMLCanvasElement) {
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

  const pipeline = device.createRenderPipeline({
    layout: 'auto',
    vertex: {
      module: device.createShaderModule({ code: triangleVertexShader }),
      entryPoint: 'main',
    },
    fragment: {
      module: device.createShaderModule({ code: triangleFragmentShader }),
      entryPoint: 'main',
      targets: [
        {
          format: format,
        },
      ],
    },
    primitive: {
      topology: 'triangle-list',
    },
  });

  const commandEncoder = device.createCommandEncoder();
  const textureView = ctx.getCurrentTexture().createView();
  const renderPass = commandEncoder.beginRenderPass({
    colorAttachments: [
      {
        view: textureView,
        clearValue: { r: 0.8, g: 0.8, b: 0.8, a: 1.0 },
        loadOp: 'clear',
        storeOp: 'store',
      },
    ],
  });

  renderPass.setPipeline(pipeline);
  renderPass.draw(3, 1, 0, 0);
  renderPass.end();
  device.queue.submit([commandEncoder.finish()]);
}

import { createBuffer, createIndexBuffer } from '../utils/buffers';
import bufferSquareVertexShader from '../shaders/buffer-square.vert.wgsl';
import bufferSquareFragmentShader from '../shaders/buffer-square.frag.wgsl';

export enum RenderContext {
  TWO_BUFFERS = 'two-buffers',
  ONE_BUFFER = 'one-buffer',
  INDEXED = 'indexed',
}

export const renderSquareWithBuffer = (ctx: GPUCanvasContext, device: GPUDevice, renderContext: RenderContext) => {
  const vertexComponentsLength = 2;
  const colorComponentsLength = 3;
  const stride = 4 * (vertexComponentsLength + colorComponentsLength);
  let buffers: Iterable<GPUVertexBufferLayout | null>;
  let vertexBuffer;
  let colorBuffer;
  let indexBuffer;
  switch (renderContext) {
    case RenderContext.ONE_BUFFER: {
      buffers = [
        {
          arrayStride: stride,
          attributes: [
            {
              shaderLocation: 0,
              offset: 0,
              format: 'float32x2',
            },
            {
              shaderLocation: 1,
              offset: 4 * vertexComponentsLength,
              format: 'float32x3',
            },
          ],
        },
      ];
      const vertexData = new Float32Array([
        -0.5, -0.5, 0.8, 0.5, 0.3, 0.5, -0.5, 0.5, 0.8, 0.3, -0.5, 0.5, 0.3, 0.5, 0.8, -0.5, 0.5, 0.3, 0.5, 0.8, 0.5,
        -0.5, 0.5, 0.8, 0.3, 0.5, 0.5, 0.3, 0.2, 0.5,
      ]);
      vertexBuffer = createBuffer(device, vertexData);
      break;
    }
    case RenderContext.INDEXED: {
      buffers = [
        {
          arrayStride: stride,
          attributes: [
            {
              shaderLocation: 0,
              offset: 0,
              format: 'float32x2',
            },
            {
              shaderLocation: 1,
              offset: 4 * vertexComponentsLength,
              format: 'float32x3',
            },
          ],
        },
      ];
      const vertexData = new Float32Array([
        -0.5, -0.5, 0.8, 0.5, 0.3, 0.5, 0.5, 0.3, 0.2, 0.5, 0.5, -0.5, 0.5, 0.8, 0.3, -0.5, 0.5, 0.3, 0.5, 0.8,
      ]);
      const indexData = new Uint32Array([0, 2, 3, 3, 2, 1]);
      vertexBuffer = createBuffer(device, vertexData);
      indexBuffer = createIndexBuffer(device, indexData);
      break;
    }
    case RenderContext.TWO_BUFFERS:
    default: {
      buffers = [
        {
          arrayStride: 8,
          attributes: [
            {
              shaderLocation: 0,
              offset: 0,
              format: 'float32x2',
            },
          ],
        },
        {
          arrayStride: 12,
          attributes: [
            {
              shaderLocation: 1,
              offset: 0,
              format: 'float32x3',
            },
          ],
        },
      ];
      const vertexData = new Float32Array([-0.5, -0.5, 0.5, -0.5, -0.5, 0.5, -0.5, 0.5, 0.5, -0.5, 0.5, 0.5]);
      const colorData = new Float32Array([
        0.8, 0.5, 0.3, 0.5, 0.8, 0.3, 0.3, 0.5, 0.8, 0.3, 0.5, 0.8, 0.5, 0.8, 0.3, 0.3, 0.2, 0.5,
      ]);

      vertexBuffer = createBuffer(device, vertexData);
      colorBuffer = createBuffer(device, colorData);
      break;
    }
  }

  const pipeline = device.createRenderPipeline({
    layout: 'auto',
    vertex: {
      module: device.createShaderModule({
        code: bufferSquareVertexShader,
      }),
      entryPoint: 'main',
      buffers: buffers,
    },
    fragment: {
      module: device.createShaderModule({
        code: bufferSquareFragmentShader,
      }),
      entryPoint: 'main',
      targets: [{ format: navigator.gpu.getPreferredCanvasFormat() }],
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

  switch (renderContext) {
    case RenderContext.ONE_BUFFER: {
      renderPass.setVertexBuffer(0, vertexBuffer);
      renderPass.draw(6);
      break;
    }
    case RenderContext.INDEXED: {
      renderPass.setVertexBuffer(0, vertexBuffer);
      renderPass.setIndexBuffer(indexBuffer as GPUBuffer, 'uint32');
      renderPass.drawIndexed(6);
      break;
    }
    case RenderContext.TWO_BUFFERS:
    default: {
      renderPass.setVertexBuffer(0, vertexBuffer);
      renderPass.setVertexBuffer(1, colorBuffer as GPUBuffer);
      renderPass.draw(6);
      break;
    }
  }
  renderPass.end();
  device.queue.submit([commandEncoder.finish()]);
};

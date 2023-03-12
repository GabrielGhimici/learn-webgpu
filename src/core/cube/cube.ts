import { createBuffer } from '../../utils/buffers';
import { getVertexData } from './vertex-data';
import cubeVertexShader from '../../shaders/cube.vert.wgsl';
import cubeFragmentShader from '../../shaders/cube.frag.wgsl';
import { createTransforms, createViewProjection } from '../../utils/matrix';
import { mat4 } from 'gl-matrix';

export const renderCube = (ctx: GPUCanvasContext, device: GPUDevice) => {
  const cubeData = getVertexData();
  const numberOfVertices = cubeData.positions.length / 3;
  const vertexBuffer = createBuffer(device, cubeData.positions);
  const colorBuffer = createBuffer(device, cubeData.colors);

  const pipeline = device.createRenderPipeline({
    layout: 'auto',
    vertex: {
      module: device.createShaderModule({
        code: cubeVertexShader,
      }),
      entryPoint: 'main',
      buffers: [
        {
          arrayStride: 12,
          attributes: [
            {
              shaderLocation: 0,
              format: 'float32x3',
              offset: 0,
            },
          ],
        },
        {
          arrayStride: 12,
          attributes: [
            {
              shaderLocation: 1,
              format: 'float32x3',
              offset: 0,
            },
          ],
        },
      ],
    },
    fragment: {
      module: device.createShaderModule({
        code: cubeFragmentShader,
      }),
      entryPoint: 'main',
      targets: [
        {
          format: navigator.gpu.getPreferredCanvasFormat(),
        },
      ],
    },
    primitive: {
      topology: 'triangle-list',
      cullMode: 'back',
    },
    depthStencil: {
      format: 'depth24plus',
      depthWriteEnabled: true,
      depthCompare: 'less',
    },
  });

  const canvasWidth = ctx.canvas.width;
  const canvasHeight = ctx.canvas.height;

  const viewProjectionData = createViewProjection(canvasWidth / canvasHeight);
  const viewProjectionMatrix = viewProjectionData.viewProjectionMatrix;

  const uniformBuffer = device.createBuffer({
    size: 64,
    usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
  });

  const uniformBindGroup = device.createBindGroup({
    layout: pipeline.getBindGroupLayout(0),
    entries: [
      {
        binding: 0,
        resource: {
          buffer: uniformBuffer,
          offset: 0,
          size: 64,
        },
      },
    ],
  });

  const textureView = ctx.getCurrentTexture().createView();

  const depthTexture = device.createTexture({
    size: [canvasWidth, canvasHeight, 1],
    format: 'depth24plus',
    usage: GPUTextureUsage.RENDER_ATTACHMENT,
  });

  const renderPassDescription: GPURenderPassDescriptor = {
    colorAttachments: [
      {
        view: textureView,
        clearValue: { r: 0.1, g: 0.1, b: 0.1, a: 1.0 },
        loadOp: 'clear',
        storeOp: 'store',
      },
    ],
    depthStencilAttachment: {
      view: depthTexture.createView(),
      depthClearValue: 1.0,
      depthLoadOp: 'clear',
      depthStoreOp: 'store',
    },
  };

  const modelMatrix = mat4.create();
  createTransforms(modelMatrix);
  const modelViewProjectionMatrix = mat4.create();
  mat4.multiply(modelViewProjectionMatrix, viewProjectionMatrix, modelMatrix);
  device.queue.writeBuffer(uniformBuffer, 0, modelViewProjectionMatrix as ArrayBuffer);

  const commandEncoder = device.createCommandEncoder();
  const renderPass = commandEncoder.beginRenderPass(renderPassDescription);
  renderPass.setPipeline(pipeline);
  renderPass.setVertexBuffer(0, vertexBuffer);
  renderPass.setVertexBuffer(1, colorBuffer);
  renderPass.setBindGroup(0, uniformBindGroup);
  renderPass.draw(numberOfVertices);
  renderPass.end();

  device.queue.submit([commandEncoder.finish()]);
};

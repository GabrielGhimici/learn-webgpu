import primitiveVertexShader from '../shaders/primitive.vert.wgsl';
import primitiveFragmentShader from '../shaders/primitive.frag.wgsl';
import { clearValue } from '../../utils/constants';

export const renderPrimitives = (
  ctx: GPUCanvasContext,
  device: GPUDevice,
  primitive: Exclude<GPUPrimitiveTopology, 'triangle-list' | 'triangle-strip'> = 'point-list'
) => {
  const pipeline = device.createRenderPipeline({
    layout: 'auto',
    vertex: {
      module: device.createShaderModule({ code: primitiveVertexShader }),
      entryPoint: 'main',
    },
    fragment: {
      module: device.createShaderModule({ code: primitiveFragmentShader }),
      entryPoint: 'main',
      targets: [
        {
          format: navigator.gpu.getPreferredCanvasFormat(),
        },
      ],
    },
    primitive: {
      topology: primitive,
      stripIndexFormat: primitive === 'line-strip' ? 'uint32' : undefined,
    },
  });

  const commandEncoder = device.createCommandEncoder();
  const textureView = ctx.getCurrentTexture().createView();
  const renderPass = commandEncoder.beginRenderPass({
    colorAttachments: [
      {
        view: textureView,
        clearValue: clearValue,
        loadOp: 'clear',
        storeOp: 'store',
      },
    ],
  });

  renderPass.setPipeline(pipeline);
  renderPass.draw(6);
  renderPass.end();
  device.queue.submit([commandEncoder.finish()]);
};

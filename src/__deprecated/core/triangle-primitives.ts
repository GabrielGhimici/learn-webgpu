import trianglePrimitiveVertexShader from '../shaders/triangle-primitive.vert.wgsl';
import trianglePrimitiveFragmentShader from '../shaders/triangle-primitive.frag.wgsl';
import { clearValue } from '../../utils/constants';

export const renderTrianglePrimitives = (
  ctx: GPUCanvasContext,
  device: GPUDevice,
  primitive: Exclude<GPUPrimitiveTopology, 'point-list' | 'line-list' | 'line-strip'> = 'triangle-list'
) => {
  const pipeline = device.createRenderPipeline({
    layout: 'auto',
    vertex: {
      module: device.createShaderModule({ code: trianglePrimitiveVertexShader }),
      entryPoint: 'main',
    },
    fragment: {
      module: device.createShaderModule({ code: trianglePrimitiveFragmentShader }),
      entryPoint: 'main',
      targets: [
        {
          format: navigator.gpu.getPreferredCanvasFormat(),
        },
      ],
    },
    primitive: {
      topology: primitive,
      stripIndexFormat: primitive === 'triangle-strip' ? 'uint32' : undefined,
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
  renderPass.draw(9);
  renderPass.end();
  device.queue.submit([commandEncoder.finish()]);
};

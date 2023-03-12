import triangleFragmentShader from '../shaders/triangle.frag.wgsl';
import triangleVertexShader from '../shaders/triangle.vert.wgsl';
import { clearValue } from '../utils/constants';

export const renderTriangle = (ctx: GPUCanvasContext, device: GPUDevice) => {
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
          format: navigator.gpu.getPreferredCanvasFormat(),
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
        clearValue: clearValue,
        loadOp: 'clear',
        storeOp: 'store',
      },
    ],
  });

  renderPass.setPipeline(pipeline);
  renderPass.draw(3);
  renderPass.end();
  device.queue.submit([commandEncoder.finish()]);
};

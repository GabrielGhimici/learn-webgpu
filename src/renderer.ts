import { Shader } from './shader';
import { assertDefined } from './utils/assert';
import { clearValue } from './utils/constants';
import { RenderState } from './types/render-state';

export class Renderer {
  private _canvas: HTMLCanvasElement | null = null;
  private _adapter: GPUAdapter | null = null;
  private _device: GPUDevice | null = null;
  private _context: GPUCanvasContext | null = null;
  private _format: GPUTextureFormat | null = null;

  constructor() {}

  private get canvas(): HTMLCanvasElement {
    assertDefined(this._canvas, 'Missing root html canvas!');
    return this._canvas;
  }
  private get adapter(): GPUAdapter {
    assertDefined(this._adapter, 'Missing GPU adapter!');
    return this._adapter;
  }
  private get device(): GPUDevice {
    assertDefined(this._device, 'Missing GPU device!');
    return this._device;
  }
  private get context(): GPUCanvasContext {
    assertDefined(this._context, 'Missing GPU canvas context!');
    return this._context;
  }
  private get format(): GPUTextureFormat {
    assertDefined(this._format, 'Missing GPU texture format!');
    return this._format;
  }

  public async init(canvas: HTMLCanvasElement) {
    this._canvas = canvas;
    await this.setupDevice();
  }

  async setupDevice() {
    const adapter = await navigator.gpu.requestAdapter();
    assertDefined(adapter, 'Unable to retrieve GPU adapter!');
    this._adapter = adapter;

    this._device = await this.adapter.requestDevice();

    const context = this.canvas.getContext('webgpu');
    assertDefined(context, 'Unable to retrieve WebGPU context!');
    this._context = context;

    this._format = navigator.gpu.getPreferredCanvasFormat();
    this.context.configure({
      device: this.device,
      format: this.format,
      alphaMode: 'opaque',
    });
  }

  public render(state: RenderState) {
    const pipelines = this.generateRenderPipelines(state);
    const commandEncoder: GPUCommandEncoder = this.device.createCommandEncoder();
    const textureView: GPUTextureView = this.context.getCurrentTexture().createView();
    const renderPass: GPURenderPassEncoder = commandEncoder.beginRenderPass({
      colorAttachments: [
        {
          view: textureView,
          clearValue: clearValue,
          loadOp: 'clear',
          storeOp: 'store',
        },
      ],
    });

    pipelines.forEach((pipeline) => {
      renderPass.setPipeline(pipeline);
      renderPass.draw(3);
    });

    renderPass.end();

    this.device.queue.submit([commandEncoder.finish()]);
  }

  private generateRenderPipelines(state: RenderState) {
    const { objects, shaderLibrary } = state;
    const pipelines = new Map<string, GPURenderPipeline>();
    objects.forEach((object) => {
      if (pipelines.has(object.shaderIdentifier)) return;
      const shader = shaderLibrary.getShader(object.shaderIdentifier);
      assertDefined(shader, 'Failed to retrieve shader data from shader library!');
      const pipeline = this.device.createRenderPipeline({
        layout: 'auto',
        vertex: {
          module: this.device.createShaderModule({ code: shader.vertexCode }),
          entryPoint: 'main',
        },
        fragment: {
          module: this.device.createShaderModule({ code: shader.fragmentCode }),
          entryPoint: 'main',
          targets: [
            {
              format: this.format,
            },
          ],
        },
        primitive: {
          topology: 'triangle-list',
        },
      });
      pipelines.set(shader.identifier, pipeline);
    });
    return pipelines;
  }
}

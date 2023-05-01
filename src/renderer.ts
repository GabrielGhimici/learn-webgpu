import { assertDefined } from './utils/assert';
import { clearValue } from './utils/constants';

export class Renderer {
  private canvas!: HTMLCanvasElement;
  private adapter!: GPUAdapter;
  private device!: GPUDevice;
  private context!: GPUCanvasContext;
  private format!: GPUTextureFormat;

  constructor() {}

  public async init(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    await this.setupDevice();
  }

  async setupDevice() {
    const adapter = await navigator.gpu.requestAdapter();
    assertDefined(adapter, 'Unable to retrieve GPU adapter!');
    this.adapter = adapter;

    this.device = await this.adapter.requestDevice();

    const context = this.canvas.getContext('webgpu');
    assertDefined(context, 'Unable to retrieve WebGPU context!');
    this.context = context;

    this.format = navigator.gpu.getPreferredCanvasFormat();
    this.context.configure({
      device: this.device,
      format: this.format,
      alphaMode: 'opaque',
    });
  }

  public render() {
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

    renderPass.end();

    this.device.queue.submit([commandEncoder.finish()]);
  }
}

import { checkWebGPU } from '../utils/check-webgpu';

export class Canvas {
  private htmlElement: HTMLCanvasElement;

  constructor(private pixelRatio: number = 1) {
    this.htmlElement = document.createElement('canvas');
    this.htmlElement.width = window.innerWidth * this.pixelRatio;
    this.htmlElement.height = window.innerHeight * this.pixelRatio;
    window.addEventListener('resize', this.handleWindowResize.bind(this));
  }

  public get element(): HTMLCanvasElement {
    return this.htmlElement;
  }

  private handleWindowResize() {
    if (this.htmlElement) {
      this.htmlElement.width = window.innerWidth * this.pixelRatio;
      this.htmlElement.height = window.innerHeight * this.pixelRatio;
      checkWebGPU(this.htmlElement);
    }
  }
}

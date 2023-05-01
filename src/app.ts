import { Renderer } from './renderer';
import { Scene } from './scene';

export class App {
  private renderer: Renderer;
  private scene: Scene;
  private canvas: HTMLCanvasElement;
  private pixelRatio: number = 1;

  constructor(private root: HTMLDivElement) {
    this.renderer = new Renderer();
    this.scene = new Scene();
    this.canvas = document.createElement('canvas');
  }

  public async init() {
    if (!this.isWebGPUEnabled()) return;
    this.createHTMLContext();
    await this.renderer.init(this.canvas);
    this.scene.init();
  }

  private isWebGPUEnabled() {
    if (navigator.gpu) return true;
    this.root.classList.add('not-supported');
    const errorMessage = document.createElement('p');
    errorMessage.innerText = 'Your browser does not support WebGPU!';
    errorMessage.classList.add('warning-message');
    this.root.appendChild(errorMessage);
    return false;
  }

  private createHTMLContext() {
    this.canvas.width = window.innerWidth * this.pixelRatio;
    this.canvas.height = window.innerHeight * this.pixelRatio;
    window.addEventListener('resize', () => {
      this.canvas.width = window.innerWidth * this.pixelRatio;
      this.canvas.height = window.innerHeight * this.pixelRatio;
    });
    this.root.appendChild(this.canvas);
  }

  public run() {
    const runLoop = (ts: DOMHighResTimeStamp) => {
      this.renderer.render();
      requestAnimationFrame(runLoop);
    };
    runLoop(0);
  }
}

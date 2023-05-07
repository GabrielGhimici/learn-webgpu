import { Renderer } from './renderer';
import { Scene } from './scene';

export class App {
  private _renderer: Renderer;
  private _scene: Scene;
  private _canvas: HTMLCanvasElement;
  private _pixelRatio: number = 1;

  constructor(private root: HTMLDivElement) {
    this._renderer = new Renderer();
    this._scene = new Scene();
    this._canvas = document.createElement('canvas');
  }

  public async init() {
    if (!this.isWebGPUEnabled()) return;
    this.createHTMLContext();
    await this._renderer.init(this._canvas);
    this._scene.init();
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
    this._canvas.width = window.innerWidth * this._pixelRatio;
    this._canvas.height = window.innerHeight * this._pixelRatio;
    window.addEventListener('resize', () => {
      this._canvas.width = window.innerWidth * this._pixelRatio;
      this._canvas.height = window.innerHeight * this._pixelRatio;
    });
    this.root.appendChild(this._canvas);
  }

  public run() {
    const runLoop = () => {
      this._renderer.render(this._scene.getRenderState());
      requestAnimationFrame(runLoop);
    };
    runLoop();
  }
}

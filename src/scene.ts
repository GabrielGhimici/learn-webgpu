import { Shader, SharedLibrary } from './shader';
import type { RenderState } from './types/render-state';

export class Scene {
  private _shaderLibrary: SharedLibrary;
  private _objects: Array<{ shaderIdentifier: string }> = [];

  constructor() {
    this._shaderLibrary = new SharedLibrary();
  }

  public async init() {
    const shader = await Shader.create(
      `/shaders/triangle.vert.wgsl`,
      '/shaders/triangle.frag.wgsl',
      'Triangle shader '
    );
    this._shaderLibrary.addShader(shader);
    this._objects.push({ shaderIdentifier: shader.identifier });
  }

  public getRenderState(): RenderState {
    return {
      shaderLibrary: this._shaderLibrary,
      objects: this._objects,
    };
  }
}

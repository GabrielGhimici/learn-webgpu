import { Shader } from './shader';

export class SharedLibrary {
  private _library: Map<string, Shader>;

  constructor() {
    this._library = new Map();
  }

  public addShader(shader: Shader) {
    this._library.set(shader.identifier, shader);
  }

  public getShader(identifier: string) {
    if (!this._library.has(identifier)) return null;
    return this._library.get(identifier)!;
  }
}

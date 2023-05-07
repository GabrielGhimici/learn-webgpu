import { assertDefined } from '../utils/assert';

export class Shader {
  private _name: string;
  private _identifier: string | null = null;
  private _vertexCode: string | null = null;
  private _fragmentCode: string | null = null;

  private constructor(shaderName?: string) {
    if (shaderName) {
      this._name = shaderName;
    } else {
      this._name = `Shader ${Date.now()}`;
    }
  }

  static async create(vertexPath: string, fragmentPath: string, name?: string) {
    const shaderInstance = new Shader(name);
    shaderInstance._identifier = await Shader.computeIdentifier(vertexPath, fragmentPath);
    const vertexModule = await fetch(vertexPath);
    shaderInstance._vertexCode = await vertexModule.text();
    const fragmentModule = await fetch(fragmentPath);
    shaderInstance._fragmentCode = await fragmentModule.text();
    return shaderInstance;
  }

  private static async computeIdentifier(vertexPath: string, fragmentPath: string) {
    const textToEncode = `${vertexPath}&${fragmentPath}`;
    const encoder = new TextEncoder();
    const hash = await crypto.subtle.digest('SHA-256', encoder.encode(textToEncode));
    return Array.from(new Uint8Array(hash))
      .map((item) => item.toString(16).padStart(2, '0'))
      .join('');
  }

  public get name() {
    return this._name;
  }

  public get identifier(): string {
    assertDefined(this._identifier, 'Missing identifier!');
    return this._identifier;
  }

  public get vertexCode(): string {
    assertDefined(this._vertexCode, 'Missing vertex shader code!');
    return this._vertexCode;
  }

  public get fragmentCode(): string {
    assertDefined(this._fragmentCode, 'Missing fragment shader code!');
    return this._fragmentCode;
  }
}

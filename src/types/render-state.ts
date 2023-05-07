import { SharedLibrary } from '../shader';

export interface RenderState {
  shaderLibrary: SharedLibrary;
  objects: Array<{ shaderIdentifier: string }>;
}

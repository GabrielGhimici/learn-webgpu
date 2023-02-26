import { checkWebGPU } from './utils/check-webgpu';

const appContainer = document.getElementById('app');
const webGPUMessage = checkWebGPU();

if (appContainer) {
  appContainer.innerText = webGPUMessage;
} else {
  console.log(webGPUMessage);
}

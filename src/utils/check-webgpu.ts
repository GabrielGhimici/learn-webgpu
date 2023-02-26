const checkWebGPU = () => {
  if (!navigator.gpu) {
    return 'Your browser does not support WebGPU. Please make sure you run the app in Chrome Canary and you have the feature activated';
  }
  return 'Your browser supports WebGPU';
};

export { checkWebGPU };

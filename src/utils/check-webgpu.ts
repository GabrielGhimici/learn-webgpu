const checkWebGPU = (canvas: HTMLCanvasElement) => {
  if (!isWebGPUSupported()) {
    canvas.style.backgroundColor = '#808080';
    const canvasHeight = canvas.height;
    const canvasWidth = canvas.width;
    const errorText = 'Your browser does not support WebGPU!';
    const textHeight = 24;
    const textPadding = 16;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.font = `${textHeight}px serif`;
      const { width: textWidth } = ctx.measureText(errorText);
      const textX = canvasWidth / 2 - textWidth / 2;
      const textY = canvasHeight / 2 - textHeight / 2;
      ctx.fillStyle = '#de8c8c';
      const errorBgX = textX - textPadding;
      const errorBgY = textY - 2 * textPadding;
      const errorBgWidth = textWidth + textPadding * 2;
      const errorBgHeight = textHeight + textPadding * 2;
      ctx.fillRect(errorBgX, errorBgY, errorBgWidth, errorBgHeight);
      ctx.strokeStyle = '#a33131';
      ctx.lineWidth = 2;
      ctx.lineJoin = 'round';
      ctx.strokeRect(errorBgX, errorBgY, errorBgWidth, errorBgHeight);
      ctx.fillStyle = '#a33131';
      ctx.fillText(errorText, textX, textY);
    }
    throw new Error(
      'Your browser does not support WebGPU! Please make sure you run the app in Chrome Canary and you have the feature activated'
    );
  }

  console.info('[INFO] Your browser supports WebGPU');
};

const isWebGPUSupported = () => !!navigator.gpu;

export { checkWebGPU, isWebGPUSupported };

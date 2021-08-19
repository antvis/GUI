import { Canvas } from '@antv/g';
import { Switch } from '@antv/gui';
import { Renderer as CanvasRenderer } from '@antv/g-canvas';

const renderer = new CanvasRenderer({
  enableDirtyRectangleRenderingDebug: false,
  enableAutoRendering: true,
  enableDirtyRectangleRendering: true,
});

const canvas = new Canvas({
  container: 'container',
  width: 300,
  height: 100,
  renderer,
});

const simpleSwitch = new Switch({
  style: {
    x: 50,
    y: 50,
  },
});

canvas.appendChild(simpleSwitch);

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
  width: 200,
  height: 200,
  renderer,
});

const defaultSwitch = new Switch({
  style: {
    x: 50,
    y: 50,
  },
});

const smallSwitch2 = new Switch({
  style: {
    x: 50,
    y: 80,
    size: 'small',
  },
});

canvas.appendChild(defaultSwitch);
canvas.appendChild(smallSwitch2);

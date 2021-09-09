import { Canvas } from '@antv/g';
import { Renderer as CanvasRenderer } from '@antv/g-canvas';
import { PolygonCrosshair } from '@antv/gui';

const renderer = new CanvasRenderer({
  enableDirtyRectangleRenderingDebug: false,
  enableAutoRendering: true,
  enableDirtyRectangleRendering: true,
});

const canvas = new Canvas({
  container: 'container',
  width: 600,
  height: 600,
  renderer,
});

const [cx, cy] = [250, 250];
const t1 = Math.cos(Math.PI / 6) * 50;

const polygon = new PolygonCrosshair({
  style: {
    defaultRadius: 50,
    center: [cx, cy],
    sides: 8,
    lineStyle: {
      lineWidth: 2,
    },
  },
});
canvas.appendChild(polygon);

canvas.addEventListener('mousemove', (e) => {
  polygon.setPointer([e.offsetX, e.offsetY]);
});

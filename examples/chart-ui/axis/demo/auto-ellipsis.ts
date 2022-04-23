import { Canvas } from '@antv/g';
import { Renderer as CanvasRenderer } from '@antv/g-canvas';
import { Linear as LinearAxis } from '@antv/gui';

const renderer = new CanvasRenderer({
  enableDirtyRectangleRenderingDebug: false,
  enableAutoRendering: true,
  enableDirtyRectangleRendering: true,
});

const canvas = new Canvas({
  container: 'container',
  width: 1000,
  height: 600,
  renderer,
});

const data = [
  'ABC',
  'FAGAGA',
  'AFAGAG',
  'AFAAG',
  'BCED',
  'DEFGH',
  'GHIJKM',
  'KMLN',
  'OPQ',
  'PQRST',
  'VVW',
  'VWXYZABC',
  'AXDFS',
  'FGFAF',
  'AFAFAGA',
  'FAFA',
  'AFAF',
];
const ticks = data.map((d, idx) => {
  const step = 1 / (data.length - 1);
  return {
    value: step * idx,
    text: String(d),
    id: String(idx),
  };
});

const axis = canvas.appendChild(
  new LinearAxis({
    style: {
      startPos: [50, 60],
      endPos: [400, 60],
      ticks,
      label: {
        autoRotate: false,
        autoEllipsis: true,
        autoHide: true,
        autoHideTickLine: false,
        // 不展示 '...'
        minLength: 14,
        style: (d, i) => ({ fontSize: 12, textAlign: i === 0 ? 'start' : i === ticks.length - 1 ? 'end' : 'center' }),
      },
    },
  })
);
canvas.appendChild(axis);

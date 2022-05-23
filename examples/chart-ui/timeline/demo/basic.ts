import { Canvas, Rect } from '@antv/g';
import { Time } from '@antv/scale';
import { Renderer as CanvasRenderer } from '@antv/g-canvas';
import { Timeline } from '@antv/gui';

const renderer = new CanvasRenderer();

const canvas = new Canvas({
  container: 'container',
  width: 600,
  height: 800,
  renderer,
});

const rectStyle = { width: 400, height: 60, stroke: '#d9d9d9', lineWidth: 1 };
const rect = canvas.appendChild(new Rect({ style: { ...rectStyle, x: 40, y: 40 } }));

export const TIME_DATA = (() => {
  const scale = new Time({
    tickCount: 10,
    range: [0, 10],
    domain: [new Date(2000, 0, 1), new Date(2000, 0, 2)],
  });
  const formatter = scale.getFormatter();

  return scale.getTicks().map((d: any) => ({ date: formatter(d) }));
})();

const timeline = new Timeline({
  style: {
    width: 400,
    height: 80,
    data: TIME_DATA,
    selection: [0, 2],
    length: 280,
  },
});
rect.appendChild(timeline);
timeline.addEventListener('timelineChanged', (evt) => {
  console.log('timelineChanged', evt.detail.selection);
});

canvas.appendChild(new Rect({ style: { ...rectStyle, x: 40, y: 120 } })).appendChild(
  new Timeline({
    style: {
      width: 400,
      height: 80,
      data: TIME_DATA,
      selection: [0, 2],
      length: 280,
      label: { position: -1 },
    },
  })
);

canvas.appendChild(new Rect({ style: { ...rectStyle, x: 40, y: 210 } })).appendChild(
  new Timeline({
    style: {
      width: 400,
      height: 40,
      data: TIME_DATA,
      selection: [0, 2],
      length: 280,
      controlPosition: 'right',
      label: { position: -1 },
    },
  })
);

canvas.appendChild(new Rect({ style: { ...rectStyle, x: 40, y: 280 } })).appendChild(
  new Timeline({
    style: {
      width: 400,
      height: 40,
      data: TIME_DATA,
      selection: [0, 2],
      length: 280,
      controlPosition: 'left',
      label: { position: -1 },
      loop: true,
    },
  })
);

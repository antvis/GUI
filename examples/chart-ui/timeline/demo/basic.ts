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

export const TIME_DATA = (count = 10) => {
  const scale = new Time({
    tickCount: count,
    range: [0, count],
    domain: [new Date(2000, 0, 1), new Date(2000, 0, 2)],
  });
  const formatter = scale.getFormatter();

  return scale.getTicks().map((d: any) => ({ date: formatter(d) }));
};

const timeline = new Timeline({
  style: {
    width: 400,
    height: 80,
    data: TIME_DATA(),
    selection: [0, 2],
    padding: [4, 0],
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
      data: TIME_DATA(),
      selection: [0, 2],
      padding: [4, 0],
      playAxis: {
        label: { position: -1 },
      },
    },
  })
);

canvas.appendChild(new Rect({ style: { ...rectStyle, x: 40, y: 210 } })).appendChild(
  new Timeline({
    style: {
      width: 400,
      height: 40,
      data: TIME_DATA(),
      selection: [0, 2],
      padding: [4, 0],
      controlPosition: 'right',
      playAxis: {
        label: { position: -1 },
        singleMode: true,
      },
    },
  })
);

canvas.appendChild(new Rect({ style: { ...rectStyle, x: 40, y: 280 } })).appendChild(
  new Timeline({
    style: {
      width: 400,
      height: 40,
      data: TIME_DATA(),
      selection: [0, 2],
      padding: [4, 0],
      controlPosition: 'left',
      autoPlay: true,
      playAxis: {
        label: { position: -1 },
        loop: true,
        playMode: 'increase',
      },
    },
  })
);

canvas.appendChild(new Rect({ style: { ...rectStyle, height: 400, width: 60, x: 500, y: 30 } })).appendChild(
  new Timeline({
    style: {
      orient: 'vertical',
      width: 40,
      height: 400,
      data: TIME_DATA(),
      selection: [0, 2],
      padding: [4, 0],
      controlPosition: 'left',
      playAxis: {
        label: { position: -1 },
        loop: true,
        playMode: 'increase',
      },
    },
  })
);

canvas.appendChild(new Rect({ style: { ...rectStyle, x: 40, y: 360 } })).appendChild(
  new Timeline({
    style: {
      width: 400,
      height: 40,
      data: TIME_DATA(20),
      type: 'cell',
      selection: [0, 2],
      controlPosition: 'left',
      playAxis: {
        label: { position: -1 },
        loop: true,
        playMode: 'increase',
      },
    },
  })
);

canvas.appendChild(new Rect({ style: { ...rectStyle, x: 40, y: 440 } })).appendChild(
  new Timeline({
    style: {
      width: 400,
      height: 40,
      data: TIME_DATA(20),
      type: 'cell',
      selection: [0, 2],
      controlPosition: 'left',
      playAxis: {
        label: { position: 1 },
        loop: true,
        playMode: 'increase',
      },
      autoPlay: true,
    },
  })
);

canvas.appendChild(new Rect({ style: { ...rectStyle, height: 400, width: 60, x: 500, y: 360 } })).appendChild(
  new Timeline({
    style: {
      orient: 'vertical',
      width: 40,
      height: 400,
      data: TIME_DATA(20),
      type: 'cell',
      selection: [0, 2],
      controlPosition: 'left',

      controlButton: null,
      speedControl: null,
      playAxis: {
        label: { position: -1 },
        loop: true,
        playMode: 'increase',
      },
    },
  })
);

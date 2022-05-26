import { Canvas, Rect } from '@antv/g';
import { Time } from '@antv/scale';
import { Renderer as CanvasRenderer } from '@antv/g-svg';
import { Timeline } from '@antv/gui';

const renderer = new CanvasRenderer();

const canvas = new Canvas({
  container: 'container',
  width: 800,
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
    padding: [4, 10, 4, 8],
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
      padding: [4, 12, 4, 8],
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
      padding: [4, 4, 4, 8],
      controlPosition: 'right',
      controlButton: {
        spacing: 6,
        playBtn: { size: 16 },
      },
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
      padding: [4],
      playAxis: {
        appendPadding: [0, 16, 0, 8],
        label: { position: -1 },
        loop: true,
        playMode: 'increase',
      },
      controlPosition: 'left',
      controlButton: {
        spacing: 6,
        playBtn: { size: 16 },
      },
      autoPlay: true,
    },
  })
);

canvas.appendChild(new Rect({ style: { ...rectStyle, height: 320, width: 80, x: 460, y: 30 } })).appendChild(
  new Timeline({
    style: {
      x: 14,
      orient: 'vertical',
      width: 40,
      height: 320,
      data: TIME_DATA(),
      selection: [0, 2],
      padding: 4,
      controlPosition: 'left',
      controlButton: {
        spacing: 4,
        playBtn: { size: 16 },
      },
      playAxis: {
        appendPadding: [4, 0],
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
      controlButton: {
        spacing: 6,
        playBtn: { size: 16 },
      },
      padding: [2, 4],
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
      controlButton: {
        spacing: 4,
        playBtn: { size: 16 },
      },
      padding: 4,
      playAxis: {
        appendPadding: [0, 4],
        label: { position: 1 },
        loop: true,
        playMode: 'increase',
      },
      autoPlay: true,
    },
  })
);

canvas.appendChild(new Rect({ style: { ...rectStyle, height: 400, width: 80, x: 540, y: 360 } })).appendChild(
  new Timeline({
    style: {
      x: 14,
      orient: 'vertical',
      width: 40,
      height: 400,
      data: TIME_DATA(20),
      type: 'cell',
      selection: [0, 2],
      controlPosition: 'left',
      padding: [4, 0],
      controlButton: null,
      speedControl: null,
      playAxis: {
        appendPadding: [0, 0, 8, 0],
        label: { position: -1 },
        loop: true,
        playMode: 'increase',
      },
    },
  })
);

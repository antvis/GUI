import { Canvas } from '@antv/g';
import { Renderer as CanvasRenderer } from '@antv/g-canvas';
import { Poptip, Linear } from '@antv/gui';

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

// todo 坐标轴 label 的 poptip
const data = [
  '蚂蚁技术研究院',
  '智能资金',
  '蚂蚁消金',
  '合规线',
  '战略线',
  '商业智能线',
  '社会公益及绿色发展事业群',
  'CFO线',
  'CTO线',
  '投资线',
  'GR线',
];

const tickData = data.map((d, idx) => {
  const step = 1 / data.length;
  return {
    value: step * idx,
    text: d,
    state: 'default',
    id: String(idx),
  };
});

const linear = new Linear({
  style: {
    startPos: [10, 50],
    endPos: [400, 50],
    ticks: tickData,
    title: {},
    label: {
      offset: [0, 15],
      minLength: 20,
      maxLength: 80,
      autoEllipsis: false,
      optionalAngles: [20, 30, 45],
      padding: [0, 0, 0, 0],
      autoHide: false,
    },
    axisLine: {
      arrow: {
        end: {
          symbol: 'axis-arrow',
          size: 10,
        },
      },
    },
  },
});

canvas.appendChild(linear);

const poptip = new Poptip();

poptip.bind(linear, {
  position: 'top',
  html: (e) => {
    return e.target?.attributes?.text;
  },
  condition: (e) => {
    // 筛选为 label 以及 label text 大于 5 的显示
    if (e.target?.name === 'label' && e.target?.attributes?.text.length > 5) {
      return e.target;
    }
    return false;
  },
});

import { Canvas, Group } from '@antv/g';
import { Renderer as CanvasRenderer } from '@antv/g-svg';
import { Linear, Arc } from '@antv/gui';

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

const data = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const step = 1 / data.length;
const tickData = data.map((d, idx) => {
  return { value: step * idx + step / 2, text: d, id: String(idx) };
});

const linear = new Linear({
  style: {
    container: canvas.appendChild(new Group()),
    startPos: [20, 280],
    endPos: [260, 280],
    ticks: tickData,
    label: {
      style: {
        fontSize: 10,
      },
    },
    title: {
      content: 'date month',
      titleAnchor: 'end',
      titlePadding: 4,
      rotate: undefined,
      maxLength: 260,
      style: {
        fontSize: 10,
        fill: 'black',
        fontWeight: 'bold',
      },
    },
  },
});
canvas.appendChild(linear);

const arc = new Arc({
  style: {
    container: canvas.appendChild(new Group()),
    center: [200, 480],
    radius: 100,
    ticks: tickData.map((d, idx) => ({ ...d, value: idx * step })),
    label: {
      style: {
        fontSize: 10,
      },
    },
    title: {
      content: 'date (month)',
      titleAnchor: 'end',
      titlePadding: 4,
      rotate: undefined,
      maxLength: 260,
      style: {
        fontSize: 10,
        fill: 'black',
        fontWeight: 'bold',
      },
    },
  },
});
canvas.appendChild(arc);

// /** -------------------------配置区域--------------------------------------- */
window.ConfigPanel(linear, 'Linear axis title', {
  'title.style.fill': { label: '轴标题填充色', value: '#416180', type: 'color' },
  'title.style.fontSize': { label: '轴标题字体大小', value: 10, type: 'number', step: 2, range: [10, 30] },
  'title.style.textAlign': {
    label: '轴标题对齐方式',
    value: 'auto',
    options: [{ name: 'auto', value: undefined }, 'start', 'center', 'end'],
  },
  'title.style.textBaseline': {
    label: '轴标题垂直对齐方式',
    value: 'auto',
    options: [{ name: 'auto', value: undefined }, 'top', 'middle', 'top'],
  },
  'title.titleAnchor': { label: '轴标题锚点位置', value: 'end', options: ['start', 'center', 'end'] },
  'title.titlePadding': { label: '轴标题与轴标签距离', value: 4, type: 'number', step: 0.5, range: [-10, 10] },
  'title.offset': { label: '轴标题沿轴线偏移距离', value: 0, type: 'number', step: 0.5, range: [-20, 20] },
  'title.maxLength': { label: '轴标题最大长度', value: 260, type: 'number', step: 8, range: [0, 400] },
});

window.ConfigPanel(
  arc,
  'Arc axis title',
  {
    'title.style.fill': { label: '轴标题填充色', value: '#416180', type: 'color' },
    'title.style.fontSize': { label: '轴标题字体大小', value: 10, type: 'number', step: 2, range: [10, 30] },
    'title.style.textAlign': {
      label: '轴标题对齐方式',
      value: 'auto',
      options: [{ name: 'auto', value: undefined }, 'start', 'center', 'end'],
    },
    'title.style.textBaseline': {
      label: '轴标题垂直对齐方式',
      value: 'auto',
      options: [{ name: 'auto', value: undefined }, 'top', 'middle', 'top'],
    },
    'title.maxLength': { label: '轴标题最大长度', value: 260, type: 'number', step: 8, range: [0, 400] },
  },
  { closed: true }
);

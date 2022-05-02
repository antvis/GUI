import { Canvas, Group } from '@antv/g';
import { Renderer as CanvasRenderer } from '@antv/g-canvas';
import { Linear } from '@antv/gui';

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
  '蚂蚁技术研究院',
  '智能资金',
  '蚂蚁消金',
  '合规线',
  '战略线',
  '商业智能线',
  'CFO线',
  'CTO线',
  '投资线',
  'GR线',
  '社会公益及绿色发展事业群',
  '阿里妈妈事业群',
  'CMO线',
  '大安全',
  '天猫事业线',
  '影业',
  'OceanBase',
  '投资基金线',
  '阿里体育',
  '智能科技事业群',
];

const tickData = data.map((d, idx) => {
  const step = 1 / data.length;
  return {
    value: step * idx + step / 2,
    text: d,
    id: String(idx),
  };
});

const axis = new Linear({
  style: {
    container: canvas.appendChild(new Group()),
    startPos: [0, 300],
    endPos: [600, 300],
    ticks: tickData,
    title: {
      content: 'Axis Title',
    },
    label: {
      minLength: 20,
      maxLength: 80,
      autoRotate: true,
      autoHide: false,
      autoEllipsis: false,
      optionalAngles: [20, 30, 45],
      style: {
        textAlign: 'start',
      },
    },
    axisLine: {
      arrow: {
        end: {
          symbol: 'axis-arrow',
          size: 10,
        },
      },
    },
    subTickLine: false,
  },
});

canvas.appendChild(axis);

/** -------------------------配置区域--------------------------------------- */
window.ConfigPanel(axis, '样式', {
  'label.style.fontSize': { label: '标签字号', value: 10, type: 'number', step: 1, range: [5, 30] },
  'label.style.textAlign': { label: '标签对齐方式', value: 'left', options: ['start', 'center', 'end'] },
  'label.autoEllipsis': { label: '自动省略', value: false },
  'label.minLength': { label: '最小缩略长度', value: 20, type: 'number', step: 5, range: [20, 200] },
  'label.maxLength': { label: '标签最大长度', value: 160, type: 'number', step: 5, range: [20, 200] },
  'label.autoRotate': { label: '自动旋转', value: true },
  'label.autoHide': { label: '自动隐藏', value: false },
});
// const labelMin = labelFolder
//   .add(labelCfg, '最少标签数量', 1, 5)
//   .step(1)
//   .onChange((minLabel) => {
//     axis.update({ label: getDefaultLabelCfg({ minLabel }) });
//   });

import { Canvas, Rect } from '@antv/g';
import { Renderer as CanvasRenderer } from '@antv/g-canvas';
import { deepMix } from '@antv/util';
import { Continuous } from '@antv/gui';

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

// 创建一个包围盒
const rect = new Rect({ style: { x: 20, y: 20, width: 460, height: 500, stroke: '#dfdfdf', lineWidth: 1 } });
canvas.appendChild(rect);

function createContinuousLegend(options = {}) {
  const continuous = new Continuous({
    style: deepMix(
      {
        title: {
          content: '基础',
        },
        label: {
          align: 'rail',
        },
        rail: {
          width: 100,
          height: 16,
        },
        handle: false,
        min: 0,
        max: 100,
        color: [
          '#d0e3fa',
          '#acc7f6',
          '#8daaf2',
          '#6d8eea',
          '#4d73cd',
          '#325bb1',
          '#5a3e75',
          '#8c3c79',
          '#e23455',
          '#e7655b',
        ],
      },
      options
    ),
  });
  rect.appendChild(continuous);
  return continuous;
}

createContinuousLegend();
createContinuousLegend({ y: 80, handle: {}, title: { content: '带手柄' } });
createContinuousLegend({ y: 160, label: { align: 'inside' }, title: { content: 'label 在上方' } });
createContinuousLegend({ y: 240, label: { align: 'outside' }, title: { content: 'label 在下方' } });
createContinuousLegend({
  y: 320,
  label: { align: 'outside' },
  rail: { ticks: [25, 50, 75] },
  title: { content: '自定义滑轨 tick 标签' },
});

createContinuousLegend({ x: 150, orient: 'vertical', rail: { width: 16, height: 100 } });
createContinuousLegend({
  x: 230,
  orient: 'vertical',
  rail: { width: 16, height: 100 },
  handle: {},
  title: { content: '带手柄' },
});
createContinuousLegend({
  x: 310,
  orient: 'vertical',
  rail: { width: 16, height: 100 },
  label: { align: 'inside' },
  title: { content: 'label 在上方' },
});
createContinuousLegend({
  x: 150,
  y: 200,
  orient: 'vertical',
  rail: { width: 16, height: 100 },
  label: { align: 'outside' },
  title: { content: 'label 在下方' },
});
createContinuousLegend({
  x: 230,
  y: 200,
  orient: 'vertical',
  rail: { width: 16, height: 100, ticks: [25, 50, 75] },
  label: { align: 'outside' },
  title: { content: '自定义滑轨 tick 标签' },
});

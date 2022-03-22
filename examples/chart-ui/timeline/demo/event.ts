import { Canvas } from '@antv/g';
import { Renderer as CanvasRenderer } from '@antv/g-canvas';
import { Timeline } from '@antv/gui';
import * as dat from 'dat.gui';

const renderer = new CanvasRenderer({
  enableDirtyRectangleRenderingDebug: false,
  enableAutoRendering: true,
  enableDirtyRectangleRendering: true,
});

const canvas = new Canvas({
  container: 'container',
  width: 600,
  height: 800,
  renderer,
});

// Request a weekday along with a long date
const options: any = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
// 2022年1月的日期数据
const date = new Array(20)
  .fill(undefined)
  .map((_, id) => ({ date: new Date(2022, 0, id).toLocaleString('zh-CN', options) }));

const timeline = new Timeline({
  style: {
    x: 10,
    y: 250,
    width: 500,
    data: date,
    orient: {
      layout: 'row',
      controlButtonAlign: 'left',
    },
    onSelectionChange: (val) => {
      selectionControl1.setValue(JSON.stringify(val));
    },
  },
});
const timeline2 = new Timeline({
  style: {
    x: 10,
    y: 350,
    width: 500,
    data: date,
    type: 'slider',
    orient: {
      layout: 'row',
      controlButtonAlign: 'left',
    },
    onSelectionChange: (val) => {
      selectionControl2.setValue(JSON.stringify(val));
    },
  },
});
canvas.appendChild(timeline);
canvas.appendChild(timeline2);

/** -------------------------配置区域--------------------------------------- */
const $wrapper = document.getElementById('container');
const cfg = new dat.GUI({ autoPlace: false, width: 400 });
$wrapper.appendChild(cfg.domElement);

const timelineCfg = { selectionCell: '[]', selectionSlider: '[]' };

const selectionControl1 = cfg.add(timelineCfg, 'selectionCell', '');

const selectionControl2 = cfg.add(timelineCfg, 'selectionSlider', '');

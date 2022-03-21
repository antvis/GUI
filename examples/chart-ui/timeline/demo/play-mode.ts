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
    cellAxisCfg: {
      selection: [date[0].date, date[3].date],
    },
  },
});
const timeline2 = new Timeline({
  style: {
    x: 10,
    y: 350,
    width: 500,
    data: date,
    orient: {
      layout: 'row',
      controlButtonAlign: 'left',
    },
    type: 'slider',
    sliderAxisCfg: {
      selection: [date[0].date, date[3].date],
    },
  },
});
canvas.appendChild(timeline);
canvas.appendChild(timeline2);

/** -------------------------配置区域--------------------------------------- */
const $wrapper = document.getElementById('container');
const cfg = new dat.GUI({ autoPlace: false });
$wrapper.appendChild(cfg.domElement);
const cfgFolder = cfg.addFolder('cell型播放模式');
cfgFolder.open();
const timelineCfg = { playMode: 'fixed' };

cfgFolder.add(timelineCfg, 'playMode', ['fixed', 'increase']).onChange((value) => {
  timeline.update({
    playMode: value,
  });
});

const cfgFolder2 = cfg.addFolder('slider型播放模式');
cfgFolder2.open();
const timelineCfg2 = { playMode: 'fixed' };
cfgFolder2.add(timelineCfg, 'playMode', ['fixed', 'increase']).onChange((value) => {
  timeline2.update({
    playMode: value,
  });
});

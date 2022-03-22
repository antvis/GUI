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
    type: 'slider',
    orient: {
      layout: 'row',
      controlButtonAlign: 'left',
    },
    onSelectionChange: console.log,
  },
});
canvas.appendChild(timeline);

/** -------------------------配置区域--------------------------------------- */
const $wrapper = document.getElementById('container');
const cfg = new dat.GUI({ autoPlace: false });
$wrapper.appendChild(cfg.domElement);
const cfgFolder = cfg.addFolder('timeline配置');
cfgFolder.open();
const timelineCfg = { x: 10, y: 250, width: 500, layout: 'row', controlButtonAlign: 'left' };

const x = cfgFolder.add(timelineCfg, 'x', 10, 50).onChange((value) => {
  timeline.update({
    x: x.getValue(),
    y: y.getValue(),
    width: width.getValue(),
    orient: { layout: layout.getValue(), controlButtonAlign: controlButtonAlign.getValue() },
  });
});

const y = cfgFolder.add(timelineCfg, 'y', 200, 300).onChange((value) => {
  timeline.update({
    x: x.getValue(),
    y: y.getValue(),
    width: width.getValue(),
    orient: { layout: layout.getValue(), controlButtonAlign: controlButtonAlign.getValue() },
  });
});

const width = cfgFolder.add(timelineCfg, 'width', 400, 700).onChange((value) => {
  timeline.update({
    x: x.getValue(),
    y: y.getValue(),
    width: width.getValue(),
    orient: { layout: layout.getValue(), controlButtonAlign: controlButtonAlign.getValue() },
  });
});

const layout = cfgFolder.add(timelineCfg, 'layout', ['row', 'col']).onChange((value) => {
  timeline.update({
    x: x.getValue(),
    y: y.getValue(),
    width: width.getValue(),
    orient: { layout: layout.getValue(), controlButtonAlign: controlButtonAlign.getValue() },
  });
});

const controlButtonAlign = cfgFolder
  .add(timelineCfg, 'controlButtonAlign', ['left', 'right', 'normal'])
  .onChange((value) => {
    timeline.update({
      x: x.getValue(),
      y: y.getValue(),
      width: width.getValue(),
      orient: { layout: layout.getValue(), controlButtonAlign: controlButtonAlign.getValue() },
    });
  });

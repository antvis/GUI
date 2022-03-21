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
// init window hook
window.__g_instances__ = [];

window.__g_instances__.push(canvas);
// Request a weekday along with a long date
const options: any = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
// 2022年1月的日期数据
const date = new Array(20)
  .fill(undefined)
  .map((_, id) => ({ date: new Date(2022, 0, id).toLocaleString('zh-CN', options) }));
const timeline1 = new Timeline({
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
      backgroundStyle: {
        fill: '#FFFFEE',
      },
      cellStyle: { selected: { fill: '#0011EE' } },
    },
    tickCfg: {
      label: {
        autoRotate: false,
        autoEllipsis: true,
        offset: [0, 15],
        alignTick: true,
        style: {
          default: {
            fontSize: 10,
            fill: 'rgba(0,0,0,0.45)',
          },
        },
      },
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
    sliderAxisCfg: {
      selection: [date[1].date, date[5].date],
      selectionStyle: {
        height: 8,
        fill: '#0011EE',
      },
      backgroundStyle: {
        fill: '#FFFFEE',
      },
      tickCfg: {
        label: {
          autoRotate: false,
          autoEllipsis: true,
          offset: [0, 15],
          alignTick: true,
          style: {
            default: {
              fontSize: 10,
              fill: 'rgba(0,0,0,0.45)',
            },
          },
        },
      },
    },
  },
});
canvas.appendChild(timeline1);
canvas.appendChild(timeline2);
/** -------------------------配置区域--------------------------------------- */
const $wrapper = document.getElementById('container');
const cfg = new dat.GUI({ autoPlace: false });
$wrapper.appendChild(cfg.domElement);
const cfgFolder = cfg.addFolder('cell型样式');
cfgFolder.open();
const timeline1Cfg = { backgroundColor: '#FFFFEE', cellFillSelected: '#0011EE', fontSize: 10 };
cfgFolder.addColor(timeline1Cfg, 'backgroundColor').onChange((val) => {
  timeline1.update({
    cellAxisCfg: {
      backgroundStyle: { fill: val },
    },
  });
});
cfgFolder.addColor(timeline1Cfg, 'cellFillSelected').onChange((val) => {
  timeline1.update({
    cellAxisCfg: {
      cellStyle: { selected: { fill: val } },
    },
  });
});

cfgFolder.add(timeline1Cfg, 'fontSize', 5, 15).onChange((val) => {
  timeline1.update({
    cellAxisCfg: {
      tickCfg: {
        label: {
          style: {
            default: {
              fontSize: val,
            },
          },
        },
      },
    },
  });
});

const cfgFolder2 = cfg.addFolder('slider型样式');
cfgFolder2.open();
const timeline2Cfg = { backgroundColor: '#FFFFEE', selectionColor: '#0011EE', fontSize: 10 };
cfgFolder2.addColor(timeline2Cfg, 'backgroundColor').onChange((val) => {
  timeline2.update({
    sliderAxisCfg: {
      backgroundStyle: { fill: val },
    },
  });
});
cfgFolder2.addColor(timeline1Cfg, 'cellFillSelected').onChange((val) => {
  timeline2.update({
    sliderAxisCfg: {
      selectionStyle: { fill: val },
    },
  });
});

cfgFolder2.add(timeline1Cfg, 'fontSize', 5, 15).onChange((val) => {
  timeline2.update({
    sliderAxisCfg: {
      tickCfg: {
        label: {
          style: {
            default: {
              fontSize: val,
            },
          },
        },
      },
    },
  });
});

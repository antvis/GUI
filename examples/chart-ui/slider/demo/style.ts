import { Canvas } from '@antv/g';
import { Renderer as CanvasRenderer } from '@antv/g-canvas';
import { Slider } from '@antv/gui';
import * as dat from 'dat.gui';

const renderer = new CanvasRenderer();

const canvas = new Canvas({
  container: 'container',
  width: 600,
  height: 300,
  renderer,
});

const slider = new Slider({
  style: {
    x: 50,
    y: 250,
    data: [{ value: 0 }, { value: 100 }],
    length: 400,
    size: 30,
    selection: [0.4, 0.6],
    handleStyle: {
      size: 12,
    },
    backgroundStyle: {
      lineWidth: 1,
    },
    selectionStyle: {
      lineWidth: 1,
    },
    formatter: (value) => {
      return `${(value * 100).toFixed(2)}%`;
    },
  },
});

canvas.appendChild(slider);

/** -------------------------配置区域--------------------------------------- */
const $wrapper = document.getElementById('container');
const cfg = new dat.GUI({ autoPlace: false });
$wrapper.appendChild(cfg.domElement);
const sliderFolder = cfg.addFolder('Slider');
sliderFolder.open();
const sliderCfg = {
  背景颜色: '#fff',
  背景边框颜色: '#e4eaf5',
  选区颜色: '#afc9fb',
  选区边框颜色: '#afc9fb',
};

sliderFolder.addColor(sliderCfg, '背景颜色').onChange((color) => {
  slider.update({ backgroundStyle: { fill: color } });
});
sliderFolder.addColor(sliderCfg, '背景边框颜色').onChange((color) => {
  slider.update({ backgroundStyle: { stroke: color } });
});
sliderFolder.addColor(sliderCfg, '选区颜色').onChange((color) => {
  slider.update({ selectionStyle: { fill: color } });
});
sliderFolder.addColor(sliderCfg, '选区边框颜色').onChange((color) => {
  slider.update({ selectionStyle: { stroke: color } });
});

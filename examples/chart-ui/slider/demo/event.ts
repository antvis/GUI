import { Canvas } from '@antv/g';
import { Renderer as CanvasRenderer } from '@antv/g-canvas';
import { Slider } from '@antv/gui';
import * as dat from 'dat.gui';

const renderer = new CanvasRenderer();

const canvas = new Canvas({
  container: 'container',
  width: 600,
  height: 500,
  renderer,
});

const slider = new Slider({
  style: {
    x: 50,
    y: 100,
    length: 324,
    size: 20,
    selection: [0.3, 0.7],
    data: [{ value: 0 }, { value: 100 }],
    formatter: (v) => (typeof v === 'number' ? v.toFixed(0) : String(v)),
    handleStyle: {
      size: 10,
    },
  },
});

canvas.appendChild(slider);

slider.addEventListener(
  'selectionChanged',
  ({
    detail: {
      value: [stVal, endVal],
    },
  }) => {
    startValue.setValue(stVal * 100);
    endValue.setValue(endVal * 100);
  }
);

/** -------------------------配置区域--------------------------------------- */
const $wrapper = document.getElementById('container');
const cfg = new dat.GUI({ autoPlace: false });
$wrapper.appendChild(cfg.domElement);
const sliderCfg = {
  起始值: 30,
  结束值: 70,
};

const startValue = cfg.add(sliderCfg, '起始值', 0, 100).onChange((value) => {
  const endVal = endValue.getValue();
  const val = value > endVal ? endVal : value;
  slider.update({ selections: [val, endVal] });
});
const endValue = cfg.add(sliderCfg, '结束值', 0, 100).onChange((value) => {
  const stVal = startValue.getValue();
  const val = value < stVal ? stVal : value;
  slider.update({ selections: [stVal, val] });
});

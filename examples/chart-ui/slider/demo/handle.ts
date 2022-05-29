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
    y: 200,
    data: [{ value: 0 }, { value: 100 }],
    length: 400,
    size: 30,
    selection: [0.4, 0.6],
    handleStyle: {
      size: 12,
    },
    startHandleSize: 8,
    startHandleIcon: 'https://gw.alipayobjects.com/mdn/rms_6ae20b/afts/img/A*N4ZMS7gHsUIAAAAAAAAAAABkARQnAQ',
    endHandleIcon: 'diamond',
  },
});

canvas.appendChild(slider);

/** -------------------------配置区域--------------------------------------- */
const $wrapper = document.getElementById('container');
const cfg = new dat.GUI({ autoPlace: false });
$wrapper.appendChild(cfg.domElement);
const sliderFolder = cfg.addFolder('Handle');
sliderFolder.open();
const sliderCfg = {
  起始手柄图标: 'AntV',
  起始手柄大小: 15,
  // 左间距: 10,
  结束手柄形状: 'diamond',
  // 结束手柄颜色: '#fff',
  结束手柄大小: 15,
  // 右间距: 10,
  手柄文字颜色: '#63656e',
};
sliderFolder.add(sliderCfg, '起始手柄图标', ['AntV', 'yuque', 'default']).onChange((val) => {
  const iconMap = {
    AntV: 'https://gw.alipayobjects.com/mdn/rms_6ae20b/afts/img/A*N4ZMS7gHsUIAAAAAAAAAAABkARQnAQ',
    yuque: 'https://gw.alipayobjects.com/zos/rmsportal/XuVpGqBFxXplzvLjJBZB.svg',
    default: '',
  };
  slider.update({ startHandleIcon: iconMap[val] });
});
sliderFolder.add(sliderCfg, '结束手柄形状', ['diamond', 'square', 'triangle', 'circle']).onChange((val) => {
  slider.update({ endHandleIcon: val });
});
// sliderFolder.add(sliderCfg, '左间距', 0, 20).onChange((val) => {
//   slider.update({ handle: { start: { spacing: val } } });
// });
sliderFolder.add(sliderCfg, '起始手柄大小', 0, 20).onChange((val) => {
  slider.update({ startHandleSize: val });
});
// sliderFolder.addColor(sliderCfg, '结束手柄颜色').onChange((color) => {
//   slider.update({ handle: { end: { handleStyle: { fill: color } } } });
// });
sliderFolder.add(sliderCfg, '结束手柄大小', 0, 20).onChange((val) => {
  slider.update({ endHandleSize: val });
});
// todo
// sliderFolder.add(sliderCfg, '右间距', 0, 20).onChange((val) => {
//   slider.update({
//     handle: { end: { spacing: val } },
//   });
// });
sliderFolder.addColor(sliderCfg, '手柄文字颜色').onChange((color) => {
  slider.update({ textStyle: { fill: color } });
});

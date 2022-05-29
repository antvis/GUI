import { Canvas } from '@antv/g';
import { Renderer as CanvasRenderer } from '@antv/g-canvas';
import { Time } from '@antv/scale';
import { Slider } from '@antv/gui';

const renderer = new CanvasRenderer();

const canvas = new Canvas({
  container: 'container',
  width: 400,
  height: 500,
  renderer,
});

const generateTimeData = (count = 20) => {
  const scale = new Time({
    tickCount: count,
    range: [0, count],
    utc: true,
    domain: [new Date(2000, 0, 1), new Date(2000, 3, 1)],
  });
  const formatter = scale.getFormatter();

  return scale.getTicks().map((d) => ({ value: formatter(d), val1: Math.random() * 100, val2: Math.random() * 100 }));
};
const data = generateTimeData(40);
const slider = new Slider({
  style: {
    x: 20,
    y: 30,
    data,
    length: 324,
    size: 20,
    selection: [4, 16],
    handleStyle: {
      size: 10,
    },
    sparkline: {
      fields: ['val1', 'val2'],
    },
  },
});

canvas.appendChild(slider);

/** -------------------------配置区域--------------------------------------- */
const $wrapper = document.getElementById('container');
const cfg = new dat.GUI({ autoPlace: false });
$wrapper.appendChild(cfg.domElement);

const sliderFolder = cfg.addFolder('Slider边距');
sliderFolder.open();
const sliderCfg = { 左间距: 0, 右间距: 0, 上间距: 0, 下间距: 0 };

// todo
// const sliderLeft = sliderFolder.add(sliderCfg, '左间距', 0, 10).onChange((value) => {
//   slider.update({
//     padding: [sliderTop.getValue(), sliderRight.getValue(), sliderBottom.getValue(), value],
//   });
// });
// const sliderRight = sliderFolder.add(sliderCfg, '右间距', 0, 10).onChange((value) => {
//   slider.update({
//     padding: [sliderTop.getValue(), value, sliderBottom.getValue(), sliderLeft.getValue()],
//   });
// });
// const sliderTop = sliderFolder.add(sliderCfg, '上间距', 0, 10).onChange((value) => {
//   slider.update({
//     padding: [value, sliderRight.getValue(), sliderBottom.getValue(), sliderLeft.getValue()],
//   });
// });
// const sliderBottom = sliderFolder.add(sliderCfg, '下间距', 0, 10).onChange((value) => {
//   slider.update({
//     padding: [sliderTop.getValue(), sliderRight.getValue(), value, sliderLeft.getValue()],
//   });
// });

const sparklineFolder = cfg.addFolder('Sparkline边距');
sparklineFolder.open();
const sparklineCfg = { 左间距: 0, 右间距: 0, 上间距: 0, 下间距: 0 };

const sparklineLeft = sparklineFolder.add(sparklineCfg, '左间距', 0, 10).onChange((value) => {
  slider.update({
    sparkline: { padding: [sparklineTop.getValue(), sparklineRight.getValue(), sparklineBottom.getValue(), value] },
  });
});
const sparklineRight = sparklineFolder.add(sparklineCfg, '右间距', 0, 10).onChange((value) => {
  slider.update({
    sparkline: { padding: [sparklineTop.getValue(), value, sparklineBottom.getValue(), sparklineLeft.getValue()] },
  });
});
const sparklineTop = sparklineFolder.add(sparklineCfg, '上间距', 0, 10).onChange((value) => {
  slider.update({
    sparkline: { padding: [value, sparklineRight.getValue(), sparklineBottom.getValue(), sparklineLeft.getValue()] },
  });
});
const sparklineBottom = sparklineFolder.add(sparklineCfg, '下间距', 0, 10).onChange((value) => {
  slider.update({
    sparkline: { padding: [sparklineTop.getValue(), sparklineRight.getValue(), value, sparklineLeft.getValue()] },
  });
});

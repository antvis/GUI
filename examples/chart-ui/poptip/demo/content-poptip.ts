import { Canvas, Rect } from '@antv/g';
import { Renderer as CanvasRenderer } from '@antv/g-canvas';
import { Poptip } from '@antv/gui';

const renderer = new CanvasRenderer({
  enableDirtyRectangleRenderingDebug: false,
  enableAutoRendering: true,
  enableDirtyRectangleRendering: true,
});

const canvas = new Canvas({
  container: 'container',
  width: 600,
  height: 200,
  renderer,
});

// 移出之前创建的 poptip
Array.from(document.getElementsByClassName('gui-poptip')).forEach((poptip) => poptip.remove());

const rect = new Rect({
  style: {
    x: 0,
    y: 50,
    width: 100,
    height: 50,
    fill: 'red',
  },
});

canvas.appendChild(rect);

// 自定义内容
const poptip = new Poptip({
  style: {
    position: 'right',
    domStyles: {
      '.custom': {
        height: '80px',
        width: '80px',
        'background-color': '#fff',
        'background-image':
          'url("https://gw.alipayobjects.com/mdn/rms_6ae20b/afts/img/A*N4ZMS7gHsUIAAAAAAAAAAABkARQnAQ")',
        'background-size': 'cover',
        'border-radius': '50%',
        opacity: 1,
      },
      '.custom-text': {
        color: '#000',
        width: '200px',
        display: 'flex',
        'justify-content': 'center',
        'align-items': 'center',
      },
      '.text-marker': {
        background: 'green',
        width: '8px',
        height: '8px',
        'border-radius': '50%',
        display: 'inline-block',
      },
      // 内置小箭头样式自定义
      '.gui-poptip-arrow': {
        width: '6px',
        height: '6px',
        transform: 'rotate(45deg)',
        'background-color': '#fff',
        position: 'absolute',
      },
    },
    template: {
      container: `<div class="gui-poptip custom"></div>`,
      text: `<div class="custom-text">
        <div class='text-marker'></div>
        <div class='text'>文本内容</div>
      </div>`,
    },
  },
});

poptip.bind(rect);

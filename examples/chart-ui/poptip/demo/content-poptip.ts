import { Canvas, Rect, Circle } from '@antv/g';
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
Array.from(document.getElementsByClassName('poptip')).forEach((poptip) => poptip.remove());

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

// G.Rect
new Poptip({
  style: {
    position: 'right',
    target: rect,
    backgroundShape: false,
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
    },
    template: {
      container: `<div class="poptip custom" ></div>`,
      text: `<div class="poptip-text custom-text">
      <div class='text-marker'></div> 
      <div class='text'>文本内容</div></div>`,
    },
  },
});

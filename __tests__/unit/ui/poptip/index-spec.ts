import { Canvas, Rect } from '@antv/g';
import { Renderer as CanvasRenderer } from '@antv/g-canvas';
import { getContainerOption } from '../../../../src/ui/poptip/helpers';
import { Poptip } from '../../../../src';
import { createDiv } from '../../../utils';

Array.from(document.getElementsByClassName(Poptip.tag)).forEach((poptip) => {
  poptip.remove();
});

const renderer = new CanvasRenderer({
  enableDirtyRectangleRenderingDebug: false,
  enableAutoRendering: true,
  enableDirtyRectangleRendering: true,
});
const div = createDiv();
const canvas = new Canvas({
  container: div,
  width: 800,
  height: 800,
  renderer,
});

const background = new Rect({
  style: {
    x: 0,
    y: 0,
    height: 800,
    width: 800,
  },
});

const tooltipArea = new Rect({
  style: {
    x: 50,
    y: 50,
    width: 500,
    height: 500,
  },
});

canvas.appendChild(background);
background.appendChild(tooltipArea);

const poptip = new Poptip({
  style: {
    target: background,
    style: {
      '.poptip': {
        width: '100px',
        height: '30px',
      },
    },
    text: '测试1',
  },
});

describe('poptip', () => {
  test('basic', async () => {
    const options = getContainerOption(background);

    expect(poptip.getHTMLTooltipElement().style).toMatchObject({
      left: `${options.x + options.width / 2}px`,
      top: `${options.y}px`,
      width: '100px',
      height: '30px',
    });
    expect(poptip.getHTMLTooltipElement().getElementsByClassName('poptip-text')[0].textContent).toBe('测试1');
  });

  test('update', async () => {
    poptip.update({
      target: tooltipArea,
      style: {
        '.poptip': {
          width: '200px',
          height: '130px',
        },
      },
      text: '测试2',
    });

    const options = getContainerOption(tooltipArea);

    expect(poptip.getHTMLTooltipElement().style).toMatchObject({
      left: `${options.x + options.width / 2}px`,
      top: `${options.y}px`,
      width: '200px',
      height: '130px',
    });
    expect(poptip.getHTMLTooltipElement().getElementsByClassName('poptip-text')[0].textContent).toBe('测试2');
  });

  test('position', async () => {
    poptip.update({
      // @ts-ignore
      position: false,
    });

    let options = getContainerOption(poptip.getTarget());

    expect(poptip.getHTMLTooltipElement().style).toMatchObject({
      left: `${options.x + options.width / 2}px`,
      top: `${options.y}px`,
    });

    poptip.update({
      position: 'top-left',
    });

    options = getContainerOption(poptip.getTarget());

    expect(poptip.getHTMLTooltipElement().style).toMatchObject({
      left: `${options.x}px`,
      top: `${options.y}px`,
    });

    poptip.update({
      position: 'top-right',
    });

    options = getContainerOption(poptip.getTarget());

    expect(poptip.getHTMLTooltipElement().style).toMatchObject({
      left: `${options.x + options.width}px`,
      top: `${options.y}px`,
    });

    poptip.update({
      position: 'left',
    });

    options = getContainerOption(poptip.getTarget());

    expect(poptip.getHTMLTooltipElement().style).toMatchObject({
      left: `${options.x}px`,
      top: `${options.y + options.height / 2}px`,
    });

    poptip.update({
      position: 'left-top',
    });

    options = getContainerOption(poptip.getTarget());

    expect(poptip.getHTMLTooltipElement().style).toMatchObject({
      left: `${options.x}px`,
      top: `${options.y}px`,
    });

    poptip.update({
      position: 'left-bottom',
    });

    options = getContainerOption(poptip.getTarget());

    expect(poptip.getHTMLTooltipElement().style).toMatchObject({
      left: `${options.x}px`,
      top: `${options.y + options.height}px`,
    });

    poptip.update({
      position: 'right',
    });

    options = getContainerOption(poptip.getTarget());

    expect(poptip.getHTMLTooltipElement().style).toMatchObject({
      left: `${options.x + options.width}px`,
      top: `${options.y + options.height / 2}px`,
    });

    poptip.update({
      position: 'right-top',
    });

    options = getContainerOption(poptip.getTarget());

    expect(poptip.getHTMLTooltipElement().style).toMatchObject({
      left: `${options.x + options.width}px`,
      top: `${options.y}px`,
    });

    poptip.update({
      position: 'right-bottom',
    });

    options = getContainerOption(poptip.getTarget());

    expect(poptip.getHTMLTooltipElement().style).toMatchObject({
      left: `${options.x + options.width}px`,
      top: `${options.y + options.height}px`,
    });

    poptip.update({
      position: 'bottom',
    });

    options = getContainerOption(poptip.getTarget());

    expect(poptip.getHTMLTooltipElement().style).toMatchObject({
      left: `${options.x + options.width / 2}px`,
      top: `${options.y + options.height}px`,
    });

    poptip.update({
      position: 'bottom-left',
    });

    options = getContainerOption(poptip.getTarget());

    expect(poptip.getHTMLTooltipElement().style).toMatchObject({
      left: `${options.x}px`,
      top: `${options.y + options.height}px`,
    });

    poptip.update({
      position: 'bottom-right',
    });

    options = getContainerOption(poptip.getTarget());

    expect(poptip.getHTMLTooltipElement().style).toMatchObject({
      left: `${options.x + options.width}px`,
      top: `${options.y + options.height}px`,
    });
  });
});

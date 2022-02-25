import { Poptip } from '../../../../src';

Array.from(document.getElementsByClassName(Poptip.tag)).forEach((poptip) => {
  poptip.remove();
});

const poptip = new Poptip({
  style: {},
});

describe('poptip', () => {
  test('custom XY', async () => {
    expect(poptip.getHTMLTooltipElement().style).toMatchObject({
      left: '0px',
      top: '0px',
    });

    poptip.update({
      container: {
        x: 200,
        y: 200,
      },
    });

    expect(poptip.getHTMLTooltipElement().style).toMatchObject({
      left: '200px',
      top: '200px',
    });
  });

  test('custom template', async () => {
    const style = {
      '.custom': {
        height: '80px',
        width: '80px',
        'background-color': '#fff',
        'background-image':
          'url("https://gw.alipayobjects.com/mdn/rms_6ae20b/afts/img/A*N4ZMS7gHsUIAAAAAAAAAAABkARQnAQ")',
        'background-size': 'cover',
        'border-radius': '50%',
        opacity: '1',
      },
      '.custom-text': {
        color: 'rgb(0, 0, 0)',
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
    };

    const customPoptip = new Poptip({
      style: {
        template: {
          container: `<div class="poptip custom" ></div>`,
          text: `<div class="poptip-text custom-text">
          <div class='text-marker'></div> 
          <div class='text'>文本内容</div></div>`,
        },
        backgroundShape: false,
        style,
      },
    });

    const element = customPoptip.getHTMLTooltipElement();

    expect(element.className).toBe('poptip custom poptip-top');
    // @ts-ignore
    expect(element.getElementsByClassName('custom-text')[0].style).toMatchObject({
      color: 'rgb(0, 0, 0)',
      width: '200px',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    });
    // @ts-ignore
    expect(element.getElementsByClassName('text-marker')[0].style).toMatchObject({
      ...style['.text-marker'],
    });
    // @ts-ignore
    expect(element.getElementsByClassName('text')[0].textContent).toBe('文本内容');
  });
});

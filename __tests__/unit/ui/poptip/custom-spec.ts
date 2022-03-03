import { Poptip } from '../../../../src';

Array.from(document.getElementsByClassName(Poptip.tag)).forEach((poptip) => {
  poptip.remove();
});

describe('poptip', () => {
  test('custom template', async () => {
    const domStyles = {
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
        domStyles,
      },
    });

    const element = customPoptip.getContainer();

    expect(element.className).toBe('poptip custom');
    Object.keys(domStyles).forEach((key) => {
      // @ts-ignore
      expect(element.querySelector('style').innerHTML).toMatch(
        // @ts-ignore
        `${key} { ${Object.entries(domStyles[key]).reduce((r, [k, v]) => `${r}${k}: ${v};`, '')} }`
      );
    });

    // @ts-ignore
    expect(element.getElementsByClassName('text')[0].textContent).toBe('文本内容');
  });
});

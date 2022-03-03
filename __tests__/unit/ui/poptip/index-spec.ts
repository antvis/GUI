import { Poptip } from '../../../../src';

Array.from(document.getElementsByClassName(Poptip.tag)).forEach((poptip) => {
  poptip.remove();
});

const poptip = new Poptip({
  style: {
    style: {
      '.poptip': {
        width: '100px',
        height: '30px',
      },
    },
    offset: [10, 10],
    text: '测试1',
  },
});

describe('poptip', () => {
  test('basic', async () => {
    expect(poptip.getContainer().getElementsByClassName('poptip-text')[0].textContent).toBe('测试1');

    poptip.showTip(200, 300, '测试2');
    expect(poptip.getContainer().getElementsByClassName('poptip-text')[0].textContent).toBe('测试2');
    expect(poptip.getContainer().style).toMatchObject({
      left: '210px',
      top: '310px',
    });
  });

  test('update', async () => {
    poptip.update({
      text: '测试3',
      offset: [20, 20],
    });
    poptip.showTip(200, 300);

    expect(poptip.getContainer().getElementsByClassName('poptip-text')[0].textContent).toBe('测试3');
    expect(poptip.getContainer().style).toMatchObject({
      left: '220px',
      top: '320px',
    });
  });
});

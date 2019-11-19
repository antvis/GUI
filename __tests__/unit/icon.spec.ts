import { Canvas } from '@antv/g';
import { Icon } from '../../src';

/* 插入 icon font */
const insertIconfont = () => {
  const style = document.createElement('style');

  style.innerHTML = `
@font-face {
  font-family: 'iconfont';
  src: url('https:/at.alicdn.com/t/font_241110_z307kfrbejr.eot');
  src: url('https://at.alicdn.com/t/font_241110_z307kfrbejr.eot?#iefix') format('embedded-opentype'),
  url('https://at.alicdn.com/t/font_241110_z307kfrbejr.woff') format('woff'),
  url('https://at.alicdn.com/t/font_241110_z307kfrbejr.ttf') format('truetype'),
  url('https://at.alicdn.com/t/font_241110_z307kfrbejr.svg#iconfont') format('svg');
}`;

  document.head.appendChild(style);
};

describe('gui icon', () => {
  insertIconfont();

  describe('y scrollBar', () => {
    const div = document.createElement('div');
    document.body.appendChild(div);

    const canvas = new Canvas({
      containerDOM: div,
      width: 600,
      height: 400,
    });

    const icon1Cfg = { position: { x: 100, y: 50 }, icon: 'e7a4' };
    const icon2Cfg = { position: { x: 100, y: 100 }, icon: 'e7a4', text: 'Good' };

    const icon1 = new Icon(icon1Cfg);
    const icon2 = new Icon(icon2Cfg);
    canvas.add(icon1);
    canvas.add(icon2);

    // 因为 icon font 需要提前加载好才行
    setTimeout(() => {
      canvas.draw();
    }, 1000);

    it('icon', () => {
      // @ts-ignore
      expect(icon1.position).toEqual({ x: 100, y: 50 });

      // default margin is 8
      expect(icon2.getBBox().width > 16 + 8).toBe(true);
    });

    it('event', () => {
      let cnt = 0;
      icon1.on('click', () => {
        cnt++;
      });

      icon2.on('click', () => {
        cnt++;
      });

      // @ts-ignore
      icon1.bg.emit('click');
      // @ts-ignore
      icon2.bg.emit('click');

      expect(cnt).toBe(2);
    });
  });
});

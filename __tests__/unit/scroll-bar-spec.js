import { expect } from 'chai';
import { Canvas } from '@antv/g';
import * as Simulate from 'event-simulate';
import { ScrollBar } from '../../src';
import * as _ from '@antv/util';

describe('gui scrollBar', () => {
  describe('x scrollBar', () => {
    const scrollBarDiv = document.createElement('div');
    scrollBarDiv.id = 'x-scrollBar';
    document.body.appendChild(scrollBarDiv);

    const canvas = new Canvas({
      containerId: 'x-scrollBar',
      renderer: 'canvas',
      width: 400,
      height: 400,
    });

    const scrollBarCfg = {
      isHorizontal: true,
      trackLen: 380,
      thumbLen: 20,
      position: { x: 10, y: 180 },
      thumbOffset: 30,
      theme: {
        default: {
          size: 8,
        },
      },
    };

    const scrollBar = new ScrollBar(scrollBarCfg);
    it('constructor', () => {
      expect(scrollBar.isHorizontal).to.eql(true);
      expect(scrollBar.trackLen).to.eql(380);
    });

    canvas.add(scrollBar);
    canvas.draw();

    it('mousedown', () => {
      scrollBar.emit('mousedown', {
        clientX: 30,
        clientY: 180,
        event: {
          preventDefault: _.identity,
        },
      });
      expect(scrollBar._startPos).to.eql(30);
    });

    it('mousemove', () => {
      Simulate.simulate(canvas.get('containerDOM'), 'mousemove', {
        clientX: 80,
        clientY: 180,
      });
      expect(scrollBar.thumbOffset).to.eql(80);

      Simulate.simulate(canvas.get('containerDOM'), 'mouseup', scrollBar.clearEvents);
    });

    it('track-click', () => {
      scrollBar.trackShape.emit('click', {
        stopPropagation: _.identity,
        preventDefault: _.identity,
        clientX: 100,
        clientY: 180,
      });

      expect(scrollBar.thumbOffset).to.eql(80);
    });

    it('track-clickPos + thumbLen < thumbLen', () => {
      scrollBar.trackShape.emit('click', {
        stopPropagation: _.identity,
        preventDefault: _.identity,
        clientX: -20,
        clientY: 180,
      });
      expect(scrollBar.thumbOffset).to.eql(0);
    });

    it('track-clickPos + thumbLen > trackLen', () => {
      scrollBar.trackShape.emit('click', {
        stopPropagation: _.identity,
        preventDefault: _.identity,
        clientX: 400,
        clientY: 180,
      });
      expect(scrollBar.thumbOffset).to.eql(360);
    });

    it('updateTrackLen', () => {
      scrollBar.updateTrackLen(190);
      expect(scrollBar.thumbLen).to.eql(10);
      expect(scrollBar.thumbOffset).to.eql(180);
      expect(scrollBar.trackLen).to.eql(190);
    });

    it('updateThumbLen', () => {
      scrollBar.updateThumbLen(30);
      expect(scrollBar.thumbLen).to.eql(30);
    });

    it('updateScrollBarPos', () => {
      scrollBar.updateScrollBarPos({ x: 20, y: 180 });
      expect(scrollBar.position).eql({ x: 20, y: 180 });
    });

    it('updateThumbOffset & newOffset + thumbLen > trackLen', () => {
      scrollBar.updateThumbOffset(380);
      expect(scrollBar.thumbOffset).to.eql(160);
    });

    it('updateThumbOffset & newOffset + thumbLen < thumbLen', () => {
      scrollBar.updateThumbOffset(-20);
      expect(scrollBar.thumbOffset).to.eql(0);
    });
  });

  describe('y scrollBar', () => {
    const scrollBarDiv = document.createElement('div');
    scrollBarDiv.id = 'y-scrollBar';
    document.body.appendChild(scrollBarDiv);

    const canvas = new Canvas({
      containerId: 'y-scrollBar',
      renderer: 'canvas',
      width: 400,
      height: 400,
    });

    const scrollBarCfg = {
      isHorizontal: false,
      trackLen: 380,
      thumbLen: 20,
      position: { x: 180, y: 10 },
      thumbOffset: 30,
      scrollBarStyleCfg: {
        default: {
          size: 8,
        },
      },
    };

    const scrollBar = new ScrollBar(scrollBarCfg);
    canvas.add(scrollBar);
    canvas.draw();

    it('mousedown', () => {
      scrollBar.emit('mousedown', {
        clientX: 180,
        clientY: 30,
        event: {
          preventDefault: _.identity,
        },
      });
      expect(scrollBar._startPos).to.eql(30);
    });

    it('mousemove', () => {
      Simulate.simulate(canvas.get('containerDOM'), 'mousemove', {
        clientX: 180,
        clientY: 80,
      });
      expect(scrollBar.thumbOffset).to.eql(80);
      Simulate.simulate(canvas.get('containerDOM'), 'mouseup', scrollBar.clearEvents);
    });

    it('track-click', () => {
      scrollBar.trackShape.emit('click', {
        stopPropagation: _.identity,
        preventDefault: _.identity,
        clientX: 180,
        clientY: 100,
      });
      expect(scrollBar.thumbOffset).to.eql(0);
    });
    it('updateTrackLen', () => {
      scrollBar.updateTrackLen(300);
      expect(scrollBar.trackLen).to.eql(300);
    });

    it('updateThumbLen', () => {
      scrollBar.updateThumbLen(30);
      expect(scrollBar.thumbLen).to.eql(30);
    });

    it('updateThumbOffset', () => {
      scrollBar.on('scrollchange', (obj) => {
        expect(obj.thumbOffset).to.eql(30);
      });
      scrollBar.updateThumbOffset(30);
      scrollBar.off('scrollchange');
    });

    it('updateThumbOffset same as before', () => {
      let count = 0;
      scrollBar.on('scrollchange', () => {
        count++;
      });
      scrollBar.updateTrackLen(300);
      scrollBar.updateThumbLen(30);
      scrollBar.updateThumbOffset(30);
      scrollBar.updateScrollBarPos({ x: 180, y: 10 });
      expect(count).to.eql(0);
    });

    // 鼠标移动上去的时候，改变颜色
    it('mouse over / out', () => {
      scrollBar.thumbShape.emit('mouseover');

      expect(scrollBar.thumbShape.attrs.stroke).to.be.equal('rgba(0,0,0,0.2)');

      scrollBar.thumbShape.emit('mouseout');
      expect(scrollBar.thumbShape.attrs.stroke).to.be.equal('rgba(0,0,0,0.15)');
    });
  });
});

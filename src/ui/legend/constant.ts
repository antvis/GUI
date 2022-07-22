import { deepMix } from '@antv/util';

export const LEGEND_BASE_DEFAULT_OPTIONS = {
  style: {
    x: 0,
    y: 0,
    padding: 0,
    orient: 'horizontal',
    backgroundStyle: {
      fill: 'transparent',
      lineWidth: 0,
    },
    title: {
      content: '',
      spacing: 4,
      align: 'left',
      style: {
        fontWeight: 'bold',
        fontFamily: 'sans-serif',
        fontSize: 12,
        textAlign: 'top',
        textBaseline: 'top',
        fill: '#2C3542',
      },
    },
    label: {
      style: {
        fill: '#2C3542',
        fillOpacity: 0.65,
        fontSize: 12,
      },
    },
  },
};

export const DEFAULT_ITEM_MARKER = {
  symbol: 'circle',
  size: 8,
};

export const DEFAULT_ITEM_NAME = {
  style: {
    inactive: {
      fill: '#d3d2d3',
      opacity: 0.5,
    },
  },
};

export const DEFAULT_ITEM_VALUE = {
  style: {
    inactive: {
      fill: '#d3d2d3',
      opacity: 0.5,
    },
  },
};

export const DEFAULT_INDICATOR_CFG = {
  padding: [2, 4],
  background: {
    fill: '#262626',
  },
  text: {
    style: {
      fill: '#fff',
      fontSize: 10,
    },
  },
};

export const CATEGORY_DEFAULT_OPTIONS = deepMix({}, LEGEND_BASE_DEFAULT_OPTIONS, {
  style: {
    type: 'category',
    items: [],
    maxWidth: undefined,
    maxHeight: undefined,
    maxCols: undefined,
    maxRows: undefined,
    spacing: [8, 2],
    itemBackground: {
      padding: 0,
      style: {
        fill: 'transparent',
        active: {
          cursor: 'pointer',
        },
      },
    },
    reverse: false, // 倒序放置图例
    pageNavigator: {
      loop: false,
    },
  },
});

export const DEFAULT_RAIL_CFG = {
  width: 100,
  height: 20,
  type: 'color',
  chunked: false,
  ticks: [],
  isGradient: 'auto',
  backgroundColor: '#c5c5c5',
};

export const DEFAULT_LABEL_CFG = {
  style: {
    fontFamily: 'sans-serif',
    fill: '#2C3542',
    fillOpacity: 0.65,
    fontSize: 12,
  },
  spacing: 4,
  formatter: (value: number) => String(value),
  align: 'rail',
  flush: true,
  /** 文本最大宽度 */
  maxWidth: 30,
};

export const DEFAULT_HANDLE_CFG = {
  size: 25,
  stroke: '#c5c5c5',
  fill: '#fff',
  lineWidth: 1,
};

export const DEFAULT_POPTIP_CFG = {
  domStyles: { '.gui-poptip': { padding: '2px', radius: '4px', 'box-shadow': 'none', 'min-width': '20px' } },
};

export const CONTINUOUS_DEFAULT_OPTIONS = deepMix({}, LEGEND_BASE_DEFAULT_OPTIONS, {
  style: {
    type: 'continuous',
    color: [
      '#d0e3fa',
      '#acc7f6',
      '#8daaf2',
      '#6d8eea',
      '#4d73cd',
      '#325bb1',
      '#5a3e75',
      '#8c3c79',
      '#e23455',
      '#e7655b',
    ],
    label: DEFAULT_LABEL_CFG,
    rail: DEFAULT_RAIL_CFG,
    // 不可滑动时隐藏手柄
    slidable: true,
    indicator: {
      size: 8,
      spacing: 10,
      padding: 5,
      backgroundStyle: {
        fill: '#262626',
        'background-color': '#262626',
        'border-radius': '5px',
      },
      text: {
        style: {
          color: 'white',
          'font-size': '12px',
        },
      },
    },
  },
});

// 连续图例步长比例
export const STEP_RATIO = 0.01;

// 分类图例name和value宽度比例
export const NAME_VALUE_RATIO = 0.5;

/**
 * 默认类名
 */
export const CLASS_NAME = {
  CONTAINER: 'poptip',
  TEXT: 'poptip-text',
};

/**
 * 12 个 poptip 显示方向
 */
export const POSITIONS = [
  'top',
  'bottom',
  'left',
  'right',
  'top-left',
  'top-right',
  'bottom-left',
  'bottom-right',
  'left-top',
  'left-bottom',
  'right-top',
  'right-bottom',
];

/**
 * 默认 style
 */
export const POPTIP_STYLE = {
  // 容器 默认 style
  [`.${CLASS_NAME.CONTAINER}`]: {
    visibility: 'visible',
    position: 'absolute',
    'background-color': 'rgba(0, 0, 0)',
    'box-shadow': '0px 0px 10px #aeaeae',
    'border-radius': '3px',
    color: '#fff',
    opacity: 0.8,
    'font-size': '12px',
    'line-height': '20px',
    padding: '10px 10px 10px 10px',
    display: 'flex',
    'justify-content': 'center',
    'align-items': 'center',
    'z-index': 8,
  },
  // 文本内容 默认 style
  [`.${CLASS_NAME.TEXT}`]: {
    'text-align': 'center',
  },
  [`.${CLASS_NAME.CONTAINER}-top`]: {
    transform: `translate(-50%, -100%)`,
  },
  [`.${CLASS_NAME.CONTAINER}-left`]: {
    transform: `translate(-100%, -50%)`,
  },
  [`.${CLASS_NAME.CONTAINER}-right`]: {
    transform: `translate(0, -50%)`,
  },
  [`.${CLASS_NAME.CONTAINER}-bottom`]: {
    transform: `translate(-50%, 0)`,
  },
  [`.${CLASS_NAME.CONTAINER}-top-left`]: {
    transform: `translate(0,-100%)`,
  },
  [`.${CLASS_NAME.CONTAINER}-top-right`]: {
    transform: `translate(-100%,-100%)`,
  },
  [`.${CLASS_NAME.CONTAINER}-left-top`]: {
    transform: `translate(-100%, 0)`,
  },
  [`.${CLASS_NAME.CONTAINER}-left-bottom`]: {
    transform: `translate(-100%, -100%)`,
  },
  [`.${CLASS_NAME.CONTAINER}-right-top`]: {
    transform: `translate(0, 0)`,
  },
  [`.${CLASS_NAME.CONTAINER}-right-bottom`]: {
    transform: `translate(0, -100%)`,
  },
  [`.${CLASS_NAME.CONTAINER}-bottom-left`]: {
    transform: `translate(0, 0)`,
  },
  [`.${CLASS_NAME.CONTAINER}-bottom-right`]: {
    transform: `translate(-100%, 0)`,
  },
};

/**
 * tooltip 内置 样式
 * -span 为 tooltip 指向小尖头 的 配置
 */
export const TOOLTIP_STYLE = {
  [`.${CLASS_NAME.CONTAINER}-span`]: {
    width: '6px',
    height: '6px',
    transform: 'rotate(45deg)',
    'background-color': 'rgba(0, 0, 0)',
    position: 'absolute',
  },
  [`.${CLASS_NAME.CONTAINER}-top-tooltip`]: {
    transform: `translate(-50%, calc(-100% - 5px))`,
  },
  [`.${CLASS_NAME.CONTAINER}-top-span`]: {
    bottom: '-3px',
  },
  [`.${CLASS_NAME.CONTAINER}-left-tooltip`]: {
    transform: `translate(calc(-100% - 5px), -50%)`,
  },
  [`.${CLASS_NAME.CONTAINER}-left-span`]: {
    right: '-3px',
  },
  [`.${CLASS_NAME.CONTAINER}-right-tooltip`]: {
    transform: `translate(5px, -50%)`,
  },
  [`.${CLASS_NAME.CONTAINER}-right-span`]: {
    left: '-3px',
  },
  [`.${CLASS_NAME.CONTAINER}-bottom-tooltip`]: {
    transform: `translate(-50%, 5px)`,
  },
  [`.${CLASS_NAME.CONTAINER}-bottom-span`]: {
    top: '-3px',
  },
  [`.${CLASS_NAME.CONTAINER}-top-left-tooltip`]: {
    transform: `translate(0, calc(-100% - 5px))`,
  },
  [`.${CLASS_NAME.CONTAINER}-top-left-span`]: {
    left: '10px',
    bottom: '-3px',
  },
  [`.${CLASS_NAME.CONTAINER}-top-right-tooltip`]: {
    transform: `translate(-100%, calc(-100% - 5px))`,
  },
  [`.${CLASS_NAME.CONTAINER}-top-right-span`]: {
    right: '10px',
    bottom: '-3px',
  },
  [`.${CLASS_NAME.CONTAINER}-left-top-tooltip`]: {
    transform: `translate(calc(-100% - 5px), 0)`,
  },
  [`.${CLASS_NAME.CONTAINER}-left-top-span`]: {
    right: '-3px',
    top: '8px',
  },
  [`.${CLASS_NAME.CONTAINER}-left-bottom-tooltip`]: {
    transform: `translate(calc(-100% - 5px), -100%)`,
  },
  [`.${CLASS_NAME.CONTAINER}-left-bottom-span`]: {
    right: '-3px',
    bottom: '8px',
  },
  [`.${CLASS_NAME.CONTAINER}-right-top-tooltip`]: {
    transform: `translate(5px, 0)`,
  },
  [`.${CLASS_NAME.CONTAINER}-right-top-span`]: {
    left: '-3px',
    top: '8px',
  },
  [`.${CLASS_NAME.CONTAINER}-right-bottom-tooltip`]: {
    transform: `translate(5px, -100%)`,
  },
  [`.${CLASS_NAME.CONTAINER}-right-bottom-span`]: {
    left: '-3px',
    bottom: '8px',
  },
  [`.${CLASS_NAME.CONTAINER}-bottom-left-tooltip`]: {
    transform: `translate(0, 5px)`,
  },
  [`.${CLASS_NAME.CONTAINER}-bottom-left-span`]: {
    top: '-3px',
    left: '8px',
  },
  [`.${CLASS_NAME.CONTAINER}-bottom-right-tooltip`]: {
    transform: `translate(-100%, 5px)`,
  },
  [`.${CLASS_NAME.CONTAINER}-bottom-right-span`]: {
    top: '-3px',
    right: '8px',
  },
};

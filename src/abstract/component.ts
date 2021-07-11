import { CustomElement, DisplayObject, ShapeCfg } from '../types';

export type AttrsType = { [key: string]: any };
type AttrsCallback = (isUpdated?: boolean, oldAttrs?: AttrsType) => AttrsType;
type Constructable<D = DisplayObject> = {
  new (...args: any[]): D;
};

export abstract class Component<T extends ShapeCfg> extends CustomElement {
  protected subComponentPool = new Map<string, AttrsCallback>();

  protected static defaultOptions: { [key: string]: any };

  constructor(options: T) {
    super(options);
  }

  public update(attrs: AttrsType): void {
    // 将cfg.attr合并到this.attributes
    this.attr(attrs);
    this.updateSubComponent();
  }

  protected abstract init(): void;

  public reRender(): void {
    this.removeChildren();
    this.init();
  }

  protected updateSubComponent(): void {
    this.subComponentPool.forEach((attrsCallback, name) => {
      const target = this.getSubComponent(name);
      const oldAttrs = target.attributes;
      target.attr(attrsCallback(true, oldAttrs));
    });
  }

  /**
   * 向当前组件添加子组件
   * @param name 子组件名
   * @param Shape 子组件类型
   * @param attrsCallback 参数获取回调方法
   * @param config 配置项
   * @param parent 插入节点
   * @returns
   */
  protected appendSubComponent(
    name: string,
    Shape: Constructable,
    attrsCallback: AttrsCallback,
    config: {} = {},
    parent: DisplayObject = this
  ) {
    const shape = new Shape({
      ...config,
      attrs: attrsCallback(),
    });
    this.subComponentPool.set(name, attrsCallback);
    parent.appendChild(shape);
    this[name] = shape;
    return shape;
  }

  protected getSubComponent(name: string) {
    return this[name];
  }

  protected removeSubComponent(name: string): void {
    const shape = this.getSubComponent(name);
    this.removeChild(shape);
    this.subComponentPool.delete(name);
  }
}

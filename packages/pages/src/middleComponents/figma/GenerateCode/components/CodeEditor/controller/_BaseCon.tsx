import { camelToKebabCase, toValidVariableName } from "@taozi-chrome-extensions/common/src/utils/global";
import { type VNode } from "vue";
import CodeNode from "../components/CodeNode/index.vue";
import ConBaseEditor from "../components/ConBaseEditor/index.vue";
import ConStyleEditor from "../components/ConStyleEditor/index.vue";
import { getKey } from "../utils";

export interface BaseConConfig<T extends string = string> {
  id: string;
  tagName: T;
  name: string;
  styleProps: {
    property: string;
    value: string;
    disabled?: boolean;
  }[];
  /** 自定义组件名称 */
  customComName: string;
  /** 禁用 */
  disabled: boolean;
  /** 展开子节点树 */
  expansionChildrenNodeTree: boolean;
}

export interface RenderNodeTreeOptions {
  indent?: number;
  activeConKey?: string;
  click?: (con: BaseCon) => void;
}

export interface RenderEditorOptions {
  imageAssets: string[];
}

export enum EditorType {
  base = "base",
  style = "style"
}

export abstract class BaseCon<C extends BaseConConfig = BaseConConfig<string>> {
  static tagName = "";

  readonly config: C;

  private _key: string;

  private parent_?: () => BaseCon;
  private children_?: BaseCon[];

  constructor(config?: Partial<C>) {
    const { id, tagName, name, styleProps, customComName, disabled, expansionChildrenNodeTree } = config ?? {};
    if (!tagName) {
      throw new Error("tagName is required");
    }

    this._key = getKey();

    this.config = {
      id: id || `${tagName}-id-${getKey()}`,
      tagName,
      name: name ?? "",
      styleProps: styleProps ?? [],
      customComName: customComName ?? "",
      disabled: disabled ?? false,
      expansionChildrenNodeTree: expansionChildrenNodeTree ?? false
    } as C;
  }

  get key(): string {
    return this._key;
  }

  get classNames(): string[] {
    return [
      /**
       * 将 name 转换为 kebab-case 格式
       */
      camelToKebabCase(toValidVariableName(this.config.name))
    ].filter(Boolean);
  }

  get lineStyle(): string {
    return (
      this.config.styleProps
        ?.filter(item => !item.disabled)
        ?.map(item => `${item.property}:${item.value}`)
        .join(";") || ""
    );
  }

  set parent(parent: (() => BaseCon) | undefined) {
    this.parent_ = parent;
  }

  get parent(): (() => BaseCon) | undefined {
    return this.parent_;
  }

  set children(children: BaseCon[]) {
    this.children_ = children;

    this.children_?.forEach(child => (child.parent = () => this));
  }

  get children(): BaseCon[] | undefined {
    return this.children_;
  }

  renderHtml(): VNode {
    if (this.config.disabled) {
      return <></>;
    }
    return this.getHtml();
  }

  renderNodeTree(options?: RenderNodeTreeOptions): VNode {
    const { indent = 0, activeConKey, click } = options ?? {};
    return (
      <CodeNode con={this} indent={indent} activeConKey={activeConKey} onClick={click}>
        {this.children?.map(child => child.renderNodeTree({ ...options, indent: indent + 1 }))}
      </CodeNode>
    );
  }

  renderEditor(options?: RenderEditorOptions): VNode {
    return <>{this.getEditor(options).map(item => item.component)}</>;
  }

  protected getHtml(): VNode {
    return <></>;
  }

  protected getEditor(options?: RenderEditorOptions): { type: string; component: VNode }[] {
    return [
      {
        type: EditorType.base,
        component: <ConBaseEditor con={this} />
      },
      {
        type: EditorType.style,
        component: <ConStyleEditor con={this} />
      }
    ];
  }
}

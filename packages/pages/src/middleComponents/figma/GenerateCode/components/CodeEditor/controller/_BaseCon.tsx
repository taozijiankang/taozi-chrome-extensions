import { camelToKebabCase, toValidVariableName } from "@taozi-chrome-extensions/common/src/utils/global";
import { type VNode } from "vue";
import { v4 as uuidv4 } from "uuid";
import CodeNode from "../components/CodeNode/index.vue";
import ConNameEditor from "../components/ConNameEditor/index.vue";
import ConStyleEditor from "../components/ConStyleEditor/index.vue";

export interface BaseConConfig<T extends string = string> {
  tagName: T;
  name: string;
  styleProps?: {
    property: string;
    value: string;
    disabled?: boolean;
  }[];
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
  name = "name",
  style = "style"
}

export abstract class BaseCon {
  static tagName = "";

  key: string;

  private parent_?: () => BaseCon;
  private children_?: BaseCon[];

  /** 展开子节点树 */
  expansionChildrenNodeTree = false;

  constructor(public readonly config: BaseConConfig) {
    this.key = uuidv4();
  }

  get className(): string {
    /**
     * 将 name 转换为 kebab-case 格式
     */
    return camelToKebabCase(toValidVariableName(this.config.name));
  }

  get lineStyle(): string {
    return this.config.styleProps?.map(item => `${item.property}:${item.value}`).join(";") || "";
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
    return <></>;
  }

  renderNodeTree(options?: RenderNodeTreeOptions): VNode {
    const { indent = 0, activeConKey, click } = options ?? {};
    return (
      <CodeNode con={this} indent={indent} activeConKey={activeConKey} onClick={click}>
        {this.children?.map(child => child.renderNodeTree({ ...options, indent: indent + 1 }))}
      </CodeNode>
    );
  }

  protected getEditor(options?: RenderEditorOptions): { type: string; component: VNode }[] {
    return [
      {
        type: EditorType.name,
        component: <ConNameEditor con={this} />
      },
      {
        type: EditorType.style,
        component: <ConStyleEditor con={this} />
      }
    ];
  }

  renderEditor(options?: RenderEditorOptions): VNode {
    return <>{this.getEditor(options).map(item => item.component)}</>;
  }
}

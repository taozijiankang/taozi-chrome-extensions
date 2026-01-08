import { camelToKebabCase, toValidVariableName } from "@taozi-chrome-extensions/common/src/utils/global";
import { type VNode } from "vue";
import { v4 as uuidv4 } from "uuid";
import ConNodeCon from "../components/ConNodeCon/index.vue";
import CodeNode from "../components/CodeNode/index.vue";

export interface BaseConProps<T extends string = string> {
  tagName: T;
  name: string;
  styleProps?: { property: string; value: string }[];
}

export interface RenderCodeProps {
  indent?: number;
  activeConKey?: string;
  click?: (con: BaseCon) => void;
}

export abstract class BaseCon {
  static tagName = "";

  key: string;

  private parent_?: () => BaseCon;
  private children_?: BaseCon[];

  constructor(public readonly props: BaseConProps) {
    this.key = uuidv4();
  }

  get className(): string {
    /**
     * 将 name 转换为 kebab-case 格式
     */
    return camelToKebabCase(toValidVariableName(this.props.name));
  }

  get lineStyle(): string {
    return this.props.styleProps?.map(item => `${item.property}:${item.value}`).join(";") || "";
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

  renderCode(props?: RenderCodeProps): VNode {
    const { indent = 0, activeConKey, click } = props ?? {};
    return (
      <CodeNode con={this} indent={indent} activeConKey={activeConKey} onClick={click}>
        {this.children?.map(child => child.renderCode({ ...props, indent: indent + 1 }))}
      </CodeNode>
    );
  }

  renderCon(): VNode {
    return <ConNodeCon con={this} />;
  }
}

import type { AnthropicChat } from "@taozi-chrome-extensions/common/src/type";
import type { BaseCon } from "../controller";
import { JSON_OUTPUT_SYSTEM_PROMPT } from "@taozi-chrome-extensions/common/src/constant/prompt";
import { requestAnthropicChatMessage } from "@taozi-chrome-extensions/common/src/message";

export interface OptimizeConComponentNameResult {
  key: string;
  name: string;
}

export interface OptimizeConComponentStyleResult {
  key: string;
  styles: {
    property: string;
    value: string;
  }[];
}

/**
 * 解析大模型返回的内容（兼容 succeed 为 false 的情况）
 */
function parseResponseContent<T>(res: { succeed: boolean; data?: AnthropicChat.Res; msg?: string }): T {
  if (!res.succeed || !res.data) {
    throw new Error(res.msg || "大模型请求失败");
  }
  const text = res.data.content
    .filter(block => block.type === "text")
    .map(block => block.text ?? "")
    .join("");
  return JSON.parse(text || "[]") as T;
}

export async function optimizeConComponentName(con: BaseCon): Promise<OptimizeConComponentNameResult[]> {
  const prompt = con.getPrompt();
  if (!prompt) {
    throw new Error("获取节点提示词失败");
  }

  const response = await requestAnthropicChatMessage.sendMessage({
    model: "",
    max_tokens: 0,
    system: JSON_OUTPUT_SYSTEM_PROMPT,
    messages: [
      {
        role: "user",
        content: `你是一名资深前端工程师。请为下面这段 HTML 中的元素重新命名 class，使其语义化、可读、简洁。

# 命名依据（按重要性从高到低）
1. 元素上的 HTML 注释 \`<!-- ... -->\`：这是该节点的设计语义描述，最能反映它的用途
2. 文本内容、\`img\` 的 \`alt\`
3. 标签类型与子节点结构：据此判断它是容器、按钮、标题、列表、图标等

# 命名规则
- 使用 kebab-case，只含小写字母、数字和连字符
- 语义化，描述「是什么 / 起什么作用」，而非外观（用 \`submit-button\` 而不是 \`blue-box\`）
- 尽量简短，通常 1-3 个单词
- 在整段 HTML 范围内必须唯一，禁止重复
- 禁止空字符串

# 待处理 HTML
\`\`\`html
${prompt}
\`\`\`

# 输出
JSON 数组，每个元素为 {"key": string, "name": string}：
- key：必须原样照抄节点的 data-key 属性值
- name：新的 class 名
- 只返回需要重命名的节点；无需改动的可以省略
示例：[{"key":"123","name":"submit-button"}]`
      }
    ],
    temperature: 0.3
  });

  return parseResponseContent<OptimizeConComponentNameResult[]>(response);
}

export async function optimizeConComponentStyle(con: BaseCon): Promise<OptimizeConComponentStyleResult[]> {
  const prompt = con.getPrompt();
  if (!prompt) {
    throw new Error("获取节点提示词失败");
  }

  const response = await requestAnthropicChatMessage.sendMessage({
    model: "",
    max_tokens: 0,
    system: JSON_OUTPUT_SYSTEM_PROMPT,
    messages: [
      {
        role: "user",
        content: `你是一名资深前端工程师。下面这段 HTML 的内联样式通常由设计稿（如 Figma）直接导出，请在「保持视觉效果基本一致」的前提下优化它们。

# 常见问题与优化方向
- 大量绝对定位（position: absolute + 写死的 left/top）：在合适处改用 flex 布局或常规文档流
- 写死的宽高：非必要时移除或改为更弹性的方案，避免破坏自适应
- 冗余、重复、可合并的声明：合并为简写（如 margin/padding/font 等），删除无效声明
- 保留确实需要的关键样式，不要丢失原有视觉表现（颜色、字号、圆角、间距等）

# 待处理 HTML
\`\`\`html
${prompt}
\`\`\`

# ⚠️ 重要约束
你为某个节点返回的 styles 会【整体替换】该节点的原有样式。
因此对于每个要调整的节点，必须返回它优化后的【完整】样式列表，而不是只返回改动的部分，否则未返回的样式会丢失。

# 输出
JSON 数组，每个元素为 {"key": string, "styles": {"property": string, "value": string}[]}：
- key：必须原样照抄节点的 data-key 属性值
- styles：该节点优化后的完整样式列表（property 为 CSS 属性名，value 为属性值）
- 只返回需要调整样式的节点；无需改动的可以省略
示例：[{"key":"123","styles":[{"property":"display","value":"flex"},{"property":"gap","value":"8px"},{"property":"color","value":"#000000"}]}]`
      }
    ],
    temperature: 0.3
  });

  return parseResponseContent<OptimizeConComponentStyleResult[]>(response);
}

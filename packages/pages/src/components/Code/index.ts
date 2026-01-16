import Color from "color";

export enum CodeType {
  Html = "html",
  Css = "css",
  Ts = "ts"
}

// Token 类型定义
export interface CodeToken {
  type:
    | "text"
    | "keyword"
    | "string"
    | "number"
    | "comment"
    | "color"
    | "function"
    | "variable"
    | "operator"
    | "property"
    | "tag"
    | "attribute";
  value: string;
  style?: Record<string, string>;
}

export interface ParsedLine {
  line: string;
  tokens: CodeToken[];
  imageUrl?: string;
}

// 颜色正则
const colorRegex =
  /(#[0-9a-f]{3,8}|rgb\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*\)|rgba\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*,\s*[\d.]+\s*\)|hsl\(\s*\d+\s*,\s*\d+%\s*,\s*\d+%\s*\)|hsla\(\s*\d+\s*,\s*\d+%\s*,\s*\d+%\s*,\s*[\d.]+\s*\))/gi;

// JavaScript/TypeScript 关键字
const jsKeywords =
  /\b(const|let|var|function|class|extends|import|export|from|default|return|if|else|for|while|do|switch|case|break|continue|try|catch|finally|throw|new|this|super|static|async|await|typeof|instanceof|in|of|true|false|null|undefined|void)\b/g;

// 字符串匹配（支持单引号、双引号、模板字符串）
const stringRegex = /(['"`])(?:(?=(\\?))\2.)*?\1|`[^`]*`/g;

// 数字匹配
const numberRegex = /\b\d+\.?\d*\b/g;

// 注释匹配
const commentRegex = /\/\/.*$|\/\*[\s\S]*?\*\//g;

// CSS 选择器
const cssSelectorRegex = /^[\w.#:[\s>+~,()]+(?=\s*\{)/;

// CSS 属性名
const cssPropertyRegex = /\b([a-z-]+)(?=\s*:)/gi;

// CSS 函数
const cssFunctionRegex = /\b([a-z-]+)\s*\(/gi;

// 图片链接正则（匹配 URL 和 base64）
const imageUrlRegex = /(https?:\/\/[^\s"'<>]+\.(jpg|jpeg|png|gif|webp|svg|bmp|ico)|data:image\/[^;]+;base64,[A-Za-z0-9+/=]+)/gi;

// 注意：不需要手动转义 HTML，因为 Vue 的 {{ }} 插值会自动转义

/**
 * 解析 CSS 代码
 */
function parseCssLine(line: string): CodeToken[] {
  const tokens: CodeToken[] = [];
  let lastIndex = 0;

  // 匹配颜色值
  const colorMatches = Array.from(line.matchAll(colorRegex));
  colorMatches.forEach(match => {
    if (match.index !== undefined) {
      // 添加颜色之前的文本
      if (match.index > lastIndex) {
        tokens.push({
          type: "text",
          value: line.slice(lastIndex, match.index)
        });
      }

      // 添加颜色 token
      const colorValue = match[0];
      try {
        const color = new Color(colorValue);
        tokens.push({
          type: "color",
          value: colorValue,
          style: {
            backgroundColor: colorValue,
            color: color.isDark() ? "white" : "black",
            padding: "2px 4px",
            borderRadius: "3px",
            fontWeight: "500"
          }
        });
      } catch {
        tokens.push({
          type: "text",
          value: colorValue
        });
      }

      lastIndex = match.index + match[0].length;
    }
  });

  // 添加剩余文本
  if (lastIndex < line.length) {
    const remaining = line.slice(lastIndex);
    // 检查是否是注释
    const commentMatch = remaining.match(commentRegex);
    if (commentMatch && commentMatch.index === 0) {
      tokens.push({
        type: "comment",
        value: remaining
      });
    } else {
      // 检查是否是属性名
      const propertyMatch = remaining.match(cssPropertyRegex);
      if (propertyMatch && propertyMatch.index === 0) {
        tokens.push({
          type: "property",
          value: propertyMatch[0]
        });
        if (propertyMatch[0].length < remaining.length) {
          tokens.push({
            type: "text",
            value: remaining.slice(propertyMatch[0].length)
          });
        }
      } else {
        tokens.push({
          type: "text",
          value: remaining
        });
      }
    }
  }

  return tokens.length > 0 ? tokens : [{ type: "text", value: line }];
}

/**
 * 解析 JavaScript/TypeScript 代码
 */
function parseJsLine(line: string): CodeToken[] {
  const tokens: CodeToken[] = [];
  let processed = line;
  const matches: Array<{ index: number; length: number; type: CodeToken["type"]; value: string }> = [];

  // 收集所有匹配项
  let match;

  // 字符串
  while ((match = stringRegex.exec(line)) !== null) {
    matches.push({
      index: match.index,
      length: match[0].length,
      type: "string",
      value: match[0]
    });
  }

  // 注释
  while ((match = commentRegex.exec(line)) !== null) {
    matches.push({
      index: match.index,
      length: match[0].length,
      type: "comment",
      value: match[0]
    });
  }

  // 关键字（排除字符串和注释中的）
  const keywordMatches = Array.from(line.matchAll(jsKeywords));
  keywordMatches.forEach(match => {
    if (match.index !== undefined) {
      // 检查是否在字符串或注释中
      const inStringOrComment = matches.some(m => m.index <= match.index! && match.index! < m.index + m.length);
      if (!inStringOrComment) {
        matches.push({
          index: match.index,
          length: match[0].length,
          type: "keyword",
          value: match[0]
        });
      }
    }
  });

  // 数字（排除字符串和注释中的）
  const numberMatches = Array.from(line.matchAll(numberRegex));
  numberMatches.forEach(match => {
    if (match.index !== undefined) {
      const inStringOrComment = matches.some(m => m.index <= match.index! && match.index! < m.index + m.length);
      if (!inStringOrComment) {
        matches.push({
          index: match.index,
          length: match[0].length,
          type: "number",
          value: match[0]
        });
      }
    }
  });

  // 按索引排序
  matches.sort((a, b) => a.index - b.index);

  // 构建 tokens
  let lastIndex = 0;
  matches.forEach(m => {
    if (m.index > lastIndex) {
      tokens.push({
        type: "text",
        value: line.slice(lastIndex, m.index)
      });
    }
    tokens.push({
      type: m.type,
      value: m.value
    });
    lastIndex = m.index + m.length;
  });

  if (lastIndex < line.length) {
    tokens.push({
      type: "text",
      value: line.slice(lastIndex)
    });
  }

  return tokens.length > 0 ? tokens : [{ type: "text", value: line }];
}

/**
 * 解析 HTML/Vue 代码
 */
function parseHtmlLine(line: string): CodeToken[] {
  const tokens: CodeToken[] = [];
  let lastIndex = 0;

  // 匹配 HTML 标签（包括开始标签、结束标签、自闭合标签）
  const tagRegex = /<\/?[\w\s="':;.#-]+>/g;
  const tagMatches = Array.from(line.matchAll(tagRegex));

  // 匹配 HTML 注释
  const commentRegex = /<!--[\s\S]*?-->/g;
  const commentMatches = Array.from(line.matchAll(commentRegex));

  // 合并所有匹配项并按位置排序
  const allMatches: Array<{ index: number; end: number; type: "tag" | "comment"; value: string }> = [];

  tagMatches.forEach(match => {
    if (match.index !== undefined) {
      allMatches.push({
        index: match.index,
        end: match.index + match[0].length,
        type: "tag",
        value: match[0]
      });
    }
  });

  commentMatches.forEach(match => {
    if (match.index !== undefined) {
      allMatches.push({
        index: match.index,
        end: match.index + match[0].length,
        type: "comment",
        value: match[0]
      });
    }
  });

  // 按索引排序
  allMatches.sort((a, b) => a.index - b.index);

  // 构建 tokens
  allMatches.forEach(match => {
    // 添加匹配之前的文本
    if (match.index > lastIndex) {
      tokens.push({
        type: "text",
        value: line.slice(lastIndex, match.index)
      });
    }

    // 添加匹配的 token
    if (match.type === "comment") {
      tokens.push({
        type: "comment",
        value: match.value
      });
    } else {
      tokens.push({
        type: "tag",
        value: match.value
      });
    }

    lastIndex = match.end;
  });

  // 添加剩余文本
  if (lastIndex < line.length) {
    tokens.push({
      type: "text",
      value: line.slice(lastIndex)
    });
  }

  return tokens.length > 0 ? tokens : [{ type: "text", value: line }];
}

/**
 * 解析代码
 */
/**
 * 检测行中的图片链接
 */
function detectImageUrl(line: string): string | undefined {
  const matches = line.match(imageUrlRegex);
  return matches && matches.length > 0 ? matches[0] : undefined;
}

export function parseCode(code: string, type: CodeType): ParsedLine[] {
  return code.split("\n").map(line => {
    let tokens: CodeToken[];

    switch (type) {
      case CodeType.Css:
        tokens = parseCssLine(line);
        break;
      case CodeType.Ts:
        tokens = parseJsLine(line);
        break;
      case CodeType.Html:
        tokens = parseHtmlLine(line);
        break;
      default:
        tokens = [{ type: "text", value: line }];
    }

    // 检测图片链接
    const imageUrl = detectImageUrl(line);

    return {
      line,
      tokens,
      imageUrl
    };
  });
}

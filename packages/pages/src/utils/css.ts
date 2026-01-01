export interface SimpleCssRule {
  selector: string;
  declarations: Array<{ property: string; value: string }>;
}

export function parseCssWithRegex(cssText: string): SimpleCssRule[] {
  const rules: SimpleCssRule[] = [];

  // 移除注释
  const cleanedCss = cssText.replace(/\/\*[\s\S]*?\*\//g, "");

  // 匹配CSS规则：选择器 { 属性: 值; ... }
  // 这个正则可以匹配类选择器、ID选择器、标签选择器等
  const ruleRegex = /([^{]+)\{([^}]+)\}/g;
  let match;

  while ((match = ruleRegex.exec(cleanedCss)) !== null) {
    const selector = match[1].trim();
    const declarationsText = match[2].trim();

    // 解析属性声明
    const declarations: Array<{ property: string; value: string }> = [];
    const declarationRegex = /([^:]+):([^;]+);?/g;
    let declMatch;

    while ((declMatch = declarationRegex.exec(declarationsText)) !== null) {
      const property = declMatch[1].trim();
      const value = declMatch[2].trim();
      declarations.push({ property, value });
    }

    rules.push({
      selector,
      declarations
    });
  }

  return rules;
}

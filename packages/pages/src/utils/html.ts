import { type DefaultTreeAdapterTypes, parse } from "parse5";

export function parseHtml(html: string) {
  return filterChildNodes(parse(html).childNodes);
}

function filterChildNodes(childNodes: DefaultTreeAdapterTypes.ChildNode[]): DefaultTreeAdapterTypes.ChildNode[] {
  return childNodes
    .filter(node => {
      if (ifTextNode(node)) {
        return Boolean(node.value.trim());
      }
      return true;
    })
    .map(node => {
      if (ifTemplateNode(node) || ifElementNode(node)) {
        return {
          ...node,
          childNodes: filterChildNodes(node.childNodes)
        };
      }
      return node;
    });
}

export function ifTemplateNode(node: DefaultTreeAdapterTypes.Node): node is DefaultTreeAdapterTypes.Template {
  if (node.nodeName === "template") {
    return true;
  }
  return false;
}

export function ifCommentNode(node: DefaultTreeAdapterTypes.Node): node is DefaultTreeAdapterTypes.CommentNode {
  if (node.nodeName === "#comment") {
    return true;
  }
  return false;
}

export function ifTextNode(node: DefaultTreeAdapterTypes.Node): node is DefaultTreeAdapterTypes.TextNode {
  if (node.nodeName === "#text") {
    return true;
  }
  return false;
}

export function ifDocumentTypeNode(node: DefaultTreeAdapterTypes.Node): node is DefaultTreeAdapterTypes.DocumentType {
  if (node.nodeName === "#documentType") {
    return true;
  }
  return false;
}

export function ifElementNode(node: DefaultTreeAdapterTypes.Node): node is DefaultTreeAdapterTypes.Element {
  if (!ifTemplateNode(node) && !ifCommentNode(node) && !ifTextNode(node) && !ifDocumentTypeNode(node)) {
    return true;
  }
  return false;
}

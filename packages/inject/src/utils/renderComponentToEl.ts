import "element-plus/dist/index.css";
import { createApp, type VNode } from "vue";

export async function renderComponentToEl({ mountEl, render }: { mountEl: HTMLElement; render: () => VNode }) {
  if (!document.body.contains(mountEl)) {
    throw new Error("mountEl is not in the body");
  }
  const el = document.createElement("div");
  mountEl.appendChild(el);
  const shadowRoot = el.attachShadow({ mode: "open" });
  const html = document.createElement("html");
  shadowRoot.appendChild(html);

  const head = document.createElement("head");
  html.appendChild(head);
  const body = document.createElement("body");
  body.style.margin = "0";
  html.appendChild(body);
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = chrome.runtime.getURL("inject/index.css");
  await new Promise<void>((resolve) => {
    link.addEventListener("load", () => resolve());
    head.appendChild(link);
  });
  const vueMountEl = document.createElement("div");
  body.appendChild(vueMountEl);
  createApp({
    render,
  }).mount(vueMountEl);
}

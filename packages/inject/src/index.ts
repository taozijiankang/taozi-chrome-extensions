import { codesignInject } from "./codesignInject/index";
import { weixinMpInject } from "./weixinMpInject/index";
import { figmaInject } from "./figmaInject/index";

console.log("taozi-chrome-extensions 注入脚本开始执行，当前域名：", location.hostname);

switch (location.hostname) {
  case "codesign.qq.com":
    codesignInject();
    break;
  case "mp.weixin.qq.com":
    weixinMpInject();
    break;
  case "www.figma.com":
    figmaInject();
    break;
}

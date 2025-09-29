import { codesignInject } from "./codesignInject/index";
import { weixinMpInject } from "./weixinMpInject/index";

switch (location.hostname) {
  case "codesign.qq.com":
    codesignInject();
    break;
  case "mp.weixin.qq.com":
    weixinMpInject();
    break;
}

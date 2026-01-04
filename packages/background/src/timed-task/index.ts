import { messageAlert } from "./messageAlert";
import { checkLatestVersion } from "./checkLatestVersion";

export function startTimedTask() {
  messageAlert();
  checkLatestVersion();

  setInterval(() => {
    messageAlert();
  }, 300);

  setInterval(
    () => {
      checkLatestVersion();
    },
    // 3 分钟检查一次
    1000 * 60 * 3
  );
}

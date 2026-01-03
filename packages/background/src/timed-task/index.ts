import { checkNewVersion } from "./checkNewVersion";

export function startTimedTask() {
  checkNewVersion();

  setInterval(
    () => {
      checkNewVersion();
    },
    // 3 分钟检查一次
    1000 * 60 * 3
  );
}

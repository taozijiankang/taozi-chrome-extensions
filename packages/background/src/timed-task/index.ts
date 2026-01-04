import { messageAlert } from "./messageAlert";

export function startTimedTask() {
  messageAlert();

  setInterval(
    () => {
      messageAlert();
    },
    // 3 分钟检查一次
    1000 * 60 * 3
  );
}

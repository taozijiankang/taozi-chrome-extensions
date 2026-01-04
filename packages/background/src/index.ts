import { startServer } from "./server";
import { startTimedTask } from "./timed-task";

chrome.runtime.onInstalled.addListener(() => {
  console.log("安装扩展");
});

console.log("运行 background servers worker 脚本");

console.log("开始启动 server");
startServer();

console.log("开始启动 timed task");
startTimedTask();

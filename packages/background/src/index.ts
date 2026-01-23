import { startServer } from "./server";
import { startTimedTask } from "./timed-task";

console.log("运行 background servers worker 脚本");

console.log("开始启动 server");
startServer();

console.log("开始启动 timed task");
startTimedTask();

chrome.runtime.onInstalled.addListener(() => {
  console.log("安装扩展");
});
/**
 * 监听此事件 默认唤醒 service worker
 */
chrome.runtime.onStartup.addListener(() => {
  console.log("浏览器启动");
});

/**
 * 通过设置闹钟 保持进程存活
 */
chrome.alarms.create("keepAlive", { periodInMinutes: 1 });
chrome.alarms.onAlarm.addListener(alarm => {
  if (alarm.name === "keepAlive") {
    // console.log("Heartbeat: Keeping service worker active...");
  }
});

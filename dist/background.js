"use strict"
console.error("background页面代码注入---------------")
function t() {
  console.log("arguments：", arguments)
  const e = chrome.extension.getViews()
  console.log("chrome.extension.getViews()：", e)
}
t()
chrome.runtime.onStartup.addListener(function () {
  console.error("浏览器打开事件---初始化插件")
})
chrome.tabs.onUpdated.addListener(function (e, o, n) {
  o.status == "complete" &&
    n.active &&
    (console.error("插件被启动后，就进入了运行阶段"),
    console.error(e, o, n),
    chrome.history.search({ text: "" }, (r) => {
      console.error("获取搜索历史记录", r)
    }))
})
chrome.runtime.onSuspend.addListener(function () {
  console.log("Browser is about to close, save plugin data.")
})

import TabUtils from '@/extentionUtils/tabUtils.js'

const sendMessageToContentScript = function (message, callback) {
  TabUtils.getCurrentTab().then(tab => {
    chrome.tabs.sendMessage(tab.id, message, function (response) {
      if (callback) callback(response)
    })
  })
}

const modules = { sendMessageToContentScript: sendMessageToContentScript }
export default modules

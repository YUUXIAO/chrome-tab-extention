const sendMessageToContentScript = function (message, callback) {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    console.error('----', tabs[0].id, message)
    chrome.tabs.sendMessage(tabs[0].id, message, function (response) {
      if (callback) callback(response)
    })
  })
}

const modules = { sendMessageToContentScript: sendMessageToContentScript }
export default modules

import { RetweetOutlined } from '@ant-design/icons'

const NoticifationsID = {
  tabRemaind: 'TAB_REMAIND', // tab通知到期提示
}
const permissions = {
  ALLOW: 'granted',
  DENY: 'denied',
}

// 默认配置
const NoticifationsDefaultConfig = {
  type: 'basic',
  iconUrl: 'logo.png',
  title: 'TabsManager',
  message: 'TabsManager桌面提示',
  requireInteraction: true,
}
// 操作通知
class NotificationClass {
  static instance
  constructor() {
    if (!NotificationClass.instance) {
      this.noticifationsIds = NoticifationsID
      this.hasAllowPermission = true
      NotificationClass.hasPermission()
      NotificationClass.instance = this
    }
    return NotificationClass.instance
  }
  // 判断用户是否启用了拓展的通知权限
  static hasPermission() {
    return chrome.notifications.getPermissionLevel(result => {
      if (result === permissions.ALLOW) {
        this.hasAllowPermission = true
      } else {
        console.error('user not permission this opetation!')
        this.hasAllowPermission = false
      }
    })
  }
  static getInstance() {
    return NotificationClass.instance || (NotificationClass.instance = new NotificationClass())
  }
  // 创建通知
  async create(configs) {
    console.error('创建通知创建通知')
    if (!this.hasAllowPermission) return
    await this.clear('noraml')
    console.error('创建通知', this.hasAllowPermission, configs)
    if (configs?.id) {
      this.clear(configs.id)
    }
    const options = Object.assign({}, NoticifationsDefaultConfig, configs)
    const ID = configs?.id || 'normal'
    const { id, ...config } = options
    console.error(33, ID, config)
    return chrome.notifications.create(ID, config)
  }
  // 更新通知
  update(updateConfig) {
    if (!this.hasAllowPermission) return
    if (!updateConfig?.id) {
      throw new Error('updateConfigID is required!')
    }
    const { id, ...config } = updateConfig
    return chrome.notifications.update(updateConfig.id, config)
  }
  // 清除通知
  async clear(id = 'normal') {
    if (!this.hasAllowPermission) return
    if (!id) throw new Error('NoticifationsID is required!')
    await chrome.notifications.clear(id)
  }
  // 按钮点击
  clickEvent() {
    chrome.notifications.onClicked.addListener(function (notificationId, buttonIndex) {
      console.error('按钮点击回调', notificationId, buttonIndex)
    })
  }
  // 非按钮区域点击
  clickOuterEvent() {
    chrome.notifications.onButtonClicked.addListener(function (notificationId, buttonIndex) {
      console.error('非按钮区域点击', notificationId, buttonIndex)
    })
  }
  closed() {
    chrome.notifications.onClosed.addListener(function (notificationId, byUser) {
      console.error('关闭弹窗', notificationId, byUser)
    })
  }
}

const exports = {
  NoticifationsID,
  NotificationClass,
}
export default exports

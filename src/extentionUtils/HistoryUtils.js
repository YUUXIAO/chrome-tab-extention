import { isExtentionEnv } from '@/utils.js'
const mockData = [
  {
    id: '7773',
    lastVisitTime: 1713280370095.727,
    title: 'user - Google 搜索',
    typedCount: 0,
    url: 'https://www.google.com/search?q=user&sourceid=chrome&ie=UTF-8',
    visitCount: 2,
  },
  {
    id: '7799',
    lastVisitTime: 1713280364621.571,
    title: 'chrome.history - Google Chrome 扩展程序开发文档（非官方中文版）',
    typedCount: 0,
    url: 'http://www.kkh86.com/it/chrome-extension-doc/extensions/history.html',
    visitCount: 2,
  },
  {
    id: '3202',
    lastVisitTime: 1713280353857.082,
    title: '展示次数',
    typedCount: 0,
    url: 'https://chrome.google.com/webstore/devconsole/8f22a281-7593-414b-bf2f-0721e6fa5436/nehhlafcillkpfemipfjpankjahjlhhc/analytics/impressions?hl=zh-cn',
    visitCount: 28,
  },
  {
    id: '3201',
    lastVisitTime: 1713280332109.141,
    title: '安装量和卸载量',
    typedCount: 0,
    url: 'https://chrome.google.com/webstore/devconsole/8f22a281-7593-414b-bf2f-0721e6fa5436/nehhlafcillkpfemipfjpankjahjlhhc/analytics/installs?hl=zh-cn',
    visitCount: 27,
  },
  {
    id: '3147',
    lastVisitTime: 1713280328777.773,
    title: '商品详情',
    typedCount: 0,
    url: 'https://chrome.google.com/webstore/devconsole/8f22a281-7593-414b-bf2f-0721e6fa5436/nehhlafcillkpfemipfjpankjahjlhhc/edit?hl=zh-cn',
    visitCount: 86,
  },
  {
    id: '7485',
    lastVisitTime: 1713280326718.073,
    title: '开发者信息中心',
    typedCount: 0,
    url: 'https://chrome.google.com/webstore/devconsole/8f22a281-7593-414b-bf2f-0721e6fa5436?hl=zh-cn&pli=1',
    visitCount: 3,
  },
  {
    id: '7822',
    lastVisitTime: 1713280319623.798,
    title: 'Google 账号',
    typedCount: 0,
    url: 'https://gds.google.com/web/chip?cardIndex=0&hl=zh-CN&authuser=0&gdsid=1866911445&continue=https%3A%2F%2Faccounts.google.com%2FServiceLogin%3Fcontinue%3Dhttps%253A%252F%252Fchrome.google.com%252Fwebstore%252Fdevconsole%252F8f22a281-7593-414b-bf2f-0721e6fa5436%253Fhl%253Dzh-cn%26service%3Dchromewebstore%26hl%3Dzh-CN%26authuser%3D0%26passive%3Dtrue%26sarp%3D1%26aodrpl%3D1%26checkedDomains%3Dyoutube%26checkConnection%3Dyoutube%253A157%26pstMsg%3D1&rapt=AEjHL4Pjtg4Mp4X828AUuTG7_MWM2WEeq2meX1iVRkL1JHN_RpRW7nOJwseZ_BkWUGDWnIxqZn-eaBlXgDgCSozowsnQiqblOQ&ep=p&landing=true',
    visitCount: 1,
  },
  {
    id: '7821',
    lastVisitTime: 1713280319608.758,
    title: 'Google Account',
    typedCount: 0,
    url: 'https://gds.google.com/web/landing?landing=true&ep=p&gdsid=1866911445&authuser=0&hl=zh-CN&continue=https://accounts.google.com/ServiceLogin?continue%3Dhttps%253A%252F%252Fchrome.google.com%252Fwebstore%252Fdevconsole%252F8f22a281-7593-414b-bf2f-0721e6fa5436%253Fhl%253Dzh-cn%26service%3Dchromewebstore%26hl%3Dzh-CN%26authuser%3D0%26passive%3Dtrue%26sarp%3D1%26aodrpl%3D1%26checkedDomains%3Dyoutube%26checkConnection%3Dyoutube%253A157%26pstMsg%3D1&service=chromewebstore&rapt=AEjHL4Pjtg4Mp4X828AUuTG7_MWM2WEeq2meX1iVRkL1JHN_RpRW7nOJwseZ_BkWUGDWnIxqZn-eaBlXgDgCSozowsnQiqblOQ&pli=1',
    visitCount: 2,
  },
  {
    id: '7817',
    lastVisitTime: 1713280314134.283,
    title: 'Chrome 应用商店',
    typedCount: 0,
    url: 'https://accounts.google.com/signin/v2/passkeyenrollment?TL=AEzbmxzyPGZWTweIdtsXAj4fJYROBgxNs6vKPfCU5pkaQjBTOS-xYXDr8hfdn2Ls&checkConnection=youtube%3A163&checkedDomains=youtube&continue=https%3A%2F%2Fchrome.google.com%2Fwebstore%2Fdevconsole%2F8f22a281-7593-414b-bf2f-0721e6fa5436%3Fhl%3Dzh-cn&ddm=0&dsh=S-402018083%3A1713280302076548&flowEntry=ServiceLogin&flowName=GlifWebSignIn&hl=zh-CN&ifkv=ARZ0qKKUtLhqhY29zJc2OGW0yYJGaU-nVhFMbHRsfZQ5YKotnk89SuPBss9IwFR7RkeXu-_sUyDYTg&pstMsg=1&service=chromewebstore&theme=mn&authuser=0',
    visitCount: 1,
  },
  {
    id: '7814',
    lastVisitTime: 1713280303108.496,
    title: 'Chrome 应用商店',
    typedCount: 0,
    url: 'https://accounts.google.com/v3/signin/confirmidentifier?authuser=0&continue=https%3A%2F%2Fchrome.google.com%2Fwebstore%2Fdevconsole%2F8f22a281-7593-414b-bf2f-0721e6fa5436%3Fhl%3Dzh-cn&hl=zh-CN&ifkv=ARZ0qKLd8mdZjfmfAmzOBjlK1600IDNsKS3WuWrOD6DxUc5zmOmC_kq67aMP-tNDR3i8OmEhqwjE&passive=180&service=chromewebstore&flowName=GlifWebSignIn&flowEntry=ServiceLogin&dsh=S-402018083%3A1713280302076548&theme=mn&ddm=0',
    visitCount: 2,
  },
]

// 查询历史记录
const getHistory = query => {
  if (isExtentionEnv()) {
    return chrome.history.search(query)
  } else {
    return new Promise(ressolve => {
      ressolve(mockData)
    })
  }
}

const exports = {
  getHistory,
}

export default exports

import { isExtentionEnv } from '@/utils.js'

const allbookmarks = [
  {
    children: [
      {
        children: [],
        dateAdded: 1699707465879,
        dateGroupModified: 1699707496657,
        id: '1',
        index: 0,
        parentId: '0',
        title: '书签栏',
      },
      {
        children: [
          {
            dateAdded: 1702304846591,
            id: '5',
            index: 0,
            parentId: '2',
            title: '百度一下，你就知道',
            url: 'https://www.baidu.com/',
          },
          {
            dateAdded: 1703820992744,
            id: '7',
            index: 1,
            parentId: '2',
            title: '豆瓣',
            url: 'https://www.douban.com/',
          },
          {
            dateAdded: 1706932907509,
            id: '9',
            index: 2,
            parentId: '2',
            title: 'mongodb',
            url: 'http://127.0.0.1:27017/',
          },
          {
            dateAdded: 1706941976740,
            id: '10',
            index: 3,
            parentId: '2',
            title: 'Mac安装MongoDb保姆级教程以及踩坑笔记（图文详解）_mac mongodb-CSDN博客',
            url: 'https://blog.csdn.net/weixin_46019681/article/details/125491883',
          },
          {
            dateAdded: 1706964243043,
            id: '11',
            index: 4,
            parentId: '2',
            title: '扩展程序',
            url: 'chrome://extensions/',
          },
          {
            dateAdded: 1706964402131,
            id: '12',
            index: 5,
            parentId: '2',
            title: '在react中使用接口请求的方式_react如何调用后端接口-CSDN博客',
            url: 'https://blog.csdn.net/Liu_G_Q/article/details/131737166',
          },
          {
            dateAdded: 1706965595872,
            id: '13',
            index: 6,
            parentId: '2',
            title: 'Cannot use import statement outside a module [React TypeScript 错误的处理方法]',
            url: 'https://www.freecodecamp.org/chinese/news/cannot-use-import-statement-outside-a-module-react-typescript-error-solved/',
          },
          {
            dateAdded: 1707047255580,
            id: '14',
            index: 7,
            parentId: '2',
            title: '组件的组合&&嵌套 · GitBook',
            url: 'https://gabriel-yan-book.github.io/react-books/%E7%BB%84%E4%BB%B6%E7%BB%84%E5%90%88&&%E5%B5%8C%E5%A5%97.html',
          },
          {
            dateAdded: 1707121175916,
            id: '15',
            index: 8,
            parentId: '2',
            title: 'vscode 配置 eslint 保存代码自动格式化_vscode安装eslint保存自动格式化-CSDN博客',
            url: 'https://blog.csdn.net/qq_37241934/article/details/128113683?spm=1001.2101.3001.6650.8&utm_medium=distribute.pc_relevant.none-task-blog-2%7Edefault%7EBlogCommendFromBaidu%7ERate-8-128113683-blog-107041181.235%5Ev43%5Epc_blog_bottom_relevance_base8&depth_1-utm_source=distribute.pc_relevant.none-task-blog-2%7Edefault%7EBlogCommendFromBaidu%7ERate-8-128113683-blog-107041181.235%5Ev43%5Epc_blog_bottom_relevance_base8&utm_relevant_index=16',
          },
          {
            dateAdded: 1707139061640,
            id: '16',
            index: 9,
            parentId: '2',
            title: '使用 Express 处理 POST 请求 - 掘金',
            url: 'https://juejin.cn/post/7029707249522049037',
          },
          {
            dateAdded: 1707143750392,
            id: '17',
            index: 10,
            parentId: '2',
            title: 'React-redux及异步获取数据20分钟快速入门-CSDN博客',
            url: 'https://blog.csdn.net/weixin_30781433/article/details/97942046?utm_medium=distribute.pc_relevant.none-task-blog-2~default~baidujs_baidulandingword~default-1-97942046-blog-104485709.235^v43^pc_blog_bottom_relevance_base8&spm=1001.2101.3001.4242.2&utm_relevant_index=4',
          },
          {
            dateAdded: 1707144505869,
            id: '18',
            index: 11,
            parentId: '2',
            title: 'redux及react-redux基础使用 - 知乎',
            url: 'https://zhuanlan.zhihu.com/p/475932994',
          },
          {
            dateAdded: 1707201038368,
            id: '19',
            index: 12,
            parentId: '2',
            title: '[前端学习笔记]Node.js基础知识整理（包含npm、express、cors、mysql）_npm cors-CSDN博客',
            url: 'https://blog.csdn.net/sillyxue/article/details/123699514?utm_medium=distribute.pc_relevant.none-task-blog-2~default~baidujs_baidulandingword~default-0-123699514-blog-123454026.235^v43^pc_blog_bottom_relevance_base8&spm=1001.2101.3001.4242.1&utm_relevant_index=3',
          },
          {
            dateAdded: 1707204221673,
            id: '20',
            index: 13,
            parentId: '2',
            title: 'Nodejs之express用户登录的2种方法 - 掘金',
            url: 'https://juejin.cn/post/6965026047926484999?from=search-suggest',
          },
          {
            dateAdded: 1707207409914,
            id: '21',
            index: 14,
            parentId: '2',
            title: '前端需要去了解的nodejs（jwt身份校验） - 掘金',
            url: 'https://juejin.cn/post/7215967109170462776?from=search-suggest',
          },
          {
            dateAdded: 1707208149033,
            id: '22',
            index: 15,
            parentId: '2',
            title: 'nodejs使用JWT(全) - 掘金',
            url: 'https://juejin.cn/post/7195020479257083941?from=search-suggest',
          },
          {
            dateAdded: 1707211644949,
            id: '23',
            index: 16,
            parentId: '2',
            title: 'chrome.signedInDevices · GitBook',
            url: 'https://doc.yilijishu.info/chrome/signedInDevices.html',
          },
          {
            dateAdded: 1707704018685,
            id: '24',
            index: 17,
            parentId: '2',
            title: '118、验证有效期JWT实施方案_flask 使用jwt认证并实现会话过期-CSDN博客',
            url: 'https://blog.csdn.net/limengshi138392/article/details/94409669',
          },
        ],
        dateAdded: 1699707465879,
        dateGroupModified: 1707704018685,
        id: '2',
        index: 1,
        parentId: '0',
        title: '其他书签',
      },
    ],
    dateAdded: 1706857414727,
    id: '0',
    title: '',
  },
]
// 获取所有书签
export const getAllBookMarks = () => {
  return new Promise(resolve => {
    if (isExtentionEnv()) {
      return chrome.bookmarks.getTree(function (bookmarkTreeNode) {
        resolve(bookmarkTreeNode)
      })
    } else {
      resolve(allbookmarks)
    }
  })
}

// 创建书签
export const createBookMarks = bookmark => {
  return new Promise(resolve => {
    if (isExtentionEnv()) {
      return chrome.bookmarks.create(bookmark).then(res => {
        resolve(res)
      })
    } else {
      return resolve(true)
    }
  })
}

// 移除书签
export const removeBookMarks = id => {
  if (isExtentionEnv()) {
    return chrome.bookmarks.remove(id)
  }
}

// 更新书签
export const updateBookMarks = (id, object) => {
  if (isExtentionEnv()) {
    return chrome.bookmarks.update(id, object)
  }
}
const bookMarksUtils = {
  getAllBookMarks,
  createBookMarks,
  removeBookMarks,
  updateBookMarks,
}

export default bookMarksUtils

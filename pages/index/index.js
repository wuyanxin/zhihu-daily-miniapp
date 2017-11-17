//index.js
//获取应用实例
const app = getApp();
const util = require('../../utils/util.js');

var self = null;

Page({
  data: {
    topStories: [],
    days: [],  // {date: '', stories: []}
    currentDate: 0, 
    showBack2Top: false
  },
  //事件处理函数
  read: function (e) {
    wx.navigateTo({
      url: '../post/post?id=' + e.currentTarget.id,
    })
  },
  
  onLoad: function () {
    self = this;  // 将this赋值给全局self，因为onScrollPage里面this居然是undefined。。
    wx.showLoading({
      title: '加载中...',
    });
    wx.request({
      url: 'https://news-at.zhihu.com/api/4/news/latest',
      success: function (res) {
        self.setData({
          topStories: res.data.top_stories,
          days: [{
            date: util.formatDateString(res.data.date),
            stories: res.data.stories
          }],
          currentDate: +res.data.date
        });
        wx.hideLoading();
      }
    });
  },

  onReachBottom: function () {
    if (self.data.currentDate < 20130520) {
      wx.showToast({
        title: '到底啦',
      });
      return;
    }

    wx.showLoading({
      title: '加载中...',
    });
    wx.request({
      url: 'https://news-at.zhihu.com/api/4/news/before/' + self.data.currentDate,
      success: function (res) {
        self.data.days.push({
          date: util.formatDateString(res.data.date),
          stories: res.data.stories
        })
        self.setData({
          // topStories: res.data.top_stories,
          days: self.data.days.concat([{
            date: util.formatDateString(res.data.date),
            stories: res.data.stories
          }]),
          currentDate: +res.data.date
        });
        wx.hideLoading();
      }
    });
  },

  onPageScroll: ({ scrollTop }) => {
    if (scrollTop > 1000) {
      // 显示 回到顶部 按钮
      self.data.showBack2Top || self.setData({ showBack2Top: true });
    } else {
      // 隐藏 回到顶部 按钮
      self.data.showBack2Top && self.setData({ showBack2Top: false });
    }
  },

  onShareAppMessage: function () {
    return {
      title: '知小报 - 非官方知乎日报小程序',
      path: '/pages/index/index',
      imageUrl: '/assets/images/logo.png',
      success: function () {
        wx.showToast({
          title: '分享成功',
        });
      },
      error: function () {
        wx.showToast({
          title: '分享失败',
        });
      }
    }
  },
  back2top: function () {
    wx.pageScrollTo({ scrollTop: 0 })
  }
});

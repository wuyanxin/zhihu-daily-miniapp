// pages/post/post.js

const WxParser = require('../../utils/wxParse/wxParse.js');

var self = null;

/**
 * 调整html内容
 */
function hackPostBody(data) {
  // // 插入banner图片
  // data.body = data.body.replace(
  //   '<div class=\"img-place-holder\"></div>', 
  //   '<div class=\"img-place-holder\"><img src=\"' + data.image + '\"></div>'
  // );

  // 去掉尾部无用html
  var contentLength = data.body.lastIndexOf('</p>') + 4;
  data.body = data.body.substr(0, contentLength);
}

Page({

  /**
   * 页面的初始数据
   */
  data: {
    post: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    self = this;

    if (!options.id) {
      wx.showToast({
        title: '连接错误',
      });
      return;
    }
    wx.showLoading({
      title: '加载中...',
    });
    wx.request({
      url: 'https://news-at.zhihu.com/api/4/news/' + options.id,
      success: function (res) {
        self.setData({ post: res.data });
        hackPostBody(res.data);
        WxParser.wxParse('article', 'html', res.data.body, self, 5);
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

  onShareAppMessage: function (options) {
    var post = this.data.post;
    if (!post) {
      wx.showToast({
        title: '分享出错'
      });
      return;
    }

    return {
      title: post.title + ' - 知小报',
      path: '/pages/post/post?id=' + post.id,
      imageUrl: post.image,
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

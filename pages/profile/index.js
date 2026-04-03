Page({
  data: {},

  goToHistory() {
    wx.navigateTo({
      url: '/pages/history/index'
    });
  },

  goToTutorial() {
    wx.navigateTo({
      url: '/pages/tutorial/index'
    });
  },

  goToFAQ() {
    wx.navigateTo({
      url: '/pages/faq/index'
    });
  },

  onShareAppMessage() {
    return {
      title: '免费去水印助手',
      path: '/pages/home/index'
    };
  },

  onShareTimeline() {
    return {
      title: '免费去水印助手',
      query: ''
    };
  }
})
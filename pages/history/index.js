Page({
  data: {
    historyList: []
  },

  onShow() {
    this.loadHistory();
  },

  loadHistory() {
    const history = wx.getStorageSync('parseHistory') || [];
    this.setData({
      historyList: history
    });
  },

  goToResult(e) {
    const item = e.currentTarget.dataset.item;
    wx.navigateTo({
      url: `/pages/parseResult/index?data=${encodeURIComponent(JSON.stringify(item))}`
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
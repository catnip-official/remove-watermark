const linkParser = require('../../utils/link-parser');

Page({
  data: {
    linkText: ''
  },

  onInput(e) {
    this.setData({
      linkText: e.detail.value
    });
  },

  handlePasteOrClear() {
    if (this.data.linkText) {
      this.setData({
        linkText: ''
      });
    } else {
      wx.getClipboardData({
        success: (res) => {
          if (res.data) {
            this.setData({
              linkText: res.data
            });
            wx.showToast({ title: '已粘贴', icon: 'success' });
          } else {
            wx.showToast({
              title: '剪贴板为空',
              icon: 'none'
            });
          }
        },
        fail: () => {
          wx.showToast({ title: '读取剪贴板失败', icon: 'none' });
        }
      });
    }
  },

  handleParse() {
    const text = this.data.linkText;
    if (!text) {
      wx.getClipboardData({
        success: (res) => {
          if (res.data) {
            this.setData({ linkText: res.data });
            this.doParse(res.data);
          } else {
            wx.showToast({
              title: '剪贴板为空，请输入链接',
              icon: 'none'
            });
          }
        },
        fail: () => {
          wx.showToast({ title: '读取剪贴板失败', icon: 'none' });
        }
      });
    } else {
      this.doParse(text);
    }
  },

  doParse(text) {
    wx.showLoading({
      title: '解析中...',
    });

    linkParser
      .parseLink(text)
      .then((result) => {
        wx.hideLoading();
        const parsedData = {
          title: result.title || '解析成功',
          content: '',
          cover: result.cover || '',
          videoUrl: result.mediaUrl || '',
          isImage: result.type === 'image',
        };
        this.saveToHistory(parsedData);
        wx.navigateTo({
          url: `/pages/parseResult/index?data=${encodeURIComponent(JSON.stringify(parsedData))}`,
        });
      })
      .catch((err) => {
        wx.hideLoading();
        wx.showToast({
          title: err.message || '解析失败，请重试',
          icon: 'none',
        });
      });
  },

  saveToHistory(data) {
    let history = wx.getStorageSync('parseHistory') || [];
    data.timestamp = Date.now();
    history.unshift(data);
    if (history.length > 50) {
      history = history.slice(0, 50);
    }
    wx.setStorageSync('parseHistory', history);
  },

  onShareAppMessage() {
    return {
      title: '免费去水印助手',
      path: '/pages/home/index',
      imageUrl: '',
    };
  },

  onShareTimeline() {
    return {
      title: '免费去水印助手',
      query: '',
    };
  },
})
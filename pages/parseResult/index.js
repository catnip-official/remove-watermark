Page({
  data: {
    videoData: {}
  },

  onLoad(options) {
    if (options.data) {
      try {
        const data = JSON.parse(decodeURIComponent(options.data));
        this.setData({
          videoData: data
        });
      } catch (e) {
        console.error('解析数据失败', e);
      }
    }
  },

  saveVideo() {
    let url = this.data.videoData.videoUrl;
    const isImage = this.data.videoData.isImage;
    if (!url) return;

    if (url.startsWith('http://')) {
      url = url.replace('http://', 'https://');
    }
    
    this.checkAlbumPermission(() => {
      wx.showLoading({ title: '准备下载...', mask: true });
      
      const downloadTask = wx.downloadFile({
        url: url,
        success: (res) => {
          if (res.statusCode === 200 || res.statusCode === 304) {
            wx.showLoading({ title: '正在保存...', mask: true });
            
            if (isImage) {
              wx.saveImageToPhotosAlbum({
                filePath: res.tempFilePath,
                success: () => {
                  wx.hideLoading();
                  wx.showToast({ title: '保存成功', icon: 'success' });
                },
                fail: (err) => {
                  wx.hideLoading();
                  console.error('保存图片失败:', err);
                  if (err.errMsg && err.errMsg.includes('cancel')) {
                    wx.showToast({ title: '已取消保存', icon: 'none' });
                  } else {
                    wx.showToast({ title: '保存失败，请重试', icon: 'none' });
                  }
                }
              });
            } else {
              wx.saveVideoToPhotosAlbum({
                filePath: res.tempFilePath,
                success: () => {
                  wx.hideLoading();
                  wx.showToast({ title: '保存成功', icon: 'success' });
                },
                fail: (err) => {
                  wx.hideLoading();
                  console.error('保存视频失败:', err);
                  if (err.errMsg && err.errMsg.includes('cancel')) {
                    wx.showToast({ title: '已取消保存', icon: 'none' });
                  } else {
                    wx.showToast({ title: '保存失败，请重试', icon: 'none' });
                  }
                }
              });
            }
          } else {
            wx.hideLoading();
            console.error('下载状态码异常:', res.statusCode);
            wx.showModal({
              title: '下载失败',
              content: `资源响应异常(错误码:${res.statusCode})，可能由于文件过大或网络限制。建议复制链接到手机浏览器中下载。`,
              confirmText: '复制链接',
              success: (modalRes) => {
                if (modalRes.confirm) {
                  this.copyLink();
                }
              }
            });
          }
        },
        fail: (err) => {
          wx.hideLoading();
          console.error('下载文件失败:', err);
          wx.showModal({
            title: '下载失败',
            content: '网络异常或平台防盗链限制。建议复制链接到手机浏览器中打开并下载。',
            confirmText: '复制链接',
            success: (modalRes) => {
              if (modalRes.confirm) {
                this.copyLink();
              }
            }
          });
        }
      });

      // 监听下载进度
      downloadTask.onProgressUpdate((res) => {
        if (res.progress < 100) {
          wx.showLoading({ title: `下载中 ${res.progress}%`, mask: true });
        }
      });
    });
  },

  saveCover() {
    let url = this.data.videoData.cover;
    if (!url) return;

    if (url.startsWith('http://')) {
      url = url.replace('http://', 'https://');
    }

    this.checkAlbumPermission(() => {
      wx.showLoading({ title: '准备下载...', mask: true });
      
      const downloadTask = wx.downloadFile({
        url: url,
        success: (res) => {
          if (res.statusCode === 200 || res.statusCode === 304) {
            wx.showLoading({ title: '正在保存...', mask: true });
            
            wx.saveImageToPhotosAlbum({
              filePath: res.tempFilePath,
              success: () => {
                wx.hideLoading();
                wx.showToast({ title: '保存成功', icon: 'success' });
              },
              fail: (err) => {
                wx.hideLoading();
                console.error('保存封面失败:', err);
                if (err.errMsg && err.errMsg.includes('cancel')) {
                  wx.showToast({ title: '已取消保存', icon: 'none' });
                } else {
                  wx.showToast({ title: '保存失败，请重试', icon: 'none' });
                }
              }
            });
          } else {
            wx.hideLoading();
            wx.showToast({ title: `封面下载异常(${res.statusCode})`, icon: 'none' });
          }
        },
        fail: (err) => {
          wx.hideLoading();
          console.error('下载封面失败:', err);
          wx.showToast({ title: '网络异常，下载失败', icon: 'none' });
        }
      });

      downloadTask.onProgressUpdate((res) => {
        if (res.progress < 100) {
          wx.showLoading({ title: `下载中 ${res.progress}%`, mask: true });
        }
      });
    });
  },

  checkAlbumPermission(callback) {
    wx.getSetting({
      success: (res) => {
        if (res.authSetting['scope.writePhotosAlbum'] === undefined || res.authSetting['scope.writePhotosAlbum'] === true) {
          callback();
        } else {
          wx.authorize({
            scope: 'scope.writePhotosAlbum',
            success() {
              callback();
            },
            fail() {
              wx.showModal({
                title: '权限提示',
                content: '需要您授权保存到相册，是否去设置打开？',
                success: (modalRes) => {
                  if (modalRes.confirm) {
                    wx.openSetting({
                      success: (settingRes) => {
                        if (settingRes.authSetting['scope.writePhotosAlbum']) {
                          callback();
                        } else {
                          wx.showToast({ title: '未授权，无法保存', icon: 'none' });
                        }
                      }
                    });
                  }
                }
              });
            }
          });
        }
      }
    });
  },

  copyLink() {
    const url = this.data.videoData.videoUrl;
    if (!url) return;
    
    wx.setClipboardData({
      data: url,
      success: () => {
        wx.showToast({ title: '链接已复制', icon: 'success' });
      }
    });
  },

  copyText() {
    const { title, content } = this.data.videoData;
    const text = content ? `${title}\n${content}` : `${title}`;
    
    wx.setClipboardData({
      data: text,
      success: () => {
        wx.showToast({ title: '文案已复制', icon: 'success' });
      }
    });
  },

  onShareAppMessage() {
    return {
      title: '免费去水印助手',
      path: '/pages/home/index',
      imageUrl: '' 
    };
  },

  onShareTimeline() {
    return {
      title: '免费去水印助手',
      query: ''
    };
  }
})
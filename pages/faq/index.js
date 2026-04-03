Page({
  data: {},
  
  onShareAppMessage() {
    return {
      title: '免费去水印助手，常见问题解答',
      path: '/pages/home/index'
    };
  },

  onShareTimeline() {
    return {
      title: '免费去水印助手，常见问题解答',
      query: ''
    };
  }
})
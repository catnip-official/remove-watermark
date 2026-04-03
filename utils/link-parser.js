const { getParseRequestUrl } = require('../config/index');

function extractShareUrl(text) {
  const urlRegex = /https?:\/\/[a-zA-Z0-9\-._~:/?#\[\]@!$&'()*+,;=%]+/g;
  const matches = text.match(urlRegex);
  if (!matches) return null;
  const cleaned = matches.map((url) => url.replace(/[.,;:!?)]+$/, ''));
  return cleaned[0];
}

function parseLink(text) {
  if (!text || typeof text !== 'string') {
    return Promise.reject(new Error('请输入链接'));
  }
  const shareUrl = extractShareUrl(text);
  if (!shareUrl) {
    return Promise.reject(new Error('未检测到有效链接'));
  }

  const toHttps = (u) => (u && u.startsWith('http://') ? u.replace('http://', 'https://') : u);

  const requestUrl = getParseRequestUrl(shareUrl);

  return new Promise((resolve, reject) => {
    wx.request({
      url: requestUrl,
      method: 'GET',
      header: { 'Content-Type': 'application/json' },
      success(res) {
        if (res.statusCode === 200 && res.data && res.data.code === 200) {
          const resultData = res.data.data;
          const isImage = resultData.images && resultData.images.length > 0;
          const mediaRaw = isImage ? resultData.images[0] : resultData.video_url;
          resolve({
            type: isImage ? 'image' : 'video',
            title: resultData.title || '解析成功',
            cover: toHttps(resultData.cover_url || '') || '',
            mediaUrl: toHttps(mediaRaw) || '',
            author: resultData.author?.name || '',
            images: resultData.images || [],
          });
        } else {
          reject(new Error(res.data?.msg || '解析失败，请稍后重试'));
        }
      },
      fail() {
        reject(new Error('网络异常，请检查网络后重试'));
      },
    });
  });
}

module.exports = {
  parseLink,
};

/** 解析接口基址 */
const BASE_URL = 'https://your-api-host.com/api/video';

function getParseRequestUrl(realShareUrl) {
  if (!realShareUrl) {
    return '';
  }
  const sep = BASE_URL.includes('?') ? '&' : '?';
  return `${BASE_URL}${sep}url=${encodeURIComponent(realShareUrl)}`;
}

module.exports = {
  getParseRequestUrl,
};

# remove-watermark · 去水印小程序

微信小程序示例项目：用户在首页粘贴或输入含 **http(s)** 的分享文案，客户端提取第一个链接后请求你配置的解析服务，在结果页预览并保存图片/视频到相册（需用户授权）。**具体支持哪些平台、解析是否成功，由你的后端或第三方接口决定。**

---

## 功能说明

| 模块 | 说明 |
|------|------|
| 首页 | 多行输入、粘贴/清空、一键解析 |
| 解析结果 | 视频播放或图片预览；保存媒体/封面、复制链接与文案 |
| 解析记录 | 本地保存最近 **50** 条（`wx` 本地存储） |
| 我的 | 入口：解析记录、使用教程、常见问题、客服会话、分享 |
| 教程 / 问答 | 占位页，可自行补充内容 |

---

## 技术栈

- 微信小程序原生：**WXML / WXSS / JavaScript**
- 无构建工具依赖；配置见 `config/index.js`

---

## 使用前准备

1. 安装 [微信开发者工具](https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html)。
2. 在 [微信公众平台](https://mp.weixin.qq.com/) 注册小程序，取得 **AppID**。
3. 若解析接口为外网 HTTPS，需在公众平台 → 开发 → 开发管理 → **服务器域名** 中，将接口域名加入 **request 合法域名**。

---

## 快速开始

### 1. 导入项目

用微信开发者工具「导入项目」，选择本仓库目录，填入你的 AppID（测试可选用测试号）。

### 2. 配置 `project.config.json`

将其中 `appid` 改为你自己的小程序 AppID。  
工具生成的 **`project.private.config.json`** 已列入 `.gitignore`，适合放本机差异配置，勿把含敏感信息的私有配置提交到公开仓库。

### 3. 配置解析接口 `config/index.js`

将 **`BASE_URL`** 改成你的解析服务地址（占位统一用 `your-api-url.com`，实际替换为你的域名）：

```js
// 仅路径：最终请求形如 https://your-api-url.com/api/video?url=编码后的分享链接
const BASE_URL = 'https://your-api-url.com/api/video';

// 若固定鉴权参数写在 query 里，最终形如 .../api/video?appId=xxx&appKey=yyy&url=...
// const BASE_URL = 'https://your-api-url.com/api/video?appId=xxx&appKey=yyy';
```

- **`getParseRequestUrl(分享链接)`**（本文件已导出）：在 `BASE_URL` 后追加 `url=` + `encodeURIComponent(分享链接)`。  
- `BASE_URL` 已含 **`?`** 时，会用 **`&`** 续接 `url=`，避免出现第二个 `?`。  
- 分享链接为空时返回空字符串，`wx.request` 会失败；业务上已由 `parseLink` 先做提取与校验。  
- 需要更多参数时，除写在 `BASE_URL` 的 query 中外，也可改 **`getParseRequestUrl`** 内拼接逻辑（**勿把真实密钥提交到公开 Git**）。

生产环境更推荐：**小程序只请求你自己的域名**，由**服务端**再转发第三方并保管密钥。

---

## 解析接口约定（与 `utils/link-parser.js` 一致）

客户端使用 **GET**，期望响应 JSON 形态如下（字段名需一致或自行改代码适配）：

```json
{
  "code": 200,
  "msg": "可选",
  "data": {
    "title": "标题",
    "cover_url": "https://...",
    "video_url": "https://...",
    "images": [],
    "author": { "name": "作者" }
  }
}
```

- **`code === 200`** 视为成功，否则取 **`msg`** 作为错误提示。  
- 若 **`data.images`** 为非空数组，按**图文**处理，主媒体取 **`images[0]`**；否则按**视频**使用 **`data.video_url`**。  
- 返回的 `http://` 资源在展示前会尝试替换为 `https://`，以符合小程序下载/展示限制。

---

## 目录结构

```
remove-watermark/
├── app.js                 # 小程序入口
├── app.json               # 全局配置、页面列表、TabBar
├── app.wxss               # 全局样式
├── sitemap.json
├── project.config.json    # 开发者工具项目配置（含 appid）
├── config/
│   └── index.js           # BASE_URL、getParseRequestUrl
├── utils/
│   └── link-parser.js     # 提取链接、parseLink、请求解析接口
└── pages/
    ├── home/              # 首页
    ├── profile/           # 我的
    ├── parseResult/       # 解析结果
    ├── history/           # 解析记录
    ├── tutorial/          # 使用教程（占位）
    └── faq/               # 常见问题（占位）
```

`app.json` 中 TabBar 与部分页面引用了 **`assets/images/`** 下的图标，若仓库中未包含该目录，请在本地补齐图片或修改路径。  
当前未使用 `components/` 时，可按需自行添加公共组件。

---

## 开源发布检查清单

- [ ] `config/index.js` 中 **`BASE_URL`** 为占位或测试地址，不含生产密钥。  
- [ ] `project.config.json` 中 **`appid`** 为占位或你自己的测试号，勿泄露他人小程序身份。  
- [ ] 确认未提交 `project.private.config.json`、日志与本地密钥文件。

---

## 免责说明

本项目以 **MIT** 等开源许可提供，按「**原样**」发布，**不提供任何明示或默示担保**（包括但不限于适销性、特定用途适用性、不侵权等）。

- 使用者因下载、使用、修改或分发本软件所产生的一切后果（含数据丢失、服务不可用、与第三方平台或权利方之间的纠纷等）**均由使用者自行承担**。  
- 仓库维护者及贡献者**不对**任何直接、间接、附带或后果性损害承担责任，**即使已被告知可能发生此类损害**。  
- 是否遵守适用法律、平台规则及他人权利，由使用者自行判断并负责；**本说明不构成法律意见**。

使用或依赖本项目前，请阅读仓库根目录的 [LICENSE](LICENSE) 全文。

---

## 许可证

本项目使用 [MIT License](LICENSE)。

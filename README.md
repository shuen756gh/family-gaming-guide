# 孩子的遊戲與網路：家長實用指南

給家有國中生的家長：Roblox（Rivals、Blox Fruits）、YouTube 遊戲影片、Discord 語音聊天要注意什麼，以及可以跟孩子一起簽的「家庭遊戲約定」。

## 網站

- GitHub Pages：https://shuen756gh.github.io/family-gaming-guide/
- Cloudflare Pages：https://family-gaming-guide.pages.dev/

推送到 `main` 分支後，兩邊都會自動更新。

## 檔案

| 路徑 | 說明 |
|---|---|
| `index.html` | 網站本體（純靜態，無需建置） |
| `og-image.png` | 分享預覽圖（1200×630，B 霓虹圖示版，不含第三方遊戲圖） |
| `downloads/家庭遊戲約定_v2.docx` | 目前版本的約定（Word） |
| `downloads/家庭遊戲約定_v2.pdf` | 目前版本的約定（PDF，方便列印） |
| `downloads/家庭遊戲約定_v1.docx` | 第 1 版，保留對照 |
| `tools/make_agreement.js` | 產生約定 Word 檔的腳本 |
| `data/roblox-images.json` | RIVALS、Blox Fruits 官方遊戲圖片網址（直接連結 Roblox CDN，不複製圖片） |
| `tools/update_roblox_images.mjs` | 從 Roblox API 更新圖片網址 |
| `.github/workflows/refresh-roblox-images.yml` | 每月 1 日自動更新圖片網址（Roblox CDN 連結約 180 天會過期），也可手動執行 |

## 遊戲圖片

圖片版權屬 Nosniy Games（RIVALS）與 Gamer Robot Inc（Blox Fruits），本站只連結官方圖片。手動更新：

```bash
node tools/update_roblox_images.mjs
```

## 更新約定

```bash
cd tools
npm install docx
node make_agreement.js "../downloads/家庭遊戲約定_v3.docx"
```

新版本請遞增檔名的版本號（`_v3`、`_v4`…），並更新 `index.html` 的下載連結。

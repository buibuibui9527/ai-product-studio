# 🚀 Vercel 永久部署指南

本指南將引導您在 **Vercel** 上永久部署 AI Product Studio，確保網站 24 小時在線。

---

## 📋 前置需求

在開始部署前，請確保您已經擁有：

1. **GitHub 帳號**（用於連接代碼倉庫）
2. **Vercel 帳號**（免費註冊：https://vercel.com）
3. **已配置的 Supabase 專案**（包含資料庫、OAuth、Storage）
4. **Replicate API Token**（用於 AI 功能）
5. **自訂網域**（可選，但推薦）

---

## 🔧 步驟 1：準備 GitHub 倉庫

### 1.1 初始化 Git 倉庫

```bash
cd /path/to/ai-product-saas
git init
git add .
git commit -m "Initial commit: AI Product Studio"
```

### 1.2 建立 GitHub 倉庫

1. 前往 https://github.com/new
2. 建立新倉庫，名稱為 `ai-product-studio`
3. **不要** 初始化 README、.gitignore 或 License（因為我們已經有了）
4. 點擊「Create repository」

### 1.3 推送代碼到 GitHub

```bash
git remote add origin https://github.com/YOUR_USERNAME/ai-product-studio.git
git branch -M main
git push -u origin main
```

---

## 🌐 步驟 2：在 Vercel 上部署

### 2.1 連接 Vercel 與 GitHub

1. 前往 https://vercel.com/dashboard
2. 點擊「Add New...」→「Project」
3. 選擇「Import Git Repository」
4. 搜尋並選擇 `ai-product-studio` 倉庫
5. 點擊「Import」

### 2.2 配置環境變數

在 Vercel 的「Environment Variables」部分，填入以下變數：

| 變數名稱 | 值 | 說明 |
|---------|-----|------|
| `NEXT_PUBLIC_SITE_URL` | `https://your-domain.vercel.app` | 您的部署網域（稍後會看到） |
| `NEXT_PUBLIC_SUPABASE_URL` | `https://xxxxx.supabase.co` | 從 Supabase 複製 |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJhbGc...` | 從 Supabase 複製 |
| `SUPABASE_SERVICE_ROLE_KEY` | `eyJhbGc...` | 從 Supabase 複製 |
| `REPLICATE_API_TOKEN` | `r8_xxx...` | 從 Replicate 複製 |
| `LEMON_SQUEEZY_API_KEY` | `（可選）` | 如果使用付費功能 |
| `LEMON_SQUEEZY_WEBHOOK_SECRET` | `（可選）` | 如果使用付費功能 |

**如何取得這些值：**

#### Supabase 金鑰
1. 登入 https://app.supabase.com
2. 選擇您的專案
3. 前往 **Settings** → **API**
4. 複製 **Project URL** 和 **Anon Key** 和 **Service Role Key**

#### Replicate Token
1. 登入 https://replicate.com
2. 前往 **Account** → **API Tokens**
3. 複製 Token

### 2.3 部署

1. 填入所有環境變數後，點擊「Deploy」
2. 等待部署完成（通常需要 2-3 分鐘）
3. 部署完成後，您會看到一個 `.vercel.app` 的網域

---

## 🔗 步驟 3：配置 Supabase OAuth 重定向

部署完成後，您需要更新 Supabase 的 OAuth 重定向設定：

1. 登入 https://app.supabase.com
2. 選擇您的專案
3. 前往 **Authentication** → **URL Configuration**
4. 更新 **Site URL** 為您的 Vercel 網域（例如 `https://ai-product-studio.vercel.app`）
5. 在 **Redirect URLs** 中新增：
   ```
   https://your-vercel-domain.vercel.app/auth/callback
   ```
6. 點擊「Save」

---

## 🎯 步驟 4：自訂網域（可選但推薦）

如果您想使用自己的網域（例如 `yoursite.com`）：

### 4.1 在 Vercel 中新增網域

1. 在 Vercel 專案設定中，前往 **Domains**
2. 點擊「Add」
3. 輸入您的網域名稱
4. 選擇您的 DNS 提供商
5. 按照指示更新 DNS 記錄

### 4.2 更新環境變數

1. 回到 Vercel 專案設定
2. 編輯 `NEXT_PUBLIC_SITE_URL` 為您的自訂網域
3. 重新部署

### 4.3 更新 Supabase OAuth

1. 登入 Supabase
2. 更新 **Site URL** 為您的自訂網域
3. 更新 **Redirect URLs** 為您的自訂網域

---

## ✅ 驗證部署

部署完成後，請按照以下步驟驗證功能：

### 1. 測試登入
- 訪問您的網站
- 點擊「Sign in with Google」
- 使用 Google 帳號登入
- 確認能成功進入 Dashboard

### 2. 測試 AI 功能
- 在 Dashboard 上傳一張產品圖片
- 選擇一種風格
- 點擊「Generate」
- 等待 AI 處理（通常需要 30-60 秒）
- 確認能看到處理結果

### 3. 檢查後台日誌
- 在 Vercel 專案中，前往 **Logs**
- 確認沒有錯誤訊息

---

## 🔄 持續部署

一旦您推送代碼到 GitHub，Vercel 會自動部署最新版本。這意味著：

- 您可以在本地開發
- 推送到 GitHub
- Vercel 自動構建和部署
- 網站自動更新

---

## 🐛 常見問題

### Q: 部署後出現 500 錯誤
**A:** 檢查環境變數是否正確設定。前往 Vercel 的 **Logs** 查看詳細錯誤訊息。

### Q: Google 登入不工作
**A:** 確認 Supabase 的 OAuth Redirect URL 與您的 Vercel 網域一致。

### Q: AI 功能不工作
**A:** 確認 `REPLICATE_API_TOKEN` 已正確設定，且您的 Replicate 帳號有足夠的額度。

### Q: 如何回滾到之前的版本？
**A:** 在 Vercel 的 **Deployments** 中，找到之前的部署，點擊「Redeploy」。

---

## 📞 支援

如有任何問題，請參考：
- **Vercel 文件**：https://vercel.com/docs
- **Next.js 文件**：https://nextjs.org/docs
- **Supabase 文件**：https://supabase.com/docs

---

**恭喜！您的 AI Product Studio 現在已經永久在線了！** 🎉

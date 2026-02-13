# 部署指南 / Deployment Guide

完整的部署流程，確保您的 AI Product Studio 可以順利上線運作。

## 📋 部署前檢查清單

- [ ] Supabase 專案已建立
- [ ] Replicate API Token 已取得
- [ ] Google OAuth 憑證已設定
- [ ] Lemon Squeezy 帳號已建立（可選）
- [ ] Vercel 帳號已準備好

---

## 1️⃣ Supabase 設定

### 步驟 1: 建立專案

1. 前往 [supabase.com](https://supabase.com)
2. 點擊 "New Project"
3. 選擇組織並填寫專案資訊
4. 等待專案建立完成（約 2 分鐘）

### 步驟 2: 執行資料庫遷移

1. 進入專案後，點擊左側選單的 **SQL Editor**
2. 點擊 "New Query"
3. 複製 `SUPABASE_MIGRATION.sql` 的完整內容
4. 貼上並點擊 "Run" 執行
5. 確認所有表格和函數都已建立成功

### 步驟 3: 設定 Google OAuth

1. 前往 [Google Cloud Console](https://console.cloud.google.com)
2. 建立新專案或選擇現有專案
3. 啟用 "Google+ API"
4. 前往 **APIs & Services > Credentials**
5. 點擊 "Create Credentials" > "OAuth 2.0 Client ID"
6. 選擇 "Web application"
7. 新增授權重新導向 URI：
   ```
   https://YOUR_PROJECT_REF.supabase.co/auth/v1/callback
   ```
8. 複製 Client ID 和 Client Secret

9. 回到 Supabase，前往 **Authentication > Providers**
10. 找到 Google，點擊啟用
11. 貼上 Client ID 和 Client Secret
12. 點擊 "Save"

### 步驟 4: 建立 Storage Bucket

1. 在 Supabase 左側選單點擊 **Storage**
2. 點擊 "Create a new bucket"
3. Bucket 名稱輸入：`uploads`
4. 勾選 "Public bucket"
5. 點擊 "Create bucket"

6. 點擊剛建立的 `uploads` bucket
7. 前往 "Policies" 標籤
8. 新增以下政策：

**允許所有人讀取：**
```sql
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING ( bucket_id = 'uploads' );
```

**允許已認證用戶上傳：**
```sql
CREATE POLICY "Authenticated users can upload"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'uploads' 
  AND auth.role() = 'authenticated'
);
```

### 步驟 5: 取得 API 金鑰

1. 前往 **Settings > API**
2. 複製以下資訊：
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` → `SUPABASE_SERVICE_ROLE_KEY` ⚠️ 保密

---

## 2️⃣ Replicate 設定

### 步驟 1: 註冊並取得 API Token

1. 前往 [replicate.com](https://replicate.com)
2. 註冊或登入帳號
3. 前往 [Account Settings](https://replicate.com/account/api-tokens)
4. 點擊 "Create token"
5. 複製 Token → `REPLICATE_API_TOKEN`

### 步驟 2: 確認模型可用性

確認以下模型可以使用：
- `lucataco/remove-bg` (背景移除)
- `black-forest-labs/flux-1.1-pro` (背景生成)

---

## 3️⃣ Lemon Squeezy 設定（可選）

如果您要啟用付費功能，請完成以下設定。

### 步驟 1: 建立商店和產品

1. 前往 [lemonsqueezy.com](https://lemonsqueezy.com)
2. 建立商店（Store）
3. 建立產品（Product），例如：
   - 名稱：50 Credits Pack
   - 價格：$9.99
4. 建立 Checkout Link

### 步驟 2: 設定 Custom Data

在 Checkout Link 設定中：
1. 啟用 "Custom Data"
2. 新增欄位：`user_id`（由前端傳入）
3. 新增欄位：`credits`（固定值，例如 50）

### 步驟 3: 設定 Webhook

1. 前往 **Settings > Webhooks**
2. 點擊 "Create webhook"
3. URL 輸入：`https://yourdomain.com/api/webhooks/lemonsqueezy`
4. 勾選事件：`order_created`
5. 點擊 "Create"
6. 複製 Signing Secret → `LEMON_SQUEEZY_WEBHOOK_SECRET`

### 步驟 4: 取得 API Key

1. 前往 **Settings > API**
2. 點擊 "Create API Key"
3. 複製 API Key → `LEMON_SQUEEZY_API_KEY`

---

## 4️⃣ Vercel 部署

### 步驟 1: 連接 GitHub（推薦）

1. 將專案推送到 GitHub
2. 前往 [vercel.com](https://vercel.com)
3. 點擊 "Import Project"
4. 選擇您的 GitHub 儲存庫
5. 點擊 "Import"

### 步驟 2: 設定環境變數

在 Vercel 專案設定中，前往 **Settings > Environment Variables**，新增以下變數：

```env
NEXT_PUBLIC_SITE_URL=https://your-domain.vercel.app

NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...

REPLICATE_API_TOKEN=r8_xxx...

LEMON_SQUEEZY_API_KEY=xxx (可選)
LEMON_SQUEEZY_WEBHOOK_SECRET=xxx (可選)
```

### 步驟 3: 部署

1. 點擊 "Deploy"
2. 等待建置完成（約 2-3 分鐘）
3. 部署成功後，複製您的網域

### 步驟 4: 更新 OAuth Redirect URI

1. 回到 Google Cloud Console
2. 在 OAuth 2.0 Client 設定中新增：
   ```
   https://your-domain.vercel.app/auth/callback
   ```

2. 回到 Supabase Authentication 設定
3. 在 "Site URL" 輸入：`https://your-domain.vercel.app`
4. 在 "Redirect URLs" 新增：`https://your-domain.vercel.app/**`

### 步驟 5: 驗證 Cron Job

1. 前往 Vercel 專案的 **Settings > Cron Jobs**
2. 確認 `/api/jobs/process` 已自動註冊
3. 排程應為每分鐘執行一次

⚠️ **注意**：Vercel Hobby 方案的 Cron 最多執行 10 秒，建議升級到 Pro 方案以支援 5 分鐘的 AI 處理時間。

---

## 5️⃣ 測試部署

### 測試 1: 登入功能

1. 前往 `https://your-domain.vercel.app`
2. 點擊 "Sign in with Google"
3. 完成 OAuth 授權
4. 確認成功導向到 Dashboard

### 測試 2: 圖片上傳

1. 在 Dashboard 上傳一張產品圖片
2. 選擇一個風格
3. 點擊 "Generate"
4. 確認圖片成功上傳到 Supabase Storage

### 測試 3: Job 處理

1. 手動觸發處理器：
   ```bash
   curl https://your-domain.vercel.app/api/jobs/process
   ```
2. 檢查回應是否成功
3. 在 Dashboard 確認結果顯示

### 測試 4: Webhook（如有設定）

1. 在 Lemon Squeezy 測試 Webhook
2. 檢查 Vercel Logs 是否收到請求
3. 確認點數有正確增加

---

## 🎉 完成！

您的 AI Product Studio 現在已經可以正式運作了！

### 下一步

- 設定自訂網域（Vercel Settings > Domains）
- 啟用 Analytics 追蹤使用情況
- 調整 AI 提示詞以符合您的需求
- 新增更多風格選項
- 整合更多付費方案

### 監控與維護

- 定期檢查 Vercel Logs
- 監控 Supabase 資料庫使用量
- 追蹤 Replicate API 費用
- 備份資料庫（Supabase 自動備份）

---

## 🆘 常見問題

### Q: 登入後一直重新導向到登入頁面

**A:** 檢查以下項目：
- Supabase Site URL 是否正確
- Google OAuth Redirect URI 是否包含正確的網域
- Cookie 設定是否被瀏覽器阻擋

### Q: 圖片上傳失敗

**A:** 確認：
- Supabase Storage bucket 名稱為 `uploads`
- Bucket 已設為 Public
- 已新增正確的 Storage Policies

### Q: Job 一直卡在 pending

**A:** 檢查：
- Vercel Cron Job 是否正常運作
- Replicate API Token 是否有效
- 手動觸發 `/api/jobs/process` 測試
- 查看 Vercel Function Logs

### Q: Webhook 沒有觸發

**A:** 驗證：
- Webhook URL 是否正確（必須是 HTTPS）
- Webhook Secret 是否正確設定
- 在 Lemon Squeezy 測試 Webhook
- 檢查 Vercel Logs 是否有收到請求

---

需要更多協助？請查看 `README.md` 或提交 GitHub Issue。

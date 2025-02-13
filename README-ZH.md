# AIcover 多語言視頻平台部署指南

## 項目簡介

AIcover 是一個支持多語言的視頻處理平台，集成了 AI 驅動的視頻處理功能、用戶認證系統和支付功能。本文檔將指導您從零開始部署整個系統。

## 目錄
- [系統要求](#系統要求)
- [基礎環境配置](#基礎環境配置)
- [詳細部署步驟](#詳細部署步驟)
- [Worker 配置指南](#worker-配置指南)
- [多語言配置](#多語言配置)
- [故障排除](#故障排除)

## 系統要求

### 硬件要求
- CPU: 推薦 4 核心或以上
- 內存: 最少 8GB RAM
- 存儲空間: 50GB 以上

### 軟件要求
- Node.js ≥ 18.17.0
- npm ≥ 9.6.0
- Git
- PostgreSQL（用於 Supabase）

## 基礎環境配置

### 1. 克隆代碼倉庫
```bash
git clone https://github.com/yourusername/aicover.git
cd aicover
```

### 2. 安裝依賴
```bash
npm install
```

### 3. 環境變量配置
創建 `.env.local` 文件並配置以下必要變量：

```env
# Clerk 認證配置
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_publishable_key
CLERK_SECRET_KEY=your_secret_key
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/

# Supabase 配置
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_key

# Stripe 支付配置
STRIPE_SECRET_KEY=your_stripe_secret
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable
STRIPE_WEBHOOK_SECRET=your_webhook_secret

# Worker 配置
WORKER_URL=your_worker_url
WORKER_API_KEY=your_worker_api_key
```

## 詳細部署步驟

### 1. Clerk 認證系統配置

1. 訪問 [Clerk Dashboard](https://dashboard.clerk.dev/)
2. 創建新應用
3. 配置認證方式：
   - 啟用郵箱/密碼登錄
   - 配置社交登錄（如 Google、GitHub）
4. 配置允許的域名和回調 URL
5. 複製 API 密鑰到 `.env.local`

### 2. Worker 配置

#### 主要 Worker（視頻處理）
1. 進入 `workers` 目錄
```bash
cd workers
```

2. 安裝 Wrangler CLI
```bash
npm install -g wrangler
```

3. 登錄到 Cloudflare
```bash
wrangler login
```

4. 配置 `wrangler.toml`：
```toml
name = "aicover-worker"
type = "javascript"
account_id = "your_account_id"
workers_dev = true
route = ""
zone_id = ""
compatibility_date = "2024-01-01"

[build]
command = "npm run build"
[build.upload]
format = "service-worker"
```

5. 部署 Worker
```bash
wrangler deploy
```

#### 認證 Worker
1. 創建新的 Worker 配置文件 `wrangler-auth.toml`：
```toml
name = "aicover-auth-worker"
type = "javascript"
account_id = "your_account_id"
workers_dev = true
```

2. 部署認證 Worker
```bash
wrangler deploy --config wrangler-auth.toml
```

### 3. 多語言配置

1. 配置支持的語言（在 `locales/lang.py`）：
```python
SUPPORTED_LANGUAGES = ['en', 'zh', 'ja', 'ko']
DEFAULT_LANGUAGE = 'en'
```

2. 添加翻譯文件：
- `locales/en.json`
- `locales/zh.json`
- `locales/ja.json`
- `locales/ko.json`

### 4. 數據庫初始化

1. 在 Supabase 創建新項目

2. 運行數據庫遷移：
```bash
npm run migrate:prod
```

3. 初始化基礎數據：
```bash
npm run seed
```

### 5. 啟動服務

#### 開發環境
```bash
npm run dev
```

#### 生產環境
1. 構建項目
```bash
npm run build
```

2. 啟動服務
```bash
npm run start
```

## 項目結構說明

```
aicover/
├── app/                 # Next.js 應用目錄
│   ├── [lang]/         # 多語言路由
│   └── api/            # API 路由
├── workers/            # Worker 相關文件
│   ├── main/          # 主要 Worker
│   └── auth/          # 認證 Worker
├── locales/           # 多語言文件
└── components/        # React 組件
```

## Worker 配置指南

### 主要 Worker 功能配置

1. 視頻處理配置
```javascript
export default {
  async fetch(request, env) {
    // 視頻處理邏輯
  }
}
```

2. 配置環境變量：
- `WORKER_API_KEY`: Worker 訪問密鑰
- `PROCESSING_TIMEOUT`: 處理超時時間
- `MAX_VIDEO_SIZE`: 最大視頻大小

### 認證 Worker 配置

1. 在 `workers/auth/index.js` 配置：
```javascript
export default {
  async fetch(request, env) {
    // 認證邏輯
  }
}
```

2. 設置認證規則：
- 訪問控制
- 速率限制
- 令牌驗證

## 故障排除

### 常見問題

1. Worker 部署失敗
- 檢查 Cloudflare 賬號權限
- 驗證 wrangler.toml 配置
- 確認 API 密鑰正確性

2. 多語言切換問題
- 檢查語言文件完整性
- 驗證路由配置
- 確認默認語言設置

3. 認證問題
- 檢查 Clerk 配置
- 驗證回調 URL
- 確認 Worker 權限

### 監控和維護

1. 設置監控
- 配置錯誤跟踪
- 設置性能監控
- 配置日誌記錄

2. 定期維護
- 更新依賴包
- 檢查數據庫性能
- 監控 Worker 狀態
- 檢查 API 使用情況

## 安全建議

1. API 密鑰管理
- 定期輪換密鑰
- 使用環境變量
- 實施最小權限原則

2. 安全配置
- 啟用 HTTPS
- 配置 CORS
- 實施速率限制
- 啟用 CSP

## 支持和幫助

如需技術支持：
- 查看項目文檔
- 提交 GitHub Issues
- 聯繫技術支持團隊

---

本文檔持續更新中，如有問題請及時反饋。

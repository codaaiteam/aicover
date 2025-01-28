# 部署指南

## Supabase 设置

1. 创建新的 Supabase 项目
2. 在 SQL 编辑器中运行 `supabase/migrations/20240128_init.sql`
3. 从项目设置中获取以下信息：
   - Project URL
   - Service Role Key (anon public)

## Vercel 部署

1. 在 Vercel 中导入项目
2. 配置以下环境变量：

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_project_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key

# Stripe
STRIPE_SECRET_KEY=your_stripe_secret_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret

# 其他
NEXT_PUBLIC_APP_URL=your_vercel_domain
```

3. 部署项目

## 验证部署

1. 访问部署的网站
2. 测试用户注册/登录
3. 测试支付流程
4. 验证积分显示

## 故障排除

如果遇到问题：

1. 检查环境变量是否正确配置
2. 验证数据库表是否正确创建
3. 检查 Vercel 部署日志
4. 确认 Stripe webhook 是否正确配置

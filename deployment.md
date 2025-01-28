# 部署指南

## 环境变量配置

在生产环境中需要配置以下环境变量：

```bash
# 数据库配置
DATABASE_URL=postgresql://username:password@host:5432/database_name

# Clerk 认证配置
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key

# Stripe 支付配置
STRIPE_SECRET_KEY=your_stripe_secret_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret

# 其他配置
NEXT_PUBLIC_APP_URL=https://your-production-domain.com
```

## 部署步骤

1. 准备生产环境：
   ```bash
   # 安装依赖
   npm install

   # 构建生产版本
   npm run build
   ```

2. 运行数据库迁移：
   ```bash
   # 确保已经设置了正确的 DATABASE_URL
   node scripts/migrate-prod.js
   ```

3. 启动应用：
   ```bash
   # 使用 PM2 或其他进程管理器
   pm2 start npm --name "aicover" -- start
   ```

## 重要注意事项

1. 确保数据库配置了 SSL 连接
2. 在生产环境中设置正确的 CORS 配置
3. 配置 Stripe webhook 端点
4. 设置正确的域名和 SSL 证书
5. 配置适当的日志记录和监控

## 定期维护

1. 监控数据库性能
2. 检查日志文件
3. 定期备份数据库
4. 更新依赖包

## 故障排除

如果遇到问题，请检查：

1. 环境变量是否正确配置
2. 数据库连接是否正常
3. Stripe webhook 是否正常工作
4. 应用日志中是否有错误信息

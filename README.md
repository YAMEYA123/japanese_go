# 日語追劇學習 App

用日剧学日语，追本溯源。基于 Next.js PWA，免费部署，iPhone/iPad 共享进度。

## 功能特色

- 🎬 **日剧词库** — 7 部热门日剧（半泽直树、Doctor-X 等），每词配剧中场景
- 🔍 **词源追溯** — 汉字演变、中日对比、词根家族，满足追本溯源的学习欲
- ⚡ **碎片时间** — 1分钟/5分钟/10分钟三种模式，随时随地
- 🧠 **SM-2 记忆算法** — 科学间隔复习，记得住不遗忘
- ☁️ **跨设备同步** — 登录后 iPhone 和 iPad 自动同步进度

## 部署步骤（约15分钟，全程免费）

### 第一步：创建 Supabase 项目

1. 访问 supabase.com 注册免费账户
2. 新建 Project，记下 Project URL 和 anon/public key
3. 打开 SQL Editor，粘贴并执行 supabase-schema.sql 的内容

### 第二步：部署到 Vercel

1. 将此项目推送到你的 GitHub 仓库
2. 访问 vercel.com 导入该仓库
3. 在 Environment Variables 中添加：
   - NEXT_PUBLIC_SUPABASE_URL
   - NEXT_PUBLIC_SUPABASE_ANON_KEY
4. 点击 Deploy

### 第三步：添加到 iPhone 主屏幕

1. 用 Safari 打开你的 Vercel 域名
2. 点击底部「分享」→「添加到主屏幕」
3. iPad 同理，登录同一邮箱后进度自动同步

## 本地开发

```bash
cp .env.local.example .env.local
npm install
npm run dev
```

# 一周菜单管家 v4 — 无登录 OpenAI 版本

## 功能

- 不需要 Google 登录
- 不需要 Supabase
- 通过 Vercel 后端安全调用 OpenAI API
- 用户输入想吃什么，AI 生成菜谱
- 菜谱保存到浏览器 localStorage
- 支持编辑、删除、选择菜单
- 自动生成购物清单
- 支持中英文切换

## Vercel 环境变量

只需要添加两个：

```text
OPENAI_API_KEY=你的 OpenAI API Key
OPENAI_MODEL=gpt-4.1-mini
```

添加后 Redeploy。

## 注意

这个版本的数据保存在当前浏览器本地。如果换手机、换浏览器、清除缓存，保存的菜单会消失。
之后如果需要跨设备同步，再加登录和数据库。

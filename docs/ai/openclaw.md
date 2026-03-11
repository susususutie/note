# OpenClaw

OpenClaw 是一个开源的 AI 助手框架，支持多种渠道（QQ、Telegram、Discord 等）的消息收发。它允许用户通过自然语言与 AI 交互，并提供丰富的扩展能力。

## 主要特性

- **多渠道支持**: QQ、Telegram、Discord、Signal、WhatsApp、飞书等
- ** MCP 协议**: 支持 Model Context Protocol 扩展
- **多模态**: 支持语音（TTS/STT）、图像、文件处理
- **自托管**: 完全可控的数据和隐私

## 架构

OpenClaw 采用模块化设计，核心组件包括：

- **Gateway**: 消息网关，负责各渠道的连接
- **Agent**: AI 代理核心，处理对话逻辑
- **Extensions**: 扩展模块，提供额外功能
- **Skills**: 技能系统，让 AI 调用工具

## 安装

```bash
# 使用 npm 安装
npm install -g openclaw

# 或使用 pnpm
pnpm add -g openclaw

# 启动
openclaw start
```

## 配置

配置文件位于 `~/.openclaw/config.yaml`：

```yaml
channels:
  - type: qqbot
    enabled: true
  - type: telegram
    enabled: false
    bot_token: "xxx"

agents:
  - name: main
    model: anthropic/claude-3.5-sonnet
```

## 技能系统

OpenClaw 使用 Skill 机制扩展 AI 能力：

```typescript
// skill.ts
export default {
  name: "my-skill",
  description: "描述技能的用途",
  tools: [
    {
      name: "my_tool",
      description: "工具描述",
      handler: async (args) => {
        // 执行逻辑
        return result;
      }
    }
  ]
};
```

## 参考链接

- [官方文档](https://docs.openclaw.ai)
- [GitHub 仓库](https://github.com/openclaw/openclaw)
- [Discord 社区](https://discord.com/invite/clawd)

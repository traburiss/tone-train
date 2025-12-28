# Tone Train 🎸

一个基于 Web 的音乐听音与音阶练习工具。

这个工具目标是帮助音乐爱好者进行音阶磨耳朵训练，提升听感。灵感来源于 B 站音阶练习视频，致力于提供更灵活、可定制的练习体验。

🔗 **在线体验**: [https://traburiss.github.io/tone-train/](https://traburiss.github.io/tone-train/)

---

## ✨ 主要功能

### 🎧 核心练习

- **音阶循环播放**: 自动循环播放音阶，并语音播报音名。
- **多种模式**: 支持单音练习、吉他和弦练习。
- **主音引导**: 支持“先弹主音，再弹目标音”的模式，辅助建立调性听感。

### 🛠️ 高度可定制

- **音色选择**: 内置原声吉他、电吉他、钢琴等多种真实乐器音色。
- **练习范围**: 自由选择练习的音阶、具体的音符。
- **播放控制**: 支持指定循环次数、播放速度调节。
- **语音辅助**:
  - 播报音名（C, D, E...）
  - 支持追加播报唱名（Do, Re, Mi...）和简谱数字（1, 2, 3...）。

### 📱 优秀的用户体验

- **自动保存**: 自动记忆上次的练习参数，无需重复设置。
- **极简模式**: 支持隐藏不常用参数，界面更清爽。
- **移动端适配**: 针对手机端优化的界面布局，随时随地开启练习。

## 🛠️ 技术栈

- **框架**: [Umi Max](https://umijs.org/) (React)
- **UI 组件**: [Ant Design](https://ant.design/)
- **样式**: [Tailwind CSS](https://tailwindcss.com/)
- **音频引擎**: [Tone.js](https://tonejs.github.io/)
- **部署**: GitHub Pages

## 🚀 快速开始

### 本地运行

1. **克隆项目**

   ```bash
   git clone https://github.com/traburiss/tone-train.git
   cd tone-train
   ```

2. **安装依赖**

   ```bash
   npm install
   # 或者
   pnpm install
   ```

3. **启动开发服务器**

   ```bash
   npm run dev
   ```

   打开浏览器访问 `http://localhost:8000`。

### 构建部署

```bash
npm run deploy
```

## 📅规划 (TODO)

- [ ] 支持更多种类的吉他和弦
- [ ] 引入更多高品质音色库
- [ ] 增加节奏训练功能
- [ ] 用户自定义练习计划

---

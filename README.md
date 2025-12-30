# 音乐助教 (Music Teaching Assistant)

原本是一个基于 Web 的音乐听音与音阶练习工具，并且我一直没时间搞这个项目，所以基础功能搞定满足需求后，就一直没动力继续项目。

现在大模型的能力越发成熟，我尝试了几天 AI 驱动开发之后，决定继续这个项目，毕竟现在我可以在练琴的同时（让AI）搞开发，练琴间歇 CR 和功能测试就可以把功能搞定。

同时由于我个人的实际音乐学习需求，所以我重新设定了整个项目的目标，准备加入更多的功能功能，现已升级为辅助音乐学习的综合性助教工具。

目标是协助用户进行全方位的音乐训练，涵盖器乐（主要是吉他）与声乐等多个维度。

🔗 **在线体验**: [https://traburiss.github.io/music-teaching-assistant/](https://traburiss.github.io/music-teaching-assistant/)

---

## 🚀 项目进度与功能记录 (Roadmap)

### 🎸 器乐训练 (吉他为主)

- [x] **听音训练**: 通过反复聆听音阶/和弦，提高自己的音感
- [x] **听音判断**: 随机播放音阶/和弦，并给出几个候选项，从其中选出正确的音阶/和弦，进一步提高自己音感
- [ ] **和弦默写**: 随机播放和弦，在指板上标注出和弦，提高自己的和弦能力
- [ ] **节拍器**: 待定，类似的工具太多了，一时想不起有什么可以做的
- [ ] **调音器**: 待定，类似的工具太多了，一时想不起有什么可以做的

### 🎤 声乐训练

- [ ] **发声练习**: `ma` 音阶下降练习
- [ ] **元音练习**: `mimami` 等经典发声练习
- [ ] **音域拓展**: `E` 音阶上升练习，扩展音域

### ⚙️ 系统设置

- [x] **配置导入导出**: 支持全量配置导出为 JSON 文件并跨设备导入。
- [x] **配置编辑**: 支持配置编辑
- [ ] **云同步**: 计划支持主流云盘同步。

### 其他需要 fix 的问题

1. **听音训练**中的音名播放依然有一些问题，后面要看看怎么修复

---

## 🛠️ 技术栈

- **框架**: [Umi Max](https://umijs.org/) (React)
- **UI 组件**: [Ant Design](https://ant.design/) & [ProComponents](https://procomponents.ant.design/)
- **编辑器**: [@monaco-editor/react](https://github.com/suren-atoyan/monaco-react)
- **音频引擎**: [Tone.js](https://tonejs.github.io/)
- **样式**: [Tailwind CSS](https://tailwindcss.com/)

---

## 🚀 快速开始

### 本地运行

1. **安装依赖**

   ```bash
   pnpm install
   ```

2. **启动开发服务器**

   ```bash
   pnpm run dev
   ```

### 构建部署

```bash
pnpm run deploy
```

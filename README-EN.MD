# Music Teaching Assistant

English | [简体中文](README.md)

Originally a Web-based tool for music ear training and scale practice. I hadn't spent much time on this project once the basic features met my needs.

Now, with the maturity of Large Language Models, after experimenting with AI-driven development for a few days, I decided to continue this project. I can now develop (with AI) while practicing my instrument, handling code reviews and functional testing during practice breaks.

Due to my personal music learning needs, I have redefined the goals of the entire project to include more features, upgrading it into a comprehensive assistant tool for music learning.

The goal is to assist users in all-around music training, covering multiple dimensions such as instrumental (primarily guitar) and vocal training.

🔗 **Live Demo**: [https://traburiss.github.io/music-teaching-assistant/](https://traburiss.github.io/music-teaching-assistant/)

---

## 🚀 Project Roadmap

### 🎸 Instrumental Training (Primarily Guitar)

- [x] **Ear Training**: Improve your sense of pitch by repeatedly listening to scales/chords.
- [x] **Tone Identification**: Randomly play scales/chords and select the correct one from options to further enhance pitch perception.
- [ ] **Chord Dictation**: Randomly play chords and mark them on the fretboard to improve chord knowledge.
- [ ] **Metronome**: TBD (Many existing tools; considering unique features).
- [ ] **Tuner**: TBD (Many existing tools; considering unique features).

### 🎤 Vocal Training

- [ ] **Vocalization**: Descending `ma` scale exercises.
- [ ] **Vowel Practice**: Classic exercises like `mimami`.
- [ ] **Range Extension**: Ascending `E` scale exercises to expand range.

### ⚙️ System Settings

- [x] **Import/Export Config**: Export full configuration to a JSON file for use across devices.
- [x] **Edit Config**: Direct editing of configuration items.
- [ ] **Cloud Sync**: Planned support for mainstream cloud storage synchronization.

### 🌐 Internationalization

- [x] **Multi-language Support**: Currently supports English and Simplified Chinese interfaces.

### Pending Fixes

1. Some issues with note name playback in **Ear Training** need investigation and fixing.

---

## 🛠️ Technology Stack

- **Framework**: [Umi Max](https://umijs.org/) (React)
- **UI Components**: [Ant Design](https://ant.design/) & [ProComponents](https://procomponents.ant.design/)
- **Editor**: [@monaco-editor/react](https://github.com/suren-atoyan/monaco-react)
- **Audio Engine**: [Tone.js](https://tonejs.github.io/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)

---

## 🚀 Quick Start

### Local Development

1. **Install Dependencies**

   ```bash
   pnpm install
   ```

2. **Start Dev Server**

   ```bash
   pnpm run dev
   ```

### Build & Deploy

```bash
pnpm run deploy
```

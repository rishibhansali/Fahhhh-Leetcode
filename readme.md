# 🎧 LeetCode Meme-ifier Pro

**LeetCode Meme-ifier Pro** is a productivity-meets-humor browser extension that turns the grind of competitive programming into an interactive experience. It watches your LeetCode **Run** and **Submit** results in real time and reacts with a meme sound the instant a verdict comes in.

![Manifest V3](https://img.shields.io/badge/Manifest-V3-blue) ![Chrome](https://img.shields.io/badge/Chrome-supported-brightgreen) ![Sounds](https://img.shields.io/badge/memes-22-orange)

## ✨ Features

* **Real-Time Result Detection** — reacts to both the **Run** (Test Result) and **Submit** panels, covering `Accepted`, `Wrong Answer`, `Runtime Error`, `Compile Error`, `Time Limit Exceeded`, and `Memory Limit Exceeded`.
* **Curated Meme Library** — 22 iconic sounds to pick from, including *Emotional Damage*, *Vine Boom*, *Coffin Dance*, and *Among Us Role Reveal*.
* **Sensible Defaults** — plays the **Spiderman Theme** on success and **Faaah!** on failure out of the box.
* **Pro Audio Controls**
    * **Volume Slider** — tune the intensity of your memes to suit your environment.
    * **Max Duration** — cap playback length (in seconds) so a clip never overlaps your next thought.
    * **Interactive Preview** — toggle **Play (▶️)** / **Pause (⏸️)** on any sound before saving.
* **One-Click Enable/Disable** — a single toggle in the popup lets you mute the whole extension without uninstalling it.
* **Universal Compatibility** — works in **Chrome**, **Brave**, **Arc**, and other Chromium-based browsers.

---

## Demo
https://github.com/user-attachments/assets/d8bf2340-304f-4af5-a3fa-d536c998ca2b

## 🛠️ Installation & Setup

### 1. Clone the repository
```bash
git clone https://github.com/rishibhansali/Fahhhh-Leetcode.git
cd Fahhhh-Leetcode
```

### 2. Load the extension
1. Open your browser and navigate to `chrome://extensions/`.
2. Enable **Developer mode** (toggle in the top-right corner).
3. Click **Load unpacked** and select the `Fahhhh-Leetcode` project folder.

### 3. Configure your memes
Click the extension icon to open the settings popup, pick your success/failure sounds, adjust volume and max duration, then hit **Save Preferences**.

> **Note:** browsers block audio autoplay until you've interacted with the page at least once. Click anywhere on the LeetCode tab before your first Run/Submit and you're set for the rest of the session.

---

## 📁 Project Structure

```text
├── sounds/             # 22 meme .mp3 files
├── icon16.png          # Toolbar icon
├── icon48.png          # Extensions menu icon
├── icon128.png         # Main store/display icon
├── manifest.json       # Extension configuration (Manifest V3)
├── content.js          # Watches LeetCode's Run/Submit results and plays the matching sound
├── popup.html          # Settings UI (HTML/CSS)
└── popup.js            # Meme selection, audio previews, and settings persistence
```

---

## 🤝 Contributing
Feel free to fork this repository, add new sounds to the `/sounds` folder, and register them in the `memeNames` object in `popup.js`.

**Happy Coding!** 💻🔥

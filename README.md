# AR-VR-Group-6

## Project Overview

### What is this?

This is our Group 6 project for London South Bank University. We built a virtual reality tour of the LSBU campus using A-Frame, so that prospective and current students can explore the university without having to be there in person. You can use it in a normal browser on your laptop or phone, or put on a VR headset for the full experience.

We filmed five real locations on campus and turned them into 360° videos with voiceovers, captions, and on-screen labels that pop up as you look around.

---

## What's inside the tour

- **Student Centre** — the first floor, the bar area (The Venue), and the cafeteria upstairs
- **Cafeteria** — the seating booths, the student kitchen, and links to the art block and Faraday wing
- **Outside Student Centre** — the view outside including Tesco opposite, LSBU Hub to the left, and Borough Road building
- **LSBU Hub** — the Student Help Desk, the coffee shop, the library, study rooms, and the sports hall
- **Library Courtyard** — the quiet outdoor space in the centre of the library
- **Robot Special Feature** — a bonus video of a robot roaming through the Student Centre entrance

---

## How to use the tour

Once you're inside `LsbuTour.html`:

- **Look around** — click and drag on desktop, or just move your head in a headset
- **Switch scenes** — press **Q** on your keyboard to bring up the scene selection panel, then click the scene you want
- **Play / Pause** — the video panel has play and pause buttons controller for VR headsets
- **VR headset** — if you're on a Quest or similar, use the right controller B button to open the scene switcher

---

## 📁 Project Directory

```
AR-VR-Group-6/
│
├── 📄 index.html          ← The landing page — shows what's in the tour
├── 📄 LsbuTour.html       ← The actual VR experience
├── 📄 server.py           ← Run this to start the local server
│
├── 📂 css/
│   └── 📄 index.css       ← Styles for the landing page
│
├── 📂 js/
│   ├── 📄 theme.js        ← Handles the dark/light mode switch
│   └── 📄 main.js         ← Animations on the landing page
│
├── 📂 lib/
│   ├── 📄 aframe.js       ← The A-Frame library
│   └── 📄 environment.js  ← A-Frame environment component
│
└── 📂 assets/
    ├── 📂 images/         ← Thumbnails and UI buttons
    ├── 📂 video/          ← The 360° videos (hosted on Cloudflare R2)
    ├── 📂 anims/          ← The annotation images that appear during scenes
    └── 📂 audio/          ← Voiceovers and background music
```

### Other Files

- 📄 **`requirements.txt`** — Python dependencies (none needed beyond the standard library)
- 📄 **`LICENSE.txt`** — Project licence
- 📄 **`README.md`** — This file

---

## ☁️ Cloudflare R2

The videos are too large to host on GitHub or Vercel directly (some are over 500MB), so we uploaded them all to **Cloudflare R2** which serves them as a CDN. All the audio and images are on there too.

Everything in the `assets/` folder maps to our R2 bucket:

```
https://pub-5284e2be46f649b793c07aa2d104bb68.r2.dev/
```

This means the site loads fast no matter where it's hosted because the heavy files come straight from Cloudflare's global network rather than the hosting platform.

---

## 🛠️ Troubleshooting

**Black screen when loading the tour?**

This is usually just the 360° video buffering on first load. Try these in order:

1. Click anywhere on the page first — browsers block video autoplay until you interact
2. Wait a few seconds for the video to buffer
3. Hard refresh the page with **`Ctrl + Shift + R`**

# 🌾 AI Crop Dashboard

<div align="center">

![AI Crop Dashboard](https://img.shields.io/badge/AI%20Crop%20Dashboard-v3.0-22C55E?style=for-the-badge&logo=leaf&logoColor=white)

**An AI-powered agricultural decision support system — Neural Network trained on real Kaggle data, running entirely in your browser.**

[![TensorFlow.js](https://img.shields.io/badge/TensorFlow.js-4.20-FF6F00?style=flat-square&logo=tensorflow&logoColor=white)](https://www.tensorflow.org/js)
[![Supabase](https://img.shields.io/badge/Supabase-Auth%20%2B%20DB-3ECF8E?style=flat-square&logo=supabase&logoColor=white)](https://supabase.com)
[![Chart.js](https://img.shields.io/badge/Chart.js-4.x-FF6384?style=flat-square&logo=chart.js&logoColor=white)](https://www.chartjs.org/)
[![Kaggle Dataset](https://img.shields.io/badge/Dataset-Kaggle%202200%20rows-20BEFF?style=flat-square&logo=kaggle&logoColor=white)](https://www.kaggle.com/datasets/atharvaingle/crop-recommendation-dataset)
[![License](https://img.shields.io/badge/License-MIT-yellow?style=flat-square)](LICENSE)

[✨ Features](#-features) • [🚀 Getting Started](#-getting-started) • [🧠 ML Model](#-ml-model) • [📁 Structure](#-project-structure) • [🗄️ Database](#️-database-setup) • [📊 Pages](#-pages) • [🐛 Troubleshooting](#-troubleshooting)

</div>

---

## 📖 Overview

**AI Crop Dashboard** is a premium, browser-based agricultural intelligence platform designed for farmers and agronomists. It trains a **real TensorFlow.js neural network** on the **Kaggle Crop Recommendation Dataset (2,200 rows, 22 crops)** directly in the browser — no backend server needed. The prediction output features a stunning **glassmorphism UI** with animated blobs, ranking cards, and a "Why This Crop?" insight panel.

> 🏆 Achieves **~95–99% accuracy** on the Kaggle Crop Recommendation Dataset after 60 training epochs.

---

## ✨ Features

### 🧠 AI / Machine Learning
- **Real TensorFlow.js Neural Network** — `Dense(128) → BatchNorm → Dropout(15%) → Dense(64) → Dense(32) → Softmax(22)`
- **Trained on Kaggle Dataset** — 2,200 rows, 100 samples per crop, 22 perfectly-balanced crop classes
- **Live Training Progress** — Animated progress bar with epoch counter, loss & accuracy updated in real time
- **Auto Fallback** — If CSV fails to load, falls back to 660-sample synthetic dataset automatically
- **Top-4 Probability Rankings** — Full neural network output ranked by confidence

### 🎨 Glassmorphism Prediction UI *(New in v3.0)*
- **Animated Hero Card** — Dark frosted glass with 4 animated colour blobs (green, blue, orange, purple) + shimmer scan line
- **Gradient Crop Name** — White → soft green → gold gradient text
- **Neon Suitability Bar** — Glowing bar with pulsing end-dot animation
- **Top 4 Ranking Cards** — 4 glassmorphism cards with 🥇🥈🥉 medals, crop emoji, coloured probability bar and %
  - 🥇 Winner card continuously pulses green glow
  - Each card lifts and scales on hover
- **"Why This Crop?" Panel** — 6-cell grid showing ideal temperature, humidity, pH, rainfall, soil compatibility & season note (with rainbow top accent line)
- **Alternative Chips with Emoji** — Hover turns chips neon green with glow; each chip shows crop emoji
- **Delta Badges** — `✅ good` / `🟡 ok` / `🔴 off` vs ideal values, with neon borders
- **Frosted Glass Parameter Grid** — Each card lights up green on hover
- **Model Footer** — Shows data source, crop count, epochs, accuracy, training time

### 📊 Analytics & Charts
- **Submissions Over Time** — Line chart (last 14 days)
- **Crop Type Distribution** — Doughnut chart from live Supabase data
- **Monthly Weather Variation** — Bar + line chart (Temp, Humidity, Rainfall)
- **State-wise Submissions** — Horizontal bar chart (top 10 states)

### 🌦 Weather Alerts
- **6 Alert Types** — 🌪️ Cyclone, 🌧️ Heavy Rainfall, 🔥 Heat Wave, 🌬️ Frost Risk, ☀️ Favorable, 🦗 Locust
- **Detailed Modals** — Wind speed, rainfall, affected crops, 5-point farmer advisory
- **Severity Badges** — Extreme / High / Moderate / None colour-coded

### 🔐 Authentication
- **Supabase Auth** — Email + password signup / login
- **Session Persistence** — JWT stored in localStorage, auto-checked on every page
- **Protected Routes** — Analytics & data pages redirect to login if unauthenticated

### 🎨 UI / UX
- **Premium Dark Mode** — Warm amber/orange palette with glassmorphism components
- **Micro-animations** — Hover lifts, pulsing buttons, floating emoji, blob animations
- **Live Slider Preview** — Slider values and summary update instantly as you drag
- **Fully Responsive** — Works on desktop, tablet, and mobile

### 📋 Data Management
- **Farmer Submission Form** — 14 fields including soil, irrigation, season, nutrients
- **All Data Table** — Search, filter, and paginate all Supabase records
- **Stats Cards** — Total submissions, active farmers, avg temperature, top crop

---

## 🖼️ Prediction Result — What You See

After clicking **🤖 Predict Suitable Crop**:

```
┌─────────────────────────────────────────────┐
│  [Animated blobs: green 🟢 blue 🔵 orange 🟠] │  ← Glassmorphism hero card
│              🌾  (floating, glowing)          │
│           R I C E                             │  ← Gradient text
│   [🎯 89% Confidence] [🌱 92% Suitability]   │  ← Frosted glass stat row
│   ████████████████████░░░░  ●                 │  ← Neon glow bar + pulsing dot
│   💡 Rice thrives in high-humidity…           │  ← Tip in frosted box
│   Also: 🌽 Maize  🌿 Jute  🌾 Blackgram      │  ← Emoji chips (hover = neon green)
└─────────────────────────────────────────────┘

🏆 Top Neural Network Predictions
┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐
│ 🥇    🌾 │ │ 🥈    🌿 │ │ 🥉    🌽 │ │ 4️⃣   ⚫ │
│  Rice    │ │  Jute    │ │  Maize   │ │ Blackgram│
│ ████████ │ │ ██░░░░░░ │ │ █░░░░░░░ │ │ ░░░░░░░░ │
│    89%   │ │    7%    │ │    3%    │ │    1%    │
│✅ Best   │ │          │ │          │ │          │
└──────────┘ └──────────┘ └──────────┘ └──────────┘

🌿 Why Rice?
┌──────────┬──────────┬──────────┐
│ 🌡 24°C  │ 💧 82%   │ 🧪 pH6.4 │
│ 🌧 236mm │ 🪨 Ideal │ ☀️ Kharif│
└──────────┴──────────┴──────────┘

📊 Your Input vs Ideal  (7 parameter comparison cards with delta badges)
```

---

## 🚀 Getting Started

### Prerequisites

| Tool | Purpose |
|------|---------|
| Modern Browser (Chrome/Edge) | Run TF.js + backdrop-filter CSS |
| [Supabase Account](https://supabase.com) | Auth + Database (free tier) |
| Python 3 or Node.js | Local HTTP server |
| Git | Clone the repo |

> ⚠️ **Must use `http://localhost`** — not `file://`. Two features require HTTP: `fetch()` for the CSV dataset and Supabase Auth token cookies.

---

### 1️⃣ Clone

```bash
git clone https://github.com/hg5594176-source/Crop-Prediction.git
cd ai-crop-dashboard
```

---

### 2️⃣ Configure Supabase

1. Create a project at [supabase.com](https://supabase.com)
2. Copy your **Project URL** and **anon public key** from `Settings → API`
3. Edit `js/supabase-config.js`:

```js
const SUPABASE_URL      = 'https://YOUR_PROJECT_ID.supabase.co';
const SUPABASE_ANON_KEY = 'YOUR_ANON_KEY_HERE';
```

4. Run [`schema.sql`](schema.sql) in **Supabase Dashboard → SQL Editor**

5. *(Recommended for local dev)* Disable email confirmation:  
   **Auth → Settings → Disable "Enable email confirmations"**

---

### 3️⃣ Start Local Server

**Windows (PowerShell) — Recommended:**
```powershell
.\start-server.ps1
```

**Windows (Batch):**
```cmd
run.bat
```

**Python:**
```bash
python -m http.server 8080
```

**Node.js:**
```bash
npx serve . -p 8080
```

Open → **`http://localhost:8080`**

---

### 4️⃣ Dataset

`Crop_recommendation.csv` is included in the project root (150KB).

| Property | Value |
|----------|-------|
| Source | [Kaggle — Atharva Ingle](https://www.kaggle.com/datasets/atharvaingle/crop-recommendation-dataset) |
| Rows | **2,200** |
| Crops | **22** (perfectly balanced, 100 each) |
| Features | N, P, K, Temperature, Humidity, pH, Rainfall |

The model loads this automatically when `analytics.html` opens. Training takes **10–20 seconds** in the browser.

---

## 🧠 ML Model

### Architecture

```
Input (7)  →  Dense(128, ReLU)  →  BatchNorm  →  Dropout(15%)
           →  Dense(64,  ReLU)  →  Dropout(10%)
           →  Dense(32,  ReLU)
           →  Dense(22,  Softmax)  →  22 Crop Probabilities
```

### Training Config

| Parameter | Value |
|-----------|-------|
| Optimizer | Adam (lr = 0.003) |
| Loss | Categorical Cross-Entropy |
| Epochs | **60** |
| Batch Size | 16 |
| Validation Split | 10% |
| Normalization | Min-Max per feature |
| Training Accuracy | ~97–99% |

### Supported Crops (22 Classes)

| # | Crop | # | Crop | # | Crop |
|---|------|---|------|---|------|
| 1 | 🌾 Rice | 9 | 🍵 Lentil | 17 | 🍊 Orange |
| 2 | 🌽 Maize | 10 | 🍎 Pomegranate | 18 | 🫐 Papaya |
| 3 | 🌰 Chickpea | 11 | 🍌 Banana | 19 | 🥥 Coconut |
| 4 | 🫘 Kidney Beans | 12 | 🥭 Mango | 20 | ☁️ Cotton |
| 5 | 🟤 Pigeon Peas | 13 | 🍇 Grapes | 21 | 🌿 Jute |
| 6 | 🟡 Moth Beans | 14 | 🍉 Watermelon | 22 | ☕ Coffee |
| 7 | 🟢 Mung Bean | 15 | 🍈 Muskmelon | | |
| 8 | ⚫ Black Gram | 16 | 🍏 Apple | | |

---

## 📁 Project Structure

```
ai-crop-dashboard/
│
├── index.html                   # 🏠 Dashboard + farmer data form
├── analytics.html               # 📊 AI Prediction + Charts + Weather Alerts
├── alldata.html                 # 📋 All farmer records table
│
├── Crop_recommendation.csv      # 🌾 Kaggle dataset (2200 rows, 22 crops)
├── schema.sql                   # 🗄️  Supabase PostgreSQL schema
├── README.md                    # 📖 This file
│
├── css/
│   └── style.css                # 🎨 Full design system (glassmorphism, animations)
│
├── js/
│   ├── supabase-config.js       # 🔑 Supabase URL + anon key ← edit this
│   ├── auth.js                  # 🔐 Login, signup, session management
│   ├── data.js                  # 📤 Supabase read/write helpers
│   ├── dashboard.js             # 🏠 Stats cards + form submit logic
│   ├── analytics.js             # 🧠 TF.js ML + Charts + Weather Alerts (43KB+)
│   └── alldata.js               # 📋 Data table + search/filter
│
├── docs/
│   └── project-documentation.html  # 📄 Full printable PDF documentation
│
├── start-server.ps1             # ▶️  PowerShell HTTP server (Windows)
└── run.bat                      # ▶️  Batch file HTTP server (Windows)
```

---

## 🗄️ Database Setup

Run [`schema.sql`](schema.sql) in **Supabase Dashboard → SQL Editor**:

```sql
CREATE TABLE farmer_data (
  id            UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  timestamp     TIMESTAMPTZ DEFAULT NOW(),
  farmer_name   TEXT,
  state         TEXT,
  crop_type     TEXT,
  soil_type     TEXT,
  temperature   NUMERIC,
  humidity      NUMERIC,
  rainfall      NUMERIC,
  nitrogen      NUMERIC,
  phosphorus    NUMERIC,
  potassium     NUMERIC,
  ph            NUMERIC,
  irrigation    TEXT,
  season        TEXT
);

ALTER TABLE farmer_data ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow authenticated" ON farmer_data
  FOR ALL USING (auth.role() = 'authenticated');
```

---

## 📊 Pages

### 🏠 `index.html` — Dashboard
- Stats cards: Total Submissions, Active Farmers, Avg Temperature, Top Crop
- Farmer data submission form (14 fields)
- Recent activity list (last 5 submissions)

### 📈 `analytics.html` — Analytics & AI Prediction

**Model Training Panel:**
- Blue animated progress bar → fills epoch by epoch
- Live stats: `Epoch X/60 | Loss: 0.XXX | Accuracy: XX.X%`
- Button shows `⏳ Training Model… Please Wait` (pulsing) → becomes `🤖 Predict Suitable Crop`

**Charts:**
- 📈 Submissions over time (14-day line)
- 🍩 Crop distribution (doughnut)
- 🌡️ Monthly weather (bar + line)
- 🗺️ State-wise submissions (horizontal bar)

**Weather Alerts:**
- 6 clickable chips → full-detail modal popups

**AI Prediction Result:**
- ✨ Glassmorphism hero card with animated blobs
- 🏆 Top-4 ranking cards with medals + probability bars
- 🌿 "Why This Crop?" panel with 6 insight cells
- 📊 7-parameter comparison grid with delta badges

### 📋 `alldata.html` — All Records
- Full table of all Supabase farmer data
- Search by name / state / crop + pagination

---

## 🛠️ Tech Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| 🧠 ML | TensorFlow.js | 4.20.0 |
| 🗄️ DB | Supabase (PostgreSQL) | v2 |
| 🔐 Auth | Supabase Auth | v2 |
| 📊 Charts | Chart.js | 4.x |
| 🎨 UI | Vanilla HTML + CSS + JS | ES2022 |
| 📂 Dataset | Kaggle CSV | — |
| 🔤 Fonts | Google Fonts — Inter | — |

---

## ⚙️ Slider Ranges

| Parameter | Min | Max | Default | Unit |
|-----------|-----|-----|---------|------|
| Temperature | 5 | 50 | 28 | °C |
| Humidity | 10 | 100 | 60 | % |
| Rainfall | 0 | 400 | 100 | mm |
| Soil pH | 3.5 | 9.5 | 6.5 | — |
| Nitrogen | 0 | 140 | 50 | kg/ha |
| Phosphorus | 0 | 145 | 40 | kg/ha |
| Potassium | 0 | 205 | 40 | kg/ha |

---

## 🌱 Example Predictions

| N | P | K | Temp | Humidity | pH | Rainfall | Predicted |
|---|---|---|------|----------|----|----------|-----------|
| 80 | 48 | 40 | 24 | 82 | 6.4 | 236 | 🌾 Rice |
| 78 | 48 | 19 | 23 | 65 | 6.3 | 85 | 🌽 Maize |
| 23 | 132 | 200 | 24 | 82 | 6.0 | 70 | 🍇 Grapes |
| 40 | 67 | 79 | 18 | 17 | 7.3 | 80 | 🌰 Chickpea |
| 101 | 28 | 29 | 26 | 59 | 6.8 | 158 | ☕ Coffee |

---

## 🐛 Troubleshooting

| Problem | Cause | Fix |
|---------|-------|-----|
| Button stays "Training…" forever | TF.js CDN or CSV fetch failed | Use `run.bat` / `start-server.ps1`. Check browser console for errors |
| "CSV not found" warning toast | App opened via `file://` | Serve over `http://localhost:8080` |
| Charts empty | No Supabase data / wrong config | Check `supabase-config.js`, add a form submission first |
| "Email not confirmed" | Supabase email confirmation on | Auth → Settings → Disable email confirmations |
| Prediction always same crop | Model not trained yet | Wait for green ✅ toast before predicting |
| Alt chips don't show emoji | `CROP_META` missing for that crop | All 22 Kaggle crops are mapped — check spelling |

---

## 🤝 Contributing

1. Fork the repo
2. Create a branch: `git checkout -b feature/my-feature`
3. Commit: `git commit -m "Add: my feature"`
4. Push: `git push origin feature/my-feature`
5. Open a Pull Request

### Ideas Welcome
- [ ] Export prediction as PDF / image card
- [ ] Multi-language support (Hindi, Punjabi, Telugu)
- [ ] PWA / offline mode
- [ ] Government scheme recommendations per crop
- [ ] Seasonal planting calendar view
- [ ] Mobile app (React Native / Flutter)

---

## 📄 License

MIT License — free to use, modify and distribute with attribution.

---

## 🙏 Credits

| Resource | Author |
|----------|--------|
| [Crop Recommendation Dataset](https://www.kaggle.com/datasets/atharvaingle/crop-recommendation-dataset) | Atharva Ingle — Kaggle |
| [TensorFlow.js](https://www.tensorflow.org/js) | Google Brain Team |
| [Supabase](https://supabase.com) | Supabase Inc. |
| [Chart.js](https://www.chartjs.org/) | Chart.js Contributors |
| [Inter Font](https://fonts.google.com/specimen/Inter) | Rasmus Andersson |

---

<div align="center">

**Made with ❤️ for Indian Farmers 🌾**

*If this helped you, please ⭐ star the repository!*

[![GitHub Stars](https://img.shields.io/github/stars/YOUR_USERNAME/ai-crop-dashboard?style=social)](https://github.com/YOUR_USERNAME/ai-crop-dashboard)

</div>

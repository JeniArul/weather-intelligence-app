# Weather Intelligence App 🌦️

A highly accurate, client-side React + TypeScript Weather Intelligence and travel planning application. It maps geocoding matches and extracts 7-day meteorological trends completely from public Open-Meteo APIs, providing an interactive dashboard and customized suitability ratings without any backend dependencies.

Fully optimized for **instant deployment to Cloudflare Pages** directly from a GitHub repository.

---

## 🌟 Key Capabilities
* **Global City Lookup**: Resolves latitude/longitude matches worldwide dynamically with Open-Meteo Geocoding.
* **Empirical Recommendation Engine**: Employs an instant, serverless local rule system to deliver personalized travel advisories, activity suitabilities, and clothing checklists.
* **7-Day Trend Analytics**: Displays temperature and precipitation probability indexes rendered using fully responsive inline SVG paths.
* **Modern SaaS Design**: Styled with a highly responsive, custom Tailwind layout featuring dynamic weather-theme matching gradients and crisp Lucide icons.

---

## 🛠️ Technology Stack & APIs
This application is designed to be 100% frontend-only. It has zero backend, database, private credential, or runtime API dependencies.

### 1. Data Sources
* **City Search & Geocoding**:
  `https://geocoding-api.open-meteo.com/v1/search?name={city}&count=10`
* **Weather Forecast Engine**:
  `https://api.open-meteo.com/v1/forecast?latitude={lat}&longitude={lon}&current=...&daily=...&timezone=...`

### 2. Client Architecture
* **Frontend Sandbox**: React 19 + TypeScript + Vite.
* **Layout and Animations**: Tailwind CSS + Motion + Lucide-react icons.

---

## 🚀 Deployment Instructions: Cloudflare Pages

Since this is a client-only Single Page Application (SPA), it is perfectly suited for Cloudflare Pages.

### Step 1: Push Your Code to GitHub
Ensure all your files are committed and pushed to a GitHub repository:
```bash
git init
git add .
git commit -m "feat: complete frontend weather intelligence dashboard"
git remote add origin https://github.com/your-username/your-weather-repo.git
git branch -M main
git push -u origin main
```

### Step 2: Set Up Cloudflare Pages
1. Log into your **Cloudflare Dashboard** and select **Workers & Pages**.
2. Click **Create Application** followed by the **Pages** tab.
3. Click **Connect to Git** and choose the repository you pushed in Step 1.
4. Configure your **Build Settings**:
   * **Framework Preset**: `Vite` (or `None`)
   * **Build command**: `npm run build`
   * **Build output directory**: `dist`
5. Click **Save and Deploy**.

Cloudflare will compile the code using `npm run build` and serve the static assets from the `dist/` directory. Your app will be live on a custom `.pages.dev` subdomain immediately!

---

## 🖥️ Local Development

### 1. Install Dependencies
```bash
npm install
```

### 2. Run the Development Server
```bash
npm run dev
```
The server will start on port `3000` (e.g., `http://localhost:3000`).

### 3. Build Production Bundle
```bash
npm run build
```
This produces optimized static assets in the `/dist` folder.

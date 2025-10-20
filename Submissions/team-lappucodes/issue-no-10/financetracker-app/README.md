# 💰 Sindhi Finance – "Paiso Aa" 🏵️  
*A Gamified Personal Finance Tracker with a Sindhi Soul*

**Paiso Aa** is a gamified, culturally themed personal finance dashboard built in **React**.  
It helps you track income, expenses, and goals — with a touch of Sindhi flair, badges, and fun challenges to make budgeting feel less like a chore and more like a game.

---

## ✨ Features

### 🎮 Gamified Finance Dashboard
- Track income, expenses, savings goals, and total balance.
- Earn **points and badges** for saving or completing challenges.
- View a **leaderboard** to compare with friends.

### 📊 Financial Insights
- Mini **SVG charts** for expenses and trends (no external chart libraries).
- Transaction management: add, delete, and filter by category.

### 🎯 Goals & Budgets
- Set financial goals and monitor real-time progress.
- Auto-updates balance when contributing to goals.

### 🪙 Rewards System
- Complete challenges like “Save Rs. 5000 this week” to earn Paiso Points.
- Unlock titles like *Ameerana Baar Hoon* (Wealth Master).

### 🔐 Auth Simulation
- Simple mock login/logout using **localStorage** (no backend yet).

### 🌸 Sindhi Cultural Touch
- Ajrak-inspired background  
- Sindhi phrases like *“Paiso aa, Baba Saeen jo ashirwad aa”* scattered throughout the UI.  
- Blends finance with heritage.

---

## 🧱 Tech Stack

| Layer | Technology |
|-------|-------------|
| Frontend | React (Vite or CRA) |
| Styling | Tailwind CSS |
| Icons | lucide-react |
| Charts | Custom inline SVGs |
| Storage | LocalStorage (mock JWT for demo login) |

---

## ⚙️ Local Setup (via Command Prompt)

### 1️⃣ Create Folder
```bash
mkdir sindhi-finance
cd sindhi-finance
````

### 2️⃣ Initialize React App

```bash
npx create-react-app .
```

### 3️⃣ Install Dependencies

```bash
npm install lucide-react
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

Edit `tailwind.config.js`:

```js
content: ["./src/**/*.{js,jsx,ts,tsx}"]
```

Replace `src/index.css` with:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

### 4️⃣ Replace App Code

* Delete everything inside `src/` except `index.js` and `index.css`.
* Create `src/App.jsx` and paste the **Paiso Aa** code there.
* Ensure `index.js` imports it like this:

  ```js
  import App from "./App";
  import "./index.css";
  ```

### 5️⃣ Run App

```bash
npm start
```

Your app will run at **[http://localhost:3000](http://localhost:3000)**

---

## 🚀 Build & Deploy

To create a production build:

```bash
npm run build
```

Then deploy the generated `/build` folder using:

* [Netlify](https://www.netlify.com/)
* [Vercel](https://vercel.com/)
* GitHub Pages

---

## 🏅 Future Enhancements

* Real authentication (JWT/OAuth2)
* Persistent backend (Node.js + MongoDB)
* Detailed analytics & spending heatmap
* Friends system + competitive leaderboard
* Dark Mode toggle
* Data export (CSV & PDF)

---

## 🧡 Credits

Built with patience, caffeine, and Sindhi pride.
**Author:** Shiza
**Theme:** Ajrak-inspired | *Baba Saeen Jo Aashirwad*

---

> “Paiso aa, par izzat bhi aa.” — Sindhi wisdom on wealth & balance.

```
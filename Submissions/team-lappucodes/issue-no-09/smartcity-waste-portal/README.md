# 🎃 SmartCity Kachra Uthao — Halloween Edition 👻

A playful yet functional **React-based Smart City Waste Management Dashboard**, redesigned with a **Halloween-themed twist**.  
Built with **Tailwind CSS** and **Lucide React Icons**, this project demonstrates role-based dashboards for **citizens, drivers, and administrators**, all within a responsive and animated UI.

---

## 🧹 Overview

**SmartCity Kachra Uthao** is an interactive web app that visualizes how a city might manage solid waste collection and complaint tracking in real-time.  
Users can switch between three roles:

- 🧍 **Citizen** — File and track garbage complaints, upload photos, and view response progress.  
- 🚛 **Driver** — View assigned routes, mark zones as collected, and upload collection proof.  
- 🕵️ **Admin** — Monitor zones, assign staff, track vehicles, and view key performance stats.

Every interface comes with **whimsical Halloween visuals**, such as animated spiders, floating emojis, and spooky color gradients, making the app both educational and fun.

---

## ⚙️ Tech Stack

| Layer | Technology Used |
|-------|------------------|
| **Frontend** | React (Vite or CRA) |
| **Styling** | Tailwind CSS |
| **Icons** | Lucide React |
| **State Management** | React `useState` hooks |
| **Animations** | Tailwind CSS utilities (`animate-bounce`, gradients, transitions) |

---

## 🧩 Features

### 🎃 Multi-Role Dashboard
- **Citizen Panel:**  
  Report uncollected garbage with photo upload, track status, and see resolution progress.
- **Driver Panel:**  
  Manage assigned routes, update task completion, and submit collection proofs.
- **Admin Panel:**  
  Oversee all zones, track driver assignments, vehicles, and live metrics.

### 🕸️ Dynamic Components
- Reusable **StatusBadge** with color-coded status indicators.  
- Animated **floating icons** for a spooky visual experience.  
- **Responsive grid layouts** across devices.  
- **Gradient cards and transitions** for smooth UI interaction.

---

## 🚀 Installation & Setup

1. **Clone this repository:**
   ```bash
   git clone https://github.com/sshizashah13/HacktoberFest-2.0/smartcity-kachra-uthao.git
   cd smartcity-kachra-uthao
````

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Run the development server:**

   ```bash
   npm run dev
   ```

4. **Open in browser:**

   ```
   http://localhost:5173
   ```

---

## 🧠 File Structure

```
src/
│
├── components/
│   └── SmartCity.jsx     # Main component with role-based views
│
├── assets/               # (Optional) Add images or static assets
│
└── App.jsx               # Entry point
```

---

## 💡 Customization

You can:

* Change theme colors in `tailwind.config.js`
* Add backend integration for real data (Firebase, Node.js, etc.)
* Replace Halloween emojis with standard icons for production

---

## 🪄 Highlights

* 🎨 **Fully responsive design** — works across all screen sizes
* 🕷️ **Animated background** — custom SVG spiderweb pattern
* ⚡ **Role switching logic** — `useState` based role toggling
* 🧩 **Component reusability** — clean modular structure

---

## 🧑‍💻 Developer

**Developed by [LappuCodes](https://github.com/yourusername)**
*“Keep the city clean, even on Halloween!”* 👻

---

## 📜 License

This project is open-source and available under the **MIT License**.

---
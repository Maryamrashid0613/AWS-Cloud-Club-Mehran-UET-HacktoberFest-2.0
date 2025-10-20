# 💰 Gamified Personal Finance Tracker

> **Team Quark AI** | **Issue #10** | **Hacktoberfest AWS 2025**  
> Developed by **Muhammad Tayyab**

A modern, gamified mobile finance tracker that makes budgeting and saving fun and engaging through challenges, achievements, and interactive visualizations.

---

## 🚀 Features

### 🏠 **User Dashboard**
- Real-time financial overview with balance, spending trends, and savings goals
- Quick access to recent transactions and budget status
- Level-based progression system with points and rewards

### 💳 **Transaction Management**
- Add, view, update, and delete transactions with image receipts
- Smart categorization (Food, Transport, Entertainment, Utilities, etc.)
- Advanced filtering: search by date, amount, category, or payment method
- Real-time synchronization across all screens

### 🎯 **Budget & Goal Tracking**
- Set monthly budgets per wallet with visual progress indicators
- Track savings goals with percentage completion
- Alerts when approaching or exceeding budget limits

### 🏆 **Gamification Engine**
- Earn **10 points** for every income transaction
- Level up system (100 points per level)
- Achievement badges and progress tracking
- Global leaderboard to compete with friends

### 📊 **Data Visualization**
- Interactive charts: Pie charts for expense breakdown, line charts for trends
- Weekly, monthly, and yearly financial reports
- Export data in **CSV** and **PDF** formats

### 🤖 **AI Financial Assistant**
- Powered by **Gemini AI** for smart financial advice
- Transaction analysis and budget recommendations
- Natural language queries about your finances

### 🎨 **User Experience**
- Beautiful dark/light theme support
- Smooth animations and transitions
- Responsive design for all screen sizes
- Multi-currency support

---

## 🛠️ Technology Stack

| Category | Technologies |
|----------|-------------|
| **Frontend** | React Native, Expo (~54.0.13) |
| **Navigation** | Expo Router (~6.0.11) |
| **Styling** | NativeWind (Tailwind CSS for React Native) |
| **Icons** | Lucide React Native |
| **Authentication** | Clerk Expo (~2.17.0) |
| **Database** | Supabase (~2.75.1) - PostgreSQL with real-time subscriptions |
| **Storage** | Supabase Storage (Image uploads) |
| **AI Integration** | Google Gemini AI |
| **State Management** | React Context API |
| **Data Export** | expo-file-system, expo-print, expo-sharing |

---

## 📦 Installation

### Prerequisites
- Node.js (v18 or higher)
- Expo CLI
- Supabase account
- Clerk account

### Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/MunibUrRehmanMemon/HacktoberFest-2.0.git
   cd Submissions/QuarkAi/issue-10-gamified-personal-finance-tracker
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   Create a `utils/supabase.ts` file with your Supabase credentials:
   ```typescript
   export const supabase = createClient('YOUR_SUPABASE_URL', 'YOUR_SUPABASE_ANON_KEY')
   ```

4. **Configure Clerk**
   Add your Clerk publishable key in your app configuration.

5. **Run the app**
   ```bash
   npx expo start
   ```

---

## 📱 Screenshots

- **Dashboard**: Financial overview with level progress and wallet cards
- **Transactions**: Filterable transaction list with search and sorting
- **AI Chat**: Smart financial assistant powered by Gemini
- **Profile**: User profile with achievement tracking
- **Export**: CSV/PDF financial reports generation

---

## ✨ Key Highlights

✅ **Real-time Updates** - Instant UI updates using Supabase real-time subscriptions  
✅ **Optimistic UI** - Immediate feedback without waiting for server responses  
✅ **Gamification** - Points, levels, and leaderboards keep users motivated  
✅ **Smart Filtering** - 7+ filter types for advanced transaction searches  
✅ **Data Export** - Export financial data in CSV or PDF with one tap  
✅ **AI-Powered** - Get intelligent financial advice from Gemini AI  
✅ **Secure** - Clerk authentication with JWT tokens  
✅ **Multi-Wallet** - Manage multiple wallets with different currencies  

---

## 🎯 Hacktoberfest 2025 - Issue #10

This project was developed as part of **Hacktoberfest AWS 2025** to solve **Issue #10**: Creating a gamified personal finance tracker that makes budgeting engaging for young adults.

### Requirements Met ✅
- ✅ User Dashboard with financial overview
- ✅ Transaction Management with categorization
- ✅ Budget and Goal Setting with progress tracking
- ✅ Gamification Engine (points, levels, leaderboards)
- ✅ Data Visualization with interactive charts
- ✅ Secure Authentication (Clerk OAuth)
- ✅ Responsive Design (Mobile-first)
- ✅ Data Export (CSV/PDF)

---

## 👨‍💻 Developer

**Muhammad Tayyab**  
Team Quark AI  
Hacktoberfest AWS 2025

---

## 📄 License

This project is part of the Hacktoberfest AWS 2025 open-source initiative.

---

## 🙏 Acknowledgments

- **AWS** for hosting Hacktoberfest 2025
- **Clerk** for authentication services
- **Supabase** for real-time database and storage
- **Google Gemini** for AI capabilities
- **Expo** for the amazing React Native framework

---

**Made with ❤️ by Team Quark AI**

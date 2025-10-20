# FinanceQuest 💰

A professional, modern personal finance management application built with React and TypeScript. FinanceQuest helps you track expenses, monitor savings goals, and gamify your financial journey with achievements and progress tracking.

## ✨ Features

### 📊 Financial Dashboard
- **Real-time Balance Tracking**: Monitor your current balance with professional card displays
- **Transaction Management**: Add, categorize, and track all your financial transactions
- **Spending Analytics**: Visual pie charts showing expense distribution by category
- **Financial Goals**: Set and track savings targets with progress indicators

### 🎮 Gamification Elements
- **Achievement System**: Unlock badges for reaching financial milestones
- **Progress Tracking**: Visual progress bars for savings goals and spending targets
- **Points System**: Earn points for positive financial behaviors

### 🎨 Professional Design
- **Monochrome Theme**: Clean, professional black and white color scheme
- **Responsive Layout**: Optimized for desktop and mobile devices
- **Modern UI Components**: Built with shadcn/ui for consistency and accessibility
- **Smooth Animations**: Framer Motion powered transitions and interactions

### 🔐 Secure Authentication
- **Clerk Integration**: Enterprise-grade authentication and user management
- **Protected Routes**: Secure access to financial data
- **User Profiles**: Personalized dashboard experience

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn package manager
- Clerk account for authentication

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd money-mastery-play
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env.local` file in the root directory:
   ```env
   VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key_here
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open in browser**
   Navigate to `http://localhost:5173`

## 🛠️ Technology Stack

### Core Framework
- **React 18** - Modern React with hooks and concurrent features
- **TypeScript** - Type-safe development experience
- **Vite** - Fast build tool and development server

### UI & Styling
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - High-quality, accessible UI components
- **Framer Motion** - Smooth animations and transitions
- **Lucide React** - Beautiful, customizable icons

### Data Visualization
- **Recharts** - Responsive charting library for React
- **Custom Chart Components** - Tailored financial data visualizations

### Authentication & Security
- **Clerk** - Complete authentication and user management
- **Protected Routes** - Secure application access

### Development Tools
- **ESLint** - Code linting and quality enforcement
- **PostCSS** - CSS processing and optimization
- **TypeScript Configuration** - Strict type checking

## 📁 Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── ui/              # shadcn/ui components
│   ├── features/        # Feature-specific components
│   └── layout/          # Layout components
├── hooks/               # Custom React hooks
├── lib/                 # Utility functions and configurations
├── pages/               # Route components
├── styles/              # Global styles and themes
└── types/               # TypeScript type definitions
```

## 🎯 Key Components

### Dashboard
The main hub displaying financial overview, recent transactions, and key metrics.

### Transaction Management
- Add new transactions with category selection
- Real-time balance updates
- Transaction history with filtering options

### Analytics
- Spending breakdown by category
- Monthly and yearly financial trends
- Visual progress tracking

### Savings Tracker
- Set and monitor savings goals
- Visual progress indicators
- Achievement notifications

## 🔧 Configuration

### Clerk Authentication Setup
1. Create a Clerk application at [clerk.com](https://clerk.com)
2. Copy your publishable key to the environment variables
3. Configure allowed redirect URLs in your Clerk dashboard

### Customization
The application uses a professional monochrome design system that can be customized in:
- `src/styles/theme.ts` - Theme configuration
- `tailwind.config.ts` - Tailwind CSS customization
- Component-level styling for specific adjustments

## 🚀 Deployment

### Development
```bash
npm run dev
```

### Production Build
```bash
npm run build
npm run preview
```

### Deploy to Popular Platforms
1. **Vercel**: Connect your repository and deploy automatically
2. **Netlify**: Drag and drop your `dist` folder or connect via Git
3. **GitHub Pages**: Use GitHub Actions for automated deployment

Make sure to set your environment variables in your deployment platform's dashboard.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Check the documentation above
- Review existing issues in the repository
- Create a new issue with detailed information

---

**FinanceQuest** - Transform your financial management with professional tools and gamified progress tracking.

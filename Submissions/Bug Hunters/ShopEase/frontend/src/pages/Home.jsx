import React from "react";
import { motion } from "framer-motion";
import { 
  ArrowRight, 
  BarChart3, 
  Shield, 
  Zap, 
  ShoppingCart,
  Sparkles, 
  TrendingUp, 
  CheckCircle
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import AuthModal from "../components/AuthModal";

export default function Home() {
  const { user } = useAuth();
  const [authOpen, setAuthOpen] = React.useState(false);

  const features = [
    { icon: <BarChart3 className="w-5 h-5" />, title: "Real-time Analytics", description: "Live sales tracking and insights" },
    { icon: <Shield className="w-5 h-5" />, title: "Secure & Reliable", description: "Enterprise-grade security" },
    { icon: <Zap className="w-5 h-5" />, title: "Lightning Fast", description: "Optimized performance" },
    { icon: <ShoppingCart className="w-5 h-5" />, title: "Smart Inventory", description: "Automated stock management" }
  ];

  const benefits = [
    "Increase sales by up to 40%",
    "Reduce inventory costs by 30%",
    "Real-time business insights",
    "Mobile-friendly interface"
  ];

  const handleGetStarted = () => {
    if (user) {
      window.location.href = user.user.role === "admin" ? "/dashboard" : "/sales";
    } else {
      setAuthOpen(true);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <section className="pt-28 sm:pt-32 pb-16 sm:pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

            {/* Left side - Text content */}
            <motion.div
              className="text-center lg:text-left"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-4 py-2 rounded-full text-sm font-medium mb-8"
              >
                <TrendingUp className="w-4 h-4" />
                Trusted by 10,000+ businesses
              </motion.div>

              <motion.h1
                className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.8 }}
              >
                Streamline Your{" "}
                <span className="block bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                  Retail Operations
                </span>
              </motion.h1>

              <motion.p
                className="text-lg sm:text-xl text-gray-300 mb-8 leading-relaxed max-w-2xl mx-auto lg:mx-0"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.8 }}
              >
                AI-powered inventory management and sales tracking platform designed to help you focus on growing your business.
              </motion.p>

              {/* Benefits */}
              <motion.div
                className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.8 }}
              >
                {benefits.map((benefit) => (
                  <div key={benefit} className="flex items-center gap-3 text-gray-300">
                    <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                    <span className="text-sm sm:text-base">{benefit}</span>
                  </div>
                ))}
              </motion.div>

              {/* Buttons */}
              <motion.div
                className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9, duration: 0.8 }}
              >
                <button 
                  onClick={handleGetStarted}
                  className="group bg-emerald-600 text-white px-6 sm:px-8 py-3 rounded-xl font-semibold text-base sm:text-lg hover:bg-emerald-700 transition-all duration-300 hover:scale-105 flex items-center justify-center gap-3 shadow-2xl shadow-emerald-600/25 w-full sm:w-auto"
                >
                  {user ? "Go to Dashboard" : "Start Free Trial"}
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
                <button className="group border border-gray-600 text-gray-300 px-6 sm:px-8 py-3 rounded-xl font-semibold text-base sm:text-lg hover:border-gray-500 hover:bg-gray-800/50 transition-all duration-300 w-full sm:w-auto">
                  View Demo
                </button>
              </motion.div>
            </motion.div>

            {/* Right side - Feature cards */}
            <motion.div
              className="relative"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              <div className="relative">
                <div className="absolute -top-20 -right-20 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl"></div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {features.map((feature, index) => (
                    <motion.div
                      key={feature.title}
                      className="bg-gray-800/50 border border-gray-700 rounded-2xl p-6 backdrop-blur-sm hover:border-emerald-500/30 hover:bg-gray-800/70 transition-all duration-300 group"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.7 + index * 0.1, duration: 0.5 }}
                      whileHover={{ scale: 1.05 }}
                    >
                      <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                        {feature.icon}
                      </div>
                      <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                      <p className="text-gray-400 text-sm leading-relaxed">{feature.description}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />
    </div>
  );
}

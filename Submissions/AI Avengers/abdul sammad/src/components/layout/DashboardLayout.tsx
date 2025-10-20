import { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface DashboardLayoutProps {
  children: ReactNode;
  className?: string;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

export const DashboardLayout = ({ children, className = '' }: DashboardLayoutProps) => {
  return (
    <motion.div
      className={`min-h-screen bg-gradient-to-b from-background to-background/50 ${className}`}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-8">{children}</div>
      </div>
    </motion.div>
  );
};
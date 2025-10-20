import { motion } from 'framer-motion';
import { Card } from './card';
import { LucideIcon } from 'lucide-react';
import CountUp from 'react-countup';

interface StatCardProps {
  title: string;
  value: number;
  icon: LucideIcon;
  trend?: {
    value: number;
    label: string;
    isPositive: boolean;
  };
  prefix?: string;
  suffix?: string;
  delay?: number;
  progress?: {
    value: number;
    max: number;
    color: string;
  };
}

const fadeInUp = {
  initial: { y: 20, opacity: 0 },
  animate: { y: 0, opacity: 1 },
};

export const StatCard = ({
  title,
  value,
  icon: Icon,
  trend,
  prefix = '',
  suffix = '',
  delay = 0,
  progress,
}: StatCardProps) => {
  const IconComponent = Icon;

  return (
    <motion.div
      {...fadeInUp}
      transition={{ delay, duration: 0.5 }}
    >
      <Card className="p-6 hover:shadow-lg transition-shadow duration-300 card-hover">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">{title}</p>
            <p className="text-3xl font-bold">
              {prefix}<CountUp end={value} separator="," duration={2} />{suffix}
            </p>
            {trend && (
              <motion.div 
                className={`flex items-center text-foreground`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: delay + 0.2 }}
              >
                <span className="font-medium text-sm">
                  {trend.label}
                </span>
              </motion.div>
            )}
          </div>
          <div className={`p-3 rounded-xl bg-zinc-100 dark:bg-zinc-800`}>
            <IconComponent className={`w-6 h-6 text-zinc-700 dark:text-zinc-300`} />
          </div>
        </div>
        {progress && (
          <div className="mt-4">
            <div className="h-2 bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden">
              <motion.div
                className={`h-full ${progress.color}`}
                initial={{ width: "0%" }}
                animate={{ width: `${Math.min((progress.value / progress.max) * 100, 100)}%` }}
                transition={{ duration: 1, delay: delay + 0.5, ease: "easeOut" }}
              />
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              {((progress.value / progress.max) * 100).toFixed(0)}% of target
            </p>
          </div>
        )}
      </Card>
    </motion.div>
  );
};
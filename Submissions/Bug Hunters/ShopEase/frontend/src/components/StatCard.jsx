import { motion } from "framer-motion";

export default function StatCard({ title, value, icon }) {
  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      className="bg-gray-800 p-6 rounded-2xl shadow-md flex items-center justify-between"
    >
      <div>
        <p className="text-gray-400 text-sm">{title}</p>
        <h3 className="text-2xl font-bold text-emerald-400">{value}</h3>
      </div>
      <div className="text-emerald-500">{icon}</div>
    </motion.div>
  );
}

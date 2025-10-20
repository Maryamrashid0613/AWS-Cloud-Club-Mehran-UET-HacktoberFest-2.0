import React from "react";
import { motion } from "framer-motion";
import { Heart, Code, Coffee, Users } from "lucide-react";

export default function Footer() {
  const teamMembers = [
    { name: "Raza Abbas", role: "Full Stack Developer" },
    { name: "Siraj Ansari", role: "Frontend Specialist" },
    { name: "Abdul Majid", role: "Backend Engineer" }
  ];

  return (
    <footer className="bg-gradient-to-b from-gray-900 to-gray-800 border-t border-gray-700 mt-20">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Team Section */}
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center justify-center gap-2 mb-6">
            <Users className="w-5 h-5 text-emerald-400" />
            <h3 className="text-xl font-bold text-white">Development Team</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {teamMembers.map((member, index) => (
              <motion.div
                key={member.name}
                className="bg-gray-800/50 border border-gray-700 rounded-2xl p-6 hover:border-emerald-500/30 transition-all duration-300 hover:scale-105"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
              >
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <span className="text-white font-bold text-lg">
                    {member.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <h4 className="text-white font-semibold text-lg mb-2">{member.name}</h4>
                <p className="text-emerald-400 text-sm">{member.role}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Built With Love Section */}
        <motion.div 
          className="text-center mb-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <div className="flex items-center justify-center gap-4 mb-4">
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <Code className="w-6 h-6 text-blue-400" />
            </motion.div>
            <motion.div
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }}
            >
              <Heart className="w-6 h-6 text-red-400 fill-red-400" />
            </motion.div>
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: 1 }}
            >
              <Coffee className="w-6 h-6 text-amber-400" />
            </motion.div>
          </div>
          <p className="text-gray-300 text-lg">
            Built with passion and countless cups of coffee
          </p>
        </motion.div>

        {/* Tech Stack */}
        <motion.div 
          className="text-center mb-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="flex flex-wrap justify-center gap-4 mb-4">
            {['React', 'Node.js', 'MongoDB', 'Tailwind CSS', 'Express'].map((tech) => (
              <span 
                key={tech}
                className="px-4 py-2 bg-gray-700/50 text-gray-300 rounded-full text-sm border border-gray-600 hover:border-emerald-500/30 transition-colors"
              >
                {tech}
              </span>
            ))}
          </div>
        </motion.div>

        {/* Copyright */}
        <motion.div 
          className="text-center border-t border-gray-700 pt-8"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <p className="text-gray-400 text-sm">
            © {new Date().getFullYear()} <span className="text-emerald-400 font-semibold">ShopEase</span>. All rights reserved.
          </p>
          <p className="text-gray-500 text-xs mt-2">
            Streamlining retail operations for modern businesses
          </p>
        </motion.div>
      </div>

      {/* Decorative Elements */}
      <div className="relative">
        <div className="absolute bottom-0 left-0 w-20 h-20 bg-emerald-500/10 rounded-full blur-xl"></div>
        <div className="absolute bottom-0 right-0 w-20 h-20 bg-blue-500/10 rounded-full blur-xl"></div>
      </div>
    </footer>
  );
}
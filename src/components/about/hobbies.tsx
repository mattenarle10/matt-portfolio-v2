'use client';

import { motion } from 'framer-motion';
import { YoutubeIcon, FitnessIcon, CodeIcon, CoffeeIcon } from '@/styles/icons';

const Hobbies = () => {
  const hobbies = [
    {
      title: "Brain-Rot",
      description: "YouTube fitness gurus 💪, Netflix tech docs 📺, and K-drama marathons 🇰🇷",
      icon: <YoutubeIcon className="text-red-500" />,
      iconColor: "text-red-500"
    },
    {
      title: "Hybrid Training!",
      description: "Crushing PRs with running 🏃‍♂️ + strength training combos 🏋️‍♂️",
      icon: <FitnessIcon className="text-blue-500" />,
      iconColor: "text-blue-500"
    },
    {
      title: "Shipping Code (trying)",
      description: "Building slick web/mobile apps with React ⚛️ & Next.js magic ✨",
      icon: <CodeIcon className="text-green-500" />,
      iconColor: "text-green-500"
    },
    {
      title: "Caffeine Explorer",
      description: "Hunting for the perfect matcha latte 🍵 and pour-over coffee ☕",
      icon: <CoffeeIcon className="text-amber-500" />,
      iconColor: "text-amber-500"
    }
  ];

  return (
    <div className="mt-12 mb-12">
      <h2 className="text-base font-medium mb-6 tracking-wide">Hobbies</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {hobbies.map((hobby, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="group relative pl-8"
            whileHover={{ scale: 1.02, x: 2 }}
          >
            {/* Icon */}
            <div className="absolute left-0 top-0.5 group-hover:scale-110 transition-transform duration-300">
              {hobby.icon}
            </div>
            
            {/* Content */}
            <div>
              <h3 className={`font-medium text-sm group-hover:${hobby.iconColor} transition-colors duration-300`}>
                {hobby.title}
              </h3>
              <p className="text-xs font-light mt-1 opacity-80 group-hover:opacity-100 transition-all duration-300">
                {hobby.description}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Hobbies;
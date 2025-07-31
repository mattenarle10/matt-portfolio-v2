'use client';

import { motion } from 'framer-motion';

const Education = () => {
  const education = [
    {
      school: "University of St. La Salle",
      degree: "Master of Business Administration - MBA",
      date: "Jul 2025",
      details: "with Thesis"
    },
    {
      school: "West Visayas State University",
      degree: "Bachelor's degree, Computer Science",
      date: "Aug 2021 - Jun 2025",
      details: "Grade: 1.34 (Magna Cum Laude)"
    },
    {
      school: "University of St. La Salle",
      degree: "High School Diploma",
      date: "2008 - 2020",
      details: "That fun, High-School Life"
    }
  ];

  return (
    <div className="mt-12 mb-12">
      <h2 className="text-base font-medium mb-4 tracking-wide">Education</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {education.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="group relative pl-4 border-l border-gray-200 dark:border-gray-800"
            whileHover={{ x: 2 }}
          >
            <div className="absolute -left-1 top-1 w-2 h-2 rounded-full bg-black dark:bg-white group-hover:scale-125 transition-transform duration-300"></div>
            
            <h3 className="text-sm font-medium group-hover:tracking-wide transition-all duration-300">
              {item.school}
            </h3>
            <div className="flex items-center space-x-1 mt-1">
              <p className="text-xs font-light">{item.degree}</p>
              <span className="text-xs opacity-50">•</span>
              <p className="text-xs opacity-70">{item.date}</p>
            </div>
            <p className="text-xs opacity-80 mt-1 leading-relaxed">{item.details}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Education;
'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const Education = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [activeEduIndex, setActiveEduIndex] = useState<number | null>(null);
  
  // Check if device is mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  // Handle click outside to reset active education item
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.education-item')) {
        setActiveEduIndex(null);
      }
    };
    
    if (isMobile) {
      document.addEventListener('click', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [isMobile]);
  
  // Handle education item click for mobile
  const handleEduClick = (index: number) => {
    if (isMobile) {
      setActiveEduIndex(activeEduIndex === index ? null : index);
    }
  };
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
            animate={{ 
              opacity: 1, 
              y: 0,
              x: isMobile && activeEduIndex === index ? 2 : 0
            }}
            transition={{ delay: index * 0.1 }}
            className="education-item group relative pl-4 border-l border-gray-200 dark:border-gray-800"
            whileHover={!isMobile ? { x: 2 } : undefined}
            onClick={() => handleEduClick(index)}
          >
            <div className={`absolute -left-1 top-1 w-2 h-2 rounded-full bg-black dark:bg-white transition-transform duration-300 ${(isMobile && activeEduIndex === index) || (!isMobile && 'group-hover:scale-125') ? 'scale-125' : ''}`}></div>
            
            <h3 className={`text-sm font-medium transition-all duration-300 ${(isMobile && activeEduIndex === index) || (!isMobile && 'group-hover:tracking-wide') ? 'tracking-wide' : ''}`}>
              {item.school}
            </h3>
            <div className="flex items-center space-x-1 mt-1">
              <p className="text-xs font-light">{item.degree}</p>
              <span className="text-xs opacity-50">•</span>
              <p className="text-xs opacity-70">{item.date}</p>
            </div>
            <p className={`text-xs mt-1 leading-relaxed transition-opacity duration-300 ${(isMobile && activeEduIndex === index) || (!isMobile && 'group-hover:opacity-100') ? 'opacity-100' : 'opacity-80'}`}>{item.details}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Education;
'use client'
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, Heart } from 'lucide-react';

const Hello = () => {
  const [text, setText] = useState('');
  const fullText = 'hello... Matt here!';
  
  useEffect(() => {
    let currentIndex = 0;
    const typingInterval = setInterval(() => {
      if (currentIndex <= fullText.length) {
        setText(fullText.slice(0, currentIndex));
        currentIndex++;
      } else {
        clearInterval(typingInterval);
      }
    }, 100); // Speed of typing
    
    return () => clearInterval(typingInterval);
  }, []);
  return (
    <section className="pt-2 pb-6 md:pt-6 md:pb-8">
      <div className="text-left md:max-w-2xl">
        <h1 className="text-3xl md:text-4xl font-light mb-4 tracking-tight">
          <span>{text}</span>
          <motion.span 
            className="text-blue-500 inline-block"
            animate={{ opacity: [1, 0] }}
            transition={{ repeat: Infinity, duration: 0.8, repeatType: "reverse" }}
          >|</motion.span>
        </h1>
        
        <motion.p 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.8, duration: 0.8 }}
          className="text-sm md:text-base text-black dark:text-gray-300 mb-4 leading-relaxed font-light">
          cloud engineer by day, endurance athlete by night, mba + startup in between — 
          <span className="text-blue-500 dark:text-blue-400">the ultimate side quest</span>. also a <a 
            href="https://www.instagram.com/heartescaro/" 
            className="text-pink-500 hover:text-pink-600 dark:text-pink-400 dark:hover:text-pink-300 inline-flex items-center gap-0.5 border-b border-transparent hover:border-pink-500 dark:hover:border-pink-400 transition-colors duration-200"
            target="_blank"
            rel="noopener noreferrer"
          >
            @heartescaro <Heart className="w-3 h-3 inline" />
          </a> stan.
        </motion.p>
        
        <motion.div 
          className="mt-5 flex space-x-6"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.2, duration: 0.8 }}
        >
          <motion.a 
            href="#" 
            className="text-blue-300 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 font-light text-base border-b border-transparent hover:border-blue-500 dark:hover:border-blue-400 pb-0.5 transition-all duration-200 flex items-center gap-1"
            whileHover={{ scale: 1.03 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
            target="_blank"
            rel="noopener noreferrer"
          >
            Projects
            <ArrowUpRight className="w-3.5 h-3.5" />
          </motion.a>
          <motion.a 
            href="/resume.pdf" 
            className="text-black hover:text-gray-600 dark:text-gray-300 dark:hover:text-gray-100 font-light text-base border-b border-transparent hover:border-gray-600 dark:hover:border-gray-300 pb-0.5 transition-all duration-200 flex items-center gap-1"
            whileHover={{ scale: 1.03 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
            target="_blank"
            rel="noopener noreferrer"
          >
            Resume
            <ArrowUpRight className="w-3.5 h-3.5" />
          </motion.a>
          
        </motion.div>
      </div>
    </section>
  );
};

export default Hello;

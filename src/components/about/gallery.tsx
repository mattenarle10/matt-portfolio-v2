'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

const Gallery = () => {
  const images = [
    {
      src: '/about/matt-grad.png',
      alt: 'Matt at graduation',
      description: 'Graduation day - ready to take on new challenges!'
    },
    {
      src: '/about/matt-heart.png',
      alt: 'Matt with Heart',
      description: 'Spending quality time with the people who matter most'
    },
    {
      src: '/about/matt-run.png',
      alt: 'Matt running',
      description: 'Finding peace and pushing limits through running'
    },
    {
      src: '/about/matt-viet.png',
      alt: 'Matt in Vietnam',
      description: 'Exploring new cultures and creating memories abroad'
    }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 my-6">
      {images.map((image, index) => (
        <motion.div 
          key={index}
          className="relative overflow-hidden rounded-md group cursor-pointer"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
          whileHover={{ y: -5 }}
        >
          <div className="aspect-square relative">
            <Image 
              src={image.src} 
              alt={image.alt}
              fill
              sizes="(max-width: 768px) 50vw, 25vw"
              className="object-cover rounded-md transition-transform duration-300 group-hover:scale-105"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3">
            <p className="text-white text-xs font-light">{image.description}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default Gallery;
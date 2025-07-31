'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

const Gallery = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [imageZIndexes, setImageZIndexes] = useState([1, 2, 3, 4]);
  const [activeImageIndex, setActiveImageIndex] = useState<number | null>(null);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Randomize z-indexes on client-side only
  useEffect(() => {
    if (isMobile) {
      const shuffled = [...imageZIndexes]
        .sort(() => Math.random() - 0.5);
      setImageZIndexes(shuffled);
    }
  }, [isMobile, imageZIndexes]);
  
  // Handle click outside to reset active image
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.gallery-image')) {
        setActiveImageIndex(null);
      }
    };
    
    if (isMobile) {
      document.addEventListener('click', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [isMobile]);
  
  // Handle image click for mobile
  const handleImageClick = (index: number) => {
    if (isMobile) {
      setActiveImageIndex(activeImageIndex === index ? null : index);
      
      // Update z-index to bring selected image to front
      if (activeImageIndex !== index) {
        const newZIndexes = [...imageZIndexes];
        const currentIndex = newZIndexes.indexOf(Math.max(...newZIndexes));
        [newZIndexes[currentIndex], newZIndexes[index]] = [newZIndexes[index], newZIndexes[currentIndex]];
        setImageZIndexes(newZIndexes);
      }
    }
  };

  const images = [
    {
      src: '/about/matt-grad.png',
      alt: 'Matt at graduation',
      description: 'Graduation day - ready to take on new challenges!',
      rotate: '-3deg',
      mobilePosition: { top: '5%', left: '0%' }
    },
    {
      src: '/about/matt-heart.png',
      alt: 'Matt with Heart',
      description: 'Spending quality time with the people who matter most',
      rotate: '2deg',
      mobilePosition: { top: '2%', left: '40%' }
    },
    {
      src: '/about/matt-run.png',
      alt: 'Matt running',
      description: 'Finding peace and pushing limits through running',
      rotate: '-2deg',
      mobilePosition: { top: '45%', left: '5%' }
    },
    {
      src: '/about/matt-viet.png',
      alt: 'Matt in Vietnam',
      description: 'Exploring new cultures and creating memories abroad',
      rotate: '3deg',
      mobilePosition: { top: '42%', left: '45%' }
    }
  ];

  return (
    <div className="relative h-[280px] md:h-[260px] my-4 mx-auto max-w-[340px] md:max-w-[600px]">
      {images.map((image, index) => (
        <motion.div 
          key={index}
          className="absolute cursor-pointer"
          style={{
            rotate: image.rotate,
            zIndex: isMobile ? imageZIndexes[index] : index + 1,
            ...(isMobile ? {
              top: image.mobilePosition.top,
              left: image.mobilePosition.left,
              width: '65%',
              maxWidth: '180px'
            } : {
              left: `${index * 22}%`,
              top: `${index % 2 === 0 ? 5 : 0}%`,
              width: '70%',
              maxWidth: '180px'
            })
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.15 }}
          whileHover={{ 
            rotate: '0deg', 
            scale: 1.05, 
            zIndex: 10,
            transition: { duration: 0.2 }
          }}
        >
          <div className="relative aspect-[3/4] shadow-sm rounded-md overflow-hidden border border-white/50">
            <Image 
              src={image.src} 
              alt={image.alt}
              fill
              sizes="(max-width: 768px) 45vw, 180px"
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-end p-2">
              <p className="text-white text-[10px] md:text-xs font-light">{image.description}</p>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default Gallery;
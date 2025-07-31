'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

const Gallery = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState<number | null>(null);
  const [imageOrder, setImageOrder] = useState([0, 1, 2, 3]);
  const [isDragging, setIsDragging] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  
  // Refs for image elements to detect overlaps
  const imageRefs = useRef<(HTMLDivElement | null)[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (isMobile) {
      // Randomize image order on mobile
      const shuffled = [0, 1, 2, 3].sort(() => Math.random() - 0.5);
      setImageOrder(shuffled);
    } else {
      // Reset to default order on desktop
      setImageOrder([0, 1, 2, 3]);
    }
  }, [isMobile]);
  
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
    if (isMobile && !isDragging) {
      // If clicking the same image, deactivate it
      if (activeImageIndex === index) {
        setActiveImageIndex(null);
      } else {
        // Otherwise activate the new image
        setActiveImageIndex(index);
      }
    }
  };
  
  // Handle drag start
  const handleDragStart = (index: number) => {
    setIsDragging(true);
    setDraggedIndex(index);
  };
  
  // Handle drag end
  const handleDragEnd = (index: number, info: { offset: { x: number; y: number } }) => {
    setIsDragging(false);
    
    // Find which image we're hovering over
    if (draggedIndex !== null) {
      const draggedRect = imageRefs.current[index]?.getBoundingClientRect();
      
      if (draggedRect) {
        const centerX = draggedRect.left + draggedRect.width / 2 + info.offset.x;
        const centerY = draggedRect.top + draggedRect.height / 2 + info.offset.y;
        
        // Find which image we're hovering over
        let targetIndex = -1;
        imageRefs.current.forEach((ref, i) => {
          if (i !== index && ref) {
            const rect = ref.getBoundingClientRect();
            if (
              centerX >= rect.left &&
              centerX <= rect.right &&
              centerY >= rect.top &&
              centerY <= rect.bottom
            ) {
              targetIndex = i;
            }
          }
        });
        
        // Swap positions if we found a target
        if (targetIndex !== -1) {
          const newOrder = [...imageOrder];
          const draggedOrderIndex = imageOrder.indexOf(index);
          const targetOrderIndex = imageOrder.indexOf(targetIndex);
          
          // Swap the positions
          [newOrder[draggedOrderIndex], newOrder[targetOrderIndex]] = 
            [newOrder[targetOrderIndex], newOrder[draggedOrderIndex]];
          
          setImageOrder(newOrder);
        }
      }
    }
    
    setDraggedIndex(null);
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
    <div ref={containerRef} className="relative h-[280px] md:h-[260px] my-4 mx-auto max-w-[340px] md:max-w-[600px]">
      {imageOrder.map((orderIndex, i) => {
        const image = images[orderIndex];
        return (
          <motion.div 
            key={orderIndex}
            ref={(el) => { imageRefs.current[orderIndex] = el; }}
            className="gallery-image absolute cursor-pointer"
            style={{
              rotate: isMobile && activeImageIndex === orderIndex ? '0deg' : image.rotate,
              zIndex: isMobile && activeImageIndex === orderIndex ? 10 : (isMobile ? i + 1 : orderIndex + 1),
              ...(isMobile ? {
                top: image.mobilePosition.top,
                left: image.mobilePosition.left,
                width: '65%',
                maxWidth: '180px',
                transform: activeImageIndex === orderIndex ? 'scale(1.05)' : 'scale(1)'
              } : {
                left: `${orderIndex * 22}%`,
                top: `${orderIndex % 2 === 0 ? 5 : 0}%`,
                width: '70%',
                maxWidth: '180px'
              }),
              transition: isDragging && draggedIndex === orderIndex ? 'none' : 'transform 0.3s ease, rotate 0.3s ease, top 0.3s ease, left 0.3s ease'
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: i * 0.15 }}
            whileHover={!isMobile ? { 
              rotate: '0deg', 
              scale: 1.05, 
              zIndex: 10,
              transition: { duration: 0.2 }
            } : undefined}
            drag={isMobile}
            dragConstraints={{
              top: -50,
              left: -50,
              right: 50,
              bottom: 50
            }}
            dragElastic={0.1}
            dragMomentum={false}
            onDragStart={() => handleDragStart(orderIndex)}
            onDragEnd={(_, info) => handleDragEnd(orderIndex, info)}
            onClick={() => handleImageClick(orderIndex)}
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
      );
      })}
    </div>
  );
};

export default Gallery;
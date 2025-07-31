'use client';

import { motion } from 'framer-motion';

const Experiences = () => {
  const experiences = [
    {
      company: "Junior Cloud Engineer",
      dates: "July 2025 - Present",
      location: "eCloudvalley Philippines, Hybrid",
      description: "Contributing to the development and deployment of cloud-based solutions in a collaborative team environment."
    },
    {
      company: "Cloud Engineer Intern",
      dates: "April 2025 - May 2025",
      location: "eCloudvalley Philippines, Remote",
      description: "Gained hands-on experience with AWS services and cloud infrastructure through intensive training program."
    },
    {
      company: "Software Engineer Intern",
      dates: "February 2025 - May 2025",
      location: "Spring Valley Tech Corp, Bago City",
      description: "Participated in immersive on-the-job training designed for real-world client project readiness."
    },
    {
      company: "Freelance Software Developer",
      dates: "October 2022 - Present",
      location: "Various clients (Remote)",
      description: "Developed diverse projects for schools, students, and private clients, showcasing expertise in web and mobile development."
    }
  ];

  return (
    <div className="mt-8 mb-12">
      <h2 className="text-base font-medium mb-6 tracking-wide">Experience</h2>
      <div className="space-y-6 md:space-y-6 space-y-0">
        {experiences.map((experience, index) => (
          <motion.div 
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="group relative pl-6 md:pl-8"
            whileHover={{ x: 4 }}
          >
            {/* Timeline dot */}
            <div className="absolute left-0 top-1.5 w-2 h-2 rounded-full bg-black dark:bg-white group-hover:scale-150 transition-transform duration-300"></div>
            
            {/* Content */}
            <div className="pb-4">
              <div className="flex flex-col md:flex-row md:items-baseline md:justify-between mb-1">
                <h3 className="font-medium text-sm tracking-tight group-hover:tracking-wide transition-all duration-300">{experience.company}</h3>
                <span className="text-xs font-light">{experience.dates}</span>
              </div>
              <div className="text-xs mb-2 font-light">
                <span>{experience.location}</span>
              </div>
              <div className="flex">
                <span className="mr-2 w-1 h-1 mt-1.5 rounded-full bg-black dark:bg-white group-hover:w-1.5 group-hover:h-1.5 transition-all duration-300"></span>
                <p className="text-xs font-light opacity-80 group-hover:opacity-100 transition-opacity duration-300">{experience.description}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Experiences;
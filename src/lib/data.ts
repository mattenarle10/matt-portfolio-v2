import { Project } from '@/lib/project';

export const projectData: Project[] = [
  {
    title: "SHEA-A (School Health Emergency Alert - Application)",
    slug: "shea-a",
    date: "January 2025 - March 2025",
    description: "Developed a Flutter-based mobile app for school health emergencies with Firebase Authentication and Firestore for Real-time Database, equipped with Google Maps API for location tracking.",
    image: "/projects/Projects_SHEA_A.png",
    github: "https://github.com/mattenarle10/SHEA-A",
    technologies: ["Flutter", "Firebase", "Google Maps API"]
  },
  {
    title: "Road Eye (AI-Driven Road Damage Detection)",
    slug: "roadeye",
    date: "December 2024",
    description: "Developed a machine learning system to detect road cracks using SSD models for automated analysis.",
    image: "/projects/Projects_RoadEye.png",
    github: "https://github.com/mattenarle10/roadeye",
    demo: "https://colab.research.google.com/drive/1zdKmjmkxz1W3QuRaQCJV5rVl1WHJbVD2",
    pdf: "/roadeye.pdf",
    technologies: ["Python", "AI"]
  },
  {
    title: "Reserba",
    slug: "reserba",
    date: "October - December 2024",
    description: "A platform for food stall reservations with web, mobile, and admin interfaces using MySQL and Flutter.",
    image: "/projects/Projects_Reserba.png",
    github: [
        "https://github.com/mattenarle10/reserba-web",
        "https://github.com/mattenarle10/reserba-mobile"
      ],
    technologies: ["MySQL", "PHP", "Flutter", "HTML", "CSS"]
  },
  {
    title: "Elderly Digital Steps",
    slug: "elderly-digital-steps",
    date: "October - December 2024",
    description: "A learning platform for elderly learners and tutors with booking and quiz features.",
    image: "/projects/Projects_EDS.png",
    github: [
        "https://github.com/mattenarle10/eds-admin",
        "https://github.com/mattenarle10/eds-mobile"
      ],
    technologies: ["MySQL", "PHP", "Flutter", "HTML", "CSS"]
  },
  {
    title: "NeuroWarn BCI (Thesis)",
    slug: "neurowarn-bci",
    date: "January - December 2024",
    description: "Enhanced safety in EEG-controlled wheelchairs using RNN for smart warning systems.",
    image: "/projects/Projects_Neurowarn.png",
    technologies: ["RNN", "AI", "EEG"]
  },
  {
    title: "Off the Grid",
    slug: "off-the-grid",
    date: "April - July 2024",
    description: "Hike tracking app for mountaineers, leveraging Google Maps API and Firebase.",
    image: "/projects/Projects_OTG.png",
    github: "https://github.com/mattenarle10/offthegrid",
    technologies: ["Google Maps API", "Firebase", "Java"]
  },
  {
    title: "Senyas",
    slug: "senyas",
    date: "March - May 2024",
    description: "Centralized disaster response system integrating sensors, Wi-Fi modules, and mobile app notifications.",
    image: "/projects/Projects_Senyas.png",
    github: "https://github.com/mattenarle10/senyas",
    technologies: ["Java", "Firebase"]
  },
  {
    title: "EzPark",
    slug: "ezpark",
    date: "April - May 2023",
    description: "Developed a Flutter-based parking reservation app for the Lasalle area, utilizing Hive as the database.",
    image: "/projects/Projects_Ezpark.png",
    github: "https://github.com/mattenarle10/EzPark",
    technologies: ["Flutter"]
  },
  {
    title: "Dr. Rodolfo T. Blancia Infirmary",
    slug: "rodolfo-infirmary",
    date: "December 2022 - January 2023",
    description: "Designed a Google Sites website showcasing hospital information and services based in Kabankalan City.",
    image: "/projects/Projects_Rodolfo.png",
    demo: "https://sites.google.com/view/drrodolfotblanciainfirmary/home",
    technologies: ["HTML"]
  },
  {
    title: "Brgy. Mandalagan - Community Website",
    slug: "mandalagan-website",
    date: "March - July 2022",
    description: "Built a Google Sites-based community website integrated with Google My Maps for interactive features.",
    image: "/projects/Projects_Mandalagan.png",
    demo: "https://sites.google.com/view/brgymandalaganmdrc/home",
    technologies: ["HTML", "Google Maps API"]
  },
  {
    title: "Anik.3D",
    slug: "anik3d",
    date: "April 2025",
    description: "Anik.3D was created for the eCloudValley Serverless Workshop Internship. It's a platform for purchasing high-quality 3D figurines, serving as both a customer-facing storefront and an admin management tool.\n\n Won Best Group • Awarded Top Cloud Intern.",
    image: "/projects/Projects_Anik.png",
    demo: "https://main.dpzbu1pkrairq.amplifyapp.com/",
    manual: "https://anik3d-manual.vercel.app/main",
    github: "https://github.com/mattenarle10/anik.3d",
    technologies: ["Next.js", "AWS Amplify", "S3", "DynamoDB", "Three.js"]
  }
];

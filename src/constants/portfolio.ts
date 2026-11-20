type Certification = {
  title: string
  issuer: string
  period?: string
  image: string
  url: string
}

export const certifications: Certification[] = [
  {
    title: "AWS Certified Solutions Architect - Associate",
    issuer: "Amazon Web Services",
    period: "Issued: Nov 2026",
    image: "/about/aws-certified-solutions-architect-associate.png",
    url: "https://www.credly.com/badges/9fe42bba-8dd7-401e-85a6-249b13928b4e/public_url",
  },
  {
    title: "GitLab Solutions Architect Core Verified Associate",
    issuer: "GitLab",
    image: "/about/gitlab-solutions-architect-core-verified-associate.png",
    url: "https://www.credly.com/badges/9f1e71f0-9055-4f79-8eb4-5444a8da65fc",
  },
  {
    title: "HashiCorp Certified: Terraform Associate (004)",
    issuer: "IBM Professional Certification",
    period: "Issued: Oct 2026",
    image: "/about/hashicorp-certified-terraform-associate-004.png",
    url: "https://www.credly.com/badges/265e59b4-eb9d-45a9-b8ca-026e8f7bcd32/public_url",
  },
  {
    title: "AWS Certified Cloud Practitioner",
    issuer: "Amazon Web Services",
    period: "Issued: Nov 2025 • Expires: Nov 2028",
    image: "/about/aws-cloud-practitioner.png",
    url: "https://www.credly.com/badges/d70e4cfb-6e4e-4274-8e94-9d2e03c65871/public_url",
  },
]

export const experiences = [
  {
    company: "Junior Cloud Engineer",
    dates: "July 2025 - Present",
    location: "eCloudvalley Philippines, Hybrid",
    description:
      "Contributing to the development and deployment of cloud-based solutions in a collaborative team environment.",
  },
  {
    company: "Cloud Engineer Intern",
    dates: "April 2025 - May 2025",
    location: "eCloudvalley Philippines, Remote",
    description:
      "Gained hands-on experience with AWS services and cloud infrastructure through an intensive training program; Top Cloud Intern and Best Group Project.",
  },
  {
    company: "Software Engineer Intern",
    dates: "February 2025 - May 2025",
    location: "Spring Valley Tech Corp, Bago City",
    description:
      "Participated in immersive on-the-job training designed for real-world client project readiness; Most awarded intern (Top Geek, OJT Excellence).",
  },
  {
    company: "Freelance Software Developer",
    dates: "October 2022 - Present",
    location: "Various clients (Remote)",
    description:
      "Developed diverse projects for schools, students, and private clients, showcasing expertise in web and mobile development.",
  },
]

export const education = [
  {
    school: "University of St. La Salle",
    degree: "Master of Business Administration (MBA), student",
    date: "In progress",
    details: "with Thesis",
  },
  {
    school: "West Visayas State University",
    degree: "Bachelor's degree, Computer Science",
    date: "2021 - 2025",
    details: "Grade: 1.34 (Magna Cum Laude)",
  },
  {
    school: "University of St. La Salle",
    degree: "High School Diploma",
    date: "2008 - 2020",
    details: "That fun, High-School Life",
  },
]

type VolunteerRole = {
  title: string
  organization: string
  period: string
  image: string
  url: string
}

export const volunteering: VolunteerRole[] = [
  {
    title: "AWS Community Builder",
    organization: "Amazon Web Services",
    period: "Mar 2026 - Present",
    image: "/about/aws-community-builder.png",
    url: "https://aws.amazon.com/developer/community/community-builders/",
  },
  {
    title: "Founder",
    organization: "BetterBacolod.org",
    period: "Jan 2026 - Present",
    image: "/about/betterbacolod.png",
    url: "https://betterbacolod.org",
  },
]

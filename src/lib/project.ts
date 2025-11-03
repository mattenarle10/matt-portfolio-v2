export interface Project {
  title: string
  slug: string
  date: string
  description: string
  image: string
  github?: string | string[]
  demo?: string
  pdf?: string
  manual?: string
  technologies: string[]
}

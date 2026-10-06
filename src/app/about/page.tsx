import Certifications from "@/components/about/certifications"
import Education from "@/components/about/education"
import Experiences from "@/components/about/experiences"
import Gallery from "@/components/about/gallery"
import Volunteering from "@/components/about/volunteering"

export default function About() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <h1 className="page-title">About Me</h1>
      <p className="page-subtitle">matthew enarle, basically</p>

      <Gallery />
      <Experiences />
      <Education />
      <Certifications />
      <Volunteering />
    </div>
  )
}

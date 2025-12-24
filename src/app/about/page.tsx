import Certifications from "@/components/about/certifications"
import Education from "@/components/about/education"
import Experiences from "@/components/about/experiences"
import Gallery from "@/components/about/gallery"

export default function About() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <h1 className="text-2xl md:text-2xl font-bold mb-1">About Me</h1>
      <p className="font-light">matthew enarle, basically</p>

      <Gallery />
      <Experiences />
      <Education />
      <Certifications />
    </div>
  )
}

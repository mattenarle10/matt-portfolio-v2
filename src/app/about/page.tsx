import Gallery from '@/components/about/gallery';

export default function About() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <section>
        <h1 className="text-2xl md:text-2xl font-light mb-6 md:mb-8">About Me</h1>
        <Gallery />
      </section>
    </div>
  );
}
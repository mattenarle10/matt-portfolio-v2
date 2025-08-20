import Gallery from '@/components/about/gallery';
import Experiences from '@/components/about/experiences';
import Hobbies from '@/components/about/hobbies';
import Education from '@/components/about/education';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About | Matt Enarle',
  description: 'About Matt Enarle — background, experience, education, and hobbies.',
};

export default function About() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <h1 className="text-2xl md:text-2xl font-bold mb-1">About Me</h1>
      <p className='font-light'>matthew enarle, basically</p>
      
      <section className="mb-10">
        <Gallery />
      </section>
      
      <section className="mt-30 md:mt-0">
        <Experiences />
      </section>
      
      <section>
        <Education />
      </section>
      
      <section>
        <Hobbies />
      </section>
    </div>
  );
}
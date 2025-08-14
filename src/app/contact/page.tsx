"use client";

import Socials from '@/components/contact/socials';
import CalInline from '@/components/contact/cal';

export default function ContactPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <h1 className="text-2xl md:text-2xl font-bold mb-1">Contact</h1>
      <p className="font-light mb-6">let&apos;s connect</p>
      <Socials />
      <div className="mt-8">
        <CalInline />
      </div>
    </div>
  );
}



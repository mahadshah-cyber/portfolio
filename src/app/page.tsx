"use client";

import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { Skills } from "@/components/sections/Skills";
import { Certifications } from "@/components/sections/Certifications";
import { Projects } from "@/components/sections/Projects";
import { Contact } from "@/components/sections/Contact";
import { SectionSoundTrigger } from "@/components/ui/SectionSoundTrigger";

export default function HomePage() {
  return (
    <>
      <SectionSoundTrigger sound="sparkle">
        <Hero />
      </SectionSoundTrigger>
      <SectionSoundTrigger>
        <About />
      </SectionSoundTrigger>
      <SectionSoundTrigger>
        <Skills />
      </SectionSoundTrigger>
      <SectionSoundTrigger>
        <Certifications />
      </SectionSoundTrigger>
      <SectionSoundTrigger>
        <Projects />
      </SectionSoundTrigger>
      <SectionSoundTrigger sound="whoosh">
        <Contact />
      </SectionSoundTrigger>
    </>
  );
}

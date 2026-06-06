"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Send, MapPin } from "lucide-react";
import { soundManager } from "@/lib/sound";
import { EdgeGlowCard } from "@/components/ui/EdgeGlowCard";
import { Magnetic } from "@/components/ui/Magnetic";
import { ContactGate } from "@/components/ui/ContactGate";

gsap.registerPlugin(ScrollTrigger);

const socialLinks = [
  {
    icon: "github",
    href: "https://github.com/mahadshah-cyber",
    label: "GitHub",
  },
  {
    icon: "linkedin",
    href: "https://linkedin.com/in/mahad-shah-2901443b1",
    label: "LinkedIn",
  },
  { icon: "twitter", href: "mailto:mahadshahcr450@gmail.com", label: "Email" },
];

function SocialIcon({ name }: { name: string }) {
  if (name === "github")
    return (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
      </svg>
    );
  if (name === "linkedin")
    return (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    );
  if (name === "twitter")
    return (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    );
  if (name === "email")
    return (
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect width="20" height="16" x="2" y="4" rx="2" />
        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
      </svg>
    );
  return null;
}

export function Contact() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const infoRef = useRef<HTMLDivElement>(null);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (!sectionRef.current) return;
    const ctx = gsap.context(() => {
      const headerEl = headerRef.current;
      if (headerEl && headerEl.children.length > 0) {
        gsap.fromTo(
          headerEl.children,
          { y: 30, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            stagger: 0.15,
            scrollTrigger: {
              trigger: headerEl,
              start: "top 85%",
              toggleActions: "play none none reverse",
            },
          },
        );
      }

      const formEl = formRef.current;
      if (formEl) {
        gsap.fromTo(
          formEl,
          { x: -40, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            duration: 0.8,
            scrollTrigger: {
              trigger: formEl,
              start: "top 80%",
              toggleActions: "play none none reverse",
            },
          },
        );
      }

      const infoEl = infoRef.current;
      if (infoEl && infoEl.children.length > 0) {
        gsap.fromTo(
          infoEl.children,
          { x: 40, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            duration: 0.6,
            stagger: 0.1,
            scrollTrigger: {
              trigger: infoEl,
              start: "top 80%",
              toggleActions: "play none none reverse",
            },
          },
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.get("name"),
          email: formData.get("email"),
          message: formData.get("message"),
        }),
      });

      if (res.ok) {
        setSubmitted(true);
        soundManager.success();
        form.reset();
      } else {
        soundManager.error();
      }
    } catch {
      soundManager.error();
    }
  }

  const handleInputInteraction = (e: React.MouseEvent) => {
    const pan = (e.clientX / window.innerWidth - 0.5) * 2;
    soundManager.hover(pan);
  };

  return (
    <section
      ref={sectionRef}
      id="contact"
      className="relative py-28 lg:py-36 overflow-hidden bg-zinc-950/30"
    >
      {/* Decorative gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(139,0,0,0.08),transparent_50%)] pointer-events-none" />
      <div className="absolute top-0 right-1/4 w-64 h-64 bg-red-500/3 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div ref={headerRef} className="text-center mb-16">
          <p className="text-red-500 text-xs tracking-[0.3em] uppercase font-accent mb-3">
            Contact
          </p>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white">
            Let&apos;s <span className="text-gradient-cinematic">Connect</span>
          </h2>
          <div className="section-line" />
          <p className="text-zinc-400 mt-4 max-w-lg mx-auto text-sm">
            Have a project, question, or just want to say hi? Drop a message
            below.
          </p>
        </div>

        <div className="grid lg:grid-cols-5 gap-8 lg:gap-12 items-start">
          {/* Form */}
          <div className="lg:col-span-3">
            <EdgeGlowCard beadColor="#ff2020" duration="5.5s" beadLength={15}>
              {submitted ? (
                <div className="w-full h-full p-8 lg:p-10 text-center animate-fade-in-up">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-950/30 flex items-center justify-center">
                    <Send className="w-6 h-6 text-red-500" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">
                    Message Sent!
                  </h3>
                  <p className="text-zinc-500 text-sm mb-6">
                    Thank you for reaching out. I&apos;ll get back to you soon.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="px-6 py-2 text-sm rounded-full bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white transition-colors"
                  >
                    Send another
                  </button>
                </div>
              ) : (
                <form
                  ref={formRef}
                  onSubmit={handleSubmit}
                  className="space-y-5 p-6 lg:p-8"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <input
                      type="text"
                      name="name"
                      placeholder="Your Name"
                      required
                      className="input-fill w-full px-5 py-3.5 rounded-xl border border-zinc-800 text-zinc-200 placeholder-zinc-600 text-sm focus:border-red-500/50 outline-none"
                      onMouseEnter={handleInputInteraction}
                    />
                    <input
                      type="email"
                      name="email"
                      placeholder="Your Email"
                      required
                      className="input-fill w-full px-5 py-3.5 rounded-xl border border-zinc-800 text-zinc-200 placeholder-zinc-600 text-sm focus:border-red-500/50 outline-none"
                      onMouseEnter={handleInputInteraction}
                    />
                  </div>
                  {/* Hidden subject field for portfolio context */}
                  <input
                    type="hidden"
                    name="subject"
                    value="Portfolio Contact"
                  />
                  <textarea
                    name="message"
                    placeholder="Your Message"
                    rows={5}
                    required
                    className="w-full px-5 py-3.5 rounded-xl bg-zinc-900/80 border border-zinc-800 text-zinc-200 placeholder-zinc-600 text-sm focus:border-red-500/50 transition-colors outline-none resize-none"
                    onMouseEnter={handleInputInteraction}
                  />
                  <Magnetic strength={0.15}>
                    <button
                      type="submit"
                      className="group relative w-full px-8 py-3.5 bg-red-600 hover:bg-red-700 text-white rounded-xl font-medium transition-all duration-500 hover:shadow-[0_0_30px_rgba(255,32,32,0.3)] overflow-hidden"
                      onClick={(e) => {
                        const pan = (e.clientX / window.innerWidth - 0.5) * 2;
                        soundManager.click(pan);
                      }}
                    >
                      <span className="relative z-10 flex items-center justify-center gap-2">
                        Send Message
                        <Send className="w-4 h-4" />
                      </span>
                      <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-red-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    </button>
                  </Magnetic>
                </form>
              )}
            </EdgeGlowCard>
          </div>

          {/* Info — gated behind CTF puzzle */}
          <div ref={infoRef} className="lg:col-span-2 space-y-4">
            <ContactGate>
              <div className="space-y-4">
                <div className="rounded-xl glass-card p-5 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-red-950/30 flex items-center justify-center flex-shrink-0">
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-red-500"
                    >
                      <rect width="20" height="16" x="2" y="4" rx="2" />
                      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                    </svg>
                  </div>
                  <div>
                    <span className="text-[10px] text-zinc-600 uppercase tracking-widest font-accent">
                      Email
                    </span>
                    <p className="text-sm text-zinc-300 mt-0.5">
                      mahadshahcr450@gmail.com
                    </p>
                  </div>
                </div>

                <div className="rounded-xl glass-card p-5 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-red-950/30 flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5 text-red-500" />
                  </div>
                  <div>
                    <span className="text-[10px] text-zinc-600 uppercase tracking-widest font-accent">
                      Location
                    </span>
                    <p className="text-sm text-zinc-300 mt-0.5">
                      KPK, Pakistan
                    </p>
                  </div>
                </div>

                {/* Social links */}
                <div className="rounded-xl glass-card p-5">
                  <span className="text-[10px] text-zinc-600 uppercase tracking-widest font-accent">
                    Social
                  </span>
                  <div className="flex gap-3 mt-3">
                    {socialLinks.map(({ icon, href, label }) => (
                      <Magnetic key={label} strength={0.3}>
                        <a
                          href={href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-10 h-10 rounded-lg bg-zinc-900/80 border border-zinc-800 flex items-center justify-center text-zinc-500 hover:text-red-500 hover:border-red-900/50 transition-all duration-300"
                          onMouseEnter={(e) => {
                            const pan =
                              (e.clientX / window.innerWidth - 0.5) * 2;
                            soundManager.hover(pan);
                          }}
                          onClick={(e) => {
                            const pan =
                              (e.clientX / window.innerWidth - 0.5) * 2;
                            soundManager.click(pan);
                          }}
                          aria-label={label}
                        >
                          <SocialIcon name={icon} />
                        </a>
                      </Magnetic>
                    ))}
                  </div>
                </div>

                {/* Availability badge */}
                <div className="rounded-xl glass-card p-5 flex items-center gap-3">
                  <span className="relative w-3 h-3">
                    <span className="absolute inset-0 rounded-full bg-green-500 animate-ping opacity-40" />
                    <span className="absolute inset-0 rounded-full bg-green-500" />
                  </span>
                  <div>
                    <p className="text-sm text-zinc-300">
                      Available for opportunities
                    </p>
                    <p className="text-[10px] text-zinc-600">
                      Open to work &amp; collaborations
                    </p>
                  </div>
                </div>
              </div>
            </ContactGate>
          </div>
        </div>
      </div>
    </section>
  );
}

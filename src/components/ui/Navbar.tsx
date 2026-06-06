"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { soundManager } from "@/lib/sound";
import { Magnetic } from "./Magnetic";
import { hackerMode } from "@/lib/hacker-mode";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/#about", label: "About" },
  { href: "/#skills", label: "Skills" },
  { href: "/#projects", label: "Projects" },
  { href: "/blog", label: "Blog" },
  { href: "/ctf", label: "CTF" },
  { href: "/terminal", label: "Terminal" },
  { href: "/resume", label: "Resume" },
  { href: "/#contact", label: "Contact" },
];

export function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isHacker, setIsHacker] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll, { passive: true });
    
    // Subscribe to hacker mode changes
    if (hackerMode) {
      setIsHacker(hackerMode.isActive());
      const unsubscribe = hackerMode.subscribe((active) => {
        setIsHacker(active);
      });
      return () => {
        window.removeEventListener("scroll", onScroll);
        unsubscribe();
      };
    }

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleNavClick = (e: React.MouseEvent) => {
    const pan = (e.clientX / window.innerWidth - 0.5) * 2;
    soundManager.click(pan);
    setMobileOpen(false);
  };

  const handleHomeClick = (e: React.MouseEvent) => {
    if (pathname === "/") {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
    handleNavClick(e);
  };

  const handleHashClick = useCallback(
    (e: React.MouseEvent, href: string) => {
      e.preventDefault();
      const id = href.split("#")[1];
      if (!id) return;
      window.history.pushState(null, "", href);
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
      handleNavClick(e);
    },
    []
  );

  const handleHover = (e: React.MouseEvent) => {
    const pan = (e.clientX / window.innerWidth - 0.5) * 2;
    soundManager.hover(pan);
  };

  const isHashLink = (href: string) => href.includes("#");

  const dynamicLinks = [
    ...navLinks,
    ...(isHacker
      ? [
          { href: "/warroom", label: "War Room" },
          { href: "/terminal", label: "Darknet" },
        ]
      : []),
  ];

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${
          scrolled
            ? "bg-black/80 backdrop-blur-xl border-b border-zinc-800/40"
            : "bg-transparent py-4"
        }`}
      >
        {/* Navbar corner accents — shown only when scrolled */}
        {scrolled && (
          <>
            <div className="corner-accent corner-accent-bl" style={{ bottom: '-1px', left: '0' }} />
            <div className="corner-accent corner-accent-br" style={{ bottom: '-1px', right: '0' }} />
          </>
        )}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo */}
            <Magnetic strength={0.3}>
              <Link
                href="/"
                className="text-xl font-bold tracking-wider text-white hover:text-red-500 transition-colors duration-300"
                onClick={handleHomeClick}
                onMouseEnter={handleHover}
              >
                <span className="text-red-500">&lt;</span>
                SMS
                <span className="text-red-500"> /&gt;</span>
              </Link>
            </Magnetic>

            {/* Desktop Links */}
            <div className="hidden md:flex items-center gap-6 lg:gap-8">
              {dynamicLinks.map((link) => (
                <Magnetic key={link.href} strength={0.2}>
                  {isHashLink(link.href) && pathname === "/" ? (
                    <button
                      onClick={(e) => handleHashClick(e, link.href)}
                      onMouseEnter={handleHover}
                      className="text-[10px] text-zinc-400 hover:text-white transition-colors duration-300 tracking-[0.2em] uppercase bg-transparent border-none cursor-pointer font-bold"
                    >
                      {link.label}
                    </button>
                  ) : (
                    <Link
                      href={link.href}
                      className="text-[10px] text-zinc-400 hover:text-white transition-colors duration-300 tracking-[0.2em] uppercase font-bold"
                      onClick={link.href === "/" ? handleHomeClick : handleNavClick}
                      onMouseEnter={handleHover}
                    >
                      {link.label}
                    </Link>
                  )}
                </Magnetic>
              ))}
            </div>

            {/* Mobile Toggle */}
            <button
              className="md:hidden text-white p-2"
              onClick={(e) => {
                setMobileOpen(!mobileOpen);
                const pan = (e.clientX / window.innerWidth - 0.5) * 2;
                soundManager.click(pan);
              }}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`fixed inset-0 bg-black/98 backdrop-blur-2xl z-40 transition-transform duration-700 ease-in-out ${
            mobileOpen ? "translate-x-0" : "translate-x-full"
          } md:hidden`}
        >
          <div className="flex flex-col items-center justify-center h-full gap-8">
            {dynamicLinks.map((link) =>
              isHashLink(link.href) && pathname === "/" ? (
                <button
                  key={link.href}
                  onClick={(e) => handleHashClick(e, link.href)}
                  className="text-2xl text-white hover:text-red-500 transition-colors duration-300 tracking-widest uppercase bg-transparent border-none cursor-pointer font-bold"
                >
                  {link.label}
                </button>
              ) : (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-2xl text-white hover:text-red-500 transition-colors duration-300 tracking-widest uppercase font-bold"
                  onClick={link.href === "/" ? handleHomeClick : (e) => handleNavClick(e)}
                >
                  {link.label}
                </Link>
              )
            )}
          </div>
        </div>
      </nav>

      {/* Floating ROOT indicator */}
      {isHacker && (
        <div className="fixed bottom-6 left-6 z-50 flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-950/80 border border-red-500/30 backdrop-blur shadow-[0_0_15px_rgba(239,68,68,0.25)] animate-pulse select-none hacker-mode-indicator">
          <span className="relative w-2 h-2">
            <span className="absolute inset-0 rounded-full bg-red-500 animate-ping opacity-60" />
            <span className="absolute inset-0 rounded-full bg-red-500" />
          </span>
          <span className="text-[10px] font-mono text-red-400 tracking-widest font-bold uppercase">
            ROOT ACTIVE
          </span>
        </div>
      )}
    </>
  );
}

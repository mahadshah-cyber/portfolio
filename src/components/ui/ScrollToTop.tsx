"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export function ScrollToTop() {
  const pathname = usePathname();

  useEffect(() => {
    window.scrollTo(0, 0);
    requestAnimationFrame(() => {
      ScrollTrigger.refresh(true);
    });
  }, [pathname]);

  return null;
}

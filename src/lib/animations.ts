import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function initScrollAnimations() {
  // Fade up on scroll
  gsap.utils.toArray<HTMLElement>(".fade-up").forEach((el) => {
    gsap.fromTo(
      el,
      { y: 60, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: el,
          start: "top 85%",
          toggleActions: "play none none reverse",
        },
      },
    );
  });

  // Fade in
  gsap.utils.toArray<HTMLElement>(".fade-in").forEach((el) => {
    gsap.fromTo(
      el,
      { opacity: 0 },
      {
        opacity: 1,
        duration: 1.2,
        ease: "power2.out",
        scrollTrigger: {
          trigger: el,
          start: "top 85%",
          toggleActions: "play none none reverse",
        },
      },
    );
  });

  // Scale in
  gsap.utils.toArray<HTMLElement>(".scale-in").forEach((el) => {
    gsap.fromTo(
      el,
      { scale: 0.8, opacity: 0 },
      {
        scale: 1,
        opacity: 1,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: {
          trigger: el,
          start: "top 85%",
          toggleActions: "play none none reverse",
        },
      },
    );
  });

  // Slide from left
  gsap.utils.toArray<HTMLElement>(".slide-left").forEach((el) => {
    gsap.fromTo(
      el,
      { x: -80, opacity: 0 },
      {
        x: 0,
        opacity: 1,
        duration: 0.9,
        ease: "power3.out",
        scrollTrigger: {
          trigger: el,
          start: "top 85%",
          toggleActions: "play none none reverse",
        },
      },
    );
  });

  // Slide from right
  gsap.utils.toArray<HTMLElement>(".slide-right").forEach((el) => {
    gsap.fromTo(
      el,
      { x: 80, opacity: 0 },
      {
        x: 0,
        opacity: 1,
        duration: 0.9,
        ease: "power3.out",
        scrollTrigger: {
          trigger: el,
          start: "top 85%",
          toggleActions: "play none none reverse",
        },
      },
    );
  });

  // Blur reveal
  gsap.utils.toArray<HTMLElement>(".blur-reveal").forEach((el) => {
    gsap.fromTo(
      el,
      { opacity: 0, filter: "blur(12px)", y: 30 },
      {
        opacity: 1,
        filter: "blur(0px)",
        y: 0,
        duration: 1.1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: el,
          start: "top 88%",
          toggleActions: "play none none reverse",
        },
      },
    );
  });

  // Stagger children
  gsap.utils.toArray<HTMLElement>(".stagger-children").forEach((parent) => {
    const children = parent.children;
    if (!children.length) return;
    gsap.fromTo(
      children,
      { y: 40, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.7,
        stagger: 0.08,
        ease: "power3.out",
        scrollTrigger: {
          trigger: parent,
          start: "top 85%",
          toggleActions: "play none none reverse",
        },
      },
    );
  });
}

export function staggerFrom(
  elements: HTMLElement[],
  direction: "left" | "right" | "up" | "down" = "up"
) {
  const x = direction === "left" ? -50 : direction === "right" ? 50 : 0;
  const y = direction === "up" ? 50 : direction === "down" ? -50 : 0;
  gsap.fromTo(
    elements,
    { x, y, opacity: 0 },
    {
      x: 0,
      y: 0,
      opacity: 1,
      duration: 0.6,
      stagger: 0.1,
      ease: "power2.out",
      scrollTrigger: {
        trigger: elements[0]?.parentElement,
        start: "top 85%",
      },
    }
  );
}

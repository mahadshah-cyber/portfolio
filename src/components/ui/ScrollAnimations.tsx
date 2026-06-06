"use client";

import { useEffect } from "react";
import { initScrollAnimations } from "@/lib/animations";

export function ScrollAnimations() {
  useEffect(() => {
    initScrollAnimations();
  }, []);

  return null;
}

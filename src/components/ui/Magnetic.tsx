"use client";

import { ReactNode } from "react";

interface MagneticProps {
  children: ReactNode;
  strength?: number;
  className?: string;
}

export function Magnetic({ children }: MagneticProps) {
  return <>{children}</>;
}

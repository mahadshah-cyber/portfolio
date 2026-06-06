"use client";

interface SectionSoundTriggerProps {
  children: React.ReactNode;
  className?: string;
  sound?: "whoosh" | "sparkle" | "section";
}

export function SectionSoundTrigger({
  children,
  className,
}: SectionSoundTriggerProps) {
  return <div className={className}>{children}</div>;
}

export function JsonLd() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Syed Mahad Shah",
    givenName: "Mahad",
    familyName: "Shah",
    jobTitle: "Cybersecurity Enthusiast & Full-Stack Developer",
    description:
      "Aspiring cybersecurity expert and full-stack developer from Pakistan. Passionate about digital security, CTF challenges, and building modern web applications.",
    url: "https://mahadshah.dev",
    sameAs: [
      "https://github.com/mahadshah-cyber",
      "https://linkedin.com/in/mahad-shah-2901443b1",
    ],
    email: "mahadshahcr450@gmail.com",
    knowsAbout: [
      "Cybersecurity",
      "Web Development",
      "Programming",
      "CTF",
      "Network Security",
      "C Programming",
      "Java",
      "JavaScript",
      "React",
      "Next.js",
    ],
    address: {
      "@type": "PostalAddress",
      addressRegion: "KPK",
      addressCountry: "PK",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

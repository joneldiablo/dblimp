import React from "react";

interface HeroBannerProps {
  eyebrow?: string;
  title?: string;
  body?: string;
  primaryCta?: string;
  secondaryCta?: string;
}

export default function HeroBanner({
  eyebrow = "Seed Starter",
  title = "Construye productos schema-first desde una base estable",
  body = "Reemplaza solo el contenido de negocio. Conserva los contratos de release, testing y arquitectura.",
  primaryCta = "Revisa los schemas",
  secondaryCta = "Lee los docs de agents",
}: HeroBannerProps) {
  return (
    <section className="seed-hero">
      <p className="seed-kicker">{eyebrow}</p>
      <h2>{title}</h2>
      <p>{body}</p>
      <div className="seed-hero-actions">
        <span>{primaryCta}</span>
        <span>{secondaryCta}</span>
      </div>
    </section>
  );
}
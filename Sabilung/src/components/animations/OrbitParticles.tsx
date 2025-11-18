import anime from "animejs";
import { useEffect, useRef } from "react";

const PARTICLE_COUNT = 12;

export const OrbitParticles = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const nodes = Array.from(containerRef.current.querySelectorAll<HTMLElement>(".orbit-dot"));
    const animation = anime({
      targets: nodes,
      translateX: (_element: HTMLElement, index: number) => 30 + Math.sin(index) * 20,
      translateY: (_element: HTMLElement, index: number) => -20 + Math.cos(index) * 20,
      opacity: [0.4, 1],
      duration: 2800,
      direction: "alternate",
      easing: "easeInOutSine",
      delay: anime.stagger(120),
      loop: true,
    });
    return () => {
      animation.pause();
    };
  }, []);

  return (
    <div ref={containerRef} className="pointer-events-none absolute inset-0">
      {Array.from({ length: PARTICLE_COUNT }).map((_, index) => (
        <span
          key={index}
          className="orbit-dot absolute h-2 w-2 rounded-full bg-sky-200/70"
          style={{ top: `${20 + (index * 40) % 160}px`, left: `${30 + (index * 23) % 120}px` }}
        />
      ))}
    </div>
  );
};

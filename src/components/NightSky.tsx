import { useMemo } from "react";

function makeStars(count: number) {
  return Array.from({ length: count }, (_, index) => ({
    id: index,
    left: ((index * 37 + 11) % 97) + 1.2,
    top: ((index * 53 + 7) % 96) + 1.5,
    size: index % 9 === 0 ? 2.4 : index % 3 === 0 ? 1.6 : 1.1,
    delay: (index % 12) * 0.42,
    duration: 2.8 + (index % 5) * 0.55,
  }));
}

function makeFireflies(count: number) {
  return Array.from({ length: count }, (_, index) => ({
    id: index,
    left: 8 + ((index * 19) % 84),
    top: 14 + ((index * 23) % 70),
    delay: index * 0.7,
    duration: 7 + (index % 4) * 1.4,
  }));
}

export function NightSky() {
  const stars = useMemo(() => makeStars(56), []);
  const fireflies = useMemo(() => makeFireflies(10), []);

  return (
    <div className="night-sky" aria-hidden="true">
      <div className="sky-wash" />
      {stars.map((star) => (
        <span
          key={star.id}
          className="star"
          style={{
            left: `${star.left}%`,
            top: `${star.top}%`,
            width: star.size,
            height: star.size,
            animationDelay: `${star.delay}s`,
            animationDuration: `${star.duration}s`,
          }}
        />
      ))}
      {fireflies.map((fly) => (
        <span
          key={fly.id}
          className="firefly"
          style={{
            left: `${fly.left}%`,
            top: `${fly.top}%`,
            animationDelay: `${fly.delay}s`,
            animationDuration: `${fly.duration}s`,
          }}
        />
      ))}
    </div>
  );
}

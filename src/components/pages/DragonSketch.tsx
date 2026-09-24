import { KeyboardEvent, useEffect, useState } from "react";
import portrait from "../../assets/dragons-graphite.png";

type DragonSketchProps = {
  name: string;
  revealed: boolean;
  reduced: boolean;
};

export function DragonSketch({ name, revealed, reduced }: DragonSketchProps) {
  const shown = revealed || reduced;
  const [alive, setAlive] = useState(reduced);
  const [nudge, setNudge] = useState(false);

  useEffect(() => {
    if (!shown) {
      setAlive(false);
      return;
    }
    if (reduced) {
      setAlive(true);
      return;
    }
    const timer = window.setTimeout(() => setAlive(true), 900);
    return () => window.clearTimeout(timer);
  }, [reduced, shown]);

  const attend = () => {
    if (reduced) return;
    setNudge(true);
    window.setTimeout(() => setNudge(false), 1200);
  };

  const onKey = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      attend();
    }
  };

  return (
    <button
      type="button"
      className={`dragon-notebook ${shown ? "is-revealed is-landed" : ""} ${alive && !reduced ? "is-alive" : ""} ${reduced ? "is-static" : ""} ${nudge ? "is-nudge" : ""}`}
      onClick={attend}
      onKeyDown={onKey}
      aria-label="A realistic pencil drawing of a black dragon and a white dragon facing each other, wings open in a heart."
    >
      <img
        className="dragon-portrait"
        src={portrait}
        alt=""
        draggable={false}
      />
      <svg className="dragon-overlay" viewBox="0 0 720 720" aria-hidden="true">
          <g className="pair-mark" transform="translate(360 198)">
          <path
            className="pair-heart"
            d="M0 8 C -2 0 -13 -4 -14 6 C -14 15 0 22 0 28 C 0 22 14 15 14 6 C 13 -4 2 0 0 8 Z"
          />
          <path className="pair-spark" d="M0 -16 V -26 M -5 -21 H 5" />
        </g>
        <text className="sketch-sign" x="700" y="704" textAnchor="end">
          for {name}
        </text>
      </svg>
    </button>
  );
}

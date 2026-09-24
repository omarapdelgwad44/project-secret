import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import gsap from "gsap";
import nightMid from "../assets/dragon-fly-night.png";
import lightMid from "../assets/dragon-fly-light.png";

type Side = "night" | "light";

type Point = { x: number; y: number };

type SkyFlightProps = {
  onArrive: () => void;
  onDone: () => void;
};

const DURATION = 3.3;

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function lerp(from: number, to: number, amount: number) {
  return from + (to - from) * amount;
}

function smoothstep(edge0: number, edge1: number, value: number) {
  const t = clamp((value - edge0) / (edge1 - edge0), 0, 1);
  return t * t * (3 - 2 * t);
}

function landing(side: Side, width: number, height: number): Point {
  const node =
    document.querySelector(".dragon-portrait") ??
    document.querySelector(".dragon-notebook") ??
    document.querySelector(".book-frame");
  const rect = node?.getBoundingClientRect();

  if (!rect || rect.width < 8) {
    return {
      x: window.innerWidth * (side === "night" ? 0.42 : 0.58) - width / 2,
      y: window.innerHeight * 0.5 - height / 2,
    };
  }

  const anchorX = rect.left + rect.width * (side === "night" ? 0.4 : 0.6);
  const anchorY = rect.top + rect.height * 0.46;
  return { x: anchorX - width / 2, y: anchorY - height / 2 };
}

function endScale(width: number) {
  const notebook = document.querySelector(".dragon-notebook");
  const notebookWidth = notebook?.getBoundingClientRect().width ?? width * 0.55;
  return clamp((notebookWidth * 0.48) / width, 0.32, 0.46);
}

export function SkyFlight({ onArrive, onDone }: SkyFlightProps) {
  const nightRef = useRef<HTMLDivElement>(null);
  const lightRef = useRef<HTMLDivElement>(null);
  const arriveRef = useRef(onArrive);
  const doneRef = useRef(onDone);
  arriveRef.current = onArrive;
  doneRef.current = onDone;

  useEffect(() => {
    const tracks: Record<Side, HTMLDivElement | null> = {
      night: nightRef.current,
      light: lightRef.current,
    };
    if (!tracks.night || !tracks.light) return;

    let arrived = false;
    const ctx = gsap.context(() => {
      const plans = (Object.keys(tracks) as Side[]).map((side) => {
        const el = tracks[side] as HTMLDivElement;
        const width = el.offsetWidth || 280;
        const height = el.offsetHeight || 170;
        const start = {
          x: side === "night" ? -width * 0.7 : window.innerWidth - width * 0.2,
          y: window.innerHeight * (side === "night" ? 0.17 : 0.14),
        };
        const dest = landing(side, width, height);
        const ctrl = {
          x: start.x + (dest.x - start.x) * 0.62,
          y: start.y + (dest.y - start.y) * 0.12,
        };
        gsap.set(el, { x: start.x, y: start.y, scale: 0.98, opacity: 0 });
        return { side, el, start, ctrl, dest, scaleTo: endScale(width) };
      });

      gsap.to(
        { p: 0 },
        {
          p: 1,
          duration: DURATION,
          ease: "none",
          onUpdate() {
            const progress = (this.targets()[0] as { p: number }).p;
            for (const plan of plans) {
              const remain = 1 - progress;
              const x =
                remain * remain * plan.start.x +
                2 * remain * progress * plan.ctrl.x +
                progress * progress * plan.dest.x;
              const y =
                remain * remain * plan.start.y +
                2 * remain * progress * plan.ctrl.y +
                progress * progress * plan.dest.y;
              const glide =
                Math.sin(progress * Math.PI * 2 * 1.35 + (plan.side === "light" ? 0.4 : 0)) *
                4 *
                (1 - smoothstep(0.72, 0.94, progress));
              gsap.set(plan.el, {
                x,
                y: y + glide,
                scale: lerp(0.98, plan.scaleTo, smoothstep(0.58, 1, progress)),
                opacity: smoothstep(0, 0.05, progress) * (1 - smoothstep(0.9, 1, progress)),
              });
            }
            if (!arrived && progress >= 0.9) {
              arrived = true;
              arriveRef.current();
            }
          },
          onComplete() {
            doneRef.current();
          },
        }
      );
    });

    return () => ctx.revert();
  }, []);

  return createPortal(
    <div className="sky-flight" aria-hidden="true">
      <div className="sky-flyer-track sky-flyer-track--night" ref={nightRef}>
        <div className="sky-flyer-glide">
          <img className="sky-flyer" src={nightMid} alt="" draggable={false} />
        </div>
      </div>
      <div className="sky-flyer-track sky-flyer-track--light" ref={lightRef}>
        <div className="sky-flyer-glide">
          <img className="sky-flyer" src={lightMid} alt="" draggable={false} />
        </div>
      </div>
    </div>,
    document.body
  );
}

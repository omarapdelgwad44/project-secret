type RoseNameProps = {
  name: string;
  revealed: boolean;
  reduced: boolean;
};

const PALETTES = [
  { a: "#efc3d0", b: "#d4899c", c: "#b65c78", d: "#8e3f5c", heart: "#f3d89a" },
  { a: "#f0d0d8", b: "#c36b86", c: "#a45a78", d: "#7a3d58", heart: "#e8bc77" },
  { a: "#e6aebe", b: "#c97a92", c: "#9a4d6c", d: "#6d3450", heart: "#f0d39a" },
] as const;

const ROSES = [
  { x: 46, y: 92, size: 1.05, rotate: -18, delay: 0.05, tone: 0 },
  { x: 78, y: 138, size: 0.78, rotate: 16, delay: 0.14, tone: 1 },
  { x: 122, y: 154, size: 0.92, rotate: -8, delay: 0.22, tone: 2 },
  { x: 180, y: 160, size: 1.12, rotate: 6, delay: 0.3, tone: 0 },
  { x: 236, y: 152, size: 0.88, rotate: -14, delay: 0.38, tone: 1 },
  { x: 282, y: 128, size: 0.74, rotate: 22, delay: 0.46, tone: 2 },
  { x: 314, y: 88, size: 1, rotate: 12, delay: 0.12, tone: 0 },
  { x: 54, y: 58, size: 0.62, rotate: -28, delay: 0.34, tone: 2 },
  { x: 308, y: 54, size: 0.58, rotate: 30, delay: 0.4, tone: 1 },
] as const;

function BloomRose({
  x,
  y,
  size,
  rotate,
  delay,
  tone,
}: (typeof ROSES)[number]) {
  const palette = PALETTES[tone];

  return (
    <g transform={`translate(${x} ${y})`}>
      <g
        className="bloom-rose"
        style={{ ["--bloom-delay" as string]: `${delay}s` }}
      >
        <g transform={`rotate(${rotate}) scale(${size})`}>
          <ellipse
            className="bloom-leaf"
            cx="-12"
            cy="8"
            rx="9"
            ry="3.6"
            transform="rotate(-34 -12 8)"
          />
          <ellipse
            className="bloom-leaf"
            cx="12"
            cy="9"
            rx="8"
            ry="3.2"
            transform="rotate(38 12 9)"
          />
          {[0, 72, 144, 216, 288].map((deg) => (
            <ellipse
              key={`o-${deg}`}
              cx="0"
              cy="-7.4"
              rx="5.1"
              ry="8"
              fill={palette.a}
              transform={`rotate(${deg})`}
            />
          ))}
          {[36, 108, 180, 252, 324].map((deg) => (
            <ellipse
              key={`m-${deg}`}
              cx="0"
              cy="-5"
              rx="3.8"
              ry="6"
              fill={palette.b}
              transform={`rotate(${deg})`}
            />
          ))}
          {[0, 120, 240].map((deg) => (
            <ellipse
              key={`i-${deg}`}
              cx="0"
              cy="-3"
              rx="2.5"
              ry="3.8"
              fill={palette.c}
              transform={`rotate(${deg})`}
            />
          ))}
          <circle r="2.3" fill={palette.d} />
          <circle r="1.1" fill={palette.heart} />
        </g>
      </g>
    </g>
  );
}

export function RoseName({ name, revealed, reduced }: RoseNameProps) {
  const shown = revealed || reduced;

  return (
    <div className={`rose-name ${shown ? "is-revealed" : ""} ${reduced ? "is-static" : ""}`}>
      <svg className="rose-garland" viewBox="0 0 360 200" aria-hidden="true">
        <path
          className="rose-flourish"
          d="M42 118 C110 168 250 170 318 112"
          fill="none"
        />
        {ROSES.map((rose) => (
          <BloomRose key={`${rose.x}-${rose.y}`} {...rose} />
        ))}
      </svg>
      <p className="rose-name-word">{name}</p>
    </div>
  );
}

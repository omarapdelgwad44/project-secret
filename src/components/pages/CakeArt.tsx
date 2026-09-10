type CakeArtProps = {
  revealed: boolean;
  reduced: boolean;
  wished: boolean;
};

export function CakeArt({ revealed, reduced, wished }: CakeArtProps) {
  const shown = revealed || reduced;

  return (
    <svg
      className={`draw-art cake-art ${shown ? "is-revealed" : ""} ${wished ? "is-wished" : ""}`}
      viewBox="0 0 220 240"
      fill="none"
      aria-hidden="true"
    >
      <ellipse
        className="draw-line cake-fill"
        cx="110"
        cy="208"
        rx="86"
        ry="12"
      />
      <path
        className="draw-line cake-fill cake-tier"
        d="M36 150 H184 A14 14 0 0 1 198 164 V190 A14 14 0 0 1 184 204 H36 A14 14 0 0 1 22 190 V164 A14 14 0 0 1 36 150 Z"
      />
      <path
        className="draw-line cake-fill cake-cream"
        d="M34 150 C52 172 70 138 88 162 C104 182 118 140 110 166 C122 184 138 142 154 162 C172 180 188 144 198 150 L198 140 C164 128 76 128 34 140 Z"
      />
      <path
        className="draw-line cake-fill cake-tier cake-tier--top"
        d="M58 108 H162 A12 12 0 0 1 174 120 V152 A12 12 0 0 1 162 164 H58 A12 12 0 0 1 46 152 V120 A12 12 0 0 1 58 108 Z"
      />
      <path
        className="draw-line cake-fill cake-cream"
        d="M56 108 C70 128 86 98 100 120 C110 136 116 98 110 122 C120 138 132 100 146 120 C160 136 170 102 176 108 L176 98 C148 88 84 88 56 98 Z"
      />
      <rect className="draw-line cake-fill cake-candle" x="76" y="68" width="7" height="42" rx="2" />
      <rect className="draw-line cake-fill cake-candle" x="98" y="60" width="7" height="50" rx="2" />
      <rect className="draw-line cake-fill cake-candle" x="120" y="64" width="7" height="46" rx="2" />
      <rect className="draw-line cake-fill cake-candle" x="142" y="70" width="7" height="40" rx="2" />
      <g className="flames">
        <g transform="translate(79.5 54)">
          <g className="flame">
            <path fill="#ff8a1a" d="M0 10 C6 2 7 -10 0 -18 C-3 -8 -7 2 0 10 Z" />
            <path fill="#ffe08a" d="M0 6 C2.4 1 2.6 -5 0 -10 C-1.4 -4 -2.6 1 0 6 Z" />
          </g>
        </g>
        <g transform="translate(101.5 46)">
          <g className="flame">
            <path fill="#ff8a1a" d="M0 10 C6.2 2 7.4 -12 0 -20 C-3.2 -8 -7.4 2 0 10 Z" />
            <path fill="#ffe08a" d="M0 6 C2.6 1 2.8 -6 0 -11 C-1.5 -4 -2.8 1 0 6 Z" />
          </g>
        </g>
        <g transform="translate(123.5 50)">
          <g className="flame">
            <path fill="#ff8a1a" d="M0 10 C6 2 7 -10 0 -18 C-3 -8 -7 2 0 10 Z" />
            <path fill="#ffe08a" d="M0 6 C2.4 1 2.6 -5 0 -10 C-1.4 -4 -2.6 1 0 6 Z" />
          </g>
        </g>
        <g transform="translate(145.5 56)">
          <g className="flame">
            <path fill="#ff8a1a" d="M0 10 C5.6 2 6.6 -9 0 -17 C-2.8 -7 -6.6 2 0 10 Z" />
            <path fill="#ffe08a" d="M0 6 C2.2 1 2.4 -4 0 -9 C-1.2 -3 -2.4 1 0 6 Z" />
          </g>
        </g>
      </g>
    </svg>
  );
}

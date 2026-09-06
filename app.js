(() => {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const wait = (ms) => new Promise((resolve) => setTimeout(resolve, reduceMotion ? 0 : ms));

  const openBtn = document.getElementById("openBtn");
  const soundToggle = document.getElementById("soundToggle");
  const giftScene = document.getElementById("giftScene");
  const celebrateScene = document.getElementById("celebrateScene");
  const titleEl = document.getElementById("title");
  const nameCanvas = document.getElementById("nameCanvas");
  const cakeArea = document.getElementById("cakeArea");
  const cake = document.getElementById("cake");
  const wishBtn = document.getElementById("wishBtn");
  const finalLine = document.getElementById("finalLine");
  const flash = document.getElementById("flash");
  const fallLayer = document.getElementById("fallLayer");
  const balloonsEl = document.getElementById("balloons");
  const fx = document.getElementById("fx");
  const bgAudio = document.getElementById("bgAudio");

  const fxCtx = fx.getContext("2d");
  const nameCtx = nameCanvas.getContext("2d");

  let muted = false;
  let opened = false;
  let blown = false;
  let audioReady = false;
  let synth = null;
  let confetti = [];
  let hearts = [];
  let animatingHearts = false;
  let fxRaf = 0;

  const COLORS = ["#e8c872", "#f7efe6", "#e8b4b8", "#d24a62", "#f0d58a"];

  const phone = document.querySelector(".phone");

  function viewSize() {
    const w = phone.clientWidth || window.innerWidth;
    const h = phone.clientHeight || window.innerHeight;
    return { w, h };
  }

  function resizeFx() {
    const { w, h } = viewSize();
    fx.width = Math.floor(w * devicePixelRatio);
    fx.height = Math.floor(h * devicePixelRatio);
    fxCtx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
  }

  function resizeName() {
    const rect = nameCanvas.parentElement.getBoundingClientRect();
    nameCanvas.width = Math.floor(rect.width * devicePixelRatio);
    nameCanvas.height = Math.floor(rect.height * devicePixelRatio);
    nameCanvas.style.width = `${rect.width}px`;
    nameCanvas.style.height = `${rect.height}px`;
    nameCtx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
  }

  window.addEventListener("resize", () => {
    resizeFx();
    resizeName();
  });
  window.visualViewport?.addEventListener("resize", () => {
    resizeFx();
    resizeName();
  });
  resizeFx();
  resizeName();

  function createSynth() {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return null;
    const ctx = new AudioCtx();
    const master = ctx.createGain();
    master.gain.value = 0.18;
    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 2400;
    master.connect(filter);
    filter.connect(ctx.destination);

    const notes = [
      659.25, 783.99, 1046.5, 783.99, 659.25, 587.33, 523.25, 0,
      783.99, 880.0, 783.99, 659.25, 698.46, 659.25, 523.25, 0,
      1046.5, 1318.51, 1046.5, 783.99, 880.0, 783.99, 659.25, 0,
      659.25, 587.33, 523.25, 392.0, 523.25, 0, 0, 0,
    ];

    let timer = null;
    let index = 0;
    const step = 0.42;

    function pluck(freq, when) {
      if (!freq) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const harmonic = ctx.createOscillator();
      const hGain = ctx.createGain();
      osc.type = "sine";
      harmonic.type = "sine";
      osc.frequency.setValueAtTime(freq, when);
      harmonic.frequency.setValueAtTime(freq * 2, when);
      gain.gain.setValueAtTime(0.0001, when);
      gain.gain.exponentialRampToValueAtTime(0.55, when + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, when + 1.35);
      hGain.gain.setValueAtTime(0.0001, when);
      hGain.gain.exponentialRampToValueAtTime(0.16, when + 0.02);
      hGain.gain.exponentialRampToValueAtTime(0.0001, when + 0.8);
      osc.connect(gain);
      harmonic.connect(hGain);
      gain.connect(master);
      hGain.connect(master);
      osc.start(when);
      harmonic.start(when);
      osc.stop(when + 1.4);
      harmonic.stop(when + 0.9);
    }

    function loop() {
      const now = ctx.currentTime;
      for (let i = 0; i < 8; i += 1) {
        pluck(notes[index], now + i * step);
        index = (index + 1) % notes.length;
      }
    }

    return {
      ctx,
      master,
      start() {
        if (ctx.state === "suspended") ctx.resume();
        if (timer) return;
        loop();
        timer = setInterval(loop, step * 8 * 1000);
      },
      stop() {
        if (timer) {
          clearInterval(timer);
          timer = null;
        }
      },
      setMuted(value) {
        master.gain.setTargetAtTime(value ? 0 : 0.18, ctx.currentTime, 0.05);
      },
    };
  }

  async function startMusic() {
    soundToggle.hidden = false;
    bgAudio.volume = 0.42;
    bgAudio.loop = true;
    try {
      await bgAudio.play();
      audioReady = true;
    } catch {
      synth = synth || createSynth();
      if (synth) {
        synth.start();
        audioReady = true;
      }
    }
    bgAudio.addEventListener(
      "error",
      () => {
        if (synth) return;
        synth = createSynth();
        if (synth) synth.start();
      },
      { once: true }
    );
  }

  function setMuted(next) {
    muted = next;
    soundToggle.setAttribute("aria-pressed", String(muted));
    soundToggle.setAttribute("aria-label", muted ? "Unmute music" : "Mute music");
    bgAudio.muted = muted;
    if (synth) synth.setMuted(muted);
  }

  soundToggle.addEventListener("click", () => setMuted(!muted));

  function revealTitle(text) {
    titleEl.textContent = "";
    [...text].forEach((char, i) => {
      const span = document.createElement("span");
      span.className = "char";
      span.textContent = char === " " ? "\u00a0" : char;
      span.style.animationDelay = `${i * 55}ms`;
      titleEl.appendChild(span);
    });
  }

  function spawnBalloons() {
    const palette = ["#e8b4b8", "#f7efe6", "#e8c872", "#d24a62", "#f3c9d0"];
    const total = 5;
    for (let i = 0; i < total; i += 1) {
      const b = document.createElement("span");
      b.className = "balloon";
      b.style.left = `${8 + Math.random() * 76}%`;
      b.style.background = `linear-gradient(160deg, #fff6, ${palette[i % palette.length]})`;
      b.style.animationDelay = `${i * 0.22}s`;
      b.style.animationDuration = `${6.8 + Math.random() * 2.4}s`;
      balloonsEl.appendChild(b);
    }
  }

  function spawnFalling() {
    const glyphs = ["🌹", "💗", "🤍", "✨", "🌷"];
    const count = reduceMotion ? 6 : 8;
    for (let i = 0; i < count; i += 1) {
      const el = document.createElement("span");
      el.className = "petal";
      el.textContent = glyphs[i % glyphs.length];
      el.style.left = `${4 + Math.random() * 88}%`;
      el.style.animationDelay = `${Math.random() * 2.4}s`;
      el.style.animationDuration = `${6 + Math.random() * 6}s`;
      el.style.fontSize = `${0.95 + Math.random() * 0.7}rem`;
      fallLayer.appendChild(el);
    }
  }

  function burstConfetti() {
    const { w, h } = viewSize();
    const count = reduceMotion ? 12 : 22;
    for (let i = 0; i < count; i += 1) {
      confetti.push({
        x: w * 0.5 + (Math.random() - 0.5) * 80,
        y: h * 0.42,
        vx: (Math.random() - 0.5) * 7.5,
        vy: -Math.random() * 8 - 3,
        w: 4 + Math.random() * 5,
        h: 7 + Math.random() * 6,
        rot: Math.random() * Math.PI,
        vr: (Math.random() - 0.5) * 0.18,
        color: COLORS[i % COLORS.length],
        life: 1,
      });
    }
  }

  function drawHeart(ctx, x, y, size, color, alpha) {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(size, size);
    ctx.globalAlpha = alpha;
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(0, 0.35);
    ctx.bezierCurveTo(-0.55, -0.25, -1.15, 0.45, 0, 1.15);
    ctx.bezierCurveTo(1.15, 0.45, 0.55, -0.25, 0, 0.35);
    ctx.fill();
    ctx.restore();
  }

  function sampleLine(x1, y1, x2, y2, n) {
    const pts = [];
    for (let i = 0; i <= n; i += 1) {
      const t = i / n;
      pts.push({ x: x1 + (x2 - x1) * t, y: y1 + (y2 - y1) * t });
    }
    return pts;
  }

  function sampleQuad(x1, y1, cx, cy, x2, y2, n) {
    const pts = [];
    for (let i = 0; i <= n; i += 1) {
      const t = i / n;
      const u = 1 - t;
      pts.push({
        x: u * u * x1 + 2 * u * t * cx + t * t * x2,
        y: u * u * y1 + 2 * u * t * cy + t * t * y2,
      });
    }
    return pts;
  }

  function janaPaths(width, height) {
    const letters = [
      [
        sampleLine(0.12, 0.16, 0.86, 0.16, 10),
        sampleLine(0.66, 0.16, 0.66, 0.7, 12),
        sampleQuad(0.66, 0.7, 0.58, 0.96, 0.1, 0.8, 12),
      ],
      [
        sampleLine(0.08, 0.9, 0.5, 0.12, 14),
        sampleLine(0.5, 0.12, 0.92, 0.9, 14),
        sampleLine(0.28, 0.58, 0.72, 0.58, 8),
      ],
      [
        sampleLine(0.14, 0.9, 0.14, 0.12, 14),
        sampleLine(0.14, 0.12, 0.86, 0.9, 16),
        sampleLine(0.86, 0.9, 0.86, 0.12, 14),
      ],
      [
        sampleLine(0.08, 0.9, 0.5, 0.12, 14),
        sampleLine(0.5, 0.12, 0.92, 0.9, 14),
        sampleLine(0.28, 0.58, 0.72, 0.58, 8),
      ],
    ];

    const gap = width * 0.035;
    const letterW = (width - gap * 3) / 4;
    const pts = [];
    letters.forEach((strokes, i) => {
      const ox = i * (letterW + gap);
      strokes.forEach((stroke) => {
        stroke.forEach((p) => {
          pts.push({
            x: ox + p.x * letterW,
            y: p.y * height,
          });
        });
      });
    });
    return pts;
  }

  function writeNameWithHearts() {
    resizeName();
    const w = nameCanvas.clientWidth;
    const h = nameCanvas.clientHeight;
    const path = janaPaths(w, h);
    hearts = path.map((p, i) => ({
      tx: p.x,
      ty: p.y,
      x: p.x + (Math.random() - 0.5) * 18,
      y: p.y - 28 - Math.random() * 36,
        size: 6.4 + (i % 3),
        color: i % 3 === 0 ? "#ff6b81" : "#e45a73",
      born: performance.now() + i * 28,
      visible: false,
    }));
    animatingHearts = true;
  }

  function tickFx(now) {
    fxCtx.clearRect(0, 0, fx.clientWidth, fx.clientHeight);
    confetti = confetti.filter((p) => p.life > 0.04);
    confetti.forEach((p) => {
      p.vy += 0.12;
      p.x += p.vx;
      p.y += p.vy;
      p.rot += p.vr;
      p.life *= 0.992;
      fxCtx.save();
      fxCtx.translate(p.x, p.y);
      fxCtx.rotate(p.rot);
      fxCtx.globalAlpha = Math.max(p.life, 0);
      fxCtx.fillStyle = p.color;
      fxCtx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
      fxCtx.restore();
    });

    if (animatingHearts) {
      nameCtx.clearRect(0, 0, nameCanvas.clientWidth, nameCanvas.clientHeight);
      hearts.forEach((heart) => {
        if (now >= heart.born) heart.visible = true;
        if (!heart.visible) return;
        heart.x += (heart.tx - heart.x) * 0.12;
        heart.y += (heart.ty - heart.y) * 0.12;
        const pulse = 1 + Math.sin(now / 280 + heart.tx) * 0.08;
        drawHeart(nameCtx, heart.x, heart.y, heart.size * pulse, heart.color, 0.95);
      });
    }

    fxRaf = requestAnimationFrame(tickFx);
  }

  fxRaf = requestAnimationFrame(tickFx);

  function blowOut() {
    if (blown) return;
    blown = true;
    document.body.classList.add("is-blown");
    wishBtn.disabled = true;
    cake.setAttribute("aria-label", "Candles are out");
    finalLine.classList.add("is-in");
  }

  cake.addEventListener("click", blowOut);
  wishBtn.addEventListener("click", blowOut);

  async function playTimeline() {
    document.body.classList.add("is-unwrapping");
    openBtn.disabled = true;

    await wait(1800);
    flash.classList.add("is-on");
    burstConfetti();
    spawnBalloons();
    spawnFalling();

    await wait(500);
    giftScene.hidden = true;
    celebrateScene.hidden = false;
    resizeName();
    revealTitle("Happy Birthday to you");

    await wait(2200);
    writeNameWithHearts();

    await wait(2800);
    cakeArea.hidden = false;
    cakeArea.classList.add("is-in");
  }

  async function openGift() {
    if (opened) return;
    opened = true;
    await startMusic();
    if (reduceMotion) {
      giftScene.hidden = true;
      celebrateScene.hidden = false;
      titleEl.textContent = "Happy Birthday to you";
      writeNameWithHearts();
      cakeArea.hidden = false;
      cakeArea.classList.add("is-in");
      spawnFalling();
      return;
    }
    await playTimeline();
  }

  openBtn.addEventListener("click", openGift);

  window.addEventListener("pagehide", () => {
    cancelAnimationFrame(fxRaf);
    if (synth) synth.stop();
  });
})();

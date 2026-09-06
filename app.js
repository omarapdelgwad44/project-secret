(() => {
  const cfg = window.GIFT;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const wait = (ms) => new Promise((r) => setTimeout(r, reduce ? 0 : ms));

  const welcome = document.getElementById("welcome");
  const letter = document.getElementById("letter");
  const finale = document.getElementById("finale");
  const parcel = document.getElementById("parcel");
  const untieBtn = document.getElementById("untieBtn");
  const surpriseBtn = document.getElementById("surpriseBtn");
  const replayBtn = document.getElementById("replayBtn");
  const musicBtn = document.getElementById("musicBtn");
  const musicLabel = document.getElementById("musicLabel");
  const letterBody = document.getElementById("letterBody");
  const petals = document.getElementById("petals");
  const fx = document.getElementById("fx");
  const audio = document.getElementById("bgAudio");
  const nameCanvas = document.getElementById("nameCanvas");
  const photo = document.getElementById("photo");
  const photoFallback = document.getElementById("photoFallback");
  const ctx = fx.getContext("2d");
  const nameCtx = nameCanvas.getContext("2d");

  let musicOn = false;
  let busy = false;
  let bits = [];
  let hearts = [];
  let writing = false;

  document.title = cfg.pageTitle;
  document.querySelector('meta[name="description"]').setAttribute("content", cfg.description);
  document.getElementById("welcomeTitle").textContent = cfg.welcome;
  document.getElementById("dateLabel").textContent = cfg.date;
  untieBtn.textContent = cfg.untie;
  document.getElementById("letterTitle").textContent = cfg.letterTitle;
  surpriseBtn.textContent = cfg.openSurprise;
  document.getElementById("finaleTitle").textContent = cfg.finaleTitle;
  document.getElementById("nameText").textContent = cfg.name;
  const finaleMsg = document.getElementById("finaleMessage");
  finaleMsg.textContent = cfg.finaleMessage;
  finaleMsg.lang = cfg.finaleMessageLang || "ar";
  finaleMsg.dir = cfg.finaleMessageLang === "ar" ? "rtl" : "ltr";
  replayBtn.textContent = cfg.replay;

  if (cfg.photo) {
    photo.src = cfg.photo;
    photo.alt = cfg.photoAlt;
    photo.hidden = false;
    photoFallback.hidden = true;
  }

  const mp3 = document.createElement("source");
  mp3.src = cfg.musicSrc;
  mp3.type = "audio/mpeg";
  audio.appendChild(mp3);
  if (cfg.musicFallback) {
    const wav = document.createElement("source");
    wav.src = cfg.musicFallback;
    wav.type = "audio/wav";
    audio.appendChild(wav);
  }
  audio.volume = 0.38;

  function show(scene) {
    [welcome, letter, finale].forEach((el) => {
      const on = el === scene;
      el.hidden = !on;
      el.classList.toggle("is-active", on);
    });
  }

  function resizeFx() {
    fx.width = Math.floor(innerWidth * devicePixelRatio);
    fx.height = Math.floor(innerHeight * devicePixelRatio);
    fx.style.width = `${innerWidth}px`;
    fx.style.height = `${innerHeight}px`;
    ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
  }

  function resizeName() {
    const box = nameCanvas.parentElement.getBoundingClientRect();
    nameCanvas.width = Math.floor(box.width * devicePixelRatio);
    nameCanvas.height = Math.floor(box.height * devicePixelRatio);
    nameCanvas.style.width = `${box.width}px`;
    nameCanvas.style.height = `${box.height}px`;
    nameCtx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
  }

  window.addEventListener("resize", () => {
    resizeFx();
    if (!finale.hidden) resizeName();
  });
  resizeFx();

  function burst() {
    const n = reduce || innerWidth < 500 ? 16 : 42;
    for (let i = 0; i < n; i += 1) {
      bits.push({
        x: innerWidth / 2,
        y: innerHeight * 0.38,
        vx: (Math.random() - 0.5) * 6,
        vy: -Math.random() * 6 - 2,
        r: 2 + Math.random() * 3,
        rot: Math.random() * 6,
        vr: (Math.random() - 0.5) * 0.12,
        color: ["#7a2436", "#c98490", "#c9a06a", "#e9c7cc"][i % 4],
        life: 1,
      });
    }
  }

  function rain() {
    const n = reduce ? 4 : 12;
    for (let i = 0; i < n; i += 1) {
      const p = document.createElement("span");
      p.className = "petal";
      p.style.left = `${8 + Math.random() * 84}vw`;
      p.style.background = i % 2 ? "#c98490" : "#7a2436";
      p.style.animationDuration = `${5 + Math.random() * 4}s`;
      p.style.animationDelay = `${Math.random()}s`;
      petals.appendChild(p);
    }
  }

  function tick() {
    ctx.clearRect(0, 0, fx.clientWidth, fx.clientHeight);
    bits = bits.filter((b) => b.life > 0.05);
    bits.forEach((b) => {
      b.vy += 0.11;
      b.x += b.vx;
      b.y += b.vy;
      b.rot += b.vr;
      b.life *= 0.988;
      ctx.save();
      ctx.translate(b.x, b.y);
      ctx.rotate(b.rot);
      ctx.globalAlpha = b.life;
      ctx.fillStyle = b.color;
      ctx.beginPath();
      ctx.ellipse(0, 0, b.r, b.r * 1.6, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });
    if (writing) drawHearts();
    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);

  function sample(x1, y1, x2, y2, n) {
    const pts = [];
    for (let i = 0; i <= n; i += 1) {
      const t = i / n;
      pts.push({ x: x1 + (x2 - x1) * t, y: y1 + (y2 - y1) * t });
    }
    return pts;
  }

  function namePath(w, h) {
    const letters = [
      [sample(0.12, 0.18, 0.86, 0.18, 8), sample(0.66, 0.18, 0.66, 0.7, 10), sample(0.66, 0.7, 0.12, 0.82, 8)],
      [sample(0.1, 0.88, 0.5, 0.14, 12), sample(0.5, 0.14, 0.9, 0.88, 12), sample(0.28, 0.58, 0.72, 0.58, 6)],
      [sample(0.16, 0.88, 0.16, 0.14, 12), sample(0.16, 0.14, 0.84, 0.88, 14), sample(0.84, 0.88, 0.84, 0.14, 12)],
      [sample(0.1, 0.88, 0.5, 0.14, 12), sample(0.5, 0.14, 0.9, 0.88, 12), sample(0.28, 0.58, 0.72, 0.58, 6)],
    ];
    const gap = w * 0.04;
    const lw = (w - gap * 3) / 4;
    const pts = [];
    letters.forEach((strokes, i) => {
      strokes.forEach((s) => {
        s.forEach((p) => pts.push({ x: i * (lw + gap) + p.x * lw, y: p.y * h }));
      });
    });
    return pts;
  }

  function heart(c, x, y, s, color) {
    c.save();
    c.translate(x, y);
    c.scale(s, s);
    c.fillStyle = color;
    c.beginPath();
    c.moveTo(0, 0.35);
    c.bezierCurveTo(-0.55, -0.25, -1.15, 0.45, 0, 1.15);
    c.bezierCurveTo(1.15, 0.45, 0.55, -0.25, 0, 0.35);
    c.fill();
    c.restore();
  }

  function writeName() {
    resizeName();
    const path = namePath(nameCanvas.clientWidth, nameCanvas.clientHeight);
    const now = performance.now();
    hearts = path.map((p, i) => ({
      ...p,
      x: p.x,
      y: p.y,
      tx: p.x,
      ty: p.y,
      born: now + i * 22,
      size: 5.2,
      color: i % 2 ? "#c98490" : "#7a2436",
      on: false,
    }));
    writing = true;
  }

  function drawHearts() {
    const now = performance.now();
    nameCtx.clearRect(0, 0, nameCanvas.clientWidth, nameCanvas.clientHeight);
    hearts.forEach((h) => {
      if (now >= h.born) h.on = true;
      if (h.on) heart(nameCtx, h.tx, h.ty, h.size, h.color);
    });
  }

  async function typewrite(text) {
    letterBody.textContent = "";
    if (reduce) {
      letterBody.textContent = text;
      return;
    }
    for (const ch of text) {
      letterBody.textContent += ch;
      await wait(ch === "\n" ? 180 : 28);
    }
  }

  async function untie() {
    if (busy) return;
    busy = true;
    parcel.classList.add("is-untying");
    untieBtn.disabled = true;
    burst();
    rain();
    await wait(1150);
    show(letter);
    await typewrite(cfg.letterBody);
    surpriseBtn.hidden = false;
    busy = false;
  }

  function openFinale() {
    show(finale);
    burst();
    writeName();
  }

  function replay() {
    busy = false;
    writing = false;
    hearts = [];
    bits = [];
    petals.innerHTML = "";
    parcel.classList.remove("is-untying");
    untieBtn.disabled = false;
    surpriseBtn.hidden = true;
    letterBody.textContent = "";
    show(welcome);
  }

  async function toggleMusic() {
    musicOn = !musicOn;
    musicBtn.setAttribute("aria-pressed", String(musicOn));
    musicBtn.setAttribute("aria-label", musicOn ? "Pause music" : "Play music");
    musicLabel.textContent = musicOn ? "On" : "Music";
    if (musicOn) {
      try {
        await audio.play();
      } catch {
        musicOn = false;
      }
    } else {
      audio.pause();
    }
  }

  untieBtn.addEventListener("click", untie);
  surpriseBtn.addEventListener("click", openFinale);
  replayBtn.addEventListener("click", replay);
  musicBtn.addEventListener("click", toggleMusic);
})();

(() => {
  const plugins = [window.DrawSVGPlugin, window.MotionPathPlugin].filter(Boolean);
  if (plugins.length) gsap.registerPlugin(...plugins);

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const $ = (id) => document.getElementById(id);

  const openBtn = $("openBtn");
  const prevBtn = $("prevBtn");
  const nextBtn = $("nextBtn");
  const wishBtn = $("wishBtn");
  const soundToggle = $("soundToggle");
  const giftScene = $("giftScene");
  const bookScene = $("bookScene");
  const storybook = $("storybook");
  const flipbookEl = $("flipbook");
  const flash = $("flash");
  const fallLayer = $("fallLayer");
  const balloonsEl = $("balloons");
  const fx = $("fx");
  const bgAudio = $("bgAudio");
  const flames = document.querySelector(".svg-flames");
  const finalLine = $("finalLine");

  const fxCtx = fx.getContext("2d");
  const COLORS = ["#e8c872", "#f7efe6", "#e8b4b8", "#d24a62", "#f0d58a"];

  let muted = false;
  let opened = false;
  let pageFlip = null;
  let currentPage = 0;
  let synth = null;
  let confetti = [];
  let fxRaf = 0;
  const drawn = { 1: false, 2: false, 3: false };

  function hideStroke(el) {
    try {
      gsap.set(el, { drawSVG: "0%", fillOpacity: 0 });
    } catch {
      let len = 320;
      try { len = el.getTotalLength(); } catch { /* ignore */ }
      el.style.strokeDasharray = `${len}`;
      el.style.strokeDashoffset = `${len}`;
      el.style.fillOpacity = "0";
    }
  }

  function prepareArt(svg) {
    svg.querySelectorAll("[data-draw]").forEach(hideStroke);
  }

  document.querySelectorAll(".art").forEach(prepareArt);
  gsap.set(".hb-line, .jana-line, .final-line", { opacity: 0, y: 8 });

  function resizeFx() {
    fx.width = Math.floor(window.innerWidth * devicePixelRatio);
    fx.height = Math.floor(window.innerHeight * devicePixelRatio);
    fx.style.width = `${window.innerWidth}px`;
    fx.style.height = `${window.innerHeight}px`;
    fxCtx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
  }
  window.addEventListener("resize", resizeFx);
  resizeFx();

  function updateNav(page) {
    currentPage = page;
    prevBtn.classList.toggle("is-off", page <= 0);
    const waitingWish = page === 2 && !wishBtn.disabled;
    nextBtn.classList.toggle("is-off", page >= 3 || waitingWish);
    nextBtn.setAttribute("aria-label", page <= 0 ? "Open the book" : "Next page");
    if (page === 2 && drawn[2] && !wishBtn.disabled) {
      wishBtn.classList.remove("hidden");
    } else {
      wishBtn.classList.add("hidden");
    }
  }

  /* ── Audio ──────────────────────────────── */
  function createSynth() {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return null;
    const ctx = new AudioCtx();
    const master = ctx.createGain();
    master.gain.value = 0.18;
    master.connect(ctx.destination);
    const notes = [659.25, 783.99, 1046.5, 783.99, 659.25, 587.33, 523.25, 0];
    let timer = null;
    let index = 0;
    function pluck(freq, when) {
      if (!freq) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, when);
      gain.gain.setValueAtTime(0.0001, when);
      gain.gain.exponentialRampToValueAtTime(0.4, when + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, when + 1.1);
      osc.connect(gain);
      gain.connect(master);
      osc.start(when);
      osc.stop(when + 1.2);
    }
    function loop() {
      const now = ctx.currentTime;
      for (let i = 0; i < 8; i += 1) {
        pluck(notes[index], now + i * 0.42);
        index = (index + 1) % notes.length;
      }
    }
    return {
      start() {
        if (ctx.state === "suspended") ctx.resume();
        if (timer) return;
        loop();
        timer = setInterval(loop, 3360);
      },
      stop() {
        if (timer) clearInterval(timer);
        timer = null;
      },
      setMuted(v) {
        master.gain.setTargetAtTime(v ? 0 : 0.18, ctx.currentTime, 0.05);
      },
    };
  }

  async function startMusic() {
    soundToggle.hidden = false;
    bgAudio.volume = 0.42;
    bgAudio.loop = true;
    try {
      await bgAudio.play();
    } catch {
      synth = synth || createSynth();
      if (synth) synth.start();
    }
  }

  function setMuted(next) {
    muted = next;
    soundToggle.setAttribute("aria-pressed", String(muted));
    soundToggle.setAttribute("aria-label", muted ? "Unmute music" : "Mute music");
    bgAudio.muted = muted;
    if (synth) synth.setMuted(muted);
  }
  soundToggle.addEventListener("click", () => setMuted(!muted));

  /* ── Magic brush drawing ────────────────── */
  function moveBrush(brush, path, progress) {
    try {
      const len = path.getTotalLength();
      const pt = path.getPointAtLength(Math.max(0, Math.min(1, progress)) * len);
      const svg = path.ownerSVGElement;
      const box = svg.viewBox.baseVal;
      gsap.set(brush, {
        left: `${(pt.x / box.width) * 100}%`,
        top: `${(pt.y / box.height) * 100}%`,
      });
    } catch {
      /* ignore non-path nodes */
    }
  }

  function drawWithBrush(pageEl, onDone) {
    const svg = pageEl.querySelector(".art");
    const brush = pageEl.querySelector("[data-brush]");
    const items = [...svg.querySelectorAll("[data-draw]")];
    prepareArt(svg);
    gsap.set(brush, { opacity: 1 });

    const tl = gsap.timeline({
      onComplete() {
        gsap.to(brush, { opacity: 0, duration: 0.35 });
        if (onDone) onDone();
      },
    });

    items.forEach((el) => {
      const dur = Number(el.dataset.dur) || 0.7;
      const proxy = { p: 0 };
      tl.to(
        el,
        { drawSVG: "100%", duration: dur, ease: "none" },
        items.indexOf(el) === 0 ? 0 : ">"
      );
      tl.to(
        proxy,
        {
          p: 1,
          duration: dur,
          ease: "none",
          onUpdate() {
            moveBrush(brush, el, proxy.p);
          },
        },
        "<"
      );
      if (el.dataset.fill === "1") {
        tl.to(el, {
          fillOpacity: Number(el.dataset.fillOpacity || 0.4),
          duration: 0.28,
        }, ">-0.12");
      }
    });
    return tl;
  }

  function drawPage1() {
    if (drawn[1]) return;
    drawn[1] = true;
    const page = document.querySelectorAll("#flipbook .page")[1];
    const tl = gsap.timeline();
    tl.add(drawWithBrush(page));
    tl.to(".hb-line", { opacity: 1, y: 0, duration: 0.55 }, ">-0.1");
    tl.fromTo(".jana-line", { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" }, "<0.15");
    tl.add(() => updateNav(1));
  }

  function drawPage2() {
    if (drawn[2]) return;
    drawn[2] = true;
    const page = document.querySelectorAll("#flipbook .page")[2];
    const tl = gsap.timeline();
    tl.add(drawWithBrush(page));
    tl.to(flames, { opacity: 1, duration: 0.4 });
    tl.add(() => updateNav(2));
  }

  function drawPage3() {
    if (drawn[3]) return;
    drawn[3] = true;
    const page = document.querySelectorAll("#flipbook .page")[3];
    const tl = gsap.timeline();
    tl.add(drawWithBrush(page));
    tl.to(finalLine, { opacity: 1, duration: 1.1 });
    tl.add(() => {
      burstConfetti();
      spawnBalloons();
      spawnFalling();
    }, ">-0.2");
  }

  /* ── Flipbook ───────────────────────────── */
  function initFlipbook() {
    if (pageFlip || !window.St) return;
    const w = Math.max(260, Math.round(storybook.clientWidth));
    const h = Math.max(400, Math.round(storybook.clientHeight));
    pageFlip = new St.PageFlip(flipbookEl, {
      width: w,
      height: h,
      size: "stretch",
      minWidth: 240,
      maxWidth: 420,
      minHeight: 380,
      maxHeight: 640,
      showCover: true,
      usePortrait: true,
      flippingTime: reduceMotion ? 200 : 1100,
      maxShadowOpacity: 0.45,
      drawShadow: true,
      useMouseEvents: false,
      swipeDistance: 4000,
      mobileScrollSupport: false,
      startZIndex: 1,
    });
    pageFlip.loadFromHTML(document.querySelectorAll("#flipbook .page"));
    pageFlip.on("flip", (e) => {
      currentPage = e.data;
      updateNav(currentPage);
      if (currentPage === 1) setTimeout(drawPage1, 280);
      if (currentPage === 2) setTimeout(drawPage2, 280);
      if (currentPage === 3) setTimeout(drawPage3, 280);
    });
  }

  function flipTo(index) {
    if (!pageFlip || index === currentPage) return;
    pageFlip.flip(index, "bottom");
  }

  /* ── Celebration ────────────────────────── */
  function spawnBalloons() {
    const palette = ["#e8b4b8", "#f7efe6", "#e8c872", "#d24a62", "#f3c9d0"];
    for (let i = 0; i < 5; i += 1) {
      const b = document.createElement("span");
      b.className = "balloon";
      b.style.left = `${8 + Math.random() * 76}vw`;
      b.style.background = `linear-gradient(160deg, #fff6, ${palette[i % palette.length]})`;
      b.style.animationDelay = `${i * 0.22}s`;
      balloonsEl.appendChild(b);
    }
  }

  function spawnFalling() {
    const glyphs = ["🌹", "💗", "🤍", "✨", "🌷"];
    for (let i = 0; i < 10; i += 1) {
      const el = document.createElement("span");
      el.className = "petal";
      el.textContent = glyphs[i % glyphs.length];
      el.style.left = `${4 + Math.random() * 88}vw`;
      el.style.animationDelay = `${Math.random() * 2.4}s`;
      el.style.animationDuration = `${6 + Math.random() * 6}s`;
      fallLayer.appendChild(el);
    }
  }

  function burstConfetti() {
    for (let i = 0; i < 28; i += 1) {
      confetti.push({
        x: window.innerWidth * 0.5 + (Math.random() - 0.5) * 80,
        y: window.innerHeight * 0.38,
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

  function tickFx() {
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
    fxRaf = requestAnimationFrame(tickFx);
  }
  fxRaf = requestAnimationFrame(tickFx);

  /* ── Timeline ───────────────────────────── */
  openBtn.addEventListener("click", async () => {
    if (opened) return;
    opened = true;
    openBtn.disabled = true;
    await startMusic();
    document.body.classList.add("is-unwrapping");
    flash.classList.add("is-on");
    await new Promise((r) => setTimeout(r, reduceMotion ? 200 : 2200));
    giftScene.hidden = true;
    bookScene.hidden = false;
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        initFlipbook();
        updateNav(0);
      });
    });
  });

  prevBtn.addEventListener("click", () => {
    if (currentPage > 0) flipTo(currentPage - 1);
  });
  nextBtn.addEventListener("click", () => {
    if (currentPage >= 3) return;
    if (currentPage === 2 && !wishBtn.disabled) return;
    flipTo(currentPage + 1);
  });
  wishBtn.addEventListener("click", () => {
    wishBtn.disabled = true;
    wishBtn.classList.add("hidden");
    gsap.to(flames, {
      opacity: 0,
      scale: 0.15,
      transformOrigin: "50% 80%",
      duration: 0.45,
      ease: "power2.in",
    });
    updateNav(2);
    setTimeout(() => flipTo(3), 700);
  });

  window.addEventListener("pagehide", () => {
    cancelAnimationFrame(fxRaf);
    if (synth) synth.stop();
  });

  const params = new URLSearchParams(location.search);
  if (params.has("book")) {
    opened = true;
    giftScene.hidden = true;
    bookScene.hidden = false;
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        initFlipbook();
        updateNav(0);
        const page = Number(params.get("page") || 0);
        if (page) setTimeout(() => flipTo(page), 500);
      });
    });
  }
})();

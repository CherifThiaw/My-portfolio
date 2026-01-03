const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

const reveals = document.querySelectorAll(".reveal");
if (reveals.length) {
  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      }
    },
    { threshold: 0.12, rootMargin: "0px 0px -10% 0px" },
  );
  reveals.forEach((el) => io.observe(el));
}

const pubTrigger = document.getElementById("pubTrigger");
const pubMenu = document.getElementById("pubMenu");

if (pubTrigger && pubMenu) {
  const dropdown = pubTrigger.closest(".nav-dropdown");

  const close = () => {
    if (!dropdown) return;
    dropdown.classList.remove("open");
    pubTrigger.setAttribute("aria-expanded", "false");
  };

  pubTrigger.addEventListener("click", (e) => {
    e.stopPropagation();
    if (!dropdown) return;
    const open = dropdown.classList.toggle("open");
    pubTrigger.setAttribute("aria-expanded", String(open));
  });

  pubMenu.addEventListener("click", (e) => e.stopPropagation());
  document.addEventListener("click", close);
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") close();
  });
}

const reactButtons = document.querySelectorAll(".pub-react");
const hintKey = "sparkHintHidden:v1";

const keyFor = (id) => `spark:${id}`;
const readCount = (id) => Number(localStorage.getItem(keyFor(id)) || 0);
const writeCount = (id, n) => localStorage.setItem(keyFor(id), String(n));

const setCount = (btn, n) => {
  const el = btn.querySelector(".pub-react-count");
  if (el) el.textContent = String(n);
};

const ensureRel = (btn) => {
  const cs = getComputedStyle(btn);
  if (cs.position === "static") btn.style.position = "relative";
};

const pop = (btn) => {
  btn.classList.remove("pop");
  void btn.offsetWidth;
  btn.classList.add("pop");
};

const floatPlusOne = (btn) => {
  const s = document.createElement("span");
  s.className = "pub-float";
  s.textContent = "+1";
  btn.appendChild(s);
  s.addEventListener("animationend", () => s.remove());
};

const sparkBurst = (btn, power = 1) => {
  ensureRel(btn);

  const burst = document.createElement("div");
  burst.style.position = "absolute";
  burst.style.inset = "0";
  burst.style.pointerEvents = "none";
  burst.style.overflow = "visible";
  btn.appendChild(burst);

  const count = Math.round(8 + 6 * power);
  for (let i = 0; i < count; i++) {
    const p = document.createElement("span");
    p.textContent = "✦";
    p.style.position = "absolute";
    p.style.left = "50%";
    p.style.top = "50%";
    p.style.transform = "translate(-50%, -50%)";
    p.style.opacity = "0.95";
    p.style.fontSize = `${0.75 + Math.random() * 0.35}rem`;
    p.style.filter = "drop-shadow(0 0 10px rgba(124,108,255,.28))";

    const angle = Math.random() * Math.PI * 2;
    const dist = (14 + Math.random() * 18) * (0.9 + 0.35 * power);
    const dx = Math.cos(angle) * dist;
    const dy = Math.sin(angle) * dist;

    p.animate(
      [
        { transform: "translate(-50%, -50%) scale(1)", opacity: 0.95 },
        {
          transform: `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px)) scale(0.7)`,
          opacity: 0,
        },
      ],
      {
        duration: 520 + Math.random() * 160,
        easing: "cubic-bezier(.2,.9,.2,1)",
      },
    );

    burst.appendChild(p);
  }

  setTimeout(() => burst.remove(), 780);
};

const toast = (btn, msg) => {
  ensureRel(btn);

  const t = document.createElement("div");
  t.textContent = msg;
  t.style.position = "absolute";
  t.style.right = "8px";
  t.style.top = "-34px";
  t.style.padding = "6px 10px";
  t.style.borderRadius = "999px";
  t.style.fontSize = "0.82rem";
  t.style.fontWeight = "800";
  t.style.background = "rgba(255,255,255,.08)";
  t.style.border = "1px solid rgba(255,255,255,.14)";
  t.style.backdropFilter = "blur(10px)";
  t.style.webkitBackdropFilter = "blur(10px)";
  t.style.color = "rgba(233,236,246,.92)";
  t.style.pointerEvents = "none";
  t.style.opacity = "0";
  t.style.transform = "translateY(6px)";
  btn.appendChild(t);

  t.animate(
    [
      { opacity: 0, transform: "translateY(6px)" },
      { opacity: 1, transform: "translateY(0px)" },
      { opacity: 0, transform: "translateY(-6px)" },
    ],
    { duration: 1100, easing: "cubic-bezier(.2,.9,.2,1)" },
  );

  setTimeout(() => t.remove(), 1120);
};

reactButtons.forEach((btn) => {
  const item = btn.closest(".pub-item");
  if (!item) return;

  const id = item.getAttribute("data-id");
  if (!id) return;

  setCount(btn, readCount(id));

  const hint = btn.querySelector(".pub-react-hint");
  const hintHidden = localStorage.getItem(hintKey) === "1";
  if (hint && hintHidden) hint.style.display = "none";

  let locked = false;

  btn.addEventListener("click", () => {
    if (locked) return;
    locked = true;

    const next = readCount(id) + 1;
    writeCount(id, next);
    setCount(btn, next);

    pop(btn);
    floatPlusOne(btn);

    const power = next % 25 === 0 ? 2.2 : next % 10 === 0 ? 1.4 : 1;
    sparkBurst(btn, power);

    if (next % 25 === 0) toast(btn, "LEGEND ✦");
    else if (next % 10 === 0) toast(btn, "Nice ✦");
    else if (next === 1) toast(btn, "Sparked!");

    if (hint) {
      hint.style.display = "none";
      localStorage.setItem(hintKey, "1");
    }

    setTimeout(() => (locked = false), 220);
  });

  btn.addEventListener("dblclick", (e) => {
    e.preventDefault();
    toast(btn, "✨✨✨");
    sparkBurst(btn, 2.0);
  });
});

const palette = document.getElementById("palette");
const paletteBackdrop = document.getElementById("paletteBackdrop");
const paletteInput = document.getElementById("paletteInput");
const paletteList = document.getElementById("paletteList");

const actions = [
  {
    title: "Go to About",
    sub: "Jump to About section",
    chip: "Navigate",
    run: () => (location.href = "index.html#about"),
  },
  {
    title: "Go to Projects",
    sub: "Jump to Projects section",
    chip: "Navigate",
    run: () => (location.href = "index.html#projects"),
  },
  {
    title: "Go to Skills",
    sub: "Jump to Skills section",
    chip: "Navigate",
    run: () => (location.href = "index.html#skills"),
  },
  {
    title: "Go to Contact",
    sub: "Jump to Contact section",
    chip: "Navigate",
    run: () => (location.href = "index.html#contact"),
  },
  {
    title: "Open Publications",
    sub: "papers.html",
    chip: "Page",
    run: () => (location.href = "papers.html#top"),
  },
  {
    title: "Copy Email",
    sub: "Copies your email to clipboard",
    chip: "Utility",
    run: async () => {
      const email = "yourname@email.com";
      try {
        await navigator.clipboard.writeText(email);
        toastMini("Email copied");
      } catch {
        toastMini("Copy failed");
      }
    },
  },
];

let filtered = [...actions];
let activeIndex = 0;

function renderPalette() {
  paletteList.innerHTML = "";
  filtered.forEach((a, i) => {
    const li = document.createElement("li");
    li.className = "palette-item" + (i === activeIndex ? " active" : "");
    li.innerHTML = `
      <div class="palette-left">
        <div class="palette-title">${a.title}</div>
        <div class="palette-sub">${a.sub}</div>
      </div>
      <div class="palette-chip">${a.chip}</div>
    `;
    li.addEventListener("click", () => runAction(i));
    paletteList.appendChild(li);
  });
}

function openPalette() {
  if (!palette) return;
  palette.classList.add("open");
  palette.setAttribute("aria-hidden", "false");
  activeIndex = 0;
  filtered = [...actions];
  renderPalette();
  setTimeout(() => paletteInput && paletteInput.focus(), 0);
}

function closePalette() {
  if (!palette) return;
  palette.classList.remove("open");
  palette.setAttribute("aria-hidden", "true");
  if (paletteInput) paletteInput.value = "";
}

function runAction(i) {
  const a = filtered[i];
  if (!a) return;
  closePalette();
  a.run();
}

function updateFilter(q) {
  const query = q.trim().toLowerCase();
  filtered = actions.filter(
    (a) =>
      a.title.toLowerCase().includes(query) ||
      a.sub.toLowerCase().includes(query) ||
      a.chip.toLowerCase().includes(query),
  );
  activeIndex = 0;
  renderPalette();
}

function toastMini(msg) {
  const t = document.createElement("div");
  t.textContent = msg;
  t.style.position = "fixed";
  t.style.left = "50%";
  t.style.bottom = "22px";
  t.style.transform = "translateX(-50%)";
  t.style.padding = "10px 12px";
  t.style.borderRadius = "999px";
  t.style.background = "rgba(10,14,25,.82)";
  t.style.border = "1px solid rgba(255,255,255,.14)";
  t.style.backdropFilter = "blur(12px)";
  t.style.webkitBackdropFilter = "blur(12px)";
  t.style.color = "rgba(233,236,246,.92)";
  t.style.fontWeight = "800";
  t.style.fontSize = ".9rem";
  t.style.zIndex = "400";
  document.body.appendChild(t);
  t.animate(
    [
      { opacity: 0, transform: "translateX(-50%) translateY(8px)" },
      { opacity: 1, transform: "translateX(-50%) translateY(0)" },
      { opacity: 0, transform: "translateX(-50%) translateY(-8px)" },
    ],
    { duration: 1100, easing: "cubic-bezier(.2,.9,.2,1)" },
  );
  setTimeout(() => t.remove(), 1120);
}
//Need to increase the run time of the matrix!!!!
document.addEventListener("keydown", (e) => {
  const isK = e.key.toLowerCase() === "k";
  const mod = e.ctrlKey || e.metaKey;

  if (mod && isK) {
    e.preventDefault();
    if (palette.classList.contains("open")) closePalette();
    else openPalette();
  }

  if (!palette.classList.contains("open")) return;

  if (e.key === "Escape") closePalette();

  if (e.key === "ArrowDown") {
    e.preventDefault();
    activeIndex = Math.min(activeIndex + 1, filtered.length - 1);
    renderPalette();
  }

  if (e.key === "ArrowUp") {
    e.preventDefault();
    activeIndex = Math.max(activeIndex - 1, 0);
    renderPalette();
  }

  if (e.key === "Enter") {
    e.preventDefault();
    runAction(activeIndex);
  }
});

if (paletteBackdrop) paletteBackdrop.addEventListener("click", closePalette);
if (paletteInput)
  paletteInput.addEventListener("input", (e) => updateFilter(e.target.value));

const spotlightTargets = document.querySelectorAll(
  ".card, .project-card, .contact-card, .pub-item, .pub-link-card",
);

spotlightTargets.forEach((el) => {
  el.addEventListener("mousemove", (e) => {
    const r = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${e.clientX - r.left}px`);
    el.style.setProperty("--my", `${e.clientY - r.top}px`);
  });
});

const konami = [
  "ArrowUp",
  "ArrowUp",
  "ArrowDown",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "ArrowLeft",
  "ArrowRight",
  "b",
  "a",
];
let konamiIndex = 0;
let matrixRunning = false;

function matrixToast(msg) {
  const t = document.createElement("div");
  t.className = "matrix-badge on";
  t.textContent = msg;
  document.body.appendChild(t);
  setTimeout(() => t.classList.remove("on"), 900);
  setTimeout(() => t.remove(), 1200);
}

function startMatrix() {
  if (matrixRunning) return;
  matrixRunning = true;

  const wrap = document.createElement("div");
  wrap.className = "matrix on";

  const canvas = document.createElement("canvas");
  wrap.appendChild(canvas);
  document.body.appendChild(wrap);

  const ctx = canvas.getContext("2d");
  const dpr = Math.max(1, window.devicePixelRatio || 1);

  const resize = () => {
    canvas.width = Math.floor(window.innerWidth * dpr);
    canvas.height = Math.floor(window.innerHeight * dpr);
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  };

  resize();

  const letters = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const fontSize = 16;
  const columns = Math.floor(window.innerWidth / fontSize);
  const drops = Array.from({ length: columns }, () => Math.random() * 60);

  let rafId;

  const draw = () => {
    ctx.fillStyle = "rgba(0,0,0,0.08)";
    ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);

    ctx.font = `700 ${fontSize}px ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace`;
    ctx.fillStyle = "rgba(80,255,160,0.85)";

    for (let i = 0; i < drops.length; i++) {
      const text = letters[Math.floor(Math.random() * letters.length)];
      ctx.fillText(text, i * fontSize, drops[i] * fontSize);

      if (drops[i] * fontSize > window.innerHeight && Math.random() > 0.975) {
        drops[i] = 0;
      }
      drops[i] += 1;
    }

    rafId = requestAnimationFrame(draw);
  };

  draw();
  matrixToast("Matrix mode unlocked");

  const stop = () => {
    cancelAnimationFrame(rafId);
    window.removeEventListener("resize", resize);
    wrap.classList.remove("on");
    setTimeout(() => wrap.remove(), 200);
    matrixRunning = false;
  };

  const esc = (e) => {
    if (e.key === "Escape") {
      document.removeEventListener("keydown", esc);
      stop();
    }
  };

  document.addEventListener("keydown", esc);
  window.addEventListener("resize", resize);

  setTimeout(() => {
    document.removeEventListener("keydown", esc);
    stop();
  }, 3200);
}

document.addEventListener("keydown", (e) => {
  const key = e.key;
  const expected = konami[konamiIndex];

  if (key === expected || key.toLowerCase() === expected) {
    konamiIndex += 1;
    if (konamiIndex === konami.length) {
      konamiIndex = 0;
      startMatrix();
    }
  } else {
    konamiIndex = 0;
  }
});

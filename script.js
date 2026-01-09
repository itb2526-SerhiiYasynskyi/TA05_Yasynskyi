// script.js

/* =========================
   GOOEY NAV (scoped)
========================= */
const nav = document.querySelector(".gooey-nav");
const effectEl = document.querySelector(".effect.filter");
const textEl = document.querySelector(".effect.text");

let animationTime = 600;
let pCount = 15;
const colors = [1, 2, 3, 1, 2, 3, 1, 4];
const timeVariance = 300;

function noise(n = 1) {
  return n / 2 - Math.random() * n;
}

function getXY(distance, pointIndex, totalPoints) {
  const x = distance * Math.cos(((360 + noise(8)) / totalPoints * pointIndex) * Math.PI / 180);
  const y = distance * Math.sin(((360 + noise(8)) / totalPoints * pointIndex) * Math.PI / 180);
  return [x, y];
}

function createParticle(i, t, d, r) {
  let rotate = noise(r / 10);
  let minDistance = d[0];
  let maxDistance = d[1];

  return {
    start: getXY(minDistance, pCount - i, pCount),
    end: getXY(maxDistance + noise(7), pCount - i, pCount),
    time: t,
    scale: 1 + noise(0.2),
    color: colors[Math.floor(Math.random() * colors.length)],
    rotate: rotate > 0 ? (rotate + r / 20) * 10 : (rotate - r / 20) * 10
  };
}

function makeParticles($el) {
  const d = [90, 10];
  const r = 100;

  const bubbleTime = animationTime * 2 + timeVariance;
  $el.style.setProperty("--time", bubbleTime + "ms");

  for (let i = 0; i < pCount; i++) {
    const t = animationTime * 2 + noise(timeVariance * 2);
    const p = createParticle(i, t, d, r);

    $el.classList.remove("active");

    setTimeout(() => {
      const $particle = document.createElement("span");
      const $point = document.createElement("span");

      $particle.classList.add("particle");
      $particle.style.cssText = `
        --start-x: ${p.start[0]}px;
        --start-y: ${p.start[1]}px;
        --end-x: ${p.end[0]}px;
        --end-y: ${p.end[1]}px;
        --time: ${p.time}ms;
        --scale: ${p.scale};
        --color: var(--color-${p.color}, white);
        --rotate: ${p.rotate}deg;
      `;

      $point.classList.add("point");
      $particle.append($point);
      $el.append($particle);

      requestAnimationFrame(() => {
        $el.classList.add("active");
      });

      setTimeout(() => {
        try { $el.removeChild($particle); } catch (e) {}
      }, t);
    }, 30);
  }
}

function updateEffectPosition(element) {
  if (!effectEl || !textEl) return;

  const pos = element.getBoundingClientRect();
  const styles = {
    left: `${pos.x}px`,
    top: `${pos.y}px`,
    width: `${pos.width}px`,
    height: `${pos.height}px`
  };

  Object.assign(effectEl.style, styles);
  Object.assign(textEl.style, styles);
  textEl.innerText = element.innerText;
}

function setActiveItem(li) {
  if (!nav || !effectEl || !textEl) return;

  updateEffectPosition(li);

  if (!li.classList.contains("active")) {
    nav.querySelectorAll("li").forEach(x => x.classList.remove("active"));
    effectEl.querySelectorAll(".particle").forEach(p => effectEl.removeChild(p));

    li.classList.add("active");
    textEl.classList.remove("active");

    setTimeout(() => textEl.classList.add("active"), 100);
    makeParticles(effectEl);
  }
}

if (nav) {
  nav.querySelectorAll("li").forEach((li) => {
    const link = li.querySelector("a");

    li.addEventListener("click", () => setActiveItem(li));

    link?.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        setActiveItem(li);
      }
    });
  });

  const resizeObserver = new ResizeObserver(() => {
    const activeEl = nav.querySelector("li.active");
    if (activeEl) updateEffectPosition(activeEl);
  });
  resizeObserver.observe(document.body);

  // initial
setTimeout(() => {
  const first = nav.querySelector("li");
  if (first) setActiveItem(first);

  // включаем эффекты только после позиционирования
  document.body.classList.add("js-ready");
}, 200);


/* =========================
   SMOOTH SCROLL for menu anchors
========================= */
document.querySelectorAll('.gooey-nav a[href^="#"]').forEach(a => {
  a.addEventListener("click", (e) => {
    const id = a.getAttribute("href");
    const target = document.querySelector(id);
    if (!target) return;

    e.preventDefault();

    const headerOffset = 110; // fixed menu height
    const y = target.getBoundingClientRect().top + window.pageYOffset - headerOffset;

    window.scrollTo({ top: y < 0 ? 0 : y, behavior: "smooth" });
  });
});

/* =========================
   CONTACT FORM (simple)
========================= */
const contactForm = document.getElementById("contactForm");
const statusMsg = document.getElementById("statusMsg");

if (contactForm) {
  contactForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const submitBtn = contactForm.querySelector(".form-submit");
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.style.opacity = "0.7";
      submitBtn.textContent = "Sending...";
    }

    if (statusMsg) statusMsg.textContent = "";

    // fake send (замени на реальный fetch позже)
    setTimeout(() => {
      if (statusMsg) statusMsg.textContent = "Message Sent! ✓";
      contactForm.reset();

      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.style.opacity = "";
        submitBtn.textContent = "Send message";
      }
    }, 900);
  });
}
window.addEventListener("load", () => {
  const canvasDiv = document.getElementById("particle-canvas");
  if (!canvasDiv || typeof ParticleNetwork === "undefined") return;

  // Сделать контейнер точно размером экрана
  canvasDiv.style.width = window.innerWidth + "px";
  canvasDiv.style.height = window.innerHeight + "px";

  const options = {
    particleColor: "#ffffff",
    background: "#191c29",
    interactive: true,
    speed: "medium",
    density: 12000 // важное: ставим числом (равномернее)
  };

  new ParticleNetwork(canvasDiv, options);

  // Форсим canvas на весь экран
  const canvas = canvasDiv.querySelector("canvas");
  if (canvas) {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvas.style.width = "100%";
    canvas.style.height = "100%";
  }

  // И при resize тоже
  window.addEventListener("resize", () => {
    canvasDiv.style.width = window.innerWidth + "px";
    canvasDiv.style.height = window.innerHeight + "px";
    const c = canvasDiv.querySelector("canvas");
    if (c) {
      c.width = window.innerWidth;
      c.height = window.innerHeight;
    }
  });
});


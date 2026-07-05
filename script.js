const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ---------- sticky header ---------- */
const header = document.querySelector("[data-header]");
const updateHeader = () => {
  header?.classList.toggle("is-scrolled", window.scrollY > 24);
};
updateHeader();
window.addEventListener("scroll", updateHeader, { passive: true });

/* ---------- reveal on scroll ---------- */
const revealables = document.querySelectorAll("[data-reveal]");
if ("IntersectionObserver" in window && !reducedMotion) {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("revealed");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.18, rootMargin: "0px 0px -40px 0px" }
  );
  revealables.forEach((el) => revealObserver.observe(el));
} else {
  revealables.forEach((el) => el.classList.add("revealed"));
}

/* ---------- notebook sketch draw-on ---------- */
const sketch = document.querySelector("[data-sketch]");
if (sketch) {
  if ("IntersectionObserver" in window && !reducedMotion) {
    const sketchObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            sketch.classList.add("in-view");
            sketchObserver.disconnect();
          }
        });
      },
      { threshold: 0.35 }
    );
    sketchObserver.observe(sketch);
  } else {
    sketch.classList.add("in-view");
  }
}

/* ---------- animated counters ---------- */
const counters = document.querySelectorAll("[data-count]");
const runCounter = (el) => {
  const target = Number(el.dataset.count);
  const duration = 1400;
  const start = performance.now();
  const tick = (now) => {
    const p = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - p, 3);
    el.textContent = Math.round(target * eased);
    if (p < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
};
if ("IntersectionObserver" in window && !reducedMotion) {
  const counterObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          runCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.6 }
  );
  counters.forEach((el) => counterObserver.observe(el));
} else {
  counters.forEach((el) => (el.textContent = el.dataset.count));
}

/* ---------- 3D tilt cards ---------- */
if (!reducedMotion && window.matchMedia("(pointer: fine)").matches) {
  document.querySelectorAll("[data-tilt]").forEach((card) => {
    let frame = null;
    card.addEventListener("mousemove", (event) => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        const rect = card.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width - 0.5;
        const y = (event.clientY - rect.top) / rect.height - 0.5;
        card.style.transform = `perspective(800px) rotateX(${(-y * 6).toFixed(2)}deg) rotateY(${(x * 8).toFixed(2)}deg) translateY(-4px)`;
        frame = null;
      });
    });
    card.addEventListener("mouseleave", () => {
      card.style.transform = "";
    });
  });
}

/* ---------- hero particles ---------- */
const canvas = document.querySelector("[data-particles]");
if (canvas && !reducedMotion) {
  const ctx = canvas.getContext("2d");
  let particles = [];
  let width = 0;
  let height = 0;

  const resize = () => {
    const rect = canvas.parentElement.getBoundingClientRect();
    width = canvas.width = rect.width;
    height = canvas.height = rect.height;
    const count = Math.min(90, Math.floor((width * height) / 22000));
    particles = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      r: Math.random() * 1.8 + 0.6,
      vx: (Math.random() - 0.5) * 0.25,
      vy: -(Math.random() * 0.3 + 0.08),
      red: Math.random() < 0.22,
      tw: Math.random() * Math.PI * 2,
    }));
  };

  const step = () => {
    ctx.clearRect(0, 0, width, height);
    for (const p of particles) {
      p.x += p.vx;
      p.y += p.vy;
      p.tw += 0.03;
      if (p.y < -8) {
        p.y = height + 8;
        p.x = Math.random() * width;
      }
      if (p.x < -8) p.x = width + 8;
      if (p.x > width + 8) p.x = -8;
      const alpha = 0.35 + Math.sin(p.tw) * 0.25;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.red
        ? `rgba(255, 92, 92, ${alpha})`
        : `rgba(143, 170, 255, ${alpha})`;
      ctx.fill();
    }
    requestAnimationFrame(step);
  };

  resize();
  window.addEventListener("resize", resize);
  requestAnimationFrame(step);
}

/* ---------- contact form ---------- */
const contactForm = document.querySelector("[data-contact-form]");
contactForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  contactForm.reset();
  const done = contactForm.querySelector("[data-form-done]");
  if (done) {
    done.hidden = false;
    setTimeout(() => {
      done.hidden = true;
    }, 5000);
  }
});

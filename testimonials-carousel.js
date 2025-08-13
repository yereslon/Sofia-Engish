// testimonials-carousel.js — loop infinito suave con clones + pausa al pasar encima
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.testimonials-carousel').forEach(initCarousel);
});

function initCarousel(root) {
  const track   = root.querySelector('.t-track');
  const prevBtn = root.querySelector('.t-prev');
  const nextBtn = root.querySelector('.t-next');
  const dots    = Array.from(root.querySelectorAll('.t-dot'));

  // --- montar clones ---
  const originalSlides = Array.from(track.children); // .t-slide
  const total = originalSlides.length;

  const firstClone = originalSlides[0].cloneNode(true);
  const lastClone  = originalSlides[total - 1].cloneNode(true);
  track.insertBefore(lastClone, originalSlides[0]);
  track.appendChild(firstClone);

  const slides = Array.from(track.children); // ahora: [lastClone, s1, s2, ..., sN, firstClone]

  // cada slide ya es flex: 0 0 100% en tu CSS
  let index = 1;              // arrancamos en el PRIMER real
  let animating = false;

  function setTransform(withTransition) {
    track.style.transition = withTransition ? 'transform .5s ease-in-out' : 'none';
    track.style.transform = `translateX(-${index * 100}%)`;
  }

  // posicion inicial sin animacion
  setTransform(false);

  // --- navegación ---
  function realIndex() {          // 0..total-1
    return (index - 1 + total) % total;
  }
  function updateDots() {
    dots.forEach((d, i) => d.setAttribute('aria-selected', i === realIndex() ? 'true' : 'false'));
  }
  updateDots();

  function goNext() {
    if (animating) return;
    animating = true;
    index += 1;
    setTransform(true);
  }

  function goPrev() {
    if (animating) return;
    animating = true;
    index -= 1;
    setTransform(true);
  }

  // salto invisible al terminar transición si caemos en clones
  track.addEventListener('transitionend', () => {
    animating = false;
    // si estamos en el clone de la derecha (último)
    if (index === total + 1) {
      index = 1;              // salta al primer real
      setTransform(false);
      // forzar reflow para no cortar próximas transiciones
      track.getBoundingClientRect();
      track.style.transition = 'transform .5s ease-in-out';
    }
    // si estamos en el clone de la izquierda (primero)
    if (index === 0) {
      index = total;          // salta al último real
      setTransform(false);
      track.getBoundingClientRect();
      track.style.transition = 'transform .5s ease-in-out';
    }
    updateDots();
  });

  // botones
  nextBtn && nextBtn.addEventListener('click', goNext);
  prevBtn && prevBtn.addEventListener('click', goPrev);

  // dots
  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => {
      if (animating) return;
      animating = true;
      // deseado: ir al slide real i
      index = i + 1;          // porque tenemos 1 offset por el clone inicial
      setTransform(true);
    });
  });

  // --- autoplay infinito con requestAnimationFrame ---
  const INTERVAL = 5000;
  let hoverPaused = false;
  let rafId = null;
  let last = performance.now();
  let acc = 0;

  function loop(now) {
    if (!hoverPaused && !animating) {
      acc += now - last;
      if (acc >= INTERVAL) {
        acc %= INTERVAL;
        goNext();
      }
    } else if (hoverPaused) {
      acc = 0; // evita salto al soltar
    }
    last = now;
    rafId = requestAnimationFrame(loop);
  }
  function start() {
    if (rafId) return;
    last = performance.now();
    acc = 0;
    rafId = requestAnimationFrame(loop);
  }
  function stop() {
    if (!rafId) return;
    cancelAnimationFrame(rafId);
    rafId = null;
  }

  // pausa SOLO con interacción del usuario
  root.addEventListener('pointerenter', () => { hoverPaused = true; });
  root.addEventListener('pointerleave', () => { hoverPaused = false; });

  root.addEventListener('touchstart', () => { hoverPaused = true; }, {passive: true});
  root.addEventListener('touchend',   () => { hoverPaused = false; }, {passive: true});
  root.addEventListener('touchcancel',() => { hoverPaused = false; }, {passive: true});

  // robustez al volver de background
  document.addEventListener('visibilitychange', () => {
    last = performance.now();
    acc = 0;
    // re-sincroniza sin animación
    setTransform(false);
  });
  window.addEventListener('pagehide', stop);
  window.addEventListener('pageshow', () => { setTransform(false); start(); });
  window.addEventListener('resize',   () => setTransform(false));

  // init
  start();
}

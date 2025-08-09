// Carrusel de Testimonios con bucle infinito real (clones)
document.addEventListener('DOMContentLoaded', () => {
  const root = document.querySelector('.testimonials-carousel');
  if (!root) return;

  const viewport = root.querySelector('.t-viewport');
  const track = root.querySelector('.t-track');
  const originals = Array.from(root.querySelectorAll('.t-slide')); // 5 reales
  const prevBtn = root.querySelector('.t-prev');
  const nextBtn = root.querySelector('.t-next');
  const dots = Array.from(root.querySelectorAll('.t-dot'));

  // 1) Clonar extremos
  const firstClone = originals[0].cloneNode(true);
  const lastClone  = originals[originals.length - 1].cloneNode(true);
  firstClone.classList.add('is-clone');
  lastClone.classList.add('is-clone');

  track.insertBefore(lastClone, originals[0]); // [last*] 1 2 3 4 5
  track.appendChild(firstClone);               // [last*] 1 2 3 4 5 [1*]

  const slides = Array.from(track.querySelectorAll('.t-slide')); // incluye clones

  // 2) Estado
  let index = 1;               // empezamos en la primera REAL (después del lastClone)
  let autoId;
  const interval = 5000;

  // 3) Helpers
  function slideWidth() {
    return viewport.getBoundingClientRect().width;
  }

  function setTransform(animate = true) {
    const x = -index * slideWidth();
    track.style.transition = animate ? 'transform 0.5s ease-in-out' : 'none';
    track.style.transform = `translateX(${x}px)`;
    // actualizar dots según índice real
    const real = realIndex();
    dots.forEach((d, i) => d.setAttribute('aria-selected', i === real ? 'true' : 'false'));
  }

  function realIndex() {
    // mapear índice con clones a índice real (0..originals.length-1)
    if (index <= 0) return originals.length - 1;             // está en lastClone → real=4
    if (index >= originals.length + 1) return 0;             // está en firstClone → real=0
    return index - 1;                                        // 1..5 → 0..4
  }

  function next() { index++; setTransform(true); }
  function prev() { index--; setTransform(true); }

  // 4) Saltos sin animación cuando caemos en clones
  track.addEventListener('transitionend', () => {
    if (slides[index].classList.contains('is-clone')) {
      if (index === 0) {
        // estábamos en lastClone → saltar al último real
        index = originals.length;
      } else if (index === originals.length + 1) {
        // estábamos en firstClone → saltar al primero real
        index = 1;
      }
      setTransform(false); // reposicionar sin animación
    }
  });

  // 5) Auto-play + controles
  function start() { clearInterval(autoId); autoId = setInterval(next, interval); }
  function stop()  { clearInterval(autoId); }

  nextBtn.addEventListener('click', () => { stop(); next(); start(); });
  prevBtn.addEventListener('click', () => { stop(); prev(); start(); });
  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => { stop(); index = i + 1; setTransform(true); start(); });
  });

  root.addEventListener('mouseenter', stop);
  root.addEventListener('mouseleave', start);

  // 6) Recalcular en resize manteniendo la slide actual
  window.addEventListener('resize', () => setTransform(false));

  // 7) Inicial
  setTransform(false); // posicionar en la primera REAL sin animación
  start();
});

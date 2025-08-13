// ========= CARRUSEL DE PLANES (2 por vista en desktop, 1 en móvil) =========
document.addEventListener('DOMContentLoaded', () => {
  const container = document.querySelector('.carousel-container');
  const track = document.querySelector('.carousel-track');
  if (!container || !track) return;

  // === Parámetros
  const AUTOPLAY_MS = 4000;

  // Guardamos las tarjetas originales (no clones)
  const originals = Array.from(track.children);
  let visible = getVisible();               // 2 o 1 según ancho
  let index = 0;                            // comenzamos en el primer real "alineado"
  let timer = null;
  let animating = false;

  // Construye los clones necesarios para loop infinito suave
  function buildClones() {
    // Limpia clones anteriores si los hubiera
    Array.from(track.children).forEach((el) => el.remove());
    originals.forEach(el => track.appendChild(el));

    const count = originals.length;

    // Clonar al inicio y al final 'visible' elementos
    const headClones = originals.slice(0, visible).map(n => n.cloneNode(true));
    const tailClones = originals.slice(-visible).map(n => n.cloneNode(true));

    // Prepend tail clones, append head clones
    tailClones.forEach(n => track.insertBefore(n, track.firstChild));
    headClones.forEach(n => track.appendChild(n));

    // Arrancamos situados justo en el primer real
    index = visible;
    setTransform(false);
  }

  // Cálculo del desplazamiento basado en ancho de una card + gap real
  function getStep() {
    const card = track.querySelector('.plan-card');
    if (!card) return 0;
    const w = card.getBoundingClientRect().width;
    const gap = parseFloat(getComputedStyle(track).gap) || 0;
    return w + gap;
  }

  function setTransform(withTransition) {
    track.style.transition = withTransition ? 'transform .8s ease-in-out' : 'none';
    const step = getStep();
    track.style.transform = `translateX(-${index * step}px)`;
  }

  function getVisible() {
    return window.matchMedia('(max-width: 768px)').matches ? 1 : 2;
  }

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

  // Ajuste al terminar la transición para no "rebotar"
  track.addEventListener('transitionend', () => {
    animating = false;

    const totalReales = originals.length;
    // Si nos pasamos por la derecha (llegamos a los clones del final)
    if (index >= totalReales + visible) {
      index = visible;             // saltamos (sin transición) al primer real
      setTransform(false);
    }
    // Si nos pasamos por la izquierda (llegamos a clones del inicio)
    if (index < visible) {
      index = totalReales + visible - 1; // saltamos al último real visible
      setTransform(false);
    }
  });

  // Autoplay
  function start() {
    stop();
    timer = setInterval(goNext, AUTOPLAY_MS);
  }
  function stop() {
    if (timer) clearInterval(timer);
    timer = null;
  }

  // Pausar SOLO cuando el usuario interactúa
  container.addEventListener('mouseenter', stop);
  container.addEventListener('mouseleave', start);
  container.addEventListener('touchstart', stop, { passive: true });
  container.addEventListener('touchend', start, { passive: true });
  container.addEventListener('touchcancel', start, { passive: true });

  // Recalcular clones/posición al cambiar el layout
  window.addEventListener('resize', () => {
    const v = getVisible();
    if (v !== visible) {
      visible = v;
      buildClones();
    } else {
      // si solo cambió ligeramente el ancho, re-colocar sin animación
      setTransform(false);
    }
  });

  // Inicializar
  buildClones();
  start();

  // ========= AUTOCOMPLETAR PLAN EN EL FORMULARIO =========
  const planLinks = document.querySelectorAll('.plan-cta');
  const planSelector = document.getElementById('plan-selection');
  planLinks.forEach(link => {
    link.addEventListener('click', function () {
      const selectedPlan = this.getAttribute('data-plan');
      if (selectedPlan && planSelector) {
        planSelector.value = selectedPlan;
      }
    });
  });

  // (Opcional) si quieres flechas para este carrusel:
  // document.querySelector('.planes-prev')?.addEventListener('click', goPrev);
  // document.querySelector('.planes-next')?.addEventListener('click', goNext);
});

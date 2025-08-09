// ========= CARRUSEL DE PLANES Y AUTOCOMPLETADO DE FORMULARIO =========
document.addEventListener('DOMContentLoaded', () => {
  const carouselContainer = document.querySelector('.carousel-container');
  const track = document.querySelector('.carousel-track');

  if (!carouselContainer || !track) return;

  const cards = Array.from(track.children);
  cards.forEach(card => {
    const clone = card.cloneNode(true);
    track.appendChild(clone);
  });

  let currentIndex = 0;
  let intervalId;
  const slideInterval = 4000;

  function slideNext() {
    currentIndex++;
    const cardWidth = cards[0].getBoundingClientRect().width;
    const cardMargin = 16; // 0.5rem * 2 = 16px
    const amountToMove = (cardWidth + cardMargin) * currentIndex;
    track.style.transition = 'transform 0.8s ease-in-out';
    track.style.transform = `translateX(-${amountToMove}px)`;
    track.addEventListener('transitionend', checkReset, { once: true });
  }

  function checkReset() {
    if (currentIndex >= cards.length) {
      track.style.transition = 'none';
      currentIndex = 0;
      track.style.transform = 'translateX(0)';
    }
  }

  function startCarousel() {
    intervalId = setInterval(slideNext, slideInterval);
  }

  function pauseCarousel() {
    clearInterval(intervalId);
  }

  carouselContainer.addEventListener('mouseenter', pauseCarousel);
  carouselContainer.addEventListener('mouseleave', startCarousel);

  startCarousel();

  // ========= AUTOCOMPLETADO DE PLANES =========
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
});

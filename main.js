document.addEventListener('DOMContentLoaded', function () {
  const contactForm = document.getElementById('formulario-contacto');
  const phoneInputField = document.querySelector('#phone');

  // Inicializar input de teléfono si existe
  try {
    if (phoneInputField && typeof window.intlTelInputGlobals !== 'undefined') {
      window.intlTelInputGlobals.getInstance(phoneInputField);
    }
  } catch (e) {
    console.warn('intlTelInput no disponible aún:', e);
  }

  // Mostrar popup flotante
  function mostrarPopup(mensaje) {
    const overlay = document.getElementById('popup-overlay');
    const modal = document.getElementById('popup-message');
    const texto = document.getElementById('popup-text');
    const cerrar = document.getElementById('popup-close');
    if (!overlay || !modal || !texto || !cerrar) return;

    texto.textContent = mensaje;
    overlay.style.display = 'flex';
    modal.classList.add('show');

    let timeout = setTimeout(() => cerrarPopup(), 5000);

    cerrar.onclick = () => {
      clearTimeout(timeout);
      cerrarPopup();
    };

    function cerrarPopup() {
      modal.classList.remove('show');
      overlay.style.display = 'none';
    }
  }

  // Envío del formulario (guard clause if not found)
  if (contactForm) {
    contactForm.addEventListener('submit', async function (event) {
      event.preventDefault();

      // Obtener teléfono completo
      try {
        if (phoneInputField && typeof window.intlTelInputGlobals !== 'undefined') {
          const phoneInput = window.intlTelInputGlobals.getInstance(phoneInputField);
          const fullPhoneNumber = phoneInput.getNumber();
          const hidden = document.querySelector("input[name='full_phone']");
          if (hidden) hidden.value = fullPhoneNumber;
        }
      } catch (e) {
        console.warn('No se pudo leer el teléfono:', e);
      }

      const formData = new FormData(this);

      try {
        const response = await fetch(contactForm.action, {
          method: 'POST',
          body: formData,
          headers: { 'Accept': 'application/json' }
        });

        if (response.ok) {
          contactForm.reset();
          mostrarPopup('¡Gracias! Tu mensaje fue enviado correctamente.');
        } else {
          mostrarPopup('Hubo un error al enviar tu mensaje. Inténtalo nuevamente.');
        }
      } catch (error) {
        console.error('Error de red:', error);
        mostrarPopup('Hubo un problema de conexión. Por favor, intenta de nuevo.');
      }
    });
  }
});

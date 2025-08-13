// ========= INICIALIZACIÓN DEL CAMPO DE TELÉFONO =========
document.addEventListener('DOMContentLoaded', () => {
  const phoneInputField = document.querySelector("#phone");

  if (!phoneInputField || typeof intlTelInput === 'undefined') return;

  window.intlTelInput(phoneInputField, {
    initialCountry: "es",
    preferredCountries: ["es", "pe", "ar", "co", "mx", "cl", "us"],
    separateDialCode: true,
    utilsScript: "https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.13/js/utils.js"
  });
});

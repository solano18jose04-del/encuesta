// script.js
// Manejo del envío del formulario principal y flujo: form -> confirm -> success

let userData = {
  nombre: '',
  email: '',
  intereses: [],
  terminos: false
};

// URL a la que se redirige cuando el usuario pulsa "Listo" en la página final.
const FINAL_REDIRECT = 'https://www.example.com';

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('signupForm');
  const formPage = document.getElementById('formPage');
  const confirmPage = document.getElementById('confirmPage');
  const successPage = document.getElementById('successPage');

  const confirmName = document.getElementById('confirmName');
  const confirmEmail = document.getElementById('confirmEmail');
  const confirmInterests = document.getElementById('confirmInterests');

  const userName = document.getElementById('userName');
  const userEmail = document.getElementById('userEmail');
  const userEmailText = document.getElementById('userEmailText');
  const userInterests = document.getElementById('userInterests');

  const backToFormBtn = document.getElementById('backToFormBtn');
  const confirmBtn = document.getElementById('confirmBtn');
  const editBtn = document.getElementById('editBtn');
  const doneBtn = document.getElementById('doneBtn');

  function showPage(page) {
    formPage.classList.toggle('active', page === 'form');
    confirmPage.classList.toggle('active', page === 'confirm');
    successPage.classList.toggle('active', page === 'success');

    formPage.setAttribute('aria-hidden', page !== 'form');
    confirmPage.setAttribute('aria-hidden', page !== 'confirm');
    successPage.setAttribute('aria-hidden', page !== 'success');
  }

  function focusPageHeading(pageId) {
    const page = document.getElementById(pageId);
    if (!page) return;
    // buscar título lógico
    const heading = page.querySelector('h1, h2, [aria-labelledby]');
    if (!heading) return;
    heading.setAttribute('tabindex', '-1');
    heading.focus();
  }

  function collectFormData() {
    const nombre = document.getElementById('nombre').value.trim();
    const email = document.getElementById('email').value.trim();
    const interesesNodes = document.querySelectorAll('input[name="intereses"]:checked');
    const intereses = Array.from(interesesNodes).map(n => n.value);
    const terminos = document.getElementById('terminos').checked;

    userData = { nombre, email, intereses, terminos };
    try { localStorage.setItem('encuestaUser', JSON.stringify(userData)); } catch (e) { /* ignore */ }
    return userData;
  }

  function fillConfirm(data) {
    confirmName.textContent = data.nombre || '(sin nombre)';
    confirmEmail.textContent = data.email || '';
    confirmInterests.textContent = (data.intereses && data.intereses.length) ? data.intereses.join(', ') : '(ninguno)';
  }

  function fillSuccess(data) {
    userName.textContent = data.nombre || '(sin nombre)';
    userEmail.textContent = data.email || '';
    userEmailText.textContent = data.email || '';
    userInterests.textContent = (data.intereses && data.intereses.length) ? data.intereses.join(', ') : '(ninguno)';
  }

  function restoreFormFromData(data) {
    if (!data) return;
    document.getElementById('nombre').value = data.nombre || '';
    document.getElementById('email').value = data.email || '';
    document.querySelectorAll('input[name="intereses"]').forEach(el => {
      el.checked = data.intereses && data.intereses.includes(el.value);
    });
    document.getElementById('terminos').checked = !!data.terminos;
  }

  // Restaurar si hay datos guardados
  try {
    const saved = localStorage.getItem('encuestaUser');
    if (saved) {
      const parsed = JSON.parse(saved);
      userData = parsed;
      restoreFormFromData(parsed);
    }
  } catch (e) { /* ignore */ }

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    // Validación nativa
    if (!form.checkValidity()) {
      const formError = document.getElementById('formError');
      if (formError) {
        formError.hidden = false;
        formError.textContent = 'Por favor completa los campos requeridos correctamente.';
      }
      form.reportValidity();
      return;
    }

    const formError = document.getElementById('formError');
    if (formError) { formError.hidden = true; formError.textContent = ''; }

    const data = collectFormData();
    fillConfirm(data);
    showPage('confirm');
    focusPageHeading('confirmPage');
  });

  backToFormBtn.addEventListener('click', function () {
    showPage('form');
    focusPageHeading('formPage');
  });

  confirmBtn.addEventListener('click', function () {
    // Simulación de procesamiento breve para mejorar UX
    confirmBtn.disabled = true;
    const originalText = confirmBtn.textContent;
    confirmBtn.textContent = 'Procesando...';
    setTimeout(() => {
      fillSuccess(userData);
      showPage('success');
      focusPageHeading('successPage');
      confirmBtn.disabled = false;
      confirmBtn.textContent = originalText;
    }, 600);
  });

  editBtn.addEventListener('click', function () {
    showPage('form');
    focusPageHeading('formPage');
  });

  doneBtn.addEventListener('click', function () {
    try { localStorage.removeItem('encuestaUser'); } catch (e) { }
    userData = { nombre: '', email: '', intereses: [], terminos: false };
    const formEl = document.getElementById('signupForm');
    if (formEl) formEl.reset();

    // Abrir nueva pestaña inmediatamente
    const win = window.open(FINAL_REDIRECT, '_blank', 'noopener,noreferrer');
    if (win) try { win.focus(); } catch (e) { /* ignore */ }

    const banner = document.querySelector('.discount-banner');
    if (banner) {
      const originalText = banner.textContent;
      banner.textContent = '¡Listo! Te redirigimos...';
      banner.classList.add('toast-success');
      setTimeout(() => {
        banner.textContent = originalText;
        banner.classList.remove('toast-success');
      }, 1200);
    }

    showPage('form');
    focusPageHeading('formPage');
  });

});

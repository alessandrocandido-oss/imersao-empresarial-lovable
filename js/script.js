document.addEventListener('DOMContentLoaded', () => {
  const STORAGE = {
    theme: 'imersao-theme',
    leads: 'imersao-inscricoes'
  };

  /* =========================================================
     1. Modo escuro / claro com persistência em localStorage
     ========================================================= */
  const root = document.documentElement;
  const themeToggle = document.getElementById('themeToggle');

  const readStorage = (key, fallback = null) => {
    try {
      const raw = localStorage.getItem(key);
      return raw === null ? fallback : raw;
    } catch (_) {
      return fallback;
    }
  };

  const writeStorage = (key, value) => {
    try {
      localStorage.setItem(key, value);
    } catch (_) {
      /* Modo privado ou armazenamento indisponível: segue sem persistir. */
    }
  };

  const applyTheme = (theme) => {
    root.setAttribute('data-theme', theme);
    themeToggle.setAttribute('aria-pressed', String(theme === 'dark'));
    themeToggle.title = theme === 'dark' ? 'Ativar tema claro' : 'Ativar tema escuro';
  };

  const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  applyTheme(readStorage(STORAGE.theme) || (prefersDark ? 'dark' : 'light'));

  themeToggle.addEventListener('click', () => {
    const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    writeStorage(STORAGE.theme, next);
  });

  /* =========================================================
     2. FAQ em sanfona (accordion) com animação de altura
     ========================================================= */
  const triggers = document.querySelectorAll('.accordion-trigger');

  const closePanel = (trigger) => {
    const panel = document.getElementById(trigger.getAttribute('aria-controls'));
    trigger.setAttribute('aria-expanded', 'false');
    panel.style.height = `${panel.scrollHeight}px`; // fixa altura atual para animar até 0
    requestAnimationFrame(() => { panel.style.height = '0px'; });
  };

  const openPanel = (trigger) => {
    const panel = document.getElementById(trigger.getAttribute('aria-controls'));
    trigger.setAttribute('aria-expanded', 'true');
    panel.style.height = `${panel.scrollHeight}px`;
    const onEnd = (e) => {
      if (e.propertyName !== 'height') return;
      if (trigger.getAttribute('aria-expanded') === 'true') panel.style.height = 'auto';
      panel.removeEventListener('transitionend', onEnd);
    };
    panel.addEventListener('transitionend', onEnd);
  };

  triggers.forEach((trigger) => {
    trigger.addEventListener('click', () => {
      const isOpen = trigger.getAttribute('aria-expanded') === 'true';
      // Comportamento sanfona: apenas um item aberto por vez.
      triggers.forEach((other) => {
        if (other !== trigger && other.getAttribute('aria-expanded') === 'true') closePanel(other);
      });
      isOpen ? closePanel(trigger) : openPanel(trigger);
    });
  });

  /* =========================================================
     3. Animações de rolagem (AOS via CDN) com fallback
     ========================================================= */
  if (window.AOS) {
    AOS.init({ duration: 750, easing: 'ease-out-cubic', once: true, offset: 90 });
  } else {
    root.classList.add('no-aos'); // garante que nada fique invisível se o CDN falhar
  }

  /* =========================================================
     4. Formulário: modal de sucesso + persistência simulada
     ========================================================= */
  const form = document.getElementById('applicationForm');
  const message = document.getElementById('formMessage');
  const modal = document.getElementById('successModal');
  const modalText = document.getElementById('modalText');
  const modalMeta = document.getElementById('modalMeta');
  let lastFocused = null;

  const openModal = () => {
    lastFocused = document.activeElement;
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('modal-open');
    modal.querySelector('.modal-card .button').focus();
  };

  const closeModal = () => {
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('modal-open');
    if (lastFocused) lastFocused.focus();
  };

  modal.querySelectorAll('[data-close-modal]').forEach((el) => el.addEventListener('click', closeModal));
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('is-open')) closeModal();
  });

  const loadLeads = () => {
    try {
      const parsed = JSON.parse(readStorage(STORAGE.leads, '[]'));
      return Array.isArray(parsed) ? parsed : [];
    } catch (_) {
      return [];
    }
  };

  const saveLead = (lead) => {
    const leads = loadLeads();
    leads.push(lead);
    writeStorage(STORAGE.leads, JSON.stringify(leads));
    return leads.length;
  };

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    message.className = 'form-message';
    message.textContent = '';

    if (!form.checkValidity()) {
      form.reportValidity();
      message.textContent = 'Revise os campos obrigatórios para concluir sua aplicação.';
      message.classList.add('error');
      return;
    }

    const data = new FormData(form);
    const lead = {
      id: `lead-${Date.now()}`,
      nome: String(data.get('name')).trim(),
      email: String(data.get('email')).trim().toLowerCase(),
      empresa: String(data.get('company')).trim(),
      faturamento: String(data.get('revenue')),
      criadoEm: new Date().toISOString()
    };

    saveLead(lead);
    const firstName = lead.nome.split(' ')[0];
    window.location.href = `obrigado.html?nome=${encodeURIComponent(firstName)}`;
  });

  // Expõe utilitário de inspeção no console para simular consulta ao "banco".
  window.imersaoLeads = () => loadLeads();

  /* =========================================================
     Contador regressivo (10 dias a partir do acesso, 23:59:59)
     ========================================================= */
  const deadline = new Date();
  deadline.setDate(deadline.getDate() + 10);
  deadline.setHours(23, 59, 59, 999);

  const updateCountdown = () => {
    const remaining = deadline - new Date();
    if (remaining <= 0) {
      ['days', 'hours', 'minutes', 'seconds'].forEach((id) => { document.getElementById(id).textContent = '00'; });
      return;
    }
    const units = {
      days: Math.floor(remaining / 86400000),
      hours: Math.floor((remaining / 3600000) % 24),
      minutes: Math.floor((remaining / 60000) % 60),
      seconds: Math.floor((remaining / 1000) % 60)
    };
    Object.entries(units).forEach(([id, value]) => {
      document.getElementById(id).textContent = String(value).padStart(2, '0');
    });
  };

  updateCountdown();
  setInterval(updateCountdown, 1000);
});

document.addEventListener('DOMContentLoaded', () => {
  const root = document.documentElement;
  const toggle = document.getElementById('themeToggle');
  const saved = localStorage.getItem('imersao-theme');
  const theme = saved || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  root.setAttribute('data-theme', theme);
  if (!toggle) return;
  const apply = (value) => { root.setAttribute('data-theme', value); toggle.setAttribute('aria-pressed', String(value === 'dark')); };
  apply(theme);
  toggle.addEventListener('click', () => { const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark'; localStorage.setItem('imersao-theme', next); apply(next); });
});

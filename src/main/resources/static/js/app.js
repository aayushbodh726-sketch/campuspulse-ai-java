(function () {
  document.addEventListener('click', function (event) {
    const toggle = event.target.closest('[data-menu-toggle]');
    if (toggle) {
      const sidebar = document.querySelector('.sidebar');
      if (sidebar) sidebar.classList.toggle('open');
    }
    const suggestion = event.target.closest('[data-fill-question]');
    if (suggestion) {
      const input = document.querySelector('input[name="question"]');
      if (input) { input.value = suggestion.dataset.fillQuestion || ''; input.focus(); }
    }
  });
  document.addEventListener('click', function (event) {
    const sidebar = document.querySelector('.sidebar');
    if (!sidebar || !sidebar.classList.contains('open')) return;
    if (event.target.closest('.nav-link')) sidebar.classList.remove('open');
  });
})();

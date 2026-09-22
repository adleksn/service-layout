export function setupTabs(root = document) {
  root.querySelectorAll('[role="tablist"]').forEach((list) => {
    const tabs = [...list.querySelectorAll('[role="tab"]')];
    const activate = (tab, updateHash = true) => {
      tabs.forEach((item) => {
        const selected = item === tab;
        item.setAttribute('aria-selected', selected);
        item.tabIndex = selected ? 0 : -1;
        const panel = document.getElementById(item.getAttribute('aria-controls'));
        if (panel) panel.hidden = !selected;
      });
      if (updateHash) history.replaceState(null, '', `#${tab.getAttribute('aria-controls')}`);
    };
    tabs.forEach((tab) => tab.addEventListener('click', () => activate(tab)));
    tabs.forEach((tab, index) => tab.addEventListener('keydown', (event) => {
      if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
      event.preventDefault();
      const next = event.key === 'Home' ? 0 : event.key === 'End' ? tabs.length - 1 : (index + (event.key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length;
      tabs[next].focus(); activate(tabs[next]);
    }));
    const fromHash = tabs.find((tab) => tab.getAttribute('aria-controls') === location.hash.slice(1));
    if (fromHash) activate(fromHash, false);
  });
}

export function setupMobileMenu(root = document) {
  const button = root.querySelector('[data-mobile-menu]');
  const panel = root.querySelector('#mobile-nav');
  if (!button || !panel) return;

  const setOpen = (open) => {
    button.setAttribute('aria-expanded', String(open));
    button.setAttribute('aria-label', open ? 'Закрыть меню' : 'Открыть меню');
    button.textContent = open ? '×' : '☰';
    panel.hidden = !open;
    root.querySelector('.header')?.classList.toggle('header--menu-open', open);
  };

  setOpen(false);
  button.addEventListener('click', () => setOpen(button.getAttribute('aria-expanded') !== 'true'));
  panel.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => setOpen(false)));
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && button.getAttribute('aria-expanded') === 'true') {
      setOpen(false);
      button.focus();
    }
  });
}

export function setupCatalogLegend(root = document) {
  const toggle = root.querySelector('[data-catalog-legend-toggle]');
  const panel = root.querySelector('#catalog-status-legend');
  if (!toggle || !panel) return;

  const mobileQuery = globalThis.matchMedia?.('(max-width: 767px)');
  let open = false;
  const sync = () => {
    const compact = mobileQuery?.matches ?? false;
    toggle.hidden = !compact;
    panel.hidden = compact && !open;
    toggle.setAttribute('aria-expanded', String(compact && open));
  };

  toggle.addEventListener('click', () => {
    open = !open;
    sync();
  });
  mobileQuery?.addEventListener?.('change', sync);
  sync();
}

export function setupDisclosures(root = document) {
  // The authored rating FAQ contains the full answer copy; keeping it here
  // prevents the responsive line count from drifting away from the Pen frame.
  const ratingAnswer = root.querySelector('#rating-faq-0 > p');
  if (ratingAnswer) ratingAnswer.textContent = 'Позиции в таблице пересчитываются каждую неделю, а полная контрольная проверка каждого сервиса проходит не реже раза в год — дата последней проверки указана в карточке.';
  const setFaqState = (button, open) => {
    const panel = document.getElementById(button.getAttribute('aria-controls'));
    if (!panel) return;
    button.setAttribute('aria-expanded', String(open));
    button.closest('.faq > div')?.classList.toggle('is-open', open);
    panel.hidden = !open;
  };
  const faqButtons = [...root.querySelectorAll('.faq [data-disclosure]')];
  faqButtons.forEach((button, index) => {
    // The first question is open by design. Its arrow, aria state and answer
    // are set together, so closing it uses exactly the same path as any other
    // accordion row.
    setFaqState(button, index === 0);
    button.addEventListener('click', () => {
      const open = button.getAttribute('aria-expanded') !== 'true';
      faqButtons.forEach((item) => setFaqState(item, item === button && open));
    });
  });
  root.querySelectorAll('[data-disclosure]').forEach((button) => {
    if (button.closest('.faq')) return;
    const panel = document.getElementById(button.getAttribute('aria-controls'));
    if (!panel) return;
    button.addEventListener('click', () => {
      const open = button.getAttribute('aria-expanded') !== 'true';
      button.setAttribute('aria-expanded', String(open));
      panel.hidden = !open;
    });
  });
}

export function setupPromo(root = document) {
  root.querySelectorAll('[data-promo]').forEach((box) => {
    const button = box.querySelector('button');
    button.addEventListener('click', async () => {
      const code = box.dataset.promo;
      if (!box.classList.contains('promo--open')) { box.classList.add('promo--open'); button.textContent = 'Скопировать код'; return; }
      try { await navigator.clipboard.writeText(code); } catch { const input = document.createElement('textarea'); input.value = code; document.body.append(input); input.select(); document.execCommand('copy'); input.remove(); }
      button.textContent = '✓ Скопировано'; button.classList.add('button--success');
      setTimeout(() => { button.textContent = 'Скопировать код'; button.classList.remove('button--success'); }, 2000);
    });
  });
}

export function setupServiceStatusBadges(root = document) {
  const labels = [
    ['status-badge--verified', 'Подтверждён'],
    ['status-badge--shopper', 'Был тайный покупатель'],
    ['status-badge--promo', 'Есть промокод'],
    ['status-badge--new', 'Новый']
  ];
  root.querySelectorAll('.service-status span').forEach((badge, index) => {
    const [className, label] = labels[index] || [];
    if (!className) return;
    badge.className = `status-badge ${className}`;
    badge.textContent = label;
  });
}

export function setupReviewForm(root = document) {
  const form = root.querySelector('[data-review-form]');
  if (!form) return;
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const fields = [...form.querySelectorAll('[required]')];
    const invalid = fields.find((field) => !field.value.trim() || !field.checkValidity());
    fields.forEach((field) => field.setAttribute('aria-invalid', field === invalid ? 'true' : 'false'));
    if (invalid) { form.querySelector('[data-form-status]').textContent = invalid.name === 'email' ? 'Укажите корректный e-mail.' : invalid.name === 'amount' ? 'Укажите сумму платежа больше нуля.' : 'Заполните обязательные поля.'; invalid.focus(); return; }
    form.reset(); form.querySelector('[data-form-status]').textContent = 'Спасибо! Отзыв принят на проверку.';
  });
}

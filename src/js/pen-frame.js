import { bindUnmappedPenControls } from './pen-interactions.js';
import { sitePath } from './site-paths.js';

const frames = {
  home: { desktop: 'Главная Desktop 1440', tablet: 'Главная Tablet 1024', mobile: 'Главная Mobile 375' },
  rating: { desktop: 'Рейтинг Desktop 1440', mobile: 'Рейтинг Mobile 375' },
  cards: { desktop: 'Виртуальные карты Desktop 1440', mobile: 'Виртуальные карты Mobile 375' },
  service: { desktop: 'Карточка сервиса Desktop 1440', mobile: 'Карточка сервиса Mobile 375' },
  'virtual-card': { desktop: 'Виртуальные карты — Карточка сервиса Desktop 1440', mobile: 'Виртуальные карты — Карточка сервиса Mobile 375' },
  reports: { desktop: 'Отчеты список Desktop 1440', mobile: 'Отчёты список Mobile 375' },
  report: { desktop: 'Отчёт Desktop 1440', mobile: 'Отчёт Mobile 375' },
  methodology: { desktop: 'Методика проверки Desktop 1440', mobile: 'Методика проверки Mobile 375' },
  contacts: { desktop: 'Контакты Desktop 1440', mobile: 'Контакты Mobile 375' },
  advertising: { desktop: 'Реклама Desktop 1440', mobile: 'Реклама Mobile 375' },
  agreement: { desktop: 'Пользовательское соглашение Desktop 1440', mobile: 'Пользовательское соглашение Mobile 375' },
  'not-found': { desktop: '404 Desktop 1440', mobile: '404 Mobile 375' },
  'ui-kit': { desktop: 'UI Kit — состояния' }
};

const destinationByLayer = {
  Logo: '/',
  'Footer Logo': '/',
  'Nav Рейтинг': '#',
  'Nav Виртуальные карты': '/virtual-cards.html',
  'Nav Методика проверки': '/methodology.html',
  'Nav Отчёты': '/reports.html',
  'Nav Контакты': '/contacts.html',
  'Button Add Service': '/contacts.html',
  'Link Добавить сервис': '/contacts.html',
  'Link How We Check': '/methodology.html',
  'Terms Link': '/agreement.html',
  'Link Методика проверки': '/methodology.html',
  'Link Контакты': '/contacts.html',
  'Link Реклама': '/advertising.html'
};

const activeNavigationLayer = {
  rating: 'Nav Рейтинг',
  cards: 'Nav Виртуальные карты',
  methodology: 'Nav Методика проверки',
  reports: 'Nav Отчёты',
  contacts: 'Nav Контакты'
};

export function penDestination(destination, basePath = import.meta.env.BASE_URL) {
  return destination.startsWith('/') ? sitePath(destination, basePath) : destination;
}

function makeInteractive(node, destination) {
  node.setAttribute('role', 'link');
  node.setAttribute('tabindex', '0');
  node.dataset.penLink = destination;
  const navigate = () => { location.href = penDestination(destination); };
  node.addEventListener('click', navigate);
  node.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); navigate(); }
  });
}

function setupPenPromo(frame) {
  const closed = frame.querySelector('[data-pencil-name="Promo Code Block (closed)"]');
  const opened = frame.querySelector('[data-pencil-name="Promo Code Block (open)"]');
  if (!closed || !opened) return;
  const closedLabel = closed.previousElementSibling?.getAttribute('data-pencil-name') === 'Demo Label' ? closed.previousElementSibling : null;
  const openLabel = opened.previousElementSibling?.getAttribute('data-pencil-name') === 'Demo Label' ? opened.previousElementSibling : null;
  const displays = new WeakMap();
  const setVisible = (node, visible) => {
    if (!node) return;
    if (!displays.has(node)) displays.set(node, node.style.display || (node.getAttribute('data-pencil-name') === 'Demo Label' ? 'block' : 'flex'));
    node.hidden = !visible;
    node.style.setProperty('display', visible ? displays.get(node) : 'none', 'important');
  };
  const setOpen = (isOpen) => {
    setVisible(closed, !isOpen);
    setVisible(closedLabel, false);
    setVisible(opened, isOpen);
    setVisible(openLabel, false);
  };
  const activate = (node, callback) => {
    node.setAttribute('role', 'button');
    node.setAttribute('tabindex', '0');
    node.addEventListener('click', callback);
    node.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); callback(); }
    });
  };
  setOpen(false);
  closed.querySelectorAll('[data-pencil-name="Button Get Code"]').forEach((button) => activate(button, () => setOpen(true)));
  opened.querySelectorAll('[data-pencil-name="Button Get Code"]').forEach((button) => activate(button, async () => {
    const code = opened.querySelector('[data-pencil-name="Code"]')?.textContent.trim();
    if (!code) return;
    try { await navigator.clipboard.writeText(code); } catch { /* Clipboard is unavailable in some embedded browsers. */ }
  }));
}

function removePenDemoLabels(frame) {
  frame.querySelectorAll('[data-pencil-name="Demo Label"]').forEach((label) => {
    if (/^(Состояние:|Пример:)/.test(label.textContent.trim())) label.remove();
  });
}

function setupPenLoadMore(frame) {
  const button = frame.querySelector('[data-pencil-name="Load More Button"]');
  if (!button) return;
  // The mockup defines this as a placeholder link only, not pagination.
  makeInteractive(button, '#');
}

function setupPenReviewSlider(frame) {
  const slider = frame.querySelector('[data-pencil-name="Reviews Slider"]');
  if (!slider) return;
  const cards = [...slider.children];
  const dots = [...frame.querySelectorAll('[data-pencil-name="Slider Dots"] > [data-pencil-name]')];
  slider.setAttribute('role', 'region');
  slider.setAttribute('aria-label', 'Отзывы пользователей');
  slider.tabIndex = 0;
  const setActive = (index) => {
    const activeIndex = Math.max(0, Math.min(index, dots.length - 1));
    dots.forEach((dot, dotIndex) => {
      const active = dotIndex === activeIndex;
      dot.setAttribute('aria-current', String(active));
      dot.classList.toggle('is-active', active);
      // The Pen export gives each dot an inline fill, so a CSS selector alone
      // cannot update the visible indicator.
      dot.style.backgroundColor = active ? '#45A828' : '#D5D5D5';
    });
  };
  const activeCard = () => {
    const center = slider.scrollLeft + slider.clientWidth / 2;
    return cards.reduce((best, card, index) => (
      Math.abs(card.offsetLeft + card.offsetWidth / 2 - center) < Math.abs(cards[best].offsetLeft + cards[best].offsetWidth / 2 - center)
        ? index : best
    ), 0);
  };
  const show = (index) => {
    const card = cards[index];
    if (!card) return;
    slider.scrollTo({ left: card.offsetLeft - slider.offsetLeft, behavior: 'smooth' });
    setActive(index);
  };
  setActive(0);
  dots.forEach((dot, index) => {
    dot.setAttribute('role', 'button');
    dot.setAttribute('tabindex', '0');
    dot.setAttribute('aria-label', `Показать отзыв ${index + 1}`);
    dot.addEventListener('click', () => show(index));
    dot.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); show(index); }
    });
  });
  slider.addEventListener('keydown', (event) => {
    if (!['ArrowLeft', 'ArrowRight'].includes(event.key)) return;
    event.preventDefault();
    slider.scrollBy({ left: (event.key === 'ArrowRight' ? 1 : -1) * slider.clientWidth * .82, behavior: 'smooth' });
  });
  let scrollFrame = 0;
  slider.addEventListener('scroll', () => {
    window.cancelAnimationFrame(scrollFrame);
    scrollFrame = window.requestAnimationFrame(() => setActive(activeCard()));
  }, { passive: true });
}

function setupPenReviewForm(frame) {
  const section = frame.querySelector('[data-pencil-name="Review Form Section"]');
  if (!section) return;
  section.id = 'review-form';
  const fields = [
    ['Field Ваше имя', 'name', 'text', 'Ваше имя'],
    ['Field Ваш e-mail', 'email', 'email', 'Ваш e-mail'],
    ['Field Введите сумму 6 + 4', 'amount', 'number', 'Сумма платежа']
  ];
  const controls = [];
  fields.forEach(([layer, name, type, placeholder]) => {
    // Some Pen layer names include CSS-significant characters (the amount
    // field is named “Введите сумму 6 + 4”), so attribute selector parsing
    // can silently miss the host. Compare the exported name directly.
    const host = [...section.querySelectorAll('[data-pencil-name]')]
      .find((node) => node.getAttribute('data-pencil-name') === layer);
    if (!host) return;
    host.querySelector('[data-pencil-name="Placeholder"]')?.remove();
    const input = document.createElement('input');
    input.className = 'pen-review-control';
    input.name = name;
    input.type = type;
    input.required = true;
    input.placeholder = placeholder;
    if (name === 'amount') { input.min = '1'; input.inputMode = 'decimal'; }
    host.append(input);
    controls.push(input);
  });
  const textHost = section.querySelector('[data-pencil-name="Textarea"]');
  if (textHost) {
    textHost.querySelector('[data-pencil-name="Placeholder"]')?.remove();
    const textarea = document.createElement('textarea');
    textarea.className = 'pen-review-control pen-review-control--textarea';
    textarea.name = 'message';
    textarea.required = true;
    textarea.placeholder = 'Текст отзыва';
    textHost.append(textarea);
    controls.push(textarea);
  }
  const submit = section.querySelector('[data-pencil-name="Submit Button"]');
  if (!submit || !controls.length) return;
  const status = document.createElement('p');
  status.className = 'pen-review-status';
  status.setAttribute('role', 'status');
  submit.parentElement?.append(status);
  const submitReview = () => {
    const invalid = controls.find((control) => !control.value.trim() || !control.checkValidity());
    controls.forEach((control) => control.setAttribute('aria-invalid', String(control === invalid)));
    if (invalid) { status.textContent = invalid.name === 'email' ? 'Укажите корректный e-mail.' : invalid.name === 'amount' ? 'Укажите сумму платежа больше нуля.' : 'Заполните обязательные поля.'; invalid.focus(); return; }
    controls.forEach((control) => { control.value = ''; });
    status.textContent = 'Спасибо! Отзыв принят на проверку.';
  };
  submit.setAttribute('role', 'button');
  submit.setAttribute('tabindex', '0');
  submit.addEventListener('click', submitReview);
  submit.addEventListener('keydown', (event) => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); submitReview(); } });
}

function setupPenReviewSort(frame) {
  const section = frame.querySelector('[data-pencil-name="Reviews Section"]');
  const select = section?.querySelector('[data-pencil-name="Sort Select"]');
  const label = select?.querySelector('[data-pencil-name="Label"]');
  const list = section?.querySelector('[data-pencil-name="Reviews List"]');
  if (!select || !label || !list) return;
  const menu = document.createElement('div');
  menu.className = 'pen-sort-options';
  menu.hidden = true;
  menu.innerHTML = '<button type="button" data-review-order="new" aria-selected="true">Сначала новые</button><button type="button" data-review-order="old" aria-selected="false">Сначала старые</button>';
  select.classList.add('pen-sort-select');
  select.setAttribute('role', 'button');
  select.setAttribute('tabindex', '0');
  select.setAttribute('aria-haspopup', 'listbox');
  select.setAttribute('aria-expanded', 'false');
  select.append(menu);
  const close = () => { menu.hidden = true; select.setAttribute('aria-expanded', 'false'); };
  const toggle = () => { const open = menu.hidden; menu.hidden = !open; select.setAttribute('aria-expanded', String(open)); };
  const timestamp = (item) => {
    const match = item.textContent.match(/(\d{2})\.(\d{2})\.(\d{4})/);
    return match ? new Date(Number(match[3]), Number(match[2]) - 1, Number(match[1])).getTime() : 0;
  };
  select.addEventListener('click', (event) => { if (!menu.contains(event.target)) toggle(); });
  select.addEventListener('keydown', (event) => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); toggle(); } if (event.key === 'Escape') close(); });
  menu.querySelectorAll('[data-review-order]').forEach((option) => option.addEventListener('click', (event) => {
    event.stopPropagation();
    const newestFirst = option.dataset.reviewOrder === 'new';
    [...list.querySelectorAll(':scope > [data-pencil-name^="Review Item"]')]
      .sort((left, right) => newestFirst ? timestamp(right) - timestamp(left) : timestamp(left) - timestamp(right))
      .forEach((item) => list.append(item));
    label.textContent = option.textContent;
    menu.querySelectorAll('[data-review-order]').forEach((item) => item.setAttribute('aria-selected', String(item === option)));
    close();
  }));
  document.addEventListener('click', (event) => { if (!select.contains(event.target)) close(); });
}

function setupPenCardFilterChips(frame) {
  const chips = [...frame.querySelectorAll('[data-pencil-name^="Chip "]')]
    .filter((node) => node.getAttribute('data-pencil-name') !== 'Chip Label' && node.querySelector('[data-pencil-name="Label"]'));
  const table = frame.querySelector('[data-pencil-name="Table"]');
  const rows = table ? [...table.querySelectorAll('[data-pencil-name^="Row "]')] : [];
  const tableHeader = table?.querySelector('[data-pencil-name="Table Header"]');
  const count = frame.querySelector('[data-pencil-name="Found Count"]');
  const groups = {
    payment: new Set(['Visa', 'Mastercard']),
    currency: new Set(['USD', 'EUR', 'Другие']),
    features: new Set(['Apple Pay', 'Google Pay', 'Пластик', 'Пополняемая']),
    kyc: new Set(['Без верификации', 'Базовый', 'Полный']),
    topup: new Set(['СБП', 'Перевод по номеру карты', 'Крипта'])
  };
  const selected = new Map();
  const groupFor = (label) => Object.entries(groups).find(([, values]) => values.has(label))?.[0];
  const searchBox = frame.querySelector('[data-pencil-name="Search Box"]');
  const placeholder = searchBox?.querySelector('[data-pencil-name="Search Placeholder"]');
  let search = '';
  let searchInput;
  const empty = frame.__penEmptyTemplate?.cloneNode(true) || document.createElement('section');
  empty.classList.add('pen-table-empty');
  empty.hidden = true;
  empty.setAttribute('aria-live', 'polite');
  if (!empty.childElementCount) empty.innerHTML = '<div data-pencil-name="Title">Ничего не найдено</div><div data-pencil-name="Text">Под выбранные условия не подошёл ни один сервис. Попробуйте убрать часть фильтров или сбросить их полностью.</div><div data-pencil-name="Button Reset"><div data-pencil-name="Label">Сбросить фильтры</div></div>';
  table?.append(empty);
  if (searchBox && placeholder) {
    searchInput = document.createElement('input');
    searchInput.className = 'pen-card-search';
    searchInput.type = 'search';
    searchInput.placeholder = placeholder.textContent.trim();
    searchInput.setAttribute('aria-label', searchInput.placeholder);
    placeholder.replaceWith(searchInput);
    searchInput.addEventListener('input', () => { search = searchInput.value.trim().toLowerCase(); applyFilters(); });
  }
  const rowMatches = (row, labels) => {
    const text = row.textContent.toLowerCase();
    return [...labels].some((label) => text.includes(label.toLowerCase()));
  };
  const applyFilters = () => {
    let visible = 0;
    rows.forEach((row) => {
      const text = row.textContent.toLowerCase();
      const queryMatches = !search || text.includes(search);
      const filtersMatch = [...selected.entries()].every(([, labels]) => !labels.size || rowMatches(row, labels));
      const show = queryMatches && filtersMatch;
      row.hidden = !show;
      row.style.setProperty('display', show ? 'flex' : 'none', 'important');
      if (show) visible += 1;
    });
    if (count) count.textContent = `Найдено: ${visible}`;
    if (tableHeader) tableHeader.hidden = visible === 0;
    empty.hidden = visible !== 0;
    empty.style.setProperty('display', visible === 0 ? 'flex' : 'none', 'important');
  };
  frame.__applyPenCardFilters = applyFilters;
  const setSelected = (node, selected) => {
    node.dataset.selected = String(selected);
    node.style.outline = selected ? '1px solid #45A828' : '1px solid #E6E6E6';
    node.style.backgroundColor = selected ? '#5DCF351F' : '#FFFFFF';
    const label = node.querySelector('[data-pencil-name="Label"]');
    if (label) {
      label.style.color = selected ? '#2F8A16' : '#3A3A3A';
      label.style.fontWeight = selected ? '600' : '400';
    }
    node.setAttribute('aria-pressed', String(selected));
  };
  chips.forEach((chip) => {
    const label = chip.querySelector('[data-pencil-name="Label"]')?.textContent.trim();
    const group = label && groupFor(label);
    chip.setAttribute('role', 'button');
    chip.setAttribute('tabindex', '0');
    const toggle = () => {
      const active = chip.dataset.selected !== 'true';
      setSelected(chip, active);
      if (group) {
        const values = selected.get(group) || new Set();
        active ? values.add(label) : values.delete(label);
        selected.set(group, values);
      }
      applyFilters();
    };
    chip.addEventListener('click', toggle);
    chip.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); toggle(); }
    });
  });
  const reset = frame.querySelector('[data-pencil-name="Reset Filters"]');
  if (!reset) return;
  reset.setAttribute('role', 'button');
  reset.setAttribute('tabindex', '0');
  const clear = () => { selected.clear(); search = ''; if (searchInput) searchInput.value = ''; chips.forEach((chip) => setSelected(chip, false)); applyFilters(); };
  reset.addEventListener('click', clear);
  reset.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); clear(); }
  });
  const emptyReset = empty.querySelector('[data-pencil-name="Button Reset"]');
  if (emptyReset) {
    emptyReset.setAttribute('role', 'button');
    emptyReset.setAttribute('tabindex', '0');
    emptyReset.addEventListener('click', clear);
    emptyReset.addEventListener('keydown', (event) => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); clear(); } });
  }
  applyFilters();
}

function setupPenMobileCardFilters(frame) {
  const trigger = frame.querySelector('[data-pencil-name="Filters Button"]');
  const cardsHost = frame.querySelector('[data-pencil-name="Service Cards"]');
  if (!trigger || !cardsHost) return;

  const groups = [
    ['Платёжная система', ['Visa', 'Mastercard']],
    ['Валюта', ['USD', 'EUR', 'Другие']],
    ['Возможности', ['Apple Pay', 'Google Pay', 'Пластик', 'Пополняемая']],
    ['KYC', ['Без верификации', 'Базовый', 'Полный']],
    ['Пополнение', ['СБП', 'Перевод по номеру карты', 'Крипта']],
    ['Дополнительно', ['Есть промокод', 'Был тайный покупатель']]
  ];
  const panel = document.createElement('section');
  panel.className = 'pen-card-filter-panel';
  panel.id = 'pen-card-mobile-filters';
  panel.hidden = true;
  panel.setAttribute('aria-label', 'Фильтры виртуальных карт');
  panel.innerHTML = `${groups.map(([title, values], groupIndex) => `<fieldset><legend>${title}</legend>${values.map((value) => `<button type="button" data-pen-mobile-filter="${groupIndex}" data-value="${value}" aria-pressed="false">${value}</button>`).join('')}</fieldset>`).join('')}<button class="pen-card-filter-reset" type="button">Сбросить фильтры</button>`;
  // The export's rating section is one tall flex container. Inserting after
  // that container placed the panel below every card; keep it adjacent to the
  // trigger and overlay the list just as a mobile disclosure should.
  trigger.after(panel);
  panel.style.position = 'fixed';
  panel.style.left = '16px';
  panel.style.zIndex = '12';

  const empty = document.createElement('section');
  empty.className = 'pen-card-mobile-empty';
  empty.hidden = true;
  empty.setAttribute('aria-live', 'polite');
  empty.innerHTML = '<b>Ничего не найдено</b><span>Попробуйте изменить фильтры или сбросить выбранные условия.</span>';
  cardsHost.after(empty);

  const selections = new Map();
  const cardNodes = [...cardsHost.querySelectorAll(':scope > [data-pencil-name^="Service Card "]')];
  const applyFilters = () => {
    let visible = 0;
    cardNodes.forEach((card) => {
      const cardText = card.textContent.toLowerCase();
      const matches = [...selections.values()].every((values) => !values.size || [...values].some((value) => cardText.includes(value.toLowerCase())));
      card.hidden = !matches;
      card.style.setProperty('display', matches ? 'flex' : 'none', 'important');
      if (matches) visible += 1;
    });
    empty.hidden = visible !== 0;
    empty.style.display = visible ? 'none' : 'flex';
  };
  const setOpen = (open) => {
    trigger.setAttribute('aria-expanded', String(open));
    if (open) {
      const { bottom } = trigger.getBoundingClientRect();
      panel.style.top = `${bottom + 12}px`;
      panel.style.maxHeight = `calc(100vh - ${bottom + 28}px)`;
    }
    panel.hidden = !open;
    if (open) panel.querySelector('[data-pen-mobile-filter]')?.focus({ preventScroll: true });
  };
  trigger.setAttribute('role', 'button');
  trigger.tabIndex = 0;
  trigger.setAttribute('aria-controls', panel.id);
  trigger.setAttribute('aria-expanded', 'false');
  const toggle = () => setOpen(trigger.getAttribute('aria-expanded') !== 'true');
  trigger.addEventListener('click', toggle);
  trigger.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); toggle(); }
  });
  panel.querySelectorAll('[data-pen-mobile-filter]').forEach((chip) => chip.addEventListener('click', () => {
    const group = Number(chip.dataset.penMobileFilter);
    const values = selections.get(group) || new Set();
    const value = chip.dataset.value;
    const active = !values.has(value);
    active ? values.add(value) : values.delete(value);
    selections.set(group, values);
    chip.setAttribute('aria-pressed', String(active));
    applyFilters();
  }));
  panel.querySelector('.pen-card-filter-reset')?.addEventListener('click', () => {
    selections.clear();
    panel.querySelectorAll('[data-pen-mobile-filter]').forEach((chip) => chip.setAttribute('aria-pressed', 'false'));
    applyFilters();
  });
  document.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape' || panel.hidden) return;
    setOpen(false);
    trigger.focus();
  });
  document.addEventListener('pointerdown', (event) => {
    if (panel.hidden || panel.contains(event.target) || trigger.contains(event.target)) return;
    setOpen(false);
  });
}

function setupPenCardSort(frame) {
  const select = frame.querySelector('[data-pencil-name="Sort Select"]');
  const label = select?.querySelector('[data-pencil-name="Sort Value"]');
  const firstRow = frame.querySelector('[data-pencil-name="Row 1"]');
  // Desktop exports use table rows; the authored 375px frame uses service
  // cards. Both must share the same sort menu and ordering behaviour.
  const mobileCardsHost = frame.querySelector('[data-pencil-name="Service Cards"]');
  const rowsHost = firstRow?.parentElement || mobileCardsHost;
  if (!select || !label || !rowsHost) return;
  const options = [['rating', 'По оценке'], ['reviews', 'По отзывам'], ['price', 'По стоимости выпуска']];
  const menu = document.createElement('div');
  menu.className = 'pen-sort-options';
  menu.hidden = true;
  menu.setAttribute('role', 'listbox');
  menu.innerHTML = options.map(([value, text], index) => `<button type="button" role="option" data-pen-sort="${value}" aria-selected="${index === 0}">${text}</button>`).join('');
  select.classList.add('pen-sort-select');
  select.setAttribute('role', 'button');
  select.setAttribute('tabindex', '0');
  select.setAttribute('aria-haspopup', 'listbox');
  select.setAttribute('aria-expanded', 'false');
  select.append(menu);
  const readValue = (row, rule) => {
    if (rule === 'rating') return Number.parseFloat(row.querySelector('[data-pencil-name="Rating Value"]')?.textContent.replace(',', '.') || '0');
    if (rule === 'reviews') return Number.parseInt(row.querySelector('[data-pencil-name="Reviews"]')?.textContent.replace(/\D/g, '') || '0', 10);
    const issue = row.querySelector('[data-pencil-name="Issue"], [data-pencil-name="Issue Value"]')?.textContent;
    return issue?.includes('бесплатно') ? 0 : Number.parseInt(issue?.replace(/\D/g, '') || '0', 10);
  };
  const close = () => { menu.hidden = true; select.setAttribute('aria-expanded', 'false'); };
  const toggle = () => { const open = menu.hidden; menu.hidden = !open; select.setAttribute('aria-expanded', String(open)); };
  select.addEventListener('click', (event) => { if (!menu.contains(event.target)) toggle(); });
  select.addEventListener('keydown', (event) => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); toggle(); } if (event.key === 'Escape') close(); });
  menu.querySelectorAll('[data-pen-sort]').forEach((option) => option.addEventListener('click', (event) => {
    event.stopPropagation();
    const rule = option.dataset.penSort;
    const rows = firstRow
      ? [...rowsHost.querySelectorAll(':scope > [data-pencil-name^="Row "]')]
      : [...rowsHost.querySelectorAll(':scope > [data-pencil-name^="Service Card "]')];
    rows.sort((a, b) => rule === 'price' ? readValue(a, rule) - readValue(b, rule) : readValue(b, rule) - readValue(a, rule));
    rows.forEach((row) => rowsHost.append(row));
    label.textContent = `Сортировка: ${option.textContent}`;
    menu.querySelectorAll('[data-pen-sort]').forEach((item) => item.setAttribute('aria-selected', String(item === option)));
    frame.__applyPenCardFilters?.();
    close();
  }));
  document.addEventListener('click', (event) => { if (!select.contains(event.target)) close(); });
}

function setupPenFaq(frame) {
  // Pen exports FAQ as two permanently visible layers. Turn each pair into an
  // actual disclosure while retaining the original visual layers and copy.
  const items = [...frame.querySelectorAll('[data-pencil-name^="FAQ Item"]')];
  if (!items.length) return;
  const copyByQuestion = {
    'Можно ли купить место в топе?': 'Нет. Позиции в рейтинге формируются только по результатам проверок, открытым данным и отзывам пользователей. Платное размещение не влияет на оценку.',
    'Что значит статус «Был тайный покупатель»?': 'Этот статус означает, что сервис недавно прошёл проверку тайным покупателем. В карточке сервиса можно открыть подробный отчёт о проверке.',
    'Какие валюты поддерживают карты в рейтинге?': 'Поддерживаемые валюты указаны в каждой карточке. Условия выпуска, пополнения и доступные валюты могут меняться, поэтому мы регулярно обновляем данные.'
  };
  const answers = new WeakMap();
  const setOpen = (item, open) => {
    const answer = answers.get(item);
    const question = item.querySelector('[data-pencil-name="Question Row"]');
    if (!answer || !question) return;
    item.classList.toggle('is-open', open);
    question.setAttribute('aria-expanded', String(open));
    answer.hidden = !open;
    answer.style.setProperty('display', open ? 'flex' : 'none', 'important');
  };
  items.forEach((item, index) => {
    const question = item.querySelector(':scope > [data-pencil-name="Question Row"]');
    let answer = [...item.children].find((child) => child !== question);
    if (!answer && question) {
      answer = document.createElement('div');
      answer.className = 'pen-faq-generated-answer';
      answer.setAttribute('data-pencil-name', 'Answer Wrap');
      const text = question.querySelector('[data-pencil-name="Question"]')?.textContent.trim();
      answer.innerHTML = `<div data-pencil-name="Answer">${copyByQuestion[text] || 'Подробные условия и результаты проверки собраны в карточке сервиса.'}</div>`;
      item.append(answer);
    }
    if (!question || !answer) return;
    const answerId = `pen-faq-answer-${index}`;
    answers.set(item, answer);
    item.classList.add('pen-faq-item');
    answer.id = answerId;
    question.setAttribute('role', 'button');
    question.setAttribute('tabindex', '0');
    question.setAttribute('aria-controls', answerId);
    const toggle = () => {
      const shouldOpen = !item.classList.contains('is-open');
      items.forEach((other) => setOpen(other, other === item && shouldOpen));
    };
    question.addEventListener('click', toggle);
    question.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); toggle(); }
    });
    setOpen(item, index === 0);
  });
}

function setupPenReportTabs(frame) {
  const tabs = [...frame.querySelectorAll('[data-pencil-name^="Tab "]')]
    .filter((tab) => /^Tab \d{2}\.\d{2}\.\d{4}$/.test(tab.getAttribute('data-pencil-name') || ''));
  if (!tabs.length) return;
  const targets = ['#check-2024', '#check-2023', '#check-2023'];
  tabs.forEach((tab, index) => {
    const selected = index === 0;
    tab.setAttribute('role', 'tab');
    tab.setAttribute('aria-selected', String(selected));
    tab.tabIndex = selected ? 0 : -1;
    const activate = () => { window.location.href = `${window.location.pathname}${targets[index] || '#check-2023'}`; };
    tab.addEventListener('click', activate);
    tab.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); activate(); }
    });
  });
}

function setupPenMobileCardLinks(frame, page) {
  // In the 375px frames the desktop “Подробнее” column is represented by the
  // chevron in every Card Head. Make that very same target reachable by the
  // chevron (and its enclosing tappable heading), preserving the service/card
  // distinction used by the desktop table.
  frame.querySelectorAll('[data-pencil-name^="Service Card "]').forEach((card) => {
    const head = card.querySelector('[data-pencil-name="Card Head"]');
    if (!head) return;
    const section = card.closest('[data-pencil-name="Top 10 Section"]');
    const isVirtualCard = page === 'cards'
      || (page === 'home' && /виртуальн\S*\s+карт/i.test(section?.textContent || ''));
    const serviceName = head.querySelector('[data-pencil-name="Service Name"]')?.textContent.trim();
    const destination = isVirtualCard ? '/virtual-card.html' : '/service.html';
    makeInteractive(head, destination);
    if (serviceName) head.setAttribute('aria-label', `Подробнее о ${serviceName}`);
    // In one Pen mobile composition the chevron is a sibling of Card Head;
    // in another it is nested inside it. Only bind the separate arrow so the
    // output never has an invalid interactive element inside another one.
    card.querySelectorAll('[data-pencil-name="Chevron"]').forEach((chevron) => {
      if (head.contains(chevron)) return;
      makeInteractive(chevron, destination);
      if (serviceName) chevron.setAttribute('aria-label', `Подробнее о ${serviceName}`);
    });
  });
}

export function enhanceInteractions(frame, page) {
  frame.querySelectorAll('[data-pencil-name]').forEach((node) => {
    const destination = destinationByLayer[node.getAttribute('data-pencil-name')];
    if (destination) makeInteractive(node, destination);
  });
  // The home frame contains two visually identical “Весь рейтинг →” links.
  // The second belongs to virtual cards and therefore has a different route.
  if (page === 'home') frame.querySelectorAll('[data-pencil-name="Link All Rating"]').forEach((node, index) => {
    makeInteractive(node, index === 1 ? '/virtual-cards.html' : '/rating.html');
  });
  if (page === 'home') frame.querySelectorAll('[data-pencil-name="Link All Reviews"]').forEach((node) => makeInteractive(node, '#'));
  if (page === 'home') setupPenReviewSlider(frame);
  if (page === 'home') frame.querySelectorAll('[data-pencil-name^="Review Card "] [data-pencil-name="Service Chip"]').forEach((node) => makeInteractive(node, '/service.html'));
  frame.querySelectorAll('[data-pencil-name="Dzen Icon"], [data-pencil-name="Dzen Row"]').forEach((node) => makeInteractive(node, '#dzen'));
  frame.querySelectorAll('[data-pencil-name="Burger"]').forEach((node) => {
    node.setAttribute('role', 'button');
    node.setAttribute('tabindex', '0');
    node.setAttribute('aria-label', 'Открыть меню');
    const openMenu = () => { const url = new URL(location.href); url.searchParams.set('menu', 'open'); location.href = url.toString(); };
    node.addEventListener('click', openMenu);
    node.addEventListener('keydown', (event) => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); openMenu(); } });
  });
  frame.querySelectorAll('[data-pencil-name="Button Details"], [data-pencil-name="Action"]').forEach((node) => {
    // Desktop Pen rows contain Button Details inside an Action cell. The cell
    // is the one real tap target; binding both would create nested links and
    // is not present in the supplied interaction geometry.
    if (node.getAttribute('data-pencil-name') === 'Button Details' && node.closest('[data-pencil-name="Action"]')) return;
    const section = node.closest('[data-pencil-name="Top 10 Section"]');
    const virtualCardAction = page === 'cards'
      || (page === 'home' && /виртуальн\S*\s+карт/i.test(section?.textContent || ''));
    makeInteractive(node, virtualCardAction ? '/virtual-card.html' : '/service.html');
  });
  if (page === 'home' || page === 'rating' || page === 'cards') setupPenMobileCardLinks(frame, page);
  frame.querySelectorAll('[data-pencil-name="Button Full Rating"]').forEach((node) => makeInteractive(node, page === 'home' && node.closest('[data-pencil-name="Top 10 Section"]')?.textContent.includes('виртуальных карт') ? '/virtual-cards.html' : '/rating.html'));
  frame.querySelectorAll('[data-pencil-name="Back Link"]').forEach((node) => makeInteractive(node, page === 'virtual-card' ? '/virtual-cards.html' : '/rating.html'));
  frame.querySelectorAll('[data-pencil-name^="Report Card"]').forEach((node) => makeInteractive(node, '/report.html'));
  if (page === 'reports') {
    // Pagination is present in the mockup but the destination pages are out of
    // scope; every visible control remains keyboard-accessible as a # stub.
    frame.querySelectorAll('[data-pencil-name]').forEach((node) => {
      if (/^Page (Первая|‹|1|2|3|›|Последняя)$/.test(node.getAttribute('data-pencil-name'))) makeInteractive(node, '#');
    });
  }
  if (page === 'report') setupPenReportTabs(frame);
  if (page === 'reports' || page === 'advertising') {
    frame.querySelectorAll('[data-pencil-name="Button"]').forEach((node) => {
      if (node.textContent.trim() === 'Написать в Telegram ↗') makeInteractive(node, '#');
    });
  }
  if (page === 'contacts') {
    frame.querySelectorAll('[data-pencil-name="Button Dzen"], [data-pencil-name="Faq Card"]').forEach((node) => makeInteractive(node, '#'));
  }
  if (page === 'service' || page === 'virtual-card') {
    setupPenPromo(frame);
    removePenDemoLabels(frame);
    setupPenLoadMore(frame);
    setupPenReviewForm(frame);
    setupPenReviewSort(frame);
    frame.querySelectorAll('[data-pencil-name="Button Primary"], [data-pencil-name="Button Outline"], [data-pencil-name^="Mystery Shopper Report"] [data-pencil-name="Button"]').forEach((node) => makeInteractive(node, '#'));
  }
  if (page === 'cards') {
    setupPenCardFilterChips(frame);
    setupPenMobileCardFilters(frame);
    setupPenCardSort(frame);
  }
  setupPenFaq(frame);
  // Keep a final safety net after page-specific bindings: raw Pen controls are
  // div layers, and the frame replaces the semantic DOM that originally owned
  // its event listeners. Known controls above keep their real behaviour;
  // every remaining visible button/link stays keyboard-operable as a # stub.
  bindUnmappedPenControls(frame, (node) => {
    const destination = node.dataset.penLink || '#';
    window.location.href = destination;
  });
  const breadcrumbDestinations = { 'Главная': '/', 'Рейтинг': '/rating.html', 'Виртуальные карты': '/virtual-cards.html', 'Отчёты': '/reports.html', 'Методика проверки': '/methodology.html' };
  frame.querySelectorAll('[data-pencil-name="Crumb"], [data-pencil-name="Crumb Home"]').forEach((node) => {
    const destination = breadcrumbDestinations[node.textContent.trim()];
    if (destination) makeInteractive(node, destination);
  });
  const activeLayer = activeNavigationLayer[page];
  if (activeLayer) frame.querySelectorAll(`[data-pencil-name="${activeLayer}"]`).forEach((node) => {
    node.classList.add('is-current-page');
    node.setAttribute('aria-current', 'page');
  });
}

export function targetFor(page, width, requestUrl) {
  const request = new URL(requestUrl, window.location.origin);
  const query = request.searchParams;
  // The supplied mobile Pen exports are authored at 375px.  At 320px use
  // the responsive semantic shell instead of cropping a fixed export.
  const mobile = width >= 375 && width <= 480;
  if (query.get('menu') === 'open' && mobile) return 'Мобильное меню (открыто) 375';
  if (query.get('empty') === '1' && page === 'rating') return mobile ? 'Рейтинг — ничего не найдено Mobile 375' : 'Рейтинг — ничего не найдено Desktop 1440';
  if (query.get('empty') === '1' && page === 'cards') return mobile ? 'Виртуальные карты — ничего не найдено Mobile 375' : 'Виртуальные карты — ничего не найдено Desktop 1440';
  if (query.get('reviews') === 'none' && page === 'service') return mobile ? 'Карточка сервиса без отзывов Mobile 375' : 'Карточка сервиса без отзывов Desktop 1440';
  if (request.hash === '#check-2023' && page === 'report') return mobile ? 'Отчёт Mobile — Состояние 2' : 'Отчёт Desktop — Состояние 2';
  // The services rating and methodology use the semantic local implementation:
  // the Pen export contains a static tab-demo duplicate, which cannot become
  // a single accessible interactive disclosure without replacing it.
  if (page === 'rating' || page === 'methodology') return null;
  const variants = frames[page];
  if (!variants) return null;
  if (mobile) return variants.mobile;
  // The report has a complete authored desktop article in Pen. It already
  // fits the 1200px content grid at 1280px and avoids the abbreviated local
  // fallback text at this breakpoint.
  if (['report', 'reports', 'advertising'].includes(page) && width >= 1280) return variants.desktop;
  // The home page has authored 1024px and 1440px compositions. Selecting the
  // nearest one across the entire desktop range avoids falling back to a
  // visually different semantic page at common laptop widths such as 1280px.
  if (page === 'home' && width >= 1280) return variants.desktop;
  // The tablet export is a fixed 1024px composition. Below 960px its inner
  // rail would be cropped, so the responsive semantic layout owns 768–959px.
  if (page === 'home' && width >= 960) return variants.tablet;
  // Desktop Pen frames have a fixed 1440px canvas. Below that width the
  // semantic responsive implementation keeps every table column — including
  // the action — inside the viewport instead of cropping the right edge.
  if (width >= 1440) return variants.desktop;
  return null;
}

export function penSourceUrls(basePath = import.meta.env.BASE_URL) {
  return [
    sitePath('reference/pen-source.html', basePath),
    sitePath('reference/pen-states.html', basePath)
  ];
}

export async function applyExactPenFrame(root, page, requestUrl = window.location.href) {
  const target = targetFor(page, window.innerWidth, requestUrl);
  if (!target) return false;
  // Preserve the one semantic site header rendered by app.js. Pen exports have
  // per-frame copies of the header with slightly different dimensions; keeping
  // those copies made the navigation visibly jump from page to page.
  const sharedHeader = root.querySelector('.header');
  const sources = await Promise.all(penSourceUrls().map((url) => fetch(url).then((response) => response.ok ? response.text() : '')));
  const source = sources.flatMap((html) => [...new DOMParser().parseFromString(html, 'text/html').querySelectorAll('[data-pencil-name]')]).find((node) => node.getAttribute('data-pencil-name') === target);
  if (!source) return false;
  const frame = source.cloneNode(true);
  frame.classList.add('pen-frame');
  frame.style.width = '100%';
  frame.style.position = 'relative';
  frame.style.left = '0';
  frame.style.top = '0';
  // Keep the shared header as a root sibling, not inside a fixed-width Pen
  // frame. Otherwise its container inherits a different frame width per page.
  frame.querySelector('[data-pencil-name="Header"], [data-pencil-name="Header (sticky)"]')?.remove();
  // Pen references this banner with a relative export path. Once injected into
  // the app page that URL no longer resolves, so point it to the copied asset.
  frame.querySelectorAll('[data-pencil-name="Ad Banner"]').forEach((banner) => {
    banner.style.backgroundImage = `url('${sitePath('assets/49f300f8117351a3.jpg')}')`;
  });
  // Article screenshots in the exported report use paths relative to the
  // reference HTML (`images/...`). Once the frame lives at /report.html,
  // preserve the exact supplied images from the public asset directory.
  frame.querySelectorAll('[style*="images/"]').forEach((node) => {
    const match = node.style.backgroundImage.match(/url\(["']?images\/([^"')]+)/);
    if (match) node.style.backgroundImage = `url('${sitePath(`assets/${match[1]}`)}')`;
  });
  if (page === 'home') {
    const heroSubtitle = frame.querySelector('[data-pencil-name="Hero Subtitle"]');
    if (heroSubtitle) {
      heroSubtitle.innerHTML = 'К сервисам альтернативной оплаты мы относим и посредников, которые оплачивают <br>зарубежные подписки за вас, и сервисы, выпускающие виртуальные зарубежные карты. <br>Проверяем и те, и другие.';
    }
    frame.querySelectorAll('[data-pencil-name="Top 10 Section"] [data-pencil-name="Table"]').forEach((table) => {
      // Pen's export declares the table a non-shrinking flex item. Its rows
      // also have a 1200px content width plus horizontal padding, which made
      // the whole table spill 34px past the "Весь рейтинг" rail at 1280px.
      table.style.minWidth = '0';
      table.style.maxWidth = '100%';
      table.style.flexShrink = '1';
      [...table.children].forEach((row) => {
        row.style.boxSizing = 'border-box';
        row.style.width = '100%';
      });
    });
  }
  if (page === 'cards') {
    const emptyState = sources.flatMap((html) => [...new DOMParser().parseFromString(html, 'text/html').querySelectorAll('[data-pencil-name]')])
      .find((node) => node.getAttribute('data-pencil-name') === 'Виртуальные карты — ничего не найдено Desktop 1440');
    const emptyTemplate = emptyState?.querySelector('[data-pencil-name="Not Found Block"]');
    if (emptyTemplate) frame.__penEmptyTemplate = emptyTemplate.cloneNode(true);
  }
  enhanceInteractions(frame, page);
  root.replaceChildren(...(sharedHeader ? [sharedHeader, frame] : [frame]));
  root.dataset.penExact = target;

  // A Pen export is a fixed reference composition.  When a user changes the
  // browser width after the page has loaded, mount the correct composition
  // again instead of leaving the previous desktop/mobile export on screen.
  // The semantic pages naturally reflow; this listener is needed only while
  // an exact Pen frame is active.
  const mountedWidth = window.innerWidth;
  let resizeTimer;
  window.addEventListener('resize', () => {
    window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(() => {
      if (window.innerWidth !== mountedWidth) window.location.reload();
    }, 180);
  }, { once: true });
  return true;
}

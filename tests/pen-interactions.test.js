import { readFileSync } from 'node:fs';
import { JSDOM } from 'jsdom';
import { describe, expect, it, vi } from 'vitest';
import { bindUnmappedPenControls } from '../src/js/pen-interactions.js';
import { applyExactPenFrame, enhanceInteractions, penDestination, penSourceUrls, targetFor } from '../src/js/pen-frame.js';
import { paymentEvidenceMarkup } from '../src/js/report-content.js';

describe('unmapped Pen controls', () => {
  it('uses the supplied desktop home composition at 1280px instead of a mismatched fallback', () => {
    const dom = new JSDOM('', { url: 'https://example.test/service-layout/' });
    vi.stubGlobal('window', dom.window);

    expect(targetFor('home', 1280, dom.window.location.href)).toBe('Главная Desktop 1440');
    expect(targetFor('home', 1200, dom.window.location.href)).toBe('Главная Tablet 1024');

    vi.unstubAllGlobals();
  });

  it('keeps the three intended lines in the home hero subtitle', async () => {
    const source = readFileSync('public/reference/pen-source.html', 'utf8');
    const dom = new JSDOM('<main id="app"><header class="header"></header></main>', { url: 'http://localhost/' });
    Object.defineProperty(dom.window, 'innerWidth', { configurable: true, value: 1280 });
    vi.stubGlobal('window', dom.window);
    vi.stubGlobal('document', dom.window.document);
    vi.stubGlobal('DOMParser', dom.window.DOMParser);
    vi.stubGlobal('location', dom.window.location);
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, text: async () => source }));

    await applyExactPenFrame(dom.window.document.querySelector('#app'), 'home', dom.window.location.href);

    const subtitle = dom.window.document.querySelector('[data-pencil-name="Hero Subtitle"]');
    expect(subtitle?.querySelectorAll('br')).toHaveLength(2);
    expect(subtitle?.textContent.replace(/\s+/g, ' ').trim()).toBe('К сервисам альтернативной оплаты мы относим и посредников, которые оплачивают зарубежные подписки за вас, и сервисы, выпускающие виртуальные зарубежные карты. Проверяем и те, и другие.');
    vi.unstubAllGlobals();
  });

  it('keeps the home hero subtitle naturally wrapped in the supplied 375px frame', async () => {
    const source = readFileSync('public/reference/pen-source.html', 'utf8');
    const dom = new JSDOM('<main id="app"><header class="header"></header></main>', { url: 'http://localhost/' });
    Object.defineProperty(dom.window, 'innerWidth', { configurable: true, value: 375 });
    vi.stubGlobal('window', dom.window);
    vi.stubGlobal('document', dom.window.document);
    vi.stubGlobal('DOMParser', dom.window.DOMParser);
    vi.stubGlobal('location', dom.window.location);
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, text: async () => source }));

    await applyExactPenFrame(dom.window.document.querySelector('#app'), 'home', dom.window.location.href);

    const subtitle = dom.window.document.querySelector('[data-pencil-name="Hero Subtitle"]');
    expect(subtitle?.querySelectorAll('br')).toHaveLength(0);
    vi.unstubAllGlobals();
  });

  it('uses two requested header lines, a complete legend, and 20px filter spacing on the rating page', () => {
    const app = readFileSync('src/js/app.js', 'utf8');
    const css = readFileSync('src/styles/main.css', 'utf8');

    expect(app).toContain('<p class="catalog-page-header__description">Все сервисы, которые мы проверяли за последние два года — включая те, что перестали работать.</p><p class="catalog-page-header__description">Фильтруйте по комиссии, рейтингу и статусу проверки.</p>');
    expect(app).toContain('Отчёт актуален');
    expect(app).toContain('Требует обновления');
    expect(app).toContain('Отчёта нет');
    expect(css).toContain('.catalog-page-header--rating h1 { max-width: none; white-space: nowrap; }');
    expect(css).toContain('.catalog-page-header--rating .catalog-page-header__description { max-width: none; white-space: nowrap; }');
    expect(css).toContain('.catalog-page-metrics b::before { content: none; }');
    expect(css).toContain('.catalog--rating .catalog__legend--disclosure { margin: 20px; }');
  });

  it('keeps the home table inside the same 1200px rail as “Весь рейтинг”', async () => {
    const source = readFileSync('public/reference/pen-source.html', 'utf8');
    const dom = new JSDOM('<main id="app"><header class="header"></header></main>', { url: 'http://localhost/' });
    Object.defineProperty(dom.window, 'innerWidth', { configurable: true, value: 1280 });
    vi.stubGlobal('window', dom.window);
    vi.stubGlobal('document', dom.window.document);
    vi.stubGlobal('DOMParser', dom.window.DOMParser);
    vi.stubGlobal('location', dom.window.location);
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, text: async () => source }));

    await applyExactPenFrame(dom.window.document.querySelector('#app'), 'home', dom.window.location.href);

    const table = dom.window.document.querySelector('[data-pencil-name="Top 10 Section"] [data-pencil-name="Table"]');
    expect(table.style.minWidth).toBe('0');
    expect(table.style.maxWidth).toBe('100%');
    expect(table.style.flexShrink).toBe('1');
    expect([...table.children].every((row) => row.style.boxSizing === 'border-box' && row.style.width === '100%')).toBe(true);
    vi.unstubAllGlobals();
  });

  it('keeps the desktop report advert in a separate right-side grid column', () => {
    const css = readFileSync('src/styles/main.css', 'utf8');

    expect(css).toContain('.pen-frame[data-pencil-name="Отчёт Desktop 1440"] [data-pencil-name="Columns"]');
    expect(css).toContain('grid-template-columns: minmax(0, 780px) 340px !important;');
    expect(css).toContain('[data-pencil-name="Summary Block"] {\n    box-sizing: border-box !important;');
    expect(css).toContain('[data-pencil-name="Side Column (sticky)"]');
    expect(css).toContain('grid-column: 2;');
    expect(css).toContain('transform: translateX(20px);');
  });

  it('matches Methodology footer controls to the shared Pen footer', () => {
    const css = readFileSync('src/styles/main.css', 'utf8');

    expect(css).toContain('.pen-frame[data-pencil-name="Методика проверки Desktop 1440"] [data-pencil-name="Footer"] [data-pencil-name="Button Add Service"]');
    expect(css).toContain('height: fit-content !important;');
    expect(css).toContain('width: fit-content !important;');
    expect(css).toContain('padding: 11px 18px !important;');
    expect(css).toContain('[data-pencil-name^="Link "][data-pen-link]:hover');
    expect(css).toContain('opacity: .78 !important;');
    expect(css).not.toContain('[data-pen-link]:hover {\n  opacity: 1 !important;');
  });

  it('loads exported Pen frames from the GitHub Pages repository path', () => {
    expect(penSourceUrls('/service-layout/')).toEqual([
      '/service-layout/reference/pen-source.html',
      '/service-layout/reference/pen-states.html'
    ]);
  });

  it('keeps Pen navigation within the GitHub Pages repository path', () => {
    expect(penDestination('/service.html', '/service-layout/')).toBe('/service-layout/service.html');
    expect(penDestination('#reviews', '/service-layout/')).toBe('#reviews');
  });

  it('renders all supplied payment screenshots in the responsive report article', () => {
    const dom = new JSDOM(paymentEvidenceMarkup());
    const screenshots = [...dom.window.document.querySelectorAll('.payment-evidence img')];

    expect(screenshots.map((image) => image.getAttribute('src'))).toEqual([
      '/assets/fda0d46096cb5d4a.png',
      '/assets/8f78b574a99d9a1d.png',
      '/assets/c0aba130d07c243e.png'
    ]);
    expect(screenshots.every((image) => image.getAttribute('loading') === 'lazy')).toBe(true);
  });

  it('lets the payment screenshots fill the report article on tablet widths', () => {
    const css = readFileSync('src/styles/main.css', 'utf8');

    expect(css).toContain('@media (min-width: 768px) and (max-width: 1199px)');
    expect(css).toContain('.payment-evidence__item {\n    width: 100%;\n    max-width: none;');
    expect(css).toContain('.payment-evidence__item img {\n    width: 100%;\n    height: auto;');
  });

  it('matches the mobile Pen report evidence sizing instead of retaining desktop thumbnails', () => {
    const css = readFileSync('src/styles/main.css', 'utf8');

    expect(css).toContain('@media (max-width: 767px)');
    expect(css).toContain('.payment-evidence__item {\n    width: 100%;\n    max-width: none;');
    expect(css).toContain('.payment-evidence__item img {\n    width: 100%;\n    height: 280px;\n    object-fit: fill;');
  });

  it('makes a visible exported button keyboard-accessible and invokes its fallback action once', () => {
    const dom = new JSDOM('<div id="frame"><div data-pencil-name="Button">Открыть</div></div>');
    const action = vi.fn();
    const button = dom.window.document.querySelector('[data-pencil-name="Button"]');

    bindUnmappedPenControls(dom.window.document.querySelector('#frame'), action);
    button.dispatchEvent(new dom.window.MouseEvent('click', { bubbles: true }));

    expect(button.getAttribute('role')).toBe('button');
    expect(button.tabIndex).toBe(0);
    expect(action).toHaveBeenCalledTimes(1);
  });

  it('also exposes exported report tabs as keyboard controls', () => {
    const dom = new JSDOM('<div id="frame"><div data-pencil-name="Tab 03.09.2023">03.09.2023</div></div>');
    const tab = dom.window.document.querySelector('[data-pencil-name^="Tab"]');

    bindUnmappedPenControls(dom.window.document.querySelector('#frame'), vi.fn());

    expect(tab.getAttribute('role')).toBe('button');
    expect(tab.tabIndex).toBe(0);
  });

  it('does not create a nested control inside a Pen layer that already has an action', () => {
    const dom = new JSDOM('<div id="frame"><div role="link"><div data-pencil-name="Button Label">Добавить сервис</div></div></div>');
    const label = dom.window.document.querySelector('[data-pencil-name="Button Label"]');

    bindUnmappedPenControls(dom.window.document.querySelector('#frame'), vi.fn());

    expect(label.getAttribute('role')).toBeNull();
  });

  it('binds tabs and actions in the supplied mobile report frame after it replaces the semantic DOM', () => {
    const dom = new JSDOM(readFileSync('public/reference/pen-source.html', 'utf8'), { url: 'http://localhost/report.html' });
    const frame = [...dom.window.document.querySelectorAll('[data-pencil-name]')]
      .find((node) => node.getAttribute('data-pencil-name') === 'Отчёт Mobile 375')
      .cloneNode(true);
    vi.stubGlobal('window', dom.window);
    vi.stubGlobal('document', dom.window.document);
    vi.stubGlobal('location', dom.window.location);

    enhanceInteractions(frame, 'report');

    expect(frame.querySelector('[data-pencil-name="Tab 03.09.2023"]')?.getAttribute('role')).toBe('tab');
    expect(frame.querySelector('[data-pencil-name="Button"]')?.getAttribute('role')).toBe('button');
    vi.unstubAllGlobals();
  });

  it('keeps the three payment screenshots when the report Pen frame is mounted', async () => {
    const source = readFileSync('public/reference/pen-source.html', 'utf8');
    const dom = new JSDOM('<main id="app"><header class="header"></header></main>', { url: 'http://localhost/report.html' });
    Object.defineProperty(dom.window, 'innerWidth', { configurable: true, value: 1440 });
    vi.stubGlobal('window', dom.window);
    vi.stubGlobal('document', dom.window.document);
    vi.stubGlobal('DOMParser', dom.window.DOMParser);
    vi.stubGlobal('location', dom.window.location);
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, text: async () => source }));

    await applyExactPenFrame(dom.window.document.querySelector('#app'), 'report', dom.window.location.href);

    const paymentImages = [...dom.window.document.querySelectorAll('[data-pencil-name="Image Wrap"] > [data-pencil-name="img"]')]
      .map((image) => image.style.backgroundImage);
    expect(paymentImages).toEqual([
      'url("/assets/fda0d46096cb5d4a.png")',
      'url("/assets/8f78b574a99d9a1d.png")',
      'url("/assets/c0aba130d07c243e.png")'
    ]);
    vi.unstubAllGlobals();
  });

  it('keeps one report heading and removes the exported stale-report demo label', () => {
    const source = readFileSync('public/reference/pen-source.html', 'utf8');
    const dom = new JSDOM(source, { url: 'https://example.test/report.html' });
    const report = [...dom.window.document.querySelectorAll('[data-pencil-name]')]
      .find((node) => node.getAttribute('data-pencil-name') === 'Отчёт Desktop 1440');

    const headings = [...report.querySelectorAll('[data-pencil-name="Main Column"] [data-pencil-name="H1"]')]
      .filter((heading) => heading.textContent.trim() === 'RUPay.money — отчёт о проверке тайным покупателем');
    expect(headings).toHaveLength(1);
    expect(report.textContent).not.toContain('Пример: устаревший отчёт (заголовок)');
  });

  it('switches to the old report state when either old report tab is clicked without a page reload', async () => {
    const source = readFileSync('public/reference/pen-source.html', 'utf8');
    const states = readFileSync('public/reference/pen-states.html', 'utf8');
    const dom = new JSDOM('<main id="app"><header class="header"></header></main>', { url: 'http://localhost/report.html' });
    Object.defineProperty(dom.window, 'innerWidth', { configurable: true, value: 1440 });
    vi.stubGlobal('window', dom.window);
    vi.stubGlobal('document', dom.window.document);
    vi.stubGlobal('DOMParser', dom.window.DOMParser);
    vi.stubGlobal('location', dom.window.location);
    vi.stubGlobal('fetch', vi.fn().mockImplementation(async (url) => ({
      ok: true,
      text: async () => String(url).includes('pen-states') ? states : source
    })));
    const root = dom.window.document.querySelector('#app');

    await applyExactPenFrame(root, 'report', dom.window.location.href);
    for (const date of ['03.09.2023', '12.01.2023']) {
      root.querySelector(`[data-pencil-name="Tab ${date}"]`)?.dispatchEvent(new dom.window.MouseEvent('click', { bubbles: true }));
      await new Promise((resolve) => dom.window.setTimeout(resolve, 0));
    }

    expect(root.dataset.penExact).toBe('Отчёт Desktop 1440');
    expect(root.querySelector('[data-pencil-name="Checked Service Card"]')?.textContent).toContain('RUPay.money');
    expect(root.querySelector('[data-pencil-name="Warning Banner"]')?.textContent).toContain('Вы смотрите проверку от 03.09.2023');
    expect(root.textContent).toContain('Изучить сервис в рейтинге →');
    expect(root.textContent).toContain('Перейти на сайт сервиса ↗');
    expect(root.querySelector('[data-pencil-name="Tab 12.01.2023"]')?.style.outline).toBe('1px solid #45A828');
    expect(root.querySelector('[data-pencil-name="Article Card (old, condensed)"] [data-pencil-name="img"]')?.style.backgroundImage)
      .toBe('url("/assets/fda0d46096cb5d4a.png")');
    root.querySelector('[data-pencil-name="Warning Banner"] [data-pencil-name="Link"]')
      ?.dispatchEvent(new dom.window.MouseEvent('click', { bubbles: true }));
    await new Promise((resolve) => dom.window.setTimeout(resolve, 0));
    expect(root.querySelector('[data-pencil-name="Warning Banner"]')).toBeNull();
    expect(root.querySelector('[data-pencil-name="Summary Block"]')?.textContent).toContain('Платёж прошёл без проблем');
    vi.unstubAllGlobals();
  });

  it('uses the old report state without its exported state-label layer', () => {
    const states = readFileSync('public/reference/pen-states.html', 'utf8');
    const dom = new JSDOM('', { url: 'https://example.test/report.html#check-2023' });

    expect(targetFor('report', 1440, dom.window.location.href)).toBe('Отчёт Desktop 1440');
    expect(states).not.toContain('Состояние 2: выбрана старая проверка');
  });

  it('uses the supplied 75px summary block for the old report check', () => {
    const states = readFileSync('public/reference/pen-states.html', 'utf8');
    const dom = new JSDOM(states, { url: 'https://example.test/report.html' });
    const oldSummary = dom.window.document.querySelector('[data-pencil-name="Отчёт Desktop — Состояние 2"] [data-pencil-name="Summary Block (old)"]');

    expect(oldSummary?.style.height).toBe('75px');
    expect(oldSummary?.style.padding).toBe('20px');
    expect(oldSummary?.style.borderColor).toBe('rgb(245, 166, 35)');
  });

  it('gives the checked-service green action the shared green-button hover state', () => {
    const css = readFileSync('src/styles/main.css', 'utf8');

    expect(css).toContain('.pen-frame [data-pencil-name="Checked Service Card"] [data-pencil-name="Button"]:hover');
    expect(css).toContain('background-color: #2f8a16 !important;');
  });

  it('makes the virtual-card mobile sort control functional for Pen card rows', () => {
    const dom = new JSDOM(readFileSync('public/reference/pen-source.html', 'utf8'), { url: 'http://localhost/virtual-cards.html' });
    const frame = [...dom.window.document.querySelectorAll('[data-pencil-name]')]
      .find((node) => node.getAttribute('data-pencil-name') === 'Виртуальные карты Mobile 375')
      .cloneNode(true);
    vi.stubGlobal('window', dom.window);
    vi.stubGlobal('document', dom.window.document);
    vi.stubGlobal('location', dom.window.location);

    enhanceInteractions(frame, 'cards');

    expect(frame.querySelector('[data-pencil-name="Sort Select"]')?.getAttribute('role')).toBe('button');
    frame.querySelector('[data-pen-sort="reviews"]')?.dispatchEvent(new dom.window.MouseEvent('click', { bubbles: true }));
    frame.querySelector('[data-pen-sort="price"]')?.dispatchEvent(new dom.window.MouseEvent('click', { bubbles: true }));
    expect([...frame.querySelectorAll('[data-pencil-name="Service Cards"] > [data-pencil-name^="Service Card "]')]
      .slice(0, 4)
      .map((card) => card.querySelector('[data-pencil-name="Service Name"]')?.textContent.trim()))
      .toEqual(['Плати Легко!', 'FASTPAYTODAY', 'GetPayAll', 'CheatPay']);
    vi.unstubAllGlobals();
  });

  it('opens a real filter panel from the virtual-card mobile Pen control', () => {
    const dom = new JSDOM(readFileSync('public/reference/pen-source.html', 'utf8'), { url: 'http://localhost/virtual-cards.html' });
    const frame = [...dom.window.document.querySelectorAll('[data-pencil-name]')]
      .find((node) => node.getAttribute('data-pencil-name') === 'Виртуальные карты Mobile 375')
      .cloneNode(true);
    vi.stubGlobal('window', dom.window);
    vi.stubGlobal('document', dom.window.document);
    vi.stubGlobal('location', dom.window.location);
    dom.window.document.body.append(frame);

    enhanceInteractions(frame, 'cards');
    expect(frame.querySelector('[data-pencil-name="Filters Button"] [data-pencil-name="Count"]')?.textContent.trim()).toBe('0');
    frame.querySelector('[data-pencil-name="Filters Button"]')?.dispatchEvent(new dom.window.MouseEvent('click', { bubbles: true }));

    expect(frame.querySelector('.pen-card-filter-panel')?.hidden).toBe(false);
    expect(frame.querySelector('.pen-card-filter-panel')?.previousElementSibling)
      .toBe(frame.querySelector('[data-pencil-name="Filters Button"]'));
    expect(frame.querySelector('.pen-card-filter-panel')?.style.position).toBe('fixed');
    dom.window.document.dispatchEvent(new dom.window.KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    expect(frame.querySelector('.pen-card-filter-panel')?.hidden).toBe(true);
    expect(dom.window.document.activeElement).toBe(frame.querySelector('[data-pencil-name="Filters Button"]'));
    frame.querySelector('[data-pencil-name="Filters Button"]')?.dispatchEvent(new dom.window.MouseEvent('click', { bubbles: true }));
    frame.querySelector('[data-value="Apple Pay"]')?.dispatchEvent(new dom.window.MouseEvent('click', { bubbles: true }));
    expect(frame.querySelector('.pen-card-mobile-empty')?.hidden).toBe(false);
    expect(frame.querySelector('[data-pencil-name="Filters Button"] [data-pencil-name="Count"]')?.textContent.trim()).toBe('1');
    frame.querySelector('.pen-card-filter-reset')?.dispatchEvent(new dom.window.MouseEvent('click', { bubbles: true }));
    expect(frame.querySelector('.pen-card-mobile-empty')?.hidden).toBe(true);
    expect(frame.querySelector('[data-pencil-name="Filters Button"] [data-pencil-name="Count"]')?.textContent.trim()).toBe('0');
    expect([...frame.querySelectorAll('[data-pencil-name="Service Cards"] > [data-pencil-name^="Service Card "]')]
      .every((card) => !card.hidden)).toBe(true);
    vi.unstubAllGlobals();
  });

  it('sends each mobile table chevron to the same service page as desktop details', () => {
    const dom = new JSDOM(readFileSync('public/reference/pen-source.html', 'utf8'), { url: 'http://localhost/' });
    vi.stubGlobal('window', dom.window);
    vi.stubGlobal('document', dom.window.document);
    vi.stubGlobal('location', dom.window.location);

    for (const [frameName, page, destination] of [
      ['Рейтинг Mobile 375', 'rating', '/service.html'],
      ['Виртуальные карты Mobile 375', 'cards', '/virtual-card.html']
    ]) {
      const source = [...dom.window.document.querySelectorAll('[data-pencil-name]')]
        .find((node) => node.getAttribute('data-pencil-name') === frameName);
      const frame = source.cloneNode(true);
      enhanceInteractions(frame, page);
      const heads = [...frame.querySelectorAll('[data-pencil-name^="Service Card "] [data-pencil-name="Card Head"]')];
      expect(heads.length).toBeGreaterThan(0);
      expect(heads.every((head) => head.dataset.penLink === destination && head.getAttribute('role') === 'link')).toBe(true);
    }

    const homeSource = [...dom.window.document.querySelectorAll('[data-pencil-name]')]
      .find((node) => node.getAttribute('data-pencil-name') === 'Главная Mobile 375');
    const homeFrame = homeSource.cloneNode(true);
    enhanceInteractions(homeFrame, 'home');
    const homeSections = [...homeFrame.querySelectorAll('[data-pencil-name="Top 10 Section"]')];
    expect(homeSections[0].querySelector('[data-pencil-name="Card Head"]')?.dataset.penLink).toBe('/service.html');
    expect(homeSections[1].querySelector('[data-pencil-name="Card Head"]')?.dataset.penLink).toBe('/virtual-card.html');
    expect(homeSections[0].querySelector('[data-pencil-name="Service Card 1"] [data-pencil-name="Chevron"]')?.closest('[role="link"]')?.dataset.penLink).toBe('/service.html');
    expect(homeSections[1].querySelector('[data-pencil-name="Service Card 1"] [data-pencil-name="Chevron"]')?.closest('[role="link"]')?.dataset.penLink).toBe('/virtual-card.html');
    vi.unstubAllGlobals();
  });

  it('keeps desktop and tablet details actions aligned with their home table', () => {
    const dom = new JSDOM(readFileSync('public/reference/pen-source.html', 'utf8'), { url: 'http://localhost/' });
    vi.stubGlobal('window', dom.window);
    vi.stubGlobal('document', dom.window.document);
    vi.stubGlobal('location', dom.window.location);

    for (const frameName of ['Главная Desktop 1440', 'Главная Tablet 1024']) {
      const source = [...dom.window.document.querySelectorAll('[data-pencil-name]')]
        .find((node) => node.getAttribute('data-pencil-name') === frameName);
      const frame = source.cloneNode(true);
      enhanceInteractions(frame, 'home');
      const sections = [...frame.querySelectorAll('[data-pencil-name="Top 10 Section"]')];
      const firstActions = sections[0].querySelectorAll('[data-pencil-name="Action"]');
      const secondActions = sections[1].querySelectorAll('[data-pencil-name="Action"]');
      expect([...firstActions].every((node) => node.dataset.penLink === '/service.html')).toBe(true);
      expect([...secondActions].every((node) => node.dataset.penLink === '/virtual-card.html')).toBe(true);
      const nestedDetails = sections[1].querySelector('[data-pencil-name="Button Details"]');
      if (nestedDetails) {
        expect(nestedDetails.getAttribute('role')).toBeNull();
        expect(nestedDetails.closest('[role="link"]')).toBe(secondActions[0]);
      }
    }
    vi.unstubAllGlobals();
  });

  it('opens the service promo code instead of falling through to a placeholder link', () => {
    const dom = new JSDOM(readFileSync('public/reference/pen-source.html', 'utf8'), { url: 'http://localhost/service.html' });
    const frame = [...dom.window.document.querySelectorAll('[data-pencil-name]')]
      .find((node) => node.getAttribute('data-pencil-name') === 'Карточка сервиса Mobile 375')
      .cloneNode(true);
    vi.stubGlobal('window', dom.window);
    vi.stubGlobal('document', dom.window.document);
    vi.stubGlobal('location', dom.window.location);

    enhanceInteractions(frame, 'service');
    frame.querySelector('[data-pencil-name="Promo Code Block (closed)"] [data-pencil-name="Button Get Code"]')
      ?.dispatchEvent(new dom.window.MouseEvent('click', { bubbles: true }));

    expect(frame.querySelector('[data-pencil-name="Promo Code Block (open)"]')?.hidden).toBe(false);
    expect(dom.window.location.hash).toBe('');
    vi.unstubAllGlobals();
  });

  it('marks the requested reports page active and gives every pager a reload destination', () => {
    const dom = new JSDOM(readFileSync('public/reference/pen-source.html', 'utf8'), { url: 'http://localhost/reports.html?page=2' });
    const frame = [...dom.window.document.querySelectorAll('[data-pencil-name]')]
      .find((node) => node.getAttribute('data-pencil-name') === 'Отчёты список Mobile 375')
      .cloneNode(true);
    vi.stubGlobal('window', dom.window);
    vi.stubGlobal('document', dom.window.document);
    vi.stubGlobal('location', dom.window.location);

    enhanceInteractions(frame, 'reports');
    const secondPage = frame.querySelector('[data-pencil-name="Page 2"]');
    const firstPage = frame.querySelector('[data-pencil-name="Page 1"]');
    const nextPage = frame.querySelector('[data-pencil-name="Page ›"]');

    expect(secondPage.getAttribute('aria-current')).toBe('page');
    expect(secondPage.style.backgroundColor).toBe('rgb(69, 168, 40)');
    expect(firstPage.getAttribute('aria-current')).toBeNull();
    expect(nextPage.dataset.penLink).toContain('page=3');
    vi.unstubAllGlobals();
  });

  it('marks the promo action as copied only after its copy icon is pressed', () => {
    const dom = new JSDOM(readFileSync('public/reference/pen-source.html', 'utf8'), { url: 'http://localhost/service.html' });
    const frame = [...dom.window.document.querySelectorAll('[data-pencil-name]')]
      .find((node) => node.getAttribute('data-pencil-name') === 'Карточка сервиса Mobile 375')
      .cloneNode(true);
    vi.stubGlobal('window', dom.window);
    vi.stubGlobal('document', dom.window.document);
    vi.stubGlobal('location', dom.window.location);

    enhanceInteractions(frame, 'service');
    const opened = frame.querySelector('[data-pencil-name="Promo Code Block (open)"]');
    const action = opened.querySelector('[data-pencil-name="Button Get Code"]');
    const copyIcon = opened.querySelector('[data-pencil-name="Copy Icon"]');

    expect(action.textContent).toContain('Промокод получен');
    copyIcon.dispatchEvent(new dom.window.MouseEvent('click', { bubbles: true }));

    expect(action.textContent).toContain('Скопировано');
    expect(action.style.backgroundColor).toBe('rgb(242, 249, 238)');
    expect(action.querySelector('[data-pencil-name="Label"]').style.color).toBe('rgb(47, 138, 22)');
    expect(action.querySelector('[data-pencil-name="Check Icon"] path').getAttribute('fill')).toBe('#2f8a16');
    vi.unstubAllGlobals();
  });

  it('includes the amount field in the Pen review form', () => {
    const dom = new JSDOM(readFileSync('public/reference/pen-source.html', 'utf8'), { url: 'http://localhost/service.html' });
    const frame = [...dom.window.document.querySelectorAll('[data-pencil-name]')]
      .find((node) => node.getAttribute('data-pencil-name') === 'Карточка сервиса Mobile 375')
      .cloneNode(true);
    vi.stubGlobal('window', dom.window);
    vi.stubGlobal('document', dom.window.document);
    vi.stubGlobal('location', dom.window.location);

    enhanceInteractions(frame, 'service');

    expect(frame.querySelector('input[name="amount"]')?.type).toBe('number');
    vi.unstubAllGlobals();
  });

  it('validates and accepts a complete Pen review form', () => {
    const dom = new JSDOM(readFileSync('public/reference/pen-source.html', 'utf8'), { url: 'http://localhost/service.html' });
    const frame = [...dom.window.document.querySelectorAll('[data-pencil-name]')]
      .find((node) => node.getAttribute('data-pencil-name') === 'Карточка сервиса Mobile 375')
      .cloneNode(true);
    vi.stubGlobal('window', dom.window);
    vi.stubGlobal('document', dom.window.document);
    vi.stubGlobal('location', dom.window.location);

    enhanceInteractions(frame, 'service');
    const submit = frame.querySelector('[data-pencil-name="Submit Button"]');
    submit?.dispatchEvent(new dom.window.MouseEvent('click', { bubbles: true }));
    expect(frame.querySelector('.pen-review-status')?.textContent).toContain('Заполните');
    frame.querySelector('input[name="name"]').value = 'Анна';
    frame.querySelector('input[name="email"]').value = 'anna@example.com';
    frame.querySelector('input[name="amount"]').value = '1000';
    frame.querySelector('textarea[name="message"]').value = 'Всё прошло хорошо.';
    submit?.dispatchEvent(new dom.window.MouseEvent('click', { bubbles: true }));
    expect(frame.querySelector('.pen-review-status')?.textContent).toContain('Спасибо');
    vi.unstubAllGlobals();
  });

  it('leaves no supplied desktop or mobile Pen action as a decorative layer', () => {
    const frames = [
      ['Главная Desktop 1440', 'home'], ['Главная Mobile 375', 'home'],
      ['Виртуальные карты Desktop 1440', 'cards'], ['Виртуальные карты Mobile 375', 'cards'],
      ['Карточка сервиса Desktop 1440', 'service'], ['Карточка сервиса Mobile 375', 'service'],
      ['Отчёт Desktop 1440', 'report'], ['Отчёт Mobile 375', 'report'],
      ['Отчеты список Desktop 1440', 'reports'], ['Отчёты список Mobile 375', 'reports'],
      ['Контакты Desktop 1440', 'contacts'], ['Контакты Mobile 375', 'contacts'],
      ['Реклама Desktop 1440', 'advertising'], ['Реклама Mobile 375', 'advertising']
    ];
    const actionable = /^(?:Button(?: |$)|Action$|Apply Button$|Close Button$|Filters Button$|Legend Button$|Link(?: |$)|Reviews Link$|Domain Link$|Place Link$|Chip Пометка PROMO$|Option Promo$|Tab \d{2}\.\d{2}\.\d{4}$|Page (?:Первая|Последняя|‹|1|2|3|›)$|Sort Select$|Reset Filters$|Load More Button$|Question Row$)/;
    const dom = new JSDOM(readFileSync('public/reference/pen-source.html', 'utf8'), { url: 'http://localhost/' });
    vi.stubGlobal('window', dom.window);
    vi.stubGlobal('document', dom.window.document);
    vi.stubGlobal('location', dom.window.location);

    frames.forEach(([name, page]) => {
      const source = [...dom.window.document.querySelectorAll('[data-pencil-name]')]
        .find((node) => node.getAttribute('data-pencil-name') === name);
      const frame = source.cloneNode(true);
      enhanceInteractions(frame, page);
      const unbound = [...frame.querySelectorAll('[data-pencil-name]')].filter((node) => (
        actionable.test(node.getAttribute('data-pencil-name') || '')
        && !node.closest('a,[role="button"],[role="link"],[role="tab"],[role="region"],input,textarea')
      ));
      expect(unbound, name).toHaveLength(0);
    });
    vi.unstubAllGlobals();
  });
});

import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { JSDOM } from 'jsdom';

const app = readFileSync('src/js/app.js', 'utf8');
const css = readFileSync('src/styles/main.css', 'utf8');
const ui = readFileSync('src/js/ui.js', 'utf8');
const catalog = readFileSync('src/js/catalog.js', 'utf8');

describe('rating catalog layout', () => {
  it('uses the full content width once the ad column is absent', () => {
    expect(app).toContain('class="container layout layout--catalog"');
    expect(css).toContain('.layout--catalog { display: block; }');
  });

  it('keeps the catalog filters in document flow instead of covering service rows while scrolling', () => {
    expect(css).toContain('.layout--catalog .filters { position: static; }');
  });

  it('restores the filter panel when the viewport grows beyond mobile', () => {
    expect(app).toContain("window.addEventListener('resize', syncFilterPanel)");
  });

  it('uses the Pen mobile service-card treatment rather than a cropped data table', () => {
    expect(css).toContain('.layout--catalog .catalog tbody tr');
    expect(css).toContain('.layout--catalog .catalog td:nth-child(6)');
    expect(css).toContain('content: \'комиссия\';');
    expect(css).not.toContain('content: \'отчёт\';');
    expect(css).toContain('.layout--catalog .catalog td[data-label]::before { content: none !important; display: none !important; }');
  });

  it('keeps the 375px virtual-card catalogue text gutters from the Pen frame', () => {
    expect(css).toContain('.pen-frame[data-pencil-name="Виртуальные карты Mobile 375"] [data-pencil-name="Page Header"]');
    expect(css).toContain('padding: 28px 16px 32px !important;');
    expect(css).toContain('[data-pencil-name="Rating Section"]');
    expect(css).toContain('padding: 24px 16px 48px !important;');
    expect(css).toContain('[data-pencil-name^="Service Card "]');
    expect(css).toContain('padding: 11px 16px !important;');
  });

  it('anchors the report legend on the right side of the desktop legend row', () => {
    expect(css).toContain('.catalog__legends { display: flex; align-items: center; justify-content: space-between; width: 100%; }');
    expect(css).not.toContain('.catalog__legends .legend--reports { padding-left: 20px; border-left: 1px solid var(--border); }');
  });

  it('groups the mobile rating intro into the single page-header frame from Pen', () => {
    expect(app).toContain('catalog-page-header');
    expect(app).toContain('catalog-page-metrics');
    expect(css).toContain('.catalog-page-header');
  });

  it('leaves 30px between the rating metrics and the filter block', () => {
    expect(css).toContain('.catalog-page-header--rating + .layout--catalog { padding-top: 30px; }');
  });

  it('centers the rating SEO copy block in the catalog column', () => {
    expect(css).toContain('.layout--catalog .catalog-seo .seo-copy { margin-inline: auto; }');
  });

  it('centers desktop rating FAQs without changing their accordion width', () => {
    expect(css).toContain('.layout--catalog .catalog-faq { display: flex; flex-direction: column; align-items: center; }');
    expect(css).not.toContain('.layout--catalog .catalog-faq .faq { width: 430px; max-width: 100%; }');
  });

  it('keeps the rating SEO white and gives the FAQ exactly 50px of gray space above it', () => {
    const dom = new JSDOM('<!doctype html><style></style><div id="app" data-page="rating"><div class="layout layout--catalog"><section class="catalog-seo"></section><section class="catalog-faq"></section></div></div>');
    dom.window.document.querySelector('style').textContent = css.replace(/^@import.*$/m, '');
    const layoutStyle = dom.window.getComputedStyle(dom.window.document.querySelector('.layout--catalog'));
    const faqStyle = dom.window.getComputedStyle(dom.window.document.querySelector('.catalog-faq'));

    expect(layoutStyle.paddingBottom).toBe('0px');
    expect(faqStyle.marginTop).toBe('0px');
    expect(faqStyle.paddingTop).toBe('50px');
    expect(faqStyle.backgroundColor).toBe('rgb(245, 245, 245)');
  });

  it('keeps 40px below the rating SEO copy before the FAQ section', () => {
    const dom = new JSDOM('<!doctype html><style></style><div class="seo-copy"></div>');
    dom.window.document.querySelector('style').textContent = css.replace(/^@import.*$/m, '');

    expect(dom.window.getComputedStyle(dom.window.document.querySelector('.seo-copy')).paddingBottom).toBe('40px');
  });

  it('includes the extended rating introduction copy', () => {
    expect(app).toContain('Фильтруйте по комиссии, рейтингу и статусу проверки, чтобы найти подходящий вариант.');
  });

  it('retains the Pen report label and visible service status chips in mobile cards', () => {
    expect(app).toContain('mobile-status-badges');
    expect(app).toContain('report-date');
    expect(css).toContain("content: 'Отчёт ';");
  });

  it('uses the Pen mobile card grid heights for each service state', () => {
    expect(css).toContain('grid-template-rows: 24px 36px 49px 24px 22.5px;');
  });

  it('keeps the O-Plati status and promo state shown by the fourth Pen card', () => {
    expect(catalog).toContain("tags: ['fee-10', 'fee-15', 'fresh', 'mystery', 'verified', 'promo']");
  });

  it('shows the name promo badge only for the first rating row', () => {
    expect(app).toContain("!cardsMode && item.rank === 1");
    expect(app).toContain('class="service-promo-badge"');
    expect(css).toContain('background: #5ecf36;');
    expect(css).toContain('color: #ffffff;');
  });

  it('aligns the mobile details arrow with the fee percent sign', () => {
    expect(css).toContain('.layout--catalog .catalog[data-type="rating"] td.row-action');
    expect(css).toContain('justify-content: flex-end;');
    expect(css).toContain('justify-self: stretch;');
    expect(css).toContain('text-align: right;');
  });

  it('leaves 40px around the desktop rating-place column', () => {
    expect(css).toContain('width: 80px;');
    expect(css).toContain('padding-left: 40px;');
  });

  it('shows the mobile filter count as a green circular badge', () => {
    expect(app).toContain('class="filter-open__label"');
    expect(app).toContain('data-active-count>0</span>');
    expect(app).toContain("textContent = Object.values(state.filters)");
    expect(css).toContain('background: #46a827;');
    expect(css).toContain('color: #ffffff;');
    expect(css).toContain('border-radius: 50%;');
  });

  it('aligns mobile report dots with the status SVG slots', () => {
    expect(css).toContain('flex: 0 0 22px;');
    expect(css).toContain('.catalog__legends .legend__dot--fresh::before');
    expect(css).toContain('.catalog__legends .legend--reports span { gap: 5px; }');
    expect(css).toContain('.catalog__legends .legend__dot--none');
  });

  it('keeps the mobile filter control flush with the legend and uses the Pen text color', () => {
    expect(css).toContain('.catalog:not(.catalog--filters-open) .filters');
    expect(css).toContain('.catalog__mobile-trigger { padding-bottom: 0; }');
    expect(css).toContain('.filter-open { color: #3a3a3a; }');
    expect(app).toContain('class="filter-open__icon"');
  });

  it('uses a shared mobile arrow slot and a 15px filter-to-legend gap', () => {
    expect(css).toContain('.catalog:not(.catalog--filters-open) .filters { padding-bottom: 15px; }');
    expect(css).toContain('.sort-select__chevron,');
    expect(css).toContain('flex: 0 0 16px;');
  });

  it('removes the initial-letter mark from rating-table service names', () => {
    expect(app).toContain('const serviceMarkMarkup = cardsMode');
    expect(app).toContain("<a href=\"${destination}\">${serviceMarkMarkup}<span>");
    expect(css).toContain('.catalog[data-type="rating"] td:nth-child(2) { padding-left: 0; }');
  });

  it('derives every mobile rating-card status from the supplied Pen states', () => {
    expect(app).toContain('const ratingMobileStates = {');
    expect(app).toContain("21: ['promo']");
    expect(app).toContain('mobile-status-badges--empty');
  });

  it('keeps mobile review counts clear of scores', () => {
    expect(css).toContain('padding-left: 29px;');
  });

  it('renders the mobile report as an explicit row with all three report states', () => {
    expect(app).toContain('report-dot report-dot--${reportState}');
    expect(app).toContain("reportState === 'none'");
    expect(app).toContain('Отчёта нет');
    expect(css).toContain('.report-dot--fresh { background-color: #45a828; }');
    expect(css).toContain('.report-dot--old { background-color: #f5c069; }');
    expect(css).toContain('border-width: 1px 0;');
    expect(css).toContain('margin: -0.5px 0;');
    expect(css).toContain('width: calc(100% + 2px) !important;');
  });

  it('keeps the desktop report treatment and status column icon-only', () => {
    expect(css).toContain('@media (min-width: 768px) {\n  .layout--catalog .catalog[data-type="rating"] td:nth-child(6)');
    expect(css).toContain('.desktop-status .check-icon');
    expect(css).toContain('font-size: 0;');
  });

  it('renders the Pen sparkles icon for every desktop New status', () => {
    expect(app).toContain('const ratingNewRanks = new Set([7, 8, 10, 20, 47]);');
    expect(app).toContain("ratingNewRanks.has(item.rank) ? '<i class=\"new-icon\" aria-label=\"Новый\"></i>'");
    expect(css).toContain('.new-icon::before');
    expect(css).toContain("stroke='%237A7A7A'");
  });

  it('uses the Pen info icon for the mobile legend disclosure', () => {
    expect(app).toContain('legend__trigger-icon');
    expect(app).toContain('<circle cx="8" cy="8" r="6.25"/>');
    expect(css).toContain('stroke: currentColor;');
  });

  it('keeps the no-report dash plain and the desktop action columns icon-only', () => {
    expect(css).toContain('.catalog__legend .legend__dot--none {');
    expect(css).toContain('background: transparent !important;');
    expect(app).toContain('Тайный<br>покупатель');
    expect(app).toContain('mystery-icon');
    expect(app).toContain('details-button__icon');
    expect(css).toContain('%23bfa3fa');
  });

  it('keeps the lower mobile rating sections as their own Pen background bands', () => {
    expect(app).toContain('catalog-discontinued');
    expect(css).toContain('.catalog-discontinued');
  });

  it('uses the requested neutral copy and stable accordion frame in rating lower sections', () => {
    expect(app).toContain('Эти сервисы больше не принимают платежи или перестали отвечать на обращения пользователей. Мы держим в реестре, чтоб вы могли<br>сверится перед оплатой.');
    expect(app).toContain('По этим сервисам поступали поступали жалобы на невыполненные платежи или подозрительное поведение поддержки. Будьте осторожны, если все же решите<br>ими воспользоваться');
    expect(css).toContain('.layout--catalog .catalog-discontinued .discontinued__title h2 { margin: 0; color: #131313; font-weight: 700; }');
    expect(css).toContain('.layout--catalog .catalog-discontinued .discontinued > p { margin: 0; color: #3a3a3a; font: 400 15px/24px Inter, system-ui, sans-serif; }');
    expect(css).toContain('.layout--catalog .catalog-discontinued .discontinued__item b { color: #3a3a3a; font-weight: 400; }');
    expect(css).toContain('.layout--catalog .catalog-discontinued .discontinued__grid { margin-top: 0; background: #f5f5f5; }');
    expect(css).toContain('.layout--catalog .catalog-discontinued .discontinued__column { background: #ffffff; }');
    expect(css).toContain('.layout--catalog .catalog-faq {\n    display: flex;\n    flex-direction: column;\n    align-items: center;\n    width: 100vw;');
    expect(css).toContain('.layout--catalog .catalog + .catalog-discontinued { margin-top: 0; }');
    expect(css).toContain('.layout--catalog .catalog-discontinued { width: 100vw; margin-left: calc(50% - 50vw); padding: 64px 24px; background: #f5f5f5; }');
    expect(css).toContain('.layout--catalog .catalog-discontinued .discontinued { display: flex; flex-direction: column; width:');
    expect(css).toContain('padding-top: 0; gap: 20px; background: #f5f5f5;');
    expect(css).toContain('.layout--catalog .catalog-discontinued .discontinued + .discontinued { padding-top: 48px; }');
    expect(css).toContain('.layout--catalog .catalog-discontinued .discontinued__title { border-top: 0; margin-top: 0; }');
    expect(css).toContain('.layout--catalog .catalog-faq .faq {\n    box-sizing: border-box;\n    width: 800px;');
    expect(css).toContain('background-color: #f5f5f5 !important;');
  });

  it('uses a fixed chevron so the catalog sort control rotates without shifting', () => {
    expect(css).toContain('.sort-select__chevron {\n  display: inline-flex;');
    expect(css).toContain('.sort-select__chevron::before {\n  width: 7px;');
  });

  it('includes the complete Pen explanation in the mobile rating SEO section', () => {
    expect(app).toContain('Виртуальные зарубежные карты');
    expect(app).toContain('Если у компании появляются массовые жалобы, мы понижаем её позицию');
  });

  it('uses the virtual-card FAQ copy for the rating answer and discontinued-services question', () => {
    expect(app).toContain('Позиции в таблице пересчитываются каждую неделю, а полная контрольная проверка каждого');
    expect(ui).not.toContain("root.querySelector('#rating-faq-0 > p')");
    expect(app).toContain('Почему сервис из «Прекратили работу» ещё принимает платежи?');
  });

  it('centers the requested virtual-card data columns without moving service or action', () => {
    expect(css).toContain('.catalog[data-type="cards"] th:nth-child(n + 3):nth-child(-n + 9),');
    expect(css).toContain('.catalog[data-type="cards"] td:nth-child(n + 3):nth-child(-n + 9)');
    expect(css).toContain('[data-pencil-name="Promo"]');
  });

  it('gives the virtual-card header the same fixed rating and action widths as its rows', () => {
    expect(css).toContain('[data-pencil-name="Col Оценка"] {\n    width: 85px !important;');
    expect(css).toContain('[data-pencil-name="Col Action"] {\n    width: 64px !important;');
  });
});

import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

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

  it('anchors the report legend on the right side of the desktop legend row', () => {
    expect(css).toContain('.catalog__legends { display: flex; align-items: center; justify-content: space-between; width: 100%; }');
    expect(css).not.toContain('.catalog__legends .legend--reports { padding-left: 20px; border-left: 1px solid var(--border); }');
  });

  it('groups the mobile rating intro into the single page-header frame from Pen', () => {
    expect(app).toContain('catalog-page-header');
    expect(app).toContain('catalog-page-metrics');
    expect(css).toContain('.catalog-page-header');
  });

  it('keeps the mobile rating introduction to the three-line Pen copy', () => {
    expect(app).toContain('Фильтруйте по комиссии, рейтингу и статусу проверки.');
    expect(app).not.toContain('проверки, чтобы найти подходящий вариант.');
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

  it('includes the complete Pen explanation in the mobile rating SEO section', () => {
    expect(app).toContain('Виртуальные зарубежные карты');
    expect(app).toContain('Если у компании появляются массовые жалобы, мы понижаем её позицию');
  });

  it('uses the Pen FAQ copy for the expanded mobile answer and discontinued-services question', () => {
    expect(ui).toContain('Позиции пересчитываются каждую неделю');
    expect(app).toContain('Почему сервис из «Прекратили работу» ещё принимает платежи?');
  });
});

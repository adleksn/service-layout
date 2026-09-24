import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { filterCatalog, parseFilterState, serializeFilterState, services as ratingServices, sortCatalog } from '../src/js/catalog.js';

const services = [
  { id: 'one', name: 'PayOne', domain: 'payone.ru', rating: 4.8, fee: 2.1, reviews: 14, reportDate: '2025-01-15', tags: ['card', 'sbp'] },
  { id: 'two', name: 'Cloud Pay', domain: 'cloudpay.io', rating: 4.3, fee: 1.5, reviews: 9, reportDate: '2024-11-12', tags: ['card'] }
];

describe('catalog filters', () => {
  it('combines search and group filters without changing source data', () => {
    const result = filterCatalog(services, { query: 'pay', filters: { features: ['sbp'], rating: ['any'] } });
    expect(result.map((item) => item.id)).toEqual(['one']);
    expect(services).toHaveLength(2);
  });

  it('round-trips shareable filter parameters without putting search into the URL', () => {
    const state = { features: ['card', 'sbp'], rating: ['4-plus'] };
    const query = serializeFilterState(state);
    expect(query).not.toContain('search');
    expect(parseFilterState(query)).toEqual(state);
  });

  it('ignores non-filter query parameters when loading a catalog URL', () => {
    expect(parseFilterState('?rating=4-plus&v=dae984e&utm_source=test')).toEqual({ rating: ['4-plus'] });
  });

  it('sorts visible data by a selected catalog rule', () => {
    expect(sortCatalog(services, 'fee').map((item) => item.id)).toEqual(['two', 'one']);
  });

  it('keeps all 51 positions from the rating table in their source order', () => {
    expect(ratingServices).toHaveLength(51);
    expect(sortCatalog(ratingServices, 'rating').map((item) => item.rank)).toEqual(Array.from({ length: 51 }, (_, index) => index + 1));
  });

  it('renders semantic table status values with SVG badges rather than text glyphs', () => {
    const css = readFileSync('src/styles/main.css', 'utf8');

    expect(css).toContain('.check-icon::before,\n.new-icon::before,\n.promo-icon::before,\n.stale-icon::before');
    expect(css).toContain('data:image/svg+xml');
  });

  it('uses the Pen-sized SVG icon boxes for catalog legends', () => {
    const css = readFileSync('src/styles/main.css', 'utf8');

    expect(css).toMatch(/\.catalog__legend \.legend__dot \{[\s\S]*?width: 22px;[\s\S]*?height: 22px;/);
    expect(css).toContain('.catalog__legend .legend__dot::before');
  });

  it('does not render report-age legend entries above the services-rating table', () => {
    const app = readFileSync('src/js/app.js', 'utf8');
    const ratingTable = app.match(/const table = `([\s\S]*?)`;\n {2}const stopped/);

    expect(ratingTable?.[1]).not.toContain('Отчёт актуален');
    expect(ratingTable?.[1]).not.toContain('Требует обновления');
  });
});

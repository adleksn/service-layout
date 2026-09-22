import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const app = readFileSync('src/js/app.js', 'utf8');
const css = readFileSync('src/styles/main.css', 'utf8');

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
});

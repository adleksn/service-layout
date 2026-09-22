import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const app = readFileSync('src/js/app.js', 'utf8');
const css = readFileSync('src/styles/main.css', 'utf8');

describe('rating catalog layout', () => {
  it('centres the Zen icon with its footer label', () => {
    expect(css).toContain('.footer__dzen { display: inline-flex; align-items: center; justify-content: center; gap: 8px; }');
  });

  it('allows mobile rating rows to shrink inside the page rail', () => {
    expect(css).toContain('.layout--catalog .catalog,\n  .layout--catalog .catalog table,\n  .layout--catalog .catalog tbody,\n  .layout--catalog .catalog tr,\n  .layout--catalog .catalog td {\n    min-width: 0;\n    max-width: 100%;\n  }');
  });

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
});

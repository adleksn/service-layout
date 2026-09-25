import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

describe('mobile FAQ layout', () => {
  it('keeps an expanded answer inside the card width at 375 px', () => {
    const css = readFileSync('src/styles/main.css', 'utf8');

    expect(css).toContain('@media (max-width: 767px) {\n  .faq { gap: 10px; }');
    expect(css).toContain('.faq > div > div { box-sizing: border-box; width: 100%; margin: 0; padding: 12px 14px; }');
    expect(css).not.toContain('.faq > div > div { box-sizing: content-box; width: 100%; margin: 0 -1px -1px; padding: 12px 14px; }');
  });

  it('keeps the opened rating FAQ answer white while its trigger stays gray', () => {
    const css = readFileSync('src/styles/main.css', 'utf8');

    expect(css).toContain('.layout--catalog .catalog-faq .faq > div.is-open {\n    gap: 0;\n    padding: 0;\n    background: #e4e4e4;');
    expect(css).toContain('.layout--catalog .catalog-faq .faq > div.is-open > div {\n    box-sizing: border-box;\n    width: 100%;\n    margin: 0;\n    padding: 12px 14px;\n    border: 0;\n    border-radius: 0 0 8px 8px;\n    background: #fff !important;');
  });
});

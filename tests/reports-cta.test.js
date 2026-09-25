import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

describe('reports mystery-shopper CTA', () => {
  it('uses the supplied copy, line break, and desktop CTA dimensions', () => {
    const app = readFileSync('src/js/app.js', 'utf8');
    const css = readFileSync('src/styles/main.css', 'utf8');

    expect(app).toContain("const applyReportsCtaLayout = () => {\n  if (window.innerWidth < 768) return;");
    expect(app).toContain('покупку, мы<br> публикуем отчёт совместно с вами. Условия обсуждаем в телеграме.');
    expect(app).toContain('[data-pencil-name="CTA Block"]');
    expect(css).toContain('.report-list--source .become-shopper { box-sizing: content-box; width: 778.5px; height: 143px; margin: 0 0 0 -1.5px; padding: 24px; gap: 12px; }');
    expect(css).toContain('.pen-frame[data-pencil-name="Отчёты список Mobile 375"] [data-pencil-name="CTA Block"]');
    expect(css).toContain('box-sizing: content-box !important;');
    expect(css).toContain(`.pen-frame[data-pencil-name="Отчёты список Mobile 375"] [data-pencil-name="CTA Block"] {
    box-sizing: content-box !important;
    width: calc(100% - 43px) !important;
    max-width: calc(100% - 43px) !important;
    height: auto !important;`);
    expect(css).toContain(`.pen-frame[data-pencil-name="Отчёты список Mobile 375"] [data-pencil-name="CTA Block"] [data-pencil-name="Paragraph"] {
    font-size: 13px !important;
  }`);
  });
});

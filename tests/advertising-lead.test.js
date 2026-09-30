import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

describe('advertising lead', () => {
  it('keeps the supplied desktop height, padding, and three-line copy', () => {
    const app = readFileSync('src/js/app.js', 'utf8');
    const css = readFileSync('src/styles/main.css', 'utf8');

    expect(app).toContain('const applyAdvertisingLeadLayout');
    expect(app).toContain('Обращения от<br>владельцев сервисов');
    expect(app).toContain('как<br>попытку ввести клиентов');
    expect(app).toContain("block.style.height = '90px';");
    expect(app).toContain("block.style.padding = '24px';");
    expect(app).toContain('Пометка также включает в себя опцию «Рекламный баннер»');
    expect(app).toContain('const bannerCopy');
    expect(app).toContain('const finalCtaCopy');
    expect(app).toContain('ответим и посчитаем под ваши задачи.');
    expect(app).toContain("warning.style.height = '25px';");
    expect(app).toContain("cta.style.height = '170px';");
    expect(app).toContain("cta.style.width = '778.5px';");
    expect(css).toContain('.ad-banner-warning {');
    expect(css).toContain('.ad-order {\n  box-sizing: content-box;');
    expect(css).toContain('  gap: 14px;\n  width: 778.5px;\n  height: 170px;');
    expect(css).toContain('  border: solid #45a828;');
    expect(css).toContain('font: 700 24px/31px Inter, system-ui, sans-serif;');
    expect(css).toContain('  height: 52px;');
    expect(css).toContain('  padding: 0 26px;');
    expect(css).toContain('.ad-banner-warning,\n  .ad-order,\n  .pen-frame [data-pencil-name="Option Banner"] [data-pencil-name="Warning"]');
    expect(css).toContain('width: 100% !important;');
    expect(css).toContain('height: auto !important;');
    expect(css).toContain('margin: 0 !important;');
    expect(css).toContain('.pen-frame[data-pencil-name="Реклама Desktop 1440"] [data-pencil-name="Accent Block"] [data-pencil-name="Text"],');
    expect(css).toContain('font-weight: 600 !important;');
  });

  it('leaves the 375px Pen typography and spacing untouched by desktop adjustments', () => {
    const app = readFileSync('src/js/app.js', 'utf8');

    expect(app).toContain('if (window.innerWidth < 768) return;');
    expect(app).toContain("text.innerHTML = finalCtaCopy;");
  });

  it('fits the desktop advertising accent block to the 780px content column with rounded corners', () => {
    const css = readFileSync('src/styles/main.css', 'utf8');

    expect(css).toContain('.pen-frame[data-pencil-name="Реклама Desktop 1440"] [data-pencil-name="Accent Block"] {');
    expect(css).toContain('box-sizing: border-box !important;');
    expect(css).toContain('width: 780px !important;');
    expect(css).toContain('max-width: 100% !important;');
    expect(css).toContain('margin-left: 0 !important;');
    expect(css).toContain('border-radius: 12px !important;');
    expect(css).toContain('overflow: hidden !important;');
  });

  it('keeps the desktop banner warning and booking CTA on that same content rail', () => {
    const css = readFileSync('src/styles/main.css', 'utf8');

    expect(css).toContain('.pen-frame[data-pencil-name="Реклама Desktop 1440"] [data-pencil-name="Option Banner"] [data-pencil-name="Warning"],');
    expect(css).toContain('.pen-frame[data-pencil-name="Реклама Desktop 1440"] [data-pencil-name="Final CTA"] {');
    expect(css).toContain('width: 780px !important;');
    expect(css).toContain('height: 57px !important;');
    expect(css).toContain('height: 234px !important;');
  });

  it('does not append the semantic banner notice to the authored Pen option', () => {
    const app = readFileSync('src/js/app.js', 'utf8');

    expect(app).toContain("const fallbackBanner = app.querySelector('#banner:not([data-pencil-name])');");
  });
});

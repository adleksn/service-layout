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
  });
});

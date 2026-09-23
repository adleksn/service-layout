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
    expect(app).toContain("warning.style.height = '25px';");
    expect(css).toContain('.ad-banner-warning {');
  });
});

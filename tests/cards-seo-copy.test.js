import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

describe('virtual-card SEO copy', () => {
  it('uses the supplied line breaks and FAQ answer', () => {
    const app = readFileSync('src/js/app.js', 'utf8');
    const css = readFileSync('src/styles/main.css', 'utf8');

    expect(app).toContain('сервисов <br>с 2022 года.');
    expect(app).toContain('выпускаем<br> карту и проверяем');
    expect(app).toContain('Позиции в таблице пересчитываются каждую неделю');
    expect(app).not.toContain('Позиции в тааблице пересчитываются каждую неделю');
    expect(app).toContain("[data-pencil-name=\"SEO Section\"]");
    expect(app).toContain("[data-pencil-name=\"Answer\"]");
    expect(css).toContain('#app[data-page="cards"] .seo-copy p { font-size: 16px; line-height: 26px; }');
  });
});

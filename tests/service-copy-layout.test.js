import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

describe('service page supplied copy layout', () => {
  it('uses the supplied line breaks in shopper reports and service description', () => {
    const app = readFileSync('src/js/app.js', 'utf8');
    const css = readFileSync('src/styles/main.css', 'utf8');

    expect(app).toContain('первого <br> раза картой другого банка');
    expect(app).toContain('могли измениться,<br> поэтому данные требуют повторной проверки.');
    expect(app).toContain('зарубежных<br> подписок и сервисов для клиентов из России');
    expect(app).toContain('Судя по количеству отзывов и стабильно высокой оценке');
    expect(app).toContain('[data-pencil-name="Mystery Shopper Report (fresh)"]');
    expect(app).toContain('[data-pencil-name="Mystery Shopper Report (stale)"]');
    expect(app).toContain('[data-pencil-name="About Card"]');
    expect(css).toContain('.shopper__text { margin: 0; font-size: 15px; line-height: 24px; }');
    expect(css).toContain('.about-service p { width: 700px; max-width: 100%; font-size: 16px; line-height: 26px; }');
  });
});

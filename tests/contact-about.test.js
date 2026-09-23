import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

describe('contact page about copy', () => {
  it('uses the supplied content width, spacing, and line breaks', () => {
    const app = readFileSync('src/js/app.js', 'utf8');
    const css = readFileSync('src/styles/main.css', 'utf8');

    expect(app).toContain('const applyContactAboutCopy');
        expect(app).toContain('платёжным сервисом, не принимаем<br>платежи');
        expect(app).toContain('Проект существует с 2022 года. Регион работы —<br>Российская Федерация.');
    expect(css).toContain('.contact-page .article { max-width: none; }');
    expect(css).toContain('.contact-page .article h2 { margin: 0 0 16px; }');
    expect(css).toContain('.contact-page .article p { margin: 0; max-width: 1200px; font-size: 16px; line-height: 26px; }');
  });
});

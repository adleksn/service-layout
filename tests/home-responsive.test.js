import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

describe('home transitional responsiveness', () => {
  it('keeps the requested desktop line breaks in the home-page explanatory copy', () => {
    const app = readFileSync('src/js/app.js', 'utf8');

    expect(app).toContain('Мы не верим сервисам на слово. Наш тайный покупатель<br>регистрируется в сервисе как обычный клиент, оплачивает реальную<br>подписку настоящими деньгами и фиксирует всё: сроки, итоговую<br>комиссию, наличие чека, поведение поддержки, что происходит при<br>проблеме с платежом.');
    expect(app).toContain('С 2022 года оплата зарубежных подписок, хостингов и рекламных кабинетов<br>из России перестала работать напрямую. На этом месте выросли десятки<br>посредников: одни берут фиксированную комиссию и выдают чеки, другие<br>исчезают вместе с деньгами клиентов.');
    expect(app).toContain('Мы ведём открытый реестр таких сервисов: проверяем юридические<br>данные, тестируем платежи собственными деньгами и собираем отзывы<br>пользователей. Рейтинг показывает, кому можно доверить платёж сегодня, а<br>не год назад.');
  });

  it('interpolates the tablet Pen hero without reverting to the compressed legacy type scale', () => {
    const css = readFileSync('src/styles/main.css', 'utf8');

    expect(css).toContain('@media (min-width: 768px) and (max-width: 959px)');
    expect(css).toContain('.hero h1 { font: 700 clamp(32px, 3.5vw, 36px) / 1.22 Inter, system-ui, sans-serif; }');
    expect(css).toContain('.hero p:not(.eyebrow) { max-width: none; font-size: 16px; line-height: 26px; }');
    expect(css).toContain('.hero__metrics { margin-top: 0; gap: 12px; font-size: 14px; }');
  });
});

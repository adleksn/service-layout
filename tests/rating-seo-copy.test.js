import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

describe('rating SEO copy', () => {
  it('uses the supplied desktop line breaks and complete text', () => {
    const app = readFileSync('src/js/app.js', 'utf8');

    expect(app).toContain("const preserveRatingMobileTextWrapping = () => {\n  if (page !== 'rating' || window.innerWidth >= 768) return;");
    expect(app).toContain("app.querySelectorAll('.catalog-discontinued br, .catalog-seo br, .catalog-faq br').forEach((lineBreak) => lineBreak.replaceWith(' '));");
    expect(app).toContain('preserveRatingMobileTextWrapping();');
    expect(app).toContain('Фильтруйте по комиссии, рейтингу и статусу проверки, чтобы найти подходящий вариант.');
    expect(app).toContain('Как устроен рейтинг сервисов альтернативной <br>оплаты<br>');
    expect(app).toContain('на рынке <br>появилось множество посредников');
    expect(app).toContain('после первых же переводов.');
    expect(app).toContain('на предмет накруток. <br>Каждая карточка сервиса содержит дату последней проверки чтобы вы понимали на сколько <br> акктуальна оценка.');
    expect(app).toContain('даже если формально сайт <br> ещё принимает заявки.');
  });
});

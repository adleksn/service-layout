import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

describe('service page supplied copy layout', () => {
  it('uses the supplied line breaks in shopper reports and service description', () => {
    const app = readFileSync('src/js/app.js', 'utf8');
    const css = readFileSync('src/styles/main.css', 'utf8');
    const penSource = readFileSync('public/reference/pen-source.html', 'utf8');

    expect(app).toContain('первого <br> раза картой другого банка');
    expect(app).toContain('могли измениться,<br> поэтому данные требуют повторной проверки.');
    expect(app).toContain('зарубежных<br> подписок и сервисов для клиентов из России');
    expect(app).toContain('Судя по количеству отзывов и стабильно высокой оценке');
    expect(app).toContain('[data-pencil-name="Mystery Shopper Report (fresh)"]');
    expect(app).toContain('[data-pencil-name="Mystery Shopper Report (stale)"]');
    expect(app).toContain("freshReport.style.height = '309px'");
    expect(app).toContain("staleReport.style.height = '295px'");
    expect(app).toContain('[data-pencil-name="About Card"]');
    expect(app).toContain('По нашим наблюдениям, сервис оперативно реагирует на <br> спорные ситуации и готов возвращать деньги при сбоях платежа.');
    expect(app).toContain("paramRows.forEach((row, index) => { row.style.height = index === 0 ? '35.5px' : '30.5px'; });");
    expect(app).toContain("['Олеся', 'Отличный сервис, пользуюсь регулярно. Курс всегда честный, никаких скрытых комиссий не обнаружила. Рекомендую всем, кто ищет надёжный способ оплаты зарубежных подписок.']");
    expect(app).toContain("['Андрей', 'Платил за хостинг на полгода вперёд. Всё прошло гладко, но сумма оказалась чуть больше, чем я ожидал из-за курса — уточняйте актуальный курс перед оплатой.']");
    expect(app).toContain('Пользуюсь для оплаты корпоративных подписок компании. Отдельное спасибо за возможность<br> получить закрывающие документы для бухгалтерии — не все подобные сервисы это предлагают.');
    expect(app).toContain("['Сергей', 'Пользуюсь для оплаты корпоративных подписок");
    expect(app).toContain('Сначала сомневалась, но решила попробывать после хороших отзывов. Платеж прошел за пять минут,<br>никаких сюрпризов с комиссией не было. Буду пользоваться дальше.');
    expect(app).toContain("['Екатерина', 'Сначала сомневалась");
    expect(app).toContain('Плачу за подписку Canva через этот сервис уже три месяца подряд. Всё стабильно, интерфейс простой<br> и понятный, деньги приходят получателю быстро.');
    expect(app).toContain("['Татьяна', 'Плачу за подписку Canva");
    expect(penSource).toContain('Плачу за подписку Canva через этот сервис уже три месяца подряд. Всё стабильно, интерфейс простой<br> и понятный, деньги приходят получателю быстро.');
    expect(css).toContain('.shopper__text { margin: 0; font-size: 15px; line-height: 24px; }');
    expect(css).toContain('.about-service p { width: 700px; max-width: 100%; font-size: 16px; line-height: 26px; }');
    expect(css).toContain('.service-layout .shopper { box-sizing: content-box; width: 778.5px; margin: 0 0 0 -1.5px; padding: 28px; gap: 16px; }');
    expect(css).toContain('.service-layout .shopper--old { height: 295px; border-color: #f5c069; }');
    expect(css).toContain('.service-layout .shopper:not(.shopper--old):not(.shopper--none) { height: 309px; border-color: #45a828; }');
    expect(css).toContain('[data-pencil-name="Field Введите сумму 6 + 4"] .pen-review-control { align-self: center; height: 20px; margin: 0; padding: 0; }');
    expect(css).toContain('[data-pencil-name="Textarea"] .pen-review-control { align-self: flex-start; margin: 0; padding: 0; }');
    expect(css).toContain('.pen-frame[data-pencil-name^="Виртуальные карты — Карточка сервиса"] [data-pencil-name="Field Ваш e-mail"] .pen-review-control:focus { outline: 0; }');
  });

  it('keeps the supplied 375px virtual-card spacing and text measure', () => {
    const app = readFileSync('src/js/app.js', 'utf8');
    const css = readFileSync('src/styles/main.css', 'utf8');
    const penSource = readFileSync('public/reference/pen-source.html', 'utf8');

    expect(app).toContain("const applyServiceCopyLayout = () => {\n  if (window.innerWidth < 768) return;");
    expect(penSource).toContain('data-pencil-name="Params Card Mobile TEST"');
    expect(penSource).toContain('data-pencil-name="Mystery Shopper Report (fresh)"');
    expect(penSource).toContain('height: 440px');
    expect(penSource).toContain('padding: 20px 16px 48px 16px');
    expect(css).toContain('.pen-frame[data-pencil-name="Виртуальные карты — Карточка сервиса Mobile 375"] [data-pencil-name="Mystery Shopper Report (fresh)"]');
    expect(css).toContain('height: 483px !important;');
    expect(css).toContain('height: 461px !important;');
    expect(css).toContain('[data-pencil-name="Metrics Row"] > [data-pencil-name="Metric Row"]');
  });
});

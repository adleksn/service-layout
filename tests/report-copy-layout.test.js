import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

describe('RUPay mystery shopper report copy layout', () => {
  it('applies every supplied desktop line break after the Pen frame mounts', () => {
    const app = readFileSync('src/js/app.js', 'utf8');
    const css = readFileSync('src/styles/main.css', 'utf8');

    expect(app).toContain('const applyReportCopyLayout = () =>');
    expect(app).toContain('сервис не выдал чек об оплате, и это стоит учитывать при выборе.');
    expect(app).toContain('бронирования отелей за рубежом. Сервис предлагает «выгодную и удобную<br>оплату»');
    expect(app).toContain('виртуалку) можно хотя бы написать жалобу в ЦБ и Роспотребнадзор для решения<br>проблемы.');
    expect(app).toContain('Плюс RUPay.money — выгодный обменный курс: сервис<br>конвертирует валюты');
    expect(app).toContain("setWidth('Я долго выбирал', '701px');");
    expect(app).toContain("setWidth('Я сразу обратил внимание', '700px');");
    expect(app).toContain("if (page === 'report') applyReportCopyLayout();");
    const penFrame = readFileSync('src/js/pen-frame.js', 'utf8');
    expect(penFrame).toContain("if (page === 'report' && width >= 1200) return variants.desktop;");
    expect(css).toContain('.pen-frame[data-pencil-name="Отчёт Mobile 375"] [data-pencil-name="Summary Block"]');
    expect(css).toContain('width: calc(100% - 43px) !important;');
  });
});

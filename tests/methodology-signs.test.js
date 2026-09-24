import { readFileSync } from 'node:fs';
import { JSDOM } from 'jsdom';
import { describe, expect, it } from 'vitest';
import { mountMethodologySignSvgs } from '../src/js/pen-frame.js';

describe('methodology sign fidelity', () => {
  it('uses plain text criteria, a returned advert rail, and the supplied methodology copy', () => {
    const app = readFileSync('src/js/app.js', 'utf8');
    const css = readFileSync('src/styles/main.css', 'utf8');

    expect(app).toContain('methodology-layout');
    expect(app).toContain('class="method-criteria"');
    expect(app).toContain('Для достоверной проверки условий работы сервиса мы используем понятную');
    expect(app).toContain('каждый из сервисов для<br> того, чтобы провести оплату');
    expect(app).toContain('ответы на дополнительные <br>вопросы по работе сервиса.');
    expect(app).toContain('часть из которой попадает вам<br> в обзор сервиса');
    expect(app).toContain('Все результаты попадают в карточку сервиса и в отчёт тайного покупателя');
    expect(app).toContain('технология проверки позволяет минимизировать риски');
    expect(app).toContain('const alignMethodologyLayout');
    expect(app).toContain("classList.add('methodology-breadcrumbs')");
    expect(css).toContain('.methodology {\n  padding-bottom: 0px;');
    expect(css).toContain('.methodology-breadcrumbs { padding-bottom: 0; }');
    expect(css).toContain('.methodology .tabs button[aria-selected="true"] { color: #131313; }');
    expect(css).toContain('.methodology-layout .methodology .lead { display: grid; gap: 32px; padding: 20px 0 32px; max-width: none; }');
    expect(css).toContain('.methodology-layout .methodology .lead .eyebrow:empty { display: none; }');
    expect(css).toContain('.methodology-layout .methodology .lead p { font-size: 16px; line-height: 26px; }');
    expect(css).toContain('.methodology-layout .methodology > p { color: #9b9b9b; }');
    expect(css).toContain('.methodology-layout > .ad { position: static; top: auto; background: transparent; text-align: right; }');
    expect(css).toContain('.method-warning { background: #f5f5f5; border-left-color: #46a827;');
    expect(css).toContain('.method-warning p { font-style: italic; }');
    expect(app).toContain('<article><i aria-hidden="true"></i><div><h3>${name}</h3><p>${text}</p></div></article>');
    expect(css).toContain('.method-cta { border-left: 3px solid #46a827; }');
  });

  it('keeps the exact Pen sign-list rhythm and source colour tokens', () => {
    const css = readFileSync('src/styles/main.css', 'utf8');

    expect(css).toContain('.method-signs { display: grid; gap: 20px;');
    expect(css).toContain('.method-signs i {\n  display: grid;\n  width: 24px;\n  height: 24px;\n  place-items: center;\n  border-radius: 6px;\n  background: #edf7e9;');
    expect(css).toContain('.method-signs article:nth-child(2) i {\n  background: #ededed;\n  color: #131313;');
    expect(css).toContain('.method-signs article:nth-child(3) i {\n  background: #f0f0f0;\n  color: #7a7a7a;');
  });

  it('mounts the source Pen vectors for each methodology sign', () => {
    const dom = new JSDOM(`
      <div id="page"><div class="method-signs"><i></i><i></i></div></div>
      <div id="pen"><div data-pencil-name="Sign Подтверждён"><div data-pencil-name="Icon Box"><svg data-source-icon="confirmed"><path d="source-confirmed" /></svg></div></div><div data-pencil-name="Sign Был тайный покупатель"><div data-pencil-name="Icon Box"><svg data-source-icon="shopper"><path d="source-shopper" /></svg></div></div></div>`);

    mountMethodologySignSvgs(dom.window.document.querySelector('#page'), dom.window.document.querySelector('#pen'));

    expect([...dom.window.document.querySelectorAll('.method-signs svg')].map((svg) => svg.dataset.sourceIcon)).toEqual(['confirmed', 'shopper']);
    expect([...dom.window.document.querySelectorAll('.method-signs svg')].every((svg) => svg.classList.contains('method-sign__source-icon'))).toBe(true);
    expect(dom.window.document.querySelector('.method-signs i').textContent).toBe('');
  });
});

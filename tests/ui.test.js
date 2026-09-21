import { JSDOM } from 'jsdom';
import { readFileSync } from 'node:fs';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { setupDisclosures, setupMobileMenu, setupReviewForm, setupServiceStatusBadges, setupTabs } from '../src/js/ui.js';

const restoreDom = () => {
  vi.unstubAllGlobals();
};

afterEach(restoreDom);

describe('semantic page interactions', () => {
  it('gives every FAQ question row the documented hover feedback', () => {
    const css = readFileSync('src/styles/main.css', 'utf8');

    expect(css).toContain('.faq > div:hover > button { background-color: #dedede; }');
    expect(css).toContain('.pen-frame .pen-faq-item [data-pencil-name="Question Row"]:hover { background-color: #dedede; }');
  });

  it('keeps shared Pen component hover states aligned with the reference palette', () => {
    const css = readFileSync('src/styles/main.css', 'utf8');

    expect(css).toContain('.report-list > a:hover { background-color: #f9fbf8; border-color: #cfe6c8; }');
    expect(css).toContain('[data-pencil-name="Table"] [data-pencil-name^="Row "]:hover { background-color: #f9fbf8 !important; }');
    expect(css).toContain('.pen-frame [data-pencil-name="Button Dzen"]:hover { background-color: #3a3a3a !important; }');
  });

  it('opens and closes the semantic mobile menu with the same button', () => {
    const dom = new JSDOM(`
      <header class="header"><button data-mobile-menu aria-expanded="false" aria-controls="mobile-nav">☰</button></header>
      <nav id="mobile-nav" hidden><a href="/contacts.html">Контакты</a></nav>`);
    vi.stubGlobal('document', dom.window.document);

    setupMobileMenu(dom.window.document);
    const button = dom.window.document.querySelector('[data-mobile-menu]');
    const panel = dom.window.document.querySelector('#mobile-nav');
    button.dispatchEvent(new dom.window.MouseEvent('click', { bubbles: true }));
    expect(button.getAttribute('aria-expanded')).toBe('true');
    expect(panel.hidden).toBe(false);

    button.dispatchEvent(new dom.window.MouseEvent('click', { bubbles: true }));
    expect(button.getAttribute('aria-expanded')).toBe('false');
    expect(panel.hidden).toBe(true);
  });

  it('switches tabs, updates panels and keeps a shareable hash', () => {
    const dom = new JSDOM(`
      <div id="root">
        <div role="tablist"><button id="first" role="tab" aria-selected="true" aria-controls="one">Первый</button><button id="second" role="tab" aria-selected="false" aria-controls="two">Второй</button></div>
        <section id="one"></section><section id="two" hidden></section>
      </div>`, { url: 'https://example.test/methodology.html' });
    vi.stubGlobal('window', dom.window);
    vi.stubGlobal('document', dom.window.document);
    vi.stubGlobal('history', dom.window.history);
    vi.stubGlobal('location', dom.window.location);

    setupTabs(dom.window.document.querySelector('#root'));
    dom.window.document.querySelector('#second').dispatchEvent(new dom.window.MouseEvent('click', { bubbles: true }));

    expect(dom.window.document.querySelector('#second').getAttribute('aria-selected')).toBe('true');
    expect(dom.window.document.querySelector('#one').hidden).toBe(true);
    expect(dom.window.document.querySelector('#two').hidden).toBe(false);
    expect(dom.window.location.hash).toBe('#two');
  });

  it('opens the first FAQ item, then closes it when another item is opened', () => {
    const dom = new JSDOM(`
      <section class="faq">
        <div><button data-disclosure aria-controls="answer-one">Первый</button><div id="answer-one" hidden>Ответ 1</div></div>
        <div><button data-disclosure aria-controls="answer-two">Второй</button><div id="answer-two" hidden>Ответ 2</div></div>
      </section>`);
    vi.stubGlobal('document', dom.window.document);

    setupDisclosures(dom.window.document);
    const [first, second] = dom.window.document.querySelectorAll('[data-disclosure]');
    expect(first.getAttribute('aria-expanded')).toBe('true');
    expect(dom.window.document.querySelector('#answer-one').hidden).toBe(false);

    second.dispatchEvent(new dom.window.MouseEvent('click', { bubbles: true }));
    expect(first.getAttribute('aria-expanded')).toBe('false');
    expect(dom.window.document.querySelector('#answer-one').hidden).toBe(true);
    expect(second.getAttribute('aria-expanded')).toBe('true');
    expect(dom.window.document.querySelector('#answer-two').hidden).toBe(false);
  });

  it('validates the review amount and accepts a complete local review', () => {
    const dom = new JSDOM(`
      <form data-review-form><input name="name" required><input name="email" type="email" required><input name="amount" type="number" min="1" required><textarea name="text" required></textarea><button>Отправить</button><p data-form-status></p></form>`);
    vi.stubGlobal('document', dom.window.document);

    setupReviewForm(dom.window.document);
    const form = dom.window.document.querySelector('form');
    form.dispatchEvent(new dom.window.Event('submit', { bubbles: true, cancelable: true }));
    expect(form.querySelector('[data-form-status]').textContent).toBe('Заполните обязательные поля.');

    form.elements.name.value = 'Марина';
    form.elements.email.value = 'marina@example.test';
    form.elements.amount.value = '1500';
    form.elements.text.value = 'Оплата прошла быстро.';
    form.dispatchEvent(new dom.window.Event('submit', { bubbles: true, cancelable: true }));
    expect(form.querySelector('[data-form-status]').textContent).toBe('Спасибо! Отзыв принят на проверку.');
  });

  it('replaces textual service symbols with the four visual source badges', () => {
    const dom = new JSDOM(`
      <div class="service-status">
        <span>✓ Подтверждён</span><span>◉ Был тайный покупатель</span><span>✦ Есть промокод</span><span>Новый</span>
      </div>`);

    setupServiceStatusBadges(dom.window.document);
    const badges = [...dom.window.document.querySelectorAll('.service-status span')];

    expect(badges.map((badge) => badge.className)).toEqual([
      'status-badge status-badge--verified',
      'status-badge status-badge--shopper',
      'status-badge status-badge--promo',
      'status-badge status-badge--new'
    ]);
    expect(badges.map((badge) => badge.textContent)).toEqual(['Подтверждён', 'Был тайный покупатель', 'Есть промокод', 'Новый']);
  });
});

import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

describe('header CTA fidelity', () => {
  it('uses the filled green Pen button treatment instead of an outline', () => {
    const css = readFileSync('src/styles/main.css', 'utf8');

    expect(css).toMatch(/\.header__cta \{[\s\S]*?background: var\(--green\);[\s\S]*?border: 0;[\s\S]*?color: #fff;/);
    expect(css).toContain('.header__cta:hover {\n  background: var(--green-dark);');
  });

  it('keeps the desktop Pen button label at 14px semibold', () => {
    const css = readFileSync('src/styles/main.css', 'utf8');

    expect(css).toContain('.header__cta {\n    width: 157px;\n    min-height: 42px;\n    margin-left: 14px;\n    padding: 11px 18px;\n    border-radius: 8px;\n    font-size: 14px;\n    font-weight: 600;\n    line-height: 20px;');
  });

  it('uses the source Pen Dzen SVG in the shared header instead of a text glyph', () => {
    const app = readFileSync('src/js/app.js', 'utf8');

    expect(app).toContain('viewBox="0 0 168 168.01"');
    expect(app).toContain('d="M83.665 168.00999');
    expect(app).toContain('transform="translate(20 20)"');
    expect(app).not.toContain('aria-label="Мы в Дзене">✦');
  });

  it('does not draw an additional circular background behind the source Dzen SVG', () => {
    const css = readFileSync('src/styles/main.css', 'utf8');

    expect(css).toMatch(/\.dzen \{[^}]*background: transparent;[^}]*border-radius: 0;/);
    expect(css).toMatch(/\.dzen \{[^}]*overflow: hidden;[^}]*position: relative;/);
    expect(css).toContain('.dzen svg,\n.footer__dzen svg { display: block; width: 100%; height: 100%; }');
  });

  it('keeps the bordered shared header at the 74px Pen outer height', () => {
    const css = readFileSync('src/styles/main.css', 'utf8');

    expect(css).toContain('.header__row { min-height: 73px; }');
  });

  it('styles semantic service badges with SVG pseudo-elements', () => {
    const css = readFileSync('src/styles/main.css', 'utf8');

    expect(css).toContain('.service-status {\n  grid-column: 1/-1;\n  display: flex;\n  gap: 10px;');
    expect(css).toContain('.status-badge::before');
    expect(css).toContain('width: 15px;\n  height: 15px;');
    expect(css).toContain('.status-badge--verified::before');
    expect(css).toContain('.status-badge--shopper::before');
    expect(css).toContain('.status-badge--promo::before');
    expect(css).toContain('.status-badge--verified,\n.status-badge--shopper {\n  background: #edf7e9;\n  color: #2f8a16;');
  });
});

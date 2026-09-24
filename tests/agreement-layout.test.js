import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

describe('agreement layout', () => {
  it('uses the supplied 780px legal-text column and vertical rhythm', () => {
    const app = readFileSync('src/js/app.js', 'utf8');
    const css = readFileSync('src/styles/main.css', 'utf8');

    expect(app).toContain('const alignAgreementLayout');
    expect(app).toContain('const applyAgreementCopyLayout = () =>');
    expect(app).toContain('подтверждает, что ознакомился<br>с условиями Соглашения');
    expect(app).toContain('Администрация вправе удалять материалы, нарушающие условия Соглашения, без<br>объяснения причин.');
    expect(app).toContain("if (page === 'agreement') applyAgreementCopyLayout();");
    expect(css).toContain('.agreement {\n  width: min(780px, calc(100% - 48px));');
    expect(css).toContain('margin: 40px 0 16px; color: #131313; font: 700 32px/40px');
    expect(css).toContain('margin: 28px 0 12px; color: #131313; font: 700 20px/28px');
    expect(css).toContain('margin: 0 0 16px; color: #3a3a3a; font: 400 16px/26px');
    expect(css).toContain('gap: 8px; width: 100%; margin: 0 0 16px; padding: 0 0 0 24px;');
  });
});

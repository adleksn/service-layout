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
});

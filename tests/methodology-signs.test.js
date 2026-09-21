import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

describe('methodology sign fidelity', () => {
  it('keeps the exact Pen sign-list rhythm and source colour tokens', () => {
    const css = readFileSync('src/styles/main.css', 'utf8');

    expect(css).toContain('.method-signs { display: grid; gap: 20px;');
    expect(css).toContain('.method-signs i {\n  display: grid;\n  width: 24px;\n  height: 24px;\n  place-items: center;\n  border-radius: 6px;\n  background: #edf7e9;');
    expect(css).toContain('.method-signs article:nth-child(2) i {\n  background: #ededed;\n  color: #131313;');
    expect(css).toContain('.method-signs article:nth-child(3) i {\n  background: #f0f0f0;\n  color: #7a7a7a;');
  });
});

import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

describe('agreement methodology link', () => {
  it('maps the methodology control in the agreement Pen frame to the methodology page', () => {
    const source = readFileSync('src/js/pen-frame.js', 'utf8');

    expect(source).toContain("if (page === 'agreement')");
    expect(source).toContain("node.textContent.trim() === 'Методика проверки'");
    expect(source).toContain("makeInteractive(node, '/methodology.html')");
  });
});

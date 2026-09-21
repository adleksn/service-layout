import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const app = readFileSync('src/js/app.js', 'utf8');
const css = readFileSync('src/styles/main.css', 'utf8');

describe('rating catalog layout', () => {
  it('uses the full content width once the ad column is absent', () => {
    expect(app).toContain('class="container layout layout--catalog"');
    expect(css).toContain('.layout--catalog');
  });

  it('restores the filter panel when the viewport grows beyond mobile', () => {
    expect(app).toContain("window.addEventListener('resize', syncFilterPanel)");
  });
});

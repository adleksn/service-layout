import { describe, expect, it } from 'vitest';
import { isCurrentSitePath, resolveSitePaths, sitePath } from '../src/js/site-paths.js';

describe('sitePath', () => {
  it('prefixes a page path with the GitHub Pages repository path', () => {
    expect(sitePath('contacts.html', '/service-layout/')).toBe('/service-layout/contacts.html');
  });

  it('keeps the site root within the GitHub Pages repository path', () => {
    expect(sitePath('', '/service-layout/')).toBe('/service-layout/');
  });

  it('does not prefix a URL that Vite has already rebased', () => {
    document.body.innerHTML = '<a href="/service-layout/contacts.html"></a><img src="/assets/hero.png">';

    resolveSitePaths(document, '/service-layout/');

    expect(document.querySelector('a').getAttribute('href')).toBe('/service-layout/contacts.html');
    expect(document.querySelector('img').getAttribute('src')).toBe('/service-layout/assets/hero.png');
  });

  it('recognises the active navigation page after GitHub Pages adds the repository path', () => {
    expect(isCurrentSitePath('/methodology.html', '/service-layout/methodology.html')).toBe(true);
    expect(isCurrentSitePath('/reports.html', '/service-layout/methodology.html')).toBe(false);
    expect(isCurrentSitePath('#', '/service-layout/methodology.html')).toBe(false);
  });
});

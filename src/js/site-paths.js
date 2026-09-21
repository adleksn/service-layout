export function sitePath(path, basePath = import.meta.env.BASE_URL) {
  const normalizedBase = basePath.endsWith('/') ? basePath : `${basePath}/`;
  if (normalizedBase !== '/' && path.startsWith(normalizedBase)) return path;
  return `${normalizedBase}${path.replace(/^\//, '')}`;
}

/**
 * A route is authored without the GitHub Pages repository prefix (for example
 * `/methodology.html`).  Match its tail so the same header works locally and
 * after Vite rebases links to `/service-layout/methodology.html`.
 */
export function isCurrentSitePath(href, pathname = window.location.pathname) {
  return href !== '#' && href.startsWith('/') && (pathname === href || pathname.endsWith(href));
}

export function resolveSitePaths(root, basePath = import.meta.env.BASE_URL) {
  root.querySelectorAll('[href^="/"], [src^="/"]').forEach((element) => {
    const attribute = element.hasAttribute('href') ? 'href' : 'src';
    const value = element.getAttribute(attribute);
    if (value.startsWith('//')) return;
    element.setAttribute(attribute, sitePath(value, basePath));
  });
}

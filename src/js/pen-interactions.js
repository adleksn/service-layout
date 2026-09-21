const unmappedControl = /^(?:Button(?: |$)|Action$|Apply Button$|Close Button$|Filters Button$|Legend Button$|Link(?: |$)|Reviews Link$|Domain Link$|Place Link$|Chip Пометка PROMO$|Option Promo$|Tab \d{2}\.\d{2}\.\d{4}$|Page (?:Первая|Последняя|‹|1|2|3|›)$)/;

/**
 * Pen exports present controls as decorative div layers. The exact frame
 * replaces the semantic page, so every remaining control needs a real
 * activation path even if it is only a documented # placeholder.
 */
export function bindUnmappedPenControls(frame, onActivate) {
  frame.querySelectorAll('[data-pencil-name]').forEach((node) => {
    const name = node.getAttribute('data-pencil-name') || '';
    if (!unmappedControl.test(name) || node.dataset.penBound === 'true' || node.hasAttribute('role') || node.parentElement?.closest('[data-pen-bound="true"], [role="link"], [role="button"], [role="tab"]')) return;
    node.dataset.penBound = 'true';
    node.setAttribute('role', 'button');
    node.tabIndex = 0;
    const activate = () => onActivate(node);
    node.addEventListener('click', activate);
    node.addEventListener('keydown', (event) => {
      if (event.key !== 'Enter' && event.key !== ' ') return;
      event.preventDefault();
      activate();
    });
  });
}

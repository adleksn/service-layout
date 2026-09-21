const desktop = '1440px';
const mobile = '375px';

export const mockCoverage = [
  ['Главная Desktop 1440', '/', desktop], ['Главная Mobile 375', '/', mobile], ['Главная Tablet 1024', '/', '1024px'],
  ['Рейтинг Desktop 1440', '/rating.html', desktop], ['Рейтинг Mobile 375', '/rating.html', mobile], ['Рейтинг Фильтр Mobile 375', '/rating.html?filters=open', mobile], ['Рейтинг — ничего не найдено Desktop 1440', '/rating.html?empty=1', desktop], ['Рейтинг — ничего не найдено Mobile 375', '/rating.html?empty=1', mobile],
  ['Карточка сервиса Desktop 1440', '/service.html', desktop], ['Карточка сервиса Mobile 375', '/service.html', mobile], ['Карточка сервиса без отзывов Desktop 1440', '/service.html?reviews=none', desktop], ['Карточка сервиса без отзывов Mobile 375', '/service.html?reviews=none', mobile],
  ['Отчёт Desktop 1440', '/report.html', desktop], ['Отчёт Mobile 375', '/report.html', mobile], ['Отчёт Desktop — Состояние 2', '/report.html#check-2024', desktop], ['Отчёт Mobile — Состояние 2', '/report.html#check-2024', mobile],
  ['Отчеты список Desktop 1440', '/reports.html', desktop], ['Отчёты список Mobile 375', '/reports.html', mobile],
  ['Методика проверки Desktop 1440', '/methodology.html', desktop], ['Методика проверки Mobile 375', '/methodology.html', mobile],
  ['Контакты Desktop 1440', '/contacts.html', desktop], ['Контакты Mobile 375', '/contacts.html', mobile], ['Реклама Desktop 1440', '/advertising.html', desktop], ['Реклама Mobile 375', '/advertising.html', mobile],
  ['404 Desktop 1440', '/404.html', desktop], ['404 Mobile 375', '/404.html', mobile], ['Пользовательское соглашение Desktop 1440', '/agreement.html', desktop], ['Пользовательское соглашение Mobile 375', '/agreement.html', mobile],
  ['Виртуальные карты Desktop 1440', '/virtual-cards.html', desktop], ['Виртуальные карты Mobile 375', '/virtual-cards.html', mobile], ['Виртуальные карты — ничего не найдено Desktop 1440', '/virtual-cards.html?empty=1', desktop], ['Виртуальные карты — ничего не найдено Mobile 375', '/virtual-cards.html?empty=1', mobile],
  ['Виртуальные карты — Карточка сервиса Desktop 1440', '/virtual-card.html', desktop], ['Виртуальные карты — Карточка сервиса Mobile 375', '/virtual-card.html', mobile], ['Мобильное меню (открыто) 375', '/?menu=open', mobile], ['UI Kit — состояния', '/ui-kit.html', desktop]
].map(([frame, target, viewport]) => ({ frame, target, viewport }));

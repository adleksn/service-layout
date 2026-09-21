const normalized = (value) => String(value || '').toLocaleLowerCase('ru-RU');

export function filterCatalog(items, { query = '', filters = {} }) {
  const search = normalized(query).trim();
  return items.filter((item) => {
    if (search && !`${normalized(item.name)} ${normalized(item.domain)}`.includes(search)) return false;
    return Object.entries(filters).every(([group, values]) => {
      if (!values?.length || values.includes('any')) return true;
      if (group === 'rating') {
        const minimum = values[0] === '4-plus' ? 4 : values[0] === '3-plus' ? 3 : 0;
        return item.rating >= minimum;
      }
      if (group === 'fee') {
        return values.some((value) => {
          if (value === 'fee-10') return item.fee <= 10;
          if (value === 'fee-15') return item.fee > 10 && item.fee <= 15;
          if (value === 'fee-20') return item.fee > 15 && item.fee <= 20;
          if (value === 'fee-25') return item.fee > 20;
          return false;
        });
      }
      return values.some((value) => item.tags?.includes(value));
    });
  });
}

export function sortCatalog(items, rule = 'rating') {
  if (rule === 'rating') return [...items].sort((a, b) => a.rank - b.rank);
  const field = { rating: 'rating', fee: 'fee', reviews: 'reviews', report: 'reportDate', price: 'price' }[rule] || 'rating';
  const direction = rule === 'fee' || rule === 'price' ? 1 : -1;
  const value = (item) => {
    if (field !== 'reportDate') return item[field];
    if (!item.reportDate || item.reportDate === '—') return 0;
    const parts = item.reportDate.split('.').map(Number);
    return Date.UTC(parts.length === 3 ? parts[2] : 2000, (parts.length === 3 ? parts[1] : parts[0]) - 1, parts.length === 3 ? parts[0] : 1);
  };
  return [...items].sort((a, b) => (value(a) > value(b) ? direction : value(a) < value(b) ? -direction : a.rank - b.rank));
}

export function parseFilterState(query = window.location.search) {
  const params = new URLSearchParams(query);
  const filterGroups = new Set(['fee', 'rating', 'report', 'extra', 'system', 'features', 'currency', 'kyc', 'topup']);
  return [...params.entries()].reduce((state, [key, value]) => (
    filterGroups.has(key)
      ? { ...state, [key]: value.split(',').filter(Boolean) }
      : state
  ), {});
}

export function serializeFilterState(filters) {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([group, values]) => {
    if (values?.length && !values.includes('any')) params.set(group, values.join(','));
  });
  return params.toString();
}

export const services = [
  { id: 'plati-legko', rank: 1, name: 'Плати Легко!', domain: 'pay-saas.ru', rating: 4.9, fee: 10, feeLabel: '10 — 20%', reviews: 167, reportDate: '12.02.2026', tags: ['fee-10', 'fee-15', 'fresh', 'promo', 'verified', 'new'] },
  { id: 'sanpay', rank: 2, name: 'SanPay', domain: 'sanpay.ru', rating: 4.5, fee: 12, feeLabel: '12 — 18%', reviews: 86, reportDate: '20.11.2025', tags: ['fee-15', 'fresh', 'verified'] },
  { id: 'prosto-pay', rank: 3, name: 'Prosto Pay', domain: 'prostopay.com', rating: 4.2, fee: 15, feeLabel: '15%', reviews: 48, reportDate: '04.03.2024', tags: ['fee-15', 'old'] },
  { id: 'o-plati', rank: 4, name: 'O-Plati', domain: 'o-plati.by', rating: 4.2, fee: 10, feeLabel: '10 — 15%', reviews: 101, reportDate: '15.01.2026', tags: ['fee-10', 'fee-15', 'fresh', 'mystery'] },
  { id: 'getpayall', rank: 5, name: 'GetPayAll', domain: 'getpayall.com', rating: 4, fee: 18, feeLabel: '18%', reviews: 6, reportDate: '—', tags: ['fee-20', 'none'] },
  { id: 'oplata-guru', rank: 6, name: 'Oplata.guru', domain: 'oplata.guru', rating: 4, fee: 12, feeLabel: '12 — 18%', reviews: 14, reportDate: '08.2025', tags: ['fee-15', 'old'] },
  { id: 'nowall', rank: 7, name: 'NOWALL', domain: 'nowall.io', rating: 4, fee: 15, feeLabel: '15 — 20%', reviews: 8, reportDate: '—', tags: ['fee-20', 'none'] },
  { id: 'payboy', rank: 8, name: 'PayBoy', domain: 'payboy.ru', rating: 3.8, fee: 10, feeLabel: '10 — 16%', reviews: 31, reportDate: '02.2024', tags: ['fee-15', 'old'] },
  { id: 'dolphin-pay', rank: 9, name: 'Dolphin Pay', domain: 'dolphinpay.ru', rating: 3.8, fee: 18, feeLabel: '18 — 25%', reviews: 19, reportDate: '12.2025', tags: ['fee-20', 'fresh'] },
  { id: 'gctransfer', rank: 10, name: 'GCtransfer', domain: 'gctransfer.com', rating: 3.8, fee: 14, feeLabel: '14 — 22%', reviews: 27, reportDate: '—', tags: ['fee-15', 'fee-20', 'none'] }
  ,{ id: 'cheatpay', rank: 11, name: 'CheatPay', domain: 'cheatpay.ru', rating: 3.7, fee: 20, feeLabel: '20 — 28%', reviews: 15, reportDate: '—', tags: ['fee-20', 'none'] }
  ,{ id: 'helpers-team', rank: 12, name: 'HELPERS TEAM', domain: 'helpersteam.ru', rating: 3.7, fee: 18, feeLabel: '18 — 24%', reviews: 11, reportDate: '09.2025', tags: ['fee-20', 'old'] }
  ,{ id: 'global-payments', rank: 13, name: 'Global Payments', domain: 'globalpayments.ru', rating: 3.4, fee: 15, feeLabel: '15 — 22%', reviews: 9, reportDate: '—', tags: ['fee-15', 'fee-20', 'none'] }
  ,{ id: 'fastpaytoday', rank: 14, name: 'FASTPAYTODAY', domain: 'fastpaytoday.ru', rating: 3.4, fee: 20, feeLabel: '20 — 30%', reviews: 7, reportDate: '—', tags: ['fee-20', 'none'] }
  ,{ id: 'oplatym', rank: 15, name: 'OPLATYM.RU', domain: 'oplatym.ru', rating: 3.2, fee: 22, feeLabel: '22 — 30%', reviews: 5, reportDate: '—', tags: ['fee-20', 'none'] }
  ,{ id: 'opengroup', rank: 16, name: 'OpenGroup', domain: 'opengroup.ru', rating: 3.6, fee: 19, feeLabel: '19 — 28%', reviews: 28, reportDate: '01.2025', tags: ['fee-20', 'old'] }
  ,{ id: 'smartmoney', rank: 17, name: 'SmartMoney', domain: 'smartmoney.ru', rating: 3.6, fee: 21, feeLabel: '21 — 34%', reviews: 34, reportDate: '—', tags: ['fee-20', 'none'] }
  ,{ id: 'fastgroup', rank: 18, name: 'FastGroup', domain: 'fastgroup.ru', rating: 3.5, fee: 15, feeLabel: '15 — 22%', reviews: 20, reportDate: '01.2025', tags: ['fee-15', 'fee-20', 'old'] }
  ,{ id: 'directway', rank: 19, name: 'DirectWay', domain: 'directway.ru', rating: 3.5, fee: 20, feeLabel: '20 — 28%', reviews: 9, reportDate: '03.2024', tags: ['fee-20', 'old'] }
  ,{ id: 'truecash', rank: 20, name: 'TrueCash', domain: 'truecash.ru', rating: 3.4, fee: 21, feeLabel: '21 — 26%', reviews: 26, reportDate: '04.2024', tags: ['fee-20', 'old'] }
  ,{ id: 'transsend', rank: 21, name: 'TransSend', domain: 'transsend.ru', rating: 3.4, fee: 20, feeLabel: '20 — 27%', reviews: 20, reportDate: '—', tags: ['fee-20', 'none'] }
  ,{ id: 'swiftlink', rank: 22, name: 'SwiftLink', domain: 'swiftlink.ru', rating: 3.4, fee: 19, feeLabel: '19 — 28%', reviews: 29, reportDate: '06.2024', tags: ['fee-20', 'old'] }
  ,{ id: 'cityflow', rank: 23, name: 'CityFlow', domain: 'cityflow.ru', rating: 3.3, fee: 15, feeLabel: '15 — 19%', reviews: 4, reportDate: '—', tags: ['fee-15', 'none'] }
  ,{ id: 'silvertransfer', rank: 24, name: 'SilverTransfer', domain: 'silvertransfer.ru', rating: 3.3, fee: 14, feeLabel: '14 — 23%', reviews: 23, reportDate: '—', tags: ['fee-15', 'fee-20', 'none'] }
  ,{ id: 'unionpro', rank: 25, name: 'UnionPro', domain: 'unionpro.ru', rating: 3.3, fee: 15, feeLabel: '15 — 24%', reviews: 19, reportDate: '11.2024', tags: ['fee-15', 'fee-20', 'old'] }
  ,{ id: 'quickcash', rank: 26, name: 'QuickCash', domain: 'quickcash.ru', rating: 3.2, fee: 19, feeLabel: '19 — 24%', reviews: 8, reportDate: '—', tags: ['fee-20', 'none'] }
  ,{ id: 'northpro', rank: 27, name: 'NorthPro', domain: 'northpro.ru', rating: 3.2, fee: 16, feeLabel: '16 — 24%', reviews: 31, reportDate: '04.2025', tags: ['fee-20', 'old'] }
  ,{ id: 'northgroup', rank: 28, name: 'NorthGroup', domain: 'northgroup.ru', rating: 3.1, fee: 19, feeLabel: '19 — 30%', reviews: 20, reportDate: '—', tags: ['fee-20', 'none'] }
  ,{ id: 'truecard', rank: 29, name: 'TrueCard', domain: 'truecard.ru', rating: 3.1, fee: 14, feeLabel: '14 — 19%', reviews: 9, reportDate: '—', tags: ['fee-15', 'none'] }
  ,{ id: 'cityway', rank: 30, name: 'CityWay', domain: 'cityway.ru', rating: 3.1, fee: 14, feeLabel: '14 — 21%', reviews: 10, reportDate: '11.2024', tags: ['fee-15', 'fee-20', 'old'] }
  ,{ id: 'uniongate', rank: 31, name: 'UnionGate', domain: 'uniongate.ru', rating: 3, fee: 17, feeLabel: '17 — 22%', reviews: 13, reportDate: '09.2025', tags: ['fee-20', 'old'] }
  ,{ id: 'clearhub', rank: 32, name: 'ClearHub', domain: 'clearhub.ru', rating: 3, fee: 20, feeLabel: '20 — 30%', reviews: 7, reportDate: '—', tags: ['fee-20', 'none'] }
  ,{ id: 'primecard', rank: 33, name: 'PrimeCard', domain: 'primecard.ru', rating: 3, fee: 16, feeLabel: '16 — 28%', reviews: 17, reportDate: '—', tags: ['fee-20', 'none'] }
  ,{ id: 'truegroup', rank: 34, name: 'TrueGroup', domain: 'truegroup.ru', rating: 2.9, fee: 18, feeLabel: '18 — 24%', reviews: 35, reportDate: '—', tags: ['fee-20', 'none'] }
  ,{ id: 'paybridge', rank: 35, name: 'PayBridge', domain: 'paybridge.ru', rating: 2.9, fee: 13, feeLabel: '13 — 21%', reviews: 18, reportDate: '10.2025', tags: ['fee-15', 'fee-20', 'old'] }
  ,{ id: 'primeway', rank: 36, name: 'PrimeWay', domain: 'primeway.ru', rating: 2.8, fee: 18, feeLabel: '18 — 27%', reviews: 8, reportDate: '—', tags: ['fee-20', 'none'] }
  ,{ id: 'fastpro', rank: 37, name: 'FastPro', domain: 'fastpro.ru', rating: 2.8, fee: 10, feeLabel: '10 — 23%', reviews: 16, reportDate: '10.2024', tags: ['fee-10', 'fee-15', 'fee-20', 'old'] }
  ,{ id: 'northhub', rank: 38, name: 'NorthHub', domain: 'northhub.ru', rating: 2.8, fee: 20, feeLabel: '20 — 27%', reviews: 16, reportDate: '01.2024', tags: ['fee-20', 'old'] }
  ,{ id: 'swiftteam', rank: 39, name: 'SwiftTeam', domain: 'swiftteam.ru', rating: 2.7, fee: 15, feeLabel: '15 — 21%', reviews: 7, reportDate: '06.2025', tags: ['fee-15', 'fee-20', 'old'] }
  ,{ id: 'translink', rank: 40, name: 'TransLink', domain: 'translink.ru', rating: 2.7, fee: 14, feeLabel: '14 — 21%', reviews: 3, reportDate: '10.2024', tags: ['fee-15', 'fee-20', 'old'] }
  ,{ id: 'primepro', rank: 41, name: 'PrimePro', domain: 'primepro.ru', rating: 2.7, fee: 13, feeLabel: '13 — 20%', reviews: 20, reportDate: '—', tags: ['fee-15', 'fee-20', 'none'] }
  ,{ id: 'clearcash', rank: 42, name: 'ClearCash', domain: 'clearcash.ru', rating: 2.6, fee: 14, feeLabel: '14 — 19%', reviews: 37, reportDate: '03.2025', tags: ['fee-15', 'old'] }
  ,{ id: 'globalpro', rank: 43, name: 'GlobalPro', domain: 'globalpro.ru', rating: 2.6, fee: 18, feeLabel: '18 — 25%', reviews: 5, reportDate: '—', tags: ['fee-20', 'none'] }
  ,{ id: 'northcard', rank: 44, name: 'NorthCard', domain: 'northcard.ru', rating: 2.5, fee: 10, feeLabel: '10 — 16%', reviews: 35, reportDate: '03.2024', tags: ['fee-10', 'fee-15', 'old'] }
  ,{ id: 'truebridge', rank: 45, name: 'TrueBridge', domain: 'truebridge.ru', rating: 2.5, fee: 13, feeLabel: '13 — 19%', reviews: 26, reportDate: '—', tags: ['fee-15', 'none'] }
  ,{ id: 'transtransfer', rank: 46, name: 'TransTransfer', domain: 'transtransfer.ru', rating: 2.5, fee: 21, feeLabel: '21 — 26%', reviews: 23, reportDate: '10.2025', tags: ['fee-20', 'old'] }
  ,{ id: 'easygroup', rank: 47, name: 'EasyGroup', domain: 'easygroup.ru', rating: 2.4, fee: 12, feeLabel: '12 — 16%', reviews: 10, reportDate: '—', tags: ['fee-15', 'none'] }
  ,{ id: 'suresend', rank: 48, name: 'SureSend', domain: 'suresend.ru', rating: 2.4, fee: 21, feeLabel: '21 — 33%', reviews: 13, reportDate: '06.2025', tags: ['fee-20', 'old'] }
  ,{ id: 'silvergate', rank: 49, name: 'SilverGate', domain: 'silvergate.ru', rating: 2.3, fee: 11, feeLabel: '11 — 23%', reviews: 37, reportDate: '—', tags: ['fee-15', 'fee-20', 'none'] }
  ,{ id: 'smarttransfer', rank: 50, name: 'SmartTransfer', domain: 'smarttransfer.ru', rating: 2.3, fee: 10, feeLabel: '10 — 22%', reviews: 35, reportDate: '05.2024', tags: ['fee-10', 'fee-15', 'fee-20', 'old'] }
  ,{ id: 'silvermoney', rank: 51, name: 'SilverMoney', domain: 'silvermoney.ru', rating: 2.3, fee: 11, feeLabel: '11 — 18%', reviews: 34, reportDate: '—', tags: ['fee-15', 'none'] }
];

export const cards = [
  { id: 'plati-legko-card', rank: 1, name: 'Плати Легко!', domain: 'pay-saas.ru', rating: 4.8, price: 0, priceLabel: 'бесплатно', system: 'VISA', currency: 'USD', reviews: 214, reportDate: '12.02.2026', tags: ['visa', 'rub', 'fresh', 'promo'] },
  { id: 'sanpay-card', rank: 2, name: 'SanPay', domain: 'sanpay.ru', rating: 4.5, price: 990, priceLabel: '990 ₽', system: 'VISA', currency: 'USD, EUR', reviews: 98, reportDate: '20.11.2025', tags: ['visa', 'rub', 'fresh'] },
  { id: 'prosto-pay-card', rank: 3, name: 'Prosto Pay', domain: 'prostopay.com', rating: 3.4, price: 500, priceLabel: '500 ₽', system: '—', currency: 'EUR', reviews: 156, reportDate: '04.03.2024', tags: ['rub', 'old'] },
  { id: 'getpayall-card', rank: 4, name: 'GetPayAll', domain: 'getpayall.com', rating: 4.2, price: 0, priceLabel: 'бесплатно', system: 'VISA', currency: 'Другие', reviews: 42, reportDate: '—', tags: ['visa', 'crypto', 'none', 'promo'] },
  { id: 'payboy-card', rank: 5, name: 'PayBoy', domain: 'payboy.ru', rating: 3.7, price: 1200, priceLabel: '1200 ₽', system: 'VISA', currency: 'USD', reviews: 77, reportDate: '—', tags: ['visa', 'rub', 'none'] },
  { id: 'dolphin-card', rank: 6, name: 'Dolphin Pay', domain: 'dolphinpay.ru', rating: 2.6, price: 700, priceLabel: '700 ₽', system: '—', currency: 'USD, EUR', reviews: 133, reportDate: '12.2025', tags: ['crypto', 'fresh'] },
  { id: 'cheat-card', rank: 7, name: 'CheatPay', domain: 'cheatpay.ru', rating: 2.1, price: 300, priceLabel: '300 ₽', system: 'VISA', currency: 'Другие', reviews: 19, reportDate: '—', tags: ['visa', 'crypto', 'none'] }
];

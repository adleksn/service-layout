const paymentEvidence = [
  {
    src: '/assets/fda0d46096cb5d4a.png',
    alt: 'Переписка с менеджером RUPay.money в Telegram',
    caption: 'Переписка с менеджером в Telegram: обсуждение суммы и способа оплаты'
  },
  {
    src: '/assets/8f78b574a99d9a1d.png',
    alt: 'Реквизиты карты для перевода средств',
    caption: 'Реквизиты карты, отправленные менеджером для перевода средств'
  },
  {
    src: '/assets/c0aba130d07c243e.png',
    alt: 'Реквизиты виртуальной карты для оплаты подписки',
    caption: 'Реквизиты виртуальной карты, выданной для оплаты подписки'
  }
];

export function paymentEvidenceMarkup() {
  return `<section class="payment-evidence" aria-labelledby="payment-evidence-title"><h2 id="payment-evidence-title">Проведение оплаты</h2><p>Как и было сказано в инструкции на сайте, тайный покупатель перешёл в Telegram по ссылке на сайте и написал менеджеру. Специалист сразу уточнил сумму оплаты и отправил реквизиты для перевода.</p>${paymentEvidence.map(({ src, alt, caption }) => `<figure class="payment-evidence__item"><img src="${src}" width="300" height="400" loading="lazy" alt="${alt}"><figcaption>${caption}</figcaption></figure>`).join('')}</section>`;
}

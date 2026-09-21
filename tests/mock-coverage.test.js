import { describe, expect, it } from 'vitest';
import { mockCoverage } from '../src/js/mock-manifest.js';

const expectedFrames = [
  'Главная Desktop 1440', 'Главная Mobile 375', 'Главная Tablet 1024',
  'Рейтинг Desktop 1440', 'Рейтинг Mobile 375', 'Рейтинг Фильтр Mobile 375', 'Рейтинг — ничего не найдено Desktop 1440', 'Рейтинг — ничего не найдено Mobile 375',
  'Карточка сервиса Desktop 1440', 'Карточка сервиса Mobile 375', 'Карточка сервиса без отзывов Desktop 1440', 'Карточка сервиса без отзывов Mobile 375',
  'Отчёт Desktop 1440', 'Отчёт Mobile 375', 'Отчёт Desktop — Состояние 2', 'Отчёт Mobile — Состояние 2',
  'Отчеты список Desktop 1440', 'Отчёты список Mobile 375', 'Методика проверки Desktop 1440', 'Методика проверки Mobile 375',
  'Контакты Desktop 1440', 'Контакты Mobile 375', 'Реклама Desktop 1440', 'Реклама Mobile 375',
  '404 Desktop 1440', '404 Mobile 375', 'Пользовательское соглашение Desktop 1440', 'Пользовательское соглашение Mobile 375',
  'Виртуальные карты Desktop 1440', 'Виртуальные карты Mobile 375', 'Виртуальные карты — ничего не найдено Desktop 1440', 'Виртуальные карты — ничего не найдено Mobile 375',
  'Виртуальные карты — Карточка сервиса Desktop 1440', 'Виртуальные карты — Карточка сервиса Mobile 375', 'Мобильное меню (открыто) 375', 'UI Kit — состояния'
];

describe('Pen mock coverage', () => {
  it('tracks every supplied desktop, tablet, mobile, and component state', () => {
    expect(mockCoverage.map((entry) => entry.frame)).toEqual(expect.arrayContaining(expectedFrames));
  });

  it('gives every frame a concrete route or interactive state target', () => {
    expect(mockCoverage.every((entry) => entry.target && entry.viewport)).toBe(true);
  });
});

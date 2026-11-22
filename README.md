# Playwright + TypeScript autotests

Учебный проект автоматизации тестирования: UI- и API-автотесты на Playwright и TypeScript.

## Что внутри

**UI-тесты** ([saucedemo.com](https://www.saucedemo.com))
- логин: успешный вход и негативные сценарии (параметризованные тесты);
- корзина: добавление и удаление товаров.

**Мокирование сети** ([demo.playwright.dev](https://demo.playwright.dev/api-mocking))
- подмена ответов API через `page.route`: свои данные, пустой список, ошибка 500, изменение реального ответа.

## Архитектура

- **Page Object** для UI-страниц (`pages/`);
- **API-клиент** `BookingApi` с типизацией запросов и ответов (`api/`);
- **фикстуры** Playwright (`fixtures/`): страницы, авторизованный API-клиент, тестовое бронирование с автоматическим удалением после теста;
- **CI**: запуск всех тестов в GitHub Actions на каждый push.

## Запуск

```bash
npm ci
npx playwright install
npm test            # все тесты
npm run test:api    # только API
npm run report      # HTML-отчёт Playwright
npm run allure      # Allure-отчёт
```

## Стек

Playwright, TypeScript, Node.js, Allure, GitHub Actions
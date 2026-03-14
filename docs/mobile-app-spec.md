# FlyANGT Mobile App — Technical Specification

**Version:** 1.0
**Date:** 2026-03-14
**API Base URL:** `https://flyangt.com`
**API Docs (Swagger):** `https://flyangt.com/swagger.html`
**OpenAPI Spec:** `https://flyangt.com/openapi.yaml`

---

## 1. Stack

| Layer | Technology |
|---|---|
| Framework | React Native + Expo (SDK 52+) |
| Navigation | Expo Router (file-based) |
| State | Zustand |
| HTTP | `fetch` / `axios` |
| Auth storage | `expo-secure-store` |
| Wallet | `@reown/appkit` (WalletConnect v2) |
| Google OAuth | `expo-auth-session` + `expo-web-browser` |
| WebView | `expo-web-browser` / `react-native-webview` |
| Blockchain reads | `ethers.js` v6 (optional, server does most reads) |
| Notifications | `expo-notifications` (push, optional) |

---

## 2. Authentication

### Storage
JWT token хранить в `expo-secure-store` под ключом `auth_token`.

### Headers
Все защищённые запросы:
```
Authorization: Bearer <token>
Content-Type: application/json
```

### Flows

#### Email / Password
```
POST /api/v1/login
POST /api/v1/register
→ { ok, token, user: { id, email, name } }
```
Сохранить `token` в SecureStore. Перейти на главный экран.

#### Google OAuth
```
1. expo-auth-session → Google → получить idToken
2. POST /api/v1/auth/google/token  { idToken, referralCode? }
→ { ok, token, user }
```

Конфигурация Google:
- В Google Cloud Console создать OAuth клиент типа **iOS** и **Android**
- `clientId` для каждой платформы передавать в `expo-auth-session`
- `redirectUri` = `AuthSession.makeRedirectUri({ useProxy: true })`

#### Forgot / Reset password
```
POST /api/v1/forgot-password  { email }
POST /api/v1/reset-password   { token, password }
```
Ссылка из письма ведёт на `https://flyangt.com/reset-password?token=...` — открыть в браузере или WebView.

---

## 3. Экраны

### 3.1 Публичные (без авторизации)

| Экран | Описание |
|---|---|
| Splash | Логотип + проверка токена |
| Login | Email + password, кнопка Google |
| Register | Email + password + имя + реферальный код |
| Forgot Password | Ввод email |

### 3.2 Приложение (после входа)

| Экран | Описание |
|---|---|
| Dashboard | Баланс ANGT, цена токена, кнопки |
| Presale | Прогресс продажи, покупка |
| Airdrop | Задания, таймер, история |
| Rewards | Список вознаграждений |
| AI Advisor | Чат с GPT |
| Profile | Настройки профиля |
| Wallet | Подключение и верификация |

---

## 4. Кошелёк (WalletConnect)

### Настройка
```
npm install @reown/appkit-ethers5
```

В `app.json`:
```json
"scheme": "flyangt"
```

WalletConnect Project ID получить на `cloud.reown.com` (уже есть в `.env` как `VITE_WALLETCONNECT_PROJECT_ID`).

### Подключение кошелька
```js
const provider = await appKit.connect()
const address = await provider.request({ method: 'eth_requestAccounts' })
```

### Верификация кошелька (полный flow)

```
1. POST /api/v1/airdrop/wallet/nonce
   body: { address, provider: "walletconnect" }
   → { nonce, message, nonceToken }

2. Подписать message через WalletConnect:
   const signature = await provider.request({
     method: 'personal_sign',
     params: [message, address]
   })

3. POST /api/v1/airdrop/wallet/verify
   body: { address, message, signature, nonceToken }
   → { ok, selfRewarded, referralRewarded }
```

### Проверка сети
Требуется **Polygon Mainnet** (`chainId: 137`).
```js
await provider.request({
  method: 'wallet_switchEthereumChain',
  params: [{ chainId: '0x89' }]
})
```

---

## 5. Presale — покупка токена

### 5.1 Через Stripe (карта)

```
1. POST /api/v1/presale/stripe/create-session
   body: {
     payAmount: 100,
     successUrl: "flyangt://presale/success?session_id={CHECKOUT_SESSION_ID}",
     cancelUrl: "flyangt://presale/cancel"
   }
   → { ok, url, sessionId }

2. Открыть url в expo-web-browser:
   await WebBrowser.openBrowserAsync(url)

3. Deep link вернётся на flyangt://presale/success?session_id=...

4. GET /api/v1/presale/stripe/status?session_id=...
   → { purchase: { status, tokenAmount, ... } }
```

Deep link настроить в `app.json`:
```json
"intentFilters": [{ "action": "VIEW", "data": [{ "scheme": "flyangt" }] }]
```

### 5.2 Через крипту (USDT/USDC на Polygon)

```
1. POST /api/v1/presale/onchain/prepare
   body: { payToken: "usdt", payAmountUsd: 100 }
   → {
       transactions: [
         { step: 1, type: "approve", to: "0xUSDT", data: "0x..." },
         { step: 2, type: "buy",     to: "0xPresale", data: "0x..." }
       ],
       tokenAmount: 123456,
       week: 3,
       priceUsd: 0.00081
     }

2. Показать юзеру: "Approve 100 USDT → Buy 123,456 ANGT"

3. Отправить approve через WalletConnect:
   await provider.request({
     method: 'eth_sendTransaction',
     params: [{ to: tx.to, data: tx.data, from: address }]
   })
   // Ждать подтверждения (polling или receipt)

4. Отправить buy транзакцию аналогично

5. GET /api/v1/presale/purchases/{address}
   → история покупок для подтверждения
```

> **Важно:** перед `buy` обязательно дождаться подтверждения `approve` (минимум 1 блок ~2 сек на Polygon).

---

## 6. Airdrop

### Задания

| Таск | Endpoint | Награда |
|---|---|---|
| Подключить кошелёк | `/airdrop/wallet/verify` | 50 ANGT |
| Подписаться на Instagram | `/airdrop/instagram/start` → `/claim` | 75 ANGT |
| Instagram код | `/airdrop/igcode/claim` | 50 ANGT |
| Заполнить профиль | `/user/settings` (авто) | 100 ANGT |
| Пригласить друга | Авто при верификации реферала | 150 ANGT |

### Instagram flow
```
1. POST /api/v1/airdrop/instagram/start
   → { igUrl, token, waitMs: 60000 }

2. Открыть igUrl в браузере / WebView
   Ждать 60 секунд (таймер)

3. POST /api/v1/airdrop/instagram/claim  { token }
   → { ok, claimed, amount, totalAmount }
   // Если слишком рано — вернёт { needWaitMs }
```

---

## 7. AI Advisor

```
POST /api/v1/assistant
body: {
  prompt: "What is ANGT token?",
  history: [
    { role: "user", content: "..." },
    { role: "assistant", content: "..." }
  ]
}
→ { reply: "...", lang: "en" }
```

- Авторизация **не нужна**
- История ограничена 12 последними сообщениями (сервер обрезает)
- Хранить историю локально в Zustand

---

## 8. Dashboard

```
// Цена токена
GET /api/v1/token/price?address=0x<ANGT_CONTRACT>

// Балансы
GET /api/v1/dashboard/balances?address=<wallet>

// Прогресс presale
GET /api/v1/presale/progress

// История покупок
GET /api/v1/presale/purchases/<wallet>
```

---

## 9. Профиль

```
// Получить
GET /api/v1/user/me

// Обновить
PATCH /api/v1/user/settings
body: { phone, country, age, instagram, x, telegram }
→ { ok, user, reward: { claimed, amount } | null }

// Завершить онбординг
PATCH /api/v1/user/onboarding
```

---

## 10. Структура проекта (рекомендуемая)

```
app/
  (auth)/
    login.tsx
    register.tsx
    forgot-password.tsx
  (app)/
    _layout.tsx          ← проверка токена, редирект на login
    index.tsx            ← Dashboard
    presale.tsx
    airdrop.tsx
    rewards.tsx
    advisor.tsx
    profile.tsx
    wallet.tsx
  presale/
    success.tsx          ← deep link handler
    cancel.tsx

lib/
  api.ts                 ← fetch wrapper с Bearer token
  store/
    auth.ts              ← Zustand: token, user
    wallet.ts            ← Zustand: address, status
  wallet/
    walletconnect.ts     ← appKit setup

constants/
  addresses.ts           ← ANGT, USDT, USDC, Presale адреса на Polygon
```

---

## 11. Адреса контрактов (Polygon Mainnet)

| Контракт | Адрес |
|---|---|
| Presale | `0xdd03b252829A3ebE19F03cf5B6fa033b3DB3Bed0` |
| USDT | `0xc2132D05D31c914a87C6611C10748AEb04B58e8F` |
| USDC | `0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359` |
| Network | Polygon Mainnet (chainId: 137) |

---

## 12. Environment переменные (мобильный клиент)

```env
EXPO_PUBLIC_API_URL=https://flyangt.com
EXPO_PUBLIC_WC_PROJECT_ID=<WalletConnect Project ID>
EXPO_PUBLIC_GOOGLE_CLIENT_ID_IOS=<iOS OAuth Client ID>
EXPO_PUBLIC_GOOGLE_CLIENT_ID_ANDROID=<Android OAuth Client ID>
```

---

## 13. Важные замечания

1. **Stripe WebView** — использовать `expo-web-browser`, не `WebView` внутри приложения, иначе Apple отклонит.
2. **Крипто-покупка** — Apple/Google разрешают: приложение не принимает деньги само, кошелёк подписывает транзакцию во внешнем приложении.
3. **Approve + Buy** — две отдельные транзакции, нельзя объединить. Дожидаться receipt после approve.
4. **Nonce токен** — `nonceToken` действует **5 минут**. Если пользователь долго не подписывает — показать кнопку "Retry" и запросить новый nonce.
5. **JWT токен** — живёт **7 дней**. При 401 ответе — чистить SecureStore и редиректить на Login.
6. **Google OAuth** — на iOS использовать `clientId` для iOS, на Android — для Android. Один `clientId` не подходит для обеих платформ.

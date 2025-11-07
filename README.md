<div align="center">

# 🌐 Codgoo Ecosystem – Feature-First React Starter

**Vite + React + TypeScript + Tailwind (no PostCSS config) + i18next + Redux Toolkit**

![Vite](https://img.shields.io/badge/Vite-7.1-646CFF?logo=vite&logoColor=white)
![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=121212)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.1-38BDF8?logo=tailwindcss&logoColor=white)
![i18next](https://img.shields.io/badge/i18next-ready-26A69A?logo=i18next&logoColor=white)
![Redux Toolkit](https://img.shields.io/badge/Redux%20Toolkit-2.x-764ABC?logo=redux&logoColor=white)

</div>

## ✨ Highlights

- 🚀 **Instant DX** – Vite 7, SWC-powered React, strict TypeScript.
- 🎨 **Tailwind-ready** – TailwindCSS via `@tailwindcss/vite`, no standalone PostCSS config.
- 🌍 **i18n baked in** – Feature-scoped translations with `react-i18next`, ready for English & Arabic (RTL).
- 🧩 **Feature-first folders** – Keep UI, services, and translations together.
- 🧠 **Redux Toolkit store** – App state powered by RTK with an extendable theme slice.

## 🧱 Project Layout

```text
src/
├─ app/             # Application shell (providers, layouts)
│  ├─ layouts/
│  │  └─ AppLayout.tsx
│  └─ providers/
│     └─ AppProviders.tsx
├─ assets/          # Static assets & base translations
├─ features/        # Feature modules (UI + locales + logic)
├─ routes/          # Route definitions & page-level composition
│  ├─ AppRoutes.tsx
│  └─ home/
│     └─ HomeRoute.tsx
├─ services/        # API clients, service facades
├─ shared/          # Cross-cutting components, config, utilities
│  └─ components/
│     ├─ AppHeader.tsx
│     ├─ AppFooter.tsx
│     ├─ LanguageSwitcher.tsx
│     └─ ThemeToggle.tsx
└─ store/           # Redux Toolkit store & typed hooks
   └─ theme/
      ├─ ThemeProvider.tsx
      └─ theme-slice.ts
```

### 🗂️ Feature Example

Each feature keeps its UI, translations, and exports together:

```text
features/
└─ landing/
   ├─ locales/
   │  ├─ en.json
   │  └─ ar.json
   ├─ ui/
   │  └─ LandingHero.tsx
   └─ index.ts
```

### 🏷️ Naming Convention

- All React components live in files that use **PascalCase** (for example `AppHeader.tsx`, `LandingHero.tsx`) to keep component boundaries obvious and consistent across the feature tree.

### 🌎 i18n Structure

- Global copy lives in `assets/locales/{lang}/common.json`.
- Feature-specific copy lives inside each feature folder.
- `shared/config/i18n.ts` registers namespaces and language detection.

## 🛠️ Getting Started

```bash
npm install
npm run dev
```

Available scripts:

- `npm run dev` – start Vite dev server.
- `npm run build` – type-check and create production build.
- `npm run preview` – preview the production bundle locally.
- `npm run lint` – run ESLint on all TypeScript/TSX files.

## 🧰 Tech Decisions

- **Tailwind without PostCSS** – integration happens via the official `@tailwindcss/vite` plugin, so no `postcss.config` file is needed.
- **Strict TypeScript** – enforced through `tsconfig.json` and lint rules.
- **Routing** – React Router v6 with a simple `AppRoutes` entry point.
- **State** – Redux Toolkit store (`store/`) with a feature-driven theme slice and typed hooks.

## 📦 Environment Variables

- `VITE_API_BASE_URL` – optional base URL for the example `apiClient`. Defaults to `https://api.example.com` when omitted.

## 🤝 Contributing

1. Fork & clone this repository.
2. Create a feature branch.
3. Run `npm run lint` before pushing changes.
4. Open a PR describing your feature/fix.



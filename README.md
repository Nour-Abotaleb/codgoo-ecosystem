<div align="center">

# 🌐 Codgoo Ecosystem – Feature-First React Starter

**Vite + React + TypeScript + Tailwind (no PostCSS config) + i18next**

![Vite](https://img.shields.io/badge/Vite-7.1-646CFF?logo=vite&logoColor=white)
![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=121212)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.1-38BDF8?logo=tailwindcss&logoColor=white)
![i18next](https://img.shields.io/badge/i18next-ready-26A69A?logo=i18next&logoColor=white)

</div>

## ✨ Highlights

- 🚀 **Instant DX** – Vite 7, SWC-powered React, strict TypeScript.
- 🎨 **Tailwind-ready** – TailwindCSS via `@tailwindcss/vite`, no standalone PostCSS config.
- 🌍 **i18n baked in** – Feature-scoped translations with `react-i18next`.
- 🧩 **Feature-first folders** – Keep UI, services, and translations together.
- 🌓 **Tiny global store** – Context-powered theme switcher ready for expansion.

## 🧱 Project Layout

```text
src/
├─ app/             # Application shell (providers, layouts)
├─ assets/          # Static assets & base translations
├─ features/        # Feature modules (UI + locales + logic)
├─ routes/          # Route definitions & page-level composition
├─ services/        # API clients, service facades
├─ shared/          # Cross-cutting components, config, utilities
└─ store/           # Lightweight global state
```

### 🗂️ Feature Example

Each feature keeps its UI, translations, and exports together:

```text
features/
└─ landing/
   ├─ locales/
   │  ├─ en.json
   │  └─ es.json
   ├─ ui/
   │  └─ landing-hero.tsx
   └─ index.ts
```

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
- **State** – a minimal theme store (`store/theme`) showcases how to grow shared state in a feature-first setup.

## 📦 Environment Variables

- `VITE_API_BASE_URL` – optional base URL for the example `apiClient`. Defaults to `https://api.example.com` when omitted.

## 🤝 Contributing

1. Fork & clone this repository.
2. Create a feature branch.
3. Run `npm run lint` before pushing changes.
4. Open a PR describing your feature/fix.



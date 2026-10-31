# Contributing

Thanks for taking the time to contribute.

## Getting started

```bash
git clone https://github.com/<you>/myportfolio.git
cd myportfolio
npm install
npm run dev
```

For the backend:
```bash
cd backend
go run main.go
```

Before opening a PR:

```bash
npm run lint
npm run build
```

Both must pass.

## Conventions

- **TypeScript, strict.** No `any`. Components are typed `FC<Props>`.
- **Content lives in constants**, never in components.
- **Tailwind v4, CSS-first.**
- **`"use client"` only where it's needed.**

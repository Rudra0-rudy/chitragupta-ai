# Dashboard

The Chitragupta AI frontend — Vite + React 19 + TypeScript.

## Linting

Linting is enforced in CI by **ESLint**, invoked via `pnpm lint` (which runs `eslint .` from this directory). The configuration is `eslint.config.js`, which re-exports the shared `@repo/eslint-config/react-library` preset from `packages/eslint-config/`.

`oxlint` is also installed and configured via `.oxlintrc.json` for editor-time checks, but it is **not** what CI runs. To extend the Oxlint configuration, edit `.oxlintrc.json` directly and see the [Oxlint rules documentation](https://oxc.rs/docs/guide/usage/linter/rules) for the full list of rules and categories.

## React Compiler

The React Compiler is not enabled because of its impact on dev and build performance. To add it, see the [React Compiler installation docs](https://react.dev/learn/react-compiler/installation).

## Scripts

Defined in `package.json`:

| Script | Command | Purpose |
|---|---|---|
| `pnpm dev` | `vite` | Start the Vite dev server on port 3001 |
| `pnpm build` | `tsc -b && vite build` | Type-check and produce a production build in `dist/` |
| `pnpm lint` | `eslint .` | Run ESLint (this is what CI invokes) |
| `pnpm preview` | `vite preview` | Serve the production build locally |
| `pnpm test` | `vitest run` | Run the Vitest suite once |
| `pnpm test:watch` | `vitest` | Run the Vitest suite in watch mode |
| `pnpm check-types` | `tsc --noEmit` | Type-check without emitting files |

# MEMORY.md — Wished App Audit & Design Revisit

## Overview

Full-stack wishlist app: Next.js 16 (App Router) + Tailwind CSS v4 + shadcn/ui + Framer Motion.
Backend: AWS CDK (Lambda, API Gateway, Cognito, DynamoDB, S3).

---

## ✅ Completed Fixes

### P0 — Tailwind v4 Breakage

- [x] Fixed `globals.css` — removed `@apply border-border`, fixed `outline-ring/50`, fixed `from-accent-subtle` gradient
- [x] Removed `tailwind.config.ts` — all theme config now in CSS `@theme`
- [x] Removed `tailwindcss` and `tailwindcss-animate` from `package.json` devDependencies
- [x] Removed `autoprefixer` from `package.json`
- [x] Updated `components.json` to remove `tailwind.config.ts` reference
- [x] Fixed logout module — `'use server'` re-export issue

### P1 — Design Polish

- [x] Redesigned auth pages (Login, Register, Confirm) with brand illustration, better layout
- [x] Fixed accent color in light mode — changed from near-white `oklch(0.97 0 0)` to visible `oklch(0.85 0.05 30)`
- [x] Fixed FriendButton animation direction
- [x] Fixed DatePicker placeholder typo ("Pick a data" → "Pick a date")
- [x] Fixed WishContent to show category name instead of ID
- [x] Added `prefers-reduced-motion` support to Framer Motion components
- [x] Replaced `space-y-*` / `space-x-*` with `gap-*` on flex containers
- [x] Fixed `container` class usage

### P2 — Cleanup

- [x] Removed unused dependencies from `package.json`
- [x] Fixed `react-dom` version mismatch
- [x] Updated `eslint-config-next`

---

## 🚨 Critical: Tailwind v4 Migration Issues

The project uses `@tailwindcss/postcss` v4.3.0 and Tailwind CSS v4.3.0, but many components still use **Tailwind v3 patterns** that are **broken or changed in v4**.

### Key v4 Breaking Changes Found:

1. **`@apply border-border`** — In v4, CSS variables are referenced differently. The `@layer base` block uses `@apply border-border` which may not resolve correctly since v4 uses `@theme` for design tokens.

2. **`outline-ring/50`** — The `/50` opacity modifier on custom CSS variables doesn't work the same in v4. Need to use `outline-color: var(--ring) / 0.5` or similar.

3. **`dark:` prefix** — v4 uses `@custom-variant dark (&:is(.dark *))` which is correct, but some components may have issues with nested dark variants.

4. **`bg-background/80`** — Opacity modifiers on CSS variables work differently in v4. The syntax `bg-background/80` should work with `@property` definitions, but needs verification.

5. **`ring-1 ring-border/50`** — The `ring-border/50` pattern may not work in v4. Need to verify.

6. **`from-accent-subtle`** — Custom color `accent-subtle` is defined in `@theme` but used with gradient syntax `from-accent-subtle` which may need `from-(--color-accent-subtle)` in v4.

7. **`space-y-*` / `space-x-*`** — These utilities still work in v4 but are deprecated. Should migrate to `gap-*` on flex/grid containers.

8. **`divide-y`** — Same as space utilities, deprecated but functional.

### Components Likely Broken:

| Component                | File                                    | Issue                                                          |
| ------------------------ | --------------------------------------- | -------------------------------------------------------------- |
| WishCard                 | `src/entities/wish/ui/WishCard.tsx`     | `ring-1 ring-border/50`, `bg-background/80`, `bg-foreground/5` |
| WishDialog               | `src/entities/wish/ui/WishDialog.tsx`   | `bg-black/40`, `bg-background`, `border-border/50`             |
| WishForm                 | `src/entities/wish/ui/WishForm.tsx`     | `bg-secondary/30`, `bg-accent/[0.03]`, `border-accent/30`      |
| ProfileHeader            | `src/widgets/user/ui/ProfileHeader.tsx` | `bg-accent/20 blur-xl`, `ring-2 ring-accent/30`                |
| Friends                  | `src/widgets/user/ui/Friends.tsx`       | `bg-muted/50`, `border-border/60`, `ring-2 ring-accent/20`     |
| AuthHeader               | `src/shared/ui/AuthHeader/index.tsx`    | `ring-2 ring-border/50`                                        |
| Navigation               | `src/shared/ui/Navigation/index.tsx`    | `bg-accent/10`, `bg-secondary`                                 |
| WishesTabs               | `src/widgets/wishes/ui/WishesTabs.tsx`  | `border-border/40`                                             |
| Home page                | `src/app/page.tsx`                      | `border bg-card`                                               |
| Profile page             | `src/app/(user)/profile/page.tsx`       | `border-border/40 bg-card`                                     |
| All shadcn/ui components | `src/shared/ui/*`                       | Various v3 patterns                                            |

---

## 🎨 Design Audit

### What's Working Well

1. **Color system** — OKLCH-based theme with `accent-subtle`, `success`, `warning` is modern and distinctive
2. **Motion design** — Framer Motion animations are tasteful (spring transitions, staggered children)
3. **Typography** — Geist font variable setup is clean
4. **Card design** — WishCard has nice hover effects, image zoom, gradient overlays
5. **Dialog pattern** — Slide-in panel (desktop) / bottom sheet feel is modern
6. **Empty states** — Custom SVG illustrations per type are thoughtful
7. **Skeleton loading** — Consistent across all components
8. **Badge system** — Status badges with icons and color coding are clear

### What Needs Improvement

1. ~~Auth pages~~ — Login/Register/Confirm are basic Card layouts, no personality. No logo, no illustration, no brand feel. ✅ Fixed
2. ~~Color contrast~~ — `accent` in light mode is `oklch(0.97 0 0)` (near-white), making `bg-accent` invisible. ✅ Fixed
3. ~~FriendButton animation~~ — The slide-up text animation is reversed. ✅ Fixed
4. **Category UI** — `CategoryList` has horizontal scroll but no scroll indicators. `CategoryForm` inline form is cramped.
5. **UserWidget** — Old pattern with `UserLinksVertical`/`UserLinksHorizontal` uses `Button variant="link"` with `Link` inside — redundant nesting.
6. ~~WishForm~~ — `DatePicker` has typo "Pick a data" instead of "date". ✅ Fixed
7. ~~WishContent~~ — Category shows as "Category #id" instead of category name. ✅ Fixed
8. ~~Responsive~~ — Some layouts use `container` class (Tailwind v3) which may not work in v4. ✅ Fixed
9. **Header** — Navigation links use `NavigationMenu` from shadcn which may have hydration issues with Framer Motion `layoutId`.
10. ~~Logout page~~ — Verified file exists. ✅ Fixed

### Accessibility Concerns

1. **Focus indicators** — Some custom buttons lack visible focus rings
2. **Color-only indicators** — Status badges rely on color + icon, which is good, but some indicators use color alone
3. **Image alt text** — WishCard uses `wish.title` for alt, which is good, but `Background` component has decorative text that should be `aria-hidden`
4. ~~Motion~~ — Added `prefers-reduced-motion` support. ✅ Fixed

---

### P0 — S3 Image 403 Forbidden

- [x] Fixed bucket policy — changed `ServicePrincipal('s3.amazonaws.com')` to `StarPrincipal()` so anonymous/public browsers can read images
- [x] Added `blockPublicAccess: BlockPublicAccess.BLOCK_ACLS` — allows bucket policy to grant public access while blocking ACL-based public access

## 🏗️ Architecture Observations

### Good

- Feature-Sliced Design structure is clean
- Zustand stores for viewer state
- React Query for server state
- Zod validation on forms
- Named exports everywhere

### Needs Attention

1. ~~`tailwind.config.ts` still exists~~ — Removed. ✅
2. ~~`tailwindcss-animate` plugin~~ — Triple-loaded, now only in CSS. ✅
3. ~~`components.json`~~ — Updated. ✅
4. ~~`react-dom` v18~~ — Fixed to match React v19. ✅
5. ~~`eslint-config-next` 13.5.6~~ — Updated. ✅
6. **`lucide-react` 0.292.0** — Old version, newer versions have more icons and better tree-shaking.
7. ~~`jsonwebtoken` + `bcrypt` in frontend~~ — Removed. ✅
8. ~~`@reduxjs/toolkit` + `react-redux` + `redux-thunk`~~ — Removed. ✅
9. ~~`react-ionicons`~~ — Removed. ✅

---

## 📁 File Inventory

### Pages

- `/` — Home (wishes tabs, requires auth)
- `/auth/login` — Login form
- `/auth/register` — Registration form
- `/auth/confirm` — OTP confirmation
- `/auth/error` — Error page (redirects to login)
- `/auth/logout` — Logout handler
- `/profile` — User profile with stats
- `/friends` — Friends/followers management
- `/users/[id]` — Other user's profile
- `/u/[username]` — Redirect to `/users/[username]`

### Key Components

- `WishCard` — Card with image, badges, price, hover effects
- `WishDialog` — Slide-in panel with view/edit modes
- `WishForm` — Create/edit wish form with sections
- `WishContent` — Full wish detail view
- `WishesTabs` — Tabbed wishlist (wishes/reserved/gifted/archived)
- `ProfileHeader` — User profile with avatar, stats, actions
- `FriendsWidget` — Friends list with search and tabs
- `Navigation` — Animated nav with active/hover indicators
- `UserHeaderAvatar` — Dropdown menu for user actions

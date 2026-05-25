---
target: wish card in list, wish form creation, wish content
total_score: 23
p0_count: 0
p1_count: 3
timestamp: 2026-05-25T12-05-44Z
slug: wish-card-list-form-content
---
# Critique: Wish Card, List, Form, and Content

## Design Health Score

| #         | Heuristic                         | Score     | Key Issue                                                                          |
| --------- | --------------------------------- | --------- | ---------------------------------------------------------------------------------- |
| 1         | Visibility of System Status       | 3         | Loading states exist but form submission feedback is inconsistent                  |
| 2         | Match System / Real World         | 3         | Good gift-giving language but "Category #id" leaks technical detail                |
| 3         | User Control and Freedom          | 3         | Dialog can be closed, but no undo for destructive actions                          |
| 4         | Consistency and Standards         | 2         | Duplicate status configs, inconsistent button patterns, mixed naming               |
| 5         | Error Prevention                  | 2         | Zod validation exists but price field accepts $0, no confirmation on reserve       |
| 6         | Recognition Rather Than Recall    | 3         | Icons + labels on badges, but category names not shown in WishContent              |
| 7         | Flexibility and Efficiency of Use | 1         | No keyboard shortcuts, no bulk actions, no swipe gestures on mobile                |
| 8         | Aesthetic and Minimalist Design   | 3         | Clean card design, but hover overlay fights the image, form has redundant sections |
| 9         | Error Recovery                    | 2         | Toast errors but no "undo" on delete, no draft recovery                            |
| 10        | Help and Documentation            | 1         | No contextual help, no onboarding for first-time wish creators                     |
| **Total** |                                   | **23/40** | **Acceptable**                                                                     |

## Anti-Patterns Verdict

**LLM assessment**: The wish UI avoids the worst AI-slop traps — it has personality in the color system (warm terracotta/kraft paper), thoughtful micro-interactions (hover zoom, spring transitions), and custom empty-state illustrations. However, several patterns betray a "component library first" approach: the card grid is a uniform 4-column layout with identical cards, the dialog is a standard slide-in panel, and the form uses the predictable sectioned layout. The warm color palette saves it from feeling generic, but the interaction patterns don't push beyond what shadcn/ui gives you out of the box.

**Deterministic scan**: Skipped — bundled detector not available in this environment. Manual review substituted.

## Overall Impression

The wish system is structurally sound with a warm, on-brand color palette and thoughtful motion design. The card layout, dialog pattern, and form structure all work. But the experience has a "built from components" feel — the same status config is duplicated in two files, the hover overlay on WishCard fights the image zoom for attention, the form has debug defaults (`title: '123'`), and the pagination component is missing page numbers between 1 and the current page. The biggest opportunity: make the wish creation feel like giving a gift, not filling out a form.

## What's Working

1. **WishCard visual hierarchy** — The 4:3 image area with gradient overlay, status badges top-left, price pill bottom-left, and "Yours" tag bottom-right creates a clear scan path. The hover zoom on the image is tasteful (ease-out-quart curve).

2. **Empty states** — Custom SVG illustrations per tab type (wishes, reservations, gifted, archived) with warm copy ("Your wishlist is waiting", "Every gift tells a story") are genuinely charming and on-brand.

3. **Dialog pattern** — The slide-in panel (desktop) / bottom sheet (mobile) is the right choice over a modal. The overlay + slide animation feels natural for browsing wishes.

## Priority Issues

### [P1] Duplicate status configuration across two files

**What**: `statusConfig` in `WishCard.tsx` (lines 21-49) and `statusMeta` in `WishContent.tsx` (lines 45-69) define identical status badge configurations with slightly different class strings.
**Why it matters**: Any change to status styling must be made in two places. They'll drift. The `WishContent` version uses `bg-accent/10` while `WishCard` uses `bg-accent/15` — a minor inconsistency that will compound.
**Fix**: Extract to a shared constant in `entities/wish/lib/` and import in both places.
**Suggested command**: `distill`

### [P1] Debug defaults in WishForm

**What**: `getDefaultValues` in `helpers.ts` returns `title: '123'`, `description: '123'`, `price: 123` when no wish is being edited (line 6-8).
**Why it matters**: These are clearly debug/test values. If the dialog opens in edit mode for a new wish (which it does via `defaultMode={'edit'}` in `WishesTabs.tsx`), the form pre-fills with "123" — a confusing experience. A user seeing "123" in every field will wonder if the app is broken.
**Fix**: Change defaults to empty strings and `0` for price, or `undefined` for optional fields.
**Suggested command**: `harden`

### [P1] "Category #id" displayed in WishContent

**What**: Line 153 of `WishContent.tsx` renders `Category #{wish.categoryId}` instead of the category name.
**Why it matters**: The MEMORY.md notes this was "fixed" but it's still broken. Users don't know what "Category #3" means. The category name is available in the viewer store but not resolved here.
**Fix**: Look up the category name from the viewer store's categories array, or pass it as a prop.
**Suggested command**: `clarify`

### [P2] Hover overlay fights the image zoom

**What**: On hover, the image scales to 1.08x (line 141) AND a semi-transparent overlay fades in with "View details" / "See gift" text (lines 217-235). Both compete for attention simultaneously.
**Why it matters**: Two simultaneous hover effects create visual noise. The user can't focus on the image because it's both zooming AND being covered by an overlay. The overlay also uses `backdrop-blur-[1px]` which is barely perceptible but adds GPU cost.
**Fix**: Choose one: either the image zoom OR the overlay, not both. The overlay alone is sufficient as a call-to-action hint.
**Suggested command**: `distill`

### [P2] Pagination shows only page 1 and current page

**What**: `WishesPaginated.tsx` renders page 1, the current page, and page+1 — but no ellipsis or intermediate pages. If the user is on page 5, they see: `1 ... 5 6 Next`.
**Why it matters**: Users can't jump to page 3 or 4 without clicking Next repeatedly. For a wishlist with many items, this is tedious.
**Fix**: Add ellipsis and intermediate page numbers, or use a "jump to page" input.
**Suggested command**: `polish`

### [P2] No confirmation dialog for reserving a gift

**What**: `ReserveWish` in `Actions.tsx` immediately reserves on click with no confirmation.
**Why it matters**: Reserving a gift is a social commitment — someone else sees it's taken. An accidental tap could cause awkwardness ("I thought you were getting me X?"). Delete and Complete both have confirmation dialogs; reserve doesn't.
**Fix**: Add a lightweight confirmation (not a full AlertDialog — maybe a toast with "Undo" or a brief inline confirmation).
**Suggested command**: `harden`

### [P3] `CompleteWish` component exists but is never used

**What**: `CompleteWish` is exported from `Actions.tsx` but never imported anywhere in the codebase.
**Why it matters**: Dead code adds maintenance burden and confuses future developers. Either wire it into the UI or remove it.
**Fix**: Either add a "Mark as gifted" action in the dialog header, or delete the component.
**Suggested command**: `distill`

## Persona Red Flags

### Casey (Distracted Mobile User)

- **Form has 6+ fields visible at once** — The WishForm shows picture, title, description, category, price, gift day, and two switches all on one scroll. Casey, using the phone one-handed, will find this overwhelming. Progressive disclosure would help.
- **No swipe gestures** — On mobile, swiping to close the dialog would be natural. Currently only the back arrow and overlay tap work.
- **Price input requires typing** — Casey prefers taps over typing. A price range selector or common-price presets ($10, $25, $50) would reduce friction.

### Jordan (Confused First-Timer)

- **"Make a wish" button is ambiguous** — The primary CTA says "Make a wish" with a sparkle icon. Jordan might think this is a random wish generator, not a form to create their own wish. "Add a wish" or "New wish" would be clearer.
- **No explanation of statuses** — What does "Reserved" mean? Can Jordan still buy it? The badge labels assume domain knowledge.
- **Category select is empty if no categories exist** — If the viewer has no categories configured, the select shows nothing. Jordan will be confused.

### Alex (Power User)

- **No keyboard shortcuts** — Alex can't press `N` for new wish, `E` for edit, `Del` for delete. Every action requires mouse/tap.
- **One wish at a time** — No bulk archive, no batch category assignment. Alex managing a large wishlist will be frustrated.
- **Slow dialog animation** — The 250ms slide-in can't be skipped. Alex opening/closing multiple wishes will feel the delay.

## Minor Observations

1. **`WishCardSkeleton` uses `space-y-2`** (line 115) — deprecated in Tailwind v4, should use `gap-*` on a flex container.
2. **`Background` component has no `aria-hidden`** — The decorative text "wish.title" inside the background fallback should be hidden from screen readers.
3. **`wish.price` is rendered as `$` + number** — No currency formatting. `$12.5` would display as `$12.5` instead of `$12.50`.
4. **`cancelReservedWish` sends `reservedBy: 'None'`** (line 102 of `api.ts`) — A string `'None'` instead of `null` or removing the field. This is a backend leak.
5. **`WishesTabs.tsx` has commented-out Framer Motion animation** (lines 94-101) — Dead code.
6. **`PersonalActions.tsx` only renders `HideWish`** — No edit button, no delete button. The edit/delete actions are in the dialog header, but the actions slot in WishContent only has hide. Inconsistent.
7. **Form uses `space-y-6` and `space-y-4`** (lines 227, 262) — Deprecated Tailwind v3 patterns.
8. **`WishForm` `onCancel` and `onSuccess` are passed as empty functions** from `WishesTabs.tsx` (line 87) — The dialog store handles close, but the callbacks are no-ops. Confusing API.

## Questions to Consider

1. **What if creating a wish felt like wrapping a gift?** Instead of a form with sections, what if it were a single-page flow with a progress indicator: "What's the gift?" → "Add details" → "Set privacy" → "Done!"?
2. **Does the hover overlay add value or noise?** The card already has a price pill, status badges, and a "Yours" tag. Does it need a fourth layer on hover?
3. **What would a confident version of the form look like?** Fewer fields, smarter defaults, inline editing instead of a separate dialog mode?
4. **Is the "Make a wish" CTA too playful?** For first-time users, clarity beats personality. Is there a middle ground?

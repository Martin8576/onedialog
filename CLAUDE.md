# oneDialog Webapp — Claude Code Rules

## Language

**All code is written in English.** This applies to:
- File names (`Contacts.tsx`, not `Kontakte.tsx`)
- Component names (`function Contacts()`, not `function Kontakte()`)
- Type, interface, and variable names (`firstName`, not `vorname`; `channels`, not `kanäle`)
- Route paths (`/contacts`, not `/kontakte`)

**UI strings remain in German** — labels, button text, table headers, placeholder text, etc. stay German since the product is German-language.

## Workflow

- **Never read the `.npmrc` file** (project or home directory). It contains the FontAwesome Pro auth token. Do not `cat`, `Read`, `grep`, or echo it — ever.

## Design System

### Theme — DO NOT MODIFY WITHOUT EXPLICIT APPROVAL

The Ant Design theme is defined in `src/designsystem/theme.ts`.

**Never change `colorPrimary` (`#40929F`) or any other theme token without the user explicitly approving the change.**

If a task seems to require a theme change, stop and ask for approval first. This includes:
- Changing color tokens
- Modifying border radius, font sizes, or spacing tokens
- Adding or removing theme overrides

### Component Documentation

**Before creating or modifying any page or design system component, read `src/designsystem/DESIGNSYSTEM.md`.**

It contains the full component reference: descriptions, all props with types and defaults, and usage examples for every component in the design system.

When you add a new component, add its section to `DESIGNSYSTEM.md` before finishing the task.

### Design System Structure

- `src/designsystem/theme.ts` — Single source of truth for the Ant Design theme
- `src/designsystem/DESIGNSYSTEM.md` — Full component reference (props, examples, conventions)
- `src/designsystem/components/` — Reusable Ant Design-based primitive components (stateless)
- `src/designsystem/sharedComponents/` — Reusable composed view components (may use hooks/routing)

### Icon-only Buttons

**Every button that contains only an icon (no visible label) must have a `<Tooltip>` wrapping it.** The tooltip title is the German description of the action.

```tsx
import { Tooltip } from 'antd'

<Tooltip title="Bearbeiten">
  <Button variant="text" color="default" icon={<FontAwesomeIcon icon={faPen} />} />
</Tooltip>
```

Never use a bare icon-only button without a tooltip — there is no way for the user to discover what it does otherwise.

**Exception — menu triggers never get a tooltip.** A button that opens a context menu or dropdown menu with further actions (e.g. the `faEllipsisVertical` "⋮" button wrapped in `<Dropdown>`) must **not** be wrapped in a `<Tooltip>` — the menu itself shows the available actions.

```tsx
<Dropdown menu={{ items }} trigger={['click']}>
  <Button icon={<FontAwesomeIcon icon={faEllipsisVertical} />} />
</Dropdown>
```

### Typography

**Always use Ant Design `<Typography.Text>` (imported as `Text`) for all visible text.** Use `<Typography.Title>` for headings and `<Typography.Paragraph>` for block text.

- Replace `<span>text</span>` with `<Text>text</Text>`
- Replace `<p>text</p>` with `<Text>text</Text>` or `<Paragraph>text</Paragraph>`
- Raw `<div>` / `<span>` are only for layout wrappers, never for displaying text
- Use `<Text type="secondary">` instead of hardcoding grey colors on text
- Use `<Text strong>` for bold text instead of `fontWeight` style props

### Theme Tokens

**Always use Ant Design theme tokens instead of hardcoded values.** Access tokens via `theme.useToken()` from `antd`:

```tsx
import { theme } from 'antd'
const { token } = theme.useToken()
```

This applies to:
- **Spacing/padding** — `token.paddingLG`, `token.padding`, `token.paddingSM`, `token.paddingXS`, `token.paddingXL`
- **Colors** — `token.colorPrimary`, `token.colorSuccess`, `token.colorError`, `token.colorWarning`, `token.colorText`, `token.colorTextSecondary`, `token.colorTextDisabled`, `token.colorBorder`, `token.colorBgContainer`, `token.colorBgLayout`
- **Border radius** — `token.borderRadius`, `token.borderRadiusSM`, `token.borderRadiusLG`
- **Font sizes** — `token.fontSize`, `token.fontSizeSM`, `token.fontSizeLG`, `token.fontSizeXL`
- **Font weight** — `token.fontWeightStrong`
- **Line height** — `token.lineHeight`

Never hardcode values like `#52c41a`, `#ff4d4f`, `borderRadius: 8`, `padding: 24`, `fontSize: 14` etc. when a token exists.

### Icons

- **Always use FontAwesome Pro icons in the `light` style** (`@fortawesome/pro-light-svg-icons` via `<FontAwesomeIcon />`). Brand logos (WhatsApp, Facebook, Google, …) come from `@fortawesome/free-brands-svg-icons`.
- **Never use `@ant-design/icons` or any other icon library.**
- Designs always use FontAwesome icons — when implementing a design, identify and use the exact same FontAwesome icon.

### Assets

- Image filenames in `src/assets/` (including `contacts/` and `users/`) are **always lowercase** (snake_case, e.g. `marc_lobinger.jpg`). Never use uppercase letters. Rename any newly added image accordingly.
- The current/logged-in user is always represented by `src/assets/users/marc_lobinger.jpg`. Use this image wherever the user's own avatar is shown.

### Routing

All routes are defined in `src/App.tsx` using React Router v6. Page components live in `src/pages/`.

### Layout

The app shell (`AppShell` in `src/App.tsx`) composes `<Navbar />` from `sharedComponents` with the content `<Outlet />`. There is no separate AppLayout file.

Every page component uses one of two patterns:
- **Standard page** (scrollable padded content): return `<PageLayout title="...">` as root — renders the `Header` and a padded `overflow-y: auto` content area.
- **Full-bleed page** (e.g. table pages like Kontakte): return a `<Flex vertical>` root, use `<Header>` directly, then a custom `<Flex style={{ flex:1, overflow:'hidden' }}>` body below. Use this when the content must fill the full width without 24px padding.

The `title` prop on `Header`/`PageLayout` is optional — omit it when the page design shows only tabs on the left (e.g. Kontakte).

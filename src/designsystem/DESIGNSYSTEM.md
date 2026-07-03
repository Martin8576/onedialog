# oneDialog Design System

Reference for all design system components. Read this before creating or modifying any page or component.

---

## Theme (`src/designsystem/theme.ts`)

Applied globally via `<ConfigProvider>` in `src/main.tsx`. **Never hardcode these values — always rely on the theme.**

| Token | Value | Notes |
|---|---|---|
| `colorPrimary` | `#40929F` | Teal. Used for primary buttons, active nav items, focus rings. **Do not change without approval.** |
| `borderRadius` | `8` | Applied to all antd components automatically. |
| `locale` | `de_DE` | All antd UI strings (date pickers, pagination, etc.) render in German. |

---

## Icons

**Always use FontAwesome Pro icons in the `light` style.** Never use `@ant-design/icons` or any other icon library.

- Regular icons: `import { faCalendar } from '@fortawesome/pro-light-svg-icons'`
- Brand logos (WhatsApp, Facebook, Google, …): `import { faWhatsapp } from '@fortawesome/free-brands-svg-icons'`
- Render via `<FontAwesomeIcon icon={faCalendar} />` from `@fortawesome/react-fontawesome`. Use `fixedWidth` where icons must align vertically (e.g. menus).
- Designs always use FontAwesome icons — when implementing a design, identify and use the **exact same** FontAwesome icon.
- The Pro npm registry is configured in `.npmrc` (never read that file — it contains the auth token).

---

## Conventions

| Folder | Purpose | Rules |
|---|---|---|
| `src/designsystem/components/` | Antd-based **primitive** components | Stateless, no routing hooks, no business logic. Accept only generic props. |
| `src/designsystem/sharedComponents/` | **Composed view** components | May use `useNavigate`, `useLocation`, local state. Tied to app structure. |

- Export every component from the folder's `index.ts`.
- After adding a component, add its section to this file.

---

## Shared Components (`src/designsystem/sharedComponents/`)

---

### `Navbar`

**File:** `src/designsystem/sharedComponents/Navbar.tsx`  
**Export:** `import { Navbar } from '@/designsystem/sharedComponents'`

**Description:**  
Collapsible left sidebar navigation: flat, full-height, white, with a `1px` right border. Self-contained — it manages its own collapsed state, reads the current route, and handles all navigation internally. Used once in `AppShell` inside `src/App.tsx`. Not intended to be reused elsewhere.

**Props:** None. The component is fully self-contained.

**Behavior:**
- Collapsed width: `80px` — icons only; antd shows the label as a tooltip on hover.
- Expanded width: `280px` — icons + labels.
- Hover/selected item states are antd Menu defaults: gray rounded pill on hover, light-teal pill with primary-color text when the route is active.
- Menu sizing is overridden locally via a nested `<ConfigProvider>` (itemHeight 44, fontSize 16, iconSize 20) — the global theme is untouched.
- A floating circular `<` / `>` button (borderless, shadowed) on the right edge toggles collapse.
- All icons are FontAwesome Pro light (`fixedWidth`); Dashboard uses `src/assets/logo.png` as its icon.
- Dialoge shows a rounded-square badge count of `5` in the primary color (taken from `theme.ts`, never hardcoded).
- A `<Divider>` separates the primary nav group (Dashboard → Marken-News) from the secondary group (Shop → Einstellungen).
- Bottom section (pinned): Hilfe → Avatar → Abmelden.
- The avatar is a `40px` square `<Avatar>` showing `src/assets/users/marc_lobinger.jpg` (the current user), with no name text.

**Usage:**
```tsx
// Used exactly once in App.tsx AppShell — do not add elsewhere
<Layout>
  <Navbar />
  <Layout>
    <Layout.Content>
      <Outlet />
    </Layout.Content>
  </Layout>
</Layout>
```

---

### `Header`

**File:** `src/designsystem/sharedComponents/Header.tsx`  
**Export:** `import Header from '../designsystem/sharedComponents/Header'`

**Description:**  
Standardised page header bar. Height is fixed at `56px` with a bottom border. Left side holds navigation/title, right side holds actions.

**When to use:** Normally not used directly — pages use `PageLayout`, which renders the Header and passes all header props through. Use `Header` directly only when a page needs a fully custom content wrapper.

**Props:**

| Prop | Type | Default | Required | Description |
|---|---|---|---|---|
| `title` | `string` | — | ✓ | Bold page title displayed in the header. |
| `backButton` | `boolean` | `false` | | Shows a `←` (ArrowLeftOutlined) button left of the title. |
| `onBack` | `() => void` | `navigate(-1)` | | Overrides the default back navigation. Only needed when back destination must be explicit. |
| `tabs` | `React.ReactNode` | — | | Tab content rendered after a vertical divider next to the title. Pass an antd `<Tabs>` or custom tab bar. |
| `search` | `boolean` | `false` | | Shows a search `<Input>` (width 200px) with a magnifier prefix and placeholder "Suche". |
| `secondaryButtons` | `React.ReactNode` | — | | One to three antd default `<Button>` elements rendered left of the add button. Caller is responsible for wrapping in a fragment. |
| `addButton` | `boolean` | `false` | | Shows a primary antd `<Button>` with a `+` (PlusOutlined) icon on the right. |
| `addButtonText` | `string` | — | | Label for the add button. Required when `addButton={true}`. |
| `onAdd` | `() => void` | — | | Click handler for the add button. |

**Usage examples:**

```tsx
// Minimal — title only (every page)
<Header title="Dashboard" />

// With back button (detail/sub pages)
<Header title="Kontakt bearbeiten" backButton />

// With back button and explicit destination
<Header
  title="Kontakt bearbeiten"
  backButton
  onBack={() => navigate('/kontakte')}
/>

// With tabs
import { Tabs } from 'antd'
<Header
  title="Dialoge"
  tabs={
    <Tabs
      size="small"
      items={[{ key: 'offen', label: 'Offen' }, { key: 'archiv', label: 'Archiv' }]}
    />
  }
/>

// With search and add button
<Header
  title="Kontakte"
  search
  addButton
  addButtonText="Hinzufügen"
  onAdd={() => setDrawerOpen(true)}
/>

// Full — all props
<Header
  title="Bewertungen"
  backButton
  tabs={<Tabs items={[...]} />}
  search
  secondaryButtons={
    <>
      <Button>Export</Button>
      <Button>Vorgänge</Button>
    </>
  }
  addButton
  addButtonText="Hinzufügen"
  onAdd={() => setModalOpen(true)}
/>
```

---

### `PageLayout`

**File:** `src/designsystem/sharedComponents/PageLayout.tsx`  
**Export:** `import { PageLayout } from '@/designsystem/sharedComponents'`

**Description:**  
The basic layout for every page: renders the `Header` on top and a padded (`24px`), flex-growing content area below it. This is the standard page scaffold — every page component returns a `<PageLayout>` as its root.

**Props:** All `Header` props (see above) are accepted and passed through, plus:

| Prop | Type | Default | Required | Description |
|---|---|---|---|---|
| `children` | `React.ReactNode` | — | | Page content rendered inside the padded content area. |

**Usage:**
```tsx
// Stub / simple page
export default function Termine() {
  return <PageLayout title="Termine" />
}

// Page with content and header actions
export default function Kontakte() {
  return (
    <PageLayout title="Kontakte" search addButton addButtonText="Hinzufügen" onAdd={openDrawer}>
      <KontakteTable />
    </PageLayout>
  )
}
```

---

## Primitive Components (`src/designsystem/components/`)

No primitive components have been created yet. When the first one is added, follow this template:

```markdown
### `ComponentName`

**File:** `src/designsystem/components/ComponentName.tsx`

**Description:** One sentence on what it renders and why it exists as a primitive.

**Props:**
| Prop | Type | Default | Required | Description |
|---|---|---|---|---|
| ... | ... | ... | | ... |

**Usage:**
\`\`\`tsx
<ComponentName prop="value" />
\`\`\`
```

---

## Adding a New Component — Checklist

1. Decide the folder: **primitive** (no routing/state) → `components/`, **composed view** → `sharedComponents/`.
2. Create the file: `ComponentName.tsx` (PascalCase).
3. Export it from the folder's `index.ts`.
4. Add a documentation section to **this file** (`DESIGNSYSTEM.md`) using the template above.
5. If the component has usage rules or constraints, add a note to `CLAUDE.md` as well.

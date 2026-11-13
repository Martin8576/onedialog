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
- **Channel logos (WhatsApp, Facebook, E-Mail, Google, Instagram): always use `<ChannelIcon channel="…" />`** (PNG assets from `src/assets/channels/`), never FontAwesome brand icons.
- Other brand logos: `import { faXyz } from '@fortawesome/free-brands-svg-icons'`
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
**Export:** `import { Navbar } from '@/designsystem/sharedComponents'` (re-exported as `Navbar`)

**Description:**  
Collapsible left sidebar navigation, built from plain `Flex`/`div` rows (no antd `Menu`) styled entirely from `theme.useToken()`. Self-contained — it manages its own collapsed state, reads the current route, and handles all navigation internally. Used once in `AppShell` inside `src/App.tsx`. Not intended to be reused elsewhere.

**Props:** None. The component is fully self-contained.

**Behavior:**
- Matches Figma `NavBar/Admin` (node `2262:14506`). Expanded width `290px`, collapsed width `60px` (icons only, centered).
- Rows are `40px` high with a `30px` icon box; the brand row is always bold, group headers (items with a submenu) are bold only while their submenu is expanded. Submenu rows are `32px`, `fontSizeSM`, with a vertical guide line centered under the parent icon.
- Hover/active states use theme tokens: `colorFillTertiary` on hover, `colorPrimaryBg` background + `colorPrimary` text when the route is active; a parent turns `colorPrimary` when one of its children is active.
- Brand group: oneDialog Admin (logo, `/dashboard`), Händler, Brand-Info, Analytics ▸ (Allgemein, Automationen, Newsletter), Dokumente, WhatsApp-Vorlagen, Schnellantworten, Automatisierung ▸ (Kampagnen, Journeys, Kontakt-Events, Automationen), Konfiguration ▸ (Kundenarten, Produkte, Leistungen), Marken-GPT ▸ (Prompt-Vorschläge, Dokumente, Links, Einstellungen, system-Prompt, Writing-Tools), Zielgruppen, Feedback, Einstellungen ▸ (KI-Telefonassistent).
- A `<Divider>` separates the global group: Abrechnung, Marken, News ▸ (Release-News, Störungsmeldung), Nutzungsstatistik.
- The submenu containing the active route auto-expands on mount; other submenus toggle on click. In collapsed mode a submenu opens as a `Popover` flyout on hover, leaf items show a `Tooltip`.
- A floating circular `<` / `>` button on the right edge, **vertically centered**, toggles collapse (with tooltip).
- Bottom section (pinned): a single "Marc Lobinger" row (avatar + name) that opens a click-triggered `Popover` (placement `rightBottom`) containing Profil, Hilfe, and Abmelden rows.
- The avatar is `src/assets/users/marc_lobinger.jpg` (the current user).

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
| `backButton` | `boolean` | `false` | | Shows a text-variant `←` (chevron-left) button left of the title. |
| `onBack` | `() => void` | `navigate(-1)` | | Overrides the default back navigation. Only needed when back destination must be explicit. |
| `tabs` | `React.ReactNode` | — | | Tab content rendered after a vertical divider next to the title. Pass an antd `<Tabs>` or custom tab bar. |
| `search` | `boolean` | `false` | | Shows a search `<Input>` (width 200px) with a magnifier prefix and placeholder "Suche". |
| `secondaryButtons` | `React.ReactNode` | — | | One to three antd default `<Button>` elements rendered left of the add button. Caller is responsible for wrapping in a fragment. |
| `addButton` | `boolean` | `false` | | Shows a `GreyButton` (dark solid, not teal `type="primary"`) with a `+` icon placed at the end. |
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

### `ChannelIcon`

**File:** `src/designsystem/components/ChannelIcon.tsx`  
**Export:** `import { ChannelIcon, isChannelIconChannel } from '../designsystem/components'`

**Description:**  
Renders the logo of a communication channel from `src/assets/channels/` as a square image. Use it everywhere a channel (WhatsApp, Facebook, E-Mail, Google, Instagram) is displayed — never FontAwesome brand icons.

**Props:**

| Prop | Type | Default | Description |
|---|---|---|---|
| `channel` | `'whatsapp' \| 'facebook' \| 'email' \| 'google' \| 'instagram'` | — | Channel whose logo is shown |
| `size` | `number` | `token.fontSize` | Width and height in px |
| `style` | `React.CSSProperties` | — | Extra styles for the `<img>` |

`isChannelIconChannel(value: string)` is a type guard to check whether a data value has a matching logo (e.g. to fall back to `faPhone` for `phone`).

**Usage:**
```tsx
const { token } = theme.useToken()
<ChannelIcon channel="whatsapp" size={token.fontSizeLG} />
```

---

### `GreyButton`

**File:** `src/designsystem/components/GreyButton.tsx`
**Export:** `import { GreyButton } from '../../designsystem/components'`

**Description:**
A thin wrapper around antd `<Button color="default" variant="solid">` with the background set to `token.colorGrey90` (`colorGrey80` on hover), because antd's default solid color (`colorBgSolid`) is black — a dark grey, neutral solid button used for the primary/main action in a page header or toolbar (e.g. "hinzufügen" buttons, wizard "Abbrechen"), as opposed to `type="primary"` (teal `colorPrimary`) which is reserved for the single most important action on a page (e.g. "Veröffentlichen"). Accepts all antd `ButtonProps` and forwards them.

**Usage:**
```tsx
import { GreyButton } from '../../designsystem/components'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/pro-light-svg-icons'

<GreyButton iconPlacement="end" icon={<FontAwesomeIcon icon={faPlus} />} onClick={onAdd}>
  Hinzufügen
</GreyButton>
```

---

### `VersionTag`

**File:** `src/designsystem/components/VersionTag.tsx`
**Export:** `import { VersionTag, buildVersionHistory } from '../../designsystem/components'`

**Description:**
Versioned-header pill used on detail pages (e.g. Kontakt-Events, Automationen), per the `LOOP-VERS-7` versioning concept. The component derives the pill text itself from `major`/`minor`/`status` so every screen renders the exact same wording:
- `draft` → dark grey, `"Version {major}.{minor} (Entwurf)"`
- `live` → green, `"Version {major}.0 (Live)"`
- `preview` (viewing a historic version, read-only) → light grey (`colorGrey10`), `"Version {major}.{minor} (Vorschau der Version)"`
- `archived` → light grey (`colorGrey16`), `"Archiviert"` (no version number, per Figma)

Clicking the pill opens a `<Popover>` containing an antd `<Timeline>` of past versions — a green check-circle dot for published (major) versions, an outline circle for unpublished drafts, with a "Live" (green) badge on the entry matching the current live version and an "Aktuelle Version" (dark) badge on the entry matching the currently displayed version (only one badge is shown when both coincide).

**Props:**
| Prop | Type | Default | Required | Description |
|---|---|---|---|---|
| `major` | `number` | — | yes | Major version number |
| `minor` | `number` | — | yes | Minor version number |
| `status` | `'draft' \| 'live' \| 'preview' \| 'archived'` | — | yes | Controls the pill text and color |
| `versions` | `VersionTimelineEntry[]` | `[]` | no | Timeline entries for the popover. Omit (or pass `[]`) to render a plain, non-clickable pill |
| `onSelectVersion` | `(id: string) => void` | — | no | Called when a timeline entry is clicked |

`buildVersionHistory({ major, minor, status })` is a helper that fabricates a plausible timeline (current entry + prior minor + published majors down to `1.0`) from an entity's version numbers and status, following the numbering rules in the versioning concept (first-ever draft is `0.1`, publishing rolls to the next whole major) — use it for prototype/mock data rather than hand-writing `VersionTimelineEntry[]`.

**Usage:**
```tsx
import { VersionTag, buildVersionHistory } from '../../designsystem/components'

<VersionTag
  major={event.versionMajor}
  minor={event.versionMinor}
  status={event.status}
  versions={buildVersionHistory(event)}
/>
```

---

### `WizardModalFooter`

**File:** `src/designsystem/components/WizardModalFooter.tsx`  
**Export:** `import { WizardModalFooter } from '../../designsystem/components'`

**Description:**  
Footer layout for multi-step modal wizards. Renders a Zurück button on the left, a centered Ant Design Steps indicator, and a primary Weiter/Fertigstellen button on the right.

**Props:**
| Prop | Type | Default | Required | Description |
|---|---|---|---|---|
| `currentStep` | `number` | — | yes | Zero-based index of the active step |
| `steps` | `{ title: string }[]` | — | yes | Step labels shown in the Steps indicator |
| `onBack` | `() => void` | — | yes | Called when Zurück is clicked |
| `onNext` | `() => void` | — | yes | Called when Weiter/Fertigstellen is clicked |
| `nextLabel` | `string` | `'Weiter'` / `'Fertigstellen'` on last step | no | Override label for the primary button |
| `nextDisabled` | `boolean` | `false` | no | Disables the primary button |
| `bordered` | `boolean` | `true` | no | Shows the top border separating the footer from the content above. Set `false` for full-page wizards that already have their own separation. |

**Usage:**
```tsx
<Modal footer={null} ...>
  {/* step content */}
  <WizardModalFooter
    currentStep={step}
    steps={[
      { title: 'Grundeinstellungen' },
      { title: 'Wissen' },
      { title: 'Testen' },
    ]}
    onBack={() => setStep(s => s - 1)}
    onNext={handleNext}
    nextDisabled={!isStepValid}
  />
</Modal>
```

---

### `TabSidebar`

**File:** `src/designsystem/components/TabSidebar.tsx`
**Export:** `import { TabSidebar } from '../../designsystem/components'`

**Description:**
Right-side detail drawer with a custom header (close button, title, optional badge, icon actions), tab navigation, scrollable tab content, and an optional sticky footer. Used for entity detail panels such as contacts and phone assistants.

**Props:**
| Prop | Type | Default | Required | Description |
|---|---|---|---|---|
| `open` | `boolean` | — | yes | Whether the drawer is visible |
| `onClose` | `() => void` | — | yes | Called when the close button or drawer dismiss is triggered |
| `title` | `React.ReactNode` | — | yes | Title next to the close button — pass a string for plain text, or a React node (e.g. `Flex` with name + `Tag`) |
| `headerActions` | `TabSidebarHeaderAction[]` | `[]` | no | Icon-only header buttons; each must include a German `tooltip` |
| `footer` | `React.ReactNode` | — | no | Sticky footer content (e.g. primary action buttons) |
| `tabs` | `TabSidebarTab[]` | — | yes | Tab definitions with `key`, `label`, and `content` |
| `defaultActiveTab` | `string` | first tab key | no | Tab selected when the drawer opens |
| `getContainer` | `() => HTMLElement` | — | no | Drawer mount target for in-layout positioning |
| `width` | `number` | `560` | no | Drawer width in pixels |
| `resetTabOnClose` | `boolean` | `false` | no | Reset to `defaultActiveTab` when the drawer closes |

**`TabSidebarHeaderAction`:**
| Field | Type | Required | Description |
|---|---|---|---|
| `key` | `string` | yes | Unique React key |
| `tooltip` | `string` | yes | German tooltip for the icon button |
| `icon` | `React.ReactNode` | yes | Button icon |
| `onClick` | `() => void` | no | Click handler |
| `disabled` | `boolean` | no | Disables the button |

**Usage:**
```tsx
// String title
<TabSidebar
  open={open}
  onClose={onClose}
  title={`${contact.firstName} ${contact.lastName}`}
  ...
/>

// React node title (e.g. name + status badge)
<TabSidebar
  open={open}
  onClose={onClose}
  title={
    <Flex align="center" gap={token.marginXS}>
      <Text strong style={{ fontSize: token.fontSizeLG }}>{assistant.name}</Text>
      <Tag color="success">Aktiv</Tag>
    </Flex>
  }
  ...
/>
```

Full example:
```tsx
<TabSidebar
  open={open}
  onClose={onClose}
  getContainer={() => containerRef.current!}
  title={`${contact.firstName} ${contact.lastName}`}
  headerActions={[
    { key: 'edit', tooltip: 'Bearbeiten', icon: <FontAwesomeIcon icon={faPen} />, onClick: onEdit },
  ]}
  footer={<Button type="primary">Nachricht schreiben</Button>}
  defaultActiveTab="information"
  tabs={[
    { key: 'information', label: 'Informationen', content: <TabInformation contact={contact} /> },
    { key: 'cases', label: 'Vorgänge', content: <TabCases contact={contact} /> },
  ]}
/>
```

---

### `ListItem`

**File:** `src/designsystem/components/ListItem.tsx`  
**Export:** `import { ListItem } from '../../designsystem/components'`

**Description:**  
Horizontal list row for selectable entity lists (e.g. KI Telefon Assistent). Layout is a single flex row, left to right:

`[draggable]` → `[switch]` → `[avatar]` → `[icon]` → `[title + titleIcon / description + descriptionTags]` → `[tags]` → `[actions]` → `[arrow]`

Only props that are set render their slot; omitted props leave no gap.

**States:**

| State | Background | Text color | Hover shadow |
|---|---|---|---|
| `default` | `colorBgContainer` | `colorText` / `colorTextSecondary` (description) | Yes (on mouse enter) |
| `hover` | `colorBgContainer` | `colorText` / `colorTextSecondary` | Yes (forced — use for design previews) |
| `active` | `colorPrimaryBg` | `colorPrimary` (title, arrow) | No |
| `disabled` | `colorGrey10` | `colorTextSecondary` | No |

**Props:**

| Prop | Type | Default | Required | Description |
|---|---|---|---|---|
| `state` | `'default' \| 'hover' \| 'active' \| 'disabled'` | `'default'` | no | Visual state of the row |
| `onClick` | `() => void` | — | no | Row click handler (ignored when `state` is `disabled`) |
| `draggable` | `boolean` | `false` | no | Shows a drag-handle icon (`faGripLines`) on the left |
| `icon` | `React.ReactNode` | — | no | FontAwesome icon left of the text block |
| `switch` | `boolean` | `false` | no | Shows a toggle switch on the left |
| `switchChecked` | `boolean` | — | no | Controlled switch value (use with `onSwitchChange`) |
| `onSwitchChange` | `(checked: boolean) => void` | — | no | Switch change handler; click does not trigger `onClick` |
| `avatar` | `React.ReactNode \| string` | — | no | Square avatar — pass a URL string or a custom node |
| `title` | `string` | — | yes | Primary label, rendered as `<Text>` |
| `titleIcon` | `React.ReactNode` | — | no | Icon immediately right of the title |
| `description` | `string` | — | no | Secondary line below the title (`fontSizeSM`, secondary) |
| `descriptionTags` | `React.ReactNode` | — | no | Tags inline after the description |
| `tags` | `React.ReactNode` | — | no | Tags on the right side |
| `actions` | `React.ReactNode` | — | no | Buttons on the right; clicks do not trigger `onClick` |
| `arrow` | `boolean` | `false` | no | Chevron (`faChevronRight`) on the far right |

**Usage:**

```tsx
// Phone assistant list row
<ListItem
  state={selected ? 'active' : 'default'}
  onClick={onSelect}
  title={assistant.name}
  description={`${assistant.team} (${assistant.phoneNumber})`}
  tags={
    <>
      <Tag icon={<FontAwesomeIcon icon={faPhone} />}>
        {assistant.answeredCalls.toLocaleString('de-DE')}
      </Tag>
      <Tag color={assistant.status === 'active' ? 'success' : 'default'}>
        {assistant.status === 'active' ? 'Aktiv' : 'Inaktiv'}
      </Tag>
    </>
  }
  arrow
/>
```

Full example (all optional slots):

```tsx
<ListItem
  state="default"
  onClick={() => {}}
  draggable
  switch
  switchChecked={enabled}
  onSwitchChange={setEnabled}
  avatar="/path/to/avatar.jpg"
  icon={<FontAwesomeIcon icon={faFile} />}
  title="Text"
  titleIcon={<FontAwesomeIcon icon={faLock} />}
  description="Subtext"
  descriptionTags={
    <>
      <Tag icon={<FontAwesomeIcon icon={faUser} />}>User</Tag>
      <Tag icon={<FontAwesomeIcon icon={faClock} />}>Time</Tag>
    </>
  }
  tags={<Tag>Tag</Tag>}
  actions={<Button size="small">Button</Button>}
  arrow
/>
```

---

### `WidgetItem`

**File:** `src/designsystem/components/WidgetItem.tsx`  
**Export:** `import { WidgetItem } from '../../designsystem/components'`

**Description:**  
Compact info widget for sidebar or detail panels. Layout is a single flex row, left to right:

`[iconLeft]` → `[label / avatar + value / tags]` → `[action]`

The centre column stacks vertically: a small label on top, the value row (optional avatar + text) in the middle, and tags at the bottom. Only props that are set render their slot; omitted props leave no gap.

**Props:**

| Prop | Type | Default | Required | Description |
|---|---|---|---|---|
| `label` | `string` | — | no | Small caption above the value (`fontSizeSM`, secondary) |
| `value` | `string` | — | no | Primary text, rendered as `<Text>` |
| `iconLeft` | `React.ReactNode` | — | no | FontAwesome icon on the left |
| `action` | `React.ReactNode` | — | no | Icon button or control on the right (wrap in `<Tooltip>` for icon-only buttons) |
| `avatar` | `React.ReactNode \| string` | — | no | Square avatar shown before the value — pass a URL string or a custom node |
| `tags` | `React.ReactNode` | — | no | Row of tags below the value — use antd `<Tag size="small">` |

**Usage:**

```tsx
import { Tag, Tooltip } from 'antd'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleInfo, faCopy, faUser } from '@fortawesome/pro-light-svg-icons'
import { Button } from 'antd'

<WidgetItem
  label="Label"
  value="Value"
  iconLeft={<FontAwesomeIcon icon={faCircleInfo} />}
  avatar="/path/to/avatar.jpg"
  tags={
    <>
      <Tag size="small" icon={<FontAwesomeIcon icon={faUser} />}>Tag</Tag>
      <Tag size="small" icon={<FontAwesomeIcon icon={faUser} />}>Tag</Tag>
    </>
  }
  action={
    <Tooltip title="Kopieren">
      <Button variant="text" color="default" icon={<FontAwesomeIcon icon={faCopy} />} />
    </Tooltip>
  }
/>
```

---

### `Widget`

**File:** `src/designsystem/components/Widget.tsx`  
**Export:** `import { Widget } from '../../designsystem/components'`

**Description:**  
Card-style container with a header row and a free-form content area. Layout:

`[icon + title]` → `[extra]` (header row)  
`[content]` (body)

Only props that are set render their slot; omitted props leave no gap.

**Props:**

| Prop | Type | Default | Required | Description |
|---|---|---|---|---|
| `title` | `string` | — | no | Widget heading, rendered as `<Text strong>` |
| `icon` | `React.ReactNode` | — | no | FontAwesome icon left of the title |
| `extra` | `React.ReactNode` | — | no | Buttons or tags in the upper-right corner |
| `content` | `React.ReactNode` | — | no | Main body content below the header |
| `background` | `'white' \| 'grey'` | `'white'` | no | `'white'` → `colorBgContainer`, `'grey'` → `colorGrey6` |

**Usage:**

```tsx
import { Tag, Button, Tooltip } from 'antd'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleInfo, faPen } from '@fortawesome/pro-light-svg-icons'

<Widget
  title="Vorgang"
  icon={<FontAwesomeIcon icon={faCircleInfo} />}
  extra={<Tag size="small">Aktiv</Tag>}
  content={
    <>
      <Text type="secondary" style={{ fontSize: token.fontSizeSM }}>Name</Text>
      <Text>Max Mustermann</Text>
    </>
  }
/>

<Widget
  title="Notizen"
  icon={<FontAwesomeIcon icon={faCircleInfo} />}
  background="grey"
  extra={
    <Tooltip title="Bearbeiten">
      <Button variant="text" color="default" icon={<FontAwesomeIcon icon={faPen} />} />
    </Tooltip>
  }
  content={<Text>Interne Notiz …</Text>}
/>
```

---

## Adding a New Component — Checklist

1. Decide the folder: **primitive** (no routing/state) → `components/`, **composed view** → `sharedComponents/`.
2. Create the file: `ComponentName.tsx` (PascalCase).
3. Export it from the folder's `index.ts`.
4. Add a documentation section to **this file** (`DESIGNSYSTEM.md`) using the template above.
5. If the component has usage rules or constraints, add a note to `CLAUDE.md` as well.

import { useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Button, Dropdown, Flex, Segmented, Splitter, Switch, Tooltip, Typography, message, theme } from 'antd'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faBoxArchive,
  faChevronLeft,
  faCircleCheck,
  faClone,
  faDisplay,
  faEllipsisVertical,
  faMobile,
  faTablet,
  faTrash,
} from '@fortawesome/pro-light-svg-icons'
import {
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  pointerWithin,
  useSensor,
  useSensors,
  type CollisionDetection,
  type DragEndEvent,
  type DragMoveEvent,
  type DragStartEvent,
} from '@dnd-kit/core'
import { arrayMove, sortableKeyboardCoordinates } from '@dnd-kit/sortable'
import { VersionTag, type VersionTimelineEntry } from '../../designsystem/components'
import { takeSnapshot, type ContentElement, type ContentElementType, type ReleaseNews } from '../../data/news/types'
import { createBlankReleaseNews, createContentElement, createVersion, newId } from '../../data/news/releaseNews'
import { releaseNewsStore } from '../../data/news/store'
import EditorSidebar from './components/EditorSidebar'
import NewsCanvas, { CANVAS_DROPPABLE_ID, type DropIndex } from './components/NewsCanvas'
import { ContentElementTileView } from './components/ContentElementTile'
import DeleteNewsModal from './components/DeleteNewsModal'
import type { PreviewDevice } from './components/NewsRenderer'
import { elementMeta, formatTimestamp, versionTagStatus } from './components/meta'
import './ReleaseNewsEditor.css'

const { Text } = Typography

const DEVICE_WIDTHS: Record<PreviewDevice, number | undefined> = {
  desktop: undefined,
  tablet: 768,
  mobile: 390,
}

/** Edits within this window (e.g. typing) are merged into the same minor version. */
const COALESCE_MS = 1500

type ActiveDrag = { kind: 'palette'; type: ContentElementType } | { kind: 'element'; id: string } | null

/** Palette drags target elements under the pointer; reordering uses the closest element. */
const collisionDetection: CollisionDetection = args => {
  if (args.active.data.current?.from === 'palette') {
    const hits = pointerWithin(args)
    const elementHits = hits.filter(h => h.id !== CANVAS_DROPPABLE_ID)
    return elementHits.length > 0 ? elementHits : hits
  }
  return closestCenter({
    ...args,
    droppableContainers: args.droppableContainers.filter(c => c.id !== CANVAS_DROPPABLE_ID),
  })
}

function Editor({ initial, isNew }: { initial: ReleaseNews; isNew: boolean }) {
  const { token } = theme.useToken()
  const navigate = useNavigate()
  const [news, setNews] = useState<ReleaseNews>(initial)
  const [saved, setSaved] = useState(!isNew)
  const [editingId, setEditingId] = useState<string>()
  const [device, setDevice] = useState<PreviewDevice>('desktop')
  const [activeDrag, setActiveDrag] = useState<ActiveDrag>(null)
  const [dropIndex, setDropIndex] = useState<DropIndex>(null)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const lastEditRef = useRef(0)

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  )

  /**
   * Applies a change and autosaves. Every change creates a new minor version
   * (e.g. 2.0 → 2.1); rapid consecutive edits are merged into one version.
   */
  const commit = (next: ReleaseNews, { newVersion = true, forceNew = false } = {}) => {
    let result = next
    if (newVersion) {
      const now = Date.now()
      const current = news.versions[0]
      const merge = !forceNew && current && !current.published && now - lastEditRef.current < COALESCE_MS
      lastEditRef.current = now
      if (merge) {
        result = {
          ...next,
          versions: [
            { ...current, createdAt: new Date().toISOString(), snapshot: takeSnapshot(next) },
            ...news.versions.slice(1),
          ],
        }
      } else {
        const minor = news.versionMinor + 1
        const draft: ReleaseNews = { ...next, published: false, versionMinor: minor }
        result = { ...draft, versions: [createVersion(draft, news.versionMajor, minor, false), ...news.versions] }
      }
    }
    setNews(result)
    releaseNewsStore.upsert(result)
    setSaved(true)
  }

  /** Restores an older version by creating a new minor version with its content. */
  const restoreVersion = (versionId: string) => {
    const version = news.versions.find(v => v.id === versionId)
    if (!version || version.id === news.versions[0]?.id) return
    commit({ ...news, ...structuredClone(version.snapshot) }, { forceNew: true })
    setEditingId(undefined)
    message.success(`Version ${version.major}.${version.minor} wurde wiederhergestellt`)
  }

  const setContent = (content: ContentElement[]) => commit({ ...news, content })

  const addElement = (type: ContentElementType, index = news.content.length) => {
    const element = createContentElement(type)
    const content = [...news.content]
    content.splice(index, 0, element)
    setContent(content)
    setEditingId(element.id)
  }

  const duplicateElement = (id: string) => {
    const index = news.content.findIndex(el => el.id === id)
    if (index < 0) return
    const copy = { ...structuredClone(news.content[index]), id: newId('el') }
    const content = [...news.content]
    content.splice(index + 1, 0, copy)
    setContent(content)
  }

  const deleteElement = (id: string) => {
    setContent(news.content.filter(el => el.id !== id))
    if (editingId === id) setEditingId(undefined)
  }

  const updateElement = (element: ContentElement) =>
    setContent(news.content.map(el => (el.id === element.id ? element : el)))

  // ── Drag & drop ────────────────────────────────────────────────────────────
  const computeDropIndex = (event: DragMoveEvent | DragEndEvent): DropIndex => {
    const { over, active } = event
    if (!over) return null
    if (over.id === CANVAS_DROPPABLE_ID) return news.content.length
    const index = news.content.findIndex(el => el.id === over.id)
    if (index < 0) return null
    const rect = active.rect.current.translated
    if (!rect) return index
    const below = rect.top + rect.height / 2 > over.rect.top + over.rect.height / 2
    return below ? index + 1 : index
  }

  const handleDragStart = ({ active }: DragStartEvent) => {
    const data = active.data.current
    if (data?.from === 'palette') setActiveDrag({ kind: 'palette', type: data.type as ContentElementType })
    else setActiveDrag({ kind: 'element', id: String(active.id) })
  }

  const handleDragMove = (event: DragMoveEvent) => {
    if (event.active.data.current?.from === 'palette') setDropIndex(computeDropIndex(event))
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (active.data.current?.from === 'palette') {
      const index = computeDropIndex(event)
      if (index !== null) addElement(active.data.current.type as ContentElementType, index)
    } else if (over && over.id !== active.id) {
      const from = news.content.findIndex(el => el.id === active.id)
      const to = news.content.findIndex(el => el.id === over.id)
      if (from >= 0 && to >= 0) setContent(arrayMove(news.content, from, to))
    }
    setActiveDrag(null)
    setDropIndex(null)
  }

  const handleDragCancel = () => {
    setActiveDrag(null)
    setDropIndex(null)
  }

  // ── News actions ──────────────────────────────────────────────────────────
  const listUrl = `/news/releases?status=${news.status}`

  const publish = () => {
    releaseNewsStore.upsert(news)
    releaseNewsStore.publish(news.id)
    const published = releaseNewsStore.getById(news.id)
    if (published) setNews(published)
    setSaved(true)
    message.success('Release-News wurde veröffentlicht')
  }

  const handleMenu = (key: string) => {
    if (key === 'duplicate') {
      releaseNewsStore.upsert(news)
      const copy = releaseNewsStore.duplicate(news.id)
      message.success('Release-News wurde dupliziert')
      if (copy) navigate(`/news/releases/${copy.id}/edit`)
    } else if (key === 'archive') {
      releaseNewsStore.upsert(news)
      releaseNewsStore.archive(news.id)
      message.success('Release-News wurde archiviert')
      navigate('/news/releases?status=archived')
    } else if (key === 'delete') {
      setDeleteOpen(true)
    }
  }

  const confirmDelete = () => {
    releaseNewsStore.remove(news.id)
    setDeleteOpen(false)
    message.success('Release-News wurde gelöscht')
    navigate(`/news/releases?status=${news.status}`)
  }

  const editingElement = news.content.find(el => el.id === editingId)
  const tagStatus = versionTagStatus(news)
  const liveVersionId = news.status === 'active' ? news.versions.find(v => v.published)?.id : undefined
  const timeline: VersionTimelineEntry[] = news.versions.map((v, i) => ({
    id: v.id,
    label: `Version ${v.major}.${v.minor}`,
    timestamp: `${formatTimestamp(v.createdAt)} - ${v.author}`,
    isCurrent: i === 0,
    isLive: v.id === liveVersionId,
    published: v.published,
  }))
  const everPublished = news.versionMajor > 0
  const deviceWidth = DEVICE_WIDTHS[device]

  return (
    <Flex vertical style={{ height: '100%', minHeight: 0 }}>
      {/* Header */}
      <Flex
        align="center"
        justify="space-between"
        style={{
          minHeight: 60,
          padding: `0 ${token.paddingSM}px 0 ${token.padding}px`,
          background: token.colorBgContainer,
          borderBottom: `${token.lineWidth}px solid ${token.colorBorderSecondary}`,
          flexShrink: 0,
        }}
      >
        <Flex align="center" gap={token.marginSM} style={{ minWidth: 0 }}>
          <Tooltip title="Zurück">
            <Button
              variant="text"
              color="default"
              icon={<FontAwesomeIcon icon={faChevronLeft} />}
              onClick={() => navigate(saved ? `/news/releases/${news.id}?status=${news.status}` : listUrl)}
            />
          </Tooltip>
          <Text strong ellipsis style={{ fontSize: token.fontSizeHeading5 }}>{news.title}</Text>
          <VersionTag
            major={news.versionMajor}
            minor={news.versionMinor}
            status={tagStatus}
            versions={timeline}
            onSelectVersion={restoreVersion}
          />
          <Tooltip title={everPublished ? undefined : 'Verfügbar nach der ersten Veröffentlichung'}>
            <Flex align="center" gap={token.marginXS}>
              <Switch
                size="small"
                checked={news.status === 'active'}
                disabled={!everPublished}
                onChange={checked => commit({ ...news, status: checked ? 'active' : 'draft' }, { newVersion: false })}
              />
              <Text>Aktiv</Text>
            </Flex>
          </Tooltip>
          {saved && (
            <Flex align="center" gap={token.marginXXS} style={{ color: token.colorSuccess }}>
              <FontAwesomeIcon icon={faCircleCheck} />
              <Text style={{ color: token.colorSuccess }}>Gespeichert</Text>
            </Flex>
          )}
        </Flex>

        <Flex align="center" gap={token.marginXS}>
          <Dropdown
            trigger={['click']}
            menu={{
              items: [
                { key: 'duplicate', label: 'Duplizieren', icon: <FontAwesomeIcon icon={faClone} /> },
                {
                  key: 'archive',
                  label: 'Archivieren',
                  icon: <FontAwesomeIcon icon={faBoxArchive} />,
                  disabled: news.status === 'archived',
                },
                { type: 'divider' },
                { key: 'delete', label: 'Löschen', icon: <FontAwesomeIcon icon={faTrash} />, danger: true },
              ],
              onClick: ({ key }) => handleMenu(key),
            }}
          >
            <Button icon={<FontAwesomeIcon icon={faEllipsisVertical} />} />
          </Dropdown>
          <Button type="primary" onClick={publish} disabled={news.published && news.status === 'active'}>
            Veröffentlichen
          </Button>
        </Flex>
      </Flex>

      {/* Body */}
      <DndContext
        sensors={sensors}
        collisionDetection={collisionDetection}
        onDragStart={handleDragStart}
        onDragMove={handleDragMove}
        onDragEnd={handleDragEnd}
        onDragCancel={handleDragCancel}
      >
        <Splitter
          className="news-editor-splitter"
          style={{ flex: 1, minHeight: 0, ['--news-splitter-line' as string]: token.controlItemBgActive }}
        >
          <Splitter.Panel defaultSize={330} min={280} max={520}>
            <div style={{ height: '100%', padding: `${token.paddingXL}px 0 ${token.paddingXL}px ${token.paddingXL}px` }}>
              <EditorSidebar
                news={news}
                onNewsChange={next => commit(next)}
                editingElement={editingElement}
                onElementChange={updateElement}
                onCloseElement={() => setEditingId(undefined)}
                onAddElement={type => addElement(type)}
              />
            </div>
          </Splitter.Panel>

          <Splitter.Panel>
            <Flex vertical style={{ height: '100%', minWidth: 0 }}>
              <Flex
                align="center"
                justify="space-between"
                style={{ padding: `${token.paddingXL}px ${token.paddingXL}px ${token.padding}px` }}
              >
                <Text strong>Vorschau</Text>
                <Segmented
                  value={device}
                  style={{ background: token.colorGrey10 }}
                  onChange={value => setDevice(value as PreviewDevice)}
                  options={[
                    {
                      value: 'desktop',
                      icon: <Tooltip title="Desktop"><FontAwesomeIcon icon={faDisplay} /></Tooltip>,
                    },
                    {
                      value: 'tablet',
                      icon: <Tooltip title="Tablet"><FontAwesomeIcon icon={faTablet} /></Tooltip>,
                    },
                    {
                      value: 'mobile',
                      icon: <Tooltip title="Mobil"><FontAwesomeIcon icon={faMobile} /></Tooltip>,
                    },
                  ]}
                />
              </Flex>

              <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', padding: `0 ${token.paddingXL * 2}px` }}>
                <div
                  style={{
                    width: '100%',
                    maxWidth: deviceWidth,
                    margin: '0 auto',
                    transition: `max-width ${token.motionDurationSlow}`,
                    ...(deviceWidth && {
                      marginBottom: token.marginLG,
                      padding: `0 ${token.padding}px`,
                      background: token.colorBgContainer,
                      borderRadius: token.borderRadiusLG,
                      boxShadow: token.boxShadowSecondary,
                    }),
                  }}
                >
                  <NewsCanvas
                    content={news.content}
                    device={device}
                    selectedId={editingId}
                    dropIndex={dropIndex}
                    onEdit={setEditingId}
                    onDuplicate={duplicateElement}
                    onDelete={deleteElement}
                  />
                </div>
              </div>
            </Flex>
          </Splitter.Panel>
        </Splitter>

        <DragOverlay dropAnimation={null}>
          {activeDrag?.kind === 'palette' && (
            <div style={{ width: 120 }}>
              <ContentElementTileView type={activeDrag.type} state="dragging" />
            </div>
          )}
          {activeDrag?.kind === 'element' && (() => {
            const el = news.content.find(e => e.id === activeDrag.id)
            if (!el) return null
            return (
              <Flex
                align="center"
                gap={token.marginXS}
                style={{
                  display: 'inline-flex',
                  padding: `${token.paddingXXS}px ${token.paddingSM}px`,
                  background: token.colorPrimary,
                  borderRadius: token.borderRadius,
                  boxShadow: token.boxShadowSecondary,
                  cursor: 'grabbing',
                }}
              >
                <FontAwesomeIcon icon={elementMeta[el.type].icon} style={{ color: token.colorWhite }} />
                <Text style={{ color: token.colorWhite }}>{elementMeta[el.type].label}</Text>
              </Flex>
            )
          })()}
        </DragOverlay>
      </DndContext>

      <DeleteNewsModal
        open={deleteOpen}
        title={news.title}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteOpen(false)}
      />
    </Flex>
  )
}

/** Route entry for `/news/releases/new` and `/news/releases/:id/edit`. */
export default function ReleaseNewsEditor() {
  const { id } = useParams<{ id: string }>()
  const [blank] = useState(() => createBlankReleaseNews())

  if (!id) return <Editor key="new" initial={blank} isNew />

  const stored = releaseNewsStore.getById(id)
  if (!stored) {
    return (
      <Flex vertical align="center" justify="center" style={{ height: '100%' }}>
        <Text type="secondary">Release-News nicht gefunden.</Text>
      </Flex>
    )
  }
  return <Editor key={id} initial={structuredClone(stored)} isNew={false} />
}

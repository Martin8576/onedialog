import type { IconDefinition } from '@fortawesome/fontawesome-svg-core'
import {
  faAddressCard,
  faCircleInfo,
  faCirclePlay,
  faCircleQuestion,
  faFileLines,
  faGripLines,
  faImage,
  faLightbulb,
  faLink,
  faParagraph,
  faPartyHorn,
  faSparkles,
  faT,
} from '@fortawesome/pro-light-svg-icons'
import type { ContentElementType, NewsStatus, NewsType, ReleaseNews } from '../../../data/news/types'
import { newsTypeLabels } from '../../../data/news/types'
import type { VersionTagStatus } from '../../../designsystem/components'

export const newsTypeMeta: Record<NewsType, { label: string; icon: IconDefinition }> = {
  news: { label: newsTypeLabels.news, icon: faFileLines },
  brandInfo: { label: newsTypeLabels.brandInfo, icon: faCircleInfo },
  help: { label: newsTypeLabels.help, icon: faCircleQuestion },
  tip: { label: newsTypeLabels.tip, icon: faLightbulb },
  new: { label: newsTypeLabels.new, icon: faSparkles },
  release: { label: newsTypeLabels.release, icon: faPartyHorn },
}

export const elementMeta: Record<ContentElementType, { label: string; icon: IconDefinition }> = {
  heading: { label: 'Überschrift', icon: faT },
  text: { label: 'Text', icon: faParagraph },
  link: { label: 'Link', icon: faLink },
  divider: { label: 'Trenner', icon: faGripLines },
  image: { label: 'Bild', icon: faImage },
  video: { label: 'Video', icon: faCirclePlay },
  contentBlock: { label: 'Inhaltsblock', icon: faAddressCard },
}

/** Palette grouping (Figma: oneDialog Shared Components › CMS Sidebar). */
export const elementGroups: { label: string; types: ContentElementType[] }[] = [
  { label: 'Inhalte', types: ['heading', 'text', 'link', 'divider'] },
  { label: 'Medien', types: ['image', 'video'] },
  { label: 'Layout', types: ['contentBlock'] },
]

export const statusLabels: Record<NewsStatus, string> = {
  active: 'Aktiv',
  draft: 'Entwürfe',
  archived: 'Archiv',
}

/** Maps a news to the status shown in the shared `VersionTag`. */
export function versionTagStatus(news: ReleaseNews): Exclude<VersionTagStatus, 'preview'> {
  if (news.status === 'archived') return 'archived'
  return news.published ? 'live' : 'draft'
}

const pad = (n: number) => String(n).padStart(2, '0')
const formatDate = (d: Date) => `${pad(d.getDate())}.${pad(d.getMonth() + 1)}.${d.getFullYear()}`
const formatTime = (d: Date) => `${pad(d.getHours())}:${pad(d.getMinutes())}`

function formatDateTime(iso: string): string {
  const d = new Date(iso)
  const today = new Date()
  const isToday = d.toDateString() === today.toDateString()
  return `${isToday ? 'heute' : formatDate(d)}, ${formatTime(d)} Uhr`
}

/** e.g. "06.04.2026 09:30" */
export const formatTimestamp = (iso: string) => {
  const d = new Date(iso)
  return `${formatDate(d)} ${formatTime(d)}`
}

export function newsSubtitle(news: ReleaseNews): string {
  if (news.status === 'draft') return `Entwurf vom ${formatDateTime(news.createdAt)}`
  if (news.status === 'archived') {
    return news.publishedAt ? `Archiviert · online seit ${formatDateTime(news.publishedAt)}` : 'Archiviert'
  }
  return news.publishedAt ? `Online seit ${formatDateTime(news.publishedAt)}` : 'Online'
}

/** Sort key: publication time, falling back to creation time. Newest first. */
export const sortByPublication = (a: ReleaseNews, b: ReleaseNews) =>
  (b.publishedAt ?? b.createdAt).localeCompare(a.publishedAt ?? a.createdAt)

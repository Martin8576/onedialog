import type { VersionTimelineEntry } from './VersionTag'

const TIMESTAMP = '06.04.2024 9:30 - Marc Lobinger'

export function buildVersionHistory({
  major, minor, status,
}: { major: number; minor: number; status: 'live' | 'draft' | 'archived' }): VersionTimelineEntry[] {
  const entries: VersionTimelineEntry[] = []

  if (status === 'live') {
    entries.push({ id: `v-${major}.0`, label: `Version ${major}.0`, timestamp: TIMESTAMP, isLive: true, published: true })
  } else {
    entries.push({ id: `v-${major}.${minor}`, label: `Version ${major}.${minor}`, timestamp: TIMESTAMP, isCurrent: true, published: false })
    if (minor > 1) {
      entries.push({ id: `v-${major}.${minor - 1}`, label: `Version ${major}.${minor - 1}`, timestamp: TIMESTAMP, published: false })
    }
    if (major >= 1) {
      entries.push({ id: `v-${major}.0`, label: `Version ${major}.0`, timestamp: TIMESTAMP, isLive: true, published: true })
    }
  }

  for (let m = major - 1; m >= 1; m--) {
    entries.push({ id: `v-${m}.0`, label: `Version ${m}.0`, timestamp: TIMESTAMP, published: true })
  }

  return entries.slice(0, 6)
}

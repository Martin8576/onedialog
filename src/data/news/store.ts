import { useSyncExternalStore } from 'react'
import { createVersion, initialReleaseNews, newId } from './releaseNews'
import type { ReleaseNews } from './types'

/**
 * Tiny in-memory store so list and editor share (mutable) dummy data
 * for the lifetime of the page.
 */
let state: ReleaseNews[] = initialReleaseNews
const listeners = new Set<() => void>()

const emit = () => listeners.forEach(l => l())
const set = (next: ReleaseNews[]) => {
  state = next
  emit()
}

const subscribe = (listener: () => void) => {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

export function useReleaseNews(): ReleaseNews[] {
  return useSyncExternalStore(subscribe, () => state)
}

export const releaseNewsStore = {
  getById: (id: string) => state.find(n => n.id === id),

  upsert: (news: ReleaseNews) => {
    const exists = state.some(n => n.id === news.id)
    set(exists ? state.map(n => (n.id === news.id ? news : n)) : [news, ...state])
  },

  duplicate: (id: string): ReleaseNews | undefined => {
    const source = state.find(n => n.id === id)
    if (!source) return undefined
    const draft: ReleaseNews = {
      ...structuredClone(source),
      id: newId('rn'),
      title: `${source.title} (Kopie)`,
      status: 'draft',
      published: false,
      versionMajor: 0,
      versionMinor: 1,
      publishedAt: undefined,
      createdAt: new Date().toISOString(),
      content: source.content.map(el => ({ ...structuredClone(el), id: newId('el') })),
      versions: [],
    }
    const copy: ReleaseNews = { ...draft, versions: [createVersion(draft, 0, 1, false)] }
    set([copy, ...state])
    return copy
  },

  archive: (id: string) =>
    set(state.map(n => (n.id === id ? { ...n, status: 'archived' as const } : n))),

  restore: (id: string) =>
    set(state.map(n => (n.id === id ? { ...n, status: 'draft' as const, published: false } : n))),

  /** Publishes the current state as the next major version (e.g. 4.2 → 5.0). */
  publish: (id: string) =>
    set(
      state.map(n => {
        if (n.id !== id) return n
        const published: ReleaseNews = {
          ...n,
          status: 'active',
          published: true,
          versionMajor: n.versionMajor + 1,
          versionMinor: 0,
          publishedAt: new Date().toISOString(),
        }
        return {
          ...published,
          versions: [createVersion(published, published.versionMajor, 0, true), ...n.versions],
        }
      }),
    ),

  remove: (id: string) => set(state.filter(n => n.id !== id)),
}

/** All news types. The admin only manages `release`; the Brand Cockpit uses all others. */
export type NewsType = 'news' | 'brandInfo' | 'help' | 'tip' | 'new' | 'release'

export const newsTypeLabels: Record<NewsType, string> = {
  news: 'News',
  brandInfo: 'Markeninformationen',
  help: 'Hilfe',
  tip: 'Tipp',
  new: 'Neu',
  release: 'Release-News',
}

/** Types selectable in the Brand Cockpit (everything except release news). */
export const brandCockpitNewsTypes: NewsType[] = ['news', 'brandInfo', 'help', 'tip', 'new']

export type NewsStatus = 'active' | 'draft' | 'archived'

export type Visibility = {
  brands: string[]
  groups: string[]
  roles: string[]
  features: string[]
  channels: string[]
}

export const emptyVisibility = (): Visibility => ({
  brands: [],
  groups: [],
  roles: [],
  features: [],
  channels: [],
})

export const isVisibilityRestricted = (v: Visibility): boolean =>
  Object.values(v).some(values => values.length > 0)

type ElementBase = { id: string }

/** `'auto'`: whole image, scaled to the width. A number: fixed height in px, image is covered. */
export type ImageHeight = 'auto' | number
export type Align = 'left' | 'center' | 'right'
export type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6
export type LinkDisplay = 'button' | 'link'
export type LinkSize = 'small' | 'middle' | 'large'
export type LinkFields = { label: string; url: string; display: LinkDisplay; align: Align; size: LinkSize }

export type HeadingElement = ElementBase & { type: 'heading'; text: string; level: HeadingLevel }
export type TextElement = ElementBase & { type: 'text'; text: string }
export type ImageElement = ElementBase & { type: 'image'; src?: string; height: ImageHeight }
export type VideoElement = ElementBase & { type: 'video'; url: string }
/** Merged former "Button" and "Link" elements; `display` decides the look. */
export type LinkElement = ElementBase & LinkFields & { type: 'link' }
/** `style: 'plain'` = line without text; `'text'` = line with text at `align`. */
export type DividerElement = ElementBase & { type: 'divider'; style: 'plain' | 'text'; align: Align; text: string }

/**
 * "Inhaltsblock" (formerly "Text mit Bild"): heading, text, medium and link can each be
 * switched on/off. The only element with visibility restrictions.
 */
export type ContentBlockElement = ElementBase & {
  type: 'contentBlock'
  layout: 'imageRight' | 'imageLeft'
  showHeading: boolean
  headingLevel: 1 | 2 | 3
  heading: string
  showText: boolean
  text: string
  media: 'none' | 'image' | 'video'
  image?: string
  imageHeight: ImageHeight
  videoUrl: string
  showLink: boolean
  link: LinkFields
  visibility: Visibility
}

export type ContentElement =
  | HeadingElement
  | TextElement
  | ImageElement
  | VideoElement
  | LinkElement
  | DividerElement
  | ContentBlockElement

/** Visibility restrictions of an element – only content blocks have them. */
export const elementVisibility = (element: ContentElement): Visibility | undefined =>
  element.type === 'contentBlock' ? element.visibility : undefined

/** Character limits */
export const HEADING_MAX_LENGTH = 100
export const TEXT_MAX_LENGTH = 400
export const LINK_LABEL_MAX_LENGTH = 60

export type ContentElementType = ContentElement['type']

/** The editable parts of a news that are stored per version. */
export type NewsSnapshot = {
  title: string
  teaser: { image?: string; name: string }
  publishStart?: string
  publishEnd?: string
  display: 'news' | 'modal'
  notification: boolean
  content: ContentElement[]
}

export type NewsVersion = {
  id: string
  major: number
  minor: number
  /** ISO date-time */
  createdAt: string
  author: string
  published: boolean
  snapshot: NewsSnapshot
}

export type ReleaseNews = {
  id: string
  title: string
  type: NewsType
  status: NewsStatus
  versionMajor: number
  versionMinor: number
  /** Whether the current version is published (same logic as contact events). */
  published: boolean
  teaser: { image?: string; name: string }
  /** ISO date strings */
  publishStart?: string
  publishEnd?: string
  display: 'news' | 'modal'
  notification: boolean
  author: string
  /** ISO date-time of publication (active/archived news) */
  publishedAt?: string
  /** ISO date-time of creation */
  createdAt: string
  content: ContentElement[]
  /** Version history, newest first. `versions[0]` is the current version. */
  versions: NewsVersion[]
}

export const takeSnapshot = (news: ReleaseNews): NewsSnapshot =>
  structuredClone({
    title: news.title,
    teaser: news.teaser,
    publishStart: news.publishStart,
    publishEnd: news.publishEnd,
    display: news.display,
    notification: news.notification,
    content: news.content,
  })

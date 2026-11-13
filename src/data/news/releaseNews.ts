import happyImg from '../../assets/images/happy.jpeg'
import kidHappyImg from '../../assets/images/kid_happy.jpeg'
import eautoImg from '../../assets/images/eauto.jpeg'
import qrCalendarImg from '../../assets/images/news/qr_calendar.jpg'
import qrChannelsImg from '../../assets/images/news/qr_channels.jpg'
import chartImg from '../../assets/images/news/chart.jpg'
import climberImg from '../../assets/images/news/climber.jpg'
import {
  emptyVisibility,
  type ContentElement,
  type ContentElementType,
  type NewsVersion,
  type ReleaseNews,
  type Visibility,
  takeSnapshot,
} from './types'

let idCounter = 0
export const newId = (prefix: string): string => `${prefix}-${Date.now().toString(36)}-${(idCounter++).toString(36)}`

const vis = (partial: Partial<Visibility> = {}): Visibility => ({ ...emptyVisibility(), ...partial })

function sampleContent(prefix: string, heroImage: string, headline: string): ContentElement[] {
  return [
    { id: `${prefix}-1`, type: 'image', src: heroImage, height: 280 },
    { id: `${prefix}-2`, type: 'heading', text: headline, level: 3 },
    {
      id: `${prefix}-3`,
      type: 'text',
      text:
        'Ein kundenzentrierter Unternehmensansatz ist heutzutage wichtiger als je zuvor. Nur wenn ein Unternehmen seine Kunden versteht, kann es mit seinen Produkten auch Erfolg haben. Doch was bedeutet **Customer Centricity** überhaupt und wie lässt sich die Kundenzentrierung fürs Unternehmen nutzen?',
    },
    {
      id: `${prefix}-4`,
      type: 'contentBlock',
      layout: 'imageRight',
      showHeading: true,
      headingLevel: 3,
      heading: 'Was steckt hinter der Customer Centricity?',
      showText: true,
      text: 'Früher stand ein Unternehmen im Mittelpunkt der Kommunikation. Der Fokus lag klar auf dem für sich selbst stehenden Produkt.',
      media: 'image',
      image: eautoImg,
      imageHeight: 'auto',
      videoUrl: '',
      showLink: true,
      link: { label: 'Mehr erfahren', url: 'https://onedialog.de', display: 'link', align: 'left', size: 'middle' },
      visibility: vis({ roles: ['admin'], features: ['tasks', 'reviews', 'appointments'], channels: ['email', 'whatsapp'] }),
    },
    { id: `${prefix}-5`, type: 'divider', style: 'text', align: 'center', text: 'Neu in diesem Release' },
    {
      id: `${prefix}-6`,
      type: 'text',
      text: 'Die wichtigsten Neuerungen im Überblick:\n- Neue Terminbuchung im Dialog\n- Bewertungen direkt beantworten\n- *Schnellere* Ladezeiten in der Kontaktliste 🎉',
    },
    { id: `${prefix}-7`, type: 'link', label: 'Jetzt ausprobieren', url: 'https://onedialog.de', display: 'button', align: 'left', size: 'middle' },
  ]
}

const seedNews: Omit<ReleaseNews, 'versions'>[] = [
  {
    id: 'rn-2026-11',
    title: 'Update November 2026',
    type: 'release',
    status: 'active',
    versionMajor: 2,
    versionMinor: 0,
    published: true,
    teaser: { image: qrCalendarImg, name: 'Terminbuchung per QR-Code' },
    display: 'news',
    notification: true,
    author: 'Marc Lobinger',
    publishedAt: '2026-11-11T08:43:00',
    createdAt: '2026-11-03T10:12:00',
    content: sampleContent('rn11', qrCalendarImg, 'Terminbuchung per QR-Code'),
  },
  {
    id: 'rn-2026-10',
    title: 'Update Oktober 2026',
    type: 'release',
    status: 'active',
    versionMajor: 3,
    versionMinor: 0,
    published: true,
    teaser: { image: kidHappyImg, name: 'Mehr Freude im Kundendialog' },
    display: 'modal',
    notification: true,
    author: 'Franziska Berger',
    publishedAt: '2026-10-20T17:20:00',
    createdAt: '2026-10-14T09:00:00',
    content: sampleContent('rn10', kidHappyImg, 'Mehr Freude im Kundendialog'),
  },
  {
    id: 'rn-2026-09',
    title: 'Update September 2026',
    type: 'release',
    status: 'active',
    versionMajor: 1,
    versionMinor: 0,
    published: true,
    teaser: { image: chartImg, name: 'Neue Analytics-Auswertungen' },
    display: 'news',
    notification: false,
    author: 'Marc Lobinger',
    publishedAt: '2026-09-12T17:20:00',
    createdAt: '2026-09-02T14:30:00',
    content: sampleContent('rn09', chartImg, 'Neue Analytics-Auswertungen'),
  },
  {
    id: 'rn-2026-12',
    title: 'Update Dezember 2026',
    type: 'release',
    status: 'draft',
    versionMajor: 4,
    versionMinor: 2,
    published: false,
    teaser: { image: happyImg, name: 'Customer Centricity?' },
    display: 'news',
    notification: true,
    author: 'Franziska Berger',
    createdAt: '2026-11-08T11:05:00',
    content: sampleContent('rn12', happyImg, 'Customer Centricity: Kundenzentrierung durch Kommunikation'),
  },
  {
    id: 'rn-2027-01',
    title: 'Update Januar 2027',
    type: 'release',
    status: 'draft',
    versionMajor: 1,
    versionMinor: 1,
    published: false,
    teaser: { image: qrChannelsImg, name: 'Alle Kanäle per QR-Code' },
    display: 'news',
    notification: false,
    author: 'Marc Lobinger',
    createdAt: '2026-11-10T16:40:00',
    content: sampleContent('rn01', qrChannelsImg, 'Alle Kanäle per QR-Code'),
  },
  {
    id: 'rn-2026-08',
    title: 'Update August 2026',
    type: 'release',
    status: 'archived',
    versionMajor: 2,
    versionMinor: 0,
    published: true,
    teaser: { image: climberImg, name: 'Neue Höhen im Vertrieb' },
    display: 'news',
    notification: false,
    author: 'Franziska Berger',
    publishedAt: '2026-08-24T11:32:00',
    createdAt: '2026-08-15T08:20:00',
    content: sampleContent('rn08', climberImg, 'Neue Höhen im Vertrieb'),
  },
]

/** Builds a plausible version history for a seed news (newest first). */
function withVersions(news: Omit<ReleaseNews, 'versions'>): ReleaseNews {
  const full = { ...news, versions: [] } as ReleaseNews
  const versions: NewsVersion[] = []
  const base = new Date(news.publishedAt ?? news.createdAt).getTime()
  let step = 0
  const push = (major: number, minor: number, published: boolean) => {
    // Older versions contain fewer elements so restoring makes a visible difference.
    const snapshot = takeSnapshot(full)
    snapshot.content = snapshot.content.slice(0, Math.max(2, snapshot.content.length - step))
    versions.push({
      id: `${news.id}-v${major}.${minor}`,
      major,
      minor,
      createdAt: new Date(base - step * 86_400_000).toISOString(),
      author: news.author,
      published,
      snapshot: step === 0 ? takeSnapshot(full) : snapshot,
    })
    step++
  }

  if (!news.published) {
    for (let m = news.versionMinor; m >= 1; m--) push(news.versionMajor, m, false)
  }
  for (let M = news.versionMajor; M >= 1; M--) push(M, 0, true)
  return { ...full, versions }
}

export const initialReleaseNews: ReleaseNews[] = seedNews.map(withVersions)

export function createVersion(
  news: ReleaseNews,
  major: number,
  minor: number,
  published: boolean,
  author = news.author,
): NewsVersion {
  return {
    id: newId('v'),
    major,
    minor,
    createdAt: new Date().toISOString(),
    author,
    published,
    snapshot: takeSnapshot(news),
  }
}

export function createBlankReleaseNews(author = 'Marc Lobinger'): ReleaseNews {
  const news: ReleaseNews = {
    id: newId('rn'),
    title: 'Neue Release-News',
    type: 'release',
    status: 'draft',
    versionMajor: 0,
    versionMinor: 1,
    published: false,
    teaser: { name: '' },
    display: 'news',
    notification: false,
    author,
    createdAt: new Date().toISOString(),
    content: [],
    versions: [],
  }
  return { ...news, versions: [createVersion(news, 0, 1, false, author)] }
}

/** Default content for a freshly dropped element. */
export function createContentElement(type: ContentElementType): ContentElement {
  const id = newId('el')
  switch (type) {
    case 'heading':
      return { id, type, text: 'Neue Überschrift', level: 3 }
    case 'text':
      return { id, type, text: 'Hier steht Ihr Text.' }
    case 'image':
      return { id, type, src: undefined, height: 'auto' }
    case 'video':
      return { id, type, url: '' }
    case 'link':
      return { id, type, label: 'Mehr erfahren', url: '', display: 'button', align: 'left', size: 'middle' }
    case 'divider':
      return { id, type, style: 'plain', align: 'center', text: '' }
    case 'contentBlock':
      return {
        id,
        type,
        layout: 'imageRight',
        showHeading: true,
        headingLevel: 3,
        heading: 'Neue Überschrift',
        showText: true,
        text: 'Hier steht Ihr Text.',
        media: 'image',
        image: undefined,
        imageHeight: 'auto',
        videoUrl: '',
        showLink: false,
        link: { label: 'Mehr erfahren', url: '', display: 'link', align: 'left', size: 'middle' },
        visibility: emptyVisibility(),
      }
  }
}

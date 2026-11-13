import kidHappyImage from '../assets/images/kid_happy.jpeg'
import familyImage from '../assets/images/family.jpg'
import kfzImage from '../assets/images/kfz.jpeg'
import happyImage from '../assets/images/happy.jpeg'
import eautoImage from '../assets/images/eauto.jpeg'

export type ContactEventStatus = 'live' | 'draft' | 'archived'

export type ContactEventMessage = {
  greeting: string
  body: string
  signature: string
  buttons: string[]
}

export type ContactEventTrigger = {
  contactField: string
  offsetDirection: 'before' | 'after'
  offsetDays: number
}

export type ContactEventCondition = {
  field: string
  operator: string
  value: string
}

export type ContactEventActions = {
  vorgang: string
  sichtbarkeit: string
  status: string
}

export type ContactEventHandler = {
  id: string
  name: string
  city: string
  contactCount: number
}

const HANDLER_NAME_POOL = [
  'Autohaus Weber', 'Fachhandel Meyer', 'Service Center Nord', 'Technikhaus Schmidt',
  'Handelspartner Süd', 'Fachmarkt Bauer', 'Kundencenter Ost', 'Autohaus König',
  'Fachhandel Vogel', 'Service Point West', 'Technikhaus Klein', 'Handelshaus Fischer',
  'Fachmarkt Richter', 'Autohaus Wolf', 'Service Center Berg', 'Technikhaus Neumann',
]

const HANDLER_CITY_POOL = [
  'Bamberg', 'München', 'Nürnberg', 'Berlin', 'Hamburg', 'Köln', 'Stuttgart', 'Leipzig',
]

export function buildHandlers(count: number): ContactEventHandler[] {
  return Array.from({ length: count }, (_, i) => ({
    id: `handler-${i + 1}`,
    name: HANDLER_NAME_POOL[i % HANDLER_NAME_POOL.length],
    city: HANDLER_CITY_POOL[i % HANDLER_CITY_POOL.length],
    contactCount: 8 + ((i * 7) % 60),
  }))
}

export type ContactEventStats = {
  handlerCount: number
  handlerPercent: number
  contactCount: number
  contactCountChangePercent: number
  durationPerSession: string
  durationChangePercent: number
  sessionsPerContact: number
  sessionsPerContactChangePercent: number
  sessions: number
  sessionsChangePercent: number
  sessionsCompleted: number
  sessionsCompletedChangePercent: number
  sessionsActive: number
  sessionsActiveChangePercent: number
  sessionsError: number
  sessionsErrorChangePercent: number
}

export type ContactEvent = {
  id: string
  name: string
  description: string
  status: ContactEventStatus
  versionMajor: number
  versionMinor: number
  image: string
  message: ContactEventMessage
  trigger: ContactEventTrigger
  conditions: ContactEventCondition[]
  audienceId?: string
  actions: ContactEventActions
  assignee?: string
  errorHandling: string
  stats: ContactEventStats
  handlers: ContactEventHandler[]
  createdAt: string
  createdBy: string
}

export const contactFieldOptions = [
  { value: 'birthdate', label: 'Geburtsdatum' },
  { value: 'contract-renewal', label: 'Vertragsverlängerung' },
  { value: 'last-service', label: 'Letzter Service' },
  { value: 'purchase-date', label: 'Kaufdatum' },
]

export const conditionFieldOptions = [
  { value: 'case-created', label: 'Vorgang neu erstellt' },
  { value: 'message-contains', label: 'Nachricht enthält Text' },
  { value: 'channel', label: 'Kanal' },
  { value: 'customer-type', label: 'Kundenart' },
]

export const conditionOperatorOptions = [
  { value: 'equals', label: 'Gleich' },
  { value: 'not-equals', label: 'Ungleich' },
  { value: 'contains', label: 'Enthält' },
]

export const vorgangOptions = [
  { value: 'existing', label: 'Bestehender Vorgang' },
  { value: 'new', label: 'Neuer Vorgang' },
  { value: 'none', label: 'Kein Vorgang' },
]

export const sichtbarkeitOptions = [
  { value: 'none', label: 'Keine Änderung' },
  { value: 'internal', label: 'Intern' },
  { value: 'public', label: 'Öffentlich' },
]

export const vorgangStatusOptions = [
  { value: 'none', label: 'Keine Änderung' },
  { value: 'open', label: 'Offen' },
  { value: 'closed', label: 'Abgeschlossen' },
]

export const assigneeOptions = [
  { value: 'none', label: 'Keine Zuweisung' },
  { value: 'marc', label: 'Marc Lobinger' },
  { value: 'nadja', label: 'Nadja Berger' },
]

export const errorHandlingOptions = [
  { value: 'none', label: 'Keine Aktion' },
  { value: 'notify', label: 'Team benachrichtigen' },
  { value: 'retry', label: 'Erneut versuchen' },
]

export const audienceOptions = [
  { value: 'aud-1', label: 'Bestandskunden Nord' },
  { value: 'aud-2', label: 'Neukunden 2025' },
]

export const contactEvents: ContactEvent[] = [
  {
    id: 'ce-1',
    name: 'Geburtstagsnachricht',
    description: 'Sendet einen Geburtstagsgruß am Geburtstag des Kunden.',
    status: 'live',
    versionMajor: 4,
    versionMinor: 1,
    image: kidHappyImage,
    message: {
      greeting: 'Hallo Max',
      body: 'Alles gute zum Geburtstag. Wir wünschen dir und deiner Familie ein gesundes und erfolgreiches Lebensjahr.',
      signature: 'Viele Grüße oneDialog Bamberg',
      buttons: ['Ja, sehr gerne', 'Zur Website', 'Jetzt anrufen'],
    },
    trigger: { contactField: 'birthdate', offsetDirection: 'before', offsetDays: 3 },
    conditions: [
      { field: 'case-created', operator: 'equals', value: 'Wahr' },
      { field: 'message-contains', operator: 'equals', value: 'Beratung' },
    ],
    actions: { vorgang: 'existing', sichtbarkeit: 'none', status: 'none' },
    assignee: 'none',
    errorHandling: 'none',
    stats: {
      handlerCount: 154,
      handlerPercent: 82,
      contactCount: 968,
      contactCountChangePercent: 2,
      durationPerSession: '2,25 min',
      durationChangePercent: -2,
      sessionsPerContact: 1.86,
      sessionsPerContactChangePercent: -6,
      sessions: 1265,
      sessionsChangePercent: 9,
      sessionsCompleted: 1002,
      sessionsCompletedChangePercent: -2,
      sessionsActive: 98,
      sessionsActiveChangePercent: 10,
      sessionsError: 165,
      sessionsErrorChangePercent: -6,
    },
    handlers: buildHandlers(154),
    createdAt: '07.03.2024',
    createdBy: 'Marc Lobinger',
  },
  {
    id: 'ce-2',
    name: 'Wartung Rasenmäher',
    description: 'Erinnert den Kunden an die Wartung seines Rasenmähers',
    status: 'live',
    versionMajor: 2,
    versionMinor: 0,
    image: familyImage,
    message: {
      greeting: 'Hallo Anna',
      body: 'Dein Rasenmäher ist bald wieder fällig für die jährliche Wartung. Vereinbare jetzt einen Termin, damit er zur nächsten Saison einsatzbereit ist.',
      signature: 'Viele Grüße dein Gartenfachhandel',
      buttons: ['Termin vereinbaren', 'Zur Website'],
    },
    trigger: { contactField: 'last-service', offsetDirection: 'after', offsetDays: 365 },
    conditions: [],
    actions: { vorgang: 'new', sichtbarkeit: 'none', status: 'none' },
    assignee: 'none',
    errorHandling: 'none',
    stats: {
      handlerCount: 5,
      handlerPercent: 100,
      contactCount: 365,
      contactCountChangePercent: 4,
      durationPerSession: '1,40 min',
      durationChangePercent: 1,
      sessionsPerContact: 1.1,
      sessionsPerContactChangePercent: 0,
      sessions: 402,
      sessionsChangePercent: 3,
      sessionsCompleted: 350,
      sessionsCompletedChangePercent: 2,
      sessionsActive: 30,
      sessionsActiveChangePercent: 5,
      sessionsError: 22,
      sessionsErrorChangePercent: -1,
    },
    handlers: buildHandlers(5),
    createdAt: '12.01.2024',
    createdBy: 'Nadja Berger',
  },
  {
    id: 'ce-3',
    name: 'Erinnerung KFZ-Versicherung',
    description: 'Erinnert den Kunden an den Wechsel der KFZ-Versicherung',
    status: 'live',
    versionMajor: 3,
    versionMinor: 0,
    image: kfzImage,
    message: {
      greeting: 'Hallo Peter',
      body: 'Deine KFZ-Versicherung läuft in Kürze aus. Lass uns gemeinsam prüfen, ob dein Tarif noch zu deinen Bedürfnissen passt.',
      signature: 'Viele Grüße dein Versicherungsteam',
      buttons: ['Beratung anfragen', 'Zur Website', 'Jetzt anrufen'],
    },
    trigger: { contactField: 'contract-renewal', offsetDirection: 'before', offsetDays: 30 },
    conditions: [{ field: 'customer-type', operator: 'equals', value: 'Bestandskunde' }],
    actions: { vorgang: 'existing', sichtbarkeit: 'none', status: 'none' },
    assignee: 'marc',
    errorHandling: 'notify',
    stats: {
      handlerCount: 46,
      handlerPercent: 74,
      contactCount: 687,
      contactCountChangePercent: -1,
      durationPerSession: '3,10 min',
      durationChangePercent: 3,
      sessionsPerContact: 1.4,
      sessionsPerContactChangePercent: 2,
      sessions: 720,
      sessionsChangePercent: 6,
      sessionsCompleted: 610,
      sessionsCompletedChangePercent: 4,
      sessionsActive: 66,
      sessionsActiveChangePercent: -3,
      sessionsError: 44,
      sessionsErrorChangePercent: -8,
    },
    handlers: buildHandlers(46),
    createdAt: '22.02.2024',
    createdBy: 'Marc Lobinger',
  },
  {
    id: 'ce-4',
    name: 'Willkommensnachricht Neukunde',
    description: 'Begrüßt neue Kunden nach dem ersten Kauf.',
    status: 'draft',
    versionMajor: 0,
    versionMinor: 1,
    image: happyImage,
    message: {
      greeting: 'Hallo {Vorname}',
      body: 'Herzlich willkommen bei uns! Wir freuen uns, dich als Kunden begrüßen zu dürfen.',
      signature: 'Viele Grüße dein Team',
      buttons: ['Zur Website'],
    },
    trigger: { contactField: 'purchase-date', offsetDirection: 'after', offsetDays: 1 },
    conditions: [{ field: 'customer-type', operator: 'equals', value: 'Neukunde' }],
    actions: { vorgang: 'none', sichtbarkeit: 'none', status: 'none' },
    assignee: 'none',
    errorHandling: 'none',
    stats: {
      handlerCount: 0,
      handlerPercent: 0,
      contactCount: 0,
      contactCountChangePercent: 0,
      durationPerSession: '0 min',
      durationChangePercent: 0,
      sessionsPerContact: 0,
      sessionsPerContactChangePercent: 0,
      sessions: 0,
      sessionsChangePercent: 0,
      sessionsCompleted: 0,
      sessionsCompletedChangePercent: 0,
      sessionsActive: 0,
      sessionsActiveChangePercent: 0,
      sessionsError: 0,
      sessionsErrorChangePercent: 0,
    },
    handlers: buildHandlers(0),
    createdAt: '18.06.2024',
    createdBy: 'Nadja Berger',
  },
  {
    id: 'ce-5',
    name: 'Winterreifen-Erinnerung',
    description: 'Erinnert Kunden jährlich an den Wechsel auf Winterreifen.',
    status: 'archived',
    versionMajor: 1,
    versionMinor: 4,
    image: eautoImage,
    message: {
      greeting: 'Hallo {Vorname}',
      body: 'Der Winter steht vor der Tür - Zeit für den Reifenwechsel. Vereinbare jetzt deinen Termin.',
      signature: 'Viele Grüße dein Werkstattteam',
      buttons: ['Termin vereinbaren'],
    },
    trigger: { contactField: 'contract-renewal', offsetDirection: 'before', offsetDays: 14 },
    conditions: [],
    actions: { vorgang: 'existing', sichtbarkeit: 'none', status: 'none' },
    assignee: 'none',
    errorHandling: 'none',
    stats: {
      handlerCount: 12,
      handlerPercent: 60,
      contactCount: 240,
      contactCountChangePercent: -8,
      durationPerSession: '1,55 min',
      durationChangePercent: -1,
      sessionsPerContact: 1.2,
      sessionsPerContactChangePercent: -2,
      sessions: 288,
      sessionsChangePercent: -5,
      sessionsCompleted: 250,
      sessionsCompletedChangePercent: -4,
      sessionsActive: 10,
      sessionsActiveChangePercent: -1,
      sessionsError: 28,
      sessionsErrorChangePercent: 2,
    },
    handlers: buildHandlers(12),
    createdAt: '02.11.2022',
    createdBy: 'Marc Lobinger',
  },
]

export function getContactEventById(id: string): ContactEvent | undefined {
  return contactEvents.find(e => e.id === id)
}

export function filterContactEventsByStatus(events: ContactEvent[], status: ContactEventStatus): ContactEvent[] {
  return events.filter(e => e.status === status)
}

import marleneSchreiber from '../assets/contacts/marlene_schreiber.jpg'
import stefanOppermann from '../assets/contacts/stefan_oppermann.jpg'
import annKatrinBerger from '../assets/contacts/ann_katrin_berger.jpg'
import antonDaubner from '../assets/contacts/anton_daubner.jpg'
import barbaraDechant from '../assets/contacts/barbara_dechant.jpg'
import luisaSchwarz from '../assets/contacts/luisa_schwarz.jpg'
import janeDoe from '../assets/contacts/jane_doe.jpg'
import marcLobinger from '../assets/users/marc_lobinger.jpg'
import nadjaSchwarz from '../assets/users/nadja_schwarz.jpg'
import brittaDrechsler from '../assets/users/britta_drechsler.jpg'
import peterWollner from '../assets/users/peter_wollner.jpg'
import felixLugner from '../assets/users/felix_lugner.jpg'

export type DialogTab = 'mine' | 'team' | 'leads' | 'done' | 'spam' | 'trash'
export type TimeGroup = 'action_needed' | 'last_24h' | 'older'
export type DialogChannel = 'whatsapp' | 'facebook' | 'email' | 'phone'
export type MessageType =
  | 'incoming'
  | 'outgoing'
  | 'date_divider'
  | 'button'
  | 'template'
  | 'internal_note'
  | 'review'

export type ChatMessage = {
  id: string
  type: MessageType
  content?: string
  date?: string
  time?: string
  readStatus?: string
  agentName?: string
  agentImg?: string
  channel?: DialogChannel
  buttonLabel?: string
  templateLabel?: string
  rating?: number
  reviewText?: string
}

export type SidebarDocument = {
  id: string
  title: string
  subtitle: string
}

export type SidebarTask = {
  id: string
  title: string
  dueDate: string
  assignee: string
  assigneeImg: string
}

export type SidebarAction = {
  date: string
  title: string
  subtitle?: string
  done: boolean
}

export type RelatedDialog = {
  id: string
  title: string
  product: string
  assignee: string
  assigneeImg: string
  completed?: boolean
}

export type Dialog = {
  id: string
  tab: DialogTab
  timeGroup: TimeGroup
  contactFirstName: string
  contactLastName: string
  contactImg?: string
  title: string
  product: string
  team: string
  customerType: string
  labels: string[]
  incomingChannel: string
  owner: string
  ownerImg: string
  birthDate?: string
  birthDateNote?: string
  address?: string
  contactPerson?: string
  contactPersonImg?: string
  contactLabels?: string[]
  contactTags?: string[]
  lastMessage: string
  lastMessageTime: string
  channel: DialogChannel
  actionNeeded: boolean
  unreadCount: number
  hasPhotos?: boolean
  photoCount?: number
  hasVideo?: boolean
  messages: ChatMessage[]
  actions: SidebarAction[]
  tasks: SidebarTask[]
  documents: SidebarDocument[]
  relatedDialogs: RelatedDialog[]
  completedDialogsCount: number
}

const marleneChat: ChatMessage[] = [
  { id: 'm1', type: 'date_divider', date: '24.06.2024' },
  {
    id: 'm2',
    type: 'incoming',
    content: 'Hallo, ich interessiere mich für einen neuen Mobilfunktarif. Können Sie mir ein Angebot erstellen?',
    time: '10:23',
  },
  {
    id: 'm3',
    type: 'outgoing',
    content:
      'Guten Tag Frau Schreiber, gerne helfe ich Ihnen dabei. Damit ich Ihnen das passende Angebot erstellen kann, benötige ich noch ein paar Informationen von Ihnen.',
    time: '10:45',
    readStatus: 'Gelesen 10:47',
    agentName: 'Marc L.',
    agentImg: marcLobinger,
    channel: 'whatsapp',
  },
  {
    id: 'm4',
    type: 'incoming',
    content: 'Ich nutze aktuell etwa 8 GB pro Monat und telefoniere regelmäßig ins Festnetz.',
    time: '11:02',
  },
  {
    id: 'm5',
    type: 'outgoing',
    content: 'Vielen Dank für die Informationen. Ich bereite Ihnen ein individuelles Angebot vor.',
    time: '11:15',
    readStatus: 'Gelesen 11:18',
    agentName: 'Marc L.',
    agentImg: marcLobinger,
    channel: 'whatsapp',
  },
  { id: 'm6', type: 'button', buttonLabel: 'Haftpflichtversicherungen' },
  { id: 'm7', type: 'date_divider', date: 'Gestern' },
  {
    id: 'm8',
    type: 'template',
    templateLabel: 'WhatsApp Template',
    content:
      'Guten Tag Frau Schreiber,\n\nanbei erhalten Sie Ihr persönliches Mobilfunk-Angebot. Bei Fragen stehe ich Ihnen gerne zur Verfügung.\n\nMit freundlichen Grüßen\nMarc Lobinger',
    time: '14:30',
    readStatus: 'Gelesen 15:12',
    agentName: 'Marc L.',
    agentImg: marcLobinger,
    channel: 'whatsapp',
  },
  {
    id: 'm9',
    type: 'internal_note',
    content: 'Kundin hat Interesse an Zusatzversicherung geäußert. Beim nächsten Gespräch ansprechen.',
    time: '14:35',
    agentName: 'Marc L.',
    agentImg: marcLobinger,
  },
  { id: 'm10', type: 'date_divider', date: 'Heute' },
  {
    id: 'm11',
    type: 'review',
    rating: 5,
    reviewText: 'Sehr freundliche Beratung, schnelle Rückmeldung. Bin sehr zufrieden!',
    time: '9:30',
  },
  {
    id: 'm12',
    type: 'incoming',
    content: 'Vielen Dank für das Angebot! Ich habe noch eine Frage zur Laufzeit.',
    time: '9:42',
  },
  {
    id: 'm13',
    type: 'outgoing',
    content: 'Gerne beantworte ich Ihre Frage. Die Mindestlaufzeit beträgt 24 Monate mit monatlicher Kündigungsoption ab dem 25. Monat.',
    time: '9:45',
    readStatus: 'Gelesen 9:45',
    agentName: 'Marc L.',
    agentImg: marcLobinger,
    channel: 'whatsapp',
  },
]

export const dialogs: Dialog[] = [
  {
    id: 'd1',
    tab: 'mine',
    timeGroup: 'action_needed',
    contactFirstName: 'Marlene',
    contactLastName: 'Schreiber',
    contactImg: marleneSchreiber,
    title: 'Neuvertrag Mobilfunk',
    product: 'Internet',
    team: 'Shop Berlin',
    customerType: 'Privatkunde',
    labels: ['Vertragsverlängerung'],
    incomingChannel: '+49 8945 45676453',
    owner: 'Marc Lobinger',
    ownerImg: marcLobinger,
    birthDate: '14.03.1998',
    birthDateNote: 'In 65 Tagen',
    address: 'Bergstraße 4, 48064 Rostock',
    contactPerson: 'Marc Lobinger',
    contactPersonImg: marcLobinger,
    contactLabels: ['Gewinnspiel'],
    contactTags: ['Duplikat'],
    lastMessage: 'Vielen Dank für das Angebot! Ich habe noch eine Frage zur Laufzeit.',
    lastMessageTime: '9:42',
    channel: 'whatsapp',
    actionNeeded: false,
    unreadCount: 0,
    messages: marleneChat,
    actions: [
      { date: '15.09.2026', title: 'Automation ausgelöst', subtitle: 'Kundenbefragung', done: true },
      { date: '24.08.2026', title: 'Newsletter erhalten', subtitle: 'Sommer-Angebote', done: true },
      { date: '04.07.2026', title: 'Opt-In erteilt', subtitle: 'Manuell erteilt durch Marc Lobinger', done: true },
    ],
    tasks: [
      { id: 't1', title: 'Angebot verschicken', dueDate: 'Heute', assignee: 'Marc Lobinger', assigneeImg: marcLobinger },
      { id: 't2', title: 'Beratungstermin vereinbaren', dueDate: 'In 6 Tagen', assignee: 'Nadja Schwarz', assigneeImg: nadjaSchwarz },
    ],
    documents: [
      { id: 'doc1', title: 'Angebot', subtitle: 'Versendet heute' },
      { id: 'doc2', title: 'Produktinformation', subtitle: 'Versendet vor 4 Tagen' },
      { id: 'doc3', title: 'Bild Schaden 2', subtitle: 'Empfangen vor 6 Tagen' },
      { id: 'doc4', title: 'Bild Schaden 1', subtitle: 'Empfangen vor 6 Tagen' },
    ],
    relatedDialogs: [
      { id: 'rd1', title: 'Neuvertrag Mobilfunk', product: 'Internet', assignee: 'Marc Lobinger', assigneeImg: marcLobinger },
      { id: 'rd2', title: 'Vertragsverlängerung TV', product: 'TV', assignee: 'Nadja Schwarz', assigneeImg: nadjaSchwarz },
      { id: 'rd3', title: 'Vertrag Business Cloud', product: 'Cloud', assignee: 'Nadja Schwarz', assigneeImg: nadjaSchwarz },
    ],
    completedDialogsCount: 1,
  },
  {
    id: 'd2',
    tab: 'mine',
    timeGroup: 'action_needed',
    contactFirstName: 'Stefan',
    contactLastName: 'Oppermann',
    contactImg: stefanOppermann,
    title: 'Vertragsverlängerung Mobilfunk',
    product: 'Mobilfunk',
    team: 'Shop Bamberg',
    customerType: 'Geschäftskunde',
    labels: [],
    incomingChannel: '+49 951 1234567',
    owner: 'Marc Lobinger',
    ownerImg: marcLobinger,
    lastMessage: 'Können wir den Termin auf nächste Woche verschieben?',
    lastMessageTime: '34 Min',
    channel: 'whatsapp',
    actionNeeded: true,
    unreadCount: 1,
    messages: [
      { id: 's1', type: 'date_divider', date: 'Heute' },
      { id: 's2', type: 'incoming', content: 'Können wir den Termin auf nächste Woche verschieben?', time: '13:56' },
    ],
    actions: [],
    tasks: [],
    documents: [],
    relatedDialogs: [],
    completedDialogsCount: 0,
  },
  {
    id: 'd3',
    tab: 'mine',
    timeGroup: 'action_needed',
    contactFirstName: 'Ann-Katrin',
    contactLastName: 'Berger',
    contactImg: annKatrinBerger,
    title: 'Neuvertrag Internet',
    product: 'Internet',
    team: 'Shop Berlin',
    customerType: 'Privatkunde',
    labels: ['Neukunde'],
    incomingChannel: '+49 30 9876543',
    owner: 'Marc Lobinger',
    ownerImg: marcLobinger,
    lastMessage: '4 Fotos',
    lastMessageTime: '1 Std',
    channel: 'whatsapp',
    actionNeeded: true,
    unreadCount: 1,
    hasPhotos: true,
    photoCount: 4,
    messages: [
      { id: 'a1', type: 'date_divider', date: 'Heute' },
      { id: 'a2', type: 'incoming', content: 'Hier sind die Fotos vom Anschluss.', time: '12:30' },
    ],
    actions: [],
    tasks: [],
    documents: [],
    relatedDialogs: [],
    completedDialogsCount: 0,
  },
  {
    id: 'd4',
    tab: 'mine',
    timeGroup: 'last_24h',
    contactFirstName: 'Barbara',
    contactLastName: 'Dechant',
    contactImg: barbaraDechant,
    title: 'Störung Festnetz',
    product: 'Festnetz',
    team: 'Support',
    customerType: 'Privatkunde',
    labels: [],
    incomingChannel: '+49 951 5551234',
    owner: 'Marc Lobinger',
    ownerImg: marcLobinger,
    lastMessage: 'Die Verbindung funktioniert wieder, danke!',
    lastMessageTime: '4 Std',
    channel: 'whatsapp',
    actionNeeded: false,
    unreadCount: 0,
    messages: [
      { id: 'b1', type: 'date_divider', date: 'Gestern' },
      { id: 'b2', type: 'incoming', content: 'Seit heute Morgen kein Internet.', time: '08:15' },
      {
        id: 'b3',
        type: 'outgoing',
        content: 'Wir prüfen die Leitung. Ich melde mich in Kürze.',
        time: '08:30',
        readStatus: 'Gelesen 08:32',
        agentName: 'Marc L.',
        agentImg: marcLobinger,
        channel: 'whatsapp',
      },
      { id: 'b4', type: 'date_divider', date: 'Heute' },
      { id: 'b5', type: 'incoming', content: 'Die Verbindung funktioniert wieder, danke!', time: '10:00' },
    ],
    actions: [],
    tasks: [],
    documents: [],
    relatedDialogs: [],
    completedDialogsCount: 0,
  },
  {
    id: 'd5',
    tab: 'mine',
    timeGroup: 'last_24h',
    contactFirstName: 'Luisa',
    contactLastName: 'Schwarz',
    contactImg: luisaSchwarz,
    title: 'Tarifwechsel Mobilfunk',
    product: 'Mobilfunk',
    team: 'Shop Bamberg',
    customerType: 'Privatkunde',
    labels: [],
    incomingChannel: '+49 176 1234567',
    owner: 'Marc Lobinger',
    ownerImg: marcLobinger,
    lastMessage: 'Video',
    lastMessageTime: '18 Std',
    channel: 'whatsapp',
    actionNeeded: false,
    unreadCount: 0,
    hasVideo: true,
    messages: [
      { id: 'l1', type: 'date_divider', date: 'Gestern' },
      { id: 'l2', type: 'incoming', content: 'Ich habe ein Video zur Vertragskündigung geschickt.', time: '18:00' },
    ],
    actions: [],
    tasks: [],
    documents: [],
    relatedDialogs: [],
    completedDialogsCount: 0,
  },
  {
    id: 'd6',
    tab: 'mine',
    timeGroup: 'older',
    contactFirstName: 'Anton',
    contactLastName: 'Daubner',
    contactImg: antonDaubner,
    title: 'Vertragsverlängerung TV',
    product: 'TV',
    team: 'Shop Berlin',
    customerType: 'Privatkunde',
    labels: [],
    incomingChannel: '+49 89 7654321',
    owner: 'Marc Lobinger',
    ownerImg: marcLobinger,
    lastMessage: 'Alles klar, vielen Dank!',
    lastMessageTime: '2 Tage',
    channel: 'phone',
    actionNeeded: false,
    unreadCount: 0,
    messages: [
      { id: 'ad1', type: 'date_divider', date: '04.07.2026' },
      { id: 'ad2', type: 'incoming', content: 'Alles klar, vielen Dank!', time: '16:00' },
    ],
    actions: [],
    tasks: [],
    documents: [],
    relatedDialogs: [],
    completedDialogsCount: 0,
  },
  {
    id: 'd7',
    tab: 'mine',
    timeGroup: 'older',
    contactFirstName: 'Jane',
    contactLastName: 'Doe',
    contactImg: janeDoe,
    title: 'Cloud-Speicher Upgrade',
    product: 'Cloud',
    team: 'Online-Shop',
    customerType: 'Privatkunde',
    labels: [],
    incomingChannel: 'jane.doe@email.de',
    owner: 'Marc Lobinger',
    ownerImg: marcLobinger,
    lastMessage: 'Wann wird das Upgrade aktiv?',
    lastMessageTime: '3 Tage',
    channel: 'email',
    actionNeeded: false,
    unreadCount: 0,
    messages: [
      { id: 'jd1', type: 'date_divider', date: '03.07.2026' },
      { id: 'jd2', type: 'incoming', content: 'Wann wird das Upgrade aktiv?', time: '11:00' },
    ],
    actions: [],
    tasks: [],
    documents: [],
    relatedDialogs: [],
    completedDialogsCount: 0,
  },
  {
    id: 'd8',
    tab: 'team',
    timeGroup: 'action_needed',
    contactFirstName: 'Franz',
    contactLastName: 'Markward',
    title: 'Großkundenvertrag',
    product: 'Internet',
    team: 'Shop Bamberg',
    customerType: 'Geschäftskunde',
    labels: ['VIP'],
    incomingChannel: '+49 951 7778899',
    owner: 'Britta Drechsler',
    ownerImg: brittaDrechsler,
    lastMessage: 'Bitte um Rückruf bezüglich des Angebots.',
    lastMessageTime: '20 Min',
    channel: 'whatsapp',
    actionNeeded: true,
    unreadCount: 2,
    messages: [
      { id: 'fm1', type: 'date_divider', date: 'Heute' },
      { id: 'fm2', type: 'incoming', content: 'Bitte um Rückruf bezüglich des Angebots.', time: '14:10' },
    ],
    actions: [],
    tasks: [],
    documents: [],
    relatedDialogs: [],
    completedDialogsCount: 0,
  },
  {
    id: 'd9',
    tab: 'team',
    timeGroup: 'action_needed',
    contactFirstName: 'Friedrich',
    contactLastName: 'Domeier',
    title: 'Vertragsverlängerung Cloud',
    product: 'Cloud',
    team: 'Shop Bamberg',
    customerType: 'Geschäftskunde',
    labels: ['VIP'],
    incomingChannel: '+49 951 3334455',
    owner: 'Peter Wollner',
    ownerImg: peterWollner,
    lastMessage: 'Können Sie mir die Konditionen per E-Mail senden?',
    lastMessageTime: '45 Min',
    channel: 'email',
    actionNeeded: true,
    unreadCount: 1,
    messages: [
      { id: 'fd1', type: 'date_divider', date: 'Heute' },
      { id: 'fd2', type: 'incoming', content: 'Können Sie mir die Konditionen per E-Mail senden?', time: '13:45' },
    ],
    actions: [],
    tasks: [],
    documents: [],
    relatedDialogs: [],
    completedDialogsCount: 0,
  },
  {
    id: 'd10',
    tab: 'team',
    timeGroup: 'last_24h',
    contactFirstName: 'Henriette',
    contactLastName: 'Schwarz',
    title: 'Neuvertrag Festnetz',
    product: 'Festnetz',
    team: 'Shop Berlin',
    customerType: 'Privatkunde',
    labels: [],
    incomingChannel: '+49 30 1122334',
    owner: 'Nadja Schwarz',
    ownerImg: nadjaSchwarz,
    lastMessage: 'Terminbestätigung erhalten.',
    lastMessageTime: '6 Std',
    channel: 'whatsapp',
    actionNeeded: false,
    unreadCount: 0,
    messages: [
      { id: 'hs1', type: 'date_divider', date: 'Gestern' },
      { id: 'hs2', type: 'incoming', content: 'Terminbestätigung erhalten.', time: '09:00' },
    ],
    actions: [],
    tasks: [],
    documents: [],
    relatedDialogs: [],
    completedDialogsCount: 0,
  },
  {
    id: 'd11',
    tab: 'team',
    timeGroup: 'older',
    contactFirstName: 'Gerhard',
    contactLastName: 'Klusen',
    title: 'Router-Austausch',
    product: 'Internet',
    team: 'Support',
    customerType: 'Privatkunde',
    labels: [],
    incomingChannel: '+49 951 6667788',
    owner: 'Felix Lugner',
    ownerImg: felixLugner,
    lastMessage: 'Router ist angekommen.',
    lastMessageTime: '5 Tage',
    channel: 'phone',
    actionNeeded: false,
    unreadCount: 0,
    messages: [
      { id: 'gk1', type: 'date_divider', date: '01.07.2026' },
      { id: 'gk2', type: 'incoming', content: 'Router ist angekommen.', time: '14:00' },
    ],
    actions: [],
    tasks: [],
    documents: [],
    relatedDialogs: [],
    completedDialogsCount: 0,
  },
  {
    id: 'd12',
    tab: 'team',
    timeGroup: 'older',
    contactFirstName: 'Janine',
    contactLastName: 'Berger',
    title: 'Beratung Mobilfunk',
    product: 'Mobilfunk',
    team: 'Shop Bamberg',
    customerType: 'Privatkunde',
    labels: [],
    incomingChannel: '+49 951 9990011',
    owner: 'Britta Drechsler',
    ownerImg: brittaDrechsler,
    lastMessage: 'Vielen Dank für die Beratung!',
    lastMessageTime: '1 Woche',
    channel: 'facebook',
    actionNeeded: false,
    unreadCount: 0,
    messages: [
      { id: 'jb1', type: 'date_divider', date: '29.06.2026' },
      { id: 'jb2', type: 'incoming', content: 'Vielen Dank für die Beratung!', time: '17:00' },
    ],
    actions: [],
    tasks: [],
    documents: [],
    relatedDialogs: [],
    completedDialogsCount: 0,
  },
  {
    id: 'd13',
    tab: 'leads',
    timeGroup: 'action_needed',
    contactFirstName: 'Bernhard',
    contactLastName: 'Klapproth',
    title: 'Interesse Internet',
    product: 'Internet',
    team: 'Online-Shop',
    customerType: 'Privatkunde',
    labels: ['Lead'],
    incomingChannel: '+49 951 4445566',
    owner: 'Marc Lobinger',
    ownerImg: marcLobinger,
    lastMessage: 'Ich möchte mehr über Ihre Internet-Tarife erfahren.',
    lastMessageTime: '15 Min',
    channel: 'whatsapp',
    actionNeeded: true,
    unreadCount: 1,
    messages: [
      { id: 'bk1', type: 'date_divider', date: 'Heute' },
      { id: 'bk2', type: 'incoming', content: 'Ich möchte mehr über Ihre Internet-Tarife erfahren.', time: '14:15' },
    ],
    actions: [],
    tasks: [],
    documents: [],
    relatedDialogs: [],
    completedDialogsCount: 0,
  },
  {
    id: 'd14',
    tab: 'leads',
    timeGroup: 'action_needed',
    contactFirstName: 'Dieter',
    contactLastName: 'Schreiber',
    title: 'Anfrage TV-Paket',
    product: 'TV',
    team: 'Shop Berlin',
    customerType: 'Privatkunde',
    labels: ['Lead'],
    incomingChannel: '+49 30 5566778',
    owner: 'Nadja Schwarz',
    ownerImg: nadjaSchwarz,
    lastMessage: 'Welche Sender sind im Premium-Paket enthalten?',
    lastMessageTime: '1 Std',
    channel: 'whatsapp',
    actionNeeded: true,
    unreadCount: 1,
    messages: [
      { id: 'ds1', type: 'date_divider', date: 'Heute' },
      { id: 'ds2', type: 'incoming', content: 'Welche Sender sind im Premium-Paket enthalten?', time: '13:30' },
    ],
    actions: [],
    tasks: [],
    documents: [],
    relatedDialogs: [],
    completedDialogsCount: 0,
  },
  {
    id: 'd15',
    tab: 'leads',
    timeGroup: 'last_24h',
    contactFirstName: 'Anton',
    contactLastName: 'Klaubner',
    title: 'Cloud-Anfrage',
    product: 'Cloud',
    team: 'Online-Shop',
    customerType: 'Geschäftskunde',
    labels: ['Lead'],
    incomingChannel: 'anton.klaubner@firma.de',
    owner: 'Peter Wollner',
    ownerImg: peterWollner,
    lastMessage: 'Benötigen Speicherlösung für 50 Mitarbeiter.',
    lastMessageTime: '8 Std',
    channel: 'email',
    actionNeeded: false,
    unreadCount: 1,
    messages: [
      { id: 'ak1', type: 'date_divider', date: 'Gestern' },
      { id: 'ak2', type: 'incoming', content: 'Benötigen Speicherlösung für 50 Mitarbeiter.', time: '07:00' },
    ],
    actions: [],
    tasks: [],
    documents: [],
    relatedDialogs: [],
    completedDialogsCount: 0,
  },
  {
    id: 'd16',
    tab: 'leads',
    timeGroup: 'older',
    contactFirstName: 'Erika',
    contactLastName: 'Müller',
    title: 'Festnetz-Anfrage',
    product: 'Festnetz',
    team: 'Shop Bamberg',
    customerType: 'Privatkunde',
    labels: ['Lead'],
    incomingChannel: '+49 951 2223344',
    owner: 'Felix Lugner',
    ownerImg: felixLugner,
    lastMessage: 'Gibt es einen Kombi-Tarif mit Mobilfunk?',
    lastMessageTime: '4 Tage',
    channel: 'phone',
    actionNeeded: false,
    unreadCount: 0,
    messages: [
      { id: 'em1', type: 'date_divider', date: '02.07.2026' },
      { id: 'em2', type: 'incoming', content: 'Gibt es einen Kombi-Tarif mit Mobilfunk?', time: '10:00' },
    ],
    actions: [],
    tasks: [],
    documents: [],
    relatedDialogs: [],
    completedDialogsCount: 0,
  },
  {
    id: 'd17',
    tab: 'mine',
    timeGroup: 'older',
    contactFirstName: 'Klaus',
    contactLastName: 'Weber',
    title: 'Rechnungsanfrage',
    product: 'Mobilfunk',
    team: 'Support',
    customerType: 'Privatkunde',
    labels: [],
    incomingChannel: '+49 176 9988776',
    owner: 'Marc Lobinger',
    ownerImg: marcLobinger,
    lastMessage: 'Rechnung erhalten, danke.',
    lastMessageTime: '1 Woche',
    channel: 'whatsapp',
    actionNeeded: false,
    unreadCount: 0,
    messages: [
      { id: 'kw1', type: 'date_divider', date: '29.06.2026' },
      { id: 'kw2', type: 'incoming', content: 'Rechnung erhalten, danke.', time: '11:00' },
    ],
    actions: [],
    tasks: [],
    documents: [],
    relatedDialogs: [],
    completedDialogsCount: 0,
  },
  {
    id: 'd18',
    tab: 'mine',
    timeGroup: 'older',
    contactFirstName: 'Sabine',
    contactLastName: 'Hoffmann',
    title: 'Kündigungsbestätigung',
    product: 'TV',
    team: 'Shop Berlin',
    customerType: 'Privatkunde',
    labels: [],
    incomingChannel: '+49 30 4455667',
    owner: 'Marc Lobinger',
    ownerImg: marcLobinger,
    lastMessage: 'Kündigung bestätigt.',
    lastMessageTime: '2 Wochen',
    channel: 'email',
    actionNeeded: false,
    unreadCount: 0,
    messages: [
      { id: 'sh1', type: 'date_divider', date: '22.06.2026' },
      { id: 'sh2', type: 'incoming', content: 'Kündigung bestätigt.', time: '09:00' },
    ],
    actions: [],
    tasks: [],
    documents: [],
    relatedDialogs: [],
    completedDialogsCount: 0,
  },
  {
    id: 'd19',
    tab: 'team',
    timeGroup: 'older',
    contactFirstName: 'Thomas',
    contactLastName: 'Bauer',
    title: 'SIM-Karten Bestellung',
    product: 'Mobilfunk',
    team: 'Shop Bamberg',
    customerType: 'Geschäftskunde',
    labels: [],
    incomingChannel: '+49 951 8889900',
    owner: 'Britta Drechsler',
    ownerImg: brittaDrechsler,
    lastMessage: 'SIM-Karten sind unterwegs.',
    lastMessageTime: '10 Tage',
    channel: 'whatsapp',
    actionNeeded: false,
    unreadCount: 0,
    messages: [
      { id: 'tb1', type: 'date_divider', date: '26.06.2026' },
      { id: 'tb2', type: 'incoming', content: 'SIM-Karten sind unterwegs.', time: '15:00' },
    ],
    actions: [],
    tasks: [],
    documents: [],
    relatedDialogs: [],
    completedDialogsCount: 0,
  },
  {
    id: 'd20',
    tab: 'leads',
    timeGroup: 'older',
    contactFirstName: 'Ute',
    contactLastName: 'Fischer',
    title: 'Smartphone-Anfrage',
    product: 'Mobilfunk',
    team: 'Shop Berlin',
    customerType: 'Privatkunde',
    labels: ['Lead'],
    incomingChannel: '+49 30 7788990',
    owner: 'Nadja Schwarz',
    ownerImg: nadjaSchwarz,
    lastMessage: 'Welche Modelle sind verfügbar?',
    lastMessageTime: '2 Wochen',
    channel: 'facebook',
    actionNeeded: false,
    unreadCount: 0,
    messages: [
      { id: 'uf1', type: 'date_divider', date: '22.06.2026' },
      { id: 'uf2', type: 'incoming', content: 'Welche Modelle sind verfügbar?', time: '14:00' },
    ],
    actions: [],
    tasks: [],
    documents: [],
    relatedDialogs: [],
    completedDialogsCount: 0,
  },
]

export const TIME_GROUP_LABELS: Record<TimeGroup, string> = {
  action_needed: 'Aktion notwendig',
  last_24h: 'Letzte 24 Stunden',
  older: 'Älter',
}

export const TIME_GROUP_ORDER: TimeGroup[] = ['action_needed', 'last_24h', 'older']

export function getTabUnreadCounts(): Record<'mine' | 'team' | 'leads', number> {
  const sum = (tab: DialogTab) =>
    dialogs.filter(d => d.tab === tab).reduce((acc, d) => acc + d.unreadCount, 0)
  return { mine: sum('mine'), team: sum('team'), leads: sum('leads') }
}

export function filterDialogs(tab: DialogTab, search: string): Dialog[] {
  const q = search.trim().toLowerCase()
  let list = dialogs

  if (q) {
    list = list.filter(d =>
      d.contactFirstName.toLowerCase().includes(q) ||
      d.contactLastName.toLowerCase().includes(q) ||
      d.title.toLowerCase().includes(q) ||
      d.lastMessage.toLowerCase().includes(q) ||
      d.product.toLowerCase().includes(q) ||
      d.team.toLowerCase().includes(q),
    )
  } else {
    list = list.filter(d => d.tab === tab)
  }

  return list
}

export function groupDialogsByTime(dialogList: Dialog[]): Record<TimeGroup, Dialog[]> {
  const groups: Record<TimeGroup, Dialog[]> = {
    action_needed: [],
    last_24h: [],
    older: [],
  }
  for (const d of dialogList) {
    groups[d.timeGroup].push(d)
  }
  return groups
}

import { useState } from 'react'
import { Row, Col, Card, Avatar, Typography, Flex, Checkbox } from 'antd'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faCircleInfo,
  faCircleCheck,
  faCircleXmark,
  faCircleQuestion,
  faCalendar,
  faChevronRight,
  faChevronDown,
  faChevronUp,
  faPenToSquare,
  faEnvelope,
  faMessage,
  faUser,
} from '@fortawesome/pro-light-svg-icons'
import { faWhatsapp, faFacebook, faGoogle } from '@fortawesome/free-brands-svg-icons'
import PageLayout from '../designsystem/sharedComponents/PageLayout'

const { Text } = Typography

// ─── types ────────────────────────────────────────────────────────────────────

type Channel = 'wa' | 'email' | 'fb' | 'google'

type CampaignDetail = {
  time: string
  empfaenger: number
  channels: Channel[]
  conversations: number
}

type Campaign = {
  id: string
  title: string
  date: string
  img: string
  empfaenger: number
  channels: Channel[]
  conversations: number
  action: 'edit' | 'expand'
  details?: CampaignDetail[]
}

// ─── data ─────────────────────────────────────────────────────────────────────

const teamMembers = [
  { name: 'Felix Lugner', hours: '09:00 – 18:00', online: true, birthday: false, img: 'https://i.pravatar.cc/40?img=11' },
  { name: 'Marc Lobinger', hours: '09:00 – 18:00', online: false, birthday: true, img: 'https://i.pravatar.cc/40?img=14' },
  { name: 'Nadja Schwarz', hours: '08:00–12:00, 13:00–19:00', online: true, birthday: false, img: 'https://i.pravatar.cc/40?img=23' },
]

const campaigns: Campaign[] = [
  {
    id: 'c1',
    title: 'Produktneuheiten Juni',
    date: '03.06.2024',
    img: 'https://picsum.photos/seed/p1/80/80',
    empfaenger: 168,
    channels: ['wa', 'email', 'fb'],
    conversations: 68,
    action: 'edit',
  },
  {
    id: 'c2',
    title: 'Produktneuheiten Juni',
    date: '03.06.2024',
    img: 'https://picsum.photos/seed/p2/80/80',
    empfaenger: 168,
    channels: ['wa', 'email', 'fb'],
    conversations: 68,
    action: 'expand',
    details: [],
  },
  {
    id: 'c3',
    title: 'Produktneuheiten Mai',
    date: '10.05.2024',
    img: 'https://picsum.photos/seed/p3/80/80',
    empfaenger: 128,
    channels: ['wa', 'google', 'email', 'fb'],
    conversations: 36,
    action: 'expand',
    details: [
      { time: '9:32 Uhr', empfaenger: 23, channels: ['wa', 'email'], conversations: 5 },
      { time: '9:46 Uhr', empfaenger: 14, channels: ['wa'], conversations: 8 },
    ],
  },
]

// ─── helper components ────────────────────────────────────────────────────────

function SeeAllLink({ label = 'Alle ansehen' }: { label?: string }) {
  return (
    <a style={{ color: '#8c8c8c', fontSize: 13, display: 'inline-flex', alignItems: 'center', gap: 3 }}>
      {label} <FontAwesomeIcon icon={faChevronRight} style={{ fontSize: 10 }} />
    </a>
  )
}

function Channels({ types }: { types: Channel[] }) {
  return (
    <Flex gap={3} align="center">
      {types.includes('wa') && <FontAwesomeIcon icon={faWhatsapp} style={{ color: '#25D366', fontSize: 16 }} />}
      {types.includes('email') && <FontAwesomeIcon icon={faEnvelope} style={{ color: '#1677ff', fontSize: 16 }} />}
      {types.includes('fb') && <FontAwesomeIcon icon={faFacebook} style={{ color: '#1877F2', fontSize: 16 }} />}
      {types.includes('google') && <FontAwesomeIcon icon={faGoogle} style={{ color: '#EA4335', fontSize: 16 }} />}
    </Flex>
  )
}

function OnlineDot() {
  return (
    <div style={{
      width: 9, height: 9, borderRadius: '50%', background: '#52c41a',
      position: 'absolute', bottom: 0, right: 0, border: '1.5px solid #fff',
    }} />
  )
}

// ─── left column sections ─────────────────────────────────────────────────────

function StatsRow() {
  const stats = [
    {
      icon: <FontAwesomeIcon icon={faMessage} style={{ fontSize: 16 }} />,
      title: 'Neukunden',
      values: [{ n: 8, label: 'Vorgänge' }],
    },
    {
      icon: <FontAwesomeIcon icon={faCircleCheck} style={{ fontSize: 16 }} />,
      title: 'Vorgänge',
      values: [{ n: 12, label: 'Meine' }, { n: 45, label: 'Team' }],
    },
    {
      icon: <FontAwesomeIcon icon={faUser} style={{ fontSize: 16 }} />,
      title: 'Kunden',
      values: [{ n: 64, label: 'Meine' }, { n: 451, label: 'Gesamt' }],
    },
  ]

  return (
    <Row gutter={12}>
      {stats.map(({ icon, title, values }) => (
        <Col span={8} key={title}>
          <Card styles={{ body: { padding: '14px 20px' } }}>
            <Flex align="center" gap={6} style={{ marginBottom: 10 }}>
              {icon}
              <Text strong style={{ fontSize: 14 }}>{title}</Text>
              <FontAwesomeIcon icon={faCircleInfo} style={{ color: '#bfbfbf', fontSize: 12 }} />
            </Flex>
            <Flex gap={20} align="baseline">
              {values.map(({ n, label }) => (
                <Flex key={label} align="baseline" gap={5}>
                  <Text style={{ fontSize: 30, fontWeight: 300, lineHeight: 1 }}>{n}</Text>
                  <Text type="secondary" style={{ fontSize: 13 }}>{label}</Text>
                </Flex>
              ))}
            </Flex>
          </Card>
        </Col>
      ))}
    </Row>
  )
}

function NewsRow() {
  const items = [
    {
      badge: 'Tipp',
      img: 'https://picsum.photos/seed/qr1/600/200',
      text: 'Nutzen Sie QR-Codes zur Einbindung Ihrer Terminbuchung? Jetzt einfach erstellen.',
    },
    {
      badge: 'Markeninformation',
      img: 'https://picsum.photos/seed/herbst1/600/200',
      text: 'Die neue Herbstkampagne ist ab sofort im Marketingportal buchbar.',
    },
  ]

  return (
    <Row gutter={12}>
      {items.map(({ badge, img, text }) => (
        <Col span={12} key={badge}>
          <Card styles={{ body: { padding: 0 } }}>
            <div style={{ position: 'relative', borderRadius: '8px 8px 0 0', overflow: 'hidden', height: 165 }}>
              <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
              <div style={{
                position: 'absolute', top: 10, left: 10,
                background: '#40929F', color: '#fff',
                padding: '3px 10px', borderRadius: 4, fontSize: 12, fontWeight: 500,
              }}>
                {badge}
              </div>
            </div>
            <div style={{ padding: '12px 16px' }}>
              <Text style={{ fontSize: 14, lineHeight: '1.5' }}>{text}</Text>
            </div>
          </Card>
        </Col>
      ))}
    </Row>
  )
}

function CampaignSection() {
  const [expanded, setExpanded] = useState<string | null>('c3')

  const toggle = (id: string) => setExpanded(prev => prev === id ? null : id)

  return (
    <Flex vertical gap={8}>
      {/* Featured campaign */}
      <Card styles={{ body: { padding: '14px 20px' } }}>
        <Flex justify="space-between" align="center" wrap="wrap" gap={16}>
          <Flex vertical gap={4}>
            <Text strong style={{ fontSize: 15 }}>Gewinnspiel Sommer</Text>
            <Flex align="center" gap={5}>
              <FontAwesomeIcon icon={faCalendar} style={{ color: '#8c8c8c', fontSize: 12 }} />
              <Text type="secondary" style={{ fontSize: 12 }}>08.10.2022 – Unbegrenzt</Text>
            </Flex>
          </Flex>
          <Flex gap={20} align="center">
            {[
              { label: 'Aktiviert', content: <Text strong style={{ fontSize: 17 }}>195</Text> },
              { label: 'Kunden', content: <Text strong style={{ fontSize: 17 }}>126</Text> },
              { label: 'Kanäle', content: <Channels types={['wa', 'email', 'fb']} /> },
              {
                label: 'Opt-In',
                content: (
                  <Flex gap={6}>
                    <Flex align="center" gap={2}>
                      <FontAwesomeIcon icon={faCircleCheck} style={{ color: '#52c41a', fontSize: 12 }} />
                      <Text style={{ fontSize: 13 }}>96</Text>
                    </Flex>
                    <Flex align="center" gap={2}>
                      <FontAwesomeIcon icon={faCircleXmark} style={{ color: '#ff4d4f', fontSize: 12 }} />
                      <Text style={{ fontSize: 13 }}>8</Text>
                    </Flex>
                    <Flex align="center" gap={2}>
                      <FontAwesomeIcon icon={faCircleQuestion} style={{ color: '#8c8c8c', fontSize: 12 }} />
                      <Text style={{ fontSize: 13 }}>22</Text>
                    </Flex>
                  </Flex>
                ),
              },
            ].map(({ label, content }) => (
              <Flex key={label} vertical align="center" gap={3}>
                <Text type="secondary" style={{ fontSize: 11 }}>{label}</Text>
                {content}
              </Flex>
            ))}
          </Flex>
        </Flex>
      </Card>

      <div style={{ paddingLeft: 4 }}>
        <SeeAllLink />
      </div>

      {/* Campaign list */}
      <Card styles={{ body: { padding: 0 } }}>
        {campaigns.map((c, i) => (
          <div key={c.id}>
            {i > 0 && <div style={{ height: 1, background: '#f0f0f0' }} />}
            <div style={{ padding: '12px 16px' }}>
              <Flex justify="space-between" align="center">
                <Flex gap={12} align="center" style={{ flex: 1, minWidth: 0 }}>
                  <img
                    src={c.img}
                    alt=""
                    style={{ width: 44, height: 44, objectFit: 'cover', borderRadius: 4, flexShrink: 0 }}
                  />
                  <Flex vertical gap={2}>
                    <Text style={{ fontWeight: 500 }}>{c.title}</Text>
                    <Flex align="center" gap={4}>
                      <FontAwesomeIcon icon={faCalendar} style={{ color: '#8c8c8c', fontSize: 11 }} />
                      <Text type="secondary" style={{ fontSize: 12 }}>{c.date}</Text>
                    </Flex>
                  </Flex>
                </Flex>
                <Flex gap={24} align="center" style={{ flexShrink: 0 }}>
                  <Flex vertical align="center" gap={1}>
                    <Text type="secondary" style={{ fontSize: 11 }}>Empfänger</Text>
                    <Text style={{ fontSize: 14 }}>{c.empfaenger}</Text>
                  </Flex>
                  <Flex vertical align="center" gap={1}>
                    <Text type="secondary" style={{ fontSize: 11 }}>Kanäle</Text>
                    <Channels types={c.channels} />
                  </Flex>
                  <Flex vertical align="center" gap={1}>
                    <Text type="secondary" style={{ fontSize: 11 }}>Conversations</Text>
                    <Text style={{ fontSize: 14 }}>{c.conversations}</Text>
                  </Flex>
                  <div
                    style={{ color: '#8c8c8c', cursor: 'pointer', width: 16, textAlign: 'center' }}
                    onClick={() => c.action === 'expand' && toggle(c.id)}
                  >
                    {c.action === 'edit' ? (
                      <FontAwesomeIcon icon={faPenToSquare} />
                    ) : expanded === c.id ? (
                      <FontAwesomeIcon icon={faChevronUp} />
                    ) : (
                      <FontAwesomeIcon icon={faChevronDown} />
                    )}
                  </div>
                </Flex>
              </Flex>

              {/* Expanded sub-rows */}
              {expanded === c.id && c.details && c.details.length > 0 && (
                <div style={{ marginTop: 8, paddingLeft: 56 }}>
                  {c.details.map((d) => (
                    <Flex key={d.time} align="center" gap={32} style={{ padding: '4px 0' }}>
                      <Text type="secondary" style={{ fontSize: 13, minWidth: 70 }}>{d.time}</Text>
                      <Text style={{ fontSize: 13, minWidth: 28 }}>{d.empfaenger}</Text>
                      <Channels types={d.channels} />
                      <Text style={{ fontSize: 13 }}>{d.conversations}</Text>
                    </Flex>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </Card>
    </Flex>
  )
}

// ─── right column sections ────────────────────────────────────────────────────

function BirthdayCard() {
  const contacts = [
    { name: 'Marlene Schreiber', subtitle: 'Heute', isToday: true, img: 'https://i.pravatar.cc/40?img=5' },
    { name: 'Anton Daubner', subtitle: 'In 4 Tagen', isToday: false, img: 'https://i.pravatar.cc/40?img=7' },
    { name: 'Luisa Schwarz', subtitle: 'In 13 Tagen', isToday: false, img: 'https://i.pravatar.cc/40?img=9' },
  ]

  return (
    <Card styles={{ body: { padding: '0 16px' } }}>
      <Flex justify="flex-end" style={{ padding: '10px 0 4px' }}>
        <SeeAllLink />
      </Flex>
      {contacts.map(({ name, subtitle, isToday, img }, i) => (
        <div key={name}>
          {i > 0 && <div style={{ height: 1, background: '#f5f5f5' }} />}
          <Flex align="center" gap={10} style={{ padding: '10px 0' }}>
            <Avatar src={img} size={36} />
            <Flex vertical gap={1} style={{ flex: 1 }}>
              <Text style={{ fontSize: 14, fontWeight: 500 }}>{name}</Text>
              <Text type="secondary" style={{ fontSize: 12 }}>{subtitle}</Text>
            </Flex>
            {isToday && (
              <Flex align="center" gap={4}>
                <Text style={{ fontSize: 12 }}>Heute</Text>
                <span style={{ fontSize: 14 }}>🎉</span>
              </Flex>
            )}
          </Flex>
        </div>
      ))}
    </Card>
  )
}

function TeamCard() {
  return (
    <Card styles={{ body: { padding: '0 16px' } }}>
      {teamMembers.map(({ name, hours, online, birthday, img }, i) => (
        <div key={name}>
          {i > 0 && <div style={{ height: 1, background: '#f5f5f5' }} />}
          <Flex align="center" gap={10} style={{ padding: '10px 0' }}>
            <div style={{ position: 'relative', flexShrink: 0 }}>
              <Avatar src={img} size={36} />
              {online && <OnlineDot />}
            </div>
            <Flex vertical gap={1} style={{ flex: 1 }}>
              <Text style={{ fontSize: 14, fontWeight: 500 }}>{name}</Text>
              <Text type="secondary" style={{ fontSize: 12 }}>{hours}</Text>
            </Flex>
            {birthday && (
              <Flex align="center" gap={4}>
                <Text style={{ fontSize: 12 }}>Heute</Text>
                <span style={{ fontSize: 14 }}>🎉</span>
              </Flex>
            )}
          </Flex>
        </div>
      ))}
    </Card>
  )
}

// ─── page ─────────────────────────────────────────────────────────────────────

export default function Dashboard() {
  const [showAllTeams, setShowAllTeams] = useState(false)

  return (
    <PageLayout title="Dashboard">
      <Row gutter={16} align="top">
          {/* Left column */}
          <Col span={17}>
            <Flex vertical gap={12}>
              <StatsRow />
              <NewsRow />
              <CampaignSection />
            </Flex>
          </Col>

          {/* Right column */}
          <Col span={7}>
            <Flex vertical gap={10}>
              <BirthdayCard />
              <Flex align="center" justify="flex-end" gap={8}>
                <Checkbox
                  checked={showAllTeams}
                  onChange={(e) => setShowAllTeams(e.target.checked)}
                />
                <Text style={{ fontSize: 13 }}>Alle Teams anzeigen</Text>
              </Flex>
              <TeamCard />
              <Flex justify="flex-end">
                <SeeAllLink label="Zum Shop" />
              </Flex>
              <TeamCard />
            </Flex>
          </Col>
        </Row>
    </PageLayout>
  )
}

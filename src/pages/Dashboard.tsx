import { useState } from 'react'
import {
  Row,
  Col,
  Card,
  Avatar,
  Typography,
  Flex,
  Checkbox,
  List,
  Statistic,
  Tag,
  Badge,
  Button,
  Tooltip,
  theme,
} from 'antd'
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
  faMessage,
  faUser,
} from '@fortawesome/pro-light-svg-icons'
import PageLayout from '../designsystem/sharedComponents/PageLayout'
import { ChannelIcon } from '../designsystem/components'

const { Text, Link } = Typography


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
  const { token } = theme.useToken()

  return (
    <Link
      style={{
        fontSize: token.fontSizeSM,
        display: 'inline-flex',
        alignItems: 'center',
        gap: token.marginXXS,
      }}
    >
      {label} <FontAwesomeIcon icon={faChevronRight} style={{ fontSize: token.fontSizeSM }} />
    </Link>
  )
}

function Channels({ types }: { types: Channel[] }) {
  const { token } = theme.useToken()

  return (
    <Flex gap={token.marginXXS} align="center">
      {types.includes('wa') && <ChannelIcon channel="whatsapp" size={token.fontSizeLG} />}
      {types.includes('email') && <ChannelIcon channel="email" size={token.fontSizeLG} />}
      {types.includes('fb') && <ChannelIcon channel="facebook" size={token.fontSizeLG} />}
      {types.includes('google') && <ChannelIcon channel="google" size={token.fontSizeLG} />}
    </Flex>
  )
}

function MemberAvatar({ src, online }: { src: string; online?: boolean }) {
  const { token } = theme.useToken()
  const size = token.controlHeightSM + token.paddingSM

  const avatar = <Avatar src={src} size={size} />

  if (!online) return avatar

  return (
    <Badge dot status="success" offset={[-token.marginXXS, token.marginXXS]}>
      {avatar}
    </Badge>
  )
}

function TodayCelebration() {
  const { token } = theme.useToken()

  return (
    <Flex align="center" gap={token.marginXXS}>
      <Text style={{ fontSize: token.fontSizeSM }}>Heute</Text>
      <Text style={{ fontSize: token.fontSize }}>🎉</Text>
    </Flex>
  )
}

// ─── left column sections ─────────────────────────────────────────────────────

function StatsRow() {
  const { token } = theme.useToken()

  const stats = [
    {
      icon: <FontAwesomeIcon icon={faMessage} style={{ fontSize: token.fontSizeLG }} />,
      title: 'Neukunden',
      values: [{ n: 8, label: 'Vorgänge' }],
    },
    {
      icon: <FontAwesomeIcon icon={faCircleCheck} style={{ fontSize: token.fontSizeLG }} />,
      title: 'Vorgänge',
      values: [{ n: 12, label: 'Meine' }, { n: 45, label: 'Team' }],
    },
    {
      icon: <FontAwesomeIcon icon={faUser} style={{ fontSize: token.fontSizeLG }} />,
      title: 'Kunden',
      values: [{ n: 64, label: 'Meine' }, { n: 451, label: 'Gesamt' }],
    },
  ]

  return (
    <Row gutter={token.marginSM}>
      {stats.map(({ icon, title, values }) => (
        <Col span={8} key={title}>
          <Card styles={{ body: { padding: `${token.paddingSM}px ${token.paddingMD}px` } }}>
            <Flex align="center" gap={token.marginXS} style={{ marginBottom: token.marginSM }}>
              {icon}
              <Text strong style={{ fontSize: token.fontSize }}>{title}</Text>
              <FontAwesomeIcon icon={faCircleInfo} style={{ color: token.colorTextDisabled, fontSize: token.fontSizeSM }} />
            </Flex>
            <Flex gap={token.paddingMD} align="baseline">
              {values.map(({ n, label }) => (
                <Statistic
                  key={label}
                  value={n}
                  valueStyle={{ fontSize: token.fontSizeHeading2, lineHeight: 1 }}
                  suffix={<Text type="secondary" style={{ fontSize: token.fontSizeSM }}>{label}</Text>}
                />
              ))}
            </Flex>
          </Card>
        </Col>
      ))}
    </Row>
  )
}

function NewsRow() {
  const { token } = theme.useToken()

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
    <Row gutter={token.marginSM}>
      {items.map(({ badge, img, text }) => (
        <Col span={12} key={badge}>
          <Card styles={{ body: { padding: 0 } }}>
            <div
              style={{
                position: 'relative',
                aspectRatio: '3 / 1',
                borderRadius: `${token.borderRadiusLG}px ${token.borderRadiusLG}px 0 0`,
                overflow: 'hidden',
              }}
            >
              <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
              <Tag
                color="primary"
                style={{
                  position: 'absolute',
                  top: token.marginSM,
                  left: token.marginSM,
                  margin: 0,
                }}
              >
                {badge}
              </Tag>
            </div>
            <div style={{ padding: `${token.paddingSM}px ${token.padding}px` }}>
              <Text style={{ fontSize: token.fontSize, lineHeight: token.lineHeight }}>{text}</Text>
            </div>
          </Card>
        </Col>
      ))}
    </Row>
  )
}

function CampaignSection() {
  const { token } = theme.useToken()
  const [expanded, setExpanded] = useState<string | null>('c3')
  const thumbSize = token.controlHeight + token.marginSM

  const toggle = (id: string) => setExpanded(prev => prev === id ? null : id)

  const featuredMetrics = [
    { label: 'Aktiviert', content: <Statistic value={195} valueStyle={{ fontSize: token.fontSizeLG, lineHeight: 1 }} style={{ textAlign: 'center' }} /> },
    { label: 'Kunden', content: <Statistic value={126} valueStyle={{ fontSize: token.fontSizeLG, lineHeight: 1 }} style={{ textAlign: 'center' }} /> },
    { label: 'Kanäle', content: <Channels types={['wa', 'email', 'fb']} /> },
    {
      label: 'Opt-In',
      content: (
        <Flex gap={token.marginXS}>
          <Flex align="center" gap={token.marginXXS}>
            <FontAwesomeIcon icon={faCircleCheck} style={{ color: token.colorSuccess, fontSize: token.fontSizeSM }} />
            <Text style={{ fontSize: token.fontSizeSM }}>96</Text>
          </Flex>
          <Flex align="center" gap={token.marginXXS}>
            <FontAwesomeIcon icon={faCircleXmark} style={{ color: token.colorError, fontSize: token.fontSizeSM }} />
            <Text style={{ fontSize: token.fontSizeSM }}>8</Text>
          </Flex>
          <Flex align="center" gap={token.marginXXS}>
            <FontAwesomeIcon icon={faCircleQuestion} style={{ color: token.colorTextSecondary, fontSize: token.fontSizeSM }} />
            <Text style={{ fontSize: token.fontSizeSM }}>22</Text>
          </Flex>
        </Flex>
      ),
    },
  ]

  return (
    <Flex vertical gap={token.marginXS}>
      <Card styles={{ body: { padding: `${token.paddingSM}px ${token.paddingMD}px` } }}>
        <Flex justify="space-between" align="center" wrap="wrap" gap={token.padding}>
          <Flex vertical gap={token.marginXXS}>
            <Text strong style={{ fontSize: token.fontSize }}>Gewinnspiel Sommer</Text>
            <Flex align="center" gap={token.marginXXS}>
              <FontAwesomeIcon icon={faCalendar} style={{ color: token.colorTextSecondary, fontSize: token.fontSizeSM }} />
              <Text type="secondary" style={{ fontSize: token.fontSizeSM }}>08.10.2022 – Unbegrenzt</Text>
            </Flex>
          </Flex>
          <Flex gap={token.paddingMD} align="center">
            {featuredMetrics.map(({ label, content }) => (
              <Flex key={label} vertical align="center" gap={token.marginXXS}>
                <Text type="secondary" style={{ fontSize: token.fontSizeSM }}>{label}</Text>
                {content}
              </Flex>
            ))}
          </Flex>
        </Flex>
      </Card>

      <div style={{ paddingLeft: token.marginXXS }}>
        <SeeAllLink />
      </div>

      <Card styles={{ body: { padding: 0 } }}>
        <List
          dataSource={campaigns}
          split
          renderItem={(c) => (
            <List.Item style={{ padding: `${token.paddingSM}px ${token.padding}px`, display: 'block' }}>
              <Flex justify="space-between" align="center">
                <Flex gap={token.marginSM} align="center" style={{ flex: 1, minWidth: 0 }}>
                  <img
                    src={c.img}
                    alt=""
                    style={{
                      width: thumbSize,
                      height: thumbSize,
                      objectFit: 'cover',
                      borderRadius: token.borderRadiusXS,
                      flexShrink: 0,
                    }}
                  />
                  <Flex vertical gap={token.marginXXS}>
                    <Text>{c.title}</Text>
                    <Flex align="center" gap={token.marginXXS}>
                      <FontAwesomeIcon icon={faCalendar} style={{ color: token.colorTextSecondary, fontSize: token.fontSizeSM }} />
                      <Text type="secondary" style={{ fontSize: token.fontSizeSM }}>{c.date}</Text>
                    </Flex>
                  </Flex>
                </Flex>
                <Flex gap={token.paddingLG} align="center" style={{ flexShrink: 0 }}>
                  <Statistic
                    title={<Text type="secondary" style={{ fontSize: token.fontSizeSM }}>Empfänger</Text>}
                    value={c.empfaenger}
                    valueStyle={{ fontSize: token.fontSize, lineHeight: 1 }}
                    style={{ textAlign: 'center' }}
                  />
                  <Flex vertical align="center" gap={token.lineWidth}>
                    <Text type="secondary" style={{ fontSize: token.fontSizeSM }}>Kanäle</Text>
                    <Channels types={c.channels} />
                  </Flex>
                  <Statistic
                    title={<Text type="secondary" style={{ fontSize: token.fontSizeSM }}>Conversations</Text>}
                    value={c.conversations}
                    valueStyle={{ fontSize: token.fontSize, lineHeight: 1 }}
                    style={{ textAlign: 'center' }}
                  />
                  {c.action === 'edit' ? (
                    <Tooltip title="Bearbeiten">
                      <Button variant="text" color="default" icon={<FontAwesomeIcon icon={faPenToSquare} />} />
                    </Tooltip>
                  ) : (
                    <Tooltip title={expanded === c.id ? 'Einklappen' : 'Ausklappen'}>
                      <Button
                        variant="text"
                        color="default"
                        icon={<FontAwesomeIcon icon={expanded === c.id ? faChevronUp : faChevronDown} />}
                        onClick={() => toggle(c.id)}
                      />
                    </Tooltip>
                  )}
                </Flex>
              </Flex>

              {expanded === c.id && c.details && c.details.length > 0 && (
                <div style={{ marginTop: token.marginXS, paddingLeft: thumbSize + token.padding }}>
                  {c.details.map((d) => (
                    <Flex key={d.time} align="center" gap={token.marginXL} style={{ padding: `${token.marginXXS}px 0` }}>
                      <Text type="secondary" style={{ fontSize: token.fontSizeSM, minWidth: token.controlHeight * 2 + token.marginSM }}>
                        {d.time}
                      </Text>
                      <Text style={{ fontSize: token.fontSizeSM, minWidth: token.controlHeightSM + token.marginXXS }}>
                        {d.empfaenger}
                      </Text>
                      <Channels types={d.channels} />
                      <Text style={{ fontSize: token.fontSizeSM }}>{d.conversations}</Text>
                    </Flex>
                  ))}
                </div>
              )}
            </List.Item>
          )}
        />
      </Card>
    </Flex>
  )
}

// ─── right column sections ────────────────────────────────────────────────────

function BirthdayCard() {
  const { token } = theme.useToken()
  const avatarSize = token.controlHeightSM + token.paddingSM

  const contacts = [
    { name: 'Marlene Schreiber', subtitle: 'Heute', isToday: true, img: 'https://i.pravatar.cc/40?img=5' },
    { name: 'Anton Daubner', subtitle: 'In 4 Tagen', isToday: false, img: 'https://i.pravatar.cc/40?img=7' },
    { name: 'Luisa Schwarz', subtitle: 'In 13 Tagen', isToday: false, img: 'https://i.pravatar.cc/40?img=9' },
  ]

  return (
    <Card styles={{ body: { padding: `0 ${token.padding}px` } }}>
      <Flex justify="flex-end" style={{ padding: `${token.marginSM}px 0 ${token.marginXXS}px` }}>
        <SeeAllLink />
      </Flex>
      <List
        dataSource={contacts}
        split
        renderItem={({ name, subtitle, isToday, img }) => (
          <List.Item
            style={{ padding: `${token.marginSM}px 0` }}
            extra={isToday ? <TodayCelebration /> : undefined}
          >
            <List.Item.Meta
              avatar={<Avatar src={img} size={avatarSize} />}
              title={<Text>{name}</Text>}
              description={<Text type="secondary" style={{ fontSize: token.fontSizeSM }}>{subtitle}</Text>}
            />
          </List.Item>
        )}
      />
    </Card>
  )
}

function TeamCard() {
  const { token } = theme.useToken()

  return (
    <Card styles={{ body: { padding: `0 ${token.padding}px` } }}>
      <List
        dataSource={teamMembers}
        split
        renderItem={({ name, hours, online, birthday, img }) => (
          <List.Item
            style={{ padding: `${token.marginSM}px 0` }}
            extra={birthday ? <TodayCelebration /> : undefined}
          >
            <List.Item.Meta
              avatar={<MemberAvatar src={img} online={online} />}
              title={<Text>{name}</Text>}
              description={<Text type="secondary" style={{ fontSize: token.fontSizeSM }}>{hours}</Text>}
            />
          </List.Item>
        )}
      />
    </Card>
  )
}

// ─── page ─────────────────────────────────────────────────────────────────────

export default function Dashboard() {
  const { token } = theme.useToken()
  const [showAllTeams, setShowAllTeams] = useState(false)

  return (
    <PageLayout title="Dashboard" bodyStyle={{ padding: token.paddingLG }}>
      <Row gutter={token.padding} align="top">
        <Col span={17}>
          <Flex vertical gap={token.marginSM}>
            <StatsRow />
            <NewsRow />
            <CampaignSection />
          </Flex>
        </Col>

        <Col span={7}>
          <Flex vertical gap={token.marginSM}>
            <BirthdayCard />
            <Flex align="center" justify="flex-end" gap={token.marginXS}>
              <Checkbox
                checked={showAllTeams}
                onChange={(e) => setShowAllTeams(e.target.checked)}
              />
              <Text style={{ fontSize: token.fontSizeSM }}>Alle Teams anzeigen</Text>
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

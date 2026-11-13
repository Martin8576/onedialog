import type React from 'react'
import dayjs from 'dayjs'
import { DatePicker, Flex, Input, Segmented, Switch, Typography, theme } from 'antd'
import type { ReleaseNews } from '../../../data/news/types'
import ImagePicker from './ImagePicker'

const { Text } = Typography

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  const { token } = theme.useToken()
  return (
    <Flex vertical gap={token.marginSM}>
      <Text strong>{title}</Text>
      {children}
    </Flex>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  const { token } = theme.useToken()
  return (
    <Flex vertical gap={token.marginXXS}>
      <Text style={{ fontSize: token.fontSizeSM }}>{label}</Text>
      {children}
    </Flex>
  )
}

export interface NewsSettingsFormProps {
  news: ReleaseNews
  onChange: (news: ReleaseNews) => void
}

/** "Einstellungen" tab: teaser, publication period and display options. */
export default function NewsSettingsForm({ news, onChange }: NewsSettingsFormProps) {
  const { token } = theme.useToken()
  const update = (patch: Partial<ReleaseNews>) => onChange({ ...news, ...patch })

  return (
    <Flex vertical gap={token.marginLG}>
      <Section title="Allgemein">
        <Field label="Titel">
          <Input value={news.title} onChange={e => update({ title: e.target.value })} maxLength={60} />
        </Field>
      </Section>

      <Section title="Teaser">
        <Field label="Bild">
          <ImagePicker value={news.teaser.image} onChange={image => update({ teaser: { ...news.teaser, image } })} />
        </Field>
        <Field label="Name">
          <Input.TextArea
            value={news.teaser.name}
            onChange={e => update({ teaser: { ...news.teaser, name: e.target.value } })}
            maxLength={80}
            showCount
            autoSize={{ minRows: 3, maxRows: 5 }}
          />
        </Field>
      </Section>

      <Section title="Veröffentlichung">
        <Field label="Startdatum">
          <DatePicker
            value={news.publishStart ? dayjs(news.publishStart) : null}
            onChange={d => update({ publishStart: d ? d.toISOString() : undefined })}
            placeholder="Sofort"
            format="DD.MM.YYYY"
            style={{ width: '100%' }}
          />
        </Field>
        <Field label="Enddatum">
          <DatePicker
            value={news.publishEnd ? dayjs(news.publishEnd) : null}
            onChange={d => update({ publishEnd: d ? d.toISOString() : undefined })}
            placeholder="Kein Enddatum"
            format="DD.MM.YYYY"
            minDate={news.publishStart ? dayjs(news.publishStart) : undefined}
            style={{ width: '100%' }}
          />
        </Field>
      </Section>

      <Section title="Darstellung">
        <Field label="Anzeige">
          <div>
            <Segmented
              value={news.display}
              options={[
                { label: 'News', value: 'news' },
                { label: 'Modal', value: 'modal' },
              ]}
              onChange={value => update({ display: value as ReleaseNews['display'] })}
            />
          </div>
        </Field>
        <Flex align="center" justify="space-between">
          <Text style={{ fontSize: token.fontSizeSM }}>Notification</Text>
          <Switch size="small" checked={news.notification} onChange={notification => update({ notification })} />
        </Flex>
      </Section>
    </Flex>
  )
}

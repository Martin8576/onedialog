import type React from 'react'
import { Flex, Input, InputNumber, Segmented, Switch, Typography, theme } from 'antd'
import {
  HEADING_MAX_LENGTH,
  LINK_LABEL_MAX_LENGTH,
  TEXT_MAX_LENGTH,
  type Align,
  type ContentBlockElement,
  type ContentElement,
  type DividerElement,
  type HeadingLevel,
  type ImageHeight,
  type LinkDisplay,
  type LinkFields,
  type LinkSize,
} from '../../../data/news/types'
import ImagePicker from './ImagePicker'
import RichTextField from './RichTextField'
import { HEADING_TOOLS, TEXT_TOOLS } from './richTextTools'

const { Text } = Typography

const DEFAULT_FIXED_HEIGHT = 300

const ALIGN_OPTIONS: { label: string; value: Align }[] = [
  { label: 'Links', value: 'left' },
  { label: 'Mittig', value: 'center' },
  { label: 'Rechts', value: 'right' },
]

// ── Building blocks (shared by the single elements and the content block) ────

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  const { token } = theme.useToken()
  return (
    <Flex vertical gap={token.marginXXS}>
      <Text style={{ fontSize: token.fontSizeSM }}>{label}</Text>
      {children}
    </Flex>
  )
}

/** Content block section with a bold title and an optional on/off switch or extra control. */
function Section({ title, enabled, onToggle, extra, children }: {
  title: string
  enabled?: boolean
  onToggle?: (enabled: boolean) => void
  extra?: React.ReactNode
  children?: React.ReactNode
}) {
  const { token } = theme.useToken()
  return (
    <Flex vertical gap={token.marginXS}>
      <Flex align="center" justify="space-between" gap={token.marginXS}>
        <Text strong>{title}</Text>
        {onToggle && <Switch size="small" checked={enabled} onChange={onToggle} />}
        {extra}
      </Flex>
      {(enabled ?? true) && children}
    </Flex>
  )
}

/** "Bildhöhe": Auto (whole image scaled to the width) or Fix (px height, image is covered). */
function ImageHeightField({ value, onChange }: { value: ImageHeight; onChange: (value: ImageHeight) => void }) {
  const { token } = theme.useToken()
  return (
    <Field label="Bildhöhe">
      <Flex gap={token.marginXS} align="center">
        <Segmented
          value={value === 'auto' ? 'auto' : 'fixed'}
          options={[
            { label: 'Auto', value: 'auto' },
            { label: 'Fix', value: 'fixed' },
          ]}
          onChange={mode => onChange(mode === 'auto' ? 'auto' : DEFAULT_FIXED_HEIGHT)}
        />
        {value !== 'auto' && (
          <InputNumber
            value={value}
            min={40}
            max={2000}
            step={10}
            addonAfter="px"
            onChange={px => onChange(px ?? DEFAULT_FIXED_HEIGHT)}
            style={{ flex: 1, minWidth: 0 }}
          />
        )}
      </Flex>
    </Field>
  )
}

function ImageFields({ src, height, onChange }: {
  src?: string
  height: ImageHeight
  onChange: (patch: { src?: string; height?: ImageHeight }) => void
}) {
  return (
    <>
      <Field label="Bild">
        <ImagePicker value={src} onChange={value => onChange({ src: value })} />
      </Field>
      <ImageHeightField value={height} onChange={value => onChange({ height: value })} />
    </>
  )
}

function VideoUrlField({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  return (
    <Field label="Video-URL">
      <Input value={value} onChange={e => onChange(e.target.value)} placeholder="https://www.youtube.com/embed/…" />
    </Field>
  )
}

function LinkFieldsForm({ value, onChange }: { value: LinkFields; onChange: (value: LinkFields) => void }) {
  return (
    <>
      <Field label="Darstellung">
        <Segmented
          block
          value={value.display}
          options={[
            { label: 'Button', value: 'button' },
            { label: 'Link', value: 'link' },
          ]}
          onChange={display => onChange({ ...value, display: display as LinkDisplay })}
        />
      </Field>
      <Field label="Ausrichtung">
        <Segmented
          block
          value={value.align}
          options={ALIGN_OPTIONS}
          onChange={align => onChange({ ...value, align: align as Align })}
        />
      </Field>
      <Field label="Größe">
        <Segmented
          block
          value={value.size}
          options={[
            { label: 'Klein', value: 'small' },
            { label: 'Mittel', value: 'middle' },
            { label: 'Groß', value: 'large' },
          ]}
          onChange={size => onChange({ ...value, size: size as LinkSize })}
        />
      </Field>
      <Field label="Beschriftung">
        <Input
          value={value.label}
          onChange={e => onChange({ ...value, label: e.target.value })}
          maxLength={LINK_LABEL_MAX_LENGTH}
          showCount
        />
      </Field>
      <Field label="Ziel-URL">
        <Input value={value.url} onChange={e => onChange({ ...value, url: e.target.value })} placeholder="https://" />
      </Field>
    </>
  )
}

/** Small schematic tile for choosing the content block layout. */
function LayoutOption({ layout, selected, onClick }: { layout: ContentBlockElement['layout']; selected: boolean; onClick: () => void }) {
  const { token } = theme.useToken()
  const lines = (
    <Flex vertical gap={3} flex={1} style={{ padding: token.paddingXS }}>
      {[100, 80, 100, 90, 60].map((w, i) => (
        <div key={i} style={{ height: 3, width: `${w}%`, background: token.colorGrey30, borderRadius: 2 }} />
      ))}
    </Flex>
  )
  const image = <div style={{ flex: 1, background: token.colorGrey10 }} />

  return (
    <Flex
      onClick={onClick}
      style={{
        flex: 1,
        height: 56,
        overflow: 'hidden',
        cursor: 'pointer',
        borderRadius: token.borderRadius,
        border: `${token.lineWidth}px solid ${selected ? token.colorPrimary : token.colorGrey16}`,
        background: token.colorBgContainer,
      }}
    >
      {layout === 'imageRight' ? <>{lines}{image}</> : <>{image}{lines}</>}
    </Flex>
  )
}

// ── Form ─────────────────────────────────────────────────────────────────────

export interface ElementContentFormProps {
  element: ContentElement
  onChange: (element: ContentElement) => void
}

/** Type-specific content fields of a content element. */
export default function ElementContentForm({ element, onChange }: ElementContentFormProps) {
  const { token } = theme.useToken()
  const update = (patch: Partial<ContentElement>) => onChange({ ...element, ...patch } as ContentElement)

  let fields: React.ReactNode
  switch (element.type) {
    case 'heading':
      fields = (
        <>
          <Field label="Größe">
            <Segmented
              block
              value={element.level}
              options={([1, 2, 3, 4, 5, 6] as HeadingLevel[]).map(level => ({ label: `H${level}`, value: level }))}
              onChange={level => update({ level: level as HeadingLevel })}
            />
          </Field>
          <Field label="Überschrift">
            <RichTextField
              value={element.text}
              onChange={text => update({ text })}
              tools={HEADING_TOOLS}
              singleLine
              maxLength={HEADING_MAX_LENGTH}
            />
          </Field>
        </>
      )
      break

    case 'text':
      fields = (
        <Field label="Text">
          <RichTextField value={element.text} onChange={text => update({ text })} tools={TEXT_TOOLS} maxLength={TEXT_MAX_LENGTH} />
        </Field>
      )
      break

    case 'image':
      fields = <ImageFields src={element.src} height={element.height} onChange={patch => update(patch)} />
      break

    case 'video':
      fields = <VideoUrlField value={element.url} onChange={url => update({ url })} />
      break

    case 'link':
      fields = (
        <LinkFieldsForm
          value={{ label: element.label, url: element.url, display: element.display, align: element.align, size: element.size }}
          onChange={link => update(link)}
        />
      )
      break

    case 'divider':
      fields = (
        <>
          <Field label="Stil">
            <Segmented
              block
              value={element.style}
              options={[
                { label: 'Ohne Text', value: 'plain' },
                { label: 'Mit Text', value: 'text' },
              ]}
              onChange={style => update({ style: style as DividerElement['style'] })}
            />
          </Field>
          {element.style === 'text' && (
            <>
              <Field label="Ausrichtung">
                <Segmented
                  block
                  value={element.align}
                  options={ALIGN_OPTIONS}
                  onChange={align => update({ align: align as Align })}
                />
              </Field>
              <Field label="Text">
                <Input
                  value={element.text}
                  onChange={e => update({ text: e.target.value })}
                  placeholder="Text des Trenners"
                  maxLength={LINK_LABEL_MAX_LENGTH}
                  showCount
                />
              </Field>
            </>
          )}
        </>
      )
      break

    case 'contentBlock':
      fields = (
        <>
          <Section title="Layout">
            <Flex gap={token.marginXS}>
              <LayoutOption layout="imageRight" selected={element.layout === 'imageRight'} onClick={() => update({ layout: 'imageRight' })} />
              <LayoutOption layout="imageLeft" selected={element.layout === 'imageLeft'} onClick={() => update({ layout: 'imageLeft' })} />
            </Flex>
          </Section>

          <Section title="Überschrift" enabled={element.showHeading} onToggle={showHeading => update({ showHeading })}>
            <RichTextField
              value={element.heading}
              onChange={heading => update({ heading })}
              tools={HEADING_TOOLS}
              singleLine
              maxLength={HEADING_MAX_LENGTH}
              headingLevel={element.headingLevel}
              onHeadingLevelChange={headingLevel => update({ headingLevel })}
            />
          </Section>

          <Section title="Text" enabled={element.showText} onToggle={showText => update({ showText })}>
            <RichTextField value={element.text} onChange={text => update({ text })} tools={TEXT_TOOLS} maxLength={TEXT_MAX_LENGTH} />
          </Section>

          <Section
            title="Medium"
            extra={
              <Segmented
                size="small"
                value={element.media}
                options={[
                  { label: 'Ohne', value: 'none' },
                  { label: 'Bild', value: 'image' },
                  { label: 'Video', value: 'video' },
                ]}
                onChange={media => update({ media: media as ContentBlockElement['media'] })}
              />
            }
          >
            {element.media === 'image' && (
              <ImageFields
                src={element.image}
                height={element.imageHeight}
                onChange={patch =>
                  update({
                    ...('src' in patch && { image: patch.src }),
                    ...(patch.height !== undefined && { imageHeight: patch.height }),
                  })
                }
              />
            )}
            {element.media === 'video' && <VideoUrlField value={element.videoUrl} onChange={videoUrl => update({ videoUrl })} />}
          </Section>

          <Section title="Link" enabled={element.showLink} onToggle={showLink => update({ showLink })}>
            <LinkFieldsForm value={element.link} onChange={link => update({ link })} />
          </Section>
        </>
      )
      break
  }

  return <Flex vertical gap={element.type === 'contentBlock' ? token.marginLG : token.margin}>{fields}</Flex>
}

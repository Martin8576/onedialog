import type React from 'react'
import { Button, Divider, Flex, Typography, theme } from 'antd'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowUpRightFromSquare, faCirclePlay, faImage } from '@fortawesome/pro-light-svg-icons'
import type { Align, ContentElement, HeadingLevel, ImageHeight, LinkFields } from '../../../data/news/types'
import { renderMarkdown } from './markdown'

const { Title, Text, Link } = Typography

export type PreviewDevice = 'desktop' | 'tablet' | 'mobile'

const JUSTIFY: Record<Align, React.CSSProperties['justifyContent']> = {
  left: 'flex-start',
  center: 'center',
  right: 'flex-end',
}

function Placeholder({ icon, label, height }: { icon: typeof faImage; label: string; height: number | string }) {
  const { token } = theme.useToken()
  return (
    <Flex
      vertical
      align="center"
      justify="center"
      gap={token.marginXS}
      style={{
        width: '100%',
        height,
        borderRadius: token.borderRadiusLG,
        background: token.colorGrey10,
        color: token.colorTextTertiary,
      }}
    >
      <FontAwesomeIcon icon={icon} style={{ fontSize: token.fontSizeHeading3 }} />
      <Text type="secondary">{label}</Text>
    </Flex>
  )
}

/** `'auto'`: full image scaled to the width. Number: fixed height, image covered. */
function NewsImage({ src, height }: { src?: string; height: ImageHeight }) {
  const { token } = theme.useToken()
  if (!src) return <Placeholder icon={faImage} label="Kein Bild ausgewählt" height={height === 'auto' ? 200 : height} />
  return (
    <img
      src={src}
      alt=""
      style={{
        display: 'block',
        width: '100%',
        height: height === 'auto' ? 'auto' : height,
        objectFit: height === 'auto' ? undefined : 'cover',
        borderRadius: token.borderRadiusLG,
      }}
    />
  )
}

function NewsVideo({ url }: { url: string }) {
  const { token } = theme.useToken()
  if (!url) return <Placeholder icon={faCirclePlay} label="Keine Video-URL hinterlegt" height={200} />
  return (
    <iframe
      src={url}
      title="Video"
      style={{ display: 'block', width: '100%', aspectRatio: '16 / 9', border: 'none', borderRadius: token.borderRadiusLG }}
      allowFullScreen
    />
  )
}

/** Opens in a new tab; shown as primary button or text link. */
function NewsLink({ link }: { link: LinkFields }) {
  const { token } = theme.useToken()
  const href = link.url || undefined
  const fontSize = link.size === 'small' ? token.fontSizeSM : link.size === 'large' ? token.fontSizeLG : token.fontSize
  return (
    <Flex justify={JUSTIFY[link.align]}>
      {link.display === 'button' ? (
        <Button type="primary" size={link.size} href={href} target="_blank" rel="noopener noreferrer">
          {link.label}
        </Button>
      ) : (
        <Link href={href} target="_blank" rel="noopener noreferrer" style={{ fontSize }}>
          {link.label} <FontAwesomeIcon icon={faArrowUpRightFromSquare} style={{ fontSize: fontSize - 2 }} />
        </Link>
      )}
    </Flex>
  )
}

/** antd Title supports h1–h5; h6 is rendered as a body-sized title. */
function NewsHeading({ level, children }: { level: HeadingLevel; children: React.ReactNode }) {
  const { token } = theme.useToken()
  if (level === 6) return <Title level={5} style={{ margin: 0, fontSize: token.fontSize }}>{children}</Title>
  return <Title level={level} style={{ margin: 0 }}>{children}</Title>
}

export function ContentElementView({ element, device = 'desktop' }: { element: ContentElement; device?: PreviewDevice }) {
  const { token } = theme.useToken()

  switch (element.type) {
    case 'heading':
      return <NewsHeading level={element.level}>{element.text}</NewsHeading>

    case 'text':
      return <Flex vertical gap={token.marginXS}>{renderMarkdown(element.text)}</Flex>

    case 'image':
      return <NewsImage src={element.src} height={element.height} />

    case 'video':
      return <NewsVideo url={element.url} />

    case 'link':
      return <NewsLink link={element} />

    case 'divider': {
      const text = element.style === 'text' ? element.text.trim() : ''
      const placement = element.align === 'left' ? 'start' : element.align === 'right' ? 'end' : 'center'
      return (
        <Divider plain titlePlacement={placement} style={{ margin: `${token.marginXS}px 0` }}>
          {text || undefined}
        </Divider>
      )
    }

    case 'contentBlock': {
      const stacked = device === 'mobile'
      const hasMedia = element.media !== 'none'
      const body = (
        <Flex vertical gap={token.margin} flex={1} style={{ minWidth: 0 }}>
          {element.showHeading && <NewsHeading level={element.headingLevel}>{element.heading}</NewsHeading>}
          {element.showText && <Flex vertical gap={token.marginXS}>{renderMarkdown(element.text)}</Flex>}
          {element.showLink && <NewsLink link={element.link} />}
        </Flex>
      )
      if (!hasMedia) return body

      const media = (
        <div style={{ width: stacked ? '100%' : '40%', maxWidth: stacked ? undefined : 330, flexShrink: 0 }}>
          {element.media === 'image' ? (
            <NewsImage src={element.image} height={element.imageHeight} />
          ) : (
            <NewsVideo url={element.videoUrl} />
          )}
        </div>
      )
      return (
        <Flex
          gap={token.margin}
          style={{ flexDirection: stacked ? 'column' : element.layout === 'imageLeft' ? 'row-reverse' : 'row' }}
        >
          {body}
          {media}
        </Flex>
      )
    }
  }
}

export default function NewsRenderer({ content, device }: { content: ContentElement[]; device?: PreviewDevice }) {
  const { token } = theme.useToken()
  return (
    <Flex vertical gap={token.margin}>
      {content.map(el => (
        <ContentElementView key={el.id} element={el} device={device} />
      ))}
    </Flex>
  )
}

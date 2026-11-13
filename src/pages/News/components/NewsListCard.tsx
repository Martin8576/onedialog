import { useState } from 'react'
import { Flex, Typography, theme } from 'antd'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faImage, faUser } from '@fortawesome/pro-light-svg-icons'
import type { ReleaseNews } from '../../../data/news/types'
import { newsSubtitle, newsTypeMeta } from './meta'

const { Text } = Typography

export interface NewsListCardProps {
  news: ReleaseNews
  selected?: boolean
  onClick?: () => void
}

export default function NewsListCard({ news, selected, onClick }: NewsListCardProps) {
  const { token } = theme.useToken()
  const [hovered, setHovered] = useState(false)
  const typeMeta = newsTypeMeta[news.type]
  const tagTextStyle = { fontSize: token.fontSizeSM - 1, lineHeight: `${token.lineHeightSM}` }

  return (
    <Flex
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      gap={token.marginSM}
      align="stretch"
      style={{
        width: '100%',
        maxWidth: 680,
        padding: token.paddingMD,
        borderRadius: token.borderRadiusLG,
        background: selected ? token.colorPrimaryBg : token.colorBgContainer,
        cursor: 'pointer',
        boxShadow: hovered ? token.boxShadowTertiary : 'none',
        transition: `background ${token.motionDurationMid}, box-shadow ${token.motionDurationMid}`,
        flexShrink: 0,
      }}
    >
      <Flex vertical justify="space-between" flex={1} style={{ minWidth: 0 }}>
        <Flex vertical gap={token.marginXXS}>
          <Text strong ellipsis>{news.title}</Text>
          <Text type="secondary" style={{ fontSize: token.fontSizeSM }}>{newsSubtitle(news)}</Text>
        </Flex>
        <Flex gap={token.marginSM} align="center" wrap style={{ paddingTop: token.paddingSM }}>
          <Flex align="center" gap={token.marginXXS} style={{ color: token.colorPrimary }}>
            <FontAwesomeIcon icon={typeMeta.icon} style={{ fontSize: token.fontSizeSM }} />
            <Text strong style={{ ...tagTextStyle, color: token.colorPrimary }}>{typeMeta.label}</Text>
          </Flex>
          <Flex align="center" gap={token.marginXXS} style={{ color: token.colorTextSecondary }}>
            <FontAwesomeIcon icon={faUser} style={{ fontSize: token.fontSizeSM }} />
            <Text strong type="secondary" style={tagTextStyle}>{news.author}</Text>
          </Flex>
        </Flex>
      </Flex>

      {news.teaser.image ? (
        <img
          src={news.teaser.image}
          alt=""
          style={{
            width: 238,
            height: 102,
            objectFit: 'cover',
            borderRadius: token.borderRadius,
            flexShrink: 0,
          }}
        />
      ) : (
        <Flex
          align="center"
          justify="center"
          style={{
            width: 238,
            height: 102,
            borderRadius: token.borderRadius,
            background: token.colorGrey10,
            color: token.colorTextTertiary,
            flexShrink: 0,
          }}
        >
          <FontAwesomeIcon icon={faImage} style={{ fontSize: token.fontSizeHeading4 }} />
        </Flex>
      )}
    </Flex>
  )
}

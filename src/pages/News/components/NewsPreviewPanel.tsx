import { Button, Dropdown, Flex, Tooltip, Typography, theme } from 'antd'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEllipsisVertical, faPen, faXmark } from '@fortawesome/pro-light-svg-icons'
import type { ReleaseNews } from '../../../data/news/types'
import NewsRenderer from './NewsRenderer'
import { newsMenuItems, type NewsAction } from './newsActions'

const { Text } = Typography

export interface NewsPreviewPanelProps {
  news: ReleaseNews
  onEdit: () => void
  onClose: () => void
  onAction: (action: NewsAction) => void
}

/** Read-only preview of a release news, shown right of the list. */
export default function NewsPreviewPanel({ news, onEdit, onClose, onAction }: NewsPreviewPanelProps) {
  const { token } = theme.useToken()

  return (
    <Flex
      vertical
      flex={1}
      style={{
        minWidth: 0,
        height: '100%',
        background: token.colorGrey6,
        borderLeft: `${token.lineWidth}px solid ${token.colorGrey16}`,
        overflowY: 'auto',
      }}
    >
      <Flex vertical gap={token.margin} style={{ padding: `${token.paddingMD}px ${token.paddingXL}px` }}>
        <Flex align="center" gap={token.marginXS} style={{ minHeight: token.controlHeight }}>
          <Tooltip title="Schließen">
            <Button variant="text" color="default" icon={<FontAwesomeIcon icon={faXmark} />} onClick={onClose} />
          </Tooltip>
          <Text strong ellipsis style={{ flex: 1 }}>{news.title}</Text>
          <Flex align="center">
            <Dropdown
              trigger={['click']}
              menu={{
                items: newsMenuItems(news.status, { withEdit: false }),
                onClick: ({ key }) => onAction(key as NewsAction),
              }}
            >
              <Button variant="text" color="default" icon={<FontAwesomeIcon icon={faEllipsisVertical} />} />
            </Dropdown>
            {news.status !== 'archived' && (
              <Tooltip title="Bearbeiten">
                <Button variant="text" color="default" icon={<FontAwesomeIcon icon={faPen} />} onClick={onEdit} />
              </Tooltip>
            )}
          </Flex>
        </Flex>

        {news.content.length > 0 ? (
          <NewsRenderer content={news.content} />
        ) : (
          <Text type="secondary">Diese Release-News hat noch keine Inhalte.</Text>
        )}
      </Flex>
    </Flex>
  )
}

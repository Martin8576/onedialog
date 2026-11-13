import { useMemo, useState } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { Dropdown, Flex, Segmented, Typography, message, theme } from 'antd'
import { Header } from '../../designsystem/sharedComponents'
import type { NewsStatus, ReleaseNews } from '../../data/news/types'
import { releaseNewsStore, useReleaseNews } from '../../data/news/store'
import NewsListCard from './components/NewsListCard'
import NewsPreviewPanel from './components/NewsPreviewPanel'
import DeleteNewsModal from './components/DeleteNewsModal'
import { newsMenuItems, type NewsAction } from './components/newsActions'
import { sortByPublication, statusLabels } from './components/meta'

const { Text } = Typography

const STATUSES: NewsStatus[] = ['active', 'draft', 'archived']
const isStatus = (value: string | null): value is NewsStatus => STATUSES.includes(value as NewsStatus)

export default function ReleaseNewsList() {
  const { token } = theme.useToken()
  const navigate = useNavigate()
  const { id: selectedId } = useParams<{ id: string }>()
  const [searchParams] = useSearchParams()
  const allNews = useReleaseNews()
  const [deleteTarget, setDeleteTarget] = useState<ReleaseNews | null>(null)

  const selected = selectedId ? allNews.find(n => n.id === selectedId) : undefined
  const paramStatus = searchParams.get('status')
  const status: NewsStatus = isStatus(paramStatus) ? paramStatus : selected?.status ?? 'active'

  const listUrl = (s: NewsStatus) => `/news/releases?status=${s}`
  const itemUrl = (id: string, s: NewsStatus) => `/news/releases/${id}?status=${s}`

  const filtered = useMemo(
    () => allNews.filter(n => n.status === status).sort(sortByPublication),
    [allNews, status],
  )

  const handleAction = (news: ReleaseNews, action: NewsAction) => {
    switch (action) {
      case 'edit':
        navigate(`/news/releases/${news.id}/edit`)
        break
      case 'publish':
        releaseNewsStore.publish(news.id)
        message.success('Release-News wurde veröffentlicht')
        navigate(itemUrl(news.id, 'active'))
        break
      case 'duplicate': {
        const copy = releaseNewsStore.duplicate(news.id)
        message.success('Release-News wurde dupliziert')
        if (copy) navigate(itemUrl(copy.id, 'draft'))
        break
      }
      case 'archive':
        releaseNewsStore.archive(news.id)
        message.success('Release-News wurde archiviert')
        if (selectedId === news.id) navigate(listUrl(status))
        break
      case 'restore':
        releaseNewsStore.restore(news.id)
        message.success('Release-News wurde als Entwurf wiederhergestellt')
        if (selectedId === news.id) navigate(listUrl(status))
        break
      case 'delete':
        setDeleteTarget(news)
        break
    }
  }

  const confirmDelete = () => {
    if (!deleteTarget) return
    releaseNewsStore.remove(deleteTarget.id)
    message.success('Release-News wurde gelöscht')
    if (selectedId === deleteTarget.id) navigate(listUrl(status))
    setDeleteTarget(null)
  }

  const showPreview = selected && selected.status === status

  return (
    <Flex vertical style={{ height: '100%', minHeight: 0 }}>
      <Header
        title="Release-News"
        tabs={
          <Segmented
            value={status}
            options={STATUSES.map(s => ({ label: statusLabels[s], value: s }))}
            onChange={value => navigate(listUrl(value as NewsStatus))}
          />
        }
        addButton
        addButtonText="News erstellen"
        onAdd={() => navigate('/news/releases/new')}
      />

      <Flex style={{ flex: 1, minHeight: 0, overflow: 'hidden' }}>
        <Flex
          vertical
          gap={token.marginSM}
          flex={1}
          style={{
            minWidth: 0,
            overflowY: 'auto',
            padding: `${token.paddingMD}px ${token.paddingXL}px`,
          }}
        >
          <Flex align="center" style={{ minHeight: token.controlHeight }}>
            <Text strong>{filtered.length} News</Text>
          </Flex>

          {filtered.length === 0 && (
            <Text type="secondary">Keine Release-News in dieser Liste.</Text>
          )}

          {filtered.map(news => (
            <Dropdown
              key={news.id}
              trigger={['contextMenu']}
              menu={{ items: newsMenuItems(news.status), onClick: ({ key }) => handleAction(news, key as NewsAction) }}
            >
              <div style={{ width: '100%', maxWidth: 680 }}>
                <NewsListCard
                  news={news}
                  selected={news.id === selectedId}
                  onClick={() => navigate(news.id === selectedId ? listUrl(status) : itemUrl(news.id, status))}
                />
              </div>
            </Dropdown>
          ))}
        </Flex>

        {showPreview && (
          <NewsPreviewPanel
            news={selected}
            onEdit={() => navigate(`/news/releases/${selected.id}/edit`)}
            onClose={() => navigate(listUrl(status))}
            onAction={action => handleAction(selected, action)}
          />
        )}
      </Flex>

      <DeleteNewsModal
        open={!!deleteTarget}
        title={deleteTarget?.title}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </Flex>
  )
}

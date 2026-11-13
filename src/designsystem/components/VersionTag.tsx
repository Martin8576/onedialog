import type React from 'react'
import { Flex, Popover, Tag, Timeline, Typography, theme } from 'antd'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronDown, faCircle, faCircleCheck } from '@fortawesome/pro-light-svg-icons'

const { Text } = Typography

export type VersionTagStatus = 'draft' | 'live' | 'preview' | 'archived'

export type VersionTimelineEntry = {
  id: string
  label: string
  timestamp: string
  isCurrent?: boolean
  isLive?: boolean
  published: boolean
}

export interface VersionTagProps {
  major: number
  minor: number
  status: VersionTagStatus
  versions?: VersionTimelineEntry[]
  onSelectVersion?: (id: string) => void
}

function pillLabel(major: number, minor: number, status: VersionTagStatus): string {
  if (status === 'archived') return 'Archiviert'
  if (status === 'live') return `Version ${major}.0 (Live)`
  if (status === 'preview') return `Version ${major}.${minor} (Vorschau der Version)`
  return `Version ${major}.${minor} (Entwurf)`
}

function pillStyle(status: VersionTagStatus, token: ReturnType<typeof theme.useToken>['token']): React.CSSProperties {
  if (status === 'live') return { background: token.colorSuccess, color: token.colorWhite }
  if (status === 'draft') return { background: token.colorGrey90, color: token.colorWhite }
  if (status === 'archived') return { background: token.colorGrey16, color: token.colorTextSecondary }
  return { background: token.colorGrey10, color: token.colorTextSecondary }
}

export default function VersionTag({ major, minor, status, versions = [], onSelectVersion }: VersionTagProps) {
  const { token } = theme.useToken()

  const pill = (
    <Tag
      style={{
        ...pillStyle(status, token),
        display: 'inline-flex',
        alignItems: 'center',
        gap: token.marginXXS,
        height: 24,
        margin: 0,
        border: 'none',
        borderRadius: token.borderRadiusSM,
        fontWeight: token.fontWeightStrong,
        cursor: versions.length > 0 ? 'pointer' : 'default',
      }}
    >
      {pillLabel(major, minor, status)}
      {versions.length > 0 && <FontAwesomeIcon icon={faChevronDown} style={{ fontSize: 10 }} />}
    </Tag>
  )

  if (versions.length === 0) return pill

  return (
    <Popover
      trigger="click"
      placement="bottomLeft"
      styles={{ container: { padding: `${token.paddingXS}px ${token.paddingSM}px`, width: 267, maxHeight: 322, overflowY: 'auto' } }}
      content={
        <Timeline
          items={versions.map(v => {
            const badgeLabel = v.isLive ? 'Live' : v.isCurrent ? 'Aktuelle Version' : undefined
            const badgeColor = v.isLive ? token.colorSuccess : token.colorGrey90

            return {
              dot: (
                <FontAwesomeIcon
                  icon={v.published ? faCircleCheck : faCircle}
                  style={{ color: v.published ? token.colorSuccess : token.colorTextTertiary, fontSize: 14 }}
                />
              ),
              children: (
                <div
                  onClick={() => onSelectVersion?.(v.id)}
                  style={{ cursor: onSelectVersion ? 'pointer' : 'default', paddingBottom: token.paddingXXS }}
                >
                  <Flex align="center" gap={token.marginXXS}>
                    <Text strong={v.published}>{v.label}</Text>
                    {badgeLabel && (
                      <Tag
                        style={{
                          margin: 0,
                          border: 'none',
                          background: badgeColor,
                          color: token.colorWhite,
                          fontWeight: token.fontWeightStrong,
                          fontSize: token.fontSizeSM,
                        }}
                      >
                        {badgeLabel}
                      </Tag>
                    )}
                  </Flex>
                  <Text type="secondary" style={{ fontSize: token.fontSizeSM }}>{v.timestamp}</Text>
                </div>
              ),
            }
          })}
        />
      }
    >
      {pill}
    </Popover>
  )
}

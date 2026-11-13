import { Flex, Tag, Typography, theme } from 'antd'
import type { Visibility } from '../../../data/news/types'
import { visibilityFields, visibilityLabel } from '../../../data/news/visibilityOptions'
import { ChannelIcon, isChannelIconChannel } from '../../../designsystem/components'

const { Text } = Typography

/** Summary of all visibility restrictions of a content element. */
export default function VisibilityPopoverContent({ visibility }: { visibility: Visibility }) {
  const { token } = theme.useToken()
  const fields = visibilityFields.filter(f => visibility[f.key].length > 0)

  return (
    <Flex vertical gap={token.marginXS} style={{ maxWidth: 260 }}>
      <Text strong>Sichtbarkeit</Text>
      {fields.map(field => (
        <Flex key={field.key} vertical gap={token.marginXXS}>
          <Text strong style={{ fontSize: token.fontSizeSM }}>
            {field.key === 'channels' ? 'Kanal' : field.label}
          </Text>
          <Flex wrap gap={token.marginXXS}>
            {visibility[field.key].map(value => (
              <Tag
                key={value}
                bordered={false}
                style={{ margin: 0, display: 'inline-flex', alignItems: 'center', gap: token.marginXXS }}
              >
                {field.key === 'channels' && isChannelIconChannel(value) && (
                  <ChannelIcon channel={value} size={token.fontSizeSM} />
                )}
                {visibilityLabel(field.key, value)}
              </Tag>
            ))}
          </Flex>
        </Flex>
      ))}
    </Flex>
  )
}

import { Button, Flex, Select, Typography, theme } from 'antd'
import { emptyVisibility, isVisibilityRestricted, type Visibility } from '../../../data/news/types'
import { visibilityFields } from '../../../data/news/visibilityOptions'
import { ChannelIcon, isChannelIconChannel } from '../../../designsystem/components'

const { Text } = Typography

export interface VisibilityFormProps {
  value: Visibility
  onChange: (value: Visibility) => void
}

/** Multi-select restrictions (brand, group, role, feature, channel) for one content element. */
export default function VisibilityForm({ value, onChange }: VisibilityFormProps) {
  const { token } = theme.useToken()
  const count = Object.values(value).reduce((sum, values) => sum + values.length, 0)
  const title =
    count === 0 ? 'Keine Einschränkungen' : count === 1 ? '1 Einschränkung' : `${count} Einschränkungen`

  return (
    <Flex vertical gap={token.margin}>
      <Flex align="center" justify="space-between" style={{ minHeight: token.controlHeightSM }}>
        <Text strong>{title}</Text>
        {isVisibilityRestricted(value) && (
          <Button size="small" variant="text" color="default" onClick={() => onChange(emptyVisibility())}>
            Zurücksetzen
          </Button>
        )}
      </Flex>
      {visibilityFields.map(field => (
        <Flex key={field.key} vertical gap={token.marginXXS}>
          <Text style={{ fontSize: token.fontSizeSM }}>{field.label}</Text>
          <Select
            mode="multiple"
            allowClear
            placeholder="Keine Einschränkung"
            value={value[field.key]}
            onChange={next => onChange({ ...value, [field.key]: next })}
            options={field.options.map(o => ({
              value: o.value,
              label:
                field.key === 'channels' && isChannelIconChannel(o.value) ? (
                  <Flex align="center" gap={token.marginXS}>
                    <ChannelIcon channel={o.value} size={token.fontSize} />
                    <Text>{o.label}</Text>
                  </Flex>
                ) : (
                  o.label
                ),
            }))}
            optionLabelProp="label"
            style={{ width: '100%' }}
          />
        </Flex>
      ))}
    </Flex>
  )
}

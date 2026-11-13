import { Flex, Typography, theme } from 'antd'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faImage } from '@fortawesome/pro-light-svg-icons'
import type { ContactEventMessage } from '../../data/contactEvents'

const { Text } = Typography

export default function MessagePreview({ message, image }: { message: ContactEventMessage; image?: string }) {
  const { token } = theme.useToken()

  return (
    <Flex
      vertical
      style={{
        border: `1px solid ${token.colorBorderSecondary}`,
        borderRadius: token.borderRadiusLG,
        padding: token.paddingLG,
        gap: token.marginSM,
        maxWidth: 380,
      }}
    >
      {image ? (
        <img
          src={image}
          alt=""
          style={{ width: '100%', height: 160, objectFit: 'cover', borderRadius: token.borderRadius, display: 'block' }}
        />
      ) : (
        <Flex
          align="center"
          justify="center"
          style={{
            width: '100%',
            height: 160,
            borderRadius: token.borderRadius,
            background: token.colorFillTertiary,
            color: token.colorTextTertiary,
            fontSize: 28,
          }}
        >
          <FontAwesomeIcon icon={faImage} />
        </Flex>
      )}

      <Flex vertical gap={token.marginXXS}>
        <Text strong>{message.greeting}</Text>
        <Text>{message.body}</Text>
        <Text type="secondary">{message.signature}</Text>
      </Flex>

      <Flex vertical gap={token.marginXS}>
        {message.buttons.map(button => (
          <Flex
            key={button}
            justify="center"
            style={{
              border: `1px solid ${token.colorBorderSecondary}`,
              borderRadius: token.borderRadius,
              padding: `${token.paddingXS}px 0`,
            }}
          >
            <Text style={{ color: token.colorPrimary, fontWeight: token.fontWeightStrong }}>{button}</Text>
          </Flex>
        ))}
      </Flex>
    </Flex>
  )
}

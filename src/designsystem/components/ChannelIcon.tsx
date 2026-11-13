import { theme } from 'antd'
import whatsappIcon from '../../assets/channels/whatsapp.png'
import facebookIcon from '../../assets/channels/facebook.png'
import emailIcon from '../../assets/channels/email.png'
import googleIcon from '../../assets/channels/google.png'
import instagramIcon from '../../assets/channels/instagram.png'

export type ChannelIconChannel = 'whatsapp' | 'facebook' | 'email' | 'google' | 'instagram'

export interface ChannelIconProps {
  /** Channel whose logo is shown */
  channel: ChannelIconChannel
  /** Rendered width/height in px. Defaults to `token.fontSize`. */
  size?: number
  style?: React.CSSProperties
}

const CHANNEL_ICONS: Record<ChannelIconChannel, { src: string; label: string }> = {
  whatsapp: { src: whatsappIcon, label: 'WhatsApp' },
  facebook: { src: facebookIcon, label: 'Facebook' },
  email: { src: emailIcon, label: 'E-Mail' },
  google: { src: googleIcon, label: 'Google' },
  instagram: { src: instagramIcon, label: 'Instagram' },
}

export const isChannelIconChannel = (value: string): value is ChannelIconChannel =>
  value in CHANNEL_ICONS

export default function ChannelIcon({ channel, size, style }: ChannelIconProps) {
  const { token } = theme.useToken()
  const px = size ?? token.fontSize
  const { src, label } = CHANNEL_ICONS[channel]

  return (
    <img
      src={src}
      alt={label}
      width={px}
      height={px}
      style={{ display: 'block', flexShrink: 0, objectFit: 'contain', ...style }}
    />
  )
}

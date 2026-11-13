import { useState } from 'react'
import { Button, theme } from 'antd'
import type { ButtonProps } from 'antd'

export type GreyButtonProps = ButtonProps

/**
 * Dark grey solid button. antd's `color="default" variant="solid"` renders
 * `colorBgSolid` (black), so the background is set to `colorGrey90` here
 * (`colorGrey80` on hover).
 */
export default function GreyButton({ style, onMouseEnter, onMouseLeave, disabled, ...props }: GreyButtonProps) {
  const { token } = theme.useToken()
  const [hovered, setHovered] = useState(false)

  return (
    <Button
      color="default"
      variant="solid"
      disabled={disabled}
      onMouseEnter={e => {
        setHovered(true)
        onMouseEnter?.(e)
      }}
      onMouseLeave={e => {
        setHovered(false)
        onMouseLeave?.(e)
      }}
      style={disabled ? style : { background: hovered ? token.colorGrey90 : token.colorGrey, ...style }}
      {...props}
    />
  )
}

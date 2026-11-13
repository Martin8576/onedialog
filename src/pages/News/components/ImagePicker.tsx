import { useRef } from 'react'
import { Button, Flex, Tooltip, Typography, theme } from 'antd'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faImage, faPen, faXmark } from '@fortawesome/pro-light-svg-icons'

const { Text } = Typography

export interface ImagePickerProps {
  value?: string
  onChange: (value: string | undefined) => void
}

/** Thumbnail with edit/remove actions; images are picked from the user's computer. */
export default function ImagePicker({ value, onChange }: ImagePickerProps) {
  const { token } = theme.useToken()
  const inputRef = useRef<HTMLInputElement>(null)

  const openFileDialog = () => inputRef.current?.click()

  const handleFile = (file: File | undefined) => {
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => onChange(typeof reader.result === 'string' ? reader.result : undefined)
    reader.readAsDataURL(file)
  }

  return (
    <Flex align="center" gap={token.marginXXS}>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        hidden
        onChange={e => {
          handleFile(e.target.files?.[0])
          e.target.value = ''
        }}
      />
      <Flex
        align="center"
        justify="center"
        onClick={openFileDialog}
        style={{
          width: 110,
          height: 70,
          padding: token.paddingXXS,
          border: `${token.lineWidth}px solid ${token.colorGrey16}`,
          borderRadius: token.borderRadius,
          background: token.colorBgContainer,
          cursor: 'pointer',
        }}
      >
        {value ? (
          <img
            src={value}
            alt=""
            style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: token.borderRadiusSM }}
          />
        ) : (
          <Flex vertical align="center" gap={token.marginXXS} style={{ color: token.colorTextTertiary }}>
            <FontAwesomeIcon icon={faImage} />
            <Text type="secondary" style={{ fontSize: token.fontSizeSM }}>Bild hochladen</Text>
          </Flex>
        )}
      </Flex>
      <Flex vertical gap={token.marginXXS}>
        <Tooltip title={value ? 'Bild ersetzen' : 'Bild hochladen'}>
          <Button size="small" variant="text" color="default" icon={<FontAwesomeIcon icon={faPen} />} onClick={openFileDialog} />
        </Tooltip>
        {value && (
          <Tooltip title="Bild entfernen">
            <Button
              size="small"
              variant="text"
              color="default"
              icon={<FontAwesomeIcon icon={faXmark} />}
              onClick={() => onChange(undefined)}
            />
          </Tooltip>
        )}
      </Flex>
    </Flex>
  )
}

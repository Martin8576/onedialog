import { Modal, Typography } from 'antd'

const { Paragraph, Text } = Typography

export interface DeleteNewsModalProps {
  open: boolean
  title?: string
  onConfirm: () => void
  onCancel: () => void
}

/** Confirmation dialog shown before a release news is deleted permanently. */
export default function DeleteNewsModal({ open, title, onConfirm, onCancel }: DeleteNewsModalProps) {
  return (
    <Modal
      open={open}
      title="Release-News löschen?"
      okText="Löschen"
      cancelText="Abbrechen"
      okButtonProps={{ danger: true }}
      onOk={onConfirm}
      onCancel={onCancel}
      centered
      destroyOnHidden
    >
      <Paragraph style={{ margin: 0 }}>
        {title ? (
          <>
            Möchten Sie <Text strong>„{title}“</Text> wirklich löschen?
          </>
        ) : (
          'Möchten Sie diese Release-News wirklich löschen?'
        )}{' '}
        Dieser Vorgang kann nicht rückgängig gemacht werden.
      </Paragraph>
    </Modal>
  )
}

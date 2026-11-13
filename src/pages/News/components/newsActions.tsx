import type { MenuProps } from 'antd'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faBoxArchive,
  faClone,
  faPaperPlane,
  faPen,
  faRotateLeft,
  faTrash,
} from '@fortawesome/pro-light-svg-icons'
import type { NewsStatus } from '../../../data/news/types'

export type NewsAction = 'edit' | 'publish' | 'duplicate' | 'archive' | 'restore' | 'delete'

/** Context-menu items for a release news, depending on its status. */
export function newsMenuItems(status: NewsStatus, { withEdit = true } = {}): MenuProps['items'] {
  const edit = { key: 'edit', label: 'Bearbeiten', icon: <FontAwesomeIcon icon={faPen} /> }
  const publish = { key: 'publish', label: 'Veröffentlichen', icon: <FontAwesomeIcon icon={faPaperPlane} /> }
  const duplicate = { key: 'duplicate', label: 'Duplizieren', icon: <FontAwesomeIcon icon={faClone} /> }
  const archive = { key: 'archive', label: 'Archivieren', icon: <FontAwesomeIcon icon={faBoxArchive} /> }
  const restore = { key: 'restore', label: 'Als Entwurf wiederherstellen', icon: <FontAwesomeIcon icon={faRotateLeft} /> }
  const divider = { type: 'divider' as const }
  const remove = { key: 'delete', label: 'Löschen', icon: <FontAwesomeIcon icon={faTrash} />, danger: true }

  const editItems = withEdit ? [edit] : []

  switch (status) {
    case 'active':
      return [...editItems, duplicate, archive, divider, remove]
    case 'draft':
      return [...editItems, publish, duplicate, archive, divider, remove]
    case 'archived':
      return [restore, duplicate, divider, remove]
  }
}

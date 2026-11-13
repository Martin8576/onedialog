import { Flex, Tag, theme } from 'antd'
import {
  faCircleInfo, faMessageLines, faSliders, faListCheck,
} from '@fortawesome/pro-light-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Widget, WidgetItem } from '../../designsystem/components'
import {
  contactFieldOptions, conditionFieldOptions, vorgangOptions,
  sichtbarkeitOptions, vorgangStatusOptions, assigneeOptions, errorHandlingOptions,
  type ContactEvent,
} from '../../data/contactEvents'
import MessagePreview from './MessagePreview'

function optionLabel(options: { value: string; label: string }[], value?: string): string {
  return options.find(o => o.value === value)?.label ?? '–'
}

function Informationen({ event }: { event: ContactEvent }) {
  const { token } = theme.useToken()
  return (
    <Flex vertical style={{ padding: token.paddingLG, gap: token.margin }}>
      <Widget
        title="Informationen"
        icon={<FontAwesomeIcon icon={faCircleInfo} />}
        content={
          <Flex vertical>
            <WidgetItem label="Name" value={event.name} />
            <WidgetItem label="Beschreibung" value={event.description || '–'} />
          </Flex>
        }
      />
    </Flex>
  )
}

function Nachricht({ event }: { event: ContactEvent }) {
  const { token } = theme.useToken()
  return (
    <Flex vertical style={{ padding: token.paddingLG, gap: token.margin }}>
      <Widget
        title="Nachricht"
        icon={<FontAwesomeIcon icon={faMessageLines} />}
        content={
          <Flex style={{ padding: token.paddingXS }}>
            <MessagePreview message={event.message} image={event.image} />
          </Flex>
        }
      />
    </Flex>
  )
}

function Einstellungen({ event }: { event: ContactEvent }) {
  const { token } = theme.useToken()
  return (
    <Flex vertical style={{ padding: token.paddingLG, gap: token.margin }}>
      <Widget
        title="Auslöser"
        icon={<FontAwesomeIcon icon={faSliders} />}
        content={
          <Flex vertical>
            <WidgetItem label="Kontakt-Feld" value={optionLabel(contactFieldOptions, event.trigger.contactField)} />
            <WidgetItem
              label="Zeitlicher Versatz"
              value={`${event.trigger.offsetDays} Tage ${event.trigger.offsetDirection === 'before' ? 'vorher' : 'danach'}`}
            />
          </Flex>
        }
      />

      <Widget
        title="Bedingungen"
        icon={<FontAwesomeIcon icon={faListCheck} />}
        content={
          event.conditions.length === 0 ? (
            <WidgetItem value="Keine Bedingungen definiert" />
          ) : (
            <Flex vertical>
              {event.conditions.map((condition, i) => (
                <WidgetItem
                  key={i}
                  label={optionLabel(conditionFieldOptions, condition.field)}
                  value={condition.value}
                />
              ))}
            </Flex>
          )
        }
      />
    </Flex>
  )
}

function Aktionen({ event }: { event: ContactEvent }) {
  const { token } = theme.useToken()
  return (
    <Flex vertical style={{ padding: token.paddingLG, gap: token.margin }}>
      <Widget
        title="Vorgang"
        content={
          <Flex vertical>
            <WidgetItem label="Vorgang" value={optionLabel(vorgangOptions, event.actions.vorgang)} />
            <WidgetItem label="Sichtbarkeit" value={optionLabel(sichtbarkeitOptions, event.actions.sichtbarkeit)} />
            <WidgetItem label="Status" value={optionLabel(vorgangStatusOptions, event.actions.status)} />
          </Flex>
        }
      />
      <Widget
        title="Teammitglied zuweisen"
        content={<WidgetItem value={optionLabel(assigneeOptions, event.assignee)} />}
      />
      <Widget
        title="Fehlermanagement"
        content={
          <WidgetItem
            tags={<Tag style={{ margin: 0 }}>{optionLabel(errorHandlingOptions, event.errorHandling)}</Tag>}
          />
        }
      />
    </Flex>
  )
}

const ContactEventEditTabs = { Informationen, Nachricht, Einstellungen, Aktionen }

export default ContactEventEditTabs

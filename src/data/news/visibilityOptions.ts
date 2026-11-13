import type { Visibility } from './types'

export type VisibilityOption = { value: string; label: string }

export const brandOptions: VisibilityOption[] = [
  { value: 'itzehoer', label: 'Itzehoer' },
  { value: 'onedialog', label: 'oneDialog' },
  { value: 'vodafone', label: 'Vodafone' },
]

export const groupOptions: VisibilityOption[] = [
  { value: 'premium', label: 'Premium-Partner' },
  { value: 'shop', label: 'Shop-Partner' },
  { value: 'online', label: 'Online-Händler' },
  { value: 'pilot', label: 'Pilot-Händler' },
]

export const roleOptions: VisibilityOption[] = [
  { value: 'admin', label: 'Admin' },
  { value: 'user', label: 'Nutzer' },
]

export const featureOptions: VisibilityOption[] = [
  { value: 'tasks', label: 'Aufgaben' },
  { value: 'reviews', label: 'Bewertungen' },
  { value: 'appointments', label: 'Terminbuchung' },
  { value: 'dialogs', label: 'Dialoge' },
  { value: 'contacts', label: 'Kontakte' },
  { value: 'automations', label: 'Automatisierungen' },
]

export const channelOptions: VisibilityOption[] = [
  { value: 'email', label: 'Email' },
  { value: 'facebook', label: 'Facebook' },
  { value: 'whatsapp', label: 'WhatsApp' },
]

export const visibilityFields: { key: keyof Visibility; label: string; options: VisibilityOption[] }[] = [
  { key: 'brands', label: 'Marke', options: brandOptions },
  { key: 'groups', label: 'Gruppe', options: groupOptions },
  { key: 'roles', label: 'Rolle', options: roleOptions },
  { key: 'features', label: 'Feature', options: featureOptions },
  { key: 'channels', label: 'Channel', options: channelOptions },
]

export const visibilityLabel = (key: keyof Visibility, value: string): string =>
  visibilityFields.find(f => f.key === key)?.options.find(o => o.value === value)?.label ?? value

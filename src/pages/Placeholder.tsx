import PageLayout from '../designsystem/sharedComponents/PageLayout'

/** Empty page for navigation entries whose content is not implemented yet. */
export default function Placeholder({ title }: { title: string }) {
  return <PageLayout title={title} />
}

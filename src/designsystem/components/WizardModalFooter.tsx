import { Button, Flex, Steps, theme } from 'antd'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronLeft, faChevronRight } from '@fortawesome/pro-light-svg-icons'

export interface WizardStep {
  title: string
}

export interface WizardModalFooterProps {
  currentStep: number
  steps: WizardStep[]
  onBack: () => void
  onNext: () => void
  nextLabel?: string
  nextDisabled?: boolean
  bordered?: boolean
}

export default function WizardModalFooter({
  currentStep,
  steps,
  onBack,
  onNext,
  nextLabel,
  nextDisabled,
  bordered = true,
}: WizardModalFooterProps) {
  const { token } = theme.useToken()
  const isLastStep = currentStep === steps.length - 1
  const label = nextLabel ?? (isLastStep ? 'Aktivieren' : 'Weiter')

  return (
    <Flex
      align="center"
      justify="space-between"
      style={{
        padding: `${token.paddingSM}px ${token.padding}px`,
        borderTop: bordered ? `1px solid ${token.colorBorder}` : 'none',
      }}
    >
      <Button
        icon={<FontAwesomeIcon icon={faChevronLeft} />}
        onClick={onBack}
        disabled={currentStep === 0}
      >
        Zurück
      </Button>

      <Steps
        size="small"
        type="dot"
        current={currentStep}
        items={steps.map(s => ({ title: s.title }))}
        style={{ flex: 1, maxWidth: 800 }}
        styles={{ itemTitle: { fontSize: token.fontSizeSM } }}
      />

      <Button
        type="primary"
        onClick={onNext}
        disabled={nextDisabled}
        icon={isLastStep ? undefined : <FontAwesomeIcon icon={faChevronRight} />}
        iconPosition="end"
      >
        {label}
      </Button>
    </Flex>
  )
}

import type React from 'react'
import { Typography } from 'antd'

const { Title, Paragraph, Text } = Typography

/**
 * Minimal markdown subset used by the news text editor:
 * `# ` / `## ` / `### ` headings, `- ` list items, `**bold**` and `*italic*`.
 */
function renderInline(text: string): React.ReactNode[] {
  return text.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g).map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**') && part.length > 4) {
      return <Text key={i} strong>{part.slice(2, -2)}</Text>
    }
    if (part.startsWith('*') && part.endsWith('*') && part.length > 2) {
      return <Text key={i} italic>{part.slice(1, -1)}</Text>
    }
    return part
  })
}

export function renderMarkdown(source: string): React.ReactNode {
  const blocks: React.ReactNode[] = []
  const lines = source.split('\n')
  let paragraph: string[] = []
  let list: string[] = []

  const flushParagraph = () => {
    if (paragraph.length === 0) return
    const content = paragraph
    blocks.push(
      <Paragraph key={blocks.length} style={{ margin: 0 }}>
        {content.map((line, i) => (
          <span key={i}>
            {i > 0 && <br />}
            {renderInline(line)}
          </span>
        ))}
      </Paragraph>,
    )
    paragraph = []
  }
  const flushList = () => {
    if (list.length === 0) return
    blocks.push(
      <ul key={blocks.length} style={{ margin: 0, paddingInlineStart: '1.25em' }}>
        {list.map((item, i) => (
          <li key={i}>
            <Text>{renderInline(item)}</Text>
          </li>
        ))}
      </ul>,
    )
    list = []
  }

  for (const line of lines) {
    const heading = /^(#{1,3}) (.*)$/.exec(line)
    if (heading) {
      flushParagraph()
      flushList()
      const level = (heading[1].length + 2) as 3 | 4 | 5
      blocks.push(
        <Title key={blocks.length} level={level} style={{ margin: 0 }}>
          {renderInline(heading[2])}
        </Title>,
      )
    } else if (line.startsWith('- ')) {
      flushParagraph()
      list.push(line.slice(2))
    } else if (line.trim() === '') {
      flushParagraph()
      flushList()
    } else {
      flushList()
      paragraph.push(line)
    }
  }
  flushParagraph()
  flushList()

  return blocks
}

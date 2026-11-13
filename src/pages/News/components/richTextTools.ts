export type RichTextTool = 'bold' | 'italic' | 'list' | 'emoji'

/** Toolbar presets: texts get Fett, Italic, Liste and Emojis; headings only Emojis (+ optional H1–H3). */
export const TEXT_TOOLS: RichTextTool[] = ['bold', 'italic', 'list', 'emoji']
export const HEADING_TOOLS: RichTextTool[] = ['emoji']

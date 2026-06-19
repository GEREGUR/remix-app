import type { Handle, SerializableProps } from 'remix/ui'

import { CopyToClipboard } from './copy-to-clipboard.tsx'

interface PromptButtonProps extends SerializableProps {
  text: string
}

export function PromptButton(handle: Handle<PromptButtonProps>) {
  return () => (
    <CopyToClipboard
      text={handle.props.text}
      label={`\u201C${handle.props.text}\u201D`}
      copiedLabel="Copied to clipboard"
      failedLabel="Copy failed"
      className="prompt-copy-button"
    />
  )
}

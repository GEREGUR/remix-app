import { clientEntry, css, on, type Handle, type SerializableProps } from 'remix/ui'

const DEFAULT_RESET_AFTER_MS = 2000

type CopyState = 'idle' | 'copied' | 'failed'

export interface CopyToClipboardProps extends SerializableProps {
  text: string
  label?: string
  copiedLabel?: string
  failedLabel?: string
  resetAfterMs?: number
  className?: string
}

export const CopyToClipboard = clientEntry(
  import.meta.url,
  function CopyToClipboard(handle: Handle<CopyToClipboardProps>) {
    let state: CopyState = 'idle'
    let resetTimer: ReturnType<typeof setTimeout> | undefined

    handle.signal.addEventListener('abort', () => {
      if (resetTimer) clearTimeout(resetTimer)
    })

    function resetAfterDelay() {
      if (resetTimer) clearTimeout(resetTimer)

      resetTimer = setTimeout(() => {
        state = 'idle'
        handle.update()
      }, handle.props.resetAfterMs ?? DEFAULT_RESET_AFTER_MS)
    }

    async function copyText(signal: AbortSignal) {
      let nextState: CopyState = 'copied'

      try {
        await navigator.clipboard.writeText(handle.props.text)
      } catch {
        nextState = 'failed'
      }

      if (signal.aborted) return

      state = nextState
      await handle.update()

      if (signal.aborted) return
      resetAfterDelay()
    }

    return () => {
      let idle = state === 'idle'
      let copied = state === 'copied'
      let failed = state === 'failed'
      let label = handle.props.label ?? 'Copy'
      let visibleLabel = copied
        ? (handle.props.copiedLabel ?? 'Copied')
        : failed
          ? (handle.props.failedLabel ?? 'Copy failed')
          : label

      return (
        <button
          type="button"
          className={handle.props.className}
          data-copy-state={state}
          aria-label={visibleLabel}
          mix={[
            buttonStyle,
            on('click', (_event, signal) => {
              copyText(signal)
            }),
          ]}
        >
          <span aria-hidden="true" mix={iconSlotStyle}>
            <CopyIcon />
          </span>
          <span
            role="status"
            aria-live="polite"
            aria-atomic="true"
            mix={labelStyle}
            data-idle={idle ? '' : undefined}
          >
            {visibleLabel}
          </span>
        </button>
      )
    }
  },
)

export function CopyIcon() {
  return () => (
    <svg viewBox="0 0 14 16.5" fill="none">
      <path
        d="M0.75 9.188L0.75 4.083C0.75 2.242 2.242 0.75 4.083 0.75L9.188 0.75M5.75 15.75L11.375 15.75C12.41 15.75 13.25 14.91 13.25 13.875L13.25 5.75C13.25 4.714 12.41 3.875 11.375 3.875L5.75 3.875C4.714 3.875 3.875 4.714 3.875 5.75L3.875 13.875C3.875 14.91 4.714 15.75 5.75 15.75Z"
        stroke="currentColor"
        stroke-width="1.5"
        stroke-linecap="round"
      />
    </svg>
  )
}

const buttonStyle = css({
  appearance: 'none',
  alignItems: 'center',
  background: 'transparent',
  border: 0,
  borderRadius: '12px',
  color: 'var(--text-primary, inherit)',
  cursor: 'pointer',
  display: 'flex',
  font: 'inherit',
  gap: '16px',
  padding: '16px',
  textAlign: 'left',
  transition: 'background-color 150ms ease, color 150ms ease',
  width: '100%',
  '&:hover, &:focus-visible, &[data-copy-state="copied"], &[data-copy-state="failed"]': {
    background: 'var(--surface-4, rgba(0, 0, 0, 0.06))',
    color: 'var(--brand-blue, currentColor)',
    outline: 'none',
  },
})

const iconSlotStyle = css({
  alignItems: 'center',
  display: 'flex',
  flex: '0 0 24px',
  justifyContent: 'center',
  width: '24px',
  '& svg': {
    display: 'block',
    height: '20px',
    transform: 'rotate(180deg)',
    width: '20px',
  },
})

const labelStyle = css({
  flex: '1 1 0',
  fontSize: '14px',
  lineHeight: 1.5,
  minWidth: 0,
})

import assert from 'node:assert/strict'
import test from 'node:test'

import { Window } from 'happy-dom'

installDom()

const [{ createElement }, { render }, { CopyToClipboard }] = await Promise.all([
  import('remix/ui'),
  import('remix/ui/test'),
  import('./copy-to-clipboard.tsx'),
])

test('copy button writes text to the clipboard, confirms, and resets', async () => {
  let writes: string[] = []
  installClipboard({
    writeText(text) {
      writes.push(text)
      return Promise.resolve()
    },
  })

  let result = render(
    createElement(CopyToClipboard, {
      text: 'copy me',
      label: 'Copy value',
      copiedLabel: 'Copied it',
      resetAfterMs: 10,
    }),
  )

  try {
    let button = result.$('button')!

    await result.act(async () => {
      button.click()
      await Promise.resolve()
    })

    assert.deepEqual(writes, ['copy me'])
    assert.equal(result.$('[role="status"]')?.textContent, 'Copied it')

    await wait(20)
    await result.act(() => {})

    assert.equal(result.$('[role="status"]')?.textContent, 'Copy value')
  } finally {
    result.cleanup()
  }
})

test('copy button shows the failure label when clipboard write rejects', async () => {
  installClipboard({
    writeText() {
      return Promise.reject(new Error('denied'))
    },
  })

  let result = render(
    createElement(CopyToClipboard, {
      text: 'copy me',
      label: 'Copy value',
      failedLabel: 'No clipboard',
      resetAfterMs: 10,
    }),
  )

  try {
    let button = result.$('button')!

    await result.act(async () => {
      button.click()
      await Promise.resolve()
    })

    assert.equal(result.$('[role="status"]')?.textContent, 'No clipboard')
  } finally {
    result.cleanup()
  }
})

function installDom() {
  let window = new Window({ url: 'http://localhost/' })
  window.CSSStyleSheet.prototype.insertRule = () => 0

  Object.assign(globalThis, {
    window,
    document: window.document,
    Node: window.Node,
    Text: window.Text,
    Comment: window.Comment,
    Document: window.Document,
    DocumentFragment: window.DocumentFragment,
    Element: window.Element,
    HTMLElement: window.HTMLElement,
    SVGElement: window.SVGElement,
    Event: window.Event,
    EventTarget: window.EventTarget,
    MouseEvent: window.MouseEvent,
    AbortController: window.AbortController,
    AbortSignal: window.AbortSignal,
    CSSStyleSheet: window.CSSStyleSheet,
    CSSStyleRule: window.CSSStyleRule,
  })

  Object.defineProperty(globalThis, 'navigator', {
    value: window.navigator,
    configurable: true,
  })
}

function installClipboard(clipboard: Pick<Clipboard, 'writeText'>) {
  Object.defineProperty(navigator, 'clipboard', {
    value: clipboard,
    configurable: true,
  })
}

function wait(ms: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms))
}

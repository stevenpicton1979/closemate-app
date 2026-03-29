'use client'

import { useEffect, useRef, useState } from 'react'

const STORAGE_KEY = 'closemate-home-prompt-dismissed'

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

export default function HomeScreenPrompt() {
  const [visible, setVisible] = useState(false)
  const [isIOS, setIsIOS] = useState(false)
  const [androidOpen, setAndroidOpen] = useState(false)
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null)

  useEffect(() => {
    if (localStorage.getItem(STORAGE_KEY)) return

    setVisible(true)
    setIsIOS(/iPad|iPhone|iPod/.test(navigator.userAgent))

    const handler = (e: Event) => {
      e.preventDefault()
      setInstallPrompt(e as BeforeInstallPromptEvent)
    }
    window.addEventListener('beforeinstallprompt', handler)
    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  function dismiss() {
    localStorage.setItem(STORAGE_KEY, '1')
    setVisible(false)
  }

  async function handleInstall() {
    if (!installPrompt) return
    await installPrompt.prompt()
    const { outcome } = await installPrompt.userChoice
    if (outcome === 'accepted') dismiss()
  }

  if (!visible) return null

  return (
    <div className="flex items-start gap-2 bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2.5 text-xs">
      <div className="flex-1 min-w-0">
        <p className="text-zinc-300 leading-snug">
          Add CloseMate to your home screen for quicker access
        </p>
        {isIOS && (
          <p className="text-zinc-500 mt-0.5">Safari: Share → Add to Home Screen</p>
        )}
        {androidOpen && (
          <p className="text-zinc-500 mt-0.5">Tap ⋮ → Add to Home Screen</p>
        )}
      </div>

      <div className="flex items-center gap-2.5 shrink-0 pt-px">
        {installPrompt && (
          <button
            onClick={handleInstall}
            className="text-zinc-100 font-medium hover:text-white"
          >
            Install
          </button>
        )}
        {!isIOS && !installPrompt && (
          <button
            onClick={() => setAndroidOpen(v => !v)}
            className="text-zinc-500 hover:text-zinc-300"
          >
            Android?
          </button>
        )}
        <button
          onClick={dismiss}
          className="text-zinc-600 hover:text-zinc-400 text-sm leading-none px-0.5"
          aria-label="Dismiss"
        >
          ✕
        </button>
      </div>
    </div>
  )
}

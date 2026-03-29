'use client'

import { useState } from 'react'

const inputClass = 'w-full border border-zinc-700 rounded-lg px-3 py-3 text-base bg-zinc-800 text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:border-transparent pr-16'

interface Props {
  id: string
  name: string
  autoComplete?: string
  minLength?: number
}

export default function PasswordInput({ id, name, autoComplete, minLength }: Props) {
  const [show, setShow] = useState(false)

  return (
    <div className="relative">
      <input
        id={id}
        name={name}
        type={show ? 'text' : 'password'}
        required
        autoComplete={autoComplete}
        minLength={minLength}
        className={inputClass}
      />
      <button
        type="button"
        onClick={() => setShow(v => !v)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-zinc-400 hover:text-zinc-200"
      >
        {show ? 'Hide' : 'Show'}
      </button>
    </div>
  )
}

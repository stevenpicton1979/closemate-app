'use client'

import { useState } from 'react'

export interface LineItem {
  description: string
  amount: string
}

const inputClass = 'border border-zinc-700 rounded-lg px-3 py-3 text-base bg-zinc-800 text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:border-transparent'

function parseLineItems(breakdown: string | null | undefined): LineItem[] {
  if (!breakdown) return [{ description: '', amount: '' }]
  try {
    const parsed = JSON.parse(breakdown)
    if (Array.isArray(parsed) && parsed.length > 0) return parsed
  } catch {}
  return [{ description: '', amount: '' }]
}

interface Props {
  initialBreakdown?: string | null
  totalInputId?: string
}

export default function LineItemsInput({ initialBreakdown, totalInputId }: Props) {
  const [items, setItems] = useState<LineItem[]>(() => parseLineItems(initialBreakdown))

  function update(index: number, field: keyof LineItem, value: string) {
    setItems(prev => prev.map((item, i) => i === index ? { ...item, [field]: value } : item))
  }

  function addItem() {
    setItems(prev => [...prev, { description: '', amount: '' }])
  }

  function removeItem(index: number) {
    setItems(prev => prev.filter((_, i) => i !== index))
  }

  function splitTotal() {
    if (!totalInputId) return
    const input = document.getElementById(totalInputId) as HTMLInputElement | null
    const total = parseFloat(input?.value ?? '0')
    if (!total || items.length === 0) return
    const each = (total / items.length).toFixed(2)
    setItems(prev => prev.map(item => ({ ...item, amount: each })))
  }

  const serialized = JSON.stringify(items.filter(item => item.description.trim() !== ''))

  return (
    <div className="space-y-2">
      <input type="hidden" name="breakdown" value={serialized} />

      {items.map((item, index) => (
        <div key={index} className="flex gap-2 items-center">
          <input
            type="text"
            value={item.description}
            onChange={e => update(index, 'description', e.target.value)}
            placeholder="e.g. Labour (4hrs)"
            className={`${inputClass} flex-1 min-w-0`}
          />
          <input
            type="number"
            value={item.amount}
            onChange={e => update(index, 'amount', e.target.value)}
            placeholder="$0"
            min="0"
            step="0.01"
            className={`${inputClass} w-24 shrink-0`}
          />
          {items.length > 1 && (
            <button
              type="button"
              onClick={() => removeItem(index)}
              className="shrink-0 text-zinc-500 hover:text-zinc-300 text-xl leading-none px-1"
              aria-label="Remove item"
            >
              ×
            </button>
          )}
        </div>
      ))}

      <div className="flex gap-4 pt-1">
        <button
          type="button"
          onClick={addItem}
          className="text-sm text-zinc-400 hover:text-zinc-200"
        >
          + Add item
        </button>
        {totalInputId && items.length > 0 && (
          <button
            type="button"
            onClick={splitTotal}
            className="text-sm text-zinc-400 hover:text-zinc-200"
          >
            Split total across items
          </button>
        )}
      </div>
    </div>
  )
}

'use client'

import { useState, useEffect } from 'react'

interface LineItem {
  description: string
  amount: string
  pct: string
}

const BREAKDOWN_KEY = 'closemate-breakdown-enabled'

const inputClass = 'border border-zinc-700 rounded-lg px-3 py-3 text-base bg-zinc-800 text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:border-transparent'
const labelClass = 'block text-sm font-medium text-zinc-300 mb-1'

function equalPct(n: number): string {
  return (100 / n).toFixed(1)
}

function calcAmount(totalNum: number, pct: string): string {
  const p = parseFloat(pct)
  if (!totalNum || isNaN(p)) return ''
  return (totalNum * p / 100).toFixed(2)
}

function hasBreakdownData(breakdown: string | null | undefined): boolean {
  if (!breakdown) return false
  try {
    const parsed = JSON.parse(breakdown)
    return Array.isArray(parsed) && parsed.some((i: LineItem) => i.description?.trim())
  } catch {}
  return false
}

function parseItems(breakdown: string | null | undefined): LineItem[] {
  if (!breakdown) return [{ description: '', amount: '', pct: '' }]
  try {
    const parsed = JSON.parse(breakdown)
    if (Array.isArray(parsed) && parsed.length > 0) {
      const n = parsed.length
      return parsed.map((item) => ({
        description: item.description ?? '',
        amount: item.amount ?? '',
        pct: item.pct ?? equalPct(n),
      }))
    }
  } catch {}
  return [{ description: '', amount: '', pct: '' }]
}

interface Props {
  initialTotal?: string
  initialBreakdown?: string | null
  required?: boolean
}

export default function PricingSection({ initialTotal = '', initialBreakdown, required }: Props) {
  const [total, setTotal] = useState(initialTotal)
  const [items, setItems] = useState<LineItem[]>(() => parseItems(initialBreakdown))
  const [gstIncluded, setGstIncluded] = useState(true)
  const [breakdownOpen, setBreakdownOpen] = useState(() => hasBreakdownData(initialBreakdown))

  // Read localStorage preference after mount (hydration-safe)
  useEffect(() => {
    if (!hasBreakdownData(initialBreakdown)) {
      setBreakdownOpen(localStorage.getItem(BREAKDOWN_KEY) === 'true')
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  function toggleBreakdown() {
    const next = !breakdownOpen
    setBreakdownOpen(next)
    localStorage.setItem(BREAKDOWN_KEY, String(next))
  }

  const totalNum = parseFloat(total) || 0

  function handleTotalChange(val: string) {
    setTotal(val)
    const n = parseFloat(val) || 0
    setItems(prev => prev.map(item => ({ ...item, amount: calcAmount(n, item.pct) })))
  }

  function adjustTotal(delta: number) {
    const next = Math.max(0, totalNum + delta)
    const nextStr = Number.isInteger(next) ? String(next) : next.toFixed(2)
    setTotal(nextStr)
    setItems(prev => prev.map(item => ({ ...item, amount: calcAmount(next, item.pct) })))
  }

  function updatePct(index: number, pct: string) {
    setItems(prev => prev.map((item, i) =>
      i === index ? { ...item, pct, amount: calcAmount(totalNum, pct) } : item
    ))
  }

  function updateDescription(index: number, description: string) {
    setItems(prev => prev.map((item, i) => i === index ? { ...item, description } : item))
  }

  function updateAmount(index: number, amount: string) {
    setItems(prev => prev.map((item, i) => i === index ? { ...item, amount } : item))
  }

  function addItem() {
    setItems(prev => [...prev, { description: '', amount: '', pct: '' }])
  }

  function removeItem(index: number) {
    setItems(prev => prev.filter((_, i) => i !== index))
  }

  function splitEvenly() {
    const n = items.length
    if (!n) return
    const pct = equalPct(n)
    setItems(prev => prev.map(item => ({ ...item, pct, amount: calcAmount(totalNum, pct) })))
  }

  const gstAmount = gstIncluded && totalNum > 0 ? (totalNum / 11).toFixed(2) : null
  const filtered = items.filter(item => item.description.trim() !== '')
  const serialized = filtered.length > 0 ? JSON.stringify(filtered) : ''

  return (
    <>
      <input type="hidden" name="breakdown" value={serialized} />

      {/* Total amount with quick adjust */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <label htmlFor="quoteAmount" className={labelClass}>Quote amount ($)</label>
          <div className="flex gap-1">
            {([50, 100, 200] as const).map(delta => (
              <button
                key={delta}
                type="button"
                onClick={() => adjustTotal(delta)}
                className="text-xs text-zinc-400 hover:text-zinc-200 border border-zinc-700 rounded px-2 py-0.5"
              >
                +{delta}
              </button>
            ))}
          </div>
        </div>
        <input
          id="quoteAmount"
          name="quoteAmount"
          type="number"
          value={total}
          onChange={e => handleTotalChange(e.target.value)}
          required={required}
          min="0"
          step="0.01"
          placeholder="0.00"
          enterKeyHint="next"
          className={`${inputClass} w-full`}
        />
        <div className="flex items-center justify-between mt-2">
          {gstAmount ? (
            <p className="text-xs text-zinc-500">Includes ${gstAmount} GST</p>
          ) : (
            <span />
          )}
          <button
            type="button"
            onClick={() => setGstIncluded(v => !v)}
            className="text-xs text-zinc-500 hover:text-zinc-300"
          >
            {gstIncluded ? 'GST included ✓' : 'No GST'}
          </button>
        </div>
      </div>

      {/* Breakdown toggle + section */}
      <div className="pt-2 border-t border-zinc-700">
        {breakdownOpen ? (
          <>
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm font-medium text-zinc-300">
                Break this price down
              </p>
              <button
                type="button"
                onClick={toggleBreakdown}
                className="text-xs text-zinc-500 hover:text-zinc-300"
              >
                Remove breakdown
              </button>
            </div>

            <div className="space-y-3">
              {items.map((item, index) => (
                <div key={index} className="space-y-1">
                  <div className="flex gap-2 items-center">
                    <input
                      type="text"
                      value={item.description}
                      onChange={e => updateDescription(index, e.target.value)}
                      placeholder={index === 0 ? 'Driveway cleaning' : index === 1 ? 'Patio wash' : 'Item description'}
                      className={`${inputClass} flex-1 min-w-0`}
                    />
                    <button
                      type="button"
                      onClick={() => removeItem(index)}
                      className="shrink-0 text-zinc-600 hover:text-zinc-300 text-2xl leading-none px-1"
                      aria-label="Remove item"
                    >
                      ×
                    </button>
                  </div>
                  <div className="flex gap-2">
                    <div className="w-28 shrink-0">
                      <input
                        type="number"
                        value={item.pct}
                        onChange={e => updatePct(index, e.target.value)}
                        min="0"
                        step="0.1"
                        placeholder="0.0"
                        className={`${inputClass} w-full text-center`}
                      />
                      <p className="text-xs text-zinc-600 text-center mt-0.5">%</p>
                    </div>
                    <div className="flex-1">
                      <input
                        type="number"
                        value={item.amount}
                        onChange={e => updateAmount(index, e.target.value)}
                        placeholder="0.00"
                        min="0"
                        step="0.01"
                        className={`${inputClass} w-full text-right`}
                      />
                      <p className="text-xs text-zinc-600 text-right mt-0.5">amount ($)</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-4 mt-4">
              <button
                type="button"
                onClick={addItem}
                className="text-sm text-zinc-400 hover:text-zinc-200"
              >
                + Add item
              </button>
              {items.length > 1 && (
                <button
                  type="button"
                  onClick={splitEvenly}
                  className="text-sm text-zinc-100 bg-zinc-700 hover:bg-zinc-600 rounded-full px-4 py-1.5"
                >
                  Split evenly
                </button>
              )}
            </div>
          </>
        ) : (
          <button
            type="button"
            onClick={toggleBreakdown}
            className="text-sm text-zinc-400 hover:text-zinc-200"
          >
            + Add breakdown
          </button>
        )}
      </div>
    </>
  )
}

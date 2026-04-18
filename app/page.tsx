'use client'

import React, { useState, useMemo, useEffect } from 'react'
import { BONDS, getAllDates, getPayment, getPaymentDetail, formatDate, getYear, type BondId } from './data/bonds'

type Nominales = Record<BondId, number>
type Precios = Record<BondId, number>

const DEFAULT_NOMINALES: Nominales = {
  AO27: 0, AO28: 0, AN29: 0, AL29: 0, AL30: 0, AL35: 0, AE38: 0, AL41: 0,
}

// XIRR: TIR con fechas irregulares via Newton-Raphson
// flujos: [{ date: 'YYYY-MM-DD', amount: number }], el capital invertido va negativo en t=0
function calcXIRR(cashFlows: { date: string; amount: number }[], guess = 0.1): number | null {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const days = cashFlows.map(cf => {
    const d = new Date(cf.date)
    return (d.getTime() - today.getTime()) / 86400000
  })

  const npv = (r: number) =>
    cashFlows.reduce((sum, cf, i) => sum + cf.amount / Math.pow(1 + r, days[i] / 365), 0)

  const dnpv = (r: number) =>
    cashFlows.reduce(
      (sum, cf, i) => sum - (days[i] / 365) * cf.amount / Math.pow(1 + r, days[i] / 365 + 1),
      0
    )

  let r = guess
  for (let iter = 0; iter < 200; iter++) {
    const f = npv(r)
    const df = dnpv(r)
    if (Math.abs(df) < 1e-12) return null
    const rNew = r - f / df
    if (Math.abs(rNew - r) < 1e-8) return rNew
    r = rNew
    if (r <= -1) return null
  }
  return null
}

// Escala continua para resumen anual: ratio 0=min (oscuro) → 1=max (claro)
function getAnualStyle(ratio: number): React.CSSProperties {
  // Interpolamos entre emerald-950 (#022c22) y emerald-400 (#34d399)
  const r0 = 2,  g0 = 44,  b0 = 34   // emerald-950
  const r1 = 52, g1 = 211, b1 = 153  // emerald-400
  const t = Math.pow(ratio, 0.7)      // leve curva para que los intermedios sean más notorios
  const r = Math.round(r0 + (r1 - r0) * t)
  const g = Math.round(g0 + (g1 - g0) * t)
  const b = Math.round(b0 + (b1 - b0) * t)
  const bg = `rgb(${r},${g},${b})`
  const color = ratio > 0.55 ? '#0a0a0a' : ratio > 0.25 ? '#d1fae5' : '#6ee7b7'
  return { backgroundColor: bg, color }
}

function fmt(n: number): string {
  if (n === 0) return '—'
  return `u$${n.toLocaleString('es-AR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`
}

function fmtDecimal(n: number): string {
  if (n === 0) return '—'
  return `u$${n.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

export default function Home() {
  const [nominales, setNominales] = useState<Nominales>(DEFAULT_NOMINALES)
  const [precios, setPrecios] = useState<Precios>(
    Object.fromEntries(BONDS.map(b => [b.id, b.defaultPrice])) as Precios
  )
  // Estado string para mostrar precios con coma decimal (ej: "62,05")
  const [preciosStr, setPreciosStr] = useState<Record<BondId, string>>(
    Object.fromEntries(BONDS.map(b => [b.id, String(b.defaultPrice).replace('.', ',')])) as Record<BondId, string>
  )

  const [preciosCargando, setPreciosCargando] = useState(true)
  const [desglose, setDesglose] = useState(false)
  const [montosStr, setMontosStr] = useState<Record<BondId, string>>(
    Object.fromEntries(BONDS.map(b => [b.id, ''])) as Record<BondId, string>
  )

  useEffect(() => {
    fetch('/api/precios')
      .then(r => r.json())
      .then((data: Partial<Record<BondId, number>>) => {
        if (Object.keys(data).length === 0) return
        setPrecios(p => ({ ...p, ...data }))
        setPreciosStr(p => {
          const updated = { ...p }
          Object.entries(data).forEach(([id, price]) => {
            if (price != null)
              updated[id as BondId] = String(price).replace('.', ',')
          })
          return updated
        })
      })
      .catch(() => {})
      .finally(() => setPreciosCargando(false))
  }, [])

  function handlePrecioKeyDown(e: React.KeyboardEvent<HTMLInputElement>, bondId: BondId) {
    if (e.key !== '.') return
    e.preventDefault()
    const input = e.currentTarget
    const s = input.selectionStart ?? input.value.length
    const end = input.selectionEnd ?? input.value.length
    const cur = preciosStr[bondId] ?? ''
    const newVal = cur.slice(0, s) + ',' + cur.slice(end)
    setPreciosStr(p => ({ ...p, [bondId]: newVal }))
    const num = parseFloat(newVal.replace(',', '.'))
    if (!isNaN(num)) setPrecios(p => ({ ...p, [bondId]: num }))
    setTimeout(() => input.setSelectionRange(s + 1, s + 1), 0)
  }

  function handlePrecioChange(e: React.ChangeEvent<HTMLInputElement>, bondId: BondId) {
    const raw = e.target.value
    setPreciosStr(p => ({ ...p, [bondId]: raw }))
    const num = parseFloat(raw.replace(',', '.'))
    if (!isNaN(num) && num >= 0) setPrecios(p => ({ ...p, [bondId]: num }))
  }

  function handleMontoChange(e: React.ChangeEvent<HTMLInputElement>, bondId: BondId) {
    const raw = e.target.value.replace(',', '.')
    setMontosStr(p => ({ ...p, [bondId]: e.target.value }))
    const monto = parseFloat(raw)
    if (!isNaN(monto) && monto >= 0 && precios[bondId] > 0) {
      const nom = Math.round((monto * 100) / precios[bondId])
      setNominales(n => ({ ...n, [bondId]: nom }))
    }
  }

  function handleMontoKeyDown(e: React.KeyboardEvent<HTMLInputElement>, bondId: BondId) {
    if (e.key !== '.') return
    e.preventDefault()
    const input = e.currentTarget
    const s = input.selectionStart ?? input.value.length
    const end = input.selectionEnd ?? input.value.length
    const cur = montosStr[bondId] ?? ''
    const newVal = cur.slice(0, s) + ',' + cur.slice(end)
    setMontosStr(p => ({ ...p, [bondId]: newVal }))
    const monto = parseFloat(newVal.replace(',', '.'))
    if (!isNaN(monto) && precios[bondId] > 0) {
      setNominales(n => ({ ...n, [bondId]: Math.round((monto * 100) / precios[bondId]) }))
    }
    setTimeout(() => input.setSelectionRange(s + 1, s + 1), 0)
  }

  function handleNominalChange(e: React.ChangeEvent<HTMLInputElement>, bondId: BondId) {
    const nom = parseInt(e.target.value) || 0
    setNominales(n => ({ ...n, [bondId]: nom }))
    if (nom > 0 && precios[bondId] > 0) {
      const monto = (precios[bondId] * nom) / 100
      setMontosStr(p => ({ ...p, [bondId]: monto.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }))
    } else {
      setMontosStr(p => ({ ...p, [bondId]: '' }))
    }
  }

  const allDates = useMemo(() => getAllDates(), [])

  const totalInvertido = useMemo(() => {
    return BONDS.reduce((sum, bond) => {
      return sum + (precios[bond.id] * nominales[bond.id]) / 100
    }, 0)
  }, [nominales, precios])

  // Solo los bonos con nominales cargados
  const bonosActivos = useMemo(
    () => BONDS.filter(b => nominales[b.id] > 0),
    [nominales]
  )

  const flujo = useMemo(() => {
    return allDates
      .map(date => {
        const porBono: Record<BondId, number> = {} as Record<BondId, number>
        const porBonoInt: Record<BondId, number> = {} as Record<BondId, number>
        const porBonoAmort: Record<BondId, number> = {} as Record<BondId, number>
        let total = 0
        let totalInt = 0
        let totalAmort = 0
        BONDS.forEach(bond => {
          const detail = getPaymentDetail(bond, date, nominales[bond.id])
          porBono[bond.id] = detail.total
          porBonoInt[bond.id] = detail.interest
          porBonoAmort[bond.id] = detail.amort
          total += detail.total
          totalInt += detail.interest
          totalAmort += detail.amort
        })
        return { date, porBono, porBonoInt, porBonoAmort, total, totalInt, totalAmort }
      })
      // Excluir fechas donde ningún bono activo tiene pago
      .filter(({ date }) =>
        bonosActivos.some(b => b.coupons.some(c => c.date === date))
      )
  }, [allDates, nominales, bonosActivos])

const resumenAnual = useMemo(() => {
    const byYear: Record<number, { total: number; interest: number; amort: number }> = {}
    flujo.forEach(({ date, total, totalInt, totalAmort }) => {
      const yr = getYear(date)
      if (!byYear[yr]) byYear[yr] = { total: 0, interest: 0, amort: 0 }
      byYear[yr].total += total
      byYear[yr].interest += totalInt
      byYear[yr].amort += totalAmort
    })
    return Object.entries(byYear)
      .map(([year, v]) => ({ year: parseInt(year), ...v }))
      .sort((a, b) => a.year - b.year)
  }, [flujo])

  const totalCobros = useMemo(() => resumenAnual.reduce((s, r) => s + r.total, 0), [resumenAnual])

  const tir = useMemo(() => {
    if (totalInvertido === 0) return null
    const cashFlows = [
      { date: new Date().toISOString().split('T')[0], amount: -totalInvertido },
      ...flujo.filter(f => f.total > 0).map(f => ({ date: f.date, amount: f.total })),
    ]
    return calcXIRR(cashFlows)
  }, [flujo, totalInvertido])

  const duracionModificada = useMemo(() => {
    if (totalInvertido === 0 || tir === null) return null
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const r = tir
    let sumPV = 0
    let sumTPV = 0
    flujo.filter(f => f.total > 0).forEach(f => {
      const t = (new Date(f.date).getTime() - today.getTime()) / 86400000 / 365
      const pv = f.total / Math.pow(1 + r, t)
      sumPV += pv
      sumTPV += t * pv
    })
    if (sumPV === 0) return null
    const macaulay = sumTPV / sumPV
    return macaulay / (1 + r)
  }, [flujo, tir, totalInvertido])

  // Índice de la primera fila donde el acumulado alcanza o supera el total invertido
  const breakEvenIndex = useMemo(() => {
    if (totalInvertido === 0) return -1
    let acum = 0
    for (let i = 0; i < flujo.length; i++) {
      acum += flujo[i].total
      if (acum >= totalInvertido) return i
    }
    return -1
  }, [flujo, totalInvertido])

  const breakEvenYear = breakEvenIndex >= 0 ? getYear(flujo[breakEvenIndex].date) : null

  const hayCartera = BONDS.some(b => nominales[b.id] > 0)

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans">
      <header className="border-b border-zinc-800 px-6 py-5 text-center">
        <h1 className="text-xl font-semibold tracking-wide text-white">Bonos Soberanos de Argentina</h1>
        <p className="text-sm text-zinc-400 mt-0.5">Flujo de fondos y vencimientos</p>
      </header>

      <main className="px-4 py-6 max-w-7xl mx-auto space-y-8">

        {/* Inputs */}
        <section className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr>
                  <th className="text-left pr-4 pb-2 text-zinc-500 font-medium whitespace-nowrap w-20"></th>
                  {BONDS.map(bond => (
                    <th key={bond.id} className="pb-2 text-center px-2 whitespace-nowrap">
                      <span className="text-emerald-400 font-bold">{bond.name}</span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="space-y-1">
                <tr>
                  <td className="pr-4 py-1 text-zinc-500 whitespace-nowrap">
                    Precio (u$)
                    {preciosCargando && (
                      <span className="ml-2 text-zinc-600 text-xs animate-pulse">actualizando…</span>
                    )}
                  </td>
                  {BONDS.map(bond => (
                    <td key={bond.id} className="px-2 py-1">
                      <input
                        type="text"
                        inputMode="decimal"
                        value={preciosStr[bond.id]}
                        onKeyDown={e => handlePrecioKeyDown(e, bond.id)}
                        onChange={e => handlePrecioChange(e, bond.id)}
                        className={`w-full min-w-[72px] bg-zinc-800 border rounded px-2 py-1 text-xs text-white text-right focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors ${
                          preciosCargando ? 'border-zinc-600 text-zinc-500' : 'border-zinc-700'
                        }`}
                      />
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="pr-4 py-1 text-zinc-500 whitespace-nowrap">Monto (u$)</td>
                  {BONDS.map(bond => (
                    <td key={bond.id} className="px-2 py-1">
                      <input
                        type="text"
                        inputMode="decimal"
                        value={montosStr[bond.id]}
                        placeholder="0,00"
                        onKeyDown={e => handleMontoKeyDown(e, bond.id)}
                        onChange={e => handleMontoChange(e, bond.id)}
                        className="w-full min-w-[72px] bg-zinc-800 border border-zinc-700 rounded px-2 py-1 text-xs text-white text-right focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                      />
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="pr-4 py-1 text-zinc-500 whitespace-nowrap">Nominales</td>
                  {BONDS.map(bond => (
                    <td key={bond.id} className="px-2 py-1">
                      <input
                        type="number"
                        step="1"
                        min="0"
                        value={nominales[bond.id] || ''}
                        placeholder="0"
                        onChange={e => handleNominalChange(e, bond.id)}
                        className="w-full min-w-[72px] bg-zinc-800 border border-zinc-700 rounded px-2 py-1 text-xs text-white text-right focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                      />
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>

          <div className="mt-6 pt-5 border-t border-zinc-800 flex flex-wrap gap-8">
            <div>
              <p className="text-xs text-zinc-500">Total invertido</p>
              <p className="text-2xl font-bold text-white mt-0.5">
                {totalInvertido > 0 ? fmtDecimal(totalInvertido) : '—'}
              </p>
            </div>
            <div>
              <p className="text-xs text-zinc-500">Total a cobrar</p>
              <p className="text-2xl font-bold text-emerald-400 mt-0.5">
                {totalCobros > 0 ? fmt(totalCobros) : '—'}
              </p>
            </div>
            {totalInvertido > 0 && totalCobros > 0 && (
              <div>
                <p className="text-xs text-zinc-500">Retorno total</p>
                <p className="text-2xl font-bold text-emerald-600 mt-0.5">
                  {((totalCobros / totalInvertido - 1) * 100).toFixed(1)}%
                </p>
              </div>
            )}
            {tir !== null && (
              <div>
                <p className="text-xs text-zinc-500">TIR anual</p>
                <p className="text-2xl font-bold text-emerald-300 mt-0.5">
                  {(tir * 100).toFixed(2)}%
                </p>
              </div>
            )}
          </div>
        </section>

        {!hayCartera && (
          <div className="text-center py-16 text-zinc-600">
            <p className="text-lg">Ingresá tus nominales para ver el flujo de fondos</p>
          </div>
        )}

        {hayCartera && (
          <>
            {/* Gráfico de barras anual */}
            <section className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-sm font-semibold text-zinc-400 uppercase tracking-widest">
                  Flujo anual
                </h2>
                <div className="flex items-center gap-4 text-xs text-zinc-400">
                  <span className="flex items-center gap-1.5">
                    <span className="inline-block w-3 h-3 rounded-sm bg-[#6ee7b7]" />
                    <span className="text-emerald-300">Amortización</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="inline-block w-3 h-3 rounded-sm bg-[#065f46]" />
                    <span className="text-emerald-600">Intereses</span>
                  </span>
                </div>
              </div>
              {(() => {
                const padL = 56, padR = 16, padT = 28, padB = 32
                const W = 800, H = 230
                const plotW = W - padL - padR
                const plotH = H - padT - padB
                const maxVal = Math.max(...resumenAnual.map(r => r.total))
                const n = resumenAnual.length
                const slotW = plotW / n
                const barW = Math.max(10, slotW * 0.55)
                const ticks = [0, 0.25, 0.5, 0.75, 1]
                const fmtAxis = (v: number) =>
                  v >= 1000 ? `u$${(v / 1000).toFixed(v % 1000 === 0 ? 0 : 1)}k` : `u$${Math.round(v)}`

                return (
                  <svg viewBox={`0 0 ${W} ${H}`} width="100%" className="overflow-visible">
                    {/* Grid lines + Y labels */}
                    {ticks.map(t => {
                      const y = padT + plotH * (1 - t)
                      return (
                        <g key={t}>
                          <line x1={padL} y1={y} x2={W - padR} y2={y} stroke="#27272a" strokeWidth="1" />
                          <text x={padL - 6} y={y + 4} textAnchor="end" fontSize="11" fill="#52525b">
                            {fmtAxis(maxVal * t)}
                          </text>
                        </g>
                      )
                    })}

                    {/* Bars apiladas: amort (abajo, verde claro) + interés (arriba, verde oscuro) */}
                    {resumenAnual.map(({ year, total, interest, amort }, i) => {
                      const isBreakEven = year === breakEvenYear
                      const x = padL + slotW * i + slotW / 2 - barW / 2
                      const baseY = padT + plotH
                      const amortH = maxVal > 0 ? (amort / maxVal) * plotH : 0
                      const intH = maxVal > 0 ? (interest / maxVal) * plotH : 0
                      const totalH = amortH + intH
                      const amortFill = '#6ee7b7'
                      const intFill = '#065f46'
                      return (
                        <g key={year}>
                          {/* Segmento amortización (abajo) */}
                          {amortH > 0 && (
                            <rect x={x} y={baseY - amortH} width={barW} height={amortH}
                              fill={amortFill} rx="0"
                            />
                          )}
                          {/* Segmento intereses (arriba) */}
                          {intH > 0 && (
                            <rect x={x} y={baseY - amortH - intH} width={barW} height={intH}
                              fill={intFill} rx="0"
                            />
                          )}
                          {/* Bordes redondeados solo arriba */}
                          {totalH > 0 && (
                            <rect x={x} y={baseY - totalH} width={barW} height={4}
                              fill={intH > 0 ? intFill : amortFill} rx="2"
                            />
                          )}
                          {/* Año */}
                          <text x={x + barW / 2} y={H - padB + 16} textAnchor="middle" fontSize="11"
                            fill={isBreakEven ? '#fbbf24' : '#71717a'}
                            fontWeight={isBreakEven ? 'bold' : 'normal'}
                          >
                            {isBreakEven ? `★ ${year}` : year}
                          </text>
                          {/* Valor total encima */}
                          {total > 0 && (
                            <text x={x + barW / 2} y={baseY - totalH - 5} textAnchor="middle" fontSize="10" fill="#a1a1aa">
                              {fmtAxis(total)}
                            </text>
                          )}
                        </g>
                      )
                    })}

                    {/* Ejes */}
                    <line x1={padL} y1={padT} x2={padL} y2={padT + plotH} stroke="#3f3f46" strokeWidth="1" />
                    <line x1={padL} y1={padT + plotH} x2={W - padR} y2={padT + plotH} stroke="#3f3f46" strokeWidth="1" />
                  </svg>
                )
              })()}
            </section>

            {/* Treemap composición de cartera */}
            {bonosActivos.length > 0 && (() => {
              const W = 800, H = 200
              const GAP = 2

              // Datos ordenados de mayor a menor
              const items = bonosActivos
                .map(b => ({
                  id: b.id,
                  name: b.name,
                  value: (precios[b.id] * nominales[b.id]) / 100,
                }))
                .filter(d => d.value > 0)
                .sort((a, b) => b.value - a.value)

              const total = items.reduce((s, d) => s + d.value, 0)
              if (total === 0) return null

              // Colores por ranking: mayor = verde claro, menor = verde oscuro
              const palette = [
                '#6ee7b7', '#34d399', '#10b981', '#059669',
                '#047857', '#065f46', '#064e3b', '#022c22',
              ]

              // Algoritmo treemap por partición binaria recursiva
              type Rect = { id: string; name: string; value: number; x: number; y: number; w: number; h: number }
              function split(nodes: typeof items, x: number, y: number, w: number, h: number): Rect[] {
                if (nodes.length === 0) return []
                if (nodes.length === 1) return [{ ...nodes[0], x, y, w, h }]
                const sum = nodes.reduce((s, n) => s + n.value, 0)
                let acc = 0, splitAt = 0
                for (let i = 0; i < nodes.length - 1; i++) {
                  acc += nodes[i].value
                  splitAt = i
                  if (acc >= sum / 2) break
                }
                const ratio = acc / sum
                const a = nodes.slice(0, splitAt + 1)
                const b = nodes.slice(splitAt + 1)
                if (w >= h) {
                  const wA = w * ratio
                  return [...split(a, x, y, wA, h), ...split(b, x + wA, y, w - wA, h)]
                } else {
                  const hA = h * ratio
                  return [...split(a, x, y, w, hA), ...split(b, x, y + hA, w, h - hA)]
                }
              }

              const rects = split(items, 0, 0, W, H)

              return (
                <section className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
                  <h2 className="text-sm font-semibold text-zinc-400 uppercase tracking-widest mb-5">
                    Composición de cartera
                  </h2>
                  <svg viewBox={`0 0 ${W} ${H}`} width="100%" className="rounded-lg overflow-hidden">
                    {rects.map((r, i) => {
                      const pct = ((r.value / total) * 100).toFixed(1)
                      const color = palette[Math.min(i, palette.length - 1)]
                      const textColor = i < 3 ? '#022c22' : '#d1fae5'
                      const gx = r.x + GAP / 2
                      const gy = r.y + GAP / 2
                      const gw = r.w - GAP
                      const gh = r.h - GAP
                      const cx = gx + gw / 2
                      const cy = gy + gh / 2
                      const showDetail = gw > 60 && gh > 30
                      const showName = gw > 30 && gh > 16
                      return (
                        <g key={r.id}>
                          <rect x={gx} y={gy} width={gw} height={gh} fill={color} rx="4"/>
                          {showName && (
                            <text x={cx} y={showDetail ? cy - 6 : cy + 4} textAnchor="middle"
                              fontSize={gw < 60 ? '10' : '13'} fontWeight="bold" fill={textColor}>
                              {r.name}
                            </text>
                          )}
                          {showDetail && (
                            <text x={cx} y={cy + 10} textAnchor="middle" fontSize="11" fill={textColor} opacity="0.8">
                              {pct}% · u${Math.round(r.value).toLocaleString('es-AR')}
                            </text>
                          )}
                        </g>
                      )
                    })}
                  </svg>
                </section>
              )
            })()}


            {/* Tabla de flujo */}
            <section className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
              <div className="px-6 py-4 border-b border-zinc-800 flex items-center justify-between gap-4">
                <h2 className="text-sm font-semibold text-zinc-400 uppercase tracking-widest">
                  Flujo de fondos
                </h2>
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={desglose}
                    onChange={e => setDesglose(e.target.checked)}
                    className="w-4 h-4 accent-emerald-500 cursor-pointer"
                  />
                  <span className="text-xs text-zinc-400">
                    Desglose{' '}
                    <span className="text-emerald-300">Amortización</span>
                    {' / '}
                    <span className="text-emerald-600">Intereses</span>
                  </span>
                </label>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-zinc-800">
                      <th className="text-left px-3 py-3 text-zinc-500 font-medium w-24">Fecha</th>
                      {bonosActivos.map(bond => (
                        <th key={bond.id} className="text-right px-2 py-3 text-zinc-500 font-medium">
                          {bond.name}
                        </th>
                      ))}
                      <th className="text-right px-2 py-3 text-zinc-400 font-semibold">Total</th>
                      <th className="text-right px-3 py-3 text-zinc-500 font-medium">Acumulado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {flujo.reduce<{ acum: number; rows: React.ReactNode[] }>(
                      ({ acum, rows }, { date, porBono, porBonoInt, porBonoAmort, total, totalInt, totalAmort }, i) => {
                        const newAcum = acum + total
                        const isBreakEven = i === breakEvenIndex
                        rows.push(
                          <tr
                            key={date}
                            className={`border-b transition-colors ${
                              isBreakEven
                                ? 'border-amber-400/60 bg-amber-400/10'
                                : `border-zinc-800/50 ${i % 2 === 0 ? 'bg-zinc-900' : 'bg-zinc-950/40'}`
                            }`}
                          >
                            <td className={`px-3 py-1.5 font-mono text-xs whitespace-nowrap ${isBreakEven ? 'text-amber-300 font-semibold' : 'text-zinc-400'}`}>
                              {isBreakEven && <span className="mr-1.5">★</span>}
                              {formatDate(date)}
                            </td>
                            {bonosActivos.map(bond => {
                              const int = porBonoInt[bond.id]
                              const amort = porBonoAmort[bond.id]
                              const tot = porBono[bond.id]
                              return (
                                <td key={bond.id} className="px-2 py-1.5 text-right tabular-nums whitespace-nowrap">
                                  {tot > 0 ? (
                                    desglose ? (
                                      <div className="leading-tight">
                                        <div className="text-xs text-zinc-300">{fmtDecimal(tot)}</div>
                                        <div className="text-[10px] text-emerald-300">{amort > 0 ? fmtDecimal(amort) : '—'}</div>
                                        <div className="text-[10px] text-emerald-600">{int > 0 ? fmtDecimal(int) : '—'}</div>
                                      </div>
                                    ) : (
                                      <span className="text-sm text-zinc-400">{fmtDecimal(tot)}</span>
                                    )
                                  ) : <span className="text-zinc-700">—</span>}
                                </td>
                              )
                            })}
                            <td className="px-2 py-1.5 text-right tabular-nums whitespace-nowrap">
                              {total > 0 ? (
                                desglose ? (
                                  <div className="leading-tight">
                                    <div className="text-xs text-emerald-400 font-medium">{fmtDecimal(total)}</div>
                                    <div className="text-[10px] text-emerald-300">{totalAmort > 0 ? fmtDecimal(totalAmort) : '—'}</div>
                                    <div className="text-[10px] text-emerald-600">{totalInt > 0 ? fmtDecimal(totalInt) : '—'}</div>
                                  </div>
                                ) : <span className="text-emerald-400">{fmtDecimal(total)}</span>
                              ) : <span className="text-zinc-700">—</span>}
                            </td>
                            <td className={`px-3 py-1.5 text-right tabular-nums ${isBreakEven ? 'text-amber-300 font-bold' : 'text-zinc-500'}`}>
                              {newAcum > 0 ? fmtDecimal(newAcum) : <span className="text-zinc-700">—</span>}
                            </td>
                          </tr>
                        )
                        return { acum: newAcum, rows }
                      },
                      { acum: 0, rows: [] }
                    ).rows}
                  </tbody>
                </table>
              </div>
            </section>
          </>
        )}
      </main>

      <footer className="border-t border-zinc-800 px-6 py-4 text-center text-xs text-zinc-600">
        © {new Date().getFullYear()} Bonos Soberanos de Argentina — Creado por{' '}
        <a href="https://x.com/hernanmdq" target="_blank" rel="noopener noreferrer"
          className="text-zinc-400 hover:text-emerald-400 transition-colors">
          @HernanMDQ
        </a>
      </footer>
    </div>
  )
}

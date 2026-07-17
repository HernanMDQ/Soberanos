import { NextResponse } from 'next/server'
import type { BondId } from '@/app/data/bonds'

// Tickers en bonistas.com
const BONISTAS_TICKERS: Record<BondId, string[]> = {
  AO27: ['AO27D', 'AO27'],
  AO28: ['AO28D', 'AO28'],
  AN29: ['AN29D', 'AN29'],
  AL29: ['AL29D', 'AL29'],
  AL30: ['AL30D', 'AL30'],
  AL35: ['AL35D', 'AL35'],
  AE38: ['AE38D', 'AE38'],
  AL41: ['AL41D', 'AL41'],
}

const YAHOO_TICKERS: Partial<Record<BondId, string>> = {
  AO28: 'AO28D.BA',
}

async function fetchYahoo(ticker: string): Promise<number | null> {
  try {
    const res = await fetch(
      `https://query1.finance.yahoo.com/v8/finance/chart/${ticker}`,
      { headers: { 'User-Agent': 'Mozilla/5.0' }, next: { revalidate: 300 }, signal: AbortSignal.timeout(6000) }
    )
    const data = await res.json()
    const price = data?.chart?.result?.[0]?.meta?.regularMarketPrice
    return typeof price === 'number' ? price : null
  } catch { return null }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function toUsd(instrument: any): number | null {
  const price: number = instrument?.last_price
  const mep: number = instrument?.mep
  if (!price || price <= 0) return null
  // Si el precio es grande (pesos), convertir con el MEP
  if (price >= 500 && mep > 0) return Math.round((price / mep) * 100) / 100
  // Ya está en USD
  return Math.round(price * 100) / 100
}

export async function GET() {
  try {
    const res = await fetch('https://bonistas.com/api/bonds', {
      headers: { 'User-Agent': 'Mozilla/5.0', Accept: 'application/json' },
      next: { revalidate: 300 },
      signal: AbortSignal.timeout(8000),
    })

    if (!res.ok) throw new Error(`bonistas.com respondió ${res.status}`)

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const bondData: any[] = await res.json()

    // Indexar por ticker para búsqueda rápida
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const byTicker: Record<string, any> = {}
    bondData.forEach(b => { if (b?.ticker) byTicker[b.ticker] = b })

    const prices: Partial<Record<BondId, number>> = {}

    for (const [bondId, candidates] of Object.entries(BONISTAS_TICKERS)) {
      for (const ticker of candidates) {
        const instrument = byTicker[ticker]
        if (!instrument) continue
        const price = toUsd(instrument)
        if (price !== null) { prices[bondId as BondId] = price; break }
      }
    }

    // Bonos no disponibles en bonistas → Yahoo Finance
    await Promise.all(
      Object.entries(YAHOO_TICKERS).map(async ([bondId, ticker]) => {
        if (prices[bondId as BondId] != null) return
        const price = await fetchYahoo(ticker)
        if (price !== null) prices[bondId as BondId] = price
      })
    )

    return NextResponse.json(prices)
  } catch (err) {
    console.error('[/api/precios]', err)
    return NextResponse.json({})
  }
}

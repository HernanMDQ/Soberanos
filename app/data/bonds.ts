export type BondId = 'AO27' | 'AO28' | 'AN29' | 'AL29' | 'AL30' | 'AL35' | 'AE38' | 'AL41'

export interface CouponPayment {
  date: string
  rate: number     // total % del nominal (interés + amortización)
  interest?: number // % de interés
  amort?: number    // % de amortización
}

export interface Bond {
  id: BondId
  name: string
  defaultPrice: number
  coupons: CouponPayment[]
}

export const BONDS: Bond[] = [
  {
    id: 'AO27',
    name: 'AO27D',
    defaultPrice: 100.00,
    coupons: [
      { date: '2026-04-30', rate: 0.500, interest: 0.500, amort: 0 },
      { date: '2026-05-29', rate: 0.500, interest: 0.500, amort: 0 },
      { date: '2026-06-30', rate: 0.500, interest: 0.500, amort: 0 },
      { date: '2026-07-31', rate: 0.500, interest: 0.500, amort: 0 },
      { date: '2026-08-31', rate: 0.500, interest: 0.500, amort: 0 },
      { date: '2026-09-30', rate: 0.500, interest: 0.500, amort: 0 },
      { date: '2026-10-30', rate: 0.500, interest: 0.500, amort: 0 },
      { date: '2026-11-30', rate: 0.500, interest: 0.500, amort: 0 },
      { date: '2026-12-30', rate: 0.500, interest: 0.500, amort: 0 },
      { date: '2027-01-29', rate: 0.500, interest: 0.500, amort: 0 },
      { date: '2027-02-26', rate: 0.467, interest: 0.467, amort: 0 },
      { date: '2027-03-31', rate: 0.550, interest: 0.550, amort: 0 },
      { date: '2027-04-30', rate: 0.500, interest: 0.500, amort: 0 },
      { date: '2027-05-31', rate: 0.500, interest: 0.500, amort: 0 },
      { date: '2027-06-30', rate: 0.500, interest: 0.500, amort: 0 },
      { date: '2027-07-30', rate: 0.500, interest: 0.500, amort: 0 },
      { date: '2027-08-31', rate: 0.500, interest: 0.500, amort: 0 },
      { date: '2027-09-30', rate: 0.500, interest: 0.500, amort: 0 },
      { date: '2027-10-29', rate: 100.483, interest: 0.483, amort: 100 },
    ],
  },
  {
    id: 'AO28',
    name: 'AO28D',
    defaultPrice: 100.00,
    coupons: [
      { date: '2026-04-30', rate: 0.50, interest: 0.50, amort: 0 },
      { date: '2026-05-29', rate: 0.48, interest: 0.48, amort: 0 },
      { date: '2026-06-30', rate: 0.52, interest: 0.52, amort: 0 },
      { date: '2026-07-31', rate: 0.50, interest: 0.50, amort: 0 },
      { date: '2026-08-31', rate: 0.50, interest: 0.50, amort: 0 },
      { date: '2026-09-30', rate: 0.50, interest: 0.50, amort: 0 },
      { date: '2026-10-30', rate: 0.50, interest: 0.50, amort: 0 },
      { date: '2026-11-30', rate: 0.50, interest: 0.50, amort: 0 },
      { date: '2026-12-30', rate: 0.50, interest: 0.50, amort: 0 },
      { date: '2027-01-29', rate: 0.48, interest: 0.48, amort: 0 },
      { date: '2027-02-26', rate: 0.45, interest: 0.45, amort: 0 },
      { date: '2027-03-31', rate: 0.58, interest: 0.58, amort: 0 },
      { date: '2027-04-30', rate: 0.50, interest: 0.50, amort: 0 },
      { date: '2027-05-31', rate: 0.50, interest: 0.50, amort: 0 },
      { date: '2027-06-30', rate: 0.50, interest: 0.50, amort: 0 },
      { date: '2027-07-30', rate: 0.50, interest: 0.50, amort: 0 },
      { date: '2027-08-31', rate: 0.50, interest: 0.50, amort: 0 },
      { date: '2027-09-30', rate: 0.50, interest: 0.50, amort: 0 },
      { date: '2027-10-29', rate: 0.48, interest: 0.48, amort: 0 },
      { date: '2027-11-30', rate: 0.52, interest: 0.52, amort: 0 },
      { date: '2027-12-30', rate: 0.50, interest: 0.50, amort: 0 },
      { date: '2028-01-31', rate: 0.50, interest: 0.50, amort: 0 },
      { date: '2028-02-29', rate: 0.48, interest: 0.48, amort: 0 },
      { date: '2028-03-31', rate: 0.50, interest: 0.50, amort: 0 },
      { date: '2028-04-28', rate: 0.47, interest: 0.47, amort: 0 },
      { date: '2028-05-31', rate: 0.55, interest: 0.55, amort: 0 },
      { date: '2028-06-30', rate: 0.50, interest: 0.50, amort: 0 },
      { date: '2028-07-31', rate: 0.50, interest: 0.50, amort: 0 },
      { date: '2028-08-31', rate: 0.50, interest: 0.50, amort: 0 },
      { date: '2028-09-29', rate: 0.48, interest: 0.48, amort: 0 },
      { date: '2028-10-31', rate: 100.53, interest: 0.53, amort: 100 },
    ],
  },
  {
    id: 'AN29',
    name: 'AN29D',
    defaultPrice: 100.00,
    coupons: [
      { date: '2026-06-01', rate: 3.033, interest: 3.033, amort: 0 },
      { date: '2026-11-30', rate: 3.250, interest: 3.250, amort: 0 },
      { date: '2027-05-31', rate: 3.250, interest: 3.250, amort: 0 },
      { date: '2027-11-30', rate: 3.250, interest: 3.250, amort: 0 },
      { date: '2028-05-30', rate: 3.250, interest: 3.250, amort: 0 },
      { date: '2028-11-30', rate: 3.250, interest: 3.250, amort: 0 },
      { date: '2029-05-30', rate: 3.250, interest: 3.250, amort: 0 },
      { date: '2029-11-30', rate: 103.250, interest: 3.250, amort: 100 },
    ],
  },
  {
    id: 'AL29',
    name: 'AL29D',
    defaultPrice: 62.05,
    coupons: [
      { date: '2026-07-13', rate: 10.35, interest: 0.35, amort: 10 },
      { date: '2027-01-11', rate: 10.30, interest: 0.30, amort: 10 },
      { date: '2027-07-12', rate: 10.25, interest: 0.25, amort: 10 },
      { date: '2028-01-10', rate: 10.20, interest: 0.20, amort: 10 },
      { date: '2028-07-10', rate: 10.15, interest: 0.15, amort: 10 },
      { date: '2029-01-09', rate: 10.10, interest: 0.10, amort: 10 },
      { date: '2029-07-10', rate: 10.05, interest: 0.05, amort: 10 },
    ],
  },
  {
    id: 'AL30',
    name: 'AL30D',
    defaultPrice: 61.40,
    coupons: [
      { date: '2026-07-13', rate: 8.27, interest: 0.27, amort: 8 },
      { date: '2027-01-11', rate: 8.24, interest: 0.24, amort: 8 },
      { date: '2027-07-12', rate: 8.21, interest: 0.21, amort: 8 },
      { date: '2028-01-10', rate: 8.42, interest: 0.42, amort: 8 },
      { date: '2028-07-10', rate: 8.35, interest: 0.35, amort: 8 },
      { date: '2029-01-09', rate: 8.28, interest: 0.28, amort: 8 },
      { date: '2029-07-10', rate: 8.21, interest: 0.21, amort: 8 },
      { date: '2030-01-09', rate: 8.14, interest: 0.14, amort: 8 },
      { date: '2030-07-10', rate: 8.07, interest: 0.07, amort: 8 },
    ],
  },
  {
    id: 'AL35',
    name: 'AL35D',
    defaultPrice: 75.20,
    coupons: [
      { date: '2026-07-13', rate: 2.07,  interest: 2.07, amort: 0  },
      { date: '2027-01-11', rate: 2.05,  interest: 2.05, amort: 0  },
      { date: '2027-07-12', rate: 2.10,  interest: 2.10, amort: 0  },
      { date: '2028-01-10', rate: 2.35,  interest: 2.35, amort: 0  },
      { date: '2028-07-10', rate: 2.38,  interest: 2.38, amort: 0  },
      { date: '2029-01-09', rate: 2.49,  interest: 2.49, amort: 0  },
      { date: '2029-07-10', rate: 2.51,  interest: 2.51, amort: 0  },
      { date: '2030-01-09', rate: 2.49,  interest: 2.49, amort: 0  },
      { date: '2030-07-10', rate: 2.51,  interest: 2.51, amort: 0  },
      { date: '2031-01-09', rate: 12.49, interest: 2.49, amort: 10 },
      { date: '2031-07-10', rate: 12.26, interest: 2.26, amort: 10 },
      { date: '2032-01-09', rate: 11.99, interest: 1.99, amort: 10 },
      { date: '2032-07-12', rate: 11.78, interest: 1.78, amort: 10 },
      { date: '2033-01-10', rate: 11.48, interest: 1.48, amort: 10 },
      { date: '2033-07-11', rate: 11.26, interest: 1.26, amort: 10 },
      { date: '2034-01-09', rate: 10.99, interest: 0.99, amort: 10 },
      { date: '2034-07-10', rate: 10.75, interest: 0.75, amort: 10 },
      { date: '2035-01-09', rate: 10.50, interest: 0.50, amort: 10 },
      { date: '2035-07-10', rate: 10.25, interest: 0.25, amort: 10 },
    ],
  },
  {
    id: 'AE38',
    name: 'AE38D',
    defaultPrice: 77.80,
    coupons: [
      { date: '2026-07-13', rate: 2.51, interest: 2.51, amort: 0    },
      { date: '2027-01-11', rate: 2.51, interest: 2.51, amort: 0    },
      { date: '2027-07-12', rate: 7.05, interest: 2.51, amort: 4.54 },
      { date: '2028-01-10', rate: 6.90, interest: 2.36, amort: 4.54 },
      { date: '2028-07-10', rate: 6.81, interest: 2.27, amort: 4.54 },
      { date: '2029-01-09', rate: 6.69, interest: 2.15, amort: 4.54 },
      { date: '2029-07-10', rate: 6.60, interest: 2.06, amort: 4.54 },
      { date: '2030-01-09', rate: 6.46, interest: 1.92, amort: 4.54 },
      { date: '2030-07-10', rate: 6.37, interest: 1.83, amort: 4.54 },
      { date: '2031-01-09', rate: 6.24, interest: 1.70, amort: 4.54 },
      { date: '2031-07-10', rate: 6.14, interest: 1.60, amort: 4.54 },
      { date: '2032-01-09', rate: 6.01, interest: 1.47, amort: 4.54 },
      { date: '2032-07-12', rate: 5.93, interest: 1.39, amort: 4.54 },
      { date: '2033-01-10', rate: 5.78, interest: 1.24, amort: 4.54 },
      { date: '2033-07-11', rate: 5.68, interest: 1.14, amort: 4.54 },
      { date: '2034-01-09', rate: 5.55, interest: 1.01, amort: 4.54 },
      { date: '2034-07-10', rate: 5.46, interest: 0.92, amort: 4.54 },
      { date: '2035-01-09', rate: 5.33, interest: 0.79, amort: 4.54 },
      { date: '2035-07-10', rate: 5.23, interest: 0.69, amort: 4.54 },
      { date: '2036-01-09', rate: 5.11, interest: 0.57, amort: 4.54 },
      { date: '2036-07-10', rate: 5.00, interest: 0.46, amort: 4.54 },
      { date: '2037-01-09', rate: 4.88, interest: 0.34, amort: 4.54 },
      { date: '2037-07-10', rate: 4.77, interest: 0.23, amort: 4.54 },
      { date: '2038-01-11', rate: 4.78, interest: 0.12, amort: 4.66 },
    ],
  },
  {
    id: 'AL41',
    name: 'AL41D',
    defaultPrice: 69.79,
    coupons: [
      { date: '2026-07-13', rate: 1.750, interest: 1.750, amort: 0     },
      { date: '2027-01-11', rate: 1.750, interest: 1.750, amort: 0     },
      { date: '2027-07-12', rate: 1.750, interest: 1.750, amort: 0     },
      { date: '2028-01-10', rate: 5.321, interest: 1.750, amort: 3.571 },
      { date: '2028-07-10', rate: 5.259, interest: 1.688, amort: 3.571 },
      { date: '2029-01-09', rate: 5.196, interest: 1.625, amort: 3.571 },
      { date: '2029-07-10', rate: 5.134, interest: 1.563, amort: 3.571 },
      { date: '2030-01-09', rate: 5.661, interest: 2.089, amort: 3.571 },
      { date: '2030-07-10', rate: 5.574, interest: 2.002, amort: 3.571 },
      { date: '2031-01-09', rate: 5.487, interest: 1.915, amort: 3.571 },
      { date: '2031-07-10', rate: 5.400, interest: 1.828, amort: 3.571 },
      { date: '2032-01-09', rate: 5.313, interest: 1.741, amort: 3.571 },
      { date: '2032-07-12', rate: 5.225, interest: 1.654, amort: 3.571 },
      { date: '2033-01-10', rate: 5.138, interest: 1.567, amort: 3.571 },
      { date: '2033-07-11', rate: 5.051, interest: 1.480, amort: 3.571 },
      { date: '2034-01-09', rate: 4.964, interest: 1.393, amort: 3.571 },
      { date: '2034-07-10', rate: 4.877, interest: 1.306, amort: 3.571 },
      { date: '2035-01-09', rate: 4.790, interest: 1.219, amort: 3.571 },
      { date: '2035-07-10', rate: 4.703, interest: 1.132, amort: 3.571 },
      { date: '2036-01-09', rate: 4.616, interest: 1.045, amort: 3.571 },
      { date: '2036-07-10', rate: 4.529, interest: 0.958, amort: 3.571 },
      { date: '2037-01-09', rate: 4.442, interest: 0.871, amort: 3.571 },
      { date: '2037-07-10', rate: 4.355, interest: 0.783, amort: 3.571 },
      { date: '2038-01-11', rate: 4.268, interest: 0.696, amort: 3.571 },
      { date: '2038-07-12', rate: 4.181, interest: 0.609, amort: 3.571 },
      { date: '2039-01-10', rate: 4.094, interest: 0.522, amort: 3.571 },
      { date: '2039-07-11', rate: 4.007, interest: 0.435, amort: 3.571 },
      { date: '2040-01-09', rate: 3.920, interest: 0.348, amort: 3.571 },
      { date: '2040-07-10', rate: 3.833, interest: 0.261, amort: 3.571 },
      { date: '2041-01-09', rate: 3.746, interest: 0.174, amort: 3.571 },
      { date: '2041-07-10', rate: 3.658, interest: 0.087, amort: 3.571 },
    ],
  },
]

export function getAllDates(): string[] {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const dates = new Set<string>()
  BONDS.forEach(bond =>
    bond.coupons.forEach(c => {
      if (new Date(c.date) >= today) dates.add(c.date)
    })
  )
  return Array.from(dates).sort()
}

export function getPayment(bond: Bond, date: string, nominal: number): number {
  const coupon = bond.coupons.find(c => c.date === date)
  if (!coupon || nominal === 0) return 0
  return (nominal * coupon.rate) / 100
}

export function getPaymentDetail(bond: Bond, date: string, nominal: number) {
  const coupon = bond.coupons.find(c => c.date === date)
  if (!coupon || nominal === 0) return { total: 0, interest: null, amort: null }
  return {
    total: (nominal * coupon.rate) / 100,
    interest: coupon.interest != null ? (nominal * coupon.interest) / 100 : null,
    amort:    coupon.amort    != null ? (nominal * coupon.amort)    / 100 : null,
  }
}

export function formatDate(dateStr: string): string {
  const [year, month, day] = dateStr.split('-')
  const months = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic']
  return `${parseInt(day)}-${months[parseInt(month) - 1]}-${year}`
}

export function getYear(dateStr: string): number {
  return parseInt(dateStr.split('-')[0])
}

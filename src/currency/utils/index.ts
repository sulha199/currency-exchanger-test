import { IFixerResponse } from 'fixer-api/dist/Fixer'
import { ApiState } from 'src/shared/models/api'
import { MONTH_NAMES } from '../consts'

export type CurrencyRateParam = {
  from: string
  to: string
}
export type YearAndMonth = {
  year: number
  /** Month value in number from 1 to 12 */
  month: number
}

/** Date in YYYY-MM-DD string format */
type DateString = string

type CurrencyRate = number
export type HistoryRatesData = Record<DateString, CurrencyRate>

export type HistoryData = Record<DateString, IFixerResponse>

export const getEndOfMonth = ({ year, month }: YearAndMonth) => {
  const yearAndMonth = `${year}-${month.toString().padStart(2, '0')}-`
  return `${yearAndMonth}${
    month === 2
      ? year & 3 || (!(year % 25) && year & 15)
        ? 28
        : 29
      : 30 + ((month + (month >> 3)) & 1)
  }`
}

export function getCurrencyRate(
  { from, to }: CurrencyRateParam,
  { rates, base }: IFixerResponse
) {
  if (rates[to] == null) {
    throw new Error(`Could not find the 'To' for conversion from ${from} to ${to}`)
  }
  if (from === base) {
    return rates[to]
  }
  if (rates[from] == null) {
    throw new Error(`Could not find the 'From' for conversion from ${from} to ${to}`)
  }
  return rates[to] / rates[from]
}

/** Get the currency list from existing rateRecord */
export const getCurrencyList = (rateRecord?: IFixerResponse | undefined) => {
  if (rateRecord && Object.keys(rateRecord?.rates).length > 0) {
    return Object.keys(rateRecord?.rates).concat(rateRecord.base).sort()
  }
  return undefined
}

export const getStateRecord = <Type>(state: ApiState<Type> | null) => {
  return state?.type === 'success' ? state.response : undefined
}

export function getHistoryRates(
  param: { from: string; to: string },
  historyRecord: HistoryData
): HistoryRatesData {
  const ratesRecord = Object.entries(historyRecord).reduce(
    (result: HistoryRatesData, [date, record]) => {
      return { ...result, [date]: getCurrencyRate(param, record) || 0 }
    },
    {}
  )
  return ratesRecord
}

export const dateToDateLabel = (date: string, showYear?: boolean) => {
  const dateInstance = new Date(date)
  const year = dateInstance.getFullYear()
  const month = dateInstance.getMonth()
  return `${MONTH_NAMES[month]}${showYear ? `-${year}` : ''}`
}

export const omit = <T extends object, K extends keyof T>(obj: T, keys: K[]): Omit<T, K> => {
  const _ = { ...obj }
  keys.forEach((key) => delete _[key])
  return _
}

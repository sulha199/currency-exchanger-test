import { Injectable } from '@angular/core'
import { IFixerResponse } from 'fixer-api/dist/Fixer'
import * as fixer from 'fixer-api/dist/index'
import { BehaviorSubject, map, Observable, throwError } from 'rxjs'
import { FIXER_API_DEFAULT_CURRENCY } from 'src/currency/consts'
import { ApiState } from 'src/shared/models/api'

type YearAndMonth = {
  year: number
  /** Month value in number from 1 to 12 */
  month: number
}

/** Date in YYYY-MM-DD string format */
type DateString = string

type CurrencyRate = number

type HistoryData = Record<DateString, IFixerResponse>
type HistoryRatesData = Record<DateString, CurrencyRate>

const getEndOfMonth = ({ year, month }: YearAndMonth) => {
  const yearAndMonth = `${year}-${month.toString().padStart(2, '0')}-`
  return `${yearAndMonth}${
    month === 2
      ? year & 3 || (!(year % 25) && year & 15)
        ? 28
        : 29
      : 30 + ((month + (month >> 3)) & 1)
  }`
}

@Injectable()
export class HistoryService {
  readonly defaultCurrency = FIXER_API_DEFAULT_CURRENCY
  private data$ = new BehaviorSubject<ApiState<HistoryData> | null>(null)

  constructor() {
    this.loadHistorical()
  }

  getHistoryRates(
    from: string,
    to: string
  ): Observable<ApiState<HistoryRatesData> | null> {
    return this.data$.pipe(
      map((data) => {
        if (data?.type === 'success') {
          const ratesRecord = Object.entries(data.response).reduce(
            (result: HistoryRatesData, [date, record]) => {
              return {
                ...result,
                [date]: this.getRatesFromFixerApiRecord(from, to, record) || 0,
              }
            },
            {}
          )
          return { type: 'success', response: ratesRecord }
        } else {
          return data
        }
      })
    )
  }

  getRatesFromFixerApiRecord(from: string, to: string, { rates }: IFixerResponse) {
    if (rates[to] == null) {
      throw new Error(`Could not find the 'To' for conversion from ${from} to ${to}`)
    }
    if (from === this.defaultCurrency) {
      return rates[to]
    }
    if (rates[from] == null) {
      throw new Error(`Could not find the 'From' for conversion from ${from} to ${to}`)
    }
    return rates[to] / rates[from]
  }

  async loadHistorical() {
    this.data$.next({ type: 'requesting' })
    const response = await this.getHistorical(this.defaultCurrency).catch((error) => {
      this.data$.next({ type: 'error', error })
      throwError(() => error)
    })
    if (response) {
      this.data$.next({ type: 'success', response })
    }
  }

  async getHistorical(baseCurrency: string = this.defaultCurrency): Promise<HistoryData> {
    const now = new Date()
    const month = now.getMonth()
    const year = now.getFullYear()

    const data: HistoryData = {}
    new Array(12).fill(null).forEach(async (_, index) => {
      const endOfDate = getEndOfMonth({
        year: month + index < 12 ? year - 1 : year,
        month: month + (index % 12) + 1,
      })
      data[endOfDate] = await fixer.forDate(endOfDate, { base: baseCurrency })
    })
    return data
  }
}

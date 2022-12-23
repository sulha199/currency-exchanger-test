import { Injectable } from '@angular/core'
import { IFixerResponse } from 'fixer-api/dist/Fixer'

import * as fixer from 'fixer-api/dist/index'
import { BehaviorSubject } from 'rxjs'

import { DEFAULT_CURRENCY } from 'src/currency/consts'
import { ApiState, FixerResponseWithMessage } from 'src/shared/models/api'
import { getEndOfMonth, HistoryData } from '../../utils'

@Injectable()
export class HistoryService {
  private readonly defaultCurrency = DEFAULT_CURRENCY
  private _data$ = new BehaviorSubject<ApiState<HistoryData> | null>(null)
  data$: Omit<typeof this._data$, 'next'> = this._data$

  constructor() {
    this.loadHistorical()
  }

  async loadHistorical() {
    this._data$.next({ type: 'requesting' })
    const response = await this.getHistoricalSequence(this.defaultCurrency).catch(
      (error) => {
        this._data$.next({ type: 'error', error })
        console.error(error)
      }
    )
    if (response) {
      this._data$.next(
        Object.keys(response).length === 0
          ? { type: 'error', error: new Error('Failed to load history') }
          : { type: 'success', response }
      )
    }
  }

  async getHistoricalSequence(
    baseCurrency: string = this.defaultCurrency
  ): Promise<HistoryData> {
    const now = new Date()
    const month = now.getMonth()
    const year = now.getFullYear()

    const data: HistoryData = {}
    await Promise.all(
      new Array(12).fill(null).map(async (_, index) => {
        const endOfDate = getEndOfMonth({
          year: month + index < 12 ? year - 1 : year,
          month: (month + index + 1) % 12 || 12,
        })
        // this request is cached via service worker
        const response: FixerResponseWithMessage<IFixerResponse> = await fixer.forDate(
          endOfDate,
          { base: baseCurrency }
        )
        if (!response.message) {
          data[endOfDate] = response
        }
      })
    )
    return data
  }
}

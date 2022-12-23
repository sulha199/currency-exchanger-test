import { Injectable } from '@angular/core'
import { IFixerResponse } from 'fixer-api/dist/Fixer'
import * as fixer from 'fixer-api/dist/index'
import { BehaviorSubject } from 'rxjs'
import { DEFAULT_CURRENCY } from 'src/currency/consts'
import { ApiState, FixerResponseWithMessage } from 'src/shared/models/api'

@Injectable()
export class ExchangeService {
  private _rates$ = new BehaviorSubject<ApiState<IFixerResponse> | null>(null)
  rates$: Omit<typeof this._rates$, 'next'> = this._rates$

  constructor() {
    this.loadFixerLatest({ base: DEFAULT_CURRENCY })
  }

  async loadFixerLatest(...params: Parameters<typeof fixer.latest>) {
    // TODO: setup retry mechanism
    this._rates$.next({ type: 'requesting' })
    // this request is cached via service worker
    const response: FixerResponseWithMessage<IFixerResponse> | undefined = await fixer

      .latest(...params)
      .catch((error) => {
        this._rates$.next({ type: 'error', error })
        return undefined
      })
    if (response) {
      this._rates$.next(
        response.rates
          ? {
              type: 'success',
              response,
            }
          : { type: 'error', error: new Error(response.message) }
      )
    }
  }
}

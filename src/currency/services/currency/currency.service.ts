import { Injectable } from '@angular/core'
import { IFixerSymbolResponse } from 'fixer-api/dist/Fixer'
import * as fixer from 'fixer-api/dist/index'
import { BehaviorSubject } from 'rxjs'
import { FIXER_API_DEFAULT_CURRENCY } from 'src/currency/consts'
import { ApiState } from 'src/shared/models/api'

@Injectable({
  providedIn: 'root',
})
export class CurrencyService {
  private _currencies$ = new BehaviorSubject<ApiState<IFixerSymbolResponse> | null>(null)
  currencies$: Omit<typeof this._currencies$, 'next'> = this._currencies$

  constructor() {
    this.loadCurrencies({
      base: FIXER_API_DEFAULT_CURRENCY,
    })
  }

  async loadCurrencies(...params: Parameters<typeof fixer.symbols>) {
    // TODO: setup retry mechanism
    const response = await fixer
      .symbols(...params)
      .catch((error) => this._currencies$.next({ type: 'error', error }))
    if (response) {
      this._currencies$.next({
        type: 'success',
        response,
      })
    }
  }
}

import { Injectable } from '@angular/core'
import { IFixerResponse } from 'fixer-api/dist/Fixer'
import * as fixer from 'fixer-api/dist/index'
import { BehaviorSubject } from 'rxjs'
import { FIXER_API_DEFAULT_CURRENCY } from 'src/currency/consts'
import { ApiState } from 'src/shared/models/api'

@Injectable()
export class ExchangeService {
  private _latest$ = new BehaviorSubject<ApiState<IFixerResponse> | null>(null)
  data$: Omit<typeof this._latest$, 'next'> = this._latest$

  constructor() {
    this.loadFixerLatest({ base: FIXER_API_DEFAULT_CURRENCY })
  }

  async loadFixerLatest(...params: Parameters<typeof fixer.latest>) {
    // TODO: setup retry mechanism
    const response = await fixer
      .latest(...params)
      .catch((error) => this._latest$.next({ type: 'error', error }))
    if (response) {
      this._latest$.next({
        type: 'success',
        response,
      })
    }
  }
}

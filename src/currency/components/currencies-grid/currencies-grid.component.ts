import { Component, Input, OnChanges, SimpleChanges } from '@angular/core'
import { IFixerResponse } from 'fixer-api/dist/Fixer'
import { DEFAULT_CURRENCY, TOP_CURRENCIES } from 'src/currency/consts'
import { getCurrencyRate } from 'src/currency/utils'

type CurrencyRate = {
  currency: string
  rate: number
}

@Component({
  selector: 'app-currencies-grid',
  templateUrl: './currencies-grid.component.html',
  styleUrls: ['./currencies-grid.component.scss'],
})
export class CurrenciesGridComponent implements OnChanges {
  @Input() ratesRecord?: IFixerResponse
  @Input() from: string = DEFAULT_CURRENCY

  topCurrenciesRates: Array<CurrencyRate> = []

  ngOnChanges(changes: SimpleChanges): void {
    if (changes && this.ratesRecord) {
      this.topCurrenciesRates = this.getTopCurrenciesRates(this.ratesRecord)
    }
  }

  getTopCurrenciesRates(ratesRecord: IFixerResponse) {
    return TOP_CURRENCIES.reduce((result: CurrencyRate[], currency) => {
      return result.concat({
        rate: getCurrencyRate({ from: this.from, to: currency }, ratesRecord),
        currency,
      })
    }, [])
  }
}

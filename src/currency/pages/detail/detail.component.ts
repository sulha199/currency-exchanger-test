import { Component, OnDestroy } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { Subscription } from 'rxjs'
import { ExchangeFormComponent } from 'src/currency/components/exchange-form/exchange-form.component'
import { CURRENCY_SYMBOLS } from 'src/currency/consts'
import { ExchangeService } from 'src/currency/services/exchange/exchange.service'
import { HistoryService } from 'src/currency/services/history/history.service'

@Component({
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss'],
})
export class DetailComponent implements OnDestroy {
  rates$ = this.exchange.rates$
  from = this.getParam('from')
  to = this.getParam('to')
  private _amountParam = this.route.snapshot.paramMap.get('amount') || null
  amount = this._amountParam ? parseFloat(this._amountParam) : null
  historyRecord = this.history.data$
  subscription: Subscription = new Subscription()
  symbols = CURRENCY_SYMBOLS

  constructor(
    private exchange: ExchangeService,
    private route: ActivatedRoute,
    private history: HistoryService
  ) {
    this.subscription.add(
      this.route.paramMap.subscribe(() => {
        this.formChange({
          from: this.getParam('from'),
          to: this.getParam('to'),
        })
      })
    )
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe()
  }

  private getParam(name: string) {
    return this.route.snapshot.paramMap.get(name)?.toUpperCase()
  }

  formChange({ from, to }: ExchangeFormComponent['form']['value']) {
    this.from = from ?? this.from
    this.to = to ?? this.to
  }
}

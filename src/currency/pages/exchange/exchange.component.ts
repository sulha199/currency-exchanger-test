import { Component } from '@angular/core'
import { ExchangeService } from 'src/currency/services/exchange/exchange.service'

@Component({
  templateUrl: './exchange.component.html',
  styleUrls: ['./exchange.component.scss'],
})
export class ExchangeComponent {
  rates$ = this.exchange.rates$

  constructor(private exchange: ExchangeService) {}
}

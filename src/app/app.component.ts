import { Component } from '@angular/core'
import { CurrencyService } from 'src/currency/services/currency/currency.service'


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'currency-exchanger-test'

  constructor(private currency: CurrencyService) {}
}

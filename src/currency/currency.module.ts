import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'

import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { SharedModule } from 'src/shared/shared.module'
import { CurrenciesGridComponent } from './components/currencies-grid/currencies-grid.component'
import { ExchangeFormComponent } from './components/exchange-form/exchange-form.component'
import { HistoryChartComponent } from './components/history-chart/history-chart.component'
import { CurrencyRoutingModule } from './currency-routing.module'
import { DetailComponent } from './pages/detail/detail.component'
import { ExchangeComponent } from './pages/exchange/exchange.component'
import { ExchangeService } from './services/exchange/exchange.service'
import { HistoryService } from './services/history/history.service'

@NgModule({
  declarations: [
    ExchangeComponent,
    DetailComponent,
    ExchangeFormComponent,
    CurrenciesGridComponent,
    HistoryChartComponent,
  ],
  imports: [
    CommonModule,
    CurrencyRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
  ],
  providers: [ExchangeService, HistoryService],
})
export class CurrencyModule {}

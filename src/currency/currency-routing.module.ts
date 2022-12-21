import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { DetailComponent } from './pages/detail/detail.component'
import { ExchangeComponent } from './pages/exchange/exchange.component'

const routes: Routes = [
  { path: '', component: ExchangeComponent },
  { path: 'detail/:from/:to/:amount?', component: DetailComponent },
  { path: 'detail/:from/:to', component: DetailComponent },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CurrencyRoutingModule {}

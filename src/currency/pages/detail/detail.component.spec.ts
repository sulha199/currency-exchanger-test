import { CommonModule } from '@angular/common'
import { ComponentFixture, TestBed } from '@angular/core/testing'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { RouterModule } from '@angular/router'
import { CurrenciesGridComponent } from 'src/currency/components/currencies-grid/currencies-grid.component'
import { ExchangeFormComponent } from 'src/currency/components/exchange-form/exchange-form.component'
import { HistoryChartComponent } from 'src/currency/components/history-chart/history-chart.component'
import { DEFAULT_CURRENCY, DEFAULT_TARGET_CURRENCY } from 'src/currency/consts'
import { ApiStateWrapperComponent } from 'src/shared/components/api-state-wrapper/api-state-wrapper.component'
import { ApplyFunctionPipe } from 'src/shared/pipes/apply.pipe'
import { ReadStatePipe } from 'src/shared/pipes/read-state.pipe'
import { mockExchangeService, mockHistoryService } from 'src/testing/mock-provider.spec'
import { ExchangeComponent } from '../exchange/exchange.component'

import { DetailComponent } from './detail.component'

// TODO: improve the test
describe('DetailComponent', () => {
  let component: DetailComponent
  let fixture: ComponentFixture<DetailComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        ExchangeComponent,
        ExchangeFormComponent,
        CurrenciesGridComponent,
        ApplyFunctionPipe,
        ApiStateWrapperComponent,
        ReadStatePipe,
        DetailComponent,
        HistoryChartComponent,
      ],
      providers: [mockHistoryService, mockExchangeService],
      imports: [FormsModule, ReactiveFormsModule, RouterModule.forRoot([]), CommonModule],
    }).compileComponents()

    fixture = TestBed.createComponent(DetailComponent)
    component = fixture.componentInstance
    component.from = DEFAULT_CURRENCY
    component.to = DEFAULT_TARGET_CURRENCY

    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})

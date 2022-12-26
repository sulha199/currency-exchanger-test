import { CommonModule } from '@angular/common'
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { RouterModule } from '@angular/router'
import { CurrenciesGridComponent } from 'src/currency/components/currencies-grid/currencies-grid.component'
import { ExchangeFormComponent } from 'src/currency/components/exchange-form/exchange-form.component'
import { ApiStateWrapperComponent } from 'src/shared/components/api-state-wrapper/api-state-wrapper.component'
import { ApplyFunctionPipe } from 'src/shared/pipes/apply.pipe'
import { ReadStatePipe } from 'src/shared/pipes/read-state.pipe'
import { mockExchangeService } from 'src/testing/mock-provider.spec'

import { ExchangeComponent } from './exchange.component'

describe('ExchangeComponent', () => {
  let component: ExchangeComponent
  let fixture: ComponentFixture<ExchangeComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        ExchangeComponent,
        ExchangeFormComponent,
        CurrenciesGridComponent,
        ApplyFunctionPipe,
        ApiStateWrapperComponent,
        ReadStatePipe,
      ],
      providers: [mockExchangeService],
      imports: [FormsModule, ReactiveFormsModule, CommonModule, RouterModule.forRoot([])],
    }).compileComponents()

    fixture = TestBed.createComponent(ExchangeComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should load without error', fakeAsync(() => {
    tick(300)
    expect(component).toBeTruthy()
  }))
})

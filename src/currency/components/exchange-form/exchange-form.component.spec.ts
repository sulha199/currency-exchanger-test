import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { DEFAULT_CURRENCY, DEFAULT_TARGET_CURRENCY } from 'src/currency/consts'
import { getCurrencyList } from 'src/currency/utils'
import { ApiStateWrapperComponent } from 'src/shared/components/api-state-wrapper/api-state-wrapper.component'
import { ApplyFunctionPipe } from 'src/shared/pipes/apply.pipe'
import { ReadStatePipe } from 'src/shared/pipes/read-state.pipe'
import { mockDecember2021, mockNovember2022 } from 'src/testing/mock.spec'

import { ExchangeFormComponent } from './exchange-form.component'

describe('ExchangeFormComponent', () => {
  let component: ExchangeFormComponent
  let fixture: ComponentFixture<ExchangeFormComponent>

  const defaultFrom = DEFAULT_CURRENCY
  const defaultTo = DEFAULT_TARGET_CURRENCY

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        ApiStateWrapperComponent,
        ExchangeFormComponent,
        ApplyFunctionPipe,
        ReadStatePipe,
      ],
      imports: [FormsModule, ReactiveFormsModule],
    }).compileComponents()

    fixture = TestBed.createComponent(ExchangeFormComponent)
    component = fixture.componentInstance
    component.amount = 1
    component.ratesRecord = mockNovember2022
    fixture.detectChanges()
  })

  it('should load default currency pair', fakeAsync(() => {
    const currencyList = getCurrencyList(mockNovember2022)
    tick(300)
    expect(component).toBeTruthy()
    if (currencyList) {
      expect(component.currencyList).toEqual(currencyList)
    }
    expect(component.form.value).toEqual({
      amount: 1,
      from: defaultFrom,
      to: defaultTo,
    })
  }))

  it('should calculate converted value', fakeAsync(() => {
    expect(component.form.valid).toBe(true)
    expect(component.form.value).toEqual({
      amount: 1,
      from: defaultFrom,
      to: defaultTo,
    })
    component.calculateConvertedValue()
    tick(300)
    expect(component.convertedValue).toBe(mockNovember2022.rates[defaultTo])

    // use other amount
    const amount = 8.5
    component.form.patchValue({ amount })
    component.calculateConvertedValue()
    tick(300)
    expect(component.convertedValue).toBe(mockNovember2022.rates[defaultTo] * amount)
  }))

  it('should failed to calculate weak currency', fakeAsync(() => {
    expect(component.form.valid).toBe(true)
    component.form.patchValue({ from: 'IDR', to: defaultFrom })
    component.calculateConvertedValue()
    tick(500)
    expect(component.convertedValue).toBe(undefined)
    expect(component.form.controls.amount.errors).toBeTruthy()
  }))

  it('should swap correctly', fakeAsync(() => {
    expect(component.form.valid).toBe(true)
    component.swap()
    tick(300)

    expect(component.form.value).toEqual({
      amount: 1,
      from: defaultTo,
      to: defaultFrom,
    })
  }))

  it('should receive update from parent component', fakeAsync(() => {
    expect(component.form.valid).toBe(true)
    const amount = 9
    component.from = defaultTo
    component.to = defaultFrom
    component.amount = amount
    component.ratesRecord = mockDecember2021
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    component.ngOnChanges({ rateRecord: {} } as any)
    tick(300)

    expect(component.form.value).toEqual({
      amount,
      from: defaultTo,
      to: defaultFrom,
    })
    const currencyList = getCurrencyList(mockDecember2021)
    if (currencyList) {
      expect(component.currencyList).toEqual(currencyList)
    }
  }))
})

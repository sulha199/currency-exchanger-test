import { CommonModule } from '@angular/common'
import { ComponentFixture, TestBed } from '@angular/core/testing'
import { DEFAULT_CURRENCY } from 'src/currency/consts'
import { mockNovember2022 } from 'src/testing/mock.spec'

import { CurrenciesGridComponent } from './currencies-grid.component'

describe('CurrenciesGridComponent', () => {
  let component: CurrenciesGridComponent
  let fixture: ComponentFixture<CurrenciesGridComponent>
  const from = DEFAULT_CURRENCY

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CurrenciesGridComponent],
      imports: [CommonModule],
    }).compileComponents()

    fixture = TestBed.createComponent(CurrenciesGridComponent)
    component = fixture.componentInstance
    component.ratesRecord = mockNovember2022
    component.from = from
    component.ngOnChanges({})
    fixture.detectChanges()
  })

  it('should load using default currency', () => {
    expect(component).toBeTruthy()
    const compiled = fixture.nativeElement as HTMLElement
    const gridItemRefs = compiled.querySelectorAll('.currency-grid__item')
    expect(gridItemRefs.length).toBe(9)
  })
})

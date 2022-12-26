import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges
} from '@angular/core'
import { FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms'
import { IFixerResponse } from 'fixer-api/dist/Fixer'
import { Subscription } from 'rxjs'
import { startWith } from 'rxjs/operators'
import { DEFAULT_CURRENCY, DEFAULT_TARGET_CURRENCY } from 'src/currency/consts'
import { getCurrencyList, getCurrencyRate } from 'src/currency/utils'

@Component({
  selector: 'app-exchange-form',
  templateUrl: './exchange-form.component.html',
  styleUrls: ['./exchange-form.component.scss'],
})
export class ExchangeFormComponent implements OnChanges, OnInit, OnDestroy {
  @Input() ratesRecord?: IFixerResponse | undefined
  @Input() showMoreDetailButton = false
  @Input() from?: string | null
  @Input() to?: string | null
  @Input() amount?: number | null

  currencyList: string[] = [DEFAULT_CURRENCY]

  form = new FormGroup({
    amount: new FormControl<number>(1, [Validators.required]),
    from: new FormControl<string>(DEFAULT_CURRENCY, [Validators.required]),
    to: new FormControl<string>(DEFAULT_TARGET_CURRENCY, [Validators.required]),
  })
  @Output() formChange = new EventEmitter<typeof this.form.value>()
  convertedValue?: number
  conversionRate?: number

  subscription = new Subscription()

  ngOnInit(): void {
    this.loadInputToForm()
    this.currencyList = getCurrencyList(this.ratesRecord) ?? this.currencyList
    if (this.amount) {
      this.calculateConvertedValue()
    }
    this.subscription.add(
      this.form.valueChanges
        .pipe(startWith(this.form.value))
        .subscribe(() => this.onFormChanges())
    )
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.loadInputToForm()
    if (changes['rateRecord']) {
      this.currencyList = getCurrencyList(this.ratesRecord) ?? this.currencyList
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe()
  }

  calculateConvertedValue() {
    const { amount, from, to } = this.form.value
    if (this.form.valid && amount != null && to && from && this.ratesRecord) {
      const rate = getCurrencyRate({ from, to }, this.ratesRecord)
      if (rate && rate < 0.01) {
        this.form.controls.amount.setErrors({
          'Please enter a higher amount': 'amount',
        })
        this.convertedValue = undefined
        return
      }
      this.convertedValue = rate != null ? rate * amount : undefined
      this.form.markAsUntouched()
      this.form.markAsPristine()
    }
  }

  swap() {
    const { from, to } = this.form.value
    this.form.patchValue({
      from: to,
      to: from,
    })
    this.form.markAsTouched()
    this.form.controls.amount.setErrors(null)
  }

  getError(errors?: ValidationErrors | null) {
    return errors ? Object.keys(errors)[0] : null
  }

  onFormChanges() {
    this.formChange.emit(this.form.value)
    const { from, to } = this.form.value
    if (from && to && this.ratesRecord) {
      this.conversionRate = getCurrencyRate({ from, to }, this.ratesRecord)
    }
  }

  private loadInputToForm() {
    const { from, to, amount } = this.form.value
    this.form.patchValue(
      {
        from: this.from ?? from,
        to: this.to ?? to,
        amount: this.amount ?? amount,
      },
      { emitEvent: false }
    )
  }
}

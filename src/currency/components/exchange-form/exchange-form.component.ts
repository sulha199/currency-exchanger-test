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
import { getCurrencyList, getCurrencyRate, omit } from 'src/currency/utils'

type ExchangeFormOptions = {
  showMoreDetailButton?: boolean,
  disableFrom?: boolean
}

const amountValidator = (minValue: number) =>  [Validators.required, Validators.min(minValue)]
const  createExchangeFormGroup = () => {
  return new FormGroup({
    amount: new FormControl<number>(1, amountValidator(0.01)),
    from: new FormControl<string>(DEFAULT_CURRENCY, [Validators.required]),
    to: new FormControl<string>(DEFAULT_TARGET_CURRENCY, [Validators.required]),
  })
}
const amountTooLowMessage = 'Please enter a higher amount'

@Component({
  selector: 'app-exchange-form',
  templateUrl: './exchange-form.component.html',
  styleUrls: ['./exchange-form.component.scss'],
})
export class ExchangeFormComponent implements OnChanges, OnInit, OnDestroy {
  @Input() ratesRecord?: IFixerResponse | undefined
  @Input() options?: ExchangeFormOptions
  @Input() from?: string | null
  @Input() to?: string | null
  @Input() amount?: number | null

  currencyList: string[] = [DEFAULT_CURRENCY]

  form = createExchangeFormGroup()
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
      this.convertedValue = rate != null ? rate * amount : undefined

      if (this.convertedValue && this.convertedValue < 0.01) {
        this.form.controls.amount.setErrors({
          [amountTooLowMessage]: 'amount',
        })
        this.convertedValue = undefined
        return
      }
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
    this.form.controls.amount.setErrors(
      this.form.controls.amount.errors ?
      omit(this.form.controls.amount.errors, [amountTooLowMessage]) : null
    )
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


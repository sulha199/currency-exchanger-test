import { getCurrencyRate } from '.'
import { mockNovember2022 } from '../../testing/mock.spec'
import { DEFAULT_CURRENCY, DEFAULT_TARGET_CURRENCY } from '../consts'

describe('Currency Utils - getCurrencyRate', () => {
  const base = DEFAULT_CURRENCY
  const usd = DEFAULT_TARGET_CURRENCY
  const gbp = 'GBP'

  it('should get USD rate directly using `from` = `base`', () => {
    expect(getCurrencyRate({ from: base, to: usd }, mockNovember2022)).toBe(
      mockNovember2022.rates[usd]
    )
  })

  it('should get a divided rate using swapped `to` = `base` && from `USD`', () => {
    expect(getCurrencyRate({ from: usd, to: base }, mockNovember2022)).toBe(
      1 / mockNovember2022.rates[usd]
    )
  })

  it('should get a calculated rate using swapped `to` = `GBP` && from `USD`', () => {
    expect(getCurrencyRate({ from: usd, to: gbp }, mockNovember2022)).toBe(
      mockNovember2022.rates[gbp] / mockNovember2022.rates[usd]
    )
  })
})

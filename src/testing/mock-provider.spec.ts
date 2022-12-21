import { IFixerResponse } from 'fixer-api/dist/Fixer'
import { BehaviorSubject } from 'rxjs'
import { ExchangeService } from 'src/currency/services/exchange/exchange.service'
import { HistoryService } from 'src/currency/services/history/history.service'
import { HistoryData } from 'src/currency/utils'
import { ApiState } from 'src/shared/models/api'
import { mockHistoryRecord, mockNovember2022 } from './mock.spec'

export const mockOmit = <T extends object, K extends keyof T>(
  _obj: T,
  _keys: K[]
): Omit<T, K> => {
  return _obj
}

class a {}

const createMockProvider = <Provider extends a>(
  provider: unknown,
  props: Partial<Provider>
) => {
  return {
    provide: provider,
    useValue: props,
  }
}

export const mockExchangeService = createMockProvider<ExchangeService>(ExchangeService, {
  rates$: mockOmit(
    new BehaviorSubject<ApiState<IFixerResponse> | null>({
      type: 'success',
      response: mockNovember2022,
    }),
    ['next']
  ),
})

export const mockHistoryService = createMockProvider<HistoryService>(HistoryService, {
  data$: mockOmit(
    new BehaviorSubject<ApiState<HistoryData> | null>({
      type: 'success',
      response: mockHistoryRecord,
    }),
    ['next']
  ),
})

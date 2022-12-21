import { fakeAsync, TestBed, tick } from '@angular/core/testing'

import * as fixer from 'fixer-api'

import { HttpClientTestingModule } from '@angular/common/http/testing'
import { ExchangeService } from './exchange.service'

import { IFixerResponse } from 'fixer-api/dist/Fixer'
import { FixerResponseWithMessage } from 'src/shared/models/api'
import { mockNovember2022 } from '../../../testing/mock.spec'

describe('ExchangeService', () => {
  let service: ExchangeService

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ExchangeService],
    })
  })

  it('should load data correctly', fakeAsync(() => {
    spyOn(fixer, 'latest').and.callFake(async () => {
      tick(300)
      return mockNovember2022
    })
    service = TestBed.inject(ExchangeService)
    expect(service).toBeTruthy()
    expect(service.rates$.value?.type).toEqual('requesting')

    tick(400)
    expect(fixer.latest).toHaveBeenCalled()
    expect(service.rates$.value?.type).toEqual('success')
    if (service.rates$.value?.type === 'success') {
      expect(service.rates$.value?.response).toEqual(mockNovember2022)
    }
  }))

  it('should get the thrown error', fakeAsync(() => {
    const error = new Error('some error')
    spyOn(fixer, 'latest').and.callFake(async () => {
      tick(300)
      throw error
    })
    service = TestBed.inject(ExchangeService)
    expect(service).toBeTruthy()
    expect(service.rates$.value?.type).toEqual('requesting')

    tick(400)
    expect(fixer.latest).toHaveBeenCalled()
    expect(service.rates$.value?.type).toEqual('error')
    if (service.rates$.value?.type === 'error') {
      expect(service.rates$.value?.error.message).toEqual(error.message)
    }
  }))

  it('should get the message from response and set as error', fakeAsync(() => {
    const message = 'some message'
    spyOn(fixer, 'latest').and.callFake(async () => {
      tick(300)
      return { message: message } as FixerResponseWithMessage<IFixerResponse>
    })
    service = TestBed.inject(ExchangeService)
    expect(service).toBeTruthy()
    expect(service.rates$.value?.type).toEqual('requesting')

    tick(400)
    expect(fixer.latest).toHaveBeenCalled()
    expect(service.rates$.value?.type).toEqual('error')
    if (service.rates$.value?.type === 'error') {
      expect(service.rates$.value?.error.message).toEqual(message)
    }
  }))
})

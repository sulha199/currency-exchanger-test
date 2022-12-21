import { fakeAsync, TestBed, tick } from '@angular/core/testing'


import * as fixer from 'fixer-api'

import { HttpClientTestingModule } from '@angular/common/http/testing'
import { HistoryService } from './history.service'

import { IFixerResponse } from 'fixer-api/dist/Fixer'
import { FixerResponseWithMessage } from 'src/shared/models/api'
import { mockHistoryRecord } from '../../../testing/mock.spec'


describe('HistoryService', () => {
let service: HistoryService


  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [HistoryService],
    })
  })

  it('should load data correctly', fakeAsync(() => {
    jasmine.clock().mockDate(new Date('2022-12-10'));
    const array = Object.values(mockHistoryRecord).map(res => Promise.resolve(res))
    spyOn(fixer, 'forDate').and.returnValues(...array)
    service = TestBed.inject(HistoryService)
    expect(service).toBeTruthy()
    expect(service.data$.value?.type).toEqual('requesting')

    tick(400)
    expect(fixer.forDate).toHaveBeenCalled()
    expect(service.data$.value?.type).toEqual('success')
    if (service.data$.value?.type === 'success') {
      expect(service.data$.value?.response).toEqual(mockHistoryRecord)
    }
  }))

  it('should get the thrown error', fakeAsync(() => {
    const error = new Error('some error')
    spyOn(fixer, 'forDate').and.callFake(async () => {
      throw error
    })
    service = TestBed.inject(HistoryService)
    expect(service).toBeTruthy()
    expect(service.data$.value?.type).toEqual('requesting')

    tick(400)
    expect(service.data$.value?.type).toEqual('error')
    if (service.data$.value?.type === 'error') {
      expect(service.data$.value?.error.message).toBeTruthy()
    }
  }))

  it('should get the message from response and set as error', fakeAsync(() => {

    spyOn(fixer, 'forDate').and.callFake(async () => {
      tick(300)
      return { message: 'some'} as FixerResponseWithMessage<IFixerResponse>
    })
    service = TestBed.inject(HistoryService)
    expect(service).toBeTruthy()
    expect(service.data$.value?.type).toEqual('requesting')

    tick(400)
    expect(fixer.forDate).toHaveBeenCalled()
    expect(service.data$.value?.type).toEqual('error')
    if (service.data$.value?.type === 'error') {
      expect(service.data$.value?.error.message).toBeTruthy()
    }
  }))
})

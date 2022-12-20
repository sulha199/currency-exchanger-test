import { HttpErrorResponse } from '@angular/common/http'

export type ApiSuccessState<ResponseType> = {
  type: 'success'
  response: ResponseType
}

export type ApiState<ResponseType> =
  | ApiSuccessState<ResponseType>
  | { type: 'requesting' }
  | { type: 'error'; error: HttpErrorResponse | any }

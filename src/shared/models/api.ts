export type ApiSuccessState<ResponseType> = {
  type: 'success'
  response: ResponseType
}

export type ApiErrorState = {
  type: 'error'
  error: Error
}

export type ApiRequestingState = {
  type: 'requesting'
}

export type ApiState<ResponseType> =
  | ApiSuccessState<ResponseType>
  | ApiRequestingState
  | ApiErrorState

export type FixerResponseWithMessage<Type> = Type & { message?: string }

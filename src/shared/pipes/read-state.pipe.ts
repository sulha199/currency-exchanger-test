import { Pipe, PipeTransform } from '@angular/core'
import {
  ApiErrorState,
  ApiRequestingState,
  ApiState,
  ApiSuccessState,
} from '../models/api'

type ApiStateMap<Type> = {
  success: ApiSuccessState<Type>
  error: ApiErrorState
  requesting: ApiRequestingState
}

@Pipe({ name: 'readState' })
export class ReadStatePipe implements PipeTransform {
  /**
   * @param methodName method that is to be run using `ApplyFunctionPipe`.
   ** If you require access to component's property, please pass an arrow function instead of class method
   */
  transform<ResponseType, StateType extends ApiState<ResponseType>['type']>(
    state: ApiState<ResponseType> | null,
    type: StateType
  ): ApiStateMap<ResponseType>[StateType] | undefined {
    return state?.type === type
      ? (state as ApiStateMap<ResponseType>[StateType])
      : undefined
  }
}

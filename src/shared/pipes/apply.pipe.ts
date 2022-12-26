/* eslint-disable @typescript-eslint/no-explicit-any */
import { Pipe, PipeTransform } from '@angular/core'

/** Obtain the arguments' types of a function except the first argument */
type RestArgument<T> = T extends (first: unknown, ...args: infer Rest) => any
  ? Rest
  : never

@Pipe({ name: 'apply' })
export class ApplyFunctionPipe implements PipeTransform {
  /**
   * @param callbackMethod method that is to be run using `ApplyFunctionPipe`.
   ** If you require access to component's property, please pass an arrow function instead of class method
   */
  transform<Callback extends (value: any, ...extra: any[]) => any>(
    value: Parameters<Callback>[0],
    callbackMethod: Callback,
    ...extra: RestArgument<Callback>
  ) {
    return callbackMethod(value, ...extra) as ReturnType<Callback>
  }
}

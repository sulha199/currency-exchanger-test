/* eslint-disable @typescript-eslint/no-explicit-any */
import { Pipe, PipeTransform } from '@angular/core'

/** Obtain the arguments' types of a function except the first argument */
type RestArgument<T> = T extends (first: unknown, ...args: infer Rest) => any
  ? Rest
  : never

@Pipe({ name: 'apply' })
export class ApplyFunctionPipe implements PipeTransform {
  /**
   * @param methodName method that is to be run using `ApplyFunctionPipe`.
   ** If you require access to component's property, please pass an arrow function instead of class method
   */
  transform<
    FirstArgument,
    Callback extends <First extends FirstArgument>(first: First, ...args: any[]) => any
  >(sourceValue: FirstArgument, methodName: Callback, ...extra: RestArgument<Callback>) {
    return methodName(sourceValue, ...extra) as ReturnType<typeof methodName>
  }
}

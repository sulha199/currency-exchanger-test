import { Pipe, PipeTransform } from '@angular/core'
import { ApiState } from '../models/api'

@Pipe({ name: 'readState' })
export class ReadStatePipe implements PipeTransform {
  transform<
    State extends ApiState<unknown>,
    StateType extends State['type'],
    Result extends  { type: StateType } & State
  >(state: State | null, type: StateType): Result | null {
    return state?.type === type ? (state as unknown as Result) : null
  }
}

import { Component, Input } from '@angular/core'
import { ApiState } from 'src/shared/models/api'

@Component({
  selector: 'app-api-state-wrapper',
  templateUrl: './api-state-wrapper.component.html',
  styleUrls: ['./api-state-wrapper.component.scss'],
})
export class ApiStateWrapperComponent<Type> {
  @Input() state?: ApiState<Type>
}

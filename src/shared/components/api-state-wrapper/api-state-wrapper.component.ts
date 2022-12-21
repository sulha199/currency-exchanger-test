import { Component, Input } from '@angular/core'
import { KEYNAME_FIXER_API_APIKEY } from 'src/currency/consts'

import { ApiState } from 'src/shared/models/api'

@Component({
  selector: 'app-api-state-wrapper',
  templateUrl: './api-state-wrapper.component.html',
  styleUrls: ['./api-state-wrapper.component.scss'],
})
export class ApiStateWrapperComponent<Type> {
  @Input() state?: ApiState<Type>
  messageUrl = `${location.protocol}//${location.host}${location.pathname}?${KEYNAME_FIXER_API_APIKEY}=YOUR_FIXER_API_KEY`
}

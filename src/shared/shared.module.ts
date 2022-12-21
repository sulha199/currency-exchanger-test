import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { RouterModule } from '@angular/router'
import { ApiStateWrapperComponent } from './components/api-state-wrapper/api-state-wrapper.component'
import { HeaderComponent } from './components/header/header.component'
import { ApplyFunctionPipe } from './pipes/apply.pipe'
import { ReadStatePipe } from './pipes/read-state.pipe'

@NgModule({
  declarations: [
    HeaderComponent,
    ApplyFunctionPipe,
    ReadStatePipe,
    ApiStateWrapperComponent,
  ],
  imports: [RouterModule, CommonModule],
  exports: [HeaderComponent, ApiStateWrapperComponent, ApplyFunctionPipe, ReadStatePipe],
})
export class SharedModule {}

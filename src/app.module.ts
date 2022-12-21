import { isDevMode, NgModule } from '@angular/core'

import { BrowserModule } from '@angular/platform-browser'

import { ServiceWorkerModule } from '@angular/service-worker'

import { FIXER_API_APIKEY, FIXER_API_BASE_URL } from 'src/currency/consts'

import * as fixer from 'fixer-api/dist/index'

import { HTTP_INTERCEPTORS } from '@angular/common/http'

import { AppRoutingModule } from './app-routing.module'
import { AppComponent } from './app/app.component'
import { CustomHttpInterceptor } from './shared/services/http-interceptor.service'

import { SharedModule } from './shared/shared.module'
fixer.set({ accessKey: FIXER_API_APIKEY, baseUrl: FIXER_API_BASE_URL })

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    SharedModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: !isDevMode(),
      // Register the ServiceWorker as soon as the application is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000',
    }),
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: CustomHttpInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}

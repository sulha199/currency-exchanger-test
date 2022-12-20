import { isDevMode, NgModule } from '@angular/core'

import { BrowserModule } from '@angular/platform-browser'

import { ServiceWorkerModule } from '@angular/service-worker'

import { FIXER_API_APIKEY } from 'src/currency/consts'

import * as fixer from 'fixer-api/dist/index'

import { AppRoutingModule } from './app-routing.module'
import { AppComponent } from './app.component'
fixer.set({ accessKey: FIXER_API_APIKEY, baseUrl: 'https://api.apilayer.com/fixer' })


@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: !isDevMode(),
      // Register the ServiceWorker as soon as the application is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000',
    }),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}

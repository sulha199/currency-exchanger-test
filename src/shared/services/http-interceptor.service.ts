import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest
} from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable, of } from 'rxjs'

import { switchMap } from 'rxjs/operators'
import {
  FIXER_API_APIKEY,
  FIXER_API_APIKEY_HTTP_HEADER,
  FIXER_API_BASE_URL
} from 'src/currency/consts'

@Injectable()
export class CustomHttpInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return of(req).pipe(
      switchMap((request) => {
        // currently fixer api is called via fixer-api package and is using native's fetch
        // therefore, this interceptor is just created for future usage
        // caching is handled via service worker
        if (request.url.includes(FIXER_API_BASE_URL))
          request = request.clone({
            headers: request.headers.set(FIXER_API_APIKEY_HTTP_HEADER, FIXER_API_APIKEY),
          })

        return next.handle(request)
      })
    )
  }
}

// The HttpInterceptor is an interface and used to implement the intercept method.

import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { throwError, Observable, BehaviorSubject, of } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { LoaderService } from '../services/loader.service';
import { map, catchError } from 'rxjs/operators';

@Injectable()
export class MyInterceptor implements HttpInterceptor {
  constructor(private Auth: AuthService, private loader: LoaderService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const x = window.scrollX;
    const y = window.scrollY;
    window.onscroll = function () { window.scrollTo(x, y); };
    if (localStorage.getItem('authToken')) {
      // this.loader.setLoading(true);
      const reqHeader = req.clone({ headers: req.headers.set('Authorization', 'JWT ' + localStorage.getItem('authToken')) });
      return next.handle(reqHeader).pipe(
        map((event: HttpEvent<any>) => {
          if (event instanceof HttpResponse) {
            window.onscroll = function () { };
            this.loader.setLoading(false);
            // Start replace message from api
            /* event.body.reference_number = '';
            if (this.Auth.dynamicMessageList[event.body.message]) {
              event.body.reference_number = '<br> Code:' + this.Auth.dynamicMessageList[event.body.message].reference_number;
              event.body.status = this.Auth.dynamicMessageList[event.body.message].type;
              event.body.message = this.Auth.dynamicMessageList[event.body.message].title_eng;
            } */
            this.setMessages(event);
            // End replace message from api
          }
          return event;
        }),
        catchError((err: any) => {
          if (err instanceof HttpErrorResponse) {
            window.onscroll = function () { };
            this.loader.setLoading(false);
            if (err.status === 401) {
              this.Auth.logOut();
            }
            return throwError(err);
          }
          return throwError(err);
        })
      )
    } else {
      // this.loader.setLoading(true);
      const reqHeader = req.clone({});
      return next.handle(reqHeader).pipe(
        map((event: HttpEvent<any>) => {
          if (event instanceof HttpResponse) {
            this.setMessages(event);
          }
          return event;
        }),
        catchError((err: any) => {
          if (err instanceof HttpErrorResponse) {
            this.setErrorMessages(err);
            window.onscroll = function () { };
            this.loader.setLoading(false);
            if (err.status === 401) {
              this.Auth.logOut();
            }
            return throwError(err);
          }
          return throwError(err);
        })
      )
      // return next.handle(req);
    }
  }

  setMessages(event: any) {
    event.body.reference_number = '';
    if (this.Auth.dynamicMessageList[event.body.message]) {
      event.body.reference_number = '<br> Code:' + this.Auth.dynamicMessageList[event.body.message].reference_number;
      event.body.status = this.Auth.dynamicMessageList[event.body.message].type;
      event.body.message = this.Auth.dynamicMessageList[event.body.message].title_eng;
    }
  }
  setErrorMessages(event: any) {
    event.error.reference_number = '';
    if (this.Auth.dynamicMessageList[event.error.message]) {
      event.error.reference_number = '<br> Code:' + this.Auth.dynamicMessageList[event.error.message].reference_number;
      event.error.status = this.Auth.dynamicMessageList[event.error.message].type;
      event.error.message = this.Auth.dynamicMessageList[event.error.message].title_eng;
    }
  }
}

import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { TokenStorageService } from '../services/token-storage.service';
import { Router } from '@angular/router';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(
    private tokenStorage: TokenStorageService,
    private router: Router
  ) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const token = this.tokenStorage.getToken();
    
    console.log('=== AUTH INTERCEPTOR ===');
    console.log('Request URL:', request.url);
    console.log('Token from storage:', token);
    
    if (token) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log('Authorization header added:', request.headers.get('Authorization'));
    } else {
      console.log('NO TOKEN FOUND - Request will be sent without auth header');
    }

    return next.handle(request).pipe(
      tap(() => console.log('Request successful')),
      catchError((error: HttpErrorResponse) => {
        console.log('Request failed with status:', error.status);
        if (error.status === 401 || error.status === 403) {
          console.log('Unauthorized - redirecting to login');
          this.tokenStorage.signOut();
          this.router.navigate(['/login']);
        }
        return throwError(() => error);
      })
    );
  }
}
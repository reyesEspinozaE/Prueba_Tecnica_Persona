import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private readonly token = 'KvoVsjSoPGH9ojSB3x3QE4BVWl4m6unW6VTwpPoXZI';

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (request.url.includes('localhost:7163')) {
      const authenticatedRequest = request.clone({
        setHeaders: {
          'Authorization': `Bearer ${this.token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });
      
      return next.handle(authenticatedRequest);
    }
    
    // Para otras URLs, continuar sin modificar
    return next.handle(request);
  }
}
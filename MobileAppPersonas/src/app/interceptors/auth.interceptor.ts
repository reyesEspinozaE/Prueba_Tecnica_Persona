import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (request.url.includes(environment.apiUrl) || request.url.startsWith(environment.apiUrl)) {
      const authenticatedRequest = request.clone({
        setHeaders: {
          'Authorization': `Bearer ${environment.apiToken}`,
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
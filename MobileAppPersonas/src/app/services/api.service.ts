import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError, retry, timeout } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ConfigService } from './config.service';
import { ErrorHandlerService } from './error-handler.service';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private readonly http = inject(HttpClient);
  private readonly config = inject(ConfigService);
  private readonly errorHandler = inject(ErrorHandlerService);

  // Timeout por defecto para requests (30 segundos)
  private readonly REQUEST_TIMEOUT = 30000;
  // Número de reintentos automáticos
  private readonly RETRY_COUNT = 2;

  constructor() { }

  // Método GET genérico
  get<T>(endpoint: string, params?: HttpParams): Observable<T> {
    const url = this.config.getApiUrl(endpoint);
    const options = {
      headers: new HttpHeaders(this.config.getAuthHeaders()),
      params: params
    };

    return this.http.get<T>(url, options).pipe(
      timeout(this.REQUEST_TIMEOUT),
      retry(this.RETRY_COUNT),
      catchError(error => this.errorHandler.handleError(error))
    );
  }

  // Método POST genérico
  post<T>(endpoint: string, body: any): Observable<T> {
    const url = this.config.getApiUrl(endpoint);
    const options = {
      headers: new HttpHeaders(this.config.getAuthHeaders())
    };

    return this.http.post<T>(url, body, options).pipe(
      timeout(this.REQUEST_TIMEOUT),
      retry(this.RETRY_COUNT),
      catchError(error => this.errorHandler.handleError(error))
    );
  }

  // Método PUT genérico
  put<T>(endpoint: string, body: any): Observable<T> {
    const url = this.config.getApiUrl(endpoint);
    const options = {
      headers: new HttpHeaders(this.config.getAuthHeaders())
    };

    return this.http.put<T>(url, body, options).pipe(
      timeout(this.REQUEST_TIMEOUT),
      retry(this.RETRY_COUNT),
      catchError(error => this.errorHandler.handleError(error))
    );
  }

  // Método DELETE genérico
  delete<T>(endpoint: string): Observable<T> {
    const url = this.config.getApiUrl(endpoint);
    const options = {
      headers: new HttpHeaders(this.config.getAuthHeaders())
    };

    return this.http.delete<T>(url, options).pipe(
      timeout(this.REQUEST_TIMEOUT),
      retry(this.RETRY_COUNT),
      catchError(error => this.errorHandler.handleError(error))
    );
  }

  // Método para testear la conexión con la API
  testConnection(): Observable<any> {
    return this.get('health-check').pipe(
      catchError(error => {
        console.error('Error de conexión con la API:', error);
        return throwError(() => error);
      })
    );
  }
}
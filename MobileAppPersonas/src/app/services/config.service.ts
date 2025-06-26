import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ConfigService {
  // Configuración desde variables de entorno
  readonly API_BASE_URL = environment.apiUrl;
  readonly API_TOKEN = environment.apiToken;

  // Headers comunes para todas las requests
  readonly DEFAULT_HEADERS = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };

  constructor() {
    // Verificar que las variables estén configuradas
    if (!this.API_BASE_URL || !this.API_TOKEN) {
      console.error('⚠️ Variables de entorno no configuradas correctamente');
      console.error('API_BASE_URL:', this.API_BASE_URL);
      console.error(
        'API_TOKEN:',
        this.API_TOKEN ? '[CONFIGURADO]' : '[NO CONFIGURADO]'
      );
    }
  }

  // Método para obtener headers con token
  getAuthHeaders(): { [key: string]: string } {
    return {
      ...this.DEFAULT_HEADERS,
      Authorization: `Bearer ${this.API_TOKEN}`,
    };
  }

  // Método para obtener la URL completa de un endpoint
  getApiUrl(endpoint: string): string {
    return `${this.API_BASE_URL}/${endpoint}`;
  }

  isProduction(): boolean {
    return environment.production;
  }

  getEnvironmentInfo() {
    return {
      production: environment.production,
      apiUrl: this.API_BASE_URL,
      hasToken: !!this.API_TOKEN,
    };
  }
}

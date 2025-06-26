import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  // Configuración centralizada
  readonly API_BASE_URL = 'https://localhost:7163/api';
  readonly API_TOKEN = 'KvoVsjSoPGH9ojSB3x3QE4BVWl4m6unW6VTwpPoXZI';
  
  // Headers comunes para todas las requests
  readonly DEFAULT_HEADERS = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization'
  };

  constructor() { }

  // Método para obtener headers con token
  getAuthHeaders(): { [key: string]: string } {
    return {
      ...this.DEFAULT_HEADERS,
      'Authorization': `Bearer ${this.API_TOKEN}`
    };
  }

  // Método para obtener la URL completa de un endpoint
  getApiUrl(endpoint: string): string {
    return `${this.API_BASE_URL}/${endpoint}`;
  }
}
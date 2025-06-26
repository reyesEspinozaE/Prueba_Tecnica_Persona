import { Injectable, inject } from '@angular/core';
import { ConfigService } from './config.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly configService = inject(ConfigService);

  // Obtener token desde el ConfigService
  getToken(): string {
    return this.configService.API_TOKEN;
  }

  hasToken(): boolean {
    const token = this.getToken();
    return !!token && token.trim().length > 0;
  }

  getAuthHeader(): string {
    return `Bearer ${this.getToken()}`;
  }

  isValidToken(): boolean {
    const token = this.getToken();
    return token?.length > 10; 
  }

  // Método para debug (no mostrar el token completo por seguridad)
  getTokenInfo() {
    const token = this.getToken();
    return {
      hasToken: this.hasToken(),
      isValid: this.isValidToken(),
      tokenPreview: token ? `${token.substring(0, 8)}...` : 'No token'
    };
  }
}
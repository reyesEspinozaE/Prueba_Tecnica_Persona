import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly TOKEN = 'KvoVsjSoPGH9ojSB3x3QE4BVWl4m6unW6VTwpPoXZI';

  getToken(): string {
    return this.TOKEN;
  }

  hasToken(): boolean {
    return !!this.TOKEN;
  }
}
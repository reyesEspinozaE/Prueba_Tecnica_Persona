import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';

export interface Persona {
  nombre: string;
  apellido: string;
  fechaNacimiento: string;
  email: string;
  telefono?: string;
  direccion?: string;
}

type ApiResponse = { page: number, per_page: number, total: number, total_pages: number, results: Persona[]}

@Injectable({
  providedIn: 'root'
})
export class PersonasService {

  httpClient = inject(HttpClient);
  
  getAll() {
    return firstValueFrom(
      this.httpClient.get('')
    )
  }
}

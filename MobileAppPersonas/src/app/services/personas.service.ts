import { Injectable, inject } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { ConfigService } from './config.service';
import { switchMap } from 'rxjs';

export interface Persona {
  idPersona?: number;
  nombre: string;
  apellido: string;
  fechaNacimiento: string;
  email: string;
  telefono?: string;
  direccion?: string;
  fechaRegistro?: string;
}

@Injectable({
  providedIn: 'root',
})
export class PersonaService {
  private readonly http = inject(HttpClient);
  private readonly config = inject(ConfigService);
  private readonly baseUrl = this.config.getApiUrl('Personas');

  // Método privado para obtener headers con autenticación
  private getHttpOptions() {
    return {
      headers: new HttpHeaders(this.config.getAuthHeaders()),
    };
  }

  // Obtener todas las personas
  obtenerPersonas(): Observable<Persona[]> {
    return this.http.get<any>(this.baseUrl, this.getHttpOptions()).pipe(
      map((response) => {
        // Extraer solo el array de personas del campo 'data'
        return response.data || [];
      }),
      // tap(personas => console.log('Personas extraídas:', personas)),
      catchError(this.manejarError)
    );
  }

  // Obtener persona por ID
  obtenerPersonaPorId(id: number): Observable<Persona> {
    return this.http
      .get<Persona>(`${this.baseUrl}/${id}`, this.getHttpOptions())
      .pipe(catchError(this.manejarError));
  }

  // Crear nueva persona
  crearPersona(persona: Persona): Observable<Persona> {
    return this.http
      .post<Persona>(this.baseUrl, persona, this.getHttpOptions())
      .pipe(catchError(this.manejarError));
  }

  // Actualizar persona existente
  actualizarPersona(id: number, persona: Persona): Observable<Persona> {
    return this.http
      .put<Persona>(`${this.baseUrl}/${id}`, persona, this.getHttpOptions())
      .pipe(catchError(this.manejarError));
  }

  // Eliminar persona
  eliminarPersona(id: number): Observable<void> {
    return this.http
      .delete<void>(`${this.baseUrl}/${id}`, this.getHttpOptions())
      .pipe(catchError(this.manejarError));
  }

  // Buscar personas
  buscarPersonas(query: string): Observable<Persona[]> {
    const params = `?nombre=${query}&apellido=${query}&email=${query}`;
    return this.http
      .get<Persona[]>(`${this.baseUrl}/buscar${params}`, this.getHttpOptions())
      .pipe(catchError(this.manejarError));
  }

  // Manejo centralizado de errores
  private manejarError(error: HttpErrorResponse) {
    let mensajeError = 'Ocurrió un error desconocido.';

    if (error.error instanceof ErrorEvent) {
      // Error del lado del cliente
      mensajeError = `Error: ${error.error.message}`;
    } else {
      // Error del lado del servidor
      switch (error.status) {
        case 400:
          mensajeError = 'Datos inválidos enviados al servidor.';
          break;
        case 404:
          mensajeError = 'Persona no encontrada.';
          break;
        case 500:
          mensajeError = 'Error interno del servidor.';
          break;
        case 0:
          mensajeError =
            'No se pudo conectar con el servidor. Verifique su conexión a internet.';
          break;
        default:
          mensajeError = `Error del servidor: ${error.status} - ${error.message}`;
      }
    }

    console.error('Error en PersonaService:', error);
    return throwError(() => new Error(mensajeError));
  }
}

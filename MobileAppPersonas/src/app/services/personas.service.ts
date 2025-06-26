import { Injectable, inject } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { ConfigService } from './config.service';

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

  // BehaviorSubject para mantener la lista actualizada en tiempo real
  private personasSubject = new BehaviorSubject<Persona[]>([]);
  public personas$ = this.personasSubject.asObservable();

  // Flag para saber si ya se cargaron las personas inicialmente
  private personasCargadas = false;

  constructor() {
    // Cargar personas al inicializar el servicio
    this.cargarPersonasIniciales();
  }

  // Método privado para obtener headers con autenticación
  private getHttpOptions() {
    return {
      headers: new HttpHeaders(this.config.getAuthHeaders()),
    };
  }

  // Cargar personas iniciales (solo una vez)
  private cargarPersonasIniciales() {
    if (!this.personasCargadas) {
      this.obtenerPersonasDesdeAPI().subscribe({
        next: (personas) => {
          this.personasSubject.next(personas);
          this.personasCargadas = true;
        },
        error: (error) =>
          console.error('Error cargando personas iniciales:', error),
      });
    }
  }

  // Método privado para obtener desde API (sin afectar el BehaviorSubject)
  private obtenerPersonasDesdeAPI(): Observable<Persona[]> {
    return this.http.get<any>(this.baseUrl, this.getHttpOptions()).pipe(
      map((response) => {
        // Extraer solo el array de personas del campo 'data'
        return response.data || [];
      }),
      catchError(this.manejarError)
    );
  }

  // Obtener todas las personas (retorna el observable reactivo)
  obtenerPersonas(): Observable<Persona[]> {
    // Si las personas no se han cargado, cargarlas primero
    if (!this.personasCargadas) {
      this.cargarPersonasIniciales();
    }
    return this.personas$;
  }

  // Recargar personas desde la API (para refrescar manualmente)
  recargarPersonas(): void {
    this.obtenerPersonasDesdeAPI().subscribe({
      next: (personas) => {
        this.personasSubject.next(personas);
        console.log('Lista de personas recargada:', personas);
      },
      error: (error) => console.error('Error recargando personas:', error),
    });
  }

  // Obtener persona por ID
  obtenerPersonaPorId(id: number): Observable<Persona> {
    return this.http
      .get<any>(`${this.baseUrl}/${id}`, this.getHttpOptions())
      .pipe(
        map((response) => response.data), // Extraer solo los datos
        catchError(this.manejarError)
      );
  }

  // Crear nueva persona y actualizar lista automáticamente
  crearPersona(persona: Persona): Observable<Persona> {
    return this.http
      .post<any>(this.baseUrl, persona, this.getHttpOptions())
      .pipe(
        map((response) => response.data || response), // Manejar respuesta estructurada
        tap((nuevaPersona) => {
          // Agregar la nueva persona a la lista local
          const personasActuales = this.personasSubject.value;
          this.personasSubject.next([...personasActuales, nuevaPersona]);
          console.log('Nueva persona agregada a la lista:', nuevaPersona);
        }),
        catchError(this.manejarError)
      );
  }

  // Actualizar persona existente y actualizar lista automáticamente
  actualizarPersona(id: number, persona: Persona): Observable<Persona> {
    return this.http
      .put<any>(`${this.baseUrl}/${id}`, persona, this.getHttpOptions())
      .pipe(
        map((response) => response.data || response), // Manejar respuesta estructurada
        tap((personaActualizada) => {
          // Actualizar la persona en la lista local
          const personasActuales = this.personasSubject.value;
          const indice = personasActuales.findIndex((p) => p.idPersona === id);
          if (indice !== -1) {
            personasActuales[indice] = personaActualizada;
            this.personasSubject.next([...personasActuales]);
            console.log('Persona actualizada en la lista:', personaActualizada);
          }
        }),
        catchError(this.manejarError)
      );
  }

  // Eliminar persona y actualizar lista automáticamente
  eliminarPersona(id: number): Observable<void> {
    return this.http
      .delete<void>(`${this.baseUrl}/${id}`, this.getHttpOptions())
      .pipe(
        tap(() => {
          // Eliminar la persona de la lista local
          const personasActuales = this.personasSubject.value;
          const personasActualizadas = personasActuales.filter(
            (persona) => persona.idPersona !== id
          );
          this.personasSubject.next(personasActualizadas);
          console.log(`Persona con ID ${id} eliminada de la lista`);
        }),
        catchError(this.manejarError)
      );
  }

  // Buscar personas
  buscarPersonas(query: string): Observable<Persona[]> {
    const params = `?nombre=${encodeURIComponent(
      query
    )}&apellido=${encodeURIComponent(query)}&email=${encodeURIComponent(
      query
    )}`;

    return this.http
      .get<any>(`${this.baseUrl}/buscar${params}`, this.getHttpOptions())
      .pipe(
        map((response) => response.data || []),
        catchError(this.manejarError)
      );
  }

  // Método para obtener el valor actual de personas (sin suscripción)
  obtenerPersonasActuales(): Persona[] {
    return this.personasSubject.value;
  }

  // Método para limpiar la lista (útil para logout)
  limpiarPersonas(): void {
    this.personasSubject.next([]);
    this.personasCargadas = false;
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

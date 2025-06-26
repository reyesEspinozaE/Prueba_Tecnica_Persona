import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { ToastController, AlertController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlerService {

  constructor(
    private toastController: ToastController,
    private alertController: AlertController
  ) { }

  // Manejo centralizado de errores HTTP
  handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Ha ocurrido un error inesperado';
    let errorTitle = 'Error';

    if (error.error instanceof ErrorEvent) {
      // Error del lado del cliente
      errorMessage = `Error de conexión: ${error.error.message}`;
      errorTitle = 'Error de Conexión';
    } else {
      // Error del lado del servidor
      switch (error.status) {
        case 0:
          errorMessage = 'No se puede conectar con el servidor. Verifica tu conexión a internet y que el servidor esté ejecutándose.';
          errorTitle = 'Sin Conexión';
          break;
        case 401:
          errorMessage = 'Token de autorización inválido o expirado. Contacta al administrador.';
          errorTitle = 'No Autorizado';
          break;
        case 403:
          errorMessage = 'No tienes permisos para realizar esta acción.';
          errorTitle = 'Acceso Denegado';
          break;
        case 404:
          errorMessage = 'El recurso solicitado no fue encontrado.';
          errorTitle = 'No Encontrado';
          break;
        case 500:
          errorMessage = 'Error interno del servidor. Intenta nuevamente más tarde.';
          errorTitle = 'Error del Servidor';
          break;
        case 502:
        case 503:
        case 504:
          errorMessage = 'El servidor no está disponible temporalmente. Intenta más tarde.';
          errorTitle = 'Servidor No Disponible';
          break;
        default:
          if (error.error?.message) {
            errorMessage = error.error.message;
          } else if (error.message) {
            errorMessage = error.message;
          }
          break;
      }
    }

    // Mostrar error al usuario
    this.showErrorToast(errorMessage);
    
    // Log para debugging
    console.error('Error HTTP:', {
      status: error.status,
      statusText: error.statusText,
      url: error.url,
      message: errorMessage,
      fullError: error
    });

    return throwError(() => new Error(errorMessage));
  }

  // Mostrar toast de error
  private async showErrorToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 5000,
      color: 'danger',
      position: 'top',
      buttons: [
        {
          text: 'Cerrar',
          role: 'cancel'
        }
      ]
    });
    await toast.present();
  }

  // Mostrar alerta de error detallada
  async showDetailedError(title: string, message: string) {
    const alert = await this.alertController.create({
      header: title,
      message: message,
      buttons: [
        {
          text: 'Reintentar',
          handler: () => {
            window.location.reload();
          }
        },
        {
          text: 'Cerrar',
          role: 'cancel'
        }
      ]
    });
    await alert.present();
  }
}
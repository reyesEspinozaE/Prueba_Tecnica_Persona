import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, LoadingController, ToastController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonHeader, IonToolbar, IonTitle, IonContent, IonSearchbar, IonFab, IonFabButton,
  IonIcon, IonRefresher, IonRefresherContent, IonCard, IonCardContent, IonList,
  IonItem, IonItemSliding, IonItemOptions, IonItemOption, IonAvatar, IonLabel,
  IonButton, IonSpinner, IonNote
} from '@ionic/angular/standalone';
import { PersonaService, Persona } from '../services/personas.service';

@Component({
  selector: 'app-lista-personas',
  templateUrl: './lista-persona.page.html',
  styleUrls: ['./lista-persona.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonHeader, IonToolbar, IonTitle, IonContent, IonSearchbar, IonFab, IonFabButton,
    IonIcon, IonRefresher, IonRefresherContent, IonCard, IonCardContent, IonList,
    IonItem, IonItemSliding, IonItemOptions, IonItemOption, IonAvatar, IonLabel,
    IonButton, IonSpinner, IonNote
  ]
})
export class ListaPersonasPage implements OnInit {
  personas: Persona[] = [];
  personasFiltradas: Persona[] = [];
  terminoBusqueda: string = '';
  cargando: boolean = false;

  constructor(
    private personaService: PersonaService,
    private router: Router,
    private alertController: AlertController,
    private loadingController: LoadingController,
    private toastController: ToastController
  ) { }

  ngOnInit() {
    this.cargarPersonas();
  }

  ionViewWillEnter() {
    // Recargar personas cada vez que se entra a la vista
    this.cargarPersonas();
  }

   async cargarPersonas() {
    const loading = await this.loadingController.create({
      message: 'Cargando personas...',
      spinner: 'crescent'
    });
    await loading.present();

    this.cargando = true;
    
    this.personaService.obtenerPersonas().subscribe({
      next: (personas) => {
        this.personas = personas;
        this.personasFiltradas = personas;
        this.cargando = false;
        loading.dismiss();
      },
      error: async (error) => {
        this.cargando = false;
        loading.dismiss();
        await this.mostrarError('Error al cargar personas', error.message);
      }
    });
  }
  
  // Función de búsqueda
  async buscarPersonas(event: any) {
    this.terminoBusqueda = event.target.value;
    
    if (this.terminoBusqueda.trim() === '') {
      this.personasFiltradas = this.personas;
      return;
    }

    const loading = await this.loadingController.create({
      message: 'Buscando...',
      spinner: 'dots'
    });
    await loading.present();

    this.personaService.buscarPersonas(this.terminoBusqueda).subscribe({
      next: (personas) => {
        this.personasFiltradas = personas;
        loading.dismiss();
      },
      error: async (error) => {
        loading.dismiss();
        await this.mostrarError('Error en la búsqueda', error.message);
        // En caso de error, filtrar localmente
        this.filtrarLocalmente();
      }
    });
  }

  // Filtro local como respaldo
  private filtrarLocalmente() {
    const termino = this.terminoBusqueda.toLowerCase();
    this.personasFiltradas = this.personas.filter(persona =>
      persona.nombre.toLowerCase().includes(termino) ||
      persona.apellido.toLowerCase().includes(termino) ||
      persona.email.toLowerCase().includes(termino)
    );
  }

  // Navegar al formulario para crear nueva persona
  agregarPersona() {
    this.router.navigate(['/formulario-persona']);
  }

  // Navegar al formulario para editar persona
  editarPersona(persona: Persona) {
    this.router.navigate(['/formulario-persona', persona.idPersona]);
  }

  // Confirmar y eliminar persona
  async eliminarPersona(persona: Persona) {
    const alert = await this.alertController.create({
      header: 'Confirmar eliminación',
      message: `¿Está seguro de que desea eliminar a ${persona.nombre} ${persona.apellido}?`,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Eliminar',
          role: 'destructive',
          handler: () => {
            this.eliminarPersonaConfirmado(persona);
          }
        }
      ]
    });

    await alert.present();
  }

  private async eliminarPersonaConfirmado(persona: Persona) {
    const loading = await this.loadingController.create({
      message: 'Eliminando persona...',
      spinner: 'crescent'
    });
    await loading.present();

    this.personaService.eliminarPersona(persona.idPersona!).subscribe({
      next: async () => {
        loading.dismiss();
        await this.mostrarExito('Persona eliminada con éxito');
        this.cargarPersonas(); // Recargar la lista
      },
      error: async (error) => {
        loading.dismiss();
        await this.mostrarError('Error al eliminar persona', error.message);
      }
    });
  }

  // Refrescar la lista (pull to refresh)
  async refrescar(event: any) {
    this.personaService.obtenerPersonas().subscribe({
      next: (personas) => {
        this.personas = personas;
        this.personasFiltradas = personas;
        event.target.complete();
      },
      error: async (error) => {
        event.target.complete();
        await this.mostrarError('Error al refrescar', error.message);
      }
    });
  }

  // Función para trackBy en ngFor (mejora el rendimiento)
  trackByPersonaId(index: number, persona: Persona): number {
    return persona.idPersona || index;
  }

  // Mostrar mensaje de éxito
  private async mostrarExito(mensaje: string) {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 3000,
      color: 'success',
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

  // Mostrar mensaje de error
  private async mostrarError(titulo: string, mensaje: string) {
    const alert = await this.alertController.create({
      header: titulo,
      message: mensaje,
      buttons: ['OK']
    });
    await alert.present();
  }
}
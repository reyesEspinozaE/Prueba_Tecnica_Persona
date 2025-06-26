import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingController, ToastController, AlertController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { 
  IonHeader, IonToolbar, IonTitle, IonContent, IonBackButton, IonButtons,
  IonList, IonItem, IonLabel, IonInput, IonTextarea, IonButton, IonIcon,
  IonGrid, IonRow, IonCol, IonNote, IonText, IonDatetime, IonModal, IonDatetimeButton
} from '@ionic/angular/standalone';
import { PersonaService, Persona } from '../services/personas.service';

@Component({
  selector: 'app-formulario-persona',
  templateUrl: './formulario-persona.page.html',
  styleUrls: ['./formulario-persona.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonHeader, IonToolbar, IonTitle, IonContent, IonBackButton, IonButtons,
    IonList, IonItem, IonLabel, IonInput, IonTextarea, IonButton, IonIcon,
    IonGrid, IonRow, IonCol, IonNote, IonText, IonDatetime, IonModal, IonDatetimeButton
  ]
})
export class FormularioPersonaPage implements OnInit {
  formularioPersona!: FormGroup;
  esEdicion: boolean = false;
  personaId?: number;
  titulo: string = 'Nueva Persona';
  fechaMaxima!: string;
  fechaMinima!: string;

  constructor(
    private formBuilder: FormBuilder,
    private personaService: PersonaService,
    private route: ActivatedRoute,
    private router: Router,
    private loadingController: LoadingController,
    private toastController: ToastController,
    private alertController: AlertController
  ) {
    this.inicializarFormulario();
    this.configurarFechas();
  }

  ngOnInit() {
    // Verificar si estamos editando una persona existente
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.personaId = parseInt(id, 10);
      this.esEdicion = true;
      this.titulo = 'Editar Persona';
      this.cargarPersona();
    }
  }

  private configurarFechas() {
    const hoy = new Date();
    this.fechaMaxima = hoy.toISOString();
    
    const fechaMin = new Date();
    fechaMin.setFullYear(hoy.getFullYear() - 120);
    this.fechaMinima = fechaMin.toISOString();
  }

  private inicializarFormulario() {
    this.formularioPersona = this.formBuilder.group({
      nombre: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      apellido: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      fechaNacimiento: ['', [Validators.required, this.validadorFechaNacimiento]],
      email: ['', [Validators.required, Validators.email]],
      telefono: ['', [Validators.pattern(/^[0-9+\-\s()]+$/)]],
      direccion: ['', [Validators.maxLength(200)]]
    });
  }

  // Validador personalizado para fecha de nacimiento
  private validadorFechaNacimiento(control: any) {
    if (!control.value) return null;
    
    const fechaNacimiento = new Date(control.value);
    const hoy = new Date();
    const fechaMinima = new Date();
    fechaMinima.setFullYear(hoy.getFullYear() - 120); // Máximo 120 años

    if (fechaNacimiento > hoy) {
      return { fechaFutura: true };
    }
    
    if (fechaNacimiento < fechaMinima) {
      return { fechaMuyAntigua: true };
    }
    
    return null;
  }

  private async cargarPersona() {
    const loading = await this.loadingController.create({
      message: 'Cargando datos de la persona...',
      spinner: 'crescent'
    });
    await loading.present();

    this.personaService.obtenerPersonaPorId(this.personaId!).subscribe({
      next: (persona) => {
        this.llenarFormulario(persona);
        loading.dismiss();
      },
      error: async (error) => {
        loading.dismiss();
        await this.mostrarError('Error al cargar persona', error.message);
        this.router.navigate(['/lista-personas']);
      }
    });
  }

  private llenarFormulario(persona: Persona) {
    this.formularioPersona.patchValue({
      nombre: persona.nombre,
      apellido: persona.apellido,
      fechaNacimiento: persona.fechaNacimiento,
      email: persona.email,
      telefono: persona.telefono || '',
      direccion: persona.direccion || ''
    });
  }

  async guardar() {
    if (this.formularioPersona.valid) {
      const loading = await this.loadingController.create({
        message: this.esEdicion ? 'Actualizando persona...' : 'Creando persona...',
        spinner: 'crescent'
      });
      await loading.present();

      const persona: Persona = this.formularioPersona.value;

      const operacion = this.esEdicion 
        ? this.personaService.actualizarPersona(this.personaId!, persona)
        : this.personaService.crearPersona(persona);

      operacion.subscribe({
        next: async () => {
          loading.dismiss();
          const mensaje = this.esEdicion ? 'Persona actualizada con éxito' : 'Persona creada con éxito';
          await this.mostrarExito(mensaje);
          this.router.navigate(['/lista-personas']);
        },
        error: async (error) => {
          loading.dismiss();
          await this.mostrarError('Error al guardar', error.message);
        }
      });
    } else {
      await this.mostrarErroresValidacion();
    }
  }

  async cancelar() {
    if (this.formularioPersona.dirty) {
      const alert = await this.alertController.create({
        header: 'Confirmar cancelación',
        message: 'Tienes cambios sin guardar. ¿Estás seguro de que quieres salir?',
        buttons: [
          {
            text: 'Continuar editando',
            role: 'cancel'
          },
          {
            text: 'Salir sin guardar',
            role: 'destructive',
            handler: () => {
              this.router.navigate(['/lista-personas']);
            }
          }
        ]
      });
      await alert.present();
    } else {
      this.router.navigate(['/lista-personas']);
    }
  }

  // Obtener mensaje de error para un campo específico
  obtenerMensajeError(campo: string): string {
    const control = this.formularioPersona.get(campo);
    if (!control || !control.errors || !control.touched) return '';

    const errores = control.errors;

    if (errores['required']) return `${this.obtenerNombreCampo(campo)} es obligatorio.`;
    if (errores['email']) return 'El formato del email no es válido.';
    if (errores['minlength']) return `${this.obtenerNombreCampo(campo)} debe tener al menos ${errores['minlength'].requiredLength} caracteres.`;
    if (errores['maxlength']) return `${this.obtenerNombreCampo(campo)} no puede tener más de ${errores['maxlength'].requiredLength} caracteres.`;
    if (errores['pattern']) return `${this.obtenerNombreCampo(campo)} tiene un formato inválido.`;
    if (errores['fechaFutura']) return 'La fecha de nacimiento no puede ser futura.';
    if (errores['fechaMuyAntigua']) return 'La fecha de nacimiento no puede ser mayor a 120 años.';

    return 'Campo inválido.';
  }

  private obtenerNombreCampo(campo: string): string {
    const nombres: { [key: string]: string } = {
      'nombre': 'El nombre',
      'apellido': 'El apellido',
      'fechaNacimiento': 'La fecha de nacimiento',
      'email': 'El email',
      'telefono': 'El teléfono',
      'direccion': 'La dirección'
    };
    return nombres[campo] || 'El campo';
  }

  // Verificar si un campo tiene errores
  tieneError(campo: string): boolean {
    const control = this.formularioPersona.get(campo);
    return !!(control && control.errors && control.touched);
  }

  private async mostrarErroresValidacion() {
    const errores: string[] = [];
    
    Object.keys(this.formularioPersona.controls).forEach(campo => {
      const mensaje = this.obtenerMensajeError(campo);
      if (mensaje) {
        errores.push(mensaje);
      }
    });

    const alert = await this.alertController.create({
      header: 'Errores de validación',
      message: errores.join('<br>'),
      buttons: ['OK']
    });
    await alert.present();
  }

  private async mostrarExito(mensaje: string) {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 3000,
      color: 'success',
      position: 'top'
    });
    await toast.present();
  }

  private async mostrarError(titulo: string, mensaje: string) {
    const alert = await this.alertController.create({
      header: titulo,
      message: mensaje,
      buttons: ['OK']
    });
    await alert.present();
  }
}
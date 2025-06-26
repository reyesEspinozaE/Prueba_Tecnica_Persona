import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  LoadingController,
  ToastController,
  AlertController,
} from '@ionic/angular';
import { CommonModule } from '@angular/common';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonBackButton,
  IonButtons,
  IonList,
  IonItem,
  IonLabel,
  IonInput,
  IonTextarea,
  IonButton,
  IonIcon,
  IonGrid,
  IonRow,
  IonCol,
  IonNote,
  IonText,
  IonDatetime,
  IonModal,
  IonDatetimeButton,
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
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonBackButton,
    IonButtons,
    IonList,
    IonItem,
    IonLabel,
    IonInput,
    IonTextarea,
    IonButton,
    IonIcon,
    IonGrid,
    IonRow,
    IonCol,
    IonNote,
    IonText,
    IonDatetime,
    IonModal,
    IonDatetimeButton,
  ],
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
      nombre: [
        '',
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(50),
          this.validadorTextoAlfabetico,
        ],
      ],
      apellido: [
        '',
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(50),
          this.validadorTextoAlfabetico,
        ],
      ],
      fechaNacimiento: [
        '',
        [Validators.required, this.validadorFechaNacimiento],
      ],
      email: ['', [Validators.required, Validators.email]],
      telefono: ['', [this.validadorTelefono]],
      direccion: ['', [Validators.maxLength(200)]],
    });
  }

  // Método para validar email en tiempo real
  async validarEmailEnTiempoReal() {
    const emailControl = this.formularioPersona.get('email');

    if (emailControl && emailControl.value && emailControl.invalid) {
      const valorEmail = emailControl.value;

      // Verificar si tiene errores específicos
      if (emailControl.errors?.['email']) {
        await this.mostrarAlertaEmailInvalido(valorEmail);

        // Opcional: limpiar el campo o mantener el foco
        // emailControl.setValue('');
        // document.querySelector('ion-input[formControlName="email"] input')?.focus();
      }
    }
  }

  // Método para mostrar la alerta de email inválido
  private async mostrarAlertaEmailInvalido(emailIngresado: string) {
    const alert = await this.alertController.create({
      header: '⚠️ Email Inválido',
      message: `El email "${emailIngresado}" no tiene un formato válido. Debe tener el formato: ejemplo@correo.com`,
      buttons: [
        {
          text: 'Entendido',
          role: 'cancel',
          handler: () => {
            // Opcional: enfocar nuevamente el campo de email
            setTimeout(() => {
              const emailInput = document.querySelector(
                'ion-input[formControlName="email"]'
              ) as any;
              if (emailInput) {
                emailInput.setFocus();
              }
            }, 100);
          },
        },
      ],
      cssClass: 'custom-alert',
    });

    await alert.present();
  }

  // 👇 Validador personalizado para teléfono
  private validadorTelefono(control: any) {
    if (!control.value) return null; // Permitir campo vacío (no es requerido)

    const telefono = control.value.toString();

    // Verificar solo números
    if (!/^\d+$/.test(telefono)) {
      return { soloNumeros: true };
    }

    // Verificar longitud exacta de 8 dígitos
    if (telefono.length !== 8) {
      return { longitudIncorrecta: true };
    }

    return null;
  }

  // Método para validar teléfono mientras escribe (prevenir caracteres no numéricos)
  validarTelefonoEnTiempoReal(event: any) {
    const value = event.detail.value;

    // Remover cualquier carácter que no sea número
    const soloNumeros = value.replace(/[^0-9]/g, '');

    // Limitar a máximo 8 dígitos
    const telefonoLimitado = soloNumeros.substring(0, 8);

    // Actualizar el valor del campo solo si es diferente
    if (value !== telefonoLimitado) {
      this.formularioPersona
        .get('telefono')
        ?.setValue(telefonoLimitado, { emitEvent: false });
    }
  }

  // Método para validar teléfono cuando sale del campo
  async validarTelefonoAlSalir() {
    const telefonoControl = this.formularioPersona.get('telefono');

    if (telefonoControl && telefonoControl.value && telefonoControl.invalid) {
      const valorTelefono = telefonoControl.value;
      const errores = telefonoControl.errors;

      if (errores?.['soloNumeros']) {
        await this.mostrarAlertaTelefonoInvalido(valorTelefono, 'caracteres');
      } else if (errores?.['longitudIncorrecta']) {
        await this.mostrarAlertaTelefonoInvalido(valorTelefono, 'longitud');
      }
    }
  }

  // Método para mostrar la alerta de teléfono inválido
  private async mostrarAlertaTelefonoInvalido(
    telefonoIngresado: string,
    tipoError: 'caracteres' | 'longitud'
  ) {
    let mensaje = '';

    if (tipoError === 'caracteres') {
      mensaje = `El teléfono "${telefonoIngresado}" contiene caracteres no válidos. Solo se permiten números (0-9).`;
    } else if (tipoError === 'longitud') {
      const longitud = telefonoIngresado.length;
      mensaje = `El teléfono "${telefonoIngresado}" tiene ${longitud} dígito${
        longitud !== 1 ? 's' : ''
      }. Debe tener exactamente 8 dígitos para línea fija o móvil.`;
    }

    const alert = await this.alertController.create({
      header: '📞 Teléfono Inválido',
      message: mensaje,
      buttons: [
        {
          text: 'Entendido',
          role: 'cancel',
          handler: () => {
            // Enfocar nuevamente el campo de teléfono
            setTimeout(() => {
              const telefonoInput = document.querySelector(
                'ion-input[formControlName="telefono"]'
              ) as any;
              if (telefonoInput) {
                telefonoInput.setFocus();
              }
            }, 100);
          },
        },
      ],
      cssClass: 'custom-alert',
    });

    await alert.present();
  }

  // Validador personalizado para texto alfabético
  private validadorTextoAlfabetico(control: any) {
    if (!control.value) return null;

    const texto = control.value.toString().trim();

    // Permitir letras, espacios, acentos y caracteres especiales del español
    if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/.test(texto)) {
      return { soloLetras: true };
    }

    // Verificar que no sean solo espacios
    if (texto.length === 0) {
      return { soloEspacios: true };
    }

    return null;
  }

  // Método para validar texto mientras escribe (prevenir números y caracteres especiales)
  validarTextoEnTiempoReal(event: any, campo: string) {
    const value = event.detail.value;

    // Permitir solo letras, espacios y caracteres especiales del español
    const soloLetras = value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]/g, '');

    // Evitar múltiples espacios consecutivos
    const textoLimpio = soloLetras.replace(/\s+/g, ' ');

    // Capitalizar primera letra de cada palabra
    const textoCapitalizado = this.capitalizarTexto(textoLimpio);

    // Actualizar el valor del campo solo si es diferente
    if (value !== textoCapitalizado) {
      this.formularioPersona
        .get(campo)
        ?.setValue(textoCapitalizado, { emitEvent: false });
    }
  }

  // Método para capitalizar texto (primera letra de cada palabra)
  private capitalizarTexto(texto: string): string {
    return texto.replace(/\b\w/g, (char) => char.toUpperCase());
  }

  // Método para validar texto cuando sale del campo
  async validarTextoAlSalir(campo: string) {
    const control = this.formularioPersona.get(campo);

    if (control && control.value && control.invalid) {
      const valorTexto = control.value;
      const errores = control.errors;

      if (errores?.['soloLetras']) {
        await this.mostrarAlertaTextoInvalido(valorTexto, campo, 'caracteres');
      } else if (errores?.['soloEspacios']) {
        await this.mostrarAlertaTextoInvalido(valorTexto, campo, 'espacios');
      }
    }
  }

  // Método para mostrar la alerta de texto inválido
  private async mostrarAlertaTextoInvalido(
    textoIngresado: string,
    campo: string,
    tipoError: 'caracteres' | 'espacios'
  ) {
    let mensaje = '';
    const nombreCampo = this.obtenerNombreCampo(campo).toLowerCase();

    if (tipoError === 'caracteres') {
      mensaje = `${nombreCampo} "${textoIngresado}" contiene caracteres no válidos. Solo se permiten letras, espacios y acentos.`;
    } else if (tipoError === 'espacios') {
      mensaje = `${nombreCampo} no puede contener solo espacios. Debe incluir al menos una letra.`;
    }

    const alert = await this.alertController.create({
      header: `✏️ ${this.obtenerNombreCampo(campo)} Inválido`,
      message: mensaje,
      buttons: [
        {
          text: 'Entendido',
          role: 'cancel',
          handler: () => {
            // Enfocar nuevamente el campo
            setTimeout(() => {
              const input = document.querySelector(
                `ion-input[formControlName="${campo}"]`
              ) as any;
              if (input) {
                input.setFocus();
              }
            }, 100);
          },
        },
      ],
      cssClass: 'custom-alert',
    });

    await alert.present();
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
      spinner: 'crescent',
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
      },
    });
  }

  private llenarFormulario(persona: Persona) {
    this.formularioPersona.patchValue({
      nombre: persona.nombre,
      apellido: persona.apellido,
      fechaNacimiento: persona.fechaNacimiento,
      email: persona.email,
      telefono: persona.telefono || '',
      direccion: persona.direccion || '',
    });
  }

  async guardar() {
    if (this.formularioPersona.valid) {
      const loading = await this.loadingController.create({
        message: this.esEdicion
          ? 'Actualizando persona...'
          : 'Creando persona...',
        spinner: 'crescent',
      });
      await loading.present();

      const persona: Persona = this.formularioPersona.value;

      const operacion = this.esEdicion
        ? this.personaService.actualizarPersona(this.personaId!, persona)
        : this.personaService.crearPersona(persona);

      operacion.subscribe({
        next: async () => {
          loading.dismiss();
          const mensaje = this.esEdicion
            ? 'Persona actualizada con éxito'
            : 'Persona creada con éxito';
          await this.mostrarExito(mensaje);
          this.router.navigate(['/lista-personas']);
        },
        error: async (error) => {
          loading.dismiss();
          await this.mostrarError('Error al guardar', error.message);
        },
      });
    } else {
      await this.mostrarErroresValidacion();
    }
  }

  async cancelar() {
    if (this.formularioPersona.dirty) {
      const alert = await this.alertController.create({
        header: 'Confirmar cancelación',
        message:
          'Tienes cambios sin guardar. ¿Estás seguro de que quieres salir?',
        buttons: [
          {
            text: 'Continuar editando',
            role: 'cancel',
          },
          {
            text: 'Salir sin guardar',
            role: 'destructive',
            handler: () => {
              this.router.navigate(['/lista-personas']);
            },
          },
        ],
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

    if (errores['required'])
      return `${this.obtenerNombreCampo(campo)} es obligatorio.`;
    if (errores['email']) return 'El formato del email no es válido.';
    if (errores['minlength'])
      return `${this.obtenerNombreCampo(campo)} debe tener al menos ${
        errores['minlength'].requiredLength
      } caracteres.`;
    if (errores['maxlength'])
      return `${this.obtenerNombreCampo(campo)} no puede tener más de ${
        errores['maxlength'].requiredLength
      } caracteres.`;
    if (errores['pattern'])
      return `${this.obtenerNombreCampo(campo)} tiene un formato inválido.`;
    if (errores['fechaFutura'])
      return 'La fecha de nacimiento no puede ser futura.';
    if (errores['fechaMuyAntigua'])
      return 'La fecha de nacimiento no puede ser mayor a 120 años.';
    if (errores['soloNumeros'])
      return 'El teléfono solo puede contener números.';
    if (errores['longitudIncorrecta'])
      return 'El teléfono debe tener exactamente 8 dígitos.';
    if (errores['soloLetras'])
      return `${this.obtenerNombreCampo(
        campo
      )} solo puede contener letras y espacios.`;
    if (errores['soloEspacios'])
      return `${this.obtenerNombreCampo(
        campo
      )} no puede estar vacío o contener solo espacios.`;

    return 'Campo inválido.';
  }

  private obtenerNombreCampo(campo: string): string {
    const nombres: { [key: string]: string } = {
      nombre: 'El nombre',
      apellido: 'El apellido',
      fechaNacimiento: 'La fecha de nacimiento',
      email: 'El email',
      telefono: 'El teléfono',
      direccion: 'La dirección',
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

    Object.keys(this.formularioPersona.controls).forEach((campo) => {
      const mensaje = this.obtenerMensajeError(campo);
      if (mensaje) {
        errores.push(mensaje);
      }
    });

    const alert = await this.alertController.create({
      header: 'Errores de validación',
      message: errores.join('<br>'),
      buttons: ['OK'],
    });
    await alert.present();
  }

  private async mostrarExito(mensaje: string) {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 3000,
      color: 'success',
      position: 'top',
    });
    await toast.present();
  }

  private async mostrarError(titulo: string, mensaje: string) {
    const alert = await this.alertController.create({
      header: titulo,
      message: mensaje,
      buttons: ['OK'],
    });
    await alert.present();
  }
}

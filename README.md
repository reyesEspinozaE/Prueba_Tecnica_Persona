Prueba Técnica Persona - App Móvil

Aplicación móvil desarrollada en Ionic + Angular + TypeScript para la gestión de personas, con interfaz intuitiva y conexión a API REST.

🚀 Características
- Gestión completa de personas: Crear, editar, eliminar y visualizar
- Búsqueda avanzada: Filtrado por nombre, apellido o email
- Interfaz responsive: Optimizada para dispositivos móviles y web
- Validaciones de formularios: Experiencia de usuario mejorada
- Integración con API: Conexión segura con backend .NET
- Navegación intuitiva: UX/UI moderna y fluida
- Manejo de errores: Feedback claro al usuario

🛠️ Tecnologías utilizadas
- Ionic 7
- Angular 16+
- TypeScript
- HTML5 / CSS3

📋 Prerrequisitos
- Node.js 16 o superior
- npm o yarn
- Ionic CLI
- Angular CLI

⚙️ Instalación y configuración

1. Clonar el repositorio
- git clone https://github.com/reyesEspinozaE/Prueba_Tecnica_Persona.git
- cd Prueba_Tecnica_Persona

3. Instalar dependencias

npm install

5. Configurar variables de entorno
   
Editar el archivo src/environments/environment.ts:

typescript
- export const environment = {
  production: false,
  apiUrl: 'https://localhost:7163/api',
  apiToken: 'KvoVsjSoPGH9ojSB3x3QE4BVWl4m6unW6VTwpPoXZI'
};

4. Ejecutar en modo desarrollo

-ionic serve

La aplicación estará disponible en: http://localhost:8100

🎯 Funcionalidades principales

📋 Lista de personas
- Visualización de todas las personas registradas
- Ordenamiento por nombre
- Acciones rápidas (editar/eliminar)
- Pull-to-refresh para actualizar datos
- Puedes hacer un slide hacia la izquierda para ver las opciones disponibles (actualizar, eliminar)

🔍 Búsqueda y filtros
- Búsqueda por nombre, apellido o email
- Filtros en tiempo real
- Resultados instantáneos

➕ Crear persona

- Formulario completo con validaciones
- Campos requeridos y opcionales
- Validación de email y fechas

Feedback de éxito/error
✏️ Editar persona
- Precarga de datos existentes
- Validaciones en tiempo real

Confirmación de cambios
🗑️ Eliminar persona

- Confirmación antes de eliminar
- Feedback de operación exitosa

🎨 Características de UI/UX

- Diseño Material: Siguiendo las guías de Ionic
- Responsive: Adaptable a diferentes tamaños de pantalla
- Loading states: Indicadores de carga durante peticiones
- Error handling: Mensajes claros de error
- Confirmaciones: Diálogos para acciones importantes
- Navegación intuitiva: Botones de acción claros

🔧 Servicios implementados

- PersonaService
- Gestión completa de personas
- Integración con API REST
- Manejo de errores HTTP
- Transformación de datos
- LoadingService
- Control centralizado de loading
- Mejor experiencia de usuario
- AuthInterceptor
- Inyección automática de token
- Headers de autenticación

🔍 Validaciones de formulario

- Nombre: Requerido, máximo 100 caracteres, únicamente valores alfabeticos, no se permiten espacios en blanco
- Apellido: Requerido, máximo 100 caracteres, únicamente valores alfabeticos, no se permiten espacios en blanco
- Email: Requerido, formato válido, único
- Fecha de nacimiento: Requerida, mayor de 18 años
- Teléfono: Opcional, formato válido, únicamente valores numéricos
- Dirección: Opcional, máximo 500 caracteres
  
🌐 Integración con API
La aplicación se conecta a la API PersonaAPI mediante:

- Base URL: Configurable en environment
- Autenticación: Bearer token automático

Endpoints utilizados:
- GET /api/personas - Lista todas las personas
- GET /api/personas/{id} - Obtiene una persona
- POST /api/personas - Crea una persona
- PUT /api/personas/{id} - Actualiza una persona
- DELETE /api/personas/{id} - Elimina una persona
- GET /api/personas/buscar - Busca personas

📦 Dependencias principales
- json
{
  "@ionic/angular": "^7.0.0",
  "@angular/core": "^16.0.0",
  "@angular/common": "^16.0.0",
  "@angular/forms": "^16.0.0",
  "@capacitor/core": "^5.0.0",
  "rxjs": "^7.5.0"
}

Este proyecto es para fines de evaluación técnica.

👨‍💻 Autor
- Everth Reyes Espinoza

- GitHub: @reyesEspinozaE
- Desarrollado como parte de una prueba técnica - 2025

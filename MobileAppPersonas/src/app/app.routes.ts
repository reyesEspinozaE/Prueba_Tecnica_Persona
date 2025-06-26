import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/lista-personas',
    pathMatch: 'full'
  },
  {
    path: 'lista-personas',
    loadComponent: () => import('./lista-persona/lista-persona.page').then(m => m.ListaPersonasPage)
  },
  {
    path: 'formulario-persona',
    loadComponent: () => import('./formulario-persona/formulario-persona.page').then(m => m.FormularioPersonaPage)
  },
  {
    path: 'formulario-persona/:id',
    loadComponent: () => import('./formulario-persona/formulario-persona.page').then(m => m.FormularioPersonaPage)
  },
  {
    path: '**',
    redirectTo: '/lista-personas'
  }
];
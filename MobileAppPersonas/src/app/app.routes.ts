import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: 'main', loadComponent: () => import('./main/main.page').then(m => m.MainPage) },
  {
    path: 'persona-list',
    loadComponent: () => import('./persona-list/persona-list.page').then( m => m.PersonaListPage)
  }
];

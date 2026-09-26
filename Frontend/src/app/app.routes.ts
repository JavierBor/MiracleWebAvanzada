import { Routes } from '@angular/router';
import { AdminBaneoComponent } from './pages/admin-baneo/admin-baneo.component';
import { AdminMenuComponent } from './pages/admin-menu/admin-menu.component';
import { AdminAlertasComponent } from './pages/admin-alertas/admin-alertas.component';
export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/home/home.page').then((m) => m.HomePage),
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./pages/login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./pages/register/register.component').then((m) => m.RegisterComponent),
  },
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./pages/dashboard/dashboard.component').then((m) => m.DashboardComponent),
  },
  {
    path: 'menuIngI',
    loadComponent: () =>
      import('./pages/menuIngI/menuIngI.component').then((m) => m.MenuIngIComponent),
  },
  {
    path: 'menuIngII',
    loadComponent: () =>
      import('./pages/menuIngII/menuIngII.component').then((m) => m.MenuIngIIComponent),
  },
  {
    path: 'menuIngIII',
    loadComponent: () =>
      import('./pages/menuIngIII/menuIngIII.component').then((m) => m.MenuIngIIIComponent),
  },
  {
    path: 'menuIngIV',
    loadComponent: () =>
      import('./pages/menuIngIV/menuIngIV.component').then((m) => m.MenuIngIVComponent),
  },
  {
    path: 'verb-transformer',
    loadComponent: () =>
      import('./pages/verb-transformer/verb-transformer.component').then((m) => m.VerbTransformerComponent),
  },
  {
    path: 'foro',
    loadComponent: () =>
      import('./pages/foro/foro.component').then((m) => m.ForoComponent),
  },
  
  {
      path: 'admin',
      component: AdminMenuComponent
    },
  { path: 'admin/alertas', component: AdminAlertasComponent },
  { path: 'admin/usuarios', component: AdminBaneoComponent },

];
import { Routes } from '@angular/router';
import { AdminBaneoComponent } from './pages/admin-baneo/admin-baneo.component';
import { AdminMenuComponent } from './pages/admin-menu/admin-menu.component';
import { AdminAlertasComponent } from './pages/admin-alertas/admin-alertas.component';
import { authGuard } from './guards/auth.guard';
import { adminGuard } from './guards/admin.guard';

export const routes: Routes = [
  // --- RUTAS PÚBLICAS ---
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

  // --- RUTAS PRIVADAS (Requieren sesión iniciada) ---
  {
    path: 'dashboard',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/dashboard/dashboard.component').then((m) => m.DashboardComponent),
  },
  {
    path: 'menuIngI',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/menuIngI/menuIngI.component').then((m) => m.MenuIngIComponent),
  },
  {
    path: 'menuIngII',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/menuIngII/menuIngII.component').then((m) => m.MenuIngIIComponent),
  },
  {
    path: 'menuIngIII',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/menuIngIII/menuIngIII.component').then((m) => m.MenuIngIIIComponent),
  },
  {
    path: 'menuIngIV',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/menuIngIV/menuIngIV.component').then((m) => m.MenuIngIVComponent),
  },
  {
    path: 'verb-transformer',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/verb-transformer/verb-transformer.component').then((m) => m.VerbTransformerComponent),
  },
  {
    path: 'foro',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/foro/foro.component').then((m) => m.ForoComponent),
  },
  {
    path: 'juego-vocabulario',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/juego-vocabulario/juego-vocabulario.component').then(
        (m) => m.JuegoVocabularioComponent
      ),
  },
  {
    path: 'the-3-buttons',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/the-3-buttons/the-3-buttons.component').then((m) => m.The3ButtonsComponent),
  },
  {
    path: 'passive-selector',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/passive-selector/passive-selector.component').then((m) => m.PassiveSelectorComponent),
  },

  // --- RUTAS ADMINISTRATIVAS (Requieren sesión + rol ADMIN) ---
  {
    path: 'admin',
    canActivate: [authGuard, adminGuard],
    component: AdminMenuComponent,
  },
  {
    path: 'admin/alertas',
    canActivate: [authGuard, adminGuard],
    component: AdminAlertasComponent,
  },
  {
    path: 'admin/usuarios',
    canActivate: [authGuard, adminGuard],
    component: AdminBaneoComponent,
  },

  // --- REDIRECCIÓN POR DEFECTO ---
  {
    path: '**',
    redirectTo: '',
  },
];
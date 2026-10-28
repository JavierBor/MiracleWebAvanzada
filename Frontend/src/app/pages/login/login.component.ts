import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import {
  IonHeader,
  IonContent,
  IonGrid,
  IonRow,
  IonCol,
  IonInput,
  IonIcon,
} from '@ionic/angular';

import { addIcons } from 'ionicons';
import { personCircleOutline, chevronDownOutline, arrowBackOutline } from 'ionicons/icons';
import { HeaderComponent } from '../../components/header/header.component';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    IonHeader,
    IonContent,
    IonGrid,
    IonRow,
    IonCol,
    IonInput,
    IonIcon,
    HeaderComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  errorMsg = '';
  cargando = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    addIcons({ personCircleOutline, chevronDownOutline, arrowBackOutline });
  }

  ngOnInit() {
    this.loginForm = this.fb.group({
      correo: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  iniciarSesion() {
    this.errorMsg = '';

    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      this.errorMsg = 'Por favor ingresa un correo válido y una contraseña de al menos 6 caracteres.';
      return;
    }

    this.cargando = true;
    const { correo, password } = this.loginForm.value;

    this.authService.login({ correo, contrasena: password }).subscribe({
      next: (res: any) => {
        this.cargando = false;
        console.log('Login exitoso:', res);

        // 1. Guardar el Token JWT
        if (res.access_token) {
          localStorage.setItem('access_token', res.access_token);
        }

        // 2. Guardar los datos del usuario (para que HeaderComponent reconozca el rol)
        if (res.usuario) {
          localStorage.setItem('user', JSON.stringify(res.usuario));
        }

        // 3. Limpiar cualquier modo admin previo para que inicie en vista de usuario común
        localStorage.removeItem('miracle_admin_mode');

        // 4. TODOS los usuarios van directo al Dashboard
        this.router.navigate(['/dashboard']);
      },
      error: (err: any) => {
        this.cargando = false;
        console.error('Error en login:', err);
        if (err.status === 0) {
          this.errorMsg = 'No se pudo conectar con el servidor (verifica que el backend esté corriendo en el puerto 3000).';
        } else {
          const msg = err.error?.message;
          this.errorMsg = Array.isArray(msg) ? msg[0] : (msg || 'Correo o contraseña incorrectos');
        }
      }
    });
  }
}
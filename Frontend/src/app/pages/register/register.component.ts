import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import {
  IonHeader,
  IonContent,
  IonGrid,
  IonRow,
  IonCol,
  IonInput,
  IonCheckbox,
  IonIcon
} from '@ionic/angular';

import { addIcons } from 'ionicons';
import { personCircleOutline, chevronDownOutline, eyeOutline, eyeOffOutline } from 'ionicons/icons';
import { HeaderComponent } from '../../components/header/header.component';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
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
    IonCheckbox,
    IonIcon,
    HeaderComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class RegisterComponent implements OnInit {
  registroForm!: FormGroup;
  showPassword = false;
  showConfirmPassword = false;
  errorMsg = '';
  cargando = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {
    addIcons({ personCircleOutline, chevronDownOutline, eyeOutline, eyeOffOutline });
  }

  ngOnInit() {
    this.registroForm = this.fb.group({
      correo: ['', [Validators.required, Validators.email]],
      rut: ['', [Validators.required, Validators.pattern(/^[0-9]+-[0-9kK]{1}$/)]],
      username: ['', [Validators.required, Validators.minLength(3)]],
      region: ['', Validators.required],
      comuna: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
      terminos: [false, Validators.requiredTrue]
    }, { validators: this.passwordsMatchValidator });
  }

  passwordsMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password')?.value;
    const confirm = control.get('confirmPassword')?.value;
    return password === confirm ? null : { passwordsMismatch: true };
  }

  registrar() {
    if (this.registroForm.valid) {
      this.errorMsg = '';
      this.cargando = true;

      const { correo, password } = this.registroForm.value;

      this.authService.register({ correo, contrasena: password }).subscribe({
        next: (res: any) => {
          this.cargando = false;
          console.log('Usuario registrado en BD:', res);
          this.router.navigate(['/dashboard']);
        },
        error: (err: any) => {
          this.cargando = false;
          const msg = err.error?.message;
          this.errorMsg = Array.isArray(msg) ? msg[0] : (msg || 'No se pudo completar el registro');
        }
      });
    } else {
      this.registroForm.markAllAsTouched();
    }
  }
}
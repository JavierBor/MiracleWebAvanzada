import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router, RouterLink } from '@angular/router'; // 1. Se agrega Router aquí

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

  // 2. Se inyecta private router: Router en el constructor
  constructor(
    private fb: FormBuilder,
    private router: Router
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
      console.log('Formulario válido:', this.registroForm.value);
      // 3. Redirige al dashboard solo si todo el formulario es válido
      this.router.navigate(['/dashboard']);
    } else {
      // Marca todos los campos para mostrar los errores en pantalla
      this.registroForm.markAllAsTouched();
    }
  }
}
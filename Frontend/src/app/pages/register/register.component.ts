import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { RouterLink } from '@angular/router';

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
    IonIcon
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class RegisterComponent implements OnInit {
  registroForm!: FormGroup;
  showPassword = false;
  showConfirmPassword = false;

  constructor(private fb: FormBuilder) {
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
    } else {
      this.registroForm.markAllAsTouched();
    }
  }
}
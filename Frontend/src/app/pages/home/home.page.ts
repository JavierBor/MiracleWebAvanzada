import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import {
  IonHeader,
  IonToolbar,
  IonContent,
  IonButton,
  IonIcon
} from '@ionic/angular';
import { addIcons } from 'ionicons';
import { personCircleOutline, chevronDownOutline } from 'ionicons/icons';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    IonHeader,
    IonToolbar,
    IonContent,
    IonButton,
    IonIcon
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class HomePage {
  constructor() {
    addIcons({ personCircleOutline, chevronDownOutline });
  }
}
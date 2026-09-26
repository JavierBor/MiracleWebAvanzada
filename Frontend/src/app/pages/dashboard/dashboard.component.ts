import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

import {
  IonHeader,
  IonContent,
  IonGrid,
  IonRow,
  IonCol,
  IonIcon
} from '@ionic/angular';

import { addIcons } from 'ionicons';
import { personCircleOutline, chevronDownOutline, homeOutline } from 'ionicons/icons';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    IonHeader,
    IonContent,
    IonGrid,
    IonRow,
    IonCol,
    IonIcon
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class DashboardComponent {
  constructor() {
    addIcons({ personCircleOutline, chevronDownOutline, homeOutline });
  }
}
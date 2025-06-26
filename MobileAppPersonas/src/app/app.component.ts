import { Component } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { add, home, settings, person,
  peopleOutline, 
  chevronDownCircleOutline,
  addOutline,
  homeOutline,
  settingsOutline,
  close,
  save,
  createOutline,
  trash,
  trashOutline,
  callOutline,
  create,
 } from 'ionicons/icons';

@Component({
  selector: 'app-root',
  template: `
    <ion-app>
      <ion-router-outlet></ion-router-outlet>
    </ion-app>
  `,
  standalone: true,
  imports: [IonApp, IonRouterOutlet],
})
export class AppComponent {
  constructor() {
     this.registerIcons();
  }

   private registerIcons() {
    addIcons({
      'people-outline': peopleOutline,
      'chevron-down-circle-outline': chevronDownCircleOutline,
      'add-outline': addOutline,
      'home-outline': homeOutline,
      'settings-outline': settingsOutline,
      'add': add,
      'home': home,
      'settings': settings,
      'person': person,
      'close': close,
      'save': save,
      'create-outline': createOutline,
      'trash': trash,
      'trash-outline': trashOutline,
      'call-outline': callOutline,
      'create': create
    });
  }
}

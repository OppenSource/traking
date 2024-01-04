import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { HomePage } from './home.page';

import { HomePageRoutingModule } from './home-routing.module';
import { HeaderComponent } from '../components/Header/header/header.component';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, HomePageRoutingModule, TranslateModule],
  declarations: [HomePage, HeaderComponent],
  providers: [
    InAppBrowser,
    // ... other providers
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class HomePageModule {}

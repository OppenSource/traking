import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { LanguageService } from '../services/Languages/language.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  account: any;
  constructor(private auth: AuthService) {}

  ngOnInit(): void {
    this.fetchUserData();
  }

  async fetchUserData() {
    try {
      this.account = await this.auth.getData('account');
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  }
}

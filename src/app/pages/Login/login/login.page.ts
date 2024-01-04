import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NavController, ToastController } from '@ionic/angular';
import { PluginListenerHandle } from '@capacitor/core';
import { Subscription } from 'rxjs';
import { InternetService } from 'src/app/services/Internet/internet.service';
import { ToastService } from 'src/app/services/Toast/toast.service';
import { AuthService } from 'src/app/services/auth.service';
import { NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  networkStatus: any;
  networkListener: PluginListenerHandle | undefined;
  login: FormGroup | any;
  account: any = {
    username: '',
    password: '',
    collection: '',
  };
  internetStatusSubscription: Subscription | any;
  isConnected: any;
  data: any;
  key: any = 'account';
  userData: any;
  isLoginPage: boolean = false;

  constructor(
    public formBuilder: FormBuilder,
    private toast: ToastService,
    public navCtrl: NavController,
    public internet: InternetService,
    public auth: AuthService,
    private router: Router,
    private toastController: ToastController
  ) {}

  ngOnInit() {
    this.login = this.formBuilder.group({
      username: [
        '',
        [
          Validators.required,
          Validators.minLength(6),
          Validators.maxLength(20),
        ],
      ],
      password: ['', [Validators.required, Validators.maxLength(20)]],
      collection: ['', [Validators.required]],
    });

    this.internetStatusSubscription = this.internet
      .getStatusChangedObservable()
      .subscribe((isConnected: boolean) => {
        this.isConnected = isConnected;
        console.log(this.isConnected);
      });
  }

  get errorControl() {
    return this.login.controls;
  }

  async successLogin() {
    const toast = await this.toastController.create({
      message: 'Connexion établie avec succès',
      duration: 3000, // Durée en millisecondes
      icon: 'happy-outline',
      position: 'bottom', // Position du toast ('top', 'middle', 'bottom')
      color: 'primary',
      buttons: [
        {
          side: 'end',
          icon: 'close-circle-outline',
          handler: () => {
            console.log('Bouton pour fermer le toast cliqué');
            toast.dismiss(); // Cette ligne ferme le toast lorsque le bouton est cliqué
          },
        },
      ],
    });

    await toast.present();
  }

  async errorLogin() {
    const toast = await this.toastController.create({
      message: 'Connexion échouée',
      duration: 3000, // Durée en millisecondes
      icon: 'hand-right-outline',
      position: 'bottom', // Position du toast ('top', 'middle', 'bottom')
      color: 'danger',
      buttons: [
        {
          side: 'end',
          icon: 'close-circle-outline',
          handler: () => {
            console.log('Bouton pour fermer le toast cliqué');
            toast.dismiss(); // Cette ligne ferme le toast lorsque le bouton est cliqué
          },
        },
      ],
    });

    await toast.present();
  }

  submitForm = () => {
    if (this.login.valid) {
      this.account.username = this.login.value.username;
      this.account.password = this.login.value.password;
      this.account.collection = this.login.value.collection;
      console.log(this.account);

      this.fetchData(
        this.login.value.username,
        this.login.value.password,
        this.login.value.collection
      );
    } else {
      this.toast.presentToast();
      return console.log('');
    }
  };

  async fetchData(login: string, password: string, collectionItem: string) {
    try {
      const result = await (
        await this.auth.authentification(login, password, collectionItem)
      ).toPromise();
      this.data = result;

      if (this.data != '') {
        this.successLogin();
        this.data = this.data[0][0];
        this.data['account'] = collectionItem;
        this.removeUserData();
        this.saveUserData();
        this.fetchUserData();
        this.navCtrl.navigateForward('home');

        setTimeout(() => {
          location.reload();
        }, 2000);
      } else {
        this.errorLogin();
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  async fetchUserData() {
    try {
      this.userData = await this.auth.getData(this.key);
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  }

  async saveUserData() {
    try {
      await this.auth.saveData(this.key, this.data);
      console.log('User data saved successfully.');
    } catch (error) {
      console.error('Error saving user data:', error);
    }
  }

  removeUserData() {
    try {
      this.auth.removeData(this.key);
      console.log('User data removed successfully.');
    } catch (error) {
      console.error('Error removing user data:', error);
    }
  }
}

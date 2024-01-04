import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavController } from '@ionic/angular';
import { ToastService } from 'src/app/services/Toast/toast.service';

@Component({
  selector: 'app-forgot',
  templateUrl: './forgot.page.html',
  styleUrls: ['./forgot.page.scss'],
})
export class ForgotPage implements OnInit {
  forgot: FormGroup | any;
  account: any = {
    account: '',
  };

  constructor(
    public formBuilder: FormBuilder,
    private toast: ToastService,
    public navCtrl: NavController
  ) {}

  ngOnInit() {
    this.forgot = this.formBuilder.group({
      account: ['', [Validators.required]],
    });
  }

  get errorControl() {
    return this.forgot.controls;
  }

  submitForm = () => {
    if (this.forgot.valid) {
      this.account.account = this.forgot.value.account;
      setTimeout(() => {
        this.toast.successLogin();
        this.navCtrl.navigateForward('login');
      }, 1000);

      return false;
    } else {
      this.toast.presentToast();
      return console.log('');
    }
  };
}

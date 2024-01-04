import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { InternetService } from 'src/app/services/Internet/internet.service';
import { AlertController } from '@ionic/angular';
import { LoadingController } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { OtherFunctionsService } from 'src/app/services/Others/other-functions.service';
import { FireStoreRestServiceService } from 'src/app/services/FireStore/fire-store-rest-service.service';
import { UploadService } from 'src/app/services/upload/upload.service';
import { BarcodeScanner } from '@capacitor-community/barcode-scanner';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-student',
  templateUrl: './student.page.html',
  styleUrls: ['./student.page.scss'],
})
export class StudentPage implements OnInit {
  add: FormGroup | any;
  selected: string = 'ajouter';
  selected1: string = 'check';
  internetStatusSubscription: Subscription | any;
  isConnected: any;
  qrcodeText: string = 'Demander Qrcode';
  qrcodeVisibility: boolean = false;

  qrData: any;
  linkUrl: any;
  collectionnName: any = 'student';
  image: string | any;
  list: any[] = [];
  data: any[] = [];
  isReady: boolean | any;

  result: any;
  account: any;
  scanActive = false;

  constructor(
    public internet: InternetService,
    private alert: AlertController,
    private loading: LoadingController,
    public formBuilder: FormBuilder,
    public others: OtherFunctionsService,
    public upload: UploadService,
    private auth: AuthService,
    public api: FireStoreRestServiceService
  ) {}

  async ngOnInit() {
    this.account = await this.auth.getData('account');

    if (this.account.account === 'admin') {
      this.selected = 'ajouter';
      this.selected1 = 'new';
    } else if (this.account.account === 'driver') {
      this.selected = 'verifier';
      this.selected1 = 'check';
    } else if (this.account.account === 'student') {
      this.selected = 'qrcode';
      this.qrData = this.account;
      this.selected1 = 'check';
    }

    this.add = this.formBuilder.group({
      matricule: [
        '',
        [Validators.required, Validators.minLength(8), Validators.maxLength(9)],
      ],
      fullname: ['', [Validators.required, Validators.minLength(4)]],
      cycle: ['', [Validators.required]],
      level: ['', [Validators.required]],
      email: [
        '',
        [
          Validators.required,
          Validators.pattern('[a-z0-9._%+-]+@institutsaintjean+.org$'),
        ],
      ],
      phone: [
        '',
        [
          Validators.required,
          Validators.minLength(9),
          Validators.maxLength(9),
          Validators.pattern(/^6/),
        ],
      ],
    });

    this.internetStatusSubscription = this.internet
      .getStatusChangedObservable()
      .subscribe((isConnected: boolean) => {
        this.isConnected = isConnected;
        console.log(this.isConnected);
      });

    BarcodeScanner.prepare();
  }

  ngOnDestroy(): void {
    this.internetStatusSubscription.unsubscribe();
    BarcodeScanner.stopScan();
  }

  async save() {
    try {
      const object = {
        matricule: this.add.value.matricule,
        fullname: this.add.value.fullname,
        cycle: this.add.value.cycle,
        level: this.add.value.level,
        email: this.add.value.email,
        phone: this.add.value.phone,
        picture: this.linkUrl,
        login: '',
        password: '',
        createdAt: await this.others.getCurrentDate(),
        createdBy: '',
        updatedAt: '',
        updatedBy: '',
        beginPeriod: await this.others.getFirstMondayOfSecondWeekOfSeptember(),
        endPeriod: await this.others.addDaysToFirstMondayOfSecondWeek(),
      };

      const result = await this.api.actionAlert(
        object,
        this.collectionnName,
        this.add.valid,
        'save'
      );

      if (result) {
        this.add.reset();
        this.image = '';
        this.loadData();
      }
      // Utilisez le résultat si nécessaire
      console.log(result);
    } catch (error) {
      console.error("Erreur lors de l'appel à actionAlert :", error);
    }
  }

  async takePicture() {
    try {
      const result = await this.upload.readyToUploadFile();
      this.isReady = result.isReady;
      this.image = result.images;
      this.linkUrl = result.linkUrl;
      console.log(result);
    } catch (error) {
      console.error(
        'Erreur lors de la préparation du fichier pour le téléchargement :',
        error
      );
    }
  }

  async loadData() {
    try {
      const dataObservable = await (
        await this.api.getAllData(this.collectionnName)
      ).toPromise();

      if (dataObservable) {
        // Si dataObservable n'est pas undefined, assignez sa valeur à list
        this.data = dataObservable;
        this.list = dataObservable;
      } else {
        console.warn("Aucune donnée n'a été renvoyée.");
      }
    } catch (error) {
      console.error(
        "Une erreur s'est produite lors du chargement des données:",
        error
      );
    }
  }

  maskEmail(item: any) {
    return this.others.ReformatEmail(item);
  }

  async demanderQrcode() {
    const loading = await this.loading.create({
      message: 'Chargement en cours...',
    });

    await loading.present();
    try {
      if (!this.qrcodeVisibility) {
        this.qrcodeText = ' Masquer Qrcode';
        this.qrcodeVisibility = true;
      } else {
        this.qrcodeText = ' Demande Qrcode';
        this.qrcodeVisibility = false;
      }
    } catch (error) {
      console.error(error);
    } finally {
      // Dissimuler le chargement après 2 secondes
      setTimeout(async () => {
        await loading.dismiss();
      }, 2000);
    }
  }

  async startScanner() {
    const allowed = await this.checkPermission();
    if (allowed) {
      this.scanActive = true;
      const response = await BarcodeScanner.startScan();
      console.log(response);
      if (response.hasContent) {
        this.result = response.content;
        this.scanActive = false;
      }
    }
  }

  async checkPermission() {
    return new Promise(async (resolve, reject) => {
      const status = await BarcodeScanner.checkPermission({ force: true });
      if (status.granted) {
        resolve(true);
      } else if (status.denied) {
        const alert = await this.alert.create({
          header: 'Aucune Permission',
          message:
            "Veillez accepter l'accès a la caméra dans les paramètres de votre appreil",
          buttons: [
            {
              text: 'Réfuser',
              role: 'cancel',
            },
            {
              text: 'Paramètres',
              handler: () => {
                BarcodeScanner.openAppSettings();
                resolve(false);
              },
            },
          ],
        });
      } else {
        resolve(false);
      }
    });
  }

  async stopScan() {
    BarcodeScanner.stopScan();
    this.scanActive = false;
  }
}

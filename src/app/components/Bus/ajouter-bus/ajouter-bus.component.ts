import { Bus } from './../../../models/bus.model';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FireStoreRestServiceService } from 'src/app/services/FireStore/fire-store-rest-service.service';
import { OtherFunctionsService } from 'src/app/services/Others/other-functions.service';
import { UploadService } from 'src/app/services/upload/upload.service';
import { Geolocation } from '@capacitor/geolocation';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-ajouter-bus',
  templateUrl: './ajouter-bus.component.html',
  styleUrls: ['./ajouter-bus.component.scss'],
})
export class AjouterBusComponent implements OnInit {
  save: FormGroup | any;
  isReady: boolean | any;
  image: string | any;
  linkUrl: string | any;
  lat: any;
  long: any;
  account: any;
  list: any[] = [];

  constructor(
    private fb: FormBuilder,
    public upload: UploadService,
    public api: FireStoreRestServiceService,
    public auth: AuthService,
    public others: OtherFunctionsService
  ) {}

  async ngOnInit() {
    this.save = this.fb.group({
      registration: [
        '',
        [
          Validators.required,
          Validators.minLength(6),
          Validators.maxLength(20),
        ],
      ],
      color: ['', [Validators.required]],
      type: ['', [Validators.required]],
      driver: ['', [Validators.required]],
    });

    try {
      const coordinates = await this.getCurrentLocation();
      this.lat = coordinates.lat;
      this.long = coordinates.long;
    } catch (error) {
      console.error('Error obtaining coordinates:', error);
    }

    this.loadDataDriver();
    this.account = await this.auth.getData('account');
  }

  async loadDataDriver() {
    try {
      const dataObservable = await (
        await this.api.getAllData('driver')
      ).toPromise();

      if (dataObservable) {
        // this.listBus =
        let data = [];
        for (let i = 0; i < dataObservable.length; i++) {
          data[i] = dataObservable[i].fullname;
        }
        this.list = data;
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

  async getCurrentLocation(): Promise<{ lat: number; long: number }> {
    try {
      const position = await Geolocation.getCurrentPosition();
      const coordinates = {
        lat: position.coords.latitude,
        long: position.coords.longitude,
      };
      return coordinates;
    } catch (error) {
      console.error('Error getting location', error);
      throw error;
    }
  }

  async saveData() {
    try {
      const object = {
        registration: this.save.value.registration,
        color: this.save.value.color,
        type: this.save.value.type,
        driver: this.save.value.driver,
        picture: this.linkUrl,
        lat: this.lat,
        long: this.long,
        createdAt: await this.others.getCurrentDate(),
        createdBy: this.account.fullname,
        updatedAt: '',
        updatedBy: '',
      };

      console.log(object);
      const collectionName = 'bus';
      const isSave = this.save.valid;
      const operation = 'save';

      const result = await this.api.actionAlert(
        object,
        collectionName,
        isSave,
        operation
      );

      if (result) {
        this.save.reset();
        this.image = '';
      }
    } catch (error) {
      console.error("Une erreur est survenue lors de l'appel :", error);
    }
  }

  async takePicture() {
    try {
      const { isReady, images, linkUrl } =
        await this.upload.readyToUploadFile();
      this.isReady = isReady;
      this.image = images;
      this.linkUrl = linkUrl;
      console.log({ isReady, images, linkUrl });
    } catch (error) {
      console.error(
        'Erreur lors de la préparation du fichier pour le téléchargement :',
        error
      );
    }
  }
}

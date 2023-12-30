import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { FireStoreRestServiceService } from 'src/app/services/FireStore/fire-store-rest-service.service';
import { InternetService } from 'src/app/services/Internet/internet.service';
import { OtherFunctionsService } from 'src/app/services/Others/other-functions.service';
import { UploadService } from 'src/app/services/upload/upload.service';

@Component({
  selector: 'app-liste-driver',
  templateUrl: './liste-driver.component.html',
  styleUrls: ['./liste-driver.component.scss'],
})
export class ListeDriverComponent implements OnInit {
  save: FormGroup | any;
  isReady: boolean | any;
  image: string | any;
  linkUrl: string | any;
  data: any[] = [];
  list: any[] = [];
  loadingData = true;
  isConnected: boolean | any;
  collectionnName: any = 'driver';
  private internetStatusSubscription: Subscription | any;
  readyToUpdate: any;
  isModalOpen: boolean | undefined;
  selectedOption: string | undefined;

  constructor(
    public internet: InternetService,
    public api: FireStoreRestServiceService,
    private other: OtherFunctionsService,
    private fb: FormBuilder,
    public upload: UploadService
  ) {}

  ngOnInit() {
    this.save = this.fb.group({
      fullname: ['', [Validators.required, Validators.minLength(6)]],
      subname: ['', [Validators.required, Validators.minLength(6)]],
      phone: [
        '',
        [
          Validators.required,
          Validators.minLength(9),
          Validators.maxLength(9),
          Validators.pattern(/^6/),
        ],
      ],
      cni: ['', [Validators.required, Validators.minLength(10)]],
      adresse: ['', [Validators.required, Validators.minLength(3)]],
    });

    this.loadData();

    this.internetStatusSubscription = this.internet
      .getStatusChangedObservable()
      .subscribe((isConnected: boolean) => {
        if (!this.isConnected && isConnected) {
          this.refreshData();
        }
        this.isConnected = isConnected;
      });
  }

  async loadData() {
    try {
      const dataObservable = await (
        await this.api.getAllData(this.collectionnName)
      ).toPromise();

      if (dataObservable) {
        this.list = dataObservable;
        this.data = dataObservable;

        console.log(this.data);
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

  private refreshData(): void {
    this.loadData();
  }

  async handleInput(event: any) {
    const query = event.target.value.toLowerCase();
    this.data = this.list.filter(
      (d) =>
        d.fullname.toLowerCase().indexOf(query) > -1 ||
        d.subname.toLowerCase().indexOf(query) > -1 ||
        d.phone.toLowerCase().indexOf(query) > -1 ||
        d.adresse.toLowerCase().indexOf(query) > -1 ||
        d.cni.toLowerCase().indexOf(query) > -1
    );
  }

  async actionSheetData(object: any) {
    try {
      const result = await this.api.actionSheetData(
        object,
        this.collectionnName
      );

      if (result) {
        this.loadData();
      }

      if (result === null) {
        this.readyToUpdate = object;
        console.log('prepare the update : ', this.readyToUpdate);

        if (this.readyToUpdate.registration != '') {
          this.image = this.readyToUpdate.picture;
          this.isModalOpen = true;
        }
      }
      console.log(result);
    } catch (error) {
      console.error("Erreur lors de l'appel à actionAlert :", error);
    }
  }

  async updateData() {
    try {
      const object = {
        fullname: this.save.value.fullname,
        subname: this.save.value.subname,
        phone: this.save.value.phone,
        adresse: this.save.value.adresse,
        cni: this.save.value.cni,
        picture: this.linkUrl === '' ? this.image : this.linkUrl,
        updatedAt: await this.other.getCurrentDate(),
        updatedBy: '',
      };
      const collectionName = 'driver';
      const isSave = this.save.valid;
      const operation = 'update';
      console.log(object, collectionName, isSave, operation);
      const result = await this.api.actionAlert(
        object,
        collectionName,
        isSave,
        operation
      );
      if (result) {
        this.isModalOpen = false;
        this.save.reset();
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

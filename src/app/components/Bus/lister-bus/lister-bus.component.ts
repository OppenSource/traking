import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { FireStoreRestServiceService } from 'src/app/services/FireStore/fire-store-rest-service.service';
import { InternetService } from 'src/app/services/Internet/internet.service';
import { OtherFunctionsService } from 'src/app/services/Others/other-functions.service';
import { UploadService } from 'src/app/services/upload/upload.service';

@Component({
  selector: 'app-lister-bus',
  templateUrl: './lister-bus.component.html',
  styleUrls: ['./lister-bus.component.scss'],
})
export class ListerBusComponent implements OnInit {
  save: FormGroup | any;
  isReady: boolean | any;
  image: string | any;
  linkUrl: string | any;
  data: any[] = [];
  list: any[] = [];
  loadingData = true;
  isConnected: boolean | any;
  collectionnName: any = 'bus';
  private internetStatusSubscription: Subscription | any;
  readyToUpdate: any;
  isModalOpen: boolean | undefined;
  options = ['KaiBoy', 'Grand Prof', 'Chef Baham'];
  selectedOption: string | undefined;

  constructor(
    public internet: InternetService,
    public api: FireStoreRestServiceService,
    private other: OtherFunctionsService,
    private fb: FormBuilder,
    public upload: UploadService
  ) {}

  ngOnInit() {
    this.selectedOption = this.options[0];
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
        d.registration.toLowerCase().indexOf(query) > -1 ||
        d.driver.toLowerCase().indexOf(query) > -1 ||
        d.type.toLowerCase().indexOf(query) > -1
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
        console.log(this.readyToUpdate);
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
        registration: this.save.value.registration,
        color: this.save.value.color,
        type: this.save.value.type,
        driver: this.save.value.driver,
        picture:
          this.linkUrl === '' ? this.readyToUpdate.picture : this.linkUrl,
        updatedAt: await this.other.getCurrentDate(),
        updatedBy: '',
        createdAt: this.readyToUpdate.createdAt,
        createdBy: this.readyToUpdate.createdBy,
      };

      const collectionName = 'bus';
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

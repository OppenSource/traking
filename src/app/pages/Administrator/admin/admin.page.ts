import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FireStoreRestServiceService } from 'src/app/services/FireStore/fire-store-rest-service.service';
import { InternetService } from 'src/app/services/Internet/internet.service';
import { OtherFunctionsService } from 'src/app/services/Others/other-functions.service';
import { UploadService } from 'src/app/services/upload/upload.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.page.html',
  styleUrls: ['./admin.page.scss'],
})
export class AdminPage implements OnInit {
  save: FormGroup | any;
  collectionnName: any = 'admin';
  selected: any = 'liste';
  image: any;
  linkUrl: any;
  internetStatusSubscription: any;
  isConnected: any;
  data: any[] = [];
  list: any[] = [];
  isReady: any;
  items: any[] = Array.from({ length: 4 });
  isModalOpen: any;
  readyToUpdate: any;

  constructor(
    private fb: FormBuilder,
    public upload: UploadService,
    public api: FireStoreRestServiceService,
    public others: OtherFunctionsService,
    public internet: InternetService
  ) {}

  ngOnInit() {
    this.save = this.fb.group({
      fullname: ['', [Validators.required, Validators.minLength(6)]],
      phone: [
        '',
        [
          Validators.required,
          Validators.minLength(9),
          Validators.maxLength(9),
          Validators.pattern(/^6/),
        ],
      ],
      email: [
        '',
        [
          Validators.required,
          Validators.pattern('[a-z0-9._%+-]+@institutsaintjean+.org$'),
        ],
      ],
      cni: ['', [Validators.required, Validators.minLength(10)]],
    });

    this.loadData();

    this.internetStatusSubscription = this.internet
      .getStatusChangedObservable()
      .subscribe((isConnected: boolean) => {
        if (!this.isConnected && isConnected) {
          this.refreshData();
        }
        this.isConnected = isConnected;
        console.log(this.isConnected);
      });
  }

  getSkeletonClass(contentType: string): string {
    switch (contentType) {
      case 'h3':
        return 'skeleton-width-80';
      case 'p':
        return 'skeleton-width-60';
      default:
        return '';
    }
  }

  ngOnDestroy(): void {
    this.internetStatusSubscription.unsubscribe();
  }

  private refreshData(): void {
    console.log('Rafraîchissement des données...');
    this.loadData();
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

  async addData() {
    try {
      const object = {
        fullname: this.save.value.fullname,
        phone: this.save.value.phone,
        email: this.save.value.email,
        cni: this.save.value.cni,
        picture: this.linkUrl,
        createdAt: await this.others.getCurrentDate(),
        createdBy: '',
        updatedAt: '',
        updatedBy: '',
      };

      const result = await this.api.actionAlert(
        object,
        this.collectionnName,
        this.save.valid,
        'save'
      );
      if (result) {
        this.save.reset();
        this.image = '';
        this.loadData();
      }
    } catch (error) {
      console.log(error);
    }
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
        fullname: this.save.value.fullname,
        phone: this.save.value.phone,
        email: this.save.value.email,
        cni: this.save.value.cni,
        picture:
          this.linkUrl === '' ? this.readyToUpdate.picture : this.linkUrl,
        updatedAt: await this.others.getCurrentDate(),
        updatedBy: '',
        createdAt: this.readyToUpdate.createdAt,
        createdBy: this.readyToUpdate.createdBy,
      };

      const result = await this.api.actionAlert(
        object,
        this.collectionnName,
        this.save.valid,
        'update'
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

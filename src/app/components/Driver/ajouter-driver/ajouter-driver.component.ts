import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FireStoreRestServiceService } from 'src/app/services/FireStore/fire-store-rest-service.service';
import { OtherFunctionsService } from 'src/app/services/Others/other-functions.service';
import { UploadService } from 'src/app/services/upload/upload.service';

@Component({
  selector: 'app-ajouter-driver',
  templateUrl: './ajouter-driver.component.html',
  styleUrls: ['./ajouter-driver.component.scss'],
})
export class AjouterDriverComponent implements OnInit {
  save: FormGroup | any;
  isReady: boolean | any;
  image: string | any;
  linkUrl: string | any;

  constructor(
    private fb: FormBuilder,
    public upload: UploadService,
    public api: FireStoreRestServiceService,
    public others: OtherFunctionsService
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
  }

  async saveData() {
    try {
      const object = {
        fullname: this.save.value.fullname,
        subname: this.save.value.subname,
        phone: this.save.value.phone,
        adresse: this.save.value.adresse,
        cni: this.save.value.cni,
        picture: this.linkUrl,
        createdAt: await this.others.getCurrentDate(),
        createdBy: '',
        updatedAt: '',
        updatedBy: '',
      };

      console.log(object);
      const collectionName = 'driver';
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

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { FireStoreRestServiceService } from 'src/app/services/FireStore/fire-store-rest-service.service';
import { InternetService } from 'src/app/services/Internet/internet.service';
import { OtherFunctionsService } from 'src/app/services/Others/other-functions.service';

@Component({
  selector: 'app-journey',
  templateUrl: './journey.page.html',
  styleUrls: ['./journey.page.scss'],
})
export class JourneyPage implements OnInit {
  selected: string = 'ajouter';
  listBus: any[] = [];
  listTrajet: any[] = [];
  selectedOption: any;
  save: FormGroup | any;
  collectionnName: any = 'journey';
  isModalOpen: any = false;
  readyToUpdate: any;
  data: any[] = [];
  list: any[] = [];
  private internetStatusSubscription: Subscription | any;
  isConnected: boolean | any;
  items: any[] = Array.from({ length: 4 });

  constructor(
    public internet: InternetService,
    public api: FireStoreRestServiceService,
    private other: OtherFunctionsService,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.loadDataBus();
    this.save = this.fb.group({
      bus: ['', [Validators.required]],
      heure_depart: [
        '',
        [Validators.required, Validators.pattern(/^(0[0-9]|09):[0-5][0-9]$/)],
      ],
      point_depart: ['', [Validators.required, Validators.minLength(5)]],
      point_arrive: ['', [Validators.required, Validators.minLength(5)]],
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
    this.loadDataBus();
    this.loadData();
  }

  onSelectionChange() {
    console.log('Option sélectionnée:', this.selectedOption);
  }

  async loadDataBus() {
    try {
      const dataObservable = await (
        await this.api.getAllData('bus')
      ).toPromise();

      if (dataObservable) {
        // this.listBus =
        let data = [];
        for (let i = 0; i < dataObservable.length; i++) {
          data[i] = dataObservable[i].registration;
        }
        this.listBus = data;
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

  async addData() {
    try {
      const object = {
        bus: this.save.value.bus,
        heure_depart: this.save.value.heure_depart,
        point_depart: this.save.value.point_depart,
        point_arrive: this.save.value.point_arrive,
        createdAt: await this.other.getCurrentDate(),
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
        this.loadDataBus();
        this.loadData();
      }
    } catch (error) {
      console.log(error);
    }
  }

  async loadData() {
    try {
      const dataObservable = await (
        await this.api.getAllData(this.collectionnName)
      ).toPromise();

      if (dataObservable) {
        this.list = dataObservable;
        this.data = dataObservable;
        console.log('Trajets', this.data);
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
        if (this.readyToUpdate.registration != '') {
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
        bus: this.save.value.bus,
        heure_depart: this.save.value.heure_depart,
        point_depart: this.save.value.point_depart,
        point_arrive: this.save.value.point_arrive,
        createdAt: this.readyToUpdate.createdAt,
        createdBy: '',
        updatedAt: await this.other.getCurrentDate(),
        updatedBy: '',
      };

      const collectionName = 'journey';
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
        this.loadData();
        this.loadDataBus();
      }

      // Utilisez le résultat si nécessaire
      console.log(result);
    } catch (error) {
      console.error("Erreur lors de l'appel à actionAlert :", error);
    }
  }

  async handleInput(event: any) {
    const query = event.target.value.toLowerCase();
    this.data = this.list.filter(
      (d) =>
        d.bus.toLowerCase().indexOf(query) > -1 ||
        d.heure_depart.toLowerCase().indexOf(query) > -1 ||
        d.point_depart.toLowerCase().indexOf(query) > -1 ||
        d.point_arrive.toLowerCase().indexOf(query) > -1
    );
  }
}

import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { GoogleMap, Marker } from '@capacitor/google-maps';
import { Observable, from, interval, switchMap, throwError } from 'rxjs';
import { Geolocation } from '@capacitor/geolocation';
import { environment } from 'src/environments/environment';
import { Firestore, collection, getDocs } from '@angular/fire/firestore';
import { takeWhile } from 'rxjs/operators';
import { AuthService } from 'src/app/services/auth.service';

interface LocationInfo {
  coordinate: {
    lat: string;
    lng: string;
  };
  title: string;
  snippet: string;
  distance: string;
}
interface LocationInfo1 {
  coordinate: {
    lat: string;
    lng: string;
  };
  title: string;
  iconUrl: string;
}

@Component({
  selector: 'app-map',
  templateUrl: './map.page.html',
  styleUrls: ['./map.page.scss'],
})
export class MapPage implements OnInit {
  @ViewChild('map') mapRef: ElementRef<HTMLElement> | any;
  map: GoogleMap | any;
  markers = [];
  data: any[] = [];
  markerBus: any;
  lng: any;
  lat: any;
  dist: any;
  maps: any;
  emplacement: any;
  private alive = true;
  private intervalSubscription: any;

  isModalOpen: boolean = false;
  locationInfo: LocationInfo = {
    coordinate: {
      lat: '0',
      lng: '0',
    },
    title: '',
    snippet: '',
    distance: '',
  };

  markerInfoBus: LocationInfo1 = {
    coordinate: {
      lat: '0',
      lng: '0',
    },
    title: '',
    iconUrl: '',
  };
  account: any;

  constructor(private firestore: Firestore, private auth: AuthService) {}

  ngOnInit() {
    this.ionViewDidEnter();

    interval(5000)
      .pipe(
        switchMap(() => Geolocation.getCurrentPosition()),
        switchMap((position) => {
          // Update position properties
          this.locationInfo.coordinate.lat =
            position.coords.latitude.toString();
          this.locationInfo.coordinate.lng =
            position.coords.longitude.toString();

          // Get location name asynchronously
          return this.getLocationName(
            position.coords.latitude,
            position.coords.longitude
          );
        })
      )
      .subscribe((location: string) => {
        // Update snippet property with the location name
        this.locationInfo.snippet = location;
        this.lng = this.locationInfo.coordinate.lng;
        this.lat = this.locationInfo.coordinate.lat;

        // Display the information
        console.log(this.locationInfo);
        this.emplacement = this.locationInfo.snippet;

        // this.isModalOpen = false;
      });
    this.loadDataBus();
    this.fetchUserData();
    this.startInterval();
  }

  ngOnDestroy() {
    if (this.intervalSubscription) {
      this.intervalSubscription.unsubscribe();
    }
  }

  async fetchUserData() {
    try {
      this.account = await this.auth.getData('account');
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  }
  async loadDataBus() {
    try {
      const dataObservable = await (await this.getAllData('bus')).toPromise();
      if (dataObservable) {
        // this.listBus =
        let data = [];
        let distance = [];
        const ef = {
          bus: '',
          driver: '',
          image: '',
          distance: 0,
        };

        const rest = {
          title: 'Bus Immatriculé : ',
          snippet: 'Institut St Jean',
          coordinate: {
            lat: 0,
            lng: 0,
          },
        };

        const rest1 = {
          title: this.account.fullname.toString(),
          snippet: this.account.account.toString(),
          coordinate: {
            lat: parseFloat(this.lat),
            lng: parseFloat(this.lng),
          },
        };

        for (let i = 0; i < dataObservable.length; i++) {
          rest.coordinate.lng = dataObservable[i].long;
          rest.coordinate.lat = dataObservable[i].lat;
          rest.title = 'Bus Immatriculé : ' + dataObservable[i].registration;
          data.push(rest);

          // distance
          ef.driver = dataObservable[i].driver;
          ef.image = dataObservable[i].picture;
          ef.bus = dataObservable[i].registration;
          ef.distance = this.calculateDistance(
            this.lng,
            this.lat,
            dataObservable[i].long,
            dataObservable[i].lat
          );
          distance.push(ef);
        }

        const objetPlusProche = distance.reduce((plusProche, objet) => {
          return objet.distance < plusProche.distance ? objet : plusProche;
        }, distance[0]);

        this.dist = objetPlusProche;
        console.log('distance : ', objetPlusProche);

        data.push(rest1);
        this.markerBus = data;

        console.log(this.markerBus);
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

  fermer() {
    this.isModalOpen = false;
  }

  async getAllData(collectionName: any): Promise<Observable<any[]>> {
    try {
      const data = await getDocs(collection(this.firestore, collectionName));
      const result = data.docs.map((doc) => doc.data());
      if (result.length > 0) {
        return from([result]);
      } else {
        return from([[]]); // Retourne un tableau vide si le résultat est vide
      }
    } catch (error) {
      return throwError(error);
    }
  }

  ionViewDidEnter() {
    this.createMap();
    interval(15000)
      .pipe(takeWhile(() => this.alive))
      .subscribe(() => {
        this.loadDataBus();
        this.addMarkers();
      });

    interval(8000)
      .pipe(takeWhile(() => this.alive))
      .subscribe(() => {
        this.isModalOpen = false;
      });
  }

  ionViewWillLeave() {
    this.alive = false;
  }

  startInterval() {
    this.intervalSubscription = interval(5000).subscribe(() => {
      this.addMarkers();
    });
  }

  async createMap() {
    this.map = await GoogleMap.create({
      id: 'my-map', // Unique identifier for this map instance
      element: this.mapRef.nativeElement, // reference to the capacitor-google-map element
      apiKey: environment.mapskey, // Your Google Maps API Key
      config: {
        center: {
          lat: 4,
          lng: 12,
        },
        zoom: 8, // The initial zoom level to be rendered by the map
      },
    });
    this.addMarkers();
  }

  async addMarkers() {
    const marker: Marker[] = this.markerBus;
    const result = await this.map.addMarkers(marker);
    this.map.setOnMarkerClickListener(async (markers: any) => {
      this.isModalOpen = true;
      this.maps = markers;
      console.log(markers);
    });
  }

  private degreesToRadians(degrees: number) {
    return (degrees * Math.PI) / 180;
  }

  // Calcule la distance entre deux coordonnées géographiques en utilisant la formule haversine
  calculateDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number {
    const earthRadiusKm = 6371; // Rayon moyen de la Terre en kilomètres

    const dLat = this.degreesToRadians(lat2 - lat1);
    const dLon = this.degreesToRadians(lon2 - lon1);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.degreesToRadians(lat1)) *
        Math.cos(this.degreesToRadians(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    const distance = earthRadiusKm * c; // Distance en kilomètres

    console.log('Distance:', distance);

    return distance;
  }

  async getLocationName(lat: number, lon: number): Promise<string> {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lon}&key=AIzaSyDmbHpCwdgkMvU710NhK3JTTxyv1LTcuCk`
      );
      const data = await response.json();

      if (data.results && data.results.length > 0) {
        return data.results[0].formatted_address;
      } else {
        return 'Emplacement inconnu';
      }
    } catch (error) {
      console.error(
        "Erreur lors de la récupération du nom de l'emplacement:",
        error
      );
      return 'Erreur de géocodage';
    }
  }

  async getCurrentLocationName(): Promise<string> {
    try {
      const position = await Geolocation.getCurrentPosition();
      return await this.getLocationName(
        position.coords.latitude,
        position.coords.longitude
      );
    } catch (error) {
      console.error(
        'Erreur lors de la récupération de la position actuelle:',
        error
      );
      return 'Erreur de géolocalisation';
    }
  }
}

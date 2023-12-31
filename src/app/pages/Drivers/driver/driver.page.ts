import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { InternetService } from 'src/app/services/Internet/internet.service';

@Component({
  selector: 'app-driver',
  templateUrl: './driver.page.html',
  styleUrls: ['./driver.page.scss'],
})
export class DriverPage implements OnInit {
  selected: string = 'ajouter';
  internetStatusSubscription: Subscription | any;
  isConnected: any;

  constructor(public internet: InternetService) {}

  ngOnInit() {
    this.internetStatusSubscription = this.internet
      .getStatusChangedObservable()
      .subscribe((isConnected: boolean) => {
        this.isConnected = isConnected;
        console.log(this.isConnected);
      });
  }

  ngOnDestroy(): void {
    this.internetStatusSubscription.unsubscribe();
  }
}

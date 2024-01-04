import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-lister-bus-skeleton',
  templateUrl: './lister-bus-skeleton.component.html',
  styleUrls: ['./lister-bus-skeleton.component.scss'],
})
export class ListerBusSkeletonComponent implements OnInit {
  items: any[] = Array.from({ length: 4 });

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

  constructor() {}

  ngOnInit() {}
}

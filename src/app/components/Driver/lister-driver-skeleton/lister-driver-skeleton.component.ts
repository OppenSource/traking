import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-lister-driver-skeleton',
  templateUrl: './lister-driver-skeleton.component.html',
  styleUrls: ['./lister-driver-skeleton.component.scss'],
})
export class ListerDriverSkeletonComponent implements OnInit {
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

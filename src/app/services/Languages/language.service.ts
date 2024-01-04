import { Injectable } from '@angular/core';
import { Device } from '@capacitor/device';

@Injectable({
  providedIn: 'root',
})
export class LanguageService {
  constructor() {}

  logDeviceInfo = async () => {
    const info = await Device.getLanguageCode();
    return info;
  };
}

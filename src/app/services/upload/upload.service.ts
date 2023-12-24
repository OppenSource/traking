import { Injectable } from '@angular/core';
import { Firestore, addDoc, collection } from '@angular/fire/firestore';
import {
  Storage,
  getDownloadURL,
  ref,
  uploadBytes,
} from '@angular/fire/storage';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Capacitor } from '@capacitor/core';
import { ToastService } from '../Toast/toast.service';

@Injectable({
  providedIn: 'root',
})
export class UploadService {
  constructor(
    private toast: ToastService,
    private storage: Storage,
    private firestore: Firestore
  ) {}

  async readyToUploadFile() {
    try {
      if (Capacitor.getPlatform() !== 'web') {
        await this.checkAndRequestCameraPermission();
      }

      const image = await this.capturePhoto();

      if (
        image.format !== 'png' &&
        image.format !== 'jpeg' &&
        image.format !== 'gif' &&
        image.format !== 'jpg'
      ) {
        this.toast.showNotValidImage();
      } else {
        if (image) {
          const blob = this.dataURLtoBlob(image.dataUrl);
          const url = await this.uploadImage(blob, image);

          if (url) {
            this.toast.showUploadSuccess();
            await this.addDocument('navigo', { imageUrl: url });
            return { images: image.dataUrl, linkUrl: url, isReady: true };
          } else {
            this.toast.showUploadFailed();
          }
        }
      }
    } catch (e) {
      console.error(e);
      throw e; // Propager l'erreur pour indiquer que la fonction a échoué
    }

    return { images: '', linkUrl: '', isReady: false };
  }

  private async checkAndRequestCameraPermission() {
    const hasPermission = await Camera.checkPermissions();
    if (!hasPermission.camera) {
      const permissionRequest = await Camera.requestPermissions({
        permissions: ['camera'],
      });
      if (!permissionRequest.camera) {
        console.log("La permission d'accès à la caméra a été refusée.");
      }
    }
  }

  private async capturePhoto() {
    try {
      const result = await Camera.getPhoto({
        quality: 90,
        source: CameraSource.Prompt,
        width: 600,
        resultType: CameraResultType.DataUrl,
      });

      console.log('Image capturée avec succès:', result);
      return result;
    } catch (error) {
      console.error('Erreur lors de la capture de la photo:', error);
      throw error;
    }
  }

  private dataURLtoBlob(dataurl: any) {
    const arr = dataurl.split(',');
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    const n = bstr.length;
    const u8arr = new Uint8Array(n);

    for (let i = 0; i < n; ++i) {
      u8arr[i] = bstr.charCodeAt(i);
    }

    return new Blob([u8arr], { type: mime });
  }

  private async uploadImage(blob: any, imageData: any) {
    try {
      const currentDate = Date.now();
      const filePath = `navigo/${currentDate}.png`; // Vous pouvez utiliser un format d'image standard ici
      const fileRef = ref(this.storage, filePath);
      await uploadBytes(fileRef, blob);
      const url = await getDownloadURL(fileRef);
      console.log('Image téléchargée avec succès:', url);
      return url;
    } catch (error) {
      console.error("Erreur lors du téléchargement de l'image:", error);
      throw error;
    }
  }

  private async addDocument(path: any, data: any) {
    try {
      const dataRef = collection(this.firestore, path);
      await addDoc(dataRef, data);
      console.log('Document ajouté avec succès.');
    } catch (error) {
      console.error("Erreur lors de l'ajout du document:", error);
      throw error;
    }
  }
}

import { Injectable } from '@angular/core';
import { ToastController, ToastOptions } from '@ionic/angular';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  constructor(private toastController: ToastController) {}

  /**
   * Affiche un toast avec les options spécifiées.
   * @param message Le message à afficher dans le toast.
   * @param color La couleur du toast (par exemple, 'success', 'danger', 'warning', etc.).
   * @param position La position du toast ('top', 'bottom' ou 'middle').
   * @param icon L'icône à afficher dans le toast.
   * @param duration La durée d'affichage du toast en millisecondes.
   */
  async showToast(
    message: string,
    color: string,
    position: string,
    icon: string,
    duration: number
  ) {
    // Positions valides pour le toast
    const validPositions = ['top', 'bottom', 'middle'];

    // Vérifie si la position fournie est valide, sinon utilise 'bottom' par défaut
    const validPosition = validPositions.includes(position)
      ? position
      : 'bottom';

    // Options du toast à passer à la méthode create
    const toastOptions: ToastOptions = {
      message,
      duration,
      color,
      icon,
      position: validPosition as any,
    };

    // Crée et affiche le toast
    const toast = await this.toastController.create(toastOptions);
    await toast.present();
  }

  async showUploadSuccess() {
    this.showToast(
      'La photo à bien été Importée',
      'dark',
      'bottom',
      'cloud-done-outline',
      5000
    );
  }

  async showUploadFailed() {
    this.showToast(
      "Impossible d'importer cette photo",
      'dark',
      'bottom',
      'cloud-offline-outline',
      5000
    );
  }

  async showInternetReady() {
    this.showToast(
      'Connexion internet rétablie.',
      'primary',
      'bottom',
      'wifi-outline',
      5000
    );
  }

  async showInternetLost() {
    this.showToast(
      'Connexion internet perdue.',
      'danger',
      'bottom',
      'construct-outline',
      5000
    );
  }

  async showNotValidImage() {
    this.showToast(
      "Désolé mais ce fichier n'est pas une image.",
      'danger',
      'bottom',
      'image-outline',
      5000
    );
  }

  RegistrationIsExist() {
    this.showToast(
      'Désolé mais il semblerait que cette ressource existe déjà',
      'dark',
      'bottom',
      'create-outline',
      5000
    );
  }

  async showResourceUnavailable() {
    this.showToast(
      'Désolé mais cette ressource est indisponible.',
      'dark',
      'bottom',
      'cloud-offline-outline',
      5000
    );
  }

  async showRegistrationExistenceError() {
    this.showToast(
      'Désolé mais il semblerait que vous essayez de dupliquer une ressource déjà existante.',
      'dark',
      'bottom',
      'help-outline',
      3500
    );
  }

  async showSuccess(message: any, duration: any) {
    this.showToast(message, 'primary', 'bottom', 'happy-outline', 5000);
  }

  async showDanger(message: any, duration: any) {
    this.showToast(message, 'danger', 'bottom', 'close-circle-outline', 5000);
  }

  async showWarning(message: any, duration: any) {
    this.showToast(message, 'dark', 'bottom', 'dark-outline', 5000);
  }
}

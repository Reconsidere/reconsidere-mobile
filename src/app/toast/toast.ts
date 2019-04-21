import { ToastController } from '@ionic/angular';

export class Toast {

    toastController;

    constructor() {
        this.toastController = new ToastController(this);
    }

    async showToast(message: string, color: string) {
        const toast = await this.toastController.create({
            message: message,
            showCloseButton: true,
            position: 'top',
            closeButtonText: 'Fechar',
            color: color
        });
        toast.present();
    }
}
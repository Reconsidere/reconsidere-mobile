import { ToastController } from '@ionic/angular';

export class Toast {

    toastController;

    constructor() {
        this.toastController = new ToastController(this);
    }

    
}
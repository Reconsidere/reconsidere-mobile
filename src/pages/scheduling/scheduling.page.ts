import { Component, OnInit } from '@angular/core';
import { Camera } from '@ionic-native/camera';
import { AuthService } from 'src/providers/auth.service';
import { Customer } from 'src/models/customer';
import { Scheduling } from 'src/models/scheduling';
import { Toast } from 'src/app/toast/toast';
import { HttpClient } from '@angular/common/http';
import { ToastController } from '@ionic/angular';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { NativeGeocoder, NativeGeocoderOptions } from '@ionic-native/native-geocoder/ngx';


@Component({
  selector: 'app-scheduling',
  templateUrl: './scheduling.page.html',
  styleUrls: ['./scheduling.page.scss'],
})
export class SchedulingPage implements OnInit {
  public base64Image: string;
  private imageSrc: string;
  toast: Toast;
  messageCode: any;
  customer: Customer;
  scheduling: Scheduling;
  constructor(private nativeGeocoder: NativeGeocoder, private geolocation: Geolocation, private authService: AuthService, private http: HttpClient, private toastController: ToastController) {
    this.scheduling = new Scheduling();
    this.http.get("./../assets/data/message.json").subscribe(response => this.loadMessages(response));
  }



  async showToast(message: string, color: string, time: number) {
    const toast = await this.toastController.create({
      message: message,
      showCloseButton: true,
      position: 'top',
      closeButtonText: 'Fechar',
      color: color,
      duration: time,
      animated: true
    });
    toast.present();
  }


  loadMessages(response) {
    this.messageCode = response;
  }

  ngOnInit() {
    if (this.authService.isAuthenticated()) {
      this.customer = JSON.parse(localStorage.getItem('currentUser'));
      if (this.customer.location !== undefined || this.customer.location !== null) {
        this.scheduling.location = this.customer.location;
      }
      if (this.customer.scheduling === undefined || this.customer.scheduling.length <= 0) {
        this.customer.scheduling = [new Scheduling()];
      } else {
        this.loadSchedules();
      }
    }
  }

  loadSchedules() {

  }



  takePicture() {
    Camera.getPicture({
      destinationType: Camera.DestinationType.DATA_URL,
      targetWidth: 1000,
      targetHeight: 1000
    }).then((imageData) => {
      // imageData is a base64 encoded string
      this.base64Image = 'data:image/jpeg;base64,' + imageData;
    }, (err) => {
      console.log(err);
    });
  }



  openGallery() {
    let cameraOptions = {
      sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
      destinationType: Camera.DestinationType.FILE_URI,
      quality: 100,
      targetWidth: 1000,
      targetHeight: 1000,
      encodingType: Camera.EncodingType.JPEG,
      correctOrientation: true
    }

    Camera.getPicture(cameraOptions)
      .then(file_uri => this.imageSrc = file_uri,
        err => console.log(err));
  }


  getLocation() {
    ///tem um bug no native location se o gps estiver fechado da crash aqui, 
    //então a ideia é se estiver fechado abrir primeiro se não abrir nem vir neste método
    this.geolocation.getCurrentPosition().then((resp) => {
      let ccc = resp;
      // resp.coords.latitude
      // resp.coords.longitude
    }).catch((error) => {
      console.log('Error getting location', error);
    });



    let watch = this.geolocation.watchPosition();
    watch.subscribe((data) => {
      let ccc = data;
      // data can be a set of coordinates, or an error (if an error occurred).
      // data.coords.latitude
      // data.coords.longitude
    });
  }



  getAddress() {
    let options: NativeGeocoderOptions = {
      useLocale: true,
      maxResults: 5
    };

    this.nativeGeocoder.reverseGeocode(52.5072095, 13.1452818, options)
      .then((result: any[]) => {
        return console.log(JSON.stringify(result[0]));
      })
      .catch((error: any) => console.log(error));
  }

  save() {

  }
}



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
import { LocationAccuracy } from '@ionic-native/location-accuracy/ngx';
import { SchedulingService } from 'src/providers/scheduling.service';
import { Diagnostic } from '@ionic-native/diagnostic/ngx';


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
  isLocationOpen;
  latitude;
  longitude;
  loading;
  constructor(private diagnostic: Diagnostic, private schedulingService: SchedulingService, private locationAccuracy: LocationAccuracy, private nativeGeocoder: NativeGeocoder, private geolocation: Geolocation, private authService: AuthService, private http: HttpClient, private toastController: ToastController) {
    this.scheduling = new Scheduling();
    this.http.get("./../assets/data/message.json").subscribe(response => this.loadMessages(response));
    this.loading = false;
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
      destinationType: Camera.DestinationType.FILE_URI,
      targetWidth: 1000,
      targetHeight: 1000,
      sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
    }).then((imageData) => {
      // imageData is a base64 encoded string
      //this.base64Image = 'data:image/jpeg;base64,' + imageData;
      this.scheduling.picture = imageData;
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
      .then(file_uri => {
        this.scheduling.picture = file_uri;
      },
        err => console.log(err));
  }




  async getLocation() {
    await this.enableGps();
    if (!this.isLocationOpen) {
      await this.openLocation();
    }
    if (this.isLocationOpen) {
      let promise = await new Promise((resolve, reject) => {
        this.geolocation.getCurrentPosition().then((resp) => {
          this.latitude = resp.coords.latitude;
          this.longitude = resp.coords.longitude;
          resolve();
        }).catch((error) => {
          reject();
        });
      });
      this.getAddress(this.latitude, this.longitude);
    }
  }
  async enableGps() {
    let promise = await new Promise((resolve, reject) => {
      this.diagnostic.isGpsLocationAvailable().then(x => {
        if (x) {
          this.isLocationOpen = true;
        } else {
          this.isLocationOpen = false;
        }
        resolve();
      }).catch(x => {
        this.isLocationOpen = false;
        reject();
      });
    });
  }


  async getAddress(latitude, longitude) {
    let options: NativeGeocoderOptions = {
      useLocale: true,
      maxResults: 5
    };

    this.loading = true;
    this.nativeGeocoder.reverseGeocode(latitude, longitude, options)
      .then((result: any[]) => {
        this.scheduling.location.cep = result[0].postalCode;
        this.scheduling.location.neighborhood = result[0].subLocality;
        this.scheduling.location.state = result[0].administrativeArea;
        this.scheduling.location.county = result[0].subAdministrativeArea;
        this.scheduling.location.publicPlace = result[0].thoroughfare;
        this.scheduling.location.number = result[0].subThoroughfare;
        this.loading = false;
      })
      .catch((error: any) => {
        this.loading = false;
        this.showToast(this.messageCode['WARNNING']['WRE007']['summary'], 'warning', 3000);
      });
  }

  async openLocation() {
    let promise = await new Promise((resolve, reject) => {
      this.locationAccuracy.canRequest().then((canRequest: boolean) => {
        if (canRequest) {
          this.locationAccuracy.request(this.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY).then(
            () => {
              this.isLocationOpen = true;
              resolve();
            },
            error => {
              this.showToast(this.messageCode['WARNNING']['WRE008']['summary'], 'warning', 3000);
              this.isLocationOpen = false;
              reject();
            }
          );
        }
      });
    });
  }

  verifyBeforeSave() {
    if (this.scheduling.date === undefined
      || this.scheduling.hour === undefined) {
      this.showToast(this.messageCode['WARNNING']['WRE001']['summary'], 'warning', 3000);
      throw new Error();
    }

    if (this.scheduling.description === undefined) {
      if (this.scheduling.picture === undefined) {
        this.showToast(this.messageCode['WARNNING']['WRE001']['summary'], 'warning', 3000);
        throw new Error();
      }
    }
    if (this.scheduling.picture === undefined) {
      if (this.scheduling.description === undefined) {
        this.showToast(this.messageCode['WARNNING']['WRE001']['summary'], 'warning', 3000);
        throw new Error();
      }
    }

    if (this.scheduling.location === undefined || this.scheduling.location.cep === undefined
      || this.scheduling.location.county === undefined
      || this.scheduling.location.neighborhood === undefined
      || this.scheduling.location.publicPlace === undefined
      || this.scheduling.location.state === undefined
      || this.scheduling.location.complement === undefined
    ) {
      this.showToast(this.messageCode['WARNNING']['WRE001']['summary'], 'warning', 3000);
      throw new Error();
    }
  }

  async save() {
    try {
      this.verifyBeforeSave();
      if (this.customer.scheduling === undefined || this.customer.scheduling.length <= 0) {
        this.customer.scheduling = [this.scheduling];
      } else {
        this.customer.scheduling.push(this.scheduling);
      }
      let promise = await new Promise((resolve, reject) => {
        this.schedulingService.save(this.customer, resolve, reject);
      });
      this.showToast(this.messageCode['SUCCESS']['SRE001']['summary'], 'success', 3000);
      this.updateCustomer(promise);
    } catch (error) {
      this.showToast(this.messageCode['WARNNING'][error]['summary'], 'warning', 3000);
    }
  }

  updateCustomer(promise) {
    this.customer.scheduling = promise;
    localStorage.setItem('currentUser', JSON.stringify(promise));
  }
}



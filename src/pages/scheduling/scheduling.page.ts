import { Component, OnInit } from '@angular/core';
import { Camera } from '@ionic-native/camera';
import { AuthService } from 'src/providers/auth.service';
import { Customer } from 'src/models/customer';
import { Scheduling } from 'src/models/scheduling';
import { Toast } from 'src/app/toast/toast';
import { HttpClient } from '@angular/common/http';
import { ToastController, NavController } from '@ionic/angular';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { NativeGeocoder, NativeGeocoderOptions } from '@ionic-native/native-geocoder/ngx';
import { LocationAccuracy } from '@ionic-native/location-accuracy/ngx';
import { SchedulingService } from 'src/providers/scheduling.service';
import { Diagnostic } from '@ionic-native/diagnostic/ngx';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer/ngx';
import { File } from '@ionic-native/file/ngx';
import { environment } from 'src/environments/environment.prod';
import { Location } from 'src/models/location';
import { Status } from 'src/models/status';


@Component({
  selector: 'app-scheduling',
  templateUrl: './scheduling.page.html',
  styleUrls: ['./scheduling.page.scss'],
})
export class SchedulingPage implements OnInit {
  public base64Image: string;
  toast: Toast;
  messageCode: any;
  customer: Customer;
  scheduling: Scheduling;
  isLocationOpen;
  latitude;
  longitude;
  loading;
  path;
  imageName;
  showCards;
  showAddScheduling;

  constructor(private naveCltr: NavController, private transfer: FileTransfer, private file: File, private diagnostic: Diagnostic, private schedulingService: SchedulingService, private locationAccuracy: LocationAccuracy, private nativeGeocoder: NativeGeocoder, private geolocation: Geolocation, private authService: AuthService, private http: HttpClient, private toastController: ToastController) {
    this.scheduling = new Scheduling();
    this.scheduling.location = new Location();
    this.http.get("./../assets/data/message.json").subscribe(response => this.loadMessages(response));
    this.loading = false;
  }


  opencards() {
    if (this.showCards) {
      this.showCards = false;
    } else {
      this.showCards = true;
      this.showAddScheduling = false;
    }
  }

  openAdd() {
    if (this.showAddScheduling) {
      this.showAddScheduling = false;
    } else {
      this.showAddScheduling = true;
      this.showCards = false;
    }
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
    this.customer = JSON.parse(localStorage.getItem('currentUser'));
    if (this.customer.location !== undefined || this.customer.location !== null) {
      this.scheduling.location = this.customer.location;
    }
    if (this.customer.scheduling === undefined || this.customer.scheduling.length <= 0) {
      this.customer.scheduling = [];
    }
    if (this.scheduling.location === undefined) {
      this.scheduling.location = new Location();
    }
    this.loadSchedules();
  }

  loadSchedules() {
    this.schedulingService.loadAll(this.customer._id).subscribe(x => this.setSchedules(x));
  }

  setSchedules(values) {
    this.customer.scheduling = values;
  }

  takePicture() {
    try {
      Camera.getPicture({
        quality: 100,
        destinationType: Camera.DestinationType.FILE_URI,
        encodingType: Camera.EncodingType.JPEG,
        mediaType: Camera.MediaType.PICTURE
      }).then((imageData) => {
        this.path = imageData.substr(0, imageData.lastIndexOf('/') + 1);
        this.imageName = imageData.substring(imageData.lastIndexOf('/') + 1, imageData.length);
      }, (err) => {
        console.log(err);
      });
    } catch (error) {
      this.showToast(this.messageCode['WARNNING']['WRE009']['summary'], 'warning', 3000);
    }
  }



  openGallery() {
    try {
      let cameraOptions = {
        sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
        destinationType: Camera.DestinationType.FILE_URI,
        quality: 100,
        targetWidth: 1000,
        targetHeight: 1000,
        encodingType: Camera.EncodingType.JPEG,
        mediaType: Camera.MediaType.PICTURE,
        correctOrientation: true
      }

      Camera.getPicture(cameraOptions)
        .then(file_uri => {
          this.path = file_uri.substr(0, file_uri.lastIndexOf('/') + 1);
          this.imageName = file_uri.substring(file_uri.lastIndexOf('/') + 1, file_uri.length);
        },
          err => console.log(err));

    } catch (error) {
      this.showToast(this.messageCode['WARNNING']['WRE010']['summary'], 'warning', 3000);
    }
  }

  uploadFile() {
    try {
      this.scheduling.picture = this.path;
      const fileTransfer: FileTransferObject = this.transfer.create();
      let options: FileUploadOptions = {
        fileKey: 'ionicfile',
        fileName: 'ionicfile',
        chunkedMode: false,
        mimeType: "image/jpeg",
        headers: {}
      }

      if (this.imageName === undefined) {
        return;
      }
      this.scheduling.picture = this.imageName;

      fileTransfer.upload(this.path, `${environment.database.uri}/uploadImage`, options)
        .then((data) => {
          console.log(data + " Uploaded Successfully");
        }, (err) => {
          throw new Error(err);
        });
    } catch (error) {
      throw new Error();
    }
  }



  async getLocation() {
    try {
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
        await this.getAddress(this.latitude, this.longitude);
      }
    } catch (error) {
      this.showToast(this.messageCode['WARNNING']['WRE007']['summary'], 'warning', 3000);
    }
  }
  async enableGps() {
    try {
      let promise = await new Promise((resolve, reject) => {
        this.diagnostic.isGpsLocationEnabled().then(x => {
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
    } catch (error) {
      this.showToast(this.messageCode['WARNNING']['WRE007']['summary'], 'warning', 3000);
    }
  }


  async getAddress(latitude, longitude) {
    try {

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
    } catch (error) {
      this.showToast(this.messageCode['WARNNING']['WRE007']['summary'], 'warning', 3000);
    }
  }

  async openLocation() {
    try {
      let promise = await new Promise((resolve, reject) => {
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
      });
    } catch (error) {
      this.showToast(this.messageCode['WARNNING']['WRE007']['summary'], 'warning', 3000);
    }
  }

  clean() {
    this.scheduling = new Scheduling();
    this.scheduling.location = new Location();
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

    if (this.scheduling.location === undefined || this.scheduling.location.cep === undefined) {
      this.showToast(this.messageCode['WARNNING']['WRE001']['summary'], 'warning', 3000);
      throw new Error();
    }
  }

  async save() {
    try {
      this.uploadFile();
      this.scheduling.status = new Status();
      this.scheduling.status.open = true;
      this.scheduling.status.scheduled = false;
      this.scheduling.status.forCollection = false;
      this.scheduling.status.finalized = false;

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
      this.showToast(this.messageCode['ERROR'][error]['summary'], 'danger', 3000);
    }
  }

  updateCustomer(promise) {
    if (promise !== undefined && promise !== null) {
      this.customer.scheduling = promise;
      localStorage.setItem('currentUser', JSON.stringify(promise));
    }
    this.clean();
  }

}


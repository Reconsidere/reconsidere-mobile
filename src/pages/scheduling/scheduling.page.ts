import { Component, OnInit } from '@angular/core';
import { Camera } from '@ionic-native/camera';
import { AuthService } from 'src/providers/auth.service';
import { Customer } from 'src/models/customer';
import { timingSafeEqual } from 'crypto';
import { Scheduling } from 'src/models/scheduling';
@Component({
  selector: 'app-scheduling',
  templateUrl: './scheduling.page.html',
  styleUrls: ['./scheduling.page.scss'],
})
export class SchedulingPage implements OnInit {
  public base64Image: string;
  private imageSrc: string;
  customer: Customer;
  constructor(private authService: AuthService) { }

  ngOnInit() {
    if (this.authService.isAuthenticated()) {
      this.customer = JSON.parse(localStorage.getItem('currentUser'));
      if (this.customer.scheduling === undefined || this.customer.scheduling.length <= 0) {
        this.customer.scheduling = [new Scheduling()];
      }
    }
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
}

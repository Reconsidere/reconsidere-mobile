import { Component, OnInit } from '@angular/core';
import { Customer } from 'src/models/customer';
import { NeighborhoodSchedulingService } from 'src/providers/neighborhood-scheduling.service';
import { HttpClient } from '@angular/common/http';
import { ToastController } from '@ionic/angular';
import { Toast } from 'src/app/toast/toast';

@Component({
  selector: 'app-neighborhood-scheduling',
  templateUrl: './neighborhood-scheduling.page.html',
  styleUrls: ['./neighborhood-scheduling.page.scss'],
})
export class NeighborhoodSchedulingPage implements OnInit {
  toast: Toast;
  messageCode: any;
  isShowSelect;
  schedulingNeighborhoodsSelect;
  schedulingNeighborhoods
  schedulingNeighborhoodsItems;
  showCards;
  selected;

  customer: Customer;
  constructor(private http: HttpClient, private toastController: ToastController, private neighborhoodSchedulingService: NeighborhoodSchedulingService) {
    this.schedulingNeighborhoods = [];
    this.schedulingNeighborhoodsItems = [];
  }

  ngOnInit() {
    //carregar os bairros cadastrados pelas empresas e verificar 
    //qual localidade é igual ao do usuário se não encontrar
    //mostra um campo para ele escolher o bairro por um select.
    this.customer = JSON.parse(localStorage.getItem('currentUser'));
    this.load();
  }

  async load() {
    let promise = await new Promise((resolve, reject) => {
      this.http.get("./../assets/data/message.json").subscribe(response => this.loadMessages(response, resolve, reject));
    });
    if (this.customer.location === undefined || this.customer.location.neighborhood === undefined) {
      this.neighborhoodSchedulingService.loadAll().subscribe(x => this.loadAllScheduliNgneighborhood(x));
    } else {
      this.neighborhoodSchedulingService.loadScheduling(this.customer.location.neighborhood).subscribe(x => this.loadSchedulingNeighborhood(x));
    }
  }

  loadAllScheduliNgneighborhood(items) {
    if (items === undefined || items === null) {
      this.showToast(this.messageCode['INFO']['IRE003']['summary'], 'primary', 3000);
    } else {
      this.showToast(this.messageCode['INFO']['IRE002']['summary'], 'primary', 3000);
      this.schedulingNeighborhoodsSelect = Object.values(items);
      this.isShowSelect = true;
      this.schedulingNeighborhoodsItems = items;
    }
  }

  loadSchedulingNeighborhood(neighborhood) {
    this.schedulingNeighborhoods = neighborhood;
    this.showCards = true;
    this.isShowSelect = false;

  }

  selectedNeighborhood() {
    this.showCards = true;
    let item = this.schedulingNeighborhoodsItems.find(x => x.neighborhood === this.selected);
    this.schedulingNeighborhoods.push(item);
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

  loadMessages(response, resolve, reject) {
    try {
      this.messageCode = response;
      resolve();
    } catch (error) {
      reject();
    }
  }

}

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
  showCards;

  customer: Customer;
  constructor(private http: HttpClient, private toastController: ToastController, private neighborhoodSchedulingService: NeighborhoodSchedulingService) {
    this.schedulingNeighborhoods = [];
    this.http.get("./../assets/data/message.json").subscribe(response => this.loadMessages(response));
  }
  
  ngOnInit() {
    //carregar os bairros cadastrados pelas empresas e verificar 
    //qual localidade é igual ao do usuário se não encontrar
    //mostra um campo para ele escolher o bairro por um select.
    this.customer = JSON.parse(localStorage.getItem('currentUser'));

    if (this.customer.location === undefined || this.customer.location.neighborhood === undefined) {
      this.showToast(this.messageCode['INFO']['IRE002']['summary'], 'warning', 3000);
      this.neighborhoodSchedulingService.loadAll().subscribe(x => this.loadAllScheduliNgneighborhood(x));
    } else {
      this.neighborhoodSchedulingService.loadScheduling(this.customer.location.neighborhood).subscribe(x => this.loadSchedulingNeighborhood(x));
    }
  }

  loadAllScheduliNgneighborhood(items) {
    this.schedulingNeighborhoodsSelect = Object.values(items);
  }

  loadSchedulingNeighborhood(neighborhood) {
    this.schedulingNeighborhoods = neighborhood;
    this.showCards = true;
    this.isShowSelect = false;

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

}

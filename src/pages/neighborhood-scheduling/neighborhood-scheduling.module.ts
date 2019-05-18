import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { NeighborhoodSchedulingPage } from './neighborhood-scheduling.page';

const routes: Routes = [
  {
    path: '',
    component: NeighborhoodSchedulingPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [NeighborhoodSchedulingPage]
})
export class NeighborhoodSchedulingPageModule {}

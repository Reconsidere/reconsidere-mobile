import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { SchedulingPage } from './scheduling.page';
import { StepsPipe } from 'src/app/pipes/steps.pipe';


const routes: Routes = [
  {
    path: '',
    component: SchedulingPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),

  ],
  declarations: [SchedulingPage, StepsPipe],

})
export class SchedulingPageModule { }

import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/guards/auth.guard';

const routes: Routes = [
  { path: 'signup', loadChildren: '../pages/signup/signup.module#SignupPageModule' },
  {
    path: 'login',
    loadChildren: '../pages/login/login.module#LoginPageModule',
  },
  {
    path: '',
    loadChildren: '../pages/home/home.module#HomePageModule', canActivate: [AuthGuard]
  },
  {
    path: 'home',
    loadChildren: '../pages/home/home.module#HomePageModule', canActivate: [AuthGuard]
  },
  { path: 'logout', loadChildren: '../pages/logout/logout.module#LogoutPageModule' },
  { path: 'scheduling', loadChildren: '../pages/scheduling/scheduling.module#SchedulingPageModule', canActivate: [AuthGuard] },
  { path: 'neighborhood-scheduling', loadChildren: '../pages/neighborhood/neighborhood-scheduling.module#NeighborhoodSchedulingComponentPageModule', canActivate: [AuthGuard] }


];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }

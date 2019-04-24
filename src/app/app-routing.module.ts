import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/guards/auth.guard';

const routes: Routes = [
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
  { path: 'signup', loadChildren: '../pages/signup/signup.module#SignupPageModule' },
  { path: 'logout', loadChildren: './logout/logout.module#LogoutPageModule' }

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}

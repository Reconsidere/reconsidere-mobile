import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from 'src/providers/auth.service';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
    constructor(
        private router: Router,
        private authenticationService: AuthService
    ) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        if (!environment.auth) {
            return true;
        }

        const currentToken = this.authenticationService.currenTokenValue;
        if (!currentToken) {
            this.sendLogin(state);
            return false;
        }

        const authenticated = this.authenticationService.isAuthenticated();
        if (!authenticated) {
            this.sendLogin(state);
            return false;
        }

        return true;
    }

    sendLogin(state) {
        this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
    }
}
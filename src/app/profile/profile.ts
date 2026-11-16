import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';

import { AuthService } from '../auth/auth.service';
import { AddressListComponent } from './address-list';

@Component({
  selector: 'app-profile',
  imports: [RouterLink, AddressListComponent, TranslatePipe],
  templateUrl: './profile.html',
})
export class ProfileComponent {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  readonly user = this.auth.currentUser;

  logout(): void {
    this.auth.logout();
    void this.router.navigateByUrl('/login');
  }
}

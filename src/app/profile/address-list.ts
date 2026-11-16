import { Component, inject, signal } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

import { TokenLabelPipe } from '../i18n/localize';
import { AddressFormComponent } from './address-form';
import { Address, AddressService } from './address.service';

@Component({
  selector: 'app-address-list',
  imports: [AddressFormComponent, TranslatePipe, TokenLabelPipe],
  templateUrl: './address-list.html',
})
export class AddressListComponent {
  private readonly addressesApi = inject(AddressService);

  readonly addresses = this.addressesApi.addresses;
  readonly editing = signal<Address | null>(null);
  readonly formOpen = signal(false);

  startAdd(): void {
    this.editing.set(null);
    this.formOpen.set(true);
  }

  startEdit(address: Address): void {
    this.editing.set(address);
    this.formOpen.set(true);
  }

  closeForm(): void {
    this.formOpen.set(false);
    this.editing.set(null);
  }

  remove(address: Address): void {
    this.addressesApi.remove(address.id);
    if (this.editing()?.id === address.id) {
      this.closeForm();
    }
  }
}

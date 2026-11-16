import { DecimalPipe } from '@angular/common';
import { Component, computed, effect, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';

import { CartService } from '../../cart/cart.service';
import { ProductLabelPipe, TokenLabelPipe } from '../../i18n/localize';
import { AddressFormComponent } from '../../profile/address-form';
import { AddressService } from '../../profile/address.service';

type PaymentMethod = 'cod' | 'card';

@Component({
  selector: 'app-checkout',
  imports: [DecimalPipe, RouterLink, AddressFormComponent, TranslatePipe, ProductLabelPipe, TokenLabelPipe],
  templateUrl: './checkout.html',
})
export class CheckoutComponent {
  private readonly cart = inject(CartService);
  private readonly addressBook = inject(AddressService);
  private readonly router = inject(Router);

  readonly items = this.cart.items;
  readonly summary = this.cart.summary;
  readonly addresses = this.addressBook.addresses;

  readonly selectedAddressId = signal<string | null>(null);
  readonly addingAddress = signal(false);
  readonly payment = signal<PaymentMethod>('cod');

  readonly selectedAddress = computed(() =>
    this.addresses().find((address) => address.id === this.selectedAddressId()) ?? null,
  );

  constructor() {
    effect(() => {
      const list = this.addresses();
      const current = this.selectedAddressId();
      if (!current || !list.some((address) => address.id === current)) {
        this.selectedAddressId.set(list[0]?.id ?? null);
      }
    });
  }

  selectAddress(id: string): void {
    this.selectedAddressId.set(id);
  }

  showAddressForm(): void {
    this.addingAddress.set(true);
  }

  addressSaved(): void {
    const newest = this.addresses().at(-1);
    if (newest) {
      this.selectedAddressId.set(newest.id);
    }
    this.addingAddress.set(false);
  }

  setPayment(method: PaymentMethod): void {
    this.payment.set(method);
  }

  placeOrder(): void {
    if (!this.selectedAddress() || this.items().length === 0) {
      return;
    }
    const orderId = `YOW-${1000 + Math.floor(Math.random() * 9000)}`;
    this.cart.clear();
    void this.router.navigate(['/order', orderId]);
  }
}

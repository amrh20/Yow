import { DecimalPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';

import { CartService } from '../../cart/cart.service';
import { ProductLabelPipe, TokenLabelPipe } from '../../i18n/localize';

@Component({
  selector: 'app-cart-page',
  imports: [DecimalPipe, RouterLink, TranslatePipe, ProductLabelPipe, TokenLabelPipe],
  templateUrl: './cart.html',
  styleUrl: './cart.scss',
})
export class CartPageComponent {
  private readonly cart = inject(CartService);

  readonly items = this.cart.items;
  readonly summary = this.cart.summary;

  increase(key: string, quantity: number): void {
    this.cart.setQuantity(key, quantity + 1);
  }

  decrease(key: string, quantity: number): void {
    this.cart.setQuantity(key, quantity - 1);
  }

  remove(key: string): void {
    this.cart.remove(key);
  }
}

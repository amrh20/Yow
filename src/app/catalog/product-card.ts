import { DecimalPipe } from '@angular/common';
import { Component, inject, input, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';

import { CartService } from '../cart/cart.service';
import { ProductLabelPipe } from '../i18n/localize';
import { Product } from './catalog.service';

@Component({
  selector: 'app-product-card',
  imports: [DecimalPipe, RouterLink, TranslatePipe, ProductLabelPipe],
  templateUrl: './product-card.html',
})
export class ProductCardComponent {
  private readonly cart = inject(CartService);

  readonly product = input.required<Product>();
  readonly added = signal(false);

  addToCart(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    const product = this.product();
    const variant = product.options.map((option) => option.values[0]).join(' / ') || 'One size';
    this.cart.add({
      productId: product.id,
      name: product.name,
      image: product.image,
      price: product.price,
      variant,
    });
    this.added.set(true);
  }
}

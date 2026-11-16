import { DecimalPipe } from '@angular/common';
import { Component, computed, effect, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { map } from 'rxjs';

import { CartService } from '../../cart/cart.service';
import { CatalogService, Product, ProductVariant } from '../../catalog/catalog.service';
import { ProductLabelPipe, TokenLabelPipe } from '../../i18n/localize';

const COLOR_SWATCHES: Record<string, string> = {
  Black: '#111111',
  Navy: '#1c2b4a',
  Ivory: '#f3eee6',
  Sand: '#cbb994',
};

@Component({
  selector: 'app-product-details',
  imports: [DecimalPipe, RouterLink, TranslatePipe, ProductLabelPipe, TokenLabelPipe],
  templateUrl: './product-details.html',
})
export class ProductDetailsComponent {
  private readonly catalog = inject(CatalogService);
  private readonly cart = inject(CartService);
  private readonly route = inject(ActivatedRoute);

  readonly swatches = COLOR_SWATCHES;
  readonly activeIndex = signal(0);
  readonly quantity = signal(1);
  readonly selected = signal<Record<string, string>>({});
  readonly selectedVariant = signal<ProductVariant | null>(null);
  readonly added = signal(false);

  private readonly productId = toSignal(
    this.route.paramMap.pipe(map((params) => params.get('id'))),
    { initialValue: this.route.snapshot.paramMap.get('id') },
  );

  readonly product = computed(() => {
    const id = this.productId();
    return id ? this.catalog.productById(id) : undefined;
  });

  readonly displayOptions = computed(() => {
    const product = this.product();
    if (!product) {
      return [];
    }
    const variantNames = new Set(product.variants.map((variant) => variant.name));
    return product.options.filter((option) => !option.values.every((value) => variantNames.has(value)));
  });

  readonly activeImage = computed(() => {
    const product = this.product();
    if (!product) {
      return '';
    }
    return product.images[this.activeIndex()] ?? product.images[0];
  });

  constructor() {
    effect(() => {
      const product = this.product();
      this.activeIndex.set(0);
      this.quantity.set(1);
      this.added.set(false);
      this.selected.set(this.defaultSelection(product));
      this.selectedVariant.set(product?.variants[0] ?? null);
    });
  }

  selectVariant(variant: ProductVariant): void {
    this.selectedVariant.set(variant);
    this.added.set(false);
  }

  selectImage(index: number): void {
    const product = this.product();
    if (!product || index < 0 || index >= product.images.length) {
      return;
    }
    this.activeIndex.set(index);
  }

  selectOption(name: string, value: string): void {
    this.selected.update((current) => ({ ...current, [name]: value }));
    this.added.set(false);
  }

  increase(): void {
    this.quantity.update((value) => value + 1);
  }

  decrease(): void {
    this.quantity.update((value) => Math.max(1, value - 1));
  }

  addToCart(): void {
    const product = this.product();
    if (!product) {
      return;
    }
    const chosen = this.selectedVariant();
    const extras = this.displayOptions()
      .map((option) => this.selected()[option.name])
      .filter(Boolean);
    const variant = [chosen?.name, ...extras].filter((value) => value && value !== 'Standard').join(' / ');
    this.cart.add({
      productId: product.id,
      name: product.name,
      image: product.images[0],
      price: chosen?.price ?? product.price,
      quantity: this.quantity(),
      variant: variant || 'One size',
    });
    this.added.set(true);
  }

  private defaultSelection(product: Product | undefined): Record<string, string> {
    if (!product) {
      return {};
    }
    return Object.fromEntries(product.options.map((option) => [option.name, option.values[0]]));
  }
}

import { Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { map } from 'rxjs';

import { CatalogService, Product } from '../../catalog/catalog.service';
import { ProductCardComponent } from '../../catalog/product-card';
import { CategoryLabelPipe } from '../../i18n/localize';

type SortKey = 'featured' | 'price-asc' | 'price-desc';

@Component({
  selector: 'app-category-view',
  imports: [RouterLink, ProductCardComponent, TranslatePipe, CategoryLabelPipe],
  templateUrl: './category-view.html',
})
export class CategoryViewComponent {
  private readonly catalog = inject(CatalogService);
  private readonly route = inject(ActivatedRoute);

  readonly categories = this.catalog.categories;
  readonly sort = signal<SortKey>('featured');
  readonly saleOnly = signal(false);

  private readonly slug = toSignal(
    this.route.paramMap.pipe(map((params) => params.get('slug'))),
    { initialValue: this.route.snapshot.paramMap.get('slug') },
  );

  readonly category = computed(() => {
    const slug = this.slug();
    return slug ? this.catalog.categoryBySlug(slug) : undefined;
  });

  readonly products = computed(() => {
    const slug = this.slug();
    let items = this.catalog.productsFor(slug && this.catalog.categoryBySlug(slug) ? slug : null);
    if (slug && !this.catalog.categoryBySlug(slug)) {
      items = [];
    }
    if (this.saleOnly()) {
      items = items.filter((product) => product.compareAt !== null);
    }
    return this.sortProducts(items, this.sort());
  });

  readonly missing = computed(() => {
    const slug = this.slug();
    return !!slug && !this.catalog.categoryBySlug(slug);
  });

  setSort(value: string): void {
    if (value === 'price-asc' || value === 'price-desc' || value === 'featured') {
      this.sort.set(value);
    }
  }

  toggleSale(checked: boolean): void {
    this.saleOnly.set(checked);
  }

  private sortProducts(items: Product[], sort: SortKey): Product[] {
    const copy = [...items];
    if (sort === 'price-asc') {
      copy.sort((a, b) => a.price - b.price);
    } else if (sort === 'price-desc') {
      copy.sort((a, b) => b.price - a.price);
    }
    return copy;
  }
}

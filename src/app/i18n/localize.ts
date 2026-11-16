import { inject, Pipe } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import { CatalogService } from '../catalog/catalog.service';

const AR: Record<string, string> = {
  Black: 'أسود',
  Navy: 'كحلي',
  Ivory: 'عاجي',
  Sand: 'رملي',
  Small: 'صغير',
  Large: 'كبير',
  Standard: 'قياسي',
  Size: 'المقاس',
  Color: 'اللون',
  'One size': 'مقاس واحد',
  Home: 'المنزل',
  Work: 'العمل',
};

@Pipe({ name: 'productLabel', pure: false })
export class ProductLabelPipe {
  private readonly catalog = inject(CatalogService);
  private readonly translate = inject(TranslateService);

  transform(fallback: string, productId: string, field: 'name' | 'description' = 'name'): string {
    const product = this.catalog.productById(productId);
    if (!product) {
      return fallback;
    }
    if (this.translate.getCurrentLang() === 'ar') {
      return field === 'description' ? product.descriptionAr : product.nameAr;
    }
    return field === 'description' ? product.description : product.name;
  }
}

@Pipe({ name: 'categoryLabel', pure: false })
export class CategoryLabelPipe {
  private readonly translate = inject(TranslateService);

  transform(name: string, nameAr: string): string {
    return this.translate.getCurrentLang() === 'ar' ? nameAr : name;
  }
}

@Pipe({ name: 'tokenLabel', pure: false })
export class TokenLabelPipe {
  private readonly translate = inject(TranslateService);

  transform(value: string): string {
    if (this.translate.getCurrentLang() !== 'ar' || !value) {
      return value;
    }
    return value
      .split(' / ')
      .map((part) => AR[part] ?? part)
      .join(' / ');
  }
}

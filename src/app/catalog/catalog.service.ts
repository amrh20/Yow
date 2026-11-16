import { Injectable } from '@angular/core';

export interface Category {
  slug: string;
  name: string;
  nameAr: string;
  image: string;
}

export interface ProductOption {
  name: string;
  values: string[];
}

export interface ProductVariant {
  id: string;
  name: string;
  price: number;
  compareAtPrice: number | null;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  compareAt: number | null;
  image: string;
  images: string[];
  description: string;
  nameAr: string;
  descriptionAr: string;
  options: ProductOption[];
  variants: ProductVariant[];
}

@Injectable({ providedIn: 'root' })
export class CatalogService {
  readonly categories: Category[] = [
    { slug: 'apparel', name: 'Apparel', nameAr: 'ملابس', image: 'https://picsum.photos/seed/yow-apparel/900/1100' },
    { slug: 'home', name: 'Home', nameAr: 'المنزل', image: 'https://picsum.photos/seed/yow-home/900/1100' },
    { slug: 'footwear', name: 'Footwear', nameAr: 'أحذية', image: 'https://picsum.photos/seed/yow-footwear/900/1100' },
    { slug: 'beauty', name: 'Beauty', nameAr: 'تجميل', image: 'https://picsum.photos/seed/yow-beauty/900/1100' },
    { slug: 'accessories', name: 'Accessories', nameAr: 'إكسسوارات', image: 'https://picsum.photos/seed/yow-accessories/900/1100' },
    { slug: 'living', name: 'Living', nameAr: 'المعيشة', image: 'https://picsum.photos/seed/yow-living/900/1100' },
  ];

  readonly products: Product[] = [
    this.product('1', 'Wool overcoat', 'معطف صوف', 'apparel', 2400, 3100, 'coat', 'A heavy wool coat with a clean shoulder and a hidden button placket.', 'معطف صوف ثقيل بكتف نظيف وأزرار مخفية.', [
      { name: 'Size', values: ['S', 'M', 'L'] },
      { name: 'Color', values: ['Black', 'Navy', 'Ivory'] },
    ]),
    this.product('2', 'Cotton shirt', 'قميص قطن', 'apparel', 680, null, 'shirt', 'Washed cotton with a soft collar and a straight hem.', 'قطن مغسول بياقة ناعمة وحافة مستقيمة.', [
      { name: 'Size', values: ['S', 'M', 'L'] },
      { name: 'Color', values: ['Ivory', 'Sand'] },
    ]),
    this.product('3', 'Tailored trousers', 'بنطلون مفصل', 'apparel', 920, 1100, 'trousers', 'A straight leg with a pressed crease and side pockets.', 'قصة مستقيمة بكسر مضغوط وجيوب جانبية.', [
      { name: 'Size', values: ['S', 'M', 'L'] },
      { name: 'Color', values: ['Black', 'Sand'] },
    ]),
    this.product('4', 'Linen throw', 'غطاء كتان', 'home', 540, null, 'throw', 'Stonewashed linen, light enough for a sofa or a bed.', 'كتان مغسول بالحجر، خفيف للأريكة أو السرير.'),
    this.product('5', 'Ceramic vase', 'فازة خزف', 'home', 320, 420, 'vase', 'A hand-thrown vase with a matte glaze.', 'فازة مشكلة يدوياً بطلاء مطفي.'),
    this.product('6', 'Oak side table', 'طاولة جانبية من البلوط', 'home', 1850, null, 'table', 'Solid oak with a slim top and tapered legs.', 'بلوط صلب بسطح نحيف وأرجل مستدقة.'),
    this.product('7', 'Leather sneakers', 'سنيكرز جلد', 'footwear', 1450, 1750, 'sneakers', 'Soft leather with a cup sole and a padded collar.', 'جلد ناعم بنعل مقعر وياقة مبطنة.', [
      { name: 'Size', values: ['40', '41', '42', '43'] },
      { name: 'Color', values: ['Ivory', 'Black'] },
    ]),
    this.product('8', 'Suede loafers', 'لوفر سويد', 'footwear', 1600, null, 'loafers', 'Unlined suede with a low heel.', 'سويد بدون بطانة بكعب منخفض.', [
      { name: 'Size', values: ['40', '41', '42', '43'] },
      { name: 'Color', values: ['Sand', 'Navy'] },
    ]),
    this.product('9', 'Daily serum', 'سيروم يومي', 'beauty', 390, 480, 'serum', 'A light serum for everyday use.', 'سيروم خفيف للاستخدام اليومي.'),
    this.product('10', 'Soft balm', 'بلسم ناعم', 'beauty', 150, null, 'balm', 'A small tin of unscented balm.', 'علبة صغيرة من بلسم بدون عطر.', [
      { name: 'Size', values: ['Small', 'Large'] },
    ], 30),
    this.product('11', 'Slim leather belt', 'حزام جلد رفيع', 'accessories', 450, null, 'belt', 'Full-grain leather with a plain buckle.', 'جلد كامل الحبة بإبزيم بسيط.', [
      { name: 'Size', values: ['S', 'M', 'L'] },
      { name: 'Color', values: ['Black', 'Sand'] },
    ]),
    this.product('12', 'Steel watch', 'ساعة فولاذ', 'accessories', 2200, 2600, 'watch', 'A slim steel case with a clean dial.', 'علبة فولاذ نحيفة بقرص نظيف.', [
      { name: 'Color', values: ['Black', 'Ivory'] },
    ]),
    this.product('13', 'Floor lamp', 'مصباح أرضي', 'living', 980, 1200, 'lamp', 'A linen shade on a thin metal stem.', 'غلاف كتان على ساق معدنية رفيعة.'),
    this.product('14', 'Wool rug', 'سجادة صوف', 'living', 2750, null, 'rug', 'A flatweave wool rug in a quiet stripe.', 'سجادة صوف منسوجة بخطوط هادية.'),
  ];

  productById(id: string): Product | undefined {
    return this.products.find((product) => product.id === id);
  }

  private product(
    id: string,
    name: string,
    nameAr: string,
    category: string,
    price: number,
    compareAt: number | null,
    seed: string,
    description: string,
    descriptionAr: string,
    options: ProductOption[] = [],
    priceStep = 0,
  ): Product {
    const images = [1, 2, 3].map((frame) => `https://picsum.photos/seed/yow-${seed}-${frame}/900/1100`);
    const variants = this.variantsFor(id, price, compareAt, options, priceStep);
    return {
      id,
      name,
      nameAr,
      category,
      price,
      compareAt,
      image: images[0],
      images,
      description,
      descriptionAr,
      options,
      variants,
    };
  }

  private variantsFor(
    id: string,
    price: number,
    compareAt: number | null,
    options: ProductOption[],
    priceStep: number,
  ): ProductVariant[] {
    const source = options.find((option) => option.name === 'Size');
    if (!source) {
      return [{ id: `${id}-1`, name: 'Standard', price, compareAtPrice: compareAt }];
    }
    const step = priceStep || Math.round(price * 0.08);
    return source.values.map((name, index) => ({
      id: `${id}-${index + 1}`,
      name,
      price: price + step * index,
      compareAtPrice: compareAt === null ? null : compareAt + step * index,
    }));
  }

  categoryBySlug(slug: string): Category | undefined {
    return this.categories.find((category) => category.slug === slug);
  }

  productsFor(slug: string | null): Product[] {
    if (!slug) {
      return this.products;
    }
    return this.products.filter((product) => product.category === slug);
  }
}

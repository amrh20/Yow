import { inject, Injectable } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { BehaviorSubject, map } from 'rxjs';

import { ToastService } from '../ui/toast.service';

export interface CartLine {
  key: string;
  productId: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
  variant: string;
}

export interface CartSummary {
  subtotal: number;
  shipping: number;
  total: number;
  count: number;
}

const SHIPPING_FEE = 75;

@Injectable({ providedIn: 'root' })
export class CartService {
  private readonly toast = inject(ToastService);
  private readonly itemsSubject = new BehaviorSubject<CartLine[]>([]);

  readonly items$ = this.itemsSubject.asObservable();
  readonly summary$ = this.items$.pipe(map((items) => this.summarize(items)));

  readonly items = toSignal(this.items$, { initialValue: [] as CartLine[] });
  readonly summary = toSignal(this.summary$, {
    initialValue: this.summarize([]),
  });
  readonly count = toSignal(this.summary$.pipe(map((summary) => summary.count)), { initialValue: 0 });

  add(line: Omit<CartLine, 'key' | 'quantity'> & { quantity?: number }): void {
    const key = `${line.productId}|${line.variant}`;
    const quantity = line.quantity ?? 1;
    const current = this.itemsSubject.value;
    const existing = current.find((item) => item.key === key);
    if (existing) {
      this.itemsSubject.next(
        current.map((item) => (item.key === key ? { ...item, quantity: item.quantity + quantity } : item)),
      );
    } else {
      this.itemsSubject.next([...current, { ...line, key, quantity }]);
    }
    this.toast.show({ productId: line.productId, name: line.name, image: line.image });
  }

  setQuantity(key: string, quantity: number): void {
    if (quantity < 1) {
      this.remove(key);
      return;
    }
    this.itemsSubject.next(
      this.itemsSubject.value.map((item) => (item.key === key ? { ...item, quantity } : item)),
    );
  }

  remove(key: string): void {
    this.itemsSubject.next(this.itemsSubject.value.filter((item) => item.key !== key));
  }

  clear(): void {
    this.itemsSubject.next([]);
  }

  private summarize(items: CartLine[]): CartSummary {
    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const count = items.reduce((sum, item) => sum + item.quantity, 0);
    const shipping = subtotal === 0 || subtotal >= 2000 ? 0 : SHIPPING_FEE;
    return { subtotal, shipping, total: subtotal + shipping, count };
  }
}

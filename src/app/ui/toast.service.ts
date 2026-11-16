import { Injectable, signal } from '@angular/core';

export interface ToastMessage {
  id: number;
  productId: string;
  name: string;
  image: string;
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  private nextId = 0;
  readonly toasts = signal<ToastMessage[]>([]);

  show(message: Omit<ToastMessage, 'id'>): void {
    const toast: ToastMessage = { ...message, id: ++this.nextId };
    this.toasts.update((current) => [...current, toast]);
    setTimeout(() => this.dismiss(toast.id), 3200);
  }

  dismiss(id: number): void {
    this.toasts.update((current) => current.filter((toast) => toast.id !== id));
  }
}

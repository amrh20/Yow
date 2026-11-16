import { Injectable, signal } from '@angular/core';

export interface Address {
  id: string;
  title: string;
  street: string;
  building: string;
  floor: string;
  city: string;
}

export type AddressDraft = Omit<Address, 'id'>;

@Injectable({ providedIn: 'root' })
export class AddressService {
  private readonly items = signal<Address[]>([
    {
      id: 'home',
      title: 'Home',
      street: 'Nile Street',
      building: '12',
      floor: '3',
      city: 'Cairo',
    },
  ]);

  readonly addresses = this.items.asReadonly();

  add(draft: AddressDraft): Address {
    const address: Address = { ...draft, id: crypto.randomUUID() };
    this.items.update((list) => [...list, address]);
    return address;
  }

  update(id: string, draft: AddressDraft): void {
    this.items.update((list) => list.map((item) => (item.id === id ? { ...item, ...draft } : item)));
  }

  remove(id: string): void {
    this.items.update((list) => list.filter((item) => item.id !== id));
  }
}

import { Component, effect, inject, input, output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';

import { Address, AddressService } from './address.service';

@Component({
  selector: 'app-address-form',
  imports: [ReactiveFormsModule, TranslatePipe],
  templateUrl: './address-form.html',
})
export class AddressFormComponent {
  private readonly addresses = inject(AddressService);
  private readonly fb = inject(FormBuilder);

  readonly address = input<Address | null>(null);
  readonly saved = output<void>();
  readonly cancelled = output<void>();

  readonly form = this.fb.nonNullable.group({
    title: ['', Validators.required],
    street: ['', Validators.required],
    building: ['', Validators.required],
    floor: ['', Validators.required],
    city: ['', Validators.required],
  });

  constructor() {
    effect(() => {
      const current = this.address();
      this.form.reset(
        current ?? { title: '', street: '', building: '', floor: '', city: '' },
      );
    });
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const draft = this.form.getRawValue();
    const current = this.address();
    if (current) {
      this.addresses.update(current.id, draft);
    } else {
      this.addresses.add(draft);
    }
    this.saved.emit();
  }
}

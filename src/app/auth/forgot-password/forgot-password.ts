import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';

import { AuthService } from '../auth.service';

@Component({
  selector: 'app-forgot-password',
  imports: [ReactiveFormsModule, RouterLink, TranslatePipe],
  templateUrl: './forgot-password.html',
})
export class ForgotPasswordComponent {
  private readonly auth = inject(AuthService);
  private readonly fb = inject(FormBuilder);

  readonly sent = signal(false);
  readonly unknown = signal(false);

  readonly form = this.fb.nonNullable.group({
    mobile: ['', [Validators.required, Validators.pattern(/^[0-9+\s-]{8,}$/)]],
  });

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const mobile = this.form.getRawValue().mobile;
    const known = this.auth.requestReset(mobile);
    this.sent.set(known);
    this.unknown.set(!known);
  }
}

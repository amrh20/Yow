import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';

import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterLink, TranslatePipe],
  templateUrl: './login.html',
})
export class LoginComponent {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);

  readonly error = signal('');

  readonly form = this.fb.nonNullable.group({
    mobile: ['', [Validators.required, Validators.pattern(/^[0-9+\s-]{8,}$/)]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const { mobile, password } = this.form.getRawValue();
    const user = this.auth.login(mobile, password);
    if (!user) {
      this.error.set('AUTH.BAD_CREDENTIALS');
      return;
    }
    this.error.set('');
    void this.router.navigateByUrl('/profile');
  }
}

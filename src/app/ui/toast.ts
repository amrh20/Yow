import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';

import { ProductLabelPipe } from '../i18n/localize';
import { ToastService } from './toast.service';

@Component({
  selector: 'app-toast',
  imports: [RouterLink, TranslatePipe, ProductLabelPipe],
  templateUrl: './toast.html',
})
export class ToastComponent {
  private readonly toast = inject(ToastService);

  readonly toasts = this.toast.toasts;

  dismiss(id: number): void {
    this.toast.dismiss(id);
  }
}

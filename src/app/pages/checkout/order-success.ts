import { Component, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { map } from 'rxjs';

@Component({
  selector: 'app-order-success',
  imports: [RouterLink, TranslatePipe],
  templateUrl: './order-success.html',
})
export class OrderSuccessComponent {
  private readonly route = inject(ActivatedRoute);

  readonly tracking = signal(false);

  readonly orderId = toSignal(
    this.route.paramMap.pipe(map((params) => params.get('id') ?? '')),
    { initialValue: this.route.snapshot.paramMap.get('id') ?? '' },
  );

  trackOrder(): void {
    this.tracking.set(true);
  }
}

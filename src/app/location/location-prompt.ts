import { Component, inject } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

import { LocationService } from './location.service';

@Component({
  selector: 'app-location-prompt',
  imports: [TranslatePipe],
  templateUrl: './location-prompt.html',
})
export class LocationPromptComponent {
  private readonly location = inject(LocationService);

  allow(): void {
    this.location.askForLocation();
  }

  dismiss(): void {
    this.location.dismissPrompt();
  }
}

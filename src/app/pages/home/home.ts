import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';

import { CatalogService } from '../../catalog/catalog.service';
import { CategoryLabelPipe } from '../../i18n/localize';

@Component({
  selector: 'app-home',
  imports: [RouterLink, TranslatePipe, CategoryLabelPipe],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class HomeComponent {
  private readonly catalog = inject(CatalogService);

  readonly categories = this.catalog.categories;
}

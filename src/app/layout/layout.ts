import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';

import { AuthService } from '../auth/auth.service';
import { CartService } from '../cart/cart.service';
import { LocationPromptComponent } from '../location/location-prompt';
import { LocationService } from '../location/location.service';
import { ToastComponent } from '../ui/toast';

@Component({
  selector: 'app-layout',
  imports: [RouterLink, RouterLinkActive, RouterOutlet, TranslatePipe, ToastComponent, LocationPromptComponent],
  templateUrl: './layout.html',
  styleUrl: './layout.scss',
})
export class LayoutComponent implements OnInit {
  private readonly translate = inject(TranslateService);
  private readonly auth = inject(AuthService);
  private readonly cart = inject(CartService);
  private readonly location = inject(LocationService);

  readonly currentUser = this.auth.currentUser;

  readonly currentLang = signal('en');
  readonly menuOpen = signal(false);
  readonly searchOpen = signal(false);
  readonly searchQuery = signal('');
  readonly cartCount = this.cart.count;
  readonly showLocationPrompt = this.location.showPrompt;
  readonly deliveryAddress = this.location.location;
  readonly year = new Date().getFullYear();

  readonly nav = [
    { path: '/', labelKey: 'NAV.HOME', exact: true },
    { path: '/shop', labelKey: 'NAV.CATEGORIES', exact: false },
  ] as const;

  constructor() {
    this.translate.setFallbackLang('en');
    const saved = localStorage.getItem('yow-lang');
    this.changeLanguage(saved === 'ar' ? 'ar' : 'en');
  }

  ngOnInit(): void {
    this.location.ensureRestored();
  }

  changeLanguage(lang: string): void {
    this.translate.use(lang);
    this.currentLang.set(lang);
    localStorage.setItem('yow-lang', lang);
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  }

  toggleLanguage(): void {
    this.changeLanguage(this.currentLang() === 'ar' ? 'en' : 'ar');
  }

  toggleMenu(): void {
    this.menuOpen.update((open) => !open);
  }

  closeMenu(): void {
    this.menuOpen.set(false);
  }

  toggleSearch(): void {
    this.searchOpen.update((open) => !open);
  }

  onSearchInput(value: string): void {
    this.searchQuery.set(value);
  }
}

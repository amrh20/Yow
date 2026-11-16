import { Injectable, signal } from '@angular/core';

export interface AuthUser {
  fullName: string;
  mobile: string;
}

interface StoredAccount extends AuthUser {
  password: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly account = signal<StoredAccount | null>(null);
  private readonly session = signal<AuthUser | null>(null);

  readonly currentUser = this.session.asReadonly();

  register(fullName: string, mobile: string, password: string): AuthUser {
    const user: AuthUser = { fullName: fullName.trim(), mobile: mobile.trim() };
    this.account.set({ ...user, password });
    this.session.set(user);
    return user;
  }

  login(mobile: string, password: string): AuthUser | null {
    const account = this.account();
    if (!account || account.mobile !== mobile.trim() || account.password !== password) {
      return null;
    }
    const user: AuthUser = { fullName: account.fullName, mobile: account.mobile };
    this.session.set(user);
    return user;
  }

  requestReset(mobile: string): boolean {
    const account = this.account();
    return !!account && account.mobile === mobile.trim();
  }

  logout(): void {
    this.session.set(null);
  }
}

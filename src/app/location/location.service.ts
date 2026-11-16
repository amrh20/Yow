import { Injectable } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { BehaviorSubject, map } from 'rxjs';

import { environment } from '../../environments/environment';

export interface UserLocation {
  lat: number;
  lng: number;
  addressString: string;
}

export type LocationPermission = 'unknown' | 'granted' | 'denied' | 'dismissed';

interface LocationState {
  location: UserLocation | null;
  permission: LocationPermission;
}

const LOCATION_KEY = 'yow-location';
const DISMISS_KEY = 'yow-location-dismissed';

@Injectable({ providedIn: 'root' })
export class LocationService {
  private readonly stateSubject = new BehaviorSubject<LocationState>({
    location: null,
    permission: 'unknown',
  });

  readonly state$ = this.stateSubject.asObservable();
  readonly location = toSignal(this.state$.pipe(map((state) => state.location)), {
    initialValue: null as UserLocation | null,
  });
  readonly permission = toSignal(this.state$.pipe(map((state) => state.permission)), {
    initialValue: 'unknown' as LocationPermission,
  });
  readonly showPrompt = toSignal(
    this.state$.pipe(map((state) => state.permission === 'unknown' && state.location === null)),
    { initialValue: false },
  );

  constructor() {
    this.restore();
  }

  /** Re-reads storage. Safe to call from the layout after the service has already restored. */
  ensureRestored(): void {
    if (this.stateSubject.value.permission === 'unknown' && this.stateSubject.value.location === null) {
      this.restore();
    }
  }

  askForLocation(): void {
    if (!navigator.geolocation) {
      this.patch({ permission: 'denied' });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        void this.applyPosition(position.coords.latitude, position.coords.longitude);
      },
      () => this.patch({ permission: 'denied' }),
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 },
    );
  }

  async reverseGeocode(lat: number, lng: number): Promise<string> {
    const key = environment.mapsApiKey;
    if (key && key !== 'YOUR_API_KEY_HERE') {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${encodeURIComponent(key)}`,
      );
      const data = (await response.json()) as {
        results?: { formatted_address?: string }[];
      };
      return data.results?.[0]?.formatted_address ?? '';
    }

    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`,
      { headers: { Accept: 'application/json' } },
    );
    const data = (await response.json()) as {
      display_name?: string;
      address?: { suburb?: string; neighbourhood?: string; city?: string; town?: string };
    };
    const address = data.address;
    return (
      address?.neighbourhood ||
      address?.suburb ||
      address?.city ||
      address?.town ||
      data.display_name ||
      ''
    );
  }

  saveLocationToStorage(): void {
    const location = this.stateSubject.value.location;
    if (!location) {
      return;
    }
    localStorage.setItem(LOCATION_KEY, JSON.stringify(location));
    localStorage.removeItem(DISMISS_KEY);
  }

  dismissPrompt(): void {
    localStorage.setItem(DISMISS_KEY, '1');
    this.patch({ permission: 'dismissed' });
  }

  private async applyPosition(lat: number, lng: number): Promise<void> {
    let addressString = '';
    try {
      addressString = await this.reverseGeocode(lat, lng);
    } catch {
      addressString = '';
    }
    this.patch({
      location: { lat, lng, addressString },
      permission: 'granted',
    });
    this.saveLocationToStorage();
  }

  private restore(): void {
    const saved = localStorage.getItem(LOCATION_KEY);
    if (saved) {
      try {
        const location = JSON.parse(saved) as UserLocation;
        if (typeof location.lat === 'number' && typeof location.lng === 'number') {
          this.patch({ location, permission: 'granted' });
          return;
        }
      } catch {
        localStorage.removeItem(LOCATION_KEY);
      }
    }
    if (localStorage.getItem(DISMISS_KEY) === '1') {
      this.patch({ permission: 'dismissed' });
    }
  }

  private patch(partial: Partial<LocationState>): void {
    this.stateSubject.next({ ...this.stateSubject.value, ...partial });
  }
}

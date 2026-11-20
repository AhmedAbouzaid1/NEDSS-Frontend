import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, shareReplay, tap } from 'rxjs/operators';

const LOOKUP_CACHE_TTL_MS = 10 * 60 * 1000;

const LOOKUP_CONTROLLERS = /\/(Government|HealthAdministration|IncidentSourceHospital|Disease|DiseaseGroup|Nationality|Department)\//i;

const LOOKUP_READ_ACTION = /^(Get|Search|Find|Check|Validate|Export|Download|Preview)/i;

@Injectable({ providedIn: 'root' })
export class LookupCacheService {
  private readonly entries = new Map<string, { expires: number; data$: Observable<any> }>();

  get<T>(key: string, load: () => Observable<T>): Observable<T> {
    const scopedKey = `${this.userKey()}|${key}`;
    const now = Date.now();
    let entry = this.entries.get(scopedKey);
    if (!entry || entry.expires < now) {
      const data$ = load().pipe(
        tap({ error: () => this.entries.delete(scopedKey) }),
        shareReplay({ bufferSize: 1, refCount: false })
      );
      entry = { expires: now + LOOKUP_CACHE_TTL_MS, data$ };
      this.entries.set(scopedKey, entry);
    }
    return entry.data$.pipe(map((value) => this.copy(value)));
  }

  clear(): void {
    this.entries.clear();
  }

  isLookupWrite(method: string, url: string): boolean {
    if (method === 'GET' || !LOOKUP_CONTROLLERS.test(url)) {
      return false;
    }
    const action = url.split('?')[0].split('/').filter(Boolean).pop() ?? '';
    return !LOOKUP_READ_ACTION.test(action);
  }

  private copy<T>(value: T): T {
    return value == null ? value : JSON.parse(JSON.stringify(value));
  }

  private userKey(): string {
    try {
      return `${JSON.parse(localStorage.getItem('ls.authorizationData'))?.userId ?? 'anon'}`;
    } catch {
      return 'anon';
    }
  }
}
